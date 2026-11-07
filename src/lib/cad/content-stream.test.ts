import assert from 'node:assert/strict'
import { applyEdits, planTextRemoval, scanTextOps, tokenize, type PlacedItem } from './content-stream.ts'

const near = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) <= eps

// Tokenizer: strings with nested parens and escapes, hex, names, arrays, comments, inline images.
{
    const src = '% comment BT\n/F1 9 Tf (a (b) \\) BT) Tj <4142> Tj [(x) -20 (y)] TJ BI /W 1 /H 1 ID \x00BT\xff EI Q'
    const toks = [...tokenize(src)].map((t) => t.kind + ':' + t.text)
    assert.ok(!toks.includes('op:BT'), 'BT inside comment/string/inline image is not an operator')
    assert.ok(toks.includes('str:(a (b) \\) BT)'))
    assert.ok(toks.includes('hex:<4142>'))
    assert.ok(toks.includes('op:TJ'))
    assert.equal(toks[toks.length - 1], 'op:Q')
}

// Positions follow the CTM (cm inside q/Q) and the text matrix (Tm, Td, TD, T*).
{
    const src = [
        '0.5 0 0 0.5 10 20 cm',
        'q 2 0 0 2 0 0 cm BT /F1 10 Tf 1 0 0 1 100 200 Tm (A) Tj ET Q',
        'BT /F1 10 Tf 1 0 0 1 100 200 Tm (B) Tj 5 -12 Td (C) Tj (D) Tj 14 TL T* (E) Tj (F) \' ET',
        'BT /F1 8 Tf 0 1 -1 0 300 50 Tm (V) Tj ET',
    ].join('\n')
    const { shows, unbalancedQ } = scanTextOps(src)
    assert.equal(unbalancedQ, 0)
    const at = (i: number) => [shows[i].pos.x, shows[i].pos.y]
    assert.deepEqual(at(0), [110, 220]) // 2×0.5 = 1 scale, then +10,+20
    assert.deepEqual(at(1), [60, 120]) // 0.5 scale
    assert.deepEqual(at(2), [62.5, 114])
    assert.equal(shows[3].known, false) // (D) continues from (C)'s advance
    assert.equal(shows[3].chain, 2)
    assert.deepEqual(at(4), [62.5, 107]) // T* with 14 TL → -14 × 0.5
    assert.equal(shows[5].op, "'")
    assert.deepEqual(at(5), [62.5, 100])
    assert.ok(near(shows[6].angle, 90) && near(shows[6].size, 4))
}

// Unbalanced q is reported so the caller can close it.
assert.equal(scanTextOps('q q 1 0 0 1 5 5 cm Q').unbalancedQ, 1)

// Removal: per-character ops of an edited label go; neighbours and other lines stay.
{
    const chars = 'A-101'.split('')
    const lines = chars.map((c, i) => `BT /F1 10 Tf 1 0 0 1 ${100 + i * 6} 500 Tm (${c}) Tj ET`)
    lines.push('BT /F1 10 Tf 1 0 0 1 100 480 Tm (KEEP) Tj ET')
    lines.push('BT /F1 10 Tf 1 0 0 1 200 500 Tm (SAME LINE) Tj ET')
    const src = lines.join('\n')
    const { shows } = scanTextOps(src)
    const items: PlacedItem[] = [
        ...chars.map((_, i) => ({ pos: { x: 100 + i * 6, y: 500 }, angle: 0, size: 10, width: 6, runKey: 'r1' })),
        { pos: { x: 100, y: 480 }, angle: 0, size: 10, width: 24, runKey: 'r2' },
        { pos: { x: 200, y: 500 }, angle: 0, size: 10, width: 50, runKey: 'r3' },
    ]
    const plan = planTextRemoval(shows, items, new Set(['r1']))
    assert.deepEqual([...plan.removedRuns], ['r1'])
    const out = applyEdits(src, plan.edits)
    for (const c of chars) assert.ok(!out.includes(`(${c}) Tj`), `${c} removed`)
    assert.ok(out.includes('(KEEP) Tj') && out.includes('(SAME LINE) Tj'))
}

// A label written as one op whose advance positions the next op: removing it would
// move its neighbour, so the label is only removed when the neighbour is edited too.
{
    const src = 'BT /F1 10 Tf 1 0 0 1 100 500 Tm (OLD) Tj ( NEIGHBOUR) Tj ET'
    const { shows } = scanTextOps(src)
    const items: PlacedItem[] = [
        { pos: { x: 100, y: 500 }, angle: 0, size: 10, width: 20, runKey: 'old' },
        { pos: { x: 125, y: 500 }, angle: 0, size: 10, width: 55, runKey: 'nb' },
    ]
    const only = planTextRemoval(shows, items, new Set(['old']))
    assert.equal(only.edits.length, 0)
    assert.equal(only.removedRuns.size, 0, 'falls back to a cover box')
    const both = planTextRemoval(shows, items, new Set(['old', 'nb']))
    assert.equal(both.edits.length, 2)
    assert.equal(both.removedRuns.size, 2)
}

// One TJ that pdf.js split into two items (a big kerning gap): the op is only
// removed when both items are edited.
{
    const src = 'BT /F1 10 Tf 1 0 0 1 100 500 Tm [(LEFT) -9000 (RIGHT)] TJ ET'
    const { shows } = scanTextOps(src)
    const items: PlacedItem[] = [
        { pos: { x: 100, y: 500 }, angle: 0, size: 10, width: 24, runKey: 'L' },
        { pos: { x: 214, y: 500 }, angle: 0, size: 10, width: 30, runKey: 'R' },
    ]
    assert.equal(planTextRemoval(shows, items, new Set(['L'])).edits.length, 0)
    assert.equal(planTextRemoval(shows, items, new Set(['L', 'R'])).edits.length, 1)
}

// ' keeps its line move when removed.
{
    const src = "BT /F1 10 Tf 12 TL 1 0 0 1 100 500 Tm (ONE) Tj (TWO) ' (THREE) ' ET"
    const { shows } = scanTextOps(src)
    const items: PlacedItem[] = [
        { pos: { x: 100, y: 500 }, angle: 0, size: 10, width: 20, runKey: 'a' },
        { pos: { x: 100, y: 488 }, angle: 0, size: 10, width: 20, runKey: 'b' },
        { pos: { x: 100, y: 476 }, angle: 0, size: 10, width: 30, runKey: 'c' },
    ]
    const plan = planTextRemoval(shows, items, new Set(['b']))
    const out = applyEdits(src, plan.edits)
    assert.ok(!out.includes('(TWO)') && out.includes('T*') && out.includes("(THREE) '"), out)
    // The third line is still at y 476 after the edit.
    const after = scanTextOps(out).shows
    assert.deepEqual([after[1].pos.x, after[1].pos.y], [100, 476])
}

// Text with no matching operator (e.g. inside a form XObject) is never "removed".
{
    const plan = planTextRemoval([], [{ pos: { x: 1, y: 1 }, angle: 0, size: 10, width: 5, runKey: 'x' }], new Set(['x']))
    assert.equal(plan.removedRuns.size, 0)
}

console.log('cad content-stream tests passed')

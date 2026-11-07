import assert from 'node:assert/strict'
import { arrowHead, cloudCmds, cmdsToSvg, markupBounds, markupPrims, stampBox, uprightAngle, type Markup } from './markup.ts'
import { calibrate, formatLength, measure, ortho, parseLength, scaleRatio, PAPER_MM_PER_PT } from './measure.ts'

const near = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) <= eps
const mt = (s: string, size: number) => s.length * size * 0.6

// Arrowhead: tip where asked, base `len` back along the shaft, symmetric.
{
    const [tip, l, r] = arrowHead({ x: 0, y: 0 }, { x: 100, y: 0 }, 10)
    assert.deepEqual(tip, { x: 100, y: 0 })
    assert.ok(near(l.x, 90) && near(r.x, 90) && near(l.y, -r.y) && Math.abs(l.y) > 2)
}

// Revision cloud: closed, every bump bulges outwards, chords of about `arc`.
{
    const cmds = cloudCmds({ x: 10, y: 10 }, { x: 110, y: 60 }, 10)
    assert.equal(cmds[0].op, 'M')
    assert.equal(cmds[cmds.length - 1].op, 'Z')
    const curves = cmds.filter((c) => c.op === 'C')
    assert.equal(curves.length, 10 + 5 + 10 + 5)
    for (const c of curves) {
        const [c1, c2, end] = c.pts
        // Control points lie outside the rectangle (outward bulge), the end point on it.
        const outside = (p: { x: number; y: number }) => p.x < 10 || p.x > 110 || p.y < 10 || p.y > 60
        assert.ok(outside(c1) && outside(c2), 'bulges outward')
        assert.ok(near(end.x, 10) || near(end.x, 110) || near(end.y, 10) || near(end.y, 60))
    }
    // Last curve ends back at the start corner.
    assert.deepEqual(curves[curves.length - 1].pts[2], { x: 10, y: 10 })
    // Drawn backwards (b above-left of a) gives the same cloud.
    assert.equal(cmdsToSvg(cloudCmds({ x: 110, y: 60 }, { x: 10, y: 10 }, 10)), cmdsToSvg(cmds))
    assert.ok(cmdsToSvg(cmds).startsWith('M 10 10 C'))
}

// Text stays upright.
assert.equal(uprightAngle(0), 0)
assert.equal(uprightAngle(180), 0)
assert.equal(uprightAngle(-90), 90)
assert.equal(uprightAngle(135), -45)
assert.equal(uprightAngle(-135), 45)

// Every markup kind produces primitives; highlights are translucent multiply fills.
const base = { id: 'm', page: 1, color: '#e11d48', width: 1.5, a: { x: 10, y: 10 }, b: { x: 80, y: 40 } }
for (const kind of ['arrow', 'cloud', 'rect', 'highlight', 'note', 'stamp', 'measure'] as const) {
    const m: Markup = { ...base, kind, text: kind === 'note' ? 'CHECK\nTHIS' : kind === 'stamp' ? 'APPROVED' : kind === 'measure' ? '3,600 mm' : undefined, date: kind === 'stamp' ? '2026-11-07' : undefined }
    const prims = markupPrims(m, mt)
    assert.ok(prims.length > 0, kind)
    const b = markupBounds(m, mt)
    assert.ok(b.w > 0 && b.h > 0, kind)
    if (kind === 'highlight') {
        const p = prims[0]
        assert.ok(p.t === 'path' && p.opacity! < 1 && p.multiply && p.fill)
    }
    if (kind === 'note') assert.deepEqual(prims.map((p) => p.t === 'text' && p.text), ['CHECK', 'THIS'])
    if (kind === 'measure') {
        const t = prims.find((p) => p.t === 'text')!
        assert.ok(t.t === 'text' && near(t.angle, uprightAngle((Math.atan2(30, 70) * 180) / Math.PI)))
    }
}

// The stamp box fits the label and the date, and its text is centred.
{
    const m: Markup = { ...base, kind: 'stamp', text: 'NOT FOR CONSTRUCTION', date: '2026-11-07', size: 16 }
    const s = stampBox(m, mt)
    assert.ok(s.w >= mt('NOT FOR CONSTRUCTION', 16) + 2 * s.pad - 1e-9)
    const label = markupPrims(m, mt).find((p) => p.t === 'text' && p.bold)!
    assert.ok(label.t === 'text' && near(label.at.x - s.x, (s.w - s.labelW) / 2))
}

// Measure: calibrate on a known dimension, then measure another distance.
{
    // 1:100 drawing: 36 mm on paper is 3600 mm real.
    const a = { x: 0, y: 0 }
    const b = { x: 36 / PAPER_MM_PER_PT, y: 0 }
    const cal = calibrate(a, b, 3600, 'mm')!
    assert.ok(near(measure(a, b, cal).value, 3600, 1e-6))
    assert.equal(scaleRatio(cal), '1:100')
    const m2 = measure(a, { x: 0, y: 18 / PAPER_MM_PER_PT }, cal)
    assert.ok(near(m2.value, 1800, 1e-6) && m2.unit === 'mm' && !m2.paper)
    // The same calibration read in metres and feet.
    const inM = calibrate(a, b, 3.6, 'm')!
    assert.ok(near(measure(a, b, inM).value, 3.6, 1e-9))
    assert.equal(calibrate(a, a, 10, 'mm'), null)
    assert.equal(calibrate(a, b, 0, 'mm'), null)
    // Uncalibrated: paper millimetres.
    const paper = measure(a, { x: 72, y: 0 }, null)
    assert.ok(near(paper.value, 25.4) && paper.paper)
}

assert.equal(formatLength(3600, 'mm'), '3,600 mm')
assert.equal(formatLength(12.34, 'mm'), '12.3 mm')
assert.equal(formatLength(3.6, 'm'), '3.60 m')
assert.equal(formatLength(12.5, 'ft'), `12'-6"`)
assert.equal(formatLength(12 + 6.5 / 12, 'ft'), `12'-6 1/2"`)
assert.equal(formatLength(11.9999, 'ft'), `12'-0"`)
assert.equal(formatLength(3.375, 'in'), '3 3/8"')
assert.equal(parseLength('3,600'), 3600)
assert.equal(parseLength('abc'), null)
assert.deepEqual(ortho({ x: 0, y: 0 }, { x: 10, y: 3 }), { x: 10, y: 0 })
assert.deepEqual(ortho({ x: 0, y: 0 }, { x: 2, y: -9 }), { x: 0, y: -9 })

console.log('cad markup + measure tests passed')

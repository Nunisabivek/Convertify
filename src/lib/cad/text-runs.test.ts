import assert from 'node:assert/strict'
import { PDFDocument, StandardFonts, degrees } from 'pdf-lib'
import { mergeTextItems, runCorners, type RawTextItem } from './text-runs.ts'

const near = (a: number, b: number, eps = 0.01) => Math.abs(a - b) <= eps

// Item helper: text at (x, y) with angle and size; width from a fixed 0.6 em advance.
const item = (str: string, x: number, y: number, size = 10, angle = 0, w?: number): RawTextItem => {
    const r = (angle * Math.PI) / 180
    return {
        str,
        transform: [size * Math.cos(r), size * Math.sin(r), -size * Math.sin(r), size * Math.cos(r), x, y],
        width: w ?? str.length * 0.6 * size,
        height: size,
    }
}

// One character per item, as AutoCAD's TrueType export often writes title blocks.
{
    const chars = 'ROOM A-101'.split('')
    const items = chars.map((c, i) => item(c, 100 + i * 6, 500)).filter((it) => it.str !== ' ')
    const runs = mergeTextItems(items)
    assert.equal(runs.length, 1)
    assert.equal(runs[0].text, 'ROOM A-101')
    assert.deepEqual(runs[0].origin, { x: 100, y: 500 })
    assert.ok(near(runs[0].width, 9 * 6 + 6))
}

// Per-word items join with a space; a far-away label on the same baseline stays separate.
{
    const runs = mergeTextItems([item('DRAWN', 50, 100), item('BY:', 50 + 30 + 3, 100), item('J. SMITH', 300, 100)])
    assert.deepEqual(runs.map((r) => r.text).sort(), ['DRAWN BY:', 'J. SMITH'])
}

// Stacked lines stay separate; different sizes on one line stay separate.
{
    const runs = mergeTextItems([item('LINE ONE', 50, 100), item('LINE TWO', 50, 86), item('BIG', 50 + 48 + 1, 100, 20)])
    assert.equal(runs.length, 3)
    assert.deepEqual(runs.map((r) => r.text), ['LINE ONE', 'BIG', 'LINE TWO'])
}

// Any angle: 90, 270 and 30 degrees, written character by character along the baseline.
for (const angle of [90, 270, 30, -45]) {
    const r = (angle * Math.PI) / 180
    const items = '2400'.split('').map((c, i) => item(c, 200 + i * 6 * Math.cos(r), 300 + i * 6 * Math.sin(r), 10, angle))
    const runs = mergeTextItems(items)
    assert.equal(runs.length, 1, `one run at ${angle}°`)
    assert.equal(runs[0].text, '2400')
    assert.ok(near(runs[0].angle, angle > 180 ? angle - 360 : angle), `angle ${runs[0].angle} vs ${angle}`)
    assert.ok(near(runs[0].size, 10))
    assert.deepEqual(runs[0].origin, { x: 200, y: 300 })
    // The box runs along the reading direction.
    const c = runCorners(runs[0])
    assert.ok(near(Math.hypot(c[1].x - c[0].x, c[1].y - c[0].y), runs[0].width))
}

// Vertical items on parallel lines (two vertical dimensions next to each other) stay apart.
{
    const runs = mergeTextItems([item('1200', 100, 100, 8, 90), item('1500', 130, 100, 8, 90)])
    assert.equal(runs.length, 2)
}

// Blank items are skipped; a fake-bold overprint (same text drawn twice, nudged) counts once.
{
    const runs = mergeTextItems([item('  ', 10, 10), item('A', 10, 10), item('B', 16, 10)])
    assert.equal(runs.length, 1)
    assert.equal(runs[0].text, 'AB')
    const bold = mergeTextItems([item('NOTE', 10, 10), item('NOTE', 10.3, 10)])
    assert.equal(bold.length, 1)
    assert.equal(bold[0].text, 'NOTE')
    assert.equal(bold[0].starts.length, 2)
}

// Real pdf.js output: per-character draws and rotated text.
{
    const doc = await PDFDocument.create()
    const font = await doc.embedFont(StandardFonts.Helvetica)
    const page = doc.addPage([842, 595])
    let x = 72
    for (const ch of 'TITLE BLOCK') {
        page.drawText(ch, { x, y: 72, size: 9, font })
        x += font.widthOfTextAtSize(ch, 9)
    }
    page.drawText('ANGLED NOTE', { x: 400, y: 300, size: 12, font, rotate: degrees(30) })
    page.drawText('VERTICAL', { x: 700, y: 100, size: 10, font, rotate: degrees(270) })
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
    const pdf = await pdfjs.getDocument({ data: await doc.save(), verbosity: 0 }).promise
    const tc = await (await pdf.getPage(1)).getTextContent()
    const runs = mergeTextItems(tc.items as RawTextItem[])
    const by = (t: string) => runs.find((r) => r.text === t)
    assert.ok(by('TITLE BLOCK'), `per-char title merged, got ${JSON.stringify(runs.map((r) => r.text))}`)
    const angled = by('ANGLED NOTE')!
    assert.ok(near(angled.angle, 30, 0.01) && near(angled.origin.x, 400) && near(angled.origin.y, 300) && near(angled.size, 12))
    const vert = by('VERTICAL')!
    assert.ok(near(vert.angle, -90, 0.01) && near(vert.origin.x, 700))
    await pdf.destroy()
}

console.log('cad text-runs tests passed')

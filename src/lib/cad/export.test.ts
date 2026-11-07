import assert from 'node:assert/strict'
import * as lib from 'pdf-lib'
import { applyCadEdits, encodable, type PageInfo, type RegionEdit } from './export.ts'
import { mergeTextItems, placedItems, runCorners, type RawTextItem, type TextRun } from './text-runs.ts'
import type { Markup } from './markup.ts'
import { frameMapper, type PageFrame } from './viewport.ts'

const { PDFDocument, StandardFonts, degrees, rgb } = lib
const near = (a: number, b: number, eps = 0.05) => Math.abs(a - b) <= eps

// A drawing like AutoCAD writes it: a page-wide `cm` left open (no q/Q), a title
// block one character per text operator, labels at 30° and 270°, and a red label.
const src = await PDFDocument.create()
const helv = await src.embedFont(StandardFonts.Helvetica)
const p1 = src.addPage([1191, 842])
p1.pushOperators(lib.concatTransformationMatrix(0.5, 0, 0, 0.5, 0, 0))
const perChar = (page: lib.PDFPage, text: string, x: number, y: number, size: number) => {
    for (const ch of text) {
        page.drawText(ch, { x, y, size, font: helv })
        x += helv.widthOfTextAtSize(ch, size)
    }
}
perChar(p1, 'ROOM A-101', 200, 1400, 20) // shows at (100, 700), size 10
p1.drawText('SAME LINE', { x: 700, y: 1400, size: 20, font: helv })
p1.drawText('ANGLED NOTE', { x: 1000, y: 800, size: 24, font: helv, rotate: degrees(30) })
p1.drawText('DOWN 270', { x: 1800, y: 1200, size: 16, font: helv, rotate: degrees(270) })
p1.drawText('RED LABEL', { x: 200, y: 400, size: 20, font: helv, color: rgb(0.9, 0.1, 0.1) })
// A rotated sheet whose MediaBox doesn't start at 0,0.
const p2 = src.addPage([842, 595])
p2.setMediaBox(100, 50, 842, 595)
p2.setRotation(degrees(90))
p2.drawText('SHEET LABEL', { x: 200, y: 300, size: 12, font: helv })
const srcBytes = await src.save()

const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
const open = async (bytes: Uint8Array) => pdfjs.getDocument({ data: bytes.slice(), verbosity: 0 }).promise

// Analyse like the editor does.
const pdf = await open(srcBytes)
const pages = new Map<number, PageInfo>()
const runsByPage = new Map<number, TextRun[]>()
for (const n of [1, 2]) {
    const page = await pdf.getPage(n)
    const raws = (await page.getTextContent()).items as RawTextItem[]
    const runs = mergeTextItems(raws)
    runsByPage.set(n, runs)
    const frame: PageFrame = { view: page.view as [number, number, number, number], rotate: page.rotate }
    pages.set(n, { frame, items: placedItems(raws, runs, (_r, k) => `p${n}:t${k}`) })
}
const findRun = (n: number, text: string) => {
    const runs = runsByPage.get(n)!
    const k = runs.findIndex((r) => r.text === text)
    assert.ok(k >= 0, `run "${text}" on page ${n}; got ${JSON.stringify(runs.map((r) => r.text))}`)
    return { run: runs[k], key: `p${n}:t${k}` }
}
const edit = (n: number, text: string, next: string | null, color = '#000000'): RegionEdit => {
    const { run, key } = findRun(n, text)
    return {
        key,
        page: n,
        runKey: key,
        place: { origin: run.origin, angle: run.angle, size: run.size, width: run.width, cover: runCorners(run, 0.15) },
        color,
        paper: '#ffffff',
        text: next,
    }
}
const title = findRun(1, 'ROOM A-101').run
assert.ok(near(title.origin.x, 100) && near(title.origin.y, 700) && near(title.size, 10), 'CTM applied to text origin')
const regions = [
    edit(1, 'ROOM A-101', 'ROOM B-202'),
    edit(1, 'ANGLED NOTE', 'NEW ANGLE'),
    edit(1, 'DOWN 270', 'UP 270'),
    edit(1, 'RED LABEL', null),
    edit(2, 'SHEET LABEL', 'SHEET Ø ⌀ LABEL', '#cc0000'),
]

// Markups on the rotated sheet, drawn in display space (what the user sees).
const m2 = frameMapper(pages.get(2)!.frame)
const mk = (kind: Markup['kind'], extra: Partial<Markup> = {}): Markup => ({
    id: kind,
    page: 2,
    kind,
    color: '#e11d48',
    width: 1.5,
    a: { x: 40, y: 40 },
    b: { x: 160, y: 110 },
    ...extra,
})
const markups: Markup[] = [
    mk('arrow'),
    mk('cloud', { a: { x: 200, y: 200 }, b: { x: 320, y: 260 } }),
    mk('rect'),
    mk('highlight', { color: '#facc15' }),
    mk('note', { text: 'CHECK THIS', a: { x: 60, y: 300 } }),
    mk('stamp', { text: 'APPROVED', date: '2026-11-07', a: { x: 300, y: 400 } }),
    mk('measure', { text: '3,600 mm', a: { x: 40, y: 500 }, b: { x: 240, y: 500 } }),
]

const doc = await PDFDocument.load(srcBytes)
const report = await applyCadEdits(lib, doc, pages, regions, markups, { autocadMode: false })
// Every label here is a whole chain of its own: all are removed, nothing covered.
assert.deepEqual(report.covered, [], `covered: ${report.covered}`)
assert.equal(report.removed.length, 5)
assert.ok(report.substituted >= 1, '⌀ is not WinAnsi')
const out = await doc.save()

const res = await open(out)
const items = async (n: number) => ((await (await res.getPage(n)).getTextContent()).items as RawTextItem[]).filter((i) => i.str.trim())
const p1Items = await items(1)
const runs1 = mergeTextItems(p1Items)
const texts1 = runs1.map((r) => r.text)
assert.ok(!texts1.some((t) => t.includes('A-101')), 'old title gone')
assert.ok(!texts1.includes('RED LABEL'), 'deleted label gone')
assert.ok(texts1.includes('SAME LINE'), 'neighbour on the same line kept')
const nb = runs1.find((r) => r.text === 'ROOM B-202')!
assert.ok(nb && near(nb.origin.x, 100) && near(nb.origin.y, 700) && near(nb.size, 10), 'new title at the old baseline and size')
const na = runs1.find((r) => r.text === 'NEW ANGLE')!
assert.ok(na && near(na.angle, 30, 0.01) && near(na.origin.x, 500) && near(na.origin.y, 400), 'angle kept at 30°')
const nd = runs1.find((r) => r.text === 'UP 270')!
assert.ok(nd && near(nd.angle, -90, 0.01), '270° kept')

const p2Items = await items(2)
const runs2 = mergeTextItems(p2Items)
assert.ok(runs2.some((r) => r.text === 'SHEET Ø Ø LABEL'), JSON.stringify(runs2.map((r) => r.text)))
// Notes and stamps read upright on screen: on a /Rotate 90 page that's user angle 90.
for (const t of ['CHECK THIS', 'APPROVED', '2026-11-07', '3,600 mm']) {
    const r = runs2.find((x) => x.text === t)
    assert.ok(r, `${t} written`)
    assert.ok(near(r!.angle, 90, 0.01), `${t} upright on the rotated sheet (angle ${r!.angle})`)
}
// The note sits where it was drawn on screen.
const note = runs2.find((x) => x.text === 'CHECK THIS')!
const shown = m2.toDisplay(note.origin.x, note.origin.y)
assert.ok(near(shown.x, 60, 0.5) && near(shown.y, 300 + 12 * 0.8, 0.5), `note at ${JSON.stringify(shown)}`)

// Markups are vector paths (not images): count path-construction operators.
const ops = await (await res.getPage(2)).getOperatorList()
const { OPS } = pdfjs
const paths = ops.fnArray.filter((f: number) => f === OPS.constructPath).length
assert.ok(paths >= 10, `vector paths on the rotated sheet: ${paths}`)
assert.ok(!ops.fnArray.includes(OPS.paintImageXObject), 'no images')

// The AutoCAD-friendly export never draws a cover box, even where text can't be removed.
{
    const d2 = await PDFDocument.load(srcBytes)
    const covered = { ...regions[1], runKey: undefined }
    const rep = await applyCadEdits(lib, d2, pages, [covered], [], { autocadMode: true })
    assert.deepEqual(rep.covered, [])
    const d3 = await PDFDocument.load(srcBytes)
    const rep3 = await applyCadEdits(lib, d3, pages, [covered], [], { autocadMode: false })
    assert.deepEqual(rep3.covered, [covered.key])
}

// encodable keeps WinAnsi text and replaces the rest.
{
    const d = await PDFDocument.create()
    const f = await d.embedFont(StandardFonts.Helvetica)
    assert.deepEqual(encodable(f, 'Ø25 ±0.5 °C'), { text: 'Ø25 ±0.5 °C', substituted: 0 })
    assert.equal(encodable(f, '⌀25 →').text, 'Ø25 ?')
}

await pdf.destroy()
await res.destroy()
console.log('cad export tests passed')

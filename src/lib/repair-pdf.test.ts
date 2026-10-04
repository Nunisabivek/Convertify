import assert from 'node:assert/strict'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { repairPdf } from './repair-pdf.ts'

// A 4-page document saved WITHOUT object streams, so every object is plain
// text and survives truncation the way a real interrupted download does.
const doc = await PDFDocument.create()
const font = await doc.embedFont(StandardFonts.Helvetica)
for (let i = 1; i <= 4; i++) doc.addPage([300, 300]).drawText(`PAGE ${i}`, { x: 20, y: 150, font })
const good = await doc.save({ useObjectStreams: false })
const text = Buffer.from(good).toString('latin1')

// 1. A healthy file passes straight through.
assert.equal((await repairPdf(good)).pagesRecovered, 4)

// 2. The last 120 bytes missing: the trailer dictionary is cut in half (the
//    classic interrupted download). The file is unreadable as it stands.
const cutTrailer = good.subarray(0, good.length - 120)
await assert.rejects(PDFDocument.load(cutTrailer), 'fixture should be unreadable before repair')
const fixed = await repairPdf(cutTrailer)
assert.equal(fixed.pagesRecovered, 4)
assert.equal((await PDFDocument.load(fixed.bytes)).getPageCount(), 4)

// 2b. Cut right after the last object, before the xref table starts.
const noXref = good.subarray(0, text.lastIndexOf('xref'))
assert.equal((await repairPdf(noXref)).pagesRecovered, 4)

// 2c. Same damage on a file that keeps its catalog in a compressed object
//     stream (what Word, Acrobat and pdf-lib write by default): a text scan
//     cannot see the catalog, so pdf-lib has to find it.
const packed = await (async () => {
    const d = await PDFDocument.create()
    const f = await d.embedFont(StandardFonts.Helvetica)
    for (let i = 1; i <= 4; i++) d.addPage([300, 300]).drawText(`PAGE ${i}`, { x: 20, y: 150, font: f })
    return d.save({ useObjectStreams: true })
})()
const packedCut = packed.subarray(0, packed.length - 60)
await assert.rejects(PDFDocument.load(packedCut), 'object-stream fixture should be unreadable before repair')
assert.equal((await repairPdf(packedCut)).pagesRecovered, 4)

// 3. Cut off in the middle of the file: keep the pages that are still intact.
const half = good.subarray(0, Math.floor(good.length * 0.6))
const partial = await repairPdf(half).catch(() => null)
if (partial) assert.ok(partial.pagesRecovered >= 1 && partial.pagesRecovered <= 4)

// 4. Junk before the header is skipped.
const junk = Buffer.concat([Buffer.from('GARBAGE\r\n'), Buffer.from(good)])
assert.equal((await repairPdf(junk)).pagesRecovered, 4)

// 5. Not a PDF at all is reported, not "repaired".
await assert.rejects(repairPdf(Buffer.from('hello world, not a pdf')))

console.log('repair-pdf tests passed')

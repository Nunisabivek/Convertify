import assert from 'node:assert/strict'
import { PDFDocument, PDFRawStream, StandardFonts, decodePDFRawStream } from 'pdf-lib'
import { buildRedactedPdf } from './redact-pdf.ts'

// pdf-lib writes standard-font text as hex strings inside flate streams.
const hex = (s: string) => Buffer.from(s).toString('hex')
const PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64'
)

const src = await PDFDocument.create()
const font = await src.embedFont(StandardFonts.Helvetica)
const secret = src.addPage([612, 792])
secret.drawText('TOPSECRET', { x: 50, y: 700, font })
const open = src.addPage([612, 792])
open.drawText('PUBLICTEXT', { x: 50, y: 700, font })
// A link on the kept page that points at the redacted one. copyPages follows
// it, so an un-emptied source page would drag its content stream along.
open.node.addAnnot(src.context.register(src.context.obj({
    Type: 'Annot', Subtype: 'Link', Rect: [0, 0, 10, 10], Dest: [secret.ref, 'Fit'],
})))

const bytes = await buildRedactedPdf(await src.save(), new Map([[0, { png: PNG, width: 612, height: 792 }]]))
const out = await PDFDocument.load(bytes)
const dump = out.context.enumerateIndirectObjects().map(([, obj]) => {
    if (!(obj instanceof PDFRawStream)) return obj.toString()
    try { return Buffer.from(decodePDFRawStream(obj).decode()).toString('latin1') } catch { return '' }
}).join('\n').toLowerCase()

assert.equal(out.getPageCount(), 2)
assert.ok(!dump.includes(hex('TOPSECRET')), 'redacted page text leaked into the output file')
assert.ok(dump.includes(hex('PUBLICTEXT')), 'untouched page lost its text')

console.log('redact-pdf tests passed')

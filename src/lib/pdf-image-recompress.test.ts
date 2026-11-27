import assert from 'node:assert/strict'
import { PDFDocument, PDFName, PDFNumber, PDFRawStream, StandardFonts } from 'pdf-lib'
import { recompressPdfImages, shrinkPdfImages, type Reencode } from './pdf-image-recompress.ts'

// A PDF with real text plus three fake JPEG streams: RGB (shrinkable), CMYK and inverted (must be skipped).
async function fixture() {
    const doc = await PDFDocument.create()
    const page = doc.addPage([595, 842])
    page.drawText('Selectable invoice text', { x: 50, y: 800, size: 12, font: await doc.embedFont(StandardFonts.Helvetica) })
    const img = (cs: string, extra: Record<string, unknown> = {}) => {
        const s = doc.context.stream(new Uint8Array(120_000).fill(7), {
            Type: 'XObject', Subtype: 'Image', Filter: 'DCTDecode', Width: 3000, Height: 4000, BitsPerComponent: 8, ColorSpace: cs, ...extra,
        })
        return page.node.newXObject('Im', doc.context.register(s))
    }
    img('DeviceRGB')
    img('DeviceCMYK')
    img('DeviceGray', { Decode: [1, 0] })
    return doc.save()
}

const seen: number[] = []
const fake: Reencode = async (jpeg, maxSide, q) => {
    seen.push(jpeg.length)
    return { bytes: new Uint8Array(Math.round(10_000 * q)).fill(9), width: maxSide * 0.75, height: maxSide }
}

{
    const { bytes, replaced } = await recompressPdfImages(await fixture(), 1900, 0.68, fake)
    assert.equal(replaced, 1, 'only the RGB photo is re-encoded')
    assert.equal(seen.length, 1, 'CMYK and inverted images never reach the decoder')
    const doc = await PDFDocument.load(bytes)
    const images = doc.context.enumerateIndirectObjects().map(([, o]) => o).filter((o): o is PDFRawStream => o instanceof PDFRawStream && o.dict.get(PDFName.of('Subtype')) === PDFName.of('Image'))
    const rgb = images.find((o) => o.dict.get(PDFName.of('Width')) instanceof PDFNumber && (o.dict.get(PDFName.of('Width')) as PDFNumber).asNumber() === 1425)
    assert.ok(rgb && rgb.contents.length === 6800, 'RGB stream replaced with the new JPEG and its new size')
    assert.equal(images.filter((o) => o.contents.length === 120_000).length, 2, 'skipped images untouched')
    assert.ok(bytes.length < 260_000)
}

// Target reachable at the first tier: highest quality wins. Unreachable: null (caller rasterises).
{
    const src = await fixture()
    const ab = src.buffer.slice(src.byteOffset, src.byteOffset + src.byteLength) as ArrayBuffer
    const ok = await shrinkPdfImages(ab, 1, 400_000, fake)
    assert.ok(ok && ok.length < src.length)
    assert.equal(await shrinkPdfImages(ab, 1, 1000, fake), null)
}

// Text-only PDF: nothing to shrink, gives up after one pass.
{
    const doc = await PDFDocument.create()
    doc.addPage().drawText('only text')
    const b = await doc.save()
    let calls = 0
    assert.equal(await shrinkPdfImages(b.buffer.slice(0) as ArrayBuffer, 1, 10, async () => { calls++; return null }), null)
    assert.equal(calls, 0)
}

// A decoder that rotated the photo (swapped sides) is ignored, not written into the PDF.
{
    const swapped: Reencode = async (_j, maxSide, q) => ({ bytes: new Uint8Array(Math.round(10_000 * q)), width: maxSide, height: maxSide * 0.75 })
    assert.equal((await recompressPdfImages(await fixture(), 1900, 0.68, swapped)).replaced, 0)
}

// Cancel: AbortError comes through instead of being swallowed as "can't shrink".
{
    const ac = new AbortController()
    ac.abort()
    const src = await fixture()
    await assert.rejects(shrinkPdfImages(src.buffer.slice(src.byteOffset, src.byteOffset + src.byteLength) as ArrayBuffer, 1, 400_000, fake, undefined, ac.signal), { name: 'AbortError' })
}

// Encrypted/garbage input: null, never throws.
assert.equal(await shrinkPdfImages(new TextEncoder().encode('not a pdf').buffer as ArrayBuffer, 1, 10, fake), null)

console.log('pdf-image-recompress test passed')

import { PDFArray, PDFDocument, PDFName, PDFNumber, PDFRawStream, PDFRef, PDFDict } from 'pdf-lib'

/** Decodes a JPEG and re-encodes it no larger than maxSide px at quality q. null = leave as is. */
export type Reencode = (jpeg: Uint8Array, maxSide: number, q: number) => Promise<{ bytes: Uint8Array; width: number; height: number } | null>

const name = (d: PDFDict, k: string) => {
    const v = d.get(PDFName.of(k))
    return v instanceof PDFName ? v.decodeText() : v instanceof PDFArray && v.size() === 1 && v.get(0) instanceof PDFName ? (v.get(0) as PDFName).decodeText() : undefined
}

/**
 * Re-encodes the photos inside a PDF (DCTDecode images in RGB or gray) and leaves
 * text, fonts and vector art untouched, so the result stays selectable and sharp.
 * CMYK, indexed, masked and inverted images are skipped: browsers decode those wrongly.
 */
export async function recompressPdfImages(src: ArrayBuffer | Uint8Array, maxSide: number, q: number, reencode: Reencode, signal?: AbortSignal): Promise<{ bytes: Uint8Array; replaced: number }> {
    const doc = await PDFDocument.load(src, { updateMetadata: false })
    const ctx = doc.context
    let replaced = 0
    for (const [ref, obj] of ctx.enumerateIndirectObjects()) {
        if (!(obj instanceof PDFRawStream) || !(ref instanceof PDFRef)) continue
        const d = obj.dict
        if (name(d, 'Subtype') !== 'Image' || name(d, 'Filter') !== 'DCTDecode') continue
        if (d.get(PDFName.of('Decode')) || d.get(PDFName.of('ImageMask')) || obj.contents.length < 40_000) continue
        let cs = name(d, 'ColorSpace')
        const csObj = ctx.lookup(d.get(PDFName.of('ColorSpace')))
        if (!cs && csObj instanceof PDFArray && csObj.get(0) instanceof PDFName && (csObj.get(0) as PDFName).decodeText() === 'ICCBased') {
            const icc = ctx.lookup(csObj.get(1))
            const n = icc && 'dict' in icc ? (icc as PDFRawStream).dict.get(PDFName.of('N')) : undefined
            cs = n instanceof PDFNumber && n.asNumber() === 3 ? 'DeviceRGB' : n instanceof PDFNumber && n.asNumber() === 1 ? 'DeviceGray' : undefined
        }
        if (cs !== 'DeviceRGB' && cs !== 'DeviceGray') continue
        if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError')
        const out = await reencode(obj.contents, maxSide, q).catch(() => null)
        if (!out || out.bytes.length >= obj.contents.length * 0.9) continue
        // A decoder that applied an EXIF rotation would swap the sides; PDF viewers never rotate.
        const [w0, h0] = [d.get(PDFName.of('Width')), d.get(PDFName.of('Height'))]
        if (!(w0 instanceof PDFNumber) || !(h0 instanceof PDFNumber)) continue
        if (Math.abs(out.width / out.height - w0.asNumber() / h0.asNumber()) > 0.02 * (w0.asNumber() / h0.asNumber())) continue
        d.set(PDFName.of('Width'), PDFNumber.of(out.width))
        d.set(PDFName.of('Height'), PDFNumber.of(out.height))
        d.set(PDFName.of('ColorSpace'), PDFName.of('DeviceRGB'))
        d.set(PDFName.of('BitsPerComponent'), PDFNumber.of(8))
        d.delete(PDFName.of('DecodeParms'))
        ctx.assign(ref, PDFRawStream.of(d, out.bytes))
        replaced++
    }
    return { bytes: await doc.save({ useObjectStreams: true }), replaced }
}

// Largest side and JPEG quality per attempt: about 220, 160 and 115 dpi for a full-page A4 scan.
const TIERS: [number, number][] = [[2600, 0.8], [1900, 0.68], [1350, 0.55]]

/**
 * Text-preserving compression: returns the best-quality result within [min, max] bytes,
 * or null when shrinking the photos alone can't get there (text-only PDFs, encrypted files).
 */
export async function shrinkPdfImages(src: ArrayBuffer, min: number, max: number, reencode: Reencode, onTier?: (i: number, n: number) => void, signal?: AbortSignal): Promise<Uint8Array | null> {
    for (let i = 0; i < TIERS.length; i++) {
        onTier?.(i, TIERS.length)
        let out: Uint8Array
        try {
            const r = await recompressPdfImages(src, TIERS[i][0], TIERS[i][1], reencode, signal)
            if (!r.replaced) return null // no photos worth shrinking (text-only PDF)
            out = r.bytes
        } catch (e) {
            if (e instanceof DOMException && e.name === 'AbortError') throw e
            return null // encrypted or unreadable for pdf-lib: let the page renderer handle it
        }
        if (out.length > max) continue
        return out.length >= min && out.length < src.byteLength ? out : null
    }
    return null
}

/** Browser re-encoder. EXIF orientation is ignored on purpose: PDF viewers ignore it too. */
export const canvasReencode: Reencode = async (jpeg, maxSide, q) => {
    const blob0 = new Blob([jpeg as BlobPart], { type: 'image/jpeg' })
    // Older engines reject the option; recompressPdfImages's aspect check catches a rotated decode.
    const bmp = await createImageBitmap(blob0, { imageOrientation: 'none' }).catch(() => createImageBitmap(blob0))
    const k = Math.min(1, maxSide / Math.max(bmp.width, bmp.height))
    const [width, height] = [Math.max(1, Math.round(bmp.width * k)), Math.max(1, Math.round(bmp.height * k))]
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const g = canvas.getContext('2d')
    if (!g) return null
    g.drawImage(bmp, 0, 0, width, height)
    bmp.close()
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', q))
    canvas.width = canvas.height = 1
    return blob ? { bytes: new Uint8Array(await blob.arrayBuffer()), width, height } : null
}

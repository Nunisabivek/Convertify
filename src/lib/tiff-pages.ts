import UTIF from 'utif'

export type TiffPage = {
    width: number
    height: number
    /** Decoded pixels, 4 bytes (RGBA) per pixel. */
    rgba: Uint8Array
    /** Page size in PDF points: the scan's real paper size when the TIFF records its resolution, else its pixel size. */
    pageWidthPt: number
    pageHeightPt: number
}

function pointsFor(pixels: number, resolution: number | undefined, unit: number): number {
    if (!resolution || resolution <= 0) return pixels
    if (unit === 3) return (pixels / resolution) * (72 / 2.54) // dots per cm
    if (unit === 2) return (pixels / resolution) * 72 // dots per inch
    return pixels
}

/**
 * Decode every page of a TIFF, one at a time so a long scan never holds all
 * of its pixels in memory at once. Browsers other than Safari cannot decode
 * TIFF in an <img>, which is why this uses UTIF (handles uncompressed, LZW,
 * PackBits, Deflate, CCITT G3/G4 and JPEG-compressed TIFFs).
 */
export function* iterateTiffPages(buffer: ArrayBuffer): Generator<TiffPage> {
    const ifds = UTIF.decode(buffer)
    let yielded = 0
    for (const ifd of ifds) {
        // Reduced-resolution thumbnails stored next to a real page.
        if (ifd.t254 && (ifd.t254[0] & 1)) continue
        UTIF.decodeImage(buffer, ifd)
        if (!ifd.width || !ifd.height) continue
        const unit = ifd.t296?.[0] ?? 2
        yield {
            width: ifd.width,
            height: ifd.height,
            rgba: UTIF.toRGBA8(ifd),
            pageWidthPt: pointsFor(ifd.width, ifd.t282?.[0], unit),
            pageHeightPt: pointsFor(ifd.height, ifd.t283?.[0], unit),
        }
        yielded++
    }
    if (yielded === 0) throw new Error('This TIFF has no readable pages.')
}

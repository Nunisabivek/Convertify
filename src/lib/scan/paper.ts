/**
 * Real paper sizes for scanned pages. The old export made each PDF page as
 * many points as the photo had pixels (a 1200 px scan became a 16-inch page);
 * print dialogs and form uploads expect A4 or Letter.
 */

export type PaperKind = 'a4' | 'letter' | 'legal' | 'card' | 'other'

const PT_PER_MM = 72 / 25.4

const KNOWN: { kind: PaperKind; ratio: number; wPt: number; hPt: number }[] = [
    { kind: 'a4', ratio: 297 / 210, wPt: 210 * PT_PER_MM, hPt: 297 * PT_PER_MM },
    { kind: 'letter', ratio: 11 / 8.5, wPt: 612, hPt: 792 },
    { kind: 'legal', ratio: 14 / 8.5, wPt: 612, hPt: 1008 },
    // ID-1: bank cards, driving licences, most ID cards. Printed at real size.
    { kind: 'card', ratio: 85.6 / 53.98, wPt: 53.98 * PT_PER_MM, hPt: 85.6 * PT_PER_MM },
]

/** Close to a standard sheet (within 3%)? Ratio is long side / short side. */
export function paperFor(longOverShort: number): { kind: PaperKind; ratio: number } {
    for (const k of KNOWN) {
        if (Math.abs(longOverShort - k.ratio) / k.ratio <= 0.03) return { kind: k.kind, ratio: k.ratio }
    }
    return { kind: 'other', ratio: longOverShort }
}

/**
 * Output pixel size for a page whose edges measure qw x qh in the photo:
 * snapped to the standard sheet it resembles, never upscaled more than 10%
 * past what the camera captured, capped at maxLong (3508 px = A4 at 300 dpi).
 */
export function pageSize(qw: number, qh: number, maxLong: number): { width: number; height: number; kind: PaperKind } {
    const landscape = qw > qh
    const long = Math.max(qw, qh)
    const short = Math.max(1, Math.min(qw, qh))
    const { kind, ratio } = paperFor(long / short)
    const outLong = Math.max(200, Math.min(maxLong, Math.round(long * 1.1)))
    const outShort = Math.round(outLong / ratio)
    return landscape ? { width: outLong, height: outShort, kind } : { width: outShort, height: outLong, kind }
}

/** PDF page size in points for a scanned image of pxW x pxH. */
export function pdfPageSize(pxW: number, pxH: number): [number, number] {
    const landscape = pxW > pxH
    const long = Math.max(pxW, pxH)
    const short = Math.max(1, Math.min(pxW, pxH))
    const { kind } = paperFor(long / short)
    const known = KNOWN.find((k) => k.kind === kind)
    let wPt: number
    let hPt: number
    if (known) {
        wPt = known.wPt
        hPt = known.hPt
    } else {
        // Receipts and odd sizes: A4 width, height in proportion.
        wPt = 210 * PT_PER_MM
        hPt = (wPt * long) / short
    }
    return landscape ? [hPt, wPt] : [wPt, hPt]
}

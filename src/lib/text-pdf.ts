import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { toWinAnsi, wrapText } from './sheet-layout.ts'

/**
 * Plain text onto A4 pages: wrapped at the margins (never truncated), paginated,
 * blank lines kept. Shared by Text, Word and HTML to PDF. Helvetica can't draw
 * non-Latin scripts, so those characters become "?" instead of crashing the export.
 */
export async function textToPdf(text: string, fontSize = 12): Promise<Uint8Array> {
    const doc = await PDFDocument.create()
    const font = await doc.embedFont(StandardFonts.Helvetica)
    const [W, H, M] = [595, 842, 50]
    const lineHeight = fontSize * 1.35
    const lines = wrapText(toWinAnsi(text), W - 2 * M, (s) => font.widthOfTextAtSize(s, fontSize))
    let page = doc.addPage([W, H])
    let y = H - M - fontSize
    for (const line of lines) {
        if (y < M) {
            page = doc.addPage([W, H])
            y = H - M - fontSize
        }
        if (line) page.drawText(line, { x: M, y, size: fontSize, font, color: rgb(0, 0, 0) })
        y -= lineHeight
    }
    return doc.save()
}

/** Readable text from HTML: scripts and styles dropped, entities decoded, block elements kept as line breaks. */
export function htmlToText(html: string, parse: (h: string) => string): string {
    const marked = html
        .replace(/<(style|script|noscript)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
        .replace(/<br\s*\/?>|<\/(p|div|h[1-6]|li|tr|section|article|header|footer|blockquote|pre|table|ul|ol)>/gi, '\n')
    return parse(marked)
        .split('\n')
        .map((l) => l.replace(/\s+/g, ' ').trim())
        .filter((l, i, all) => l || (i > 0 && all[i - 1] !== ''))
        .join('\n')
        .trim()
}

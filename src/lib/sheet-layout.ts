// Table layout for the Excel-to-PDF converter. Pure math so it can be tested
// without a browser: the caller passes a measure function (text width at 1pt).

export const CELL_PADDING = 3
const BASE_SIZE = 9
const MIN_SIZE = 6
// Widest a column may get, in font-size units; longer text wraps.
const MAX_COL_EM = 22

// Helvetica (WinAnsi) can't encode most non-Latin text and pdf-lib throws on
// it, so map such characters to their accent-stripped form or "?".
const WIN_ANSI_EXTRA = "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ"
const encodable = (ch: string) => {
    const c = ch.charCodeAt(0)
    return (c >= 0x20 && c < 0x7f) || (c >= 0xa0 && c <= 0xff) || WIN_ANSI_EXTRA.includes(ch)
}

export function toWinAnsi(text: string): string {
    let out = ""
    for (const ch of text.replace(/\r\n?/g, "\n").replace(/\t/g, " ")) {
        if (ch === "\n" || encodable(ch)) { out += ch; continue }
        const base = ch.normalize("NFKD").replace(/[̀-ͯ]/g, "")
        out += base && [...base].every(encodable) ? base : "?"
    }
    return out
}

// Word-wraps text to maxWidth; words wider than a line are broken by character.
export function wrapText(text: string, maxWidth: number, width: (s: string) => number): string[] {
    const lines: string[] = []
    for (const para of text.split("\n")) {
        let line = ""
        for (const word of para.split(" ")) {
            const joined = line ? line + " " + word : word
            if (width(joined) <= maxWidth) { line = joined; continue }
            if (line) lines.push(line)
            line = ""
            for (const ch of word) {
                if (line && width(line + ch) > maxWidth) { lines.push(line); line = "" }
                line += ch
            }
        }
        lines.push(line)
    }
    return lines
}

// Sizes columns from their content, shrinks the font (down to MIN_SIZE) to fit
// the page width, and otherwise splits columns into page-wide chunks. Row 0 is
// the bold header. lines[row][col] holds every wrapped line of every cell.
export function layoutSheet(rows: string[][], usableWidth: number, measure: (text: string, bold: boolean) => number) {
    const nCols = rows.reduce((n, r) => Math.max(n, r.length), 0)
    const em = Array.from({ length: nCols }, (_, c) => {
        let w = 0
        rows.forEach((row, r) => { for (const p of (row[c] ?? "").split("\n")) w = Math.max(w, measure(p, r === 0)) })
        return Math.min(w, MAX_COL_EM)
    })
    // Text width is linear in font size, so the size that fits is solved directly.
    const fit = Math.floor(((usableWidth - nCols * 2 * CELL_PADDING) / em.reduce((s, e) => s + e, 0)) * 10) / 10
    const fontSize = fit >= MIN_SIZE ? Math.min(BASE_SIZE, fit) : BASE_SIZE
    const colWidths = em.map((e) => e * fontSize + 2 * CELL_PADDING)

    const chunks: number[][] = []
    let used = Infinity
    colWidths.forEach((w, c) => {
        if (used + w > usableWidth) { chunks.push([]); used = 0 }
        chunks[chunks.length - 1].push(c)
        used += w
    })

    const lines = rows.map((row, r) => em.map((e, c) =>
        wrapText(row[c] ?? "", e * fontSize, (s) => measure(s, r === 0) * fontSize)))
    return { fontSize, colWidths, chunks, lines }
}

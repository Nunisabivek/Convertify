import { PDFDocument, StandardFonts, rgb, type PDFFont } from 'pdf-lib'
import { toWinAnsi, wrapText } from './sheet-layout.ts'

type Style = 'r' | 'b' | 'i' | 'bi' | 'c'
export type Run = { text: string; style: Style }
export type Block =
    | { kind: 'h'; level: number; text: string }
    | { kind: 'p' | 'quote'; text: string }
    | { kind: 'li'; marker: string; depth: number; text: string }
    | { kind: 'code'; lines: string[] }
    | { kind: 'table'; rows: string[][] }
    | { kind: 'hr' }

/** Inline Markdown to styled runs: ***x***, **x**, *x* / _x_, `x`; links keep their text. */
export function inlineRuns(s: string, base: Style = 'r'): Run[] {
    const runs: Run[] = []
    const re = /`[^`]+`|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\b_[^_\s][^_]*_\b|\[[^\]]+\]\([^)]*\)/g
    const bold: Style = base === 'i' ? 'bi' : 'b'
    const italic: Style = base === 'b' ? 'bi' : 'i'
    let last = 0
    for (const m of s.matchAll(re)) {
        const t = m[0]
        if (m.index > last) runs.push({ text: s.slice(last, m.index), style: base })
        if (t[0] === '`') runs.push({ text: t.slice(1, -1), style: 'c' })
        else if (t.startsWith('***')) runs.push({ text: t.slice(3, -3), style: 'bi' })
        else if (t.startsWith('**')) runs.push({ text: t.slice(2, -2), style: bold })
        else if (t[0] === '[') runs.push({ text: t.slice(1, t.indexOf('](')), style: base })
        else runs.push({ text: t.slice(1, -1), style: italic })
        last = m.index + t.length
    }
    if (last < s.length) runs.push({ text: s.slice(last), style: base })
    return runs
}

export function parseBlocks(md: string): Block[] {
    const out: Block[] = []
    const lines = md.replace(/\r\n?/g, '\n').split('\n')
    let para: string[] = []
    const flush = () => {
        if (para.length) out.push({ kind: 'p', text: para.join(' ') })
        para = []
    }
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        let m: RegExpExecArray | null
        if (/^\s*```/.test(line)) {
            flush()
            const code: string[] = []
            while (++i < lines.length && !/^\s*```/.test(lines[i])) code.push(lines[i])
            out.push({ kind: 'code', lines: code })
        } else if (/^\s*\|.*\|\s*$/.test(line)) {
            flush()
            const rows: string[][] = []
            for (; i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i]); i++) {
                const cells = lines[i].trim().slice(1, -1).split('|').map((c) => c.trim())
                if (!cells.every((c) => /^:?-+:?$/.test(c))) rows.push(cells)
            }
            i--
            out.push({ kind: 'table', rows })
        } else if (!line.trim()) flush()
        else if ((m = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line))) { flush(); out.push({ kind: 'h', level: m[1].length, text: m[2] }) }
        else if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) { flush(); out.push({ kind: 'hr' }) }
        else if ((m = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(line))) {
            flush()
            const marker = /\d/.test(m[2]) ? m[2].replace(')', '.') : '•'
            out.push({ kind: 'li', marker, depth: Math.min(4, Math.floor(m[1].length / 2)), text: m[3] })
        } else if ((m = /^\s*>\s?(.*)$/.exec(line))) { flush(); out.push({ kind: 'quote', text: m[1] }) }
        else para.push(line.trim())
    }
    flush()
    return out
}

const INK = rgb(0.12, 0.16, 0.23)
const MUTED = rgb(0.39, 0.45, 0.55)
const RULE = rgb(0.89, 0.91, 0.94)
const CODE_BG = rgb(0.97, 0.98, 0.99)
const H_SIZE = [22, 18, 15, 13, 12, 11]
// Emoji can't be drawn with the built-in fonts; they're dropped rather than sending a whole
// README to the print fallback. ©, ® and ™ count as "pictographic" too but exist in the fonts.
const EMOJI = /(?![©®™])\p{Extended_Pictographic}|\p{Emoji_Modifier}|\p{Regional_Indicator}|[‍️⃣]/gu

/** Markdown onto A4 pages as real text (selectable, searchable), wrapped and paginated. */
export async function markdownToPdf(md: string): Promise<Uint8Array> {
    const doc = await PDFDocument.create()
    const [r, b, i, bi, c] = await Promise.all(
        [StandardFonts.Helvetica, StandardFonts.HelveticaBold, StandardFonts.HelveticaOblique, StandardFonts.HelveticaBoldOblique, StandardFonts.Courier].map((f) => doc.embedFont(f)),
    )
    const font: Record<Style, PDFFont> = { r, b, i, bi, c }
    const [W, H, M] = [595, 842, 56]
    let page = doc.addPage([W, H])
    let y = H - M
    const need = (h: number) => {
        if (y - h < M) {
            page = doc.addPage([W, H])
            y = H - M
        }
    }

    // Word-wraps styled runs between x0 and the right margin, one line at a time.
    const flow = (runs: Run[], size: number, x0: number, color = INK) => {
        const lh = size * 1.45
        const max = W - M - x0
        const width = (t: string, s: Style) => font[s].widthOfTextAtSize(t, size)
        let line: Run[] = []
        let lineW = 0
        const emit = () => {
            while (line.length && !line[line.length - 1].text.trim()) lineW -= width(line.pop()!.text, 'r')
            need(lh)
            let x = x0
            for (const seg of line) {
                page.drawText(seg.text, { x, y: y - size, size, font: font[seg.style], color })
                x += width(seg.text, seg.style)
            }
            y -= lh
            line = []
            lineW = 0
        }
        for (const run of runs) {
            for (const tok of toWinAnsi(run.text).replace(/\n/g, ' ').split(/(\s+)/)) {
                if (!tok) continue
                const space = !tok.trim()
                const t = space ? ' ' : tok
                const w = width(t, run.style)
                if (space && !line.length) continue
                if (lineW + w <= max) {
                    line.push({ text: t, style: run.style })
                    lineW += w
                    continue
                }
                if (space) { emit(); continue }
                if (line.length) emit()
                // A word wider than the line is broken by character.
                let part = ''
                for (const ch of t) {
                    if (part && width(part + ch, run.style) > max) {
                        line.push({ text: part, style: run.style })
                        emit()
                        part = ''
                    }
                    part += ch
                }
                line.push({ text: part, style: run.style })
                lineW = width(part, run.style)
            }
        }
        if (line.length) emit()
    }

    for (const blk of parseBlocks(md.replace(EMOJI, ''))) {
        if (blk.kind === 'h') {
            const size = H_SIZE[blk.level - 1]
            y -= size * 0.6
            need(size * 2)
            flow(inlineRuns(blk.text, 'b'), size, M)
            if (blk.level <= 2) {
                page.drawLine({ start: { x: M, y: y + 3 }, end: { x: W - M, y: y + 3 }, thickness: blk.level === 1 ? 1.2 : 0.6, color: RULE })
                y -= 6
            }
        } else if (blk.kind === 'p') {
            flow(inlineRuns(blk.text), 11, M)
            y -= 6
        } else if (blk.kind === 'li') {
            const x = M + 6 + blk.depth * 16
            need(11 * 1.45)
            page.drawText(toWinAnsi(blk.marker), { x, y: y - 11, size: 11, font: r, color: INK })
            flow(inlineRuns(blk.text), 11, x + (blk.marker === '•' ? 12 : 18))
            y -= 2
        } else if (blk.kind === 'quote') {
            const top = y
            const start = page
            flow(inlineRuns(blk.text, 'i'), 11, M + 14, MUTED)
            // ponytail: the bar is drawn on the page the quote starts on; a quote split across pages gets no bar on the second.
            if (page === start) page.drawRectangle({ x: M, y, width: 3, height: top - y, color: RULE })
            y -= 6
        } else if (blk.kind === 'code') {
            const size = 9.5
            const lh = size * 1.5
            const lines = blk.lines.length ? wrapText(toWinAnsi(blk.lines.join('\n')), W - 2 * M - 16, (s) => c.widthOfTextAtSize(s, size)) : ['']
            y -= 4
            for (const ln of lines) {
                need(lh)
                page.drawRectangle({ x: M, y: y - lh, width: W - 2 * M, height: lh, color: CODE_BG })
                if (ln) page.drawText(ln, { x: M + 8, y: y - lh + 4, size, font: c, color: INK })
                y -= lh
            }
            y -= 10
        } else if (blk.kind === 'table') {
            const size = 10
            const lh = size * 1.4
            const cols = Math.max(...blk.rows.map((row) => row.length))
            const colW = (W - 2 * M) / cols
            y -= 4
            blk.rows.forEach((row, ri) => {
                const f = ri === 0 ? b : r
                const cells = Array.from({ length: cols }, (_, ci) =>
                    wrapText(toWinAnsi(inlineRuns(row[ci] ?? '').map((x) => x.text).join('')), colW - 10, (t) => f.widthOfTextAtSize(t, size)))
                const rowH = Math.max(...cells.map((c) => c.length)) * lh + 6
                need(rowH)
                cells.forEach((lines, ci) => {
                    const x = M + ci * colW
                    page.drawRectangle({ x, y: y - rowH, width: colW, height: rowH, borderColor: RULE, borderWidth: 0.7, color: ri === 0 ? CODE_BG : undefined })
                    lines.forEach((ln, li) => ln && page.drawText(ln, { x: x + 5, y: y - 3 - (li + 1) * lh + 3, size, font: f, color: INK }))
                })
                y -= rowH
            })
            y -= 10
        } else {
            need(16)
            y -= 8
            page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.8, color: RULE })
            y -= 8
        }
    }
    return doc.save()
}

/** True when every character except emoji can be drawn with the built-in PDF fonts (Latin script). */
export const latinOnly = (s: string) => {
    const t = s.replace(EMOJI, '').replace(/\r\n?/g, '\n')
    return toWinAnsi(t).split('?').length === t.split('?').length
}

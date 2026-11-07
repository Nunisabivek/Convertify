import type * as PdfLibNs from 'pdf-lib'
import type { PDFDocument, PDFFont, PDFPage } from 'pdf-lib'
import { applyEdits, planTextRemoval, scanTextOps, type PlacedItem } from './content-stream.ts'
import { fromHex, unit } from './color.ts'
import type { Pt } from './geometry.ts'
import { cmdsToSvg, markupPrims, type Markup, type MeasureText } from './markup.ts'
import { frameMapper, type PageFrame } from './viewport.ts'

type PdfLib = typeof PdfLibNs

/** Where replacement text goes, in PDF user space. */
export type Placement = {
    origin: Pt
    /** Degrees counter-clockwise. */
    angle: number
    size: number
    /** Width of the original text along its baseline. */
    width: number
    /** Polygon hiding the original when it can't be removed (user space). */
    cover: Pt[]
}

export type RegionEdit = {
    key: string
    page: number
    /** Real text: removed from the content stream when that is safe. */
    runKey?: string
    place: Placement
    /** "#rrggbb" for the new text; "#rrggbb" of the paper for the cover box. */
    color: string
    paper: string
    family?: 'sans' | 'serif' | 'mono'
    bold?: boolean
    /** Replacement text, or null to delete the original and write nothing. */
    text: string | null
}

export type PageInfo = { frame: PageFrame; items: PlacedItem[] }

export type ExportReport = {
    /** Labels removed from the content stream (no cover needed). */
    removed: string[]
    /** Labels hidden under a cover box. */
    covered: string[]
    /** Characters the standard PDF fonts can't draw, replaced. */
    substituted: number
}

const SUBSTITUTES: Record<string, string> = { '⌀': 'Ø', '∅': 'Ø', '×': 'x', '−': '-', '≈': '~', '≤': '<=', '≥': '>=', '′': "'", '″': '"' }

/** Text the standard (WinAnsi) fonts can draw: known look-alikes, otherwise "?". */
export function encodable(font: PDFFont, text: string): { text: string; substituted: number } {
    const set = new Set(font.getCharacterSet())
    let out = ''
    let n = 0
    for (const ch of text.replace(/[\r\n\t]+/g, ' ')) {
        if (set.has(ch.codePointAt(0)!)) out += ch
        else {
            const sub = SUBSTITUTES[ch]
            out += sub && [...sub].every((c) => set.has(c.codePointAt(0)!)) ? sub : '?'
            n++
        }
    }
    return { text: out, substituted: n }
}

function decodeContents(lib: PdfLib, page: PDFPage): string | null {
    const ctx = page.doc.context
    const contents = page.node.Contents()
    if (!contents) return null
    const parts: string[] = []
    const refs = contents instanceof lib.PDFArray ? contents.asArray() : [contents]
    for (const ref of refs) {
        const obj = ctx.lookup(ref)
        if (!(obj instanceof lib.PDFRawStream)) return null
        try {
            const bytes = lib.decodePDFRawStream(obj).decode()
            let s = ''
            for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
            parts.push(s)
        } catch {
            return null
        }
    }
    return parts.join('\n')
}

function encodeLatin1(s: string): Uint8Array {
    const out = new Uint8Array(s.length)
    for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i) & 0xff
    return out
}

/**
 * Removes edited real-text labels from a page's content stream where that's safe
 * (see content-stream.ts). Returns the labels that are fully gone.
 */
export function removeTextFromPage(lib: PdfLib, page: PDFPage, info: PageInfo, runKeys: Set<string>): Set<string> {
    if (!runKeys.size) return new Set()
    const src = decodeContents(lib, page)
    if (src == null) return new Set()
    const { shows, unbalancedQ } = scanTextOps(src)
    const plan = planTextRemoval(shows, info.items, runKeys)
    if (!plan.edits.length) return new Set()
    // Close any q the original left open so later drawing starts from a clean state.
    const out = 'q\n' + applyEdits(src, plan.edits) + '\n' + 'Q\n'.repeat(unbalancedQ + 1)
    const ctx = page.doc.context
    const ref = ctx.register(ctx.flateStream(encodeLatin1(out)))
    page.node.set(lib.PDFName.of('Contents'), ctx.obj([ref]))
    return plan.removedRuns
}

type Fonts = { sans: PDFFont; sansBold: PDFFont; serif: PDFFont; serifBold: PDFFont; mono: PDFFont; monoBold: PDFFont }

async function loadFonts(lib: PdfLib, doc: PDFDocument): Promise<Fonts> {
    const F = lib.StandardFonts
    const [sans, sansBold, serif, serifBold, mono, monoBold] = await Promise.all(
        [F.Helvetica, F.HelveticaBold, F.TimesRoman, F.TimesRomanBold, F.Courier, F.CourierBold].map((f) => doc.embedFont(f)),
    )
    return { sans, sansBold, serif, serifBold, mono, monoBold }
}

const rgbOf = (lib: PdfLib, hex: string) => {
    const [r, g, b] = unit(fromHex(hex))
    return lib.rgb(r, g, b)
}

/** pdf-lib's drawSvgPath flips y, so user-space points are written as (x, -y). */
const svgUser = (pts: Pt[]) => 'M ' + pts.map((p) => `${+p.x.toFixed(3)} ${+(-p.y).toFixed(3)}`).join(' L ') + ' Z'

/**
 * Applies text edits and markups to a loaded document. Text edits: remove the
 * original (content stream, else a cover box in the paper colour unless
 * `autocadMode`), then write the new text at the original baseline, size, angle
 * and colour. Markups are vector paths and text. Coordinates go through each page's
 * frame, so /Rotate and offset Media/CropBoxes land where they were drawn.
 */
export async function applyCadEdits(
    lib: PdfLib,
    doc: PDFDocument,
    pages: Map<number, PageInfo>,
    regions: RegionEdit[],
    markups: Markup[],
    opts: { autocadMode: boolean; onPage?: (done: number, total: number) => void | Promise<void> },
): Promise<ExportReport> {
    const fonts = await loadFonts(lib, doc)
    const pdfPages = doc.getPages()
    const report: ExportReport = { removed: [], covered: [], substituted: 0 }
    const touched = [...new Set([...regions.map((r) => r.page), ...markups.map((m) => m.page)])].sort((a, b) => a - b)
    let done = 0
    for (const pageNo of touched) {
        const page = pdfPages[pageNo - 1]
        const info = pages.get(pageNo)
        if (!page || !info) continue
        const mine = regions.filter((r) => r.page === pageNo)

        // Phase 1: remove original real text from the content stream.
        let removed = new Set<string>()
        try {
            removed = removeTextFromPage(lib, page, info, new Set(mine.filter((r) => r.runKey).map((r) => r.runKey!)))
        } catch (err) {
            console.warn('Text removal skipped for page', pageNo, err)
        }

        // Phase 2: cover what couldn't be removed, then write the new text.
        for (const r of mine) {
            const gone = !!r.runKey && removed.has(r.runKey)
            if (gone) report.removed.push(r.key)
            else if (!opts.autocadMode) {
                page.drawSvgPath(svgUser(r.place.cover), { x: 0, y: 0, color: rgbOf(lib, r.paper), borderWidth: 0 })
                report.covered.push(r.key)
            }
            if (r.text == null || !r.text.trim()) continue
            const family = r.family || 'sans'
            const font = r.bold ? fonts[`${family}Bold` as keyof Fonts] : fonts[family]
            const safe = encodable(font, r.text)
            report.substituted += safe.substituted
            page.drawText(safe.text, {
                x: r.place.origin.x,
                y: r.place.origin.y,
                size: r.place.size,
                font,
                color: rgbOf(lib, r.color),
                rotate: lib.degrees(r.place.angle),
            })
        }

        // Markups, as vector content.
        const map = frameMapper(info.frame)
        const pageMarkups = markups.filter((m) => m.page === pageNo)
        const measure: MeasureText = (t, size, bold) => {
            const f = bold ? fonts.sansBold : fonts.sans
            return f.widthOfTextAtSize(encodable(f, t).text, size)
        }
        for (const m of pageMarkups) {
            for (const p of markupPrims(m, measure)) {
                if (p.t === 'path') {
                    const d = cmdsToSvg(p.cmds, (q) => {
                        const u = map.toUser(q.x, q.y)
                        return { x: u.x, y: -u.y }
                    }, 3)
                    page.drawSvgPath(d, {
                        x: 0,
                        y: 0,
                        ...(p.fill ? { color: rgbOf(lib, p.fill), opacity: p.opacity ?? 1 } : {}),
                        ...(p.stroke ? { borderColor: rgbOf(lib, p.stroke), borderWidth: p.width, borderOpacity: p.opacity ?? 1 } : { borderWidth: 0 }),
                        ...(p.multiply ? { blendMode: lib.BlendMode.Multiply } : {}),
                        borderLineCap: lib.LineCapStyle.Round,
                    })
                } else {
                    const font = p.bold ? fonts.sansBold : fonts.sans
                    const safe = encodable(font, p.text)
                    report.substituted += safe.substituted
                    if (!safe.text.trim()) continue
                    const at = map.toUser(p.at.x, p.at.y)
                    const r = (p.angle * Math.PI) / 180
                    page.drawText(safe.text, {
                        x: at.x,
                        y: at.y,
                        size: p.size,
                        font,
                        color: rgbOf(lib, p.color),
                        rotate: lib.degrees(map.userAngleOf(Math.cos(r), Math.sin(r))),
                    })
                }
            }
        }
        done++
        await opts.onPage?.(done, touched.length)
    }
    return report
}

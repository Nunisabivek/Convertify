import { angleDiff, normDeg, orientedCorners, vecAngleDeg, type Pt } from './geometry.ts'

/** The fields of a pdf.js getTextContent item this module uses. */
export type RawTextItem = {
    str: string
    transform: number[]
    width: number
    height: number
    fontName?: string
}

/**
 * One editable line of real PDF text, in PDF user space. AutoCAD's TrueType
 * exports often write a label one word or one character per text operator, which
 * pdf.js reports as many items; runs join them back into the label a person sees.
 */
export type TextRun = {
    text: string
    /** Baseline start of the first glyph, in user space. */
    origin: Pt
    /** Reading direction, degrees counter-clockwise in user space (0 = left to right). */
    angle: number
    /** Font size in user-space units. */
    size: number
    /** Advance from origin to the end of the last glyph, along the baseline. */
    width: number
    /** Baseline start of every merged item (used to match content-stream operators). */
    starts: Pt[]
    /** True when the glyphs are mirrored (negative determinant): edit with care. */
    mirrored: boolean
    /** Indexes of the merged items in the input array. */
    itemIndexes: number[]
    /** pdf.js font id of the first item. */
    fontName?: string
}

type Item = {
    index: number
    fontName?: string
    str: string
    origin: Pt
    angle: number
    size: number
    width: number
    mirrored: boolean
    along: number
    across: number
}

export type MergeOptions = {
    /** Max angle difference (degrees) for two items to share a line. */
    angleTol?: number
    /** Max relative font-size difference. */
    sizeTol?: number
    /** Max baseline offset across the line, as a fraction of the font size. */
    baselineTol?: number
    /** Largest gap along the line that still joins two items, as a fraction of the font size. */
    maxGap?: number
    /** Gaps wider than this (fraction of font size) get a space when joined. */
    spaceGap?: number
}

const DEFAULTS: Required<MergeOptions> = { angleTol: 2, sizeTol: 0.2, baselineTol: 0.3, maxGap: 0.9, spaceGap: 0.18 }

export function itemFromRaw(raw: RawTextItem, index = 0): Item | null {
    if (!raw.str || !raw.str.trim()) return null
    const t = raw.transform
    if (!t || t.length < 6 || t.some((v) => !Number.isFinite(v))) return null
    const [a, b, c, d, e, f] = t
    const size = raw.height || Math.hypot(c, d)
    const width = raw.width || 0
    if (!(size > 0) || !(width > 0)) return null
    const angle = vecAngleDeg(a, b)
    const mirrored = a * d - b * c < 0
    const r = (angle * Math.PI) / 180
    const along = e * Math.cos(r) + f * Math.sin(r)
    const across = -e * Math.sin(r) + f * Math.cos(r)
    return { index, fontName: raw.fontName, str: raw.str, origin: { x: e, y: f }, angle, size, width, mirrored, along, across }
}

/**
 * Join same-line text items into runs: same angle and size, baselines within a
 * fraction of the font size, and a small gap between one item's end and the next
 * item's start. Separate labels further apart than `maxGap` stay separate.
 */
export function mergeTextItems(raws: RawTextItem[], opts: MergeOptions = {}): TextRun[] {
    const o = { ...DEFAULTS, ...opts }
    const items = raws.map((r, i) => itemFromRaw(r, i)).filter((x): x is Item => !!x)

    // Bucket by direction first so the along/across projections are comparable.
    const groups: Item[][] = []
    for (const it of items) {
        const g = groups.find((gr) => angleDiff(gr[0].angle, it.angle) <= o.angleTol && gr[0].mirrored === it.mirrored)
        if (g) g.push(it)
        else groups.push([it])
    }

    const runs: TextRun[] = []
    for (const g of groups) {
        // Re-project with the group's reference angle so tiny angle noise doesn't skew lines.
        const ref = (g[0].angle * Math.PI) / 180
        const cos = Math.cos(ref)
        const sin = Math.sin(ref)
        for (const it of g) {
            it.along = it.origin.x * cos + it.origin.y * sin
            it.across = -it.origin.x * sin + it.origin.y * cos
        }
        // Lines: sort by baseline offset, then sweep.
        const sorted = [...g].sort((p, q) => p.across - q.across)
        const lines: Item[][] = []
        for (const it of sorted) {
            const line = lines.find((ln) => {
                const head = ln[0]
                return (
                    Math.abs(head.across - it.across) <= o.baselineTol * Math.max(head.size, it.size) &&
                    Math.abs(head.size - it.size) <= o.sizeTol * Math.max(head.size, it.size)
                )
            })
            if (line) line.push(it)
            else lines.push([it])
        }
        for (const line of lines) {
            line.sort((p, q) => p.along - q.along)
            let cur: Item[] = []
            let curEnd = -Infinity
            const flush = () => {
                if (cur.length) runs.push(toRun(cur, o.spaceGap))
                cur = []
                curEnd = -Infinity
            }
            for (const it of line) {
                if (cur.length) {
                    const size = Math.max(cur[0].size, it.size)
                    const gap = it.along - curEnd
                    const last = cur[cur.length - 1]
                    const overprint = it.str === last.str && Math.abs(it.along - last.along) < 0.2 * size
                    if (!overprint && (gap > o.maxGap * size || gap < -0.6 * size - 0.25 * it.width)) flush()
                }
                cur.push(it)
                curEnd = Math.max(curEnd, it.along + it.width)
            }
            flush()
        }
    }
    // Stable reading order: top of the page first, then left to right.
    runs.sort((p, q) => q.origin.y - p.origin.y || p.origin.x - q.origin.x)
    return runs
}

function toRun(items: Item[], spaceGap: number): TextRun {
    const first = items[0]
    let text = ''
    let end = first.along
    let prev: Item | null = null
    for (const it of items) {
        // Fake bold: the same string drawn again a hair to the side.
        if (prev && it.str === prev.str && Math.abs(it.along - prev.along) < 0.2 * it.size) continue
        prev = it
        if (text) {
            const gap = it.along - end
            const needsSpace = gap > spaceGap * it.size && !/\s$/.test(text) && !/^\s/.test(it.str)
            if (needsSpace) text += ' '
        }
        text += it.str
        end = Math.max(end, it.along + it.width)
    }
    const sizes = items.map((i) => i.size).sort((a, b) => a - b)
    return {
        text: text.replace(/\s+/g, ' ').trim(),
        origin: first.origin,
        angle: normDeg(first.angle),
        size: sizes[Math.floor(sizes.length / 2)],
        width: end - first.along,
        starts: items.map((i) => i.origin),
        mirrored: first.mirrored,
        itemIndexes: items.map((i) => i.index),
        fontName: first.fontName,
    }
}

/** Font ascent/descent as fractions of the font size, for hit boxes and cover boxes. */
export const ASCENT = 0.8
export const DESCENT = 0.22

/** The run's box corners in user space (start-bottom, end-bottom, end-top, start-top). */
export function runCorners(run: TextRun, pad = 0): Pt[] {
    const p = pad * run.size
    const r = (run.angle * Math.PI) / 180
    const origin = { x: run.origin.x - p * Math.cos(r), y: run.origin.y - p * Math.sin(r) }
    return orientedCorners(origin, run.angle, run.width + 2 * p, (DESCENT + pad) * run.size, (ASCENT + pad) * run.size)
}

/** Every non-blank item, placed in user space and tagged with its run's key (for text removal). */
export function placedItems(raws: RawTextItem[], runs: TextRun[], keyOf: (run: TextRun, index: number) => string) {
    const owner = new Map<number, string>()
    runs.forEach((run, k) => run.itemIndexes.forEach((i) => owner.set(i, keyOf(run, k))))
    const out: Array<{ pos: Pt; angle: number; size: number; width: number; runKey: string }> = []
    raws.forEach((raw, i) => {
        const it = itemFromRaw(raw, i)
        if (!it) return
        out.push({ pos: it.origin, angle: it.angle, size: it.size, width: it.width, runKey: owner.get(i) ?? '' })
    })
    return out
}

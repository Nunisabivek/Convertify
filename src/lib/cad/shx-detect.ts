import { overlapArea, padBox, type Box } from './geometry.ts'

/**
 * Finds SHX-style text: letters AutoCAD draws as vector strokes, so there is no
 * text to extract. Works on the rendered page: dark pixels → connected components
 * (roughly one per letter) → letters grouped into lines, horizontally first and
 * then vertically for the components left over (vertical dimension text).
 * All sizes are in canvas pixels; options take points × render scale.
 */
export type Component = { minX: number; minY: number; maxX: number; maxY: number; count: number }
export type GlyphGroup = Box & { vertical: boolean; count: number }

/** 1 for "ink": any pixel clearly darker or more coloured than white paper. */
export function binarize(rgba: Uint8ClampedArray | Uint8Array, w: number, h: number, inkBelow = 185): Uint8Array {
    const out = new Uint8Array(w * h)
    for (let p = 0, j = 0; j < out.length; p += 4, j++) {
        const m = Math.min(rgba[p], rgba[p + 1], rgba[p + 2])
        out[j] = m < inkBelow ? 1 : 0
    }
    return out
}

/** Clears pixels inside the boxes (e.g. real text that getTextContent already found). */
export function maskBoxes(binary: Uint8Array, w: number, h: number, boxes: Box[]): void {
    for (const b of boxes) {
        const x0 = Math.max(0, Math.floor(b.x))
        const y0 = Math.max(0, Math.floor(b.y))
        const x1 = Math.min(w, Math.ceil(b.x + b.w))
        const y1 = Math.min(h, Math.ceil(b.y + b.h))
        for (let y = y0; y < y1; y++) binary.fill(0, y * w + x0, y * w + x1)
    }
}

/**
 * 8-connected components. `pause` is awaited every ~1.5 M scanned pixels so a big
 * sheet doesn't freeze the page; tests call it without one.
 */
export async function findComponents(
    binary: Uint8Array,
    w: number,
    h: number,
    pause?: () => Promise<void>,
    maxDim = Infinity,
): Promise<Component[]> {
    const visited = new Uint8Array(w * h)
    const out: Component[] = []
    const stack: number[] = []
    let work = 0
    for (let i = 0; i < binary.length; i++) {
        if (pause && ++work >= 1_500_000) {
            work = 0
            await pause()
        }
        if (!binary[i] || visited[i]) continue
        let minX = w
        let minY = h
        let maxX = 0
        let maxY = 0
        let count = 0
        visited[i] = 1
        stack.length = 0
        stack.push(i)
        while (stack.length) {
            const px = stack.pop()!
            const x = px % w
            const y = (px - x) / w
            if (x < minX) minX = x
            if (x > maxX) maxX = x
            if (y < minY) minY = y
            if (y > maxY) maxY = y
            count++
            // 8-connected: thin diagonal strokes are often joined only at corners.
            const left = x > 0
            const right = x < w - 1
            for (const row of [y > 0 ? px - w : -1, px, y < h - 1 ? px + w : -1]) {
                if (row < 0) continue
                let n: number
                if (left && binary[(n = row - 1)] && !visited[n]) { visited[n] = 1; stack.push(n) }
                if (row !== px && binary[row] && !visited[row]) { visited[row] = 1; stack.push(row) }
                if (right && binary[(n = row + 1)] && !visited[n]) { visited[n] = 1; stack.push(n) }
            }
        }
        work += count
        // Long lines and big outlines are never letters; don't keep millions of them.
        if (maxX - minX + 1 <= maxDim && maxY - minY + 1 <= maxDim) out.push({ minX, minY, maxX, maxY, count })
    }
    return out
}

export type GroupOptions = {
    /** Render scale (canvas px per point). */
    scale: number
    /** Smallest and largest letter height to accept, in points. */
    minTextPt?: number
    maxTextPt?: number
    /** Largest gap between letters of one line, as a multiple of the letter height. */
    gapFactor?: number
}

const defaults = { minTextPt: 4.5, maxTextPt: 60, gapFactor: 0.9 }

type Ax = { lo: number; hi: number; clo: number; chi: number }

/** Union-find grouping along one axis. `main` reads along the line, `cross` across it. */
function groupAlong(
    comps: Component[],
    idx: number[],
    vertical: boolean,
    minText: number,
    gapFactor: number,
): number[][] {
    const ax = (c: Component): Ax =>
        vertical ? { lo: c.minY, hi: c.maxY, clo: c.minX, chi: c.maxX } : { lo: c.minX, hi: c.maxX, clo: c.minY, chi: c.maxY }
    const parent = idx.map((_, k) => k)
    const find = (k: number): number => {
        while (parent[k] !== k) {
            parent[k] = parent[parent[k]]
            k = parent[k]
        }
        return k
    }
    const cell = Math.max(16, Math.round(minText * 4))
    const grid = new Map<number, number[]>()
    const keyOf = (gx: number, gy: number) => gx * 1_000_003 + gy
    const reach = (c: Component) => {
        const a = ax(c)
        return gapFactor * Math.max(a.chi - a.clo + 1, minText)
    }
    idx.forEach((ci, k) => {
        const c = comps[ci]
        const r = reach(c)
        const gx0 = Math.floor((c.minX - r) / cell)
        const gx1 = Math.floor((c.maxX + r) / cell)
        const gy0 = Math.floor((c.minY - r) / cell)
        const gy1 = Math.floor((c.maxY + r) / cell)
        for (let gx = gx0; gx <= gx1; gx++)
            for (let gy = gy0; gy <= gy1; gy++) {
                const key = keyOf(gx, gy)
                const list = grid.get(key)
                if (list) list.push(k)
                else grid.set(key, [k])
            }
    })
    idx.forEach((ci, k) => {
        const a = ax(comps[ci])
        const c = comps[ci]
        const gx0 = Math.floor(c.minX / cell)
        const gx1 = Math.floor(c.maxX / cell)
        const gy0 = Math.floor(c.minY / cell)
        const gy1 = Math.floor(c.maxY / cell)
        for (let gx = gx0; gx <= gx1; gx++)
            for (let gy = gy0; gy <= gy1; gy++) {
                for (const j of grid.get(keyOf(gx, gy)) || []) {
                    if (j === k || find(j) === find(k)) continue
                    const b = ax(comps[idx[j]])
                    const href = Math.max(a.chi - a.clo + 1, b.chi - b.clo + 1, minText)
                    const crossOverlap = Math.min(a.chi, b.chi) - Math.max(a.clo, b.clo)
                    if (crossOverlap < -0.15 * href) continue
                    // Letters of one line share most of their height.
                    const smaller = Math.min(a.chi - a.clo + 1, b.chi - b.clo + 1)
                    if (crossOverlap < 0.3 * smaller && smaller > 0.35 * href) continue
                    const gap = Math.max(a.lo, b.lo) - Math.min(a.hi, b.hi)
                    if (gap > gapFactor * href) continue
                    parent[find(j)] = find(k)
                }
            }
    })
    const groups = new Map<number, number[]>()
    idx.forEach((ci, k) => {
        const r = find(k)
        const g = groups.get(r)
        if (g) g.push(ci)
        else groups.set(r, [ci])
    })
    return [...groups.values()]
}

function textLike(comps: Component[], members: number[], vertical: boolean, minText: number, maxText: number): GlyphGroup | null {
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    let ink = 0
    for (const i of members) {
        const c = comps[i]
        if (c.minX < minX) minX = c.minX
        if (c.minY < minY) minY = c.minY
        if (c.maxX > maxX) maxX = c.maxX
        if (c.maxY > maxY) maxY = c.maxY
        ink += c.count
    }
    const w = maxX - minX + 1
    const h = maxY - minY + 1
    const height = vertical ? w : h
    const length = vertical ? h : w
    if (height < minText || height > maxText * 1.3) return null
    if (length > 60 * height) return null
    const n = members.length
    // Most parts of a line of text are letters about as tall as the line.
    const heights = members.map((i) => (vertical ? comps[i].maxX - comps[i].minX + 1 : comps[i].maxY - comps[i].minY + 1)).sort((a, b) => a - b)
    const median = heights[Math.floor(heights.length / 2)]
    if (median < 0.4 * height) return null
    const density = ink / (w * h)
    if (density > 0.6) return null
    // Letters sit side by side; hatch lines and other repeated strokes overlap along the
    // line and are packed far tighter than letters ever are.
    let sumLen = 0
    for (const i of members) sumLen += vertical ? comps[i].maxY - comps[i].minY + 1 : comps[i].maxX - comps[i].minX + 1
    if (sumLen > 1.3 * length) return null
    if (length / n < 0.25 * height) return null
    if (n >= 3) {
        if (length < 1.0 * height) return null
    } else if (n === 2) {
        // Two letters ("50", "A1"): both full height, side by side.
        if (heights[0] < 0.6 * height || length < 0.9 * height || length > 3.2 * height) return null
    } else return null
    return { x: minX, y: minY, w, h, vertical, count: n }
}

/** Groups letter-sized components into lines of text (horizontal first, then vertical). */
export function groupGlyphs(comps: Component[], opts: GroupOptions): GlyphGroup[] {
    const o = { ...defaults, ...opts }
    const minText = o.minTextPt * o.scale
    const maxText = o.maxTextPt * o.scale
    const maxGlyph = maxText * 1.4
    const cand: number[] = []
    comps.forEach((c, i) => {
        const w = c.maxX - c.minX + 1
        const h = c.maxY - c.minY + 1
        if (Math.max(w, h) > maxGlyph) return
        if (c.count < 2 && Math.max(w, h) < 2) return
        cand.push(i)
    })
    const out: GlyphGroup[] = []
    const used = new Set<number>()
    for (const g of groupAlong(comps, cand, false, minText, o.gapFactor)) {
        const t = textLike(comps, g, false, minText, maxText)
        if (t) {
            out.push(t)
            for (const i of g) used.add(i)
        }
    }
    const rest = cand.filter((i) => !used.has(i))
    for (const g of groupAlong(comps, rest, true, minText, o.gapFactor)) {
        const t = textLike(comps, g, true, minText, maxText)
        if (t) out.push(t)
    }
    return out
}

/** Drops pixel groups that mostly overlap a real-text box (already editable as text). */
export function dropOverlapping<T extends Box>(groups: T[], textBoxes: Box[], frac = 0.3, pad = 0): T[] {
    const boxes = pad ? textBoxes.map((b) => padBox(b, pad)) : textBoxes
    return groups.filter((g) => {
        const area = g.w * g.h || 1
        let covered = 0
        for (const b of boxes) covered += overlapArea(g, b)
        return covered / area < frac
    })
}

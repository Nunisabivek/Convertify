import type { Box } from './geometry.ts'

export type RGB = { r: number; g: number; b: number } // 0..255

/**
 * The colour of the text drawn inside `box` on a rendered page (RGBA pixels).
 * The background is the most common colour in the box; ink is what differs from
 * it. Thin strokes are anti-aliased towards the background, so the strongest ink
 * pixels are used, and the most common of those wins (a red dimension line
 * crossing black text doesn't turn the text red). Near-black snaps to black.
 * Returns null when the box holds no ink.
 */
export function sampleInkColor(rgba: Uint8ClampedArray | Uint8Array, imgW: number, imgH: number, box: Box): RGB | null {
    return sampleColors(rgba, imgW, imgH, box).ink
}

/** Ink colour (null when there is none) and paper colour inside `box`. */
export function sampleColors(rgba: Uint8ClampedArray | Uint8Array, imgW: number, imgH: number, box: Box): { ink: RGB | null; bg: RGB } {
    const white = { r: 255, g: 255, b: 255 }
    const x0 = Math.max(0, Math.floor(box.x))
    const y0 = Math.max(0, Math.floor(box.y))
    const x1 = Math.min(imgW, Math.ceil(box.x + box.w))
    const y1 = Math.min(imgH, Math.ceil(box.y + box.h))
    if (x1 <= x0 || y1 <= y0) return { ink: null, bg: white }
    const area = (x1 - x0) * (y1 - y0)
    const step = Math.max(1, Math.floor(Math.sqrt(area / 40000)))

    // Background: the commonest colour (5 bits per channel).
    const bgHist = new Map<number, number>()
    for (let y = y0; y < y1; y += step)
        for (let x = x0; x < x1; x += step) {
            const p = (y * imgW + x) * 4
            const k = ((rgba[p] >> 3) << 10) | ((rgba[p + 1] >> 3) << 5) | (rgba[p + 2] >> 3)
            bgHist.set(k, (bgHist.get(k) || 0) + 1)
        }
    let bgKey = 0
    let bgCount = -1
    for (const [k, n] of bgHist) if (n > bgCount) { bgKey = k; bgCount = n }
    let bg = { r: ((bgKey >> 10) << 3) + 4, g: (((bgKey >> 5) & 31) << 3) + 4, b: ((bgKey & 31) << 3) + 4 }
    // Paper within a hair of white is white (the bins are 8 wide).
    if (bg.r >= 244 && bg.g >= 244 && bg.b >= 244) bg = white

    type Px = { r: number; g: number; b: number; d: number }
    const ink: Px[] = []
    let maxD = 0
    for (let y = y0; y < y1; y += step)
        for (let x = x0; x < x1; x += step) {
            const p = (y * imgW + x) * 4
            const r = rgba[p]
            const g = rgba[p + 1]
            const b = rgba[p + 2]
            const d = Math.max(Math.abs(r - bg.r), Math.abs(g - bg.g), Math.abs(b - bg.b))
            if (d < 60) continue
            ink.push({ r, g, b, d })
            if (d > maxD) maxD = d
        }
    if (!ink.length) return { ink: null, bg }
    const strong = ink.filter((p) => p.d >= 0.7 * maxD)
    const hist = new Map<number, Px[]>()
    for (const p of strong) {
        const k = ((p.r >> 4) << 8) | ((p.g >> 4) << 4) | (p.b >> 4)
        const list = hist.get(k)
        if (list) list.push(p)
        else hist.set(k, [p])
    }
    let best: Px[] = []
    for (const list of hist.values()) if (list.length > best.length) best = list
    const avg = (f: (p: Px) => number) => Math.round(best.reduce((s, p) => s + f(p), 0) / best.length)
    return { ink: snapColor({ r: avg((p) => p.r), g: avg((p) => p.g), b: avg((p) => p.b) }), bg }
}

/** Near-black and near-grey-dark become pure black; everything else is kept. */
export function snapColor(c: RGB): RGB {
    const max = Math.max(c.r, c.g, c.b)
    const min = Math.min(c.r, c.g, c.b)
    const lum = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b
    if (lum < 100 && max - min < 40) return { r: 0, g: 0, b: 0 }
    return c
}

export function toHex(c: RGB): string {
    const h = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
    return `#${h(c.r)}${h(c.g)}${h(c.b)}`
}

export function fromHex(hex: string): RGB {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
    if (!m) return { r: 0, g: 0, b: 0 }
    const v = parseInt(m[1], 16)
    return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 }
}

/** 0..1 channels for pdf-lib's rgb(). */
export function unit(c: RGB): [number, number, number] {
    return [c.r / 255, c.g / 255, c.b / 255]
}

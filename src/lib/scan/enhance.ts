/**
 * Document enhancement that survives real lighting. The old filters cut at one
 * fixed brightness, so a hand's shadow turned half the page grey. These first
 * estimate how bright the bare paper is in every part of the page (the
 * lighting), divide it out so the paper is evenly white, then apply the look.
 * Pure typed-array code for the worker, the main-thread fallback and tests.
 */

export type ScanMode = 'original' | 'auto' | 'gray' | 'bw'

/** Grid of local paper brightness for one channel (or luminance), smoothed. */
function paperGrid(
    px: Uint8ClampedArray,
    w: number,
    h: number,
    cell: number,
    pick: (i: number) => number,
): { grid: Float32Array; gw: number; gh: number } {
    const gw = Math.ceil(w / cell)
    const gh = Math.ceil(h / cell)
    let grid = new Float32Array(gw * gh)
    const hist = new Uint32Array(64)
    let globalMax = 0
    for (let gy = 0; gy < gh; gy++) {
        for (let gx = 0; gx < gw; gx++) {
            hist.fill(0)
            let n = 0
            const x1 = Math.min(w, (gx + 1) * cell)
            const y1 = Math.min(h, (gy + 1) * cell)
            for (let y = gy * cell; y < y1; y += 2) {
                for (let x = gx * cell; x < x1; x += 2) {
                    hist[pick((y * w + x) << 2) >> 2]++
                    n++
                }
            }
            // 90th percentile: paper, not ink, unless the cell is nearly all ink.
            let need = Math.max(1, Math.floor(n * 0.1))
            let b = 63
            for (; b > 0; b--) {
                need -= hist[b]
                if (need <= 0) break
            }
            const v = b * 4 + 2
            grid[gy * gw + gx] = v
            if (v > globalMax) globalMax = v
        }
    }
    // Spread paper brightness into ink-heavy cells (max filter), then smooth.
    const tmp = new Float32Array(gw * gh)
    const maxPass = (src: Float32Array, dst: Float32Array) => {
        for (let y = 0; y < gh; y++)
            for (let x = 0; x < gw; x++) {
                let m = 0
                for (let dy = -1; dy <= 1; dy++)
                    for (let dx = -1; dx <= 1; dx++) {
                        const xx = Math.min(gw - 1, Math.max(0, x + dx))
                        const yy = Math.min(gh - 1, Math.max(0, y + dy))
                        const v = src[yy * gw + xx]
                        if (v > m) m = v
                    }
                dst[y * gw + x] = m
            }
    }
    const boxPass = (src: Float32Array, dst: Float32Array) => {
        for (let y = 0; y < gh; y++)
            for (let x = 0; x < gw; x++) {
                let s = 0
                let c = 0
                for (let dy = -1; dy <= 1; dy++)
                    for (let dx = -1; dx <= 1; dx++) {
                        const xx = x + dx
                        const yy = y + dy
                        if (xx < 0 || yy < 0 || xx >= gw || yy >= gh) continue
                        s += src[yy * gw + xx]
                        c++
                    }
                dst[y * gw + x] = s / c
            }
    }
    maxPass(grid, tmp)
    boxPass(tmp, grid)
    boxPass(grid, tmp)
    grid = tmp
    // A photo or dark box printed on the page must not be blown out to white.
    const floor = globalMax * 0.45
    for (let i = 0; i < grid.length; i++) if (grid[i] < floor) grid[i] = floor
    return { grid, gw, gh }
}

/** Per-pixel bilinear lookup tables into a grid sampled at cell centres. */
function axisTable(len: number, cell: number, cells: number) {
    const i0 = new Int32Array(len)
    const f = new Float32Array(len)
    for (let p = 0; p < len; p++) {
        const g = (p + 0.5) / cell - 0.5
        const a = Math.max(0, Math.min(cells - 1, Math.floor(g)))
        i0[p] = a
        f[p] = cells === 1 ? 0 : Math.max(0, Math.min(1, g - a))
    }
    return { i0, f }
}

const LUT_SIZE = 1280 // normalised value n = v / paper, indexed by n * 1024 (up to 1.25)

function lut(fn: (n: number) => number): Uint8ClampedArray {
    const t = new Uint8ClampedArray(LUT_SIZE)
    for (let i = 0; i < LUT_SIZE; i++) t[i] = Math.round(255 * Math.max(0, Math.min(1, fn(i / 1024))))
    return t
}

const smooth = (e0: number, e1: number, x: number) => {
    const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)))
    return t * t * (3 - 2 * t)
}

// Looks, as curves of n (1 = bare paper). Built once.
const GRAY = lut((n) => Math.pow(Math.max(0, (n - 0.1) / 0.82), 1.25))
const BW = lut((n) => smooth(0.58, 0.82, n))
const COLOR = lut((n) => Math.pow(Math.max(0, (n - 0.08) / 0.86), 1.2))

const luma = (px: Uint8ClampedArray, i: number) => (px[i] * 77 + px[i + 1] * 150 + px[i + 2] * 29) >> 8

/** Enhances an RGBA page in place. */
export function enhance(px: Uint8ClampedArray, w: number, h: number, mode: ScanMode): void {
    if (mode === 'original' || w < 2 || h < 2) return
    const cell = Math.max(8, Math.ceil(Math.max(w, h) / 80))
    const gx = axisTable(w, cell, Math.ceil(w / cell))
    const gy = axisTable(h, cell, Math.ceil(h / cell))

    const sample = (g: { grid: Float32Array; gw: number; gh: number }, x: number, y: number) => {
        const x0 = gx.i0[x]
        const y0 = gy.i0[y]
        const x1 = Math.min(g.gw - 1, x0 + 1)
        const y1 = Math.min(g.gh - 1, y0 + 1)
        const fx = gx.f[x]
        const fy = gy.f[y]
        const a = g.grid[y0 * g.gw + x0] * (1 - fx) + g.grid[y0 * g.gw + x1] * fx
        const b = g.grid[y1 * g.gw + x0] * (1 - fx) + g.grid[y1 * g.gw + x1] * fx
        return a * (1 - fy) + b * fy
    }
    const idx = (v: number, paper: number) => {
        const k = ((v * 1024) / paper) | 0
        return k < LUT_SIZE ? k : LUT_SIZE - 1
    }

    if (mode === 'gray' || mode === 'bw') {
        const table = mode === 'bw' ? BW : GRAY
        const g = paperGrid(px, w, h, cell, (i) => luma(px, i))
        for (let y = 0; y < h; y++) {
            let i = y * w * 4
            for (let x = 0; x < w; x++, i += 4) {
                const v = table[idx(luma(px, i), sample(g, x, y))]
                px[i] = px[i + 1] = px[i + 2] = v
            }
        }
        return
    }

    // auto: per-channel paper estimate also removes yellow or blue colour casts,
    // then a gentle saturation lift keeps stamps and signatures coloured.
    const R = paperGrid(px, w, h, cell, (i) => px[i])
    const G = paperGrid(px, w, h, cell, (i) => px[i + 1])
    const B = paperGrid(px, w, h, cell, (i) => px[i + 2])
    for (let y = 0; y < h; y++) {
        let i = y * w * 4
        for (let x = 0; x < w; x++, i += 4) {
            let r = COLOR[idx(px[i], sample(R, x, y))]
            let g = COLOR[idx(px[i + 1], sample(G, x, y))]
            let b = COLOR[idx(px[i + 2], sample(B, x, y))]
            const l = (r * 77 + g * 150 + b * 29) >> 8
            if (l < 235) {
                r = l + (r - l) * 1.3
                g = l + (g - l) * 1.3
                b = l + (b - l) * 1.3
            }
            px[i] = r
            px[i + 1] = g
            px[i + 2] = b
        }
    }
}

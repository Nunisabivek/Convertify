/**
 * Exact perspective correction for scanned pages. A projective map (not the
 * old 4x4 grid of affine triangles) keeps every text line straight however
 * steep the angle. Pure typed-array code: it runs in the scan worker, on the
 * main thread as a fallback, and in node tests.
 */

export interface Pt {
    x: number
    y: number
}

export interface Corners {
    tl: Pt
    tr: Pt
    br: Pt
    bl: Pt
}

/** Solves A x = b in place (Gaussian elimination, partial pivoting). */
function solve(A: number[][], b: number[]): number[] {
    const n = b.length
    for (let c = 0; c < n; c++) {
        let p = c
        for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r
        if (Math.abs(A[p][c]) < 1e-12) throw new Error('degenerate quad')
        ;[A[c], A[p]] = [A[p], A[c]]
        ;[b[c], b[p]] = [b[p], b[c]]
        for (let r = c + 1; r < n; r++) {
            const f = A[r][c] / A[c][c]
            for (let k = c; k < n; k++) A[r][k] -= f * A[c][k]
            b[r] -= f * b[c]
        }
    }
    const x = new Array(n).fill(0)
    for (let r = n - 1; r >= 0; r--) {
        let s = b[r]
        for (let k = r + 1; k < n; k++) s -= A[r][k] * x[k]
        x[r] = s / A[r][r]
    }
    return x
}

/**
 * Homography H (row-major, 9 values, H[8] = 1) taking output pixel (u, v) of a
 * w x h page to the source point inside the quad: (0,0) → tl, (w,0) → tr,
 * (w,h) → br, (0,h) → bl.
 */
export function rectToQuad(w: number, h: number, q: Corners): number[] {
    const pairs: [number, number, Pt][] = [
        [0, 0, q.tl],
        [w, 0, q.tr],
        [w, h, q.br],
        [0, h, q.bl],
    ]
    const A: number[][] = []
    const b: number[] = []
    for (const [u, v, p] of pairs) {
        A.push([u, v, 1, 0, 0, 0, -u * p.x, -v * p.x])
        b.push(p.x)
        A.push([0, 0, 0, u, v, 1, -u * p.y, -v * p.y])
        b.push(p.y)
    }
    return [...solve(A, b), 1]
}

/** Maps an output-page point through H. */
export function applyH(H: number[], u: number, v: number): Pt {
    const d = H[6] * u + H[7] * v + 1
    return { x: (H[0] * u + H[1] * v + H[2]) / d, y: (H[3] * u + H[4] * v + H[5]) / d }
}

/**
 * Flattens the quad of an RGBA image into a dw x dh RGBA page, bilinear
 * sampled. The numerators and denominator step by a constant per pixel, so the
 * inner loop has one divide.
 */
export function warpPerspective(
    src: Uint8ClampedArray,
    sw: number,
    sh: number,
    quad: Corners,
    dw: number,
    dh: number,
): Uint8ClampedArray {
    const H = rectToQuad(dw, dh, quad)
    const out = new Uint8ClampedArray(dw * dh * 4)
    const maxX = sw - 1
    const maxY = sh - 1
    let o = 0
    for (let y = 0; y < dh; y++) {
        const v = y + 0.5
        let nx = H[0] * 0.5 + H[1] * v + H[2]
        let ny = H[3] * 0.5 + H[4] * v + H[5]
        let nd = H[6] * 0.5 + H[7] * v + 1
        for (let x = 0; x < dw; x++) {
            // Source position of this pixel's centre, in pixel-index space.
            let sx = nx / nd - 0.5
            let sy = ny / nd - 0.5
            if (sx < 0) sx = 0
            else if (sx > maxX) sx = maxX
            if (sy < 0) sy = 0
            else if (sy > maxY) sy = maxY
            const x0 = sx | 0
            const y0 = sy | 0
            const x1 = x0 < maxX ? x0 + 1 : x0
            const y1 = y0 < maxY ? y0 + 1 : y0
            const fx = sx - x0
            const fy = sy - y0
            const i00 = (y0 * sw + x0) << 2
            const i10 = (y0 * sw + x1) << 2
            const i01 = (y1 * sw + x0) << 2
            const i11 = (y1 * sw + x1) << 2
            const w00 = (1 - fx) * (1 - fy)
            const w10 = fx * (1 - fy)
            const w01 = (1 - fx) * fy
            const w11 = fx * fy
            out[o] = src[i00] * w00 + src[i10] * w10 + src[i01] * w01 + src[i11] * w11
            out[o + 1] = src[i00 + 1] * w00 + src[i10 + 1] * w10 + src[i01 + 1] * w01 + src[i11 + 1] * w11
            out[o + 2] = src[i00 + 2] * w00 + src[i10 + 2] * w10 + src[i01 + 2] * w01 + src[i11 + 2] * w11
            out[o + 3] = 255
            o += 4
            nx += H[0]
            ny += H[3]
            nd += H[6]
        }
    }
    return out
}

/** Quarter-turn rotation of an RGBA buffer (clockwise degrees: 0, 90, 180, 270). */
export function rotateRGBA(
    src: Uint8ClampedArray,
    w: number,
    h: number,
    degrees: number,
): { data: Uint8ClampedArray; width: number; height: number } {
    const turn = ((Math.round(degrees / 90) % 4) + 4) % 4
    if (turn === 0) return { data: src, width: w, height: h }
    const sideways = turn % 2 === 1
    const ow = sideways ? h : w
    const oh = sideways ? w : h
    const out = new Uint8ClampedArray(ow * oh * 4)
    const s32 = new Uint32Array(src.buffer, src.byteOffset, w * h)
    const o32 = new Uint32Array(out.buffer)
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let ox: number
            let oy: number
            if (turn === 1) {
                ox = h - 1 - y
                oy = x
            } else if (turn === 2) {
                ox = w - 1 - x
                oy = h - 1 - y
            } else {
                ox = y
                oy = w - 1 - x
            }
            o32[oy * ow + ox] = s32[y * w + x]
        }
    }
    return { data: out, width: ow, height: oh }
}

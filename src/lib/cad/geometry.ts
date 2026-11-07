/**
 * Small 2-D helpers shared by the AutoCAD PDF editor. A matrix is the PDF
 * six-number form [a b c d e f]: x' = a·x + c·y + e, y' = b·x + d·y + f.
 */
export type Mat = [number, number, number, number, number, number]
export type Pt = { x: number; y: number }
export type Box = { x: number; y: number; w: number; h: number }

export const IDENTITY: Mat = [1, 0, 0, 1, 0, 0]

/** m1 then m2 (PDF order: `m1 cm` inside `m2`), i.e. m1 × m2. */
export function mul(m1: Mat, m2: Mat): Mat {
    return [
        m1[0] * m2[0] + m1[1] * m2[2],
        m1[0] * m2[1] + m1[1] * m2[3],
        m1[2] * m2[0] + m1[3] * m2[2],
        m1[2] * m2[1] + m1[3] * m2[3],
        m1[4] * m2[0] + m1[5] * m2[2] + m2[4],
        m1[4] * m2[1] + m1[5] * m2[3] + m2[5],
    ]
}

export function invert(m: Mat): Mat {
    const det = m[0] * m[3] - m[1] * m[2]
    if (!det) throw new Error('matrix is not invertible')
    return [
        m[3] / det,
        -m[1] / det,
        -m[2] / det,
        m[0] / det,
        (m[2] * m[5] - m[3] * m[4]) / det,
        (m[1] * m[4] - m[0] * m[5]) / det,
    ]
}

export function apply(m: Mat, x: number, y: number): Pt {
    return { x: m[0] * x + m[2] * y + m[4], y: m[1] * x + m[3] * y + m[5] }
}

/** Apply only the linear part (directions, not positions). */
export function applyLinear(m: Mat, x: number, y: number): Pt {
    return { x: m[0] * x + m[2] * y, y: m[1] * x + m[3] * y }
}

/** Angle in degrees normalised to (-180, 180]. */
export function normDeg(deg: number): number {
    let d = deg % 360
    if (d <= -180) d += 360
    if (d > 180) d -= 360
    return d
}

/** Smallest absolute difference between two angles, in degrees (0..180). */
export function angleDiff(a: number, b: number): number {
    return Math.abs(normDeg(a - b))
}

export function vecAngleDeg(x: number, y: number): number {
    return normDeg((Math.atan2(y, x) * 180) / Math.PI)
}

export function dist(a: Pt, b: Pt): number {
    return Math.hypot(b.x - a.x, b.y - a.y)
}

export function boundsOf(pts: Pt[]): Box {
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    for (const p of pts) {
        if (p.x < minX) minX = p.x
        if (p.y < minY) minY = p.y
        if (p.x > maxX) maxX = p.x
        if (p.y > maxY) maxY = p.y
    }
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
}

export function overlapArea(a: Box, b: Box): number {
    const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)
    const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)
    return w > 0 && h > 0 ? w * h : 0
}

export function padBox(b: Box, px: number, py = px): Box {
    return { x: b.x - px, y: b.y - py, w: b.w + 2 * px, h: b.h + 2 * py }
}

/**
 * Corners of a box that starts at `origin`, runs `along` units in direction
 * `angleDeg` and spans from `-below` to `+above` across it (counter-clockwise
 * normal, y up). Order: start-bottom, end-bottom, end-top, start-top.
 */
export function orientedCorners(origin: Pt, angleDeg: number, along: number, below: number, above: number): Pt[] {
    const r = (angleDeg * Math.PI) / 180
    const ux = Math.cos(r)
    const uy = Math.sin(r)
    const nx = -uy
    const ny = ux
    const at = (s: number, t: number): Pt => ({ x: origin.x + s * ux + t * nx, y: origin.y + s * uy + t * ny })
    return [at(0, -below), at(along, -below), at(along, above), at(0, above)]
}

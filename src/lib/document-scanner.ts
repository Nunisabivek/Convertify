/**
 * High-performance Document Scanner & Real-Time Edge Tracking Engine
 * Designed for mobile WebViews and low-end Android devices (60 FPS, minimal CPU).
 */

export interface Point {
    x: number
    y: number
}

export interface Quad {
    tl: Point
    tr: Point
    br: Point
    bl: Point
}

export type ScanFilter = 'xerox' | 'magic' | 'grayscale' | 'original'

export interface DetectionResult {
    quad: Quad
    docType: string
    ratio: number
    confidence: number
}

/** Smallest brightness step across a side (paper vs. desk, 0-255) accepted as a page edge. */
const MIN_CONTRAST = 10

function distance(p1: Point, p2: Point): number {
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    return Math.sqrt(dx * dx + dy * dy)
}

function crossProduct(o: Point, a: Point, b: Point): number {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
}

function polygonArea(poly: Point[]): number {
    let a = 0
    for (let i = 0; i < poly.length; i++) {
        const p = poly[i]
        const q = poly[(i + 1) % poly.length]
        a += p.x * q.y - q.x * p.y
    }
    return Math.abs(a) / 2
}

/** 3x3 box blur: keeps sensor noise out of the gradient without smearing edges. */
function blur3(src: Float32Array, w: number, h: number): Float32Array {
    const tmp = new Float32Array(src.length)
    const out = new Float32Array(src.length)
    for (let y = 0; y < h; y++) {
        const row = y * w
        for (let x = 0; x < w; x++) {
            tmp[row + x] = (src[row + Math.max(0, x - 1)] + src[row + x] + src[row + Math.min(w - 1, x + 1)]) / 3
        }
    }
    for (let y = 0; y < h; y++) {
        const up = Math.max(0, y - 1) * w
        const row = y * w
        const down = Math.min(h - 1, y + 1) * w
        for (let x = 0; x < w; x++) out[row + x] = (tmp[up + x] + tmp[row + x] + tmp[down + x]) / 3
    }
    return out
}

/** Andrew's monotone chain. */
function convexHull(pts: Point[]): Point[] {
    const p = pts.slice().sort((a, b) => a.x - b.x || a.y - b.y)
    const lower: Point[] = []
    for (const q of p) {
        while (lower.length >= 2 && crossProduct(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop()
        lower.push(q)
    }
    const upper: Point[] = []
    for (let i = p.length - 1; i >= 0; i--) {
        const q = p[i]
        while (upper.length >= 2 && crossProduct(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop()
        upper.push(q)
    }
    return lower.slice(0, -1).concat(upper.slice(0, -1))
}

interface Line {
    px: number
    py: number
    dx: number
    dy: number
}

/** Total least squares: works for any edge angle, unlike y = mx + c. */
function fitLine(pts: Point[]): Line {
    let mx = 0
    let my = 0
    for (const p of pts) {
        mx += p.x
        my += p.y
    }
    mx /= pts.length
    my /= pts.length
    let sxx = 0
    let sxy = 0
    let syy = 0
    for (const p of pts) {
        const dx = p.x - mx
        const dy = p.y - my
        sxx += dx * dx
        sxy += dx * dy
        syy += dy * dy
    }
    const th = 0.5 * Math.atan2(2 * sxy, sxx - syy)
    return { px: mx, py: my, dx: Math.cos(th), dy: Math.sin(th) }
}

function lineDistance(l: Line, p: Point): number {
    return Math.abs((p.x - l.px) * l.dy - (p.y - l.py) * l.dx)
}

function intersect(a: Line, b: Line): Point | null {
    const den = a.dx * b.dy - a.dy * b.dx
    if (Math.abs(den) < 1e-6) return null
    const s = ((b.px - a.px) * b.dy - (b.py - a.py) * b.dx) / den
    return { x: a.px + s * a.dx, y: a.py + s * a.dy }
}

/**
 * Refit the side a->b through the outline points along its middle, ignoring
 * the ends (rounded or dog-eared corners) and anything off the line (a finger).
 */
function refineSide(outline: Point[], a: Point, b: Point): Line {
    const len = Math.hypot(b.x - a.x, b.y - a.y)
    const ux = (b.x - a.x) / len
    const uy = (b.y - a.y) / len
    const hull: Line = { px: a.x, py: a.y, dx: ux, dy: uy }
    // Loose first: a soft corner can leave the hull vertex several pixels off.
    let near = outline.filter((p) => {
        const t = ((p.x - a.x) * ux + (p.y - a.y) * uy) / len
        return t > 0.1 && t < 0.9 && lineDistance(hull, p) < Math.max(3, len * 0.08)
    })
    if (near.length < 6) return hull
    let line = fitLine(near)
    for (const tol of [2.5, 1.2]) {
        const kept = near.filter((p) => lineDistance(line, p) < tol)
        if (kept.length < 6) break
        near = kept
        line = fitLine(near)
    }
    return line
}

/** Four corners of the blob in `mask`, or null if it isn't a page-like quad. */
function quadFromMask(mask: Uint8Array, w: number, h: number): Quad | null {
    // Outline: the outermost blob pixel on every row and column. Holes (print) don't matter.
    const outline: Point[] = []
    for (let y = 0; y < h; y++) {
        let x0 = -1
        let x1 = -1
        for (let x = 0; x < w; x++) {
            if (mask[y * w + x]) {
                if (x0 < 0) x0 = x
                x1 = x
            }
        }
        if (x0 >= 0) outline.push({ x: x0, y: y + 0.5 }, { x: x1 + 1, y: y + 0.5 })
    }
    for (let x = 0; x < w; x++) {
        let y0 = -1
        let y1 = -1
        for (let y = 0; y < h; y++) {
            if (mask[y * w + x]) {
                if (y0 < 0) y0 = y
                y1 = y
            }
        }
        if (y0 >= 0) outline.push({ x: x + 0.5, y: y0 }, { x: x + 0.5, y: y1 + 1 })
    }
    if (outline.length < 16) return null

    const hull = convexHull(outline)
    if (hull.length < 4) return null
    const hullArea = polygonArea(hull)

    // Simplify the hull: drop the vertex that adds least area, then any vertex
    // where the outline barely turns.
    const poly = hull.slice()
    const at = (i: number) => poly[(i + poly.length) % poly.length]
    const removeMin = (score: (i: number) => number, limit: number) => {
        let min = Infinity
        let idx = -1
        for (let i = 0; i < poly.length; i++) {
            const s = score(i)
            if (s < min) {
                min = s
                idx = i
            }
        }
        if (min >= limit) return false
        poly.splice(idx, 1)
        return true
    }
    while (poly.length > 8) removeMin((i) => Math.abs(crossProduct(at(i - 1), at(i), at(i + 1))), Infinity)
    const turn = (i: number) => {
        const ux = at(i).x - at(i - 1).x
        const uy = at(i).y - at(i - 1).y
        const vx = at(i + 1).x - at(i).x
        const vy = at(i + 1).y - at(i).y
        return Math.abs(Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy))
    }
    while (poly.length > 4 && removeMin(turn, 0.45)) {
        // keep merging near-straight vertices
    }

    // A thumb or a dog-ear cuts a corner into a short extra edge; the four longest edges are the sides.
    let edges = poly.map((a, i) => ({ a, b: at(i + 1), len: distance(a, at(i + 1)) }))
    if (edges.length > 4) {
        const longest = edges.slice().sort((e, f) => f.len - e.len).slice(0, 4)
        edges = edges.filter((e) => longest.includes(e))
    }
    const sides = edges.map((e) => refineSide(outline, e.a, e.b))
    const corners: Point[] = []
    for (let i = 0; i < 4; i++) {
        const c = intersect(sides[(i + 3) % 4], sides[i])
        if (!c) return null
        corners.push(c)
    }

    // A blob that isn't four-sided (a hand, a mug) loses or gains area as a quad.
    const ratio = polygonArea(corners) / Math.max(1, hullArea)
    if (ratio < 0.9 || ratio > 1.1) return null

    // tl has the smallest x + y; the rest follow clockwise on screen.
    const cx = corners.reduce((s, p) => s + p.x, 0) / 4
    const cy = corners.reduce((s, p) => s + p.y, 0) / 4
    corners.sort((p, q) => Math.atan2(p.y - cy, p.x - cx) - Math.atan2(q.y - cy, q.x - cx))
    let first = 0
    for (let i = 1; i < 4; i++) {
        if (corners[i].x + corners[i].y < corners[first].x + corners[first].y) first = i
    }
    const [tl, tr, br, bl] = [0, 1, 2, 3].map((i) => corners[(first + i) % 4])
    return { tl, tr, br, bl }
}

/**
 * Finds the page in a small camera frame (about 320px on the long side).
 *
 * Marker watershed on gradient strength: the page floods out from the frame
 * centre and the surface floods in from the frame border, both through the
 * flattest pixels first, so they meet on the strongest edge between them:
 * the paper's outline. Shadows and uneven desk lighting are smooth, print sits
 * inside the page, so neither moves that line. The page blob's outline is
 * then reduced to four corners.
 */
export function detectDocumentQuad(
    imgData: ImageData,
    w: number,
    h: number
): DetectionResult | null {
    const n = w * h
    const d = imgData.data
    const raw = new Float32Array(n)
    for (let i = 0, j = 0; i < n; i++, j += 4) raw[i] = 0.299 * d[j] + 0.587 * d[j + 1] + 0.114 * d[j + 2]
    const lum = blur3(raw, w, h)

    const grad = new Uint8Array(n)
    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            const i = y * w + x
            grad[i] = Math.min(255, Math.abs(lum[i + 1] - lum[i - 1]) + Math.abs(lum[i + w] - lum[i - w]))
        }
    }

    // Labels: 1 = page, 2 = surface. Each pixel is queued once, at the level it was reached.
    const PAGE = 1
    const label = new Uint8Array(n)
    const buckets: number[][] = Array.from({ length: 256 }, () => [])
    const heads = new Uint32Array(256)
    const seed = (i: number, l: number) => {
        label[i] = l
        buckets[0].push(i)
    }
    for (let y = Math.floor(h * 0.45); y < Math.ceil(h * 0.55); y++) {
        for (let x = Math.floor(w * 0.45); x < Math.ceil(w * 0.55); x++) seed(y * w + x, PAGE)
    }
    for (let x = 0; x < w; x++) {
        seed(x, 2)
        seed(n - w + x, 2)
    }
    for (let y = 1; y < h - 1; y++) {
        seed(y * w, 2)
        seed(y * w + w - 1, 2)
    }
    const visit = (j: number, l: number, level: number) => {
        if (label[j]) return
        label[j] = l
        buckets[Math.max(level, grad[j])].push(j)
    }
    for (let level = 0; level < 256; level++) {
        const q = buckets[level]
        while (heads[level] < q.length) {
            const i = q[heads[level]++]
            const l = label[i]
            const x = i % w
            if (x > 0) visit(i - 1, l, level)
            if (x < w - 1) visit(i + 1, l, level)
            if (i >= w) visit(i - w, l, level)
            if (i < n - w) visit(i + w, l, level)
        }
    }

    const mask = new Uint8Array(n)
    for (let i = 0; i < n; i++) mask[i] = label[i] === PAGE ? 1 : 0
    const quad = quadFromMask(mask, w, h)
    if (!quad) return null

    // A sheet is brighter (or darker) than what it lies on all the way round.
    // A blob that leaked into the desk, or a page running off the frame, has a
    // side with no step across it, or sides that disagree.
    const corners = [quad.tl, quad.tr, quad.br, quad.bl]
    const cx = (quad.tl.x + quad.tr.x + quad.br.x + quad.bl.x) / 4
    const cy = (quad.tl.y + quad.tr.y + quad.br.y + quad.bl.y) / 4
    const at = (x: number, y: number) =>
        lum[Math.min(h - 1, Math.max(0, Math.floor(y))) * w + Math.min(w - 1, Math.max(0, Math.floor(x)))]
    const contrast = corners.map((a, k) => {
        const b = corners[(k + 1) % 4]
        const len = Math.max(1, distance(a, b))
        let nx = (b.y - a.y) / len
        let ny = (a.x - b.x) / len
        if ((cx - (a.x + b.x) / 2) * nx + (cy - (a.y + b.y) / 2) * ny < 0) {
            nx = -nx
            ny = -ny
        }
        const steps: number[] = []
        for (let s = 2; s < 15; s++) {
            const x = a.x + ((b.x - a.x) * s) / 16
            const y = a.y + ((b.y - a.y) * s) / 16
            steps.push(at(x + nx * 3, y + ny * 3) - at(x - nx * 3, y - ny * 3))
        }
        steps.sort((p, q) => p - q)
        return steps[steps.length >> 1]
    })
    const sign = Math.sign(contrast[0])
    if (contrast.some((c) => Math.sign(c) !== sign || Math.abs(c) < MIN_CONTRAST)) return null

    return describe(quad, w, h)
}

function describe(quad: Quad, w: number, h: number): DetectionResult | null {
    const { tl, tr, br, bl } = quad

    // Boundary sanity checks (-5% to 105% of frame)
    const validPoint = (p: Point) => p.x >= -w * 0.05 && p.x <= w * 1.05 && p.y >= -h * 0.05 && p.y <= h * 1.05
    if (!validPoint(tl) || !validPoint(tr) || !validPoint(br) || !validPoint(bl)) return null

    // Convexity check
    const cp1 = crossProduct(tl, tr, br)
    const cp2 = crossProduct(tr, br, bl)
    const cp3 = crossProduct(br, bl, tl)
    const cp4 = crossProduct(bl, tl, tr)
    const isConvex = (cp1 > 0 && cp2 > 0 && cp3 > 0 && cp4 > 0) || (cp1 < 0 && cp2 < 0 && cp3 < 0 && cp4 < 0)
    if (!isConvex) return null

    // Calculate quad width and height
    const widthTop = distance(tl, tr)
    const widthBottom = distance(bl, br)
    const heightLeft = distance(tl, bl)
    const heightRight = distance(tr, br)

    const avgWidth = (widthTop + widthBottom) / 2
    const avgHeight = (heightLeft + heightRight) / 2
    const area = avgWidth * avgHeight

    // Minimum area: an ID card held at arm's length is about a tenth of the frame
    if (area < w * h * 0.08) return null

    // Aspect ratio
    const ratio = Math.max(avgWidth, avgHeight) / Math.max(1, Math.min(avgWidth, avgHeight))

    let docType = 'Standard Document'
    if (ratio >= 1.25 && ratio <= 1.55) {
        docType = 'A4 / Letter Document'
    } else if (ratio > 1.55 && ratio <= 1.76) {
        docType = 'ID Card / License'
    } else if (ratio > 1.76) {
        docType = 'Receipt / Form'
    }

    return {
        quad: { tl, tr, br, bl },
        docType,
        ratio,
        confidence: Math.min(1, area / (w * h * 0.6)),
    }
}

/**
 * Exponential moving average (LERP) for jitter-free tracking.
 */
export function lerpQuad(prev: Quad | null, next: Quad, alpha = 0.35): Quad {
    if (!prev) return next
    const lerpPoint = (p1: Point, p2: Point): Point => ({
        x: p1.x * (1 - alpha) + p2.x * alpha,
        y: p1.y * (1 - alpha) + p2.y * alpha,
    })
    return {
        tl: lerpPoint(prev.tl, next.tl),
        tr: lerpPoint(prev.tr, next.tr),
        br: lerpPoint(prev.br, next.br),
        bl: lerpPoint(prev.bl, next.bl),
    }
}

/**
 * Bilinear interpolation on a quadrilateral.
 * u in [0, 1] (horizontal), v in [0, 1] (vertical).
 */
export function sampleBilinear(quad: Quad, u: number, v: number): Point {
    const topX = (1 - u) * quad.tl.x + u * quad.tr.x
    const topY = (1 - u) * quad.tl.y + u * quad.tr.y
    const botX = (1 - u) * quad.bl.x + u * quad.br.x
    const botY = (1 - u) * quad.bl.y + u * quad.br.y
    return {
        x: (1 - v) * topX + v * botX,
        y: (1 - v) * topY + v * botY,
    }
}

/**
 * Warps a single triangle from source to destination canvas context.
 */
function drawAffineTriangle(
    ctx: CanvasRenderingContext2D,
    source: CanvasImageSource,
    sx0: number, sy0: number,
    sx1: number, sy1: number,
    sx2: number, sy2: number,
    dx0: number, dy0: number,
    dx1: number, dy1: number,
    dx2: number, dy2: number
) {
    const det = sx0 * (sy1 - sy2) + sx1 * (sy2 - sy0) + sx2 * (sy0 - sy1)
    if (Math.abs(det) < 1e-5) return

    const s00 = (sy1 - sy2) / det
    const s01 = (sy2 - sy0) / det
    const s02 = (sy0 - sy1) / det
    const s10 = (sx2 - sx1) / det
    const s11 = (sx0 - sx2) / det
    const s12 = (sx1 - sx0) / det
    const s20 = (sx1 * sy2 - sx2 * sy1) / det
    const s21 = (sx2 * sy0 - sx0 * sy2) / det
    const s22 = (sx0 * sy1 - sx1 * sy0) / det

    const a = dx0 * s00 + dx1 * s01 + dx2 * s02
    const b = dy0 * s00 + dy1 * s01 + dy2 * s02
    const c = dx0 * s10 + dx1 * s11 + dx2 * s12
    const d = dy0 * s10 + dy1 * s11 + dy2 * s12
    const e = dx0 * s20 + dx1 * s21 + dx2 * s22
    const f = dy0 * s20 + dy1 * s21 + dy2 * s22

    ctx.save()
    ctx.beginPath()
    ctx.moveTo(dx0, dy0)
    ctx.lineTo(dx1, dy1)
    ctx.lineTo(dx2, dy2)
    ctx.closePath()
    ctx.clip()
    ctx.transform(a, b, c, d, e, f)
    ctx.drawImage(source, 0, 0)
    ctx.restore()
}

/**
 * Unwarps a quadrilateral from source video/image into a rectified flat rectangle.
 * Subdivides into a 4x4 bilinear grid (32 triangles) for true perspective correction.
 */
export function warpQuadToCanvas(
    source: CanvasImageSource,
    quad: Quad,
    srcWidth: number,
    srcHeight: number,
    targetWidth = 1200
): HTMLCanvasElement {
    const quadW = (distance(quad.tl, quad.tr) + distance(quad.bl, quad.br)) / 2
    const quadH = (distance(quad.tl, quad.bl) + distance(quad.tr, quad.br)) / 2
    const aspect = Math.max(0.2, quadH / Math.max(1, quadW))

    const targetHeight = Math.round(targetWidth * aspect)
    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight

    // CPU canvas on purpose: Android WebView encodes a GPU canvas's toBlob in
    // main-thread idle time, which a live viewfinder never leaves (~4s per page).
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return canvas

    const GRID = 4
    for (let i = 0; i < GRID; i++) {
        for (let j = 0; j < GRID; j++) {
            const u0 = i / GRID
            const u1 = (i + 1) / GRID
            const v0 = j / GRID
            const v1 = (j + 1) / GRID

            const p00 = sampleBilinear(quad, u0, v0)
            const p10 = sampleBilinear(quad, u1, v0)
            const p01 = sampleBilinear(quad, u0, v1)
            const p11 = sampleBilinear(quad, u1, v1)

            const dx0 = u0 * targetWidth
            const dx1 = u1 * targetWidth
            const dy0 = v0 * targetHeight
            const dy1 = v1 * targetHeight

            // Upper triangle (p00 -> p10 -> p01)
            drawAffineTriangle(
                ctx,
                source,
                p00.x, p00.y,
                p10.x, p10.y,
                p01.x, p01.y,
                dx0, dy0,
                dx1, dy0,
                dx0, dy1
            )

            // Lower triangle (p10 -> p11 -> p01)
            drawAffineTriangle(
                ctx,
                source,
                p10.x, p10.y,
                p11.x, p11.y,
                p01.x, p01.y,
                dx1, dy0,
                dx1, dy1,
                dx0, dy1
            )
        }
    }

    return canvas
}

/**
 * Apply Xerox photocopy, Magic color, or Grayscale enhancement directly to canvas.
 */
export function applyDocumentFilter(canvas: HTMLCanvasElement, filter: ScanFilter): void {
    if (filter === 'original') return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const d = imgData.data
    const len = d.length

    if (filter === 'xerox') {
        // High-contrast clean photocopy: removes yellow/grey shadows, keeps deep black ink
        for (let i = 0; i < len; i += 4) {
            const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
            let val: number
            if (gray > 142) {
                val = 255
            } else if (gray < 72) {
                val = 0
            } else {
                val = Math.round((gray - 72) * 1.5)
            }
            d[i] = val
            d[i + 1] = val
            d[i + 2] = val
        }
    } else if (filter === 'magic') {
        // Magic Color: Whitens background paper, enhances red/blue ink & official stamps
        for (let i = 0; i < len; i += 4) {
            let r = d[i]
            let g = d[i + 1]
            let b = d[i + 2]
            const maxC = Math.max(r, g, b)
            const minC = Math.min(r, g, b)
            const sat = maxC === 0 ? 0 : (maxC - minC) / maxC

            if (sat < 0.22) {
                const gray = 0.299 * r + 0.587 * g + 0.114 * b
                if (gray > 165) {
                    r = 255
                    g = 255
                    b = 255
                } else {
                    const dark = Math.max(0, Math.round((gray - 35) * 1.35))
                    r = dark
                    g = dark
                    b = dark
                }
            } else {
                r = Math.min(255, Math.round(r * 1.15))
                g = Math.min(255, Math.round(g * 1.15))
                b = Math.min(255, Math.round(b * 1.15))
            }
            d[i] = r
            d[i + 1] = g
            d[i + 2] = b
        }
    } else if (filter === 'grayscale') {
        // Crisp Grayscale photocopy
        for (let i = 0; i < len; i += 4) {
            const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
            const stretched = Math.min(255, Math.max(0, Math.round((gray - 20) * 1.2)))
            d[i] = stretched
            d[i + 1] = stretched
            d[i + 2] = stretched
        }
    }

    ctx.putImageData(imgData, 0, 0)
}

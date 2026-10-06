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

function distance(p1: Point, p2: Point): number {
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    return Math.sqrt(dx * dx + dy * dy)
}

function crossProduct(o: Point, a: Point, b: Point): number {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
}

/**
 * Fit a 2D line (y = mx + c or x = my + c) through points using linear regression.
 */
function fitLine(
    points: Point[],
    isVertical = false
): { m: number; c: number; isVertical: boolean } | null {
    if (points.length < 2) return null
    let sumX = 0
    let sumY = 0
    let sumXY = 0
    let sumX2 = 0
    const n = points.length

    for (const p of points) {
        const u = isVertical ? p.y : p.x
        const v = isVertical ? p.x : p.y
        sumX += u
        sumY += v
        sumXY += u * v
        sumX2 += u * u
    }

    const denom = n * sumX2 - sumX * sumX
    if (Math.abs(denom) < 1e-5) {
        return { m: 0, c: sumY / n, isVertical }
    }
    const m = (n * sumXY - sumX * sumY) / denom
    const c = (sumY - m * sumX) / n
    return { m, c, isVertical }
}

/**
 * Intersect two lines. Line 1: y = m1 * x + c1 (or x = m1 * y + c1).
 */
function intersectLines(
    l1: { m: number; c: number; isVertical: boolean },
    l2: { m: number; c: number; isVertical: boolean }
): Point | null {
    // Both horizontal (y = mx + c)
    if (!l1.isVertical && !l2.isVertical) {
        if (Math.abs(l1.m - l2.m) < 1e-4) return null
        const x = (l2.c - l1.c) / (l1.m - l2.m)
        const y = l1.m * x + l1.c
        return { x, y }
    }
    // Both vertical (x = my + c)
    if (l1.isVertical && l2.isVertical) {
        if (Math.abs(l1.m - l2.m) < 1e-4) return null
        const y = (l2.c - l1.c) / (l1.m - l2.m)
        const x = l1.m * y + l1.c
        return { x, y }
    }
    // One horizontal, one vertical
    const horiz = l1.isVertical ? l2 : l1
    const vert = l1.isVertical ? l1 : l2
    // horiz: y = m_h * x + c_h; vert: x = m_v * y + c_v
    const denom = 1 - horiz.m * vert.m
    if (Math.abs(denom) < 1e-4) return null
    const y = (horiz.m * vert.c + horiz.c) / denom
    const x = vert.m * y + vert.c
    return { x, y }
}

/**
 * Detects document quad and size in a downscaled camera frame (e.g., 320x240).
 */
export function detectDocumentQuad(
    imgData: ImageData,
    w: number,
    h: number
): DetectionResult | null {
    const d = imgData.data

    const getLum = (x: number, y: number): number => {
        const idx = (Math.max(0, Math.min(h - 1, Math.floor(y))) * w + Math.max(0, Math.min(w - 1, Math.floor(x)))) * 4
        return 0.299 * d[idx] + 0.587 * d[idx + 1] + 0.114 * d[idx + 2]
    }

    // Sample border brightness to estimate background surface
    let borderLum = 0
    let borderCount = 0
    for (let x = 0; x < w; x += 10) {
        borderLum += getLum(x, 4) + getLum(x, h - 5)
        borderCount += 2
    }
    for (let y = 0; y < h; y += 10) {
        borderLum += getLum(4, y) + getLum(w - 5, y)
        borderCount += 2
    }
    const bgLum = borderLum / Math.max(1, borderCount)

    const topPoints: Point[] = []
    const bottomPoints: Point[] = []
    const leftPoints: Point[] = []
    const rightPoints: Point[] = []

    const GRAD_THRESH = 24

    // Scan vertical rays from top and bottom
    const numVertRays = 16
    for (let i = 1; i < numVertRays; i++) {
        const x = Math.floor((w * i) / numVertRays)
        // Top ray moving down
        for (let y = 8; y < h * 0.45; y += 2) {
            const l1 = getLum(x, y - 2)
            const l2 = getLum(x, y + 2)
            const grad = Math.abs(l2 - l1)
            const diffBg = Math.abs(l2 - bgLum)
            if (grad > GRAD_THRESH && diffBg > 18) {
                topPoints.push({ x, y })
                break
            }
        }
        // Bottom ray moving up
        for (let y = h - 9; y > h * 0.55; y -= 2) {
            const l1 = getLum(x, y + 2)
            const l2 = getLum(x, y - 2)
            const grad = Math.abs(l2 - l1)
            const diffBg = Math.abs(l2 - bgLum)
            if (grad > GRAD_THRESH && diffBg > 18) {
                bottomPoints.push({ x, y })
                break
            }
        }
    }

    // Scan horizontal rays from left and right
    const numHorizRays = 14
    for (let j = 1; j < numHorizRays; j++) {
        const y = Math.floor((h * j) / numHorizRays)
        // Left ray moving right
        for (let x = 8; x < w * 0.45; x += 2) {
            const l1 = getLum(x - 2, y)
            const l2 = getLum(x + 2, y)
            const grad = Math.abs(l2 - l1)
            const diffBg = Math.abs(l2 - bgLum)
            if (grad > GRAD_THRESH && diffBg > 18) {
                leftPoints.push({ x, y })
                break
            }
        }
        // Right ray moving left
        for (let x = w - 9; x > w * 0.55; x -= 2) {
            const l1 = getLum(x + 2, y)
            const l2 = getLum(x - 2, y)
            const grad = Math.abs(l2 - l1)
            const diffBg = Math.abs(l2 - bgLum)
            if (grad > GRAD_THRESH && diffBg > 18) {
                rightPoints.push({ x, y })
                break
            }
        }
    }

    if (topPoints.length < 3 || bottomPoints.length < 3 || leftPoints.length < 3 || rightPoints.length < 3) {
        return null
    }

    const topLine = fitLine(topPoints, false)
    const bottomLine = fitLine(bottomPoints, false)
    const leftLine = fitLine(leftPoints, true)
    const rightLine = fitLine(rightPoints, true)

    if (!topLine || !bottomLine || !leftLine || !rightLine) return null

    const tl = intersectLines(topLine, leftLine)
    const tr = intersectLines(topLine, rightLine)
    const br = intersectLines(bottomLine, rightLine)
    const bl = intersectLines(bottomLine, leftLine)

    if (!tl || !tr || !br || !bl) return null

    // Boundary sanity checks (-10% to 110% of frame)
    const validPoint = (p: Point) => p.x >= -w * 0.1 && p.x <= w * 1.1 && p.y >= -h * 0.1 && p.y <= h * 1.1
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

    // Minimum area: at least 15% of frame
    if (area < w * h * 0.15) return null

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

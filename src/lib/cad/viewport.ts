import { apply, applyLinear, invert, vecAngleDeg, type Mat, type Pt } from './geometry.ts'

/**
 * The page as the reader sees it, in points with y pointing down ("display
 * space"). This is pdf.js's PageViewport transform at scale 1, reproduced here so
 * export maths does not depend on pdf.js and can be unit-tested. It honours
 * /Rotate, a view box (CropBox ∩ MediaBox) that doesn't start at 0,0, and UserUnit.
 *
 * Display space is the one coordinate system the editor UI uses: canvas pixels are
 * display × renderScale and on-screen CSS pixels are display × zoom.
 */
export type PageFrame = {
    /** [x0, y0, x1, y1] in PDF user space (pdf.js `page.view`). */
    view: [number, number, number, number]
    /** Page /Rotate, any multiple of 90. */
    rotate: number
    userUnit?: number
}

export function normRotate(rotate: number): number {
    const r = ((Math.round(rotate / 90) * 90) % 360 + 360) % 360
    return r
}

/** pdf.js PageViewport transform: user space → display space at `scale`. */
export function viewportTransform(frame: PageFrame, scale = 1): { m: Mat; width: number; height: number } {
    const [x0, y0, x1, y1] = frame.view
    const s = scale * (frame.userUnit || 1)
    const cx = (x0 + x1) / 2
    const cy = (y0 + y1) / 2
    const r = normRotate(frame.rotate)
    const [A, B, C, D] = r === 90 ? [0, 1, 1, 0] : r === 180 ? [-1, 0, 0, 1] : r === 270 ? [0, -1, -1, 0] : [1, 0, 0, -1]
    let offX: number
    let offY: number
    let width: number
    let height: number
    if (A === 0) {
        offX = Math.abs(cy - y0) * s
        offY = Math.abs(cx - x0) * s
        width = (y1 - y0) * s
        height = (x1 - x0) * s
    } else {
        offX = Math.abs(cx - x0) * s
        offY = Math.abs(cy - y0) * s
        width = (x1 - x0) * s
        height = (y1 - y0) * s
    }
    const m: Mat = [A * s, B * s, C * s, D * s, offX - A * s * cx - C * s * cy, offY - B * s * cx - D * s * cy]
    return { m, width: Math.abs(width), height: Math.abs(height) }
}

export type FrameMapper = {
    /** Displayed page size in points. */
    width: number
    height: number
    toDisplay: (ux: number, uy: number) => Pt
    toUser: (dx: number, dy: number) => Pt
    /** A direction given in display space (y down), as a user-space angle in degrees (CCW). */
    userAngleOf: (ddx: number, ddy: number) => number
    /** A user-space angle (CCW, degrees) as a display-space angle (clockwise on screen, degrees). */
    displayAngleOf: (userDeg: number) => number
}

export function frameMapper(frame: PageFrame): FrameMapper {
    const { m, width, height } = viewportTransform(frame, 1)
    const inv = invert(m)
    return {
        width,
        height,
        toDisplay: (ux, uy) => apply(m, ux, uy),
        toUser: (dx, dy) => apply(inv, dx, dy),
        userAngleOf: (ddx, ddy) => {
            const v = applyLinear(inv, ddx, ddy)
            return vecAngleDeg(v.x, v.y)
        },
        displayAngleOf: (userDeg) => {
            const r = (userDeg * Math.PI) / 180
            const v = applyLinear(m, Math.cos(r), Math.sin(r))
            return vecAngleDeg(v.x, v.y)
        },
    }
}

/**
 * Render scale for a page of `widthPt × heightPt` that keeps the canvas within
 * `budgetPx` pixels: min(maxScale, sqrt(budget / area)). An A0 sheet at scale 2 is
 * ~32 MP, past iOS Safari's ~16.7 MP canvas limit, slow to encode and heavy on memory.
 */
export function budgetScale(widthPt: number, heightPt: number, budgetPx: number, maxScale = 2): number {
    const area = Math.max(1, widthPt * heightPt)
    return Math.min(maxScale, Math.sqrt(budgetPx / area))
}

/** About 16 MP on desktop, about 8 MP on phones and tablets with small screens. */
export function pixelBudget(isPhone: boolean): number {
    return isPhone ? 8_000_000 : 16_000_000
}

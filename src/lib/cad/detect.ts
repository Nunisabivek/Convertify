import { sampleColors, type RGB } from './color.ts'
import { padBox, type Box } from './geometry.ts'
import { binarizeRange, dropOverlapping, findComponents, groupGlyphs, maskBoxes, type GlyphGroup, type Pause } from './shx-detect.ts'

export type Colors = { ink: RGB | null; bg: RGB }
export type ShxGroup = GlyphGroup & Colors

/** What the editor needs from a page's pixels; everything in canvas pixels. */
export type PixelResult = {
    /** Ink and paper colour inside each text box, in input order. */
    textColors: Colors[]
    /** SHX text lines found in the strokes, with their colours. */
    groups: ShxGroup[]
}

export type DetectOptions = {
    /** Canvas pixels per point. */
    scale: number
    /** Boxes of real text (canvas px): sampled for colour and masked out of SHX detection. */
    textBoxes: Box[]
    /** Awaited between slices with the fraction done (0..1): yield, report progress or throw to cancel. */
    pause?: Pause
    /** Pixels per slice when pausing (smaller = more responsive on the main thread). */
    slice?: number
}

/**
 * The pixel half of page analysis: text colours, then SHX text found in the strokes.
 * Pure (no DOM), so the same code runs in a Web Worker and, chunked, on the main
 * thread; both give identical results for identical pixels.
 */
export async function detectPixels(rgba: Uint8ClampedArray | Uint8Array, W: number, H: number, o: DetectOptions): Promise<PixelResult> {
    const slice = o.slice ?? 1_500_000
    const pause = o.pause
    const textColors = o.textBoxes.map((b) => sampleColors(rgba, W, H, b))
    const binary = new Uint8Array(W * H)
    for (let from = 0; from < binary.length; from += slice) {
        binarizeRange(rgba, binary, from, Math.min(binary.length, from + slice))
        if (pause) await pause((0.15 * from) / binary.length)
    }
    maskBoxes(binary, W, H, o.textBoxes.map((b) => padBox(b, 2)))
    const comps = await findComponents(binary, W, H, pause ? (f) => pause(0.15 + 0.75 * f) : undefined, 60 * o.scale * 1.4, slice)
    if (pause) await pause(0.92)
    const groups = dropOverlapping(groupGlyphs(comps, { scale: o.scale }), o.textBoxes, 0.3, 2 * o.scale)
    return { textColors, groups: groups.map((g) => ({ ...g, ...sampleColors(rgba, W, H, g) })) }
}

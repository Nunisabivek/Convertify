import { parseGIF, decompressFrames } from 'gifuct-js'

export type GifFrame = {
    /** Full-canvas RGBA pixels for this frame, with earlier frames composited underneath. */
    rgba: Uint8ClampedArray
}
export type DecodedGif = { width: number; height: number; frames: GifFrame[] }

/**
 * Decode every frame of a GIF into full-size RGBA images.
 *
 * GIF animations store each frame as a patch (often just the pixels that
 * changed) plus a "disposal" rule for what to do with the area afterwards.
 * Exporting a patch on its own gives a mostly-empty image, so each frame is
 * composited onto a running canvas the same way a browser plays the GIF.
 */
export function decodeGif(buffer: ArrayBuffer): DecodedGif {
    const gif = parseGIF(buffer)
    const width = gif.lsd.width
    const height = gif.lsd.height
    const patches = decompressFrames(gif, true)
    if (patches.length === 0 || !width || !height) throw new Error('This GIF has no readable frames.')

    const canvas = new Uint8ClampedArray(width * height * 4)
    const frames: GifFrame[] = []

    for (const frame of patches) {
        const { left, top, width: fw, height: fh } = frame.dims
        // Disposal 3 means "restore what was here before this frame".
        const before = frame.disposalType === 3 ? canvas.slice() : null

        for (let y = 0; y < fh; y++) {
            for (let x = 0; x < fw; x++) {
                const src = (y * fw + x) * 4
                if (frame.patch[src + 3] === 0) continue // transparent pixel: keep what is underneath
                const cx = left + x
                const cy = top + y
                if (cx >= width || cy >= height) continue
                const dst = (cy * width + cx) * 4
                canvas[dst] = frame.patch[src]
                canvas[dst + 1] = frame.patch[src + 1]
                canvas[dst + 2] = frame.patch[src + 2]
                canvas[dst + 3] = frame.patch[src + 3]
            }
        }
        frames.push({ rgba: canvas.slice() })

        if (frame.disposalType === 2) {
            // Disposal 2: clear this frame's rectangle to transparent.
            for (let y = 0; y < fh; y++) {
                for (let x = 0; x < fw; x++) {
                    const cx = left + x
                    const cy = top + y
                    if (cx >= width || cy >= height) continue
                    const dst = (cy * width + cx) * 4
                    canvas[dst] = canvas[dst + 1] = canvas[dst + 2] = canvas[dst + 3] = 0
                }
            }
        } else if (before) {
            canvas.set(before)
        }
    }
    return { width, height, frames }
}

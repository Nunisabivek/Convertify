// Worker entry: bundled with its imports into public/cad-detect-worker.js by
// scripts/build-cad-worker.mjs (a plain classic worker, so it works in every build).
//
// Reads the rendered page's pixels and runs text-colour sampling and SHX detection on
// them. The main thread only renders with pdf.js and hands over an ImageBitmap (a
// cheap GPU copy), so the pixel readback and the detection never block the page.
import { detectPixels } from './detect.ts'
import type { Box } from './geometry.ts'

type Job = {
    id: number
    bitmap: ImageBitmap
    W: number
    H: number
    detect: { scale: number; textBoxes: Box[] }
}

type Scope = {
    onmessage: ((e: MessageEvent<Job>) => void) | null
    postMessage: (m: unknown) => void
}

const scope = globalThis as unknown as Scope

{
    scope.onmessage = async (e) => {
        const { id, bitmap, W, H, detect } = e.data
        try {
            // Answer with an error (the page falls back to the main thread) rather than never answering.
            if (typeof OffscreenCanvas === 'undefined') throw new Error('No OffscreenCanvas in this worker')
            const canvas = new OffscreenCanvas(W, H)
            const cx = canvas.getContext('2d', { willReadFrequently: true }) as OffscreenCanvasRenderingContext2D | null
            if (!cx) throw new Error('No 2D context in worker')
            cx.drawImage(bitmap, 0, 0)
            bitmap.close()
            const rgba = cx.getImageData(0, 0, W, H).data
            canvas.width = 1
            canvas.height = 1
            let last = -1
            const result = await detectPixels(rgba, W, H, {
                ...detect,
                pause: (done) => {
                    const pct = Math.round(done * 100)
                    if (pct >= last + 3) {
                        last = pct
                        scope.postMessage({ id, type: 'progress', done })
                    }
                },
            })
            scope.postMessage({ id, type: 'done', result })
        } catch (err) {
            scope.postMessage({ id, type: 'error', message: String((err as Error)?.message || err) })
        }
    }
}

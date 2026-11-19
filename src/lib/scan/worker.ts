// Scan worker: perspective flatten, enhancement, rotation and JPEG encoding all
// happen here, so the camera preview and the UI never stall. Bundled into
// public/scan-worker.js by scripts/build-cad-worker.mjs.
import { warpPerspective, rotateRGBA } from './homography.ts'
import { enhance } from './enhance.ts'
import type { Corners } from './homography.ts'
import type { ScanMode } from './enhance.ts'

interface Job {
    id: number
    op: 'process' | 'render' | 'still'
    source?: Blob | ImageBitmap
    /** process: fraction to shrink the photo by before warping (keeps memory low). */
    scale?: number
    /** process: page corners in full-size photo pixels; null keeps the whole picture. */
    quad?: Corners | null
    width?: number
    height?: number
    original?: Blob
    mode: ScanMode
    rotation: number
    thumbLong: number
    quality: number
}

const scope = self as unknown as {
    onmessage: ((e: MessageEvent<Job>) => void) | null
    postMessage: (msg: unknown) => void
}

export async function pixelsOf(source: Blob | ImageBitmap, scale: number) {
    const bmp = source instanceof Blob ? await createImageBitmap(source) : source
    const w = Math.max(1, Math.round(bmp.width * scale))
    const h = Math.max(1, Math.round(bmp.height * scale))
    const canvas = new OffscreenCanvas(w, h)
    const g = canvas.getContext('2d', { willReadFrequently: true }) as OffscreenCanvasRenderingContext2D
    g.imageSmoothingQuality = 'high'
    g.drawImage(bmp, 0, 0, w, h)
    bmp.close()
    return { data: g.getImageData(0, 0, w, h).data, w, h }
}

export async function encode(data: Uint8ClampedArray, w: number, h: number, quality: number): Promise<Blob> {
    const canvas = new OffscreenCanvas(w, h)
    const g = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D
    g.putImageData(new ImageData(data as unknown as Uint8ClampedArray<ArrayBuffer>, w, h), 0, 0)
    return canvas.convertToBlob({ type: 'image/jpeg', quality })
}

export async function thumbnail(data: Uint8ClampedArray, w: number, h: number, long: number): Promise<Blob> {
    const s = Math.min(1, long / Math.max(w, h))
    const tw = Math.max(1, Math.round(w * s))
    const th = Math.max(1, Math.round(h * s))
    const bmp = await createImageBitmap(new ImageData(data as unknown as Uint8ClampedArray<ArrayBuffer>, w, h), {
        resizeWidth: tw,
        resizeHeight: th,
        resizeQuality: 'medium',
    })
    const canvas = new OffscreenCanvas(tw, th)
    ;(canvas.getContext('2d') as OffscreenCanvasRenderingContext2D).drawImage(bmp, 0, 0)
    bmp.close()
    return canvas.convertToBlob({ type: 'image/jpeg', quality: 0.8 })
}

/** Filter + rotation + encodes, shared by both jobs. */
export async function finish(page: Uint8ClampedArray, w: number, h: number, job: Job) {
    enhance(page, w, h, job.mode)
    const r = rotateRGBA(page, w, h, job.rotation)
    const [filtered, thumb] = await Promise.all([
        encode(r.data, r.width, r.height, job.quality),
        thumbnail(r.data, r.width, r.height, job.thumbLong),
    ])
    return { filtered, thumb, width: r.width, height: r.height }
}

export async function run(job: Job) {
    try {
        if (typeof OffscreenCanvas === 'undefined') throw new Error('no-offscreen')
        if (job.op === 'still') {
            // A captured camera frame, kept as a JPEG so the page can be re-cropped later.
            const bmp = job.source as ImageBitmap
            const canvas = new OffscreenCanvas(bmp.width, bmp.height)
            ;(canvas.getContext('2d') as OffscreenCanvasRenderingContext2D).drawImage(bmp, 0, 0)
            const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.92 })
            scope.postMessage({ id: job.id, ok: true, blob, width: bmp.width, height: bmp.height })
            bmp.close()
        } else if (job.op === 'process') {
            const scale = job.scale ?? 1
            const src = await pixelsOf(job.source as Blob | ImageBitmap, scale)
            const W = job.width as number
            const H = job.height as number
            let page: Uint8ClampedArray
            if (job.quad) {
                const q = job.quad
                const k = (p: { x: number; y: number }) => ({ x: p.x * scale, y: p.y * scale })
                page = warpPerspective(src.data, src.w, src.h, { tl: k(q.tl), tr: k(q.tr), br: k(q.br), bl: k(q.bl) }, W, H)
            } else {
                page = warpPerspective(
                    src.data,
                    src.w,
                    src.h,
                    { tl: { x: 0, y: 0 }, tr: { x: src.w, y: 0 }, br: { x: src.w, y: src.h }, bl: { x: 0, y: src.h } },
                    W,
                    H,
                )
            }
            // The flat, unfiltered page: filter changes later start from this.
            const original = await encode(page, W, H, 0.92)
            const out = await finish(page, W, H, job)
            scope.postMessage({ id: job.id, ok: true, original, ...out })
        } else {
            const src = await pixelsOf(job.original as Blob, 1)
            const out = await finish(src.data, src.w, src.h, job)
            scope.postMessage({ id: job.id, ok: true, ...out })
        }
    } catch (err) {
        scope.postMessage({ id: job.id, ok: false, error: String((err as Error)?.message || err) })
    }
}

// One page at a time: a 12 MP photo plus a 300 dpi page is ~90 MB of pixels,
// and running two at once is what gets a low-memory WebView killed.
let queue: Promise<void> = Promise.resolve()
scope.onmessage = (e: MessageEvent<Job>) => {
    const job = e.data
    queue = queue.then(() => run(job))
}

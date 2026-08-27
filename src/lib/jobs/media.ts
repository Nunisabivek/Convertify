import { MAX_IMAGE_EDGE, MAX_INPUT_BYTES, MAX_PIXELS, TOO_BIG } from '@/lib/brand'

export type JobResult = {
    blob: Blob
    size: number
    shrunk: boolean
}

let worker: Worker | null = null
let seq = 1

function getWorker(): Worker {
    if (!worker) {
        worker = new Worker('/convert-worker.js')
    }
    return worker
}

export function warmConvertWorker() {
    try {
        getWorker()
    } catch {
        // Worker not available; image jobs fall back to the main thread.
    }
}

export function abortConvertWorker() {
    if (!worker) return
    worker.terminate()
    worker = null
}

function yieldToUi() {
    return new Promise<void>((resolve) => setTimeout(resolve, 0))
}

export function assertFitsPhone(file: File) {
    if (file.size > MAX_INPUT_BYTES) {
        throw new Error(TOO_BIG)
    }
}

async function fileBuffer(file: File): Promise<ArrayBuffer> {
    assertFitsPhone(file)
    return file.arrayBuffer()
}

/** Fallback only. Processing should decode in the worker. */
export async function loadImageBitmap(file: File): Promise<ImageBitmap> {
    assertFitsPhone(file)
    try {
        const bitmap = await createImageBitmap(file)
        const edge = Math.max(bitmap.width, bitmap.height)
        if (bitmap.width * bitmap.height > MAX_PIXELS || edge > MAX_IMAGE_EDGE) {
            const scale = Math.min(MAX_IMAGE_EDGE / edge, Math.sqrt(MAX_PIXELS / (bitmap.width * bitmap.height)))
            const w = Math.max(1, Math.round(bitmap.width * scale))
            const h = Math.max(1, Math.round(bitmap.height * scale))
            const smaller = await createImageBitmap(bitmap, { resizeWidth: w, resizeHeight: h })
            bitmap.close()
            return smaller
        }
        return bitmap
    } catch (error) {
        if ((error as Error).message === TOO_BIG) throw error
        throw new Error(TOO_BIG)
    }
}

export async function canvasFromBitmap(bitmap: ImageBitmap): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) throw new Error(TOO_BIG)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(bitmap, 0, 0)
    return canvas
}

export function encodeJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error('Could not save that photo.'))),
            'image/jpeg',
            quality
        )
    })
}

type WorkerOk = {
    id: number
    ok: true
    progress?: boolean
    size?: number
    blob?: Blob
    ratio?: number
    shrunk?: boolean
}

function callWorker(
    payload: Record<string, unknown>,
    transfer: Transferable[],
    signal: AbortSignal,
    onProgress?: (size: number) => void
) {
    return new Promise<WorkerOk>((resolve, reject) => {
        const id = seq++
        const w = getWorker()
        const onAbort = () => {
            abortConvertWorker()
            reject(new DOMException('Cancelled', 'AbortError'))
        }
        if (signal.aborted) {
            onAbort()
            return
        }
        signal.addEventListener('abort', onAbort)
        const onMessage = (event: MessageEvent<WorkerOk & { ok: boolean; error?: string }>) => {
            if (event.data.id !== id) return
            if (event.data.progress && event.data.ok) {
                onProgress?.(event.data.size ?? 0)
                return
            }
            cleanup()
            if (!event.data.ok) reject(new Error(event.data.error || TOO_BIG))
            else resolve(event.data as WorkerOk)
        }
        const onWorkerError = () => {
            cleanup()
            reject(new Error(TOO_BIG))
        }
        const cleanup = () => {
            w.removeEventListener('message', onMessage)
            w.removeEventListener('error', onWorkerError)
            signal.removeEventListener('abort', onAbort)
        }
        w.addEventListener('message', onMessage)
        w.addEventListener('error', onWorkerError)
        w.postMessage({ id, ...payload }, transfer)
    })
}

export async function workerFitImage(
    file: File,
    minBytes: number,
    maxBytes: number,
    signal: AbortSignal,
    onProgress?: (size: number) => void
): Promise<JobResult> {
    const buffer = await fileBuffer(file)
    try {
        const result = await callWorker(
            { type: 'fit-image', buffer, minBytes, maxBytes, allowUpscale: true },
            [buffer],
            signal,
            onProgress
        )
        if (!result.blob) throw new Error('Could not fit that file.')
        return { blob: result.blob, size: result.size ?? result.blob.size, shrunk: Boolean(result.shrunk) }
    } catch (error) {
        if ((error as Error).name === 'AbortError') throw error
        const bitmap = await loadImageBitmap(file)
        try {
            const blob = await fitImageOnMain(bitmap, minBytes, maxBytes, true, signal, onProgress)
            return { blob, size: blob.size, shrunk: true }
        } finally {
            bitmap.close()
        }
    }
}

export async function workerCompressImage(
    file: File,
    minBytes: number,
    maxBytes: number,
    signal: AbortSignal,
    onProgress?: (size: number) => void
): Promise<JobResult> {
    const buffer = await fileBuffer(file)
    try {
        const result = await callWorker(
            { type: 'compress-image', buffer, minBytes, maxBytes, allowUpscale: false },
            [buffer],
            signal,
            onProgress
        )
        if (!result.blob) throw new Error('Could not compress that photo.')
        return { blob: result.blob, size: result.size ?? result.blob.size, shrunk: Boolean(result.shrunk) }
    } catch (error) {
        if ((error as Error).name === 'AbortError') throw error
        const bitmap = await loadImageBitmap(file)
        try {
            const blob = await fitImageOnMain(bitmap, minBytes, maxBytes, false, signal, onProgress)
            return { blob, size: blob.size, shrunk: true }
        } finally {
            bitmap.close()
        }
    }
}

export async function workerMakePhoto(
    file: File,
    options: {
        width: number
        height: number
        minBytes: number
        maxBytes: number
        fill: string
        crop: { x: number; y: number; w: number; h: number }
    },
    signal: AbortSignal,
    onProgress?: (size: number) => void
): Promise<JobResult> {
    const buffer = await fileBuffer(file)
    try {
        const result = await callWorker(
            {
                type: 'make-photo',
                buffer,
                minBytes: options.minBytes,
                maxBytes: options.maxBytes,
                outW: options.width,
                outH: options.height,
                fill: options.fill,
                crop: options.crop,
            },
            [buffer],
            signal,
            onProgress
        )
        if (!result.blob) throw new Error('Could not make that photo.')
        return { blob: result.blob, size: result.size ?? result.blob.size, shrunk: Boolean(result.shrunk) }
    } catch (error) {
        if ((error as Error).name === 'AbortError') throw error
        throw new Error((error as Error).message || TOO_BIG)
    }
}

export async function workerRemoveBackground(
    file: File,
    fill: [number, number, number],
    signal: AbortSignal
): Promise<{ blob: Blob; ratio: number }> {
    const buffer = await fileBuffer(file)
    const result = await callWorker(
        { type: 'remove-bg', buffer, fill },
        [buffer],
        signal
    )
    if (!result.blob) throw new Error('Could not pick out the background.')
    return { blob: result.blob, ratio: result.ratio ?? 0 }
}

async function fitImageOnMain(
    bitmap: ImageBitmap,
    minBytes: number,
    maxBytes: number,
    allowUpscale: boolean,
    signal: AbortSignal,
    onProgress?: (size: number) => void
): Promise<Blob> {
    const canvas = await canvasFromBitmap(bitmap)
    let w = canvas.width
    let h = canvas.height
    let q = 0.88
    let best = await encodeJpeg(canvas, q)
    onProgress?.(best.size)
    let guard = 0
    while (guard++ < 14) {
        if (signal.aborted) throw new DOMException('Cancelled', 'AbortError')
        if (best.size >= minBytes && best.size <= maxBytes) return best
        if (best.size > maxBytes) {
            if (q > 0.28) q = Math.max(0.2, q - 0.12)
            else {
                w = Math.max(48, Math.round(w * 0.84))
                h = Math.max(48, Math.round(h * 0.84))
                const tmp = document.createElement('canvas')
                tmp.width = w
                tmp.height = h
                tmp.getContext('2d')!.drawImage(canvas, 0, 0, w, h)
                canvas.width = w
                canvas.height = h
                canvas.getContext('2d')!.drawImage(tmp, 0, 0)
                q = 0.55
            }
        } else if (q < 0.95) {
            q = Math.min(0.95, q + 0.1)
        } else if (allowUpscale) {
            const nextW = Math.round(w * 1.12)
            const nextH = Math.round(h * 1.12)
            if (nextW * nextH > MAX_PIXELS) break
            const tmp = document.createElement('canvas')
            tmp.width = nextW
            tmp.height = nextH
            tmp.getContext('2d')!.fillStyle = '#fff'
            tmp.getContext('2d')!.fillRect(0, 0, nextW, nextH)
            tmp.getContext('2d')!.drawImage(canvas, 0, 0, nextW, nextH)
            canvas.width = nextW
            canvas.height = nextH
            canvas.getContext('2d')!.drawImage(tmp, 0, 0)
            w = nextW
            h = nextH
            q = 0.92
        } else {
            break
        }
        best = await encodeJpeg(canvas, q)
        onProgress?.(best.size)
        await yieldToUi()
    }
    return best
}

export { yieldToUi }

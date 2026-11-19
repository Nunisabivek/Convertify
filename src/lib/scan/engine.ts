/**
 * Main-thread side of the scanner engine. Heavy work goes to the scan worker
 * (public/scan-worker.js); WebViews without OffscreenCanvas in workers fall
 * back to the same pure functions on a CPU canvas here.
 */
import { detectDocumentQuad, type Quad } from '@/lib/document-scanner'
import { warpPerspective, rotateRGBA } from './homography'
import { enhance, type ScanMode } from './enhance'
import { pageSize } from './paper'

export type { ScanMode }

export interface ProcessedPage {
    original: Blob
    filtered: Blob
    thumb: Blob
    width: number
    height: number
}

export interface RenderedPage {
    filtered: Blob
    thumb: Blob
    width: number
    height: number
}

const THUMB_LONG = 240
/** Worker failures that mean "do it on this thread instead", not "this page failed". */
const FALL_BACK = new Set(['no-offscreen', 'no-worker', 'worker-crashed'])
const QUALITY = 0.9

/** Long side of a finished page: A4 at 300 dpi, a little less on low-memory phones. */
export function maxPageLong(): number {
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
    return mem <= 3 ? 3000 : 3508
}

let worker: Worker | null = null
let workerBroken = false
let seq = 0
const pending = new Map<number, { resolve: (v: any) => void; reject: (e: Error) => void }>()

function getWorker(): Worker | null {
    if (workerBroken || typeof Worker === 'undefined') return null
    if (!worker) {
        try {
            worker = new Worker('/scan-worker.js')
        } catch {
            workerBroken = true
            return null
        }
        worker.onmessage = (e: MessageEvent) => {
            const msg = e.data
            const p = pending.get(msg.id)
            if (!p) return
            pending.delete(msg.id)
            if (msg.ok) p.resolve(msg)
            else p.reject(new Error(msg.error))
        }
        worker.onerror = () => {
            workerBroken = true
            for (const p of pending.values()) p.reject(new Error('worker-crashed'))
            pending.clear()
            worker = null
        }
    }
    return worker
}

function viaWorker<T>(job: Record<string, unknown>): Promise<T> {
    const w = getWorker()
    if (!w) return Promise.reject(new Error('no-worker'))
    const id = ++seq
    return new Promise<T>((resolve, reject) => {
        pending.set(id, { resolve, reject })
        w.postMessage({ ...job, id })
    })
}

// ---------- Main-thread fallback (old WebViews) ----------

function cpuCanvas(w: number, h: number) {
    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    // CPU-backed on purpose: GPU canvas toBlob stalls Android WebView for seconds.
    const g = c.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
    return { c, g }
}

const toJpeg = (c: HTMLCanvasElement, q: number) =>
    new Promise<Blob>((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error('encode'))), 'image/jpeg', q))

async function localPixels(source: Blob | ImageBitmap, scale: number) {
    const bmp = source instanceof Blob ? await createImageBitmap(source) : source
    const w = Math.max(1, Math.round(bmp.width * scale))
    const h = Math.max(1, Math.round(bmp.height * scale))
    const { g } = cpuCanvas(w, h)
    g.imageSmoothingQuality = 'high'
    g.drawImage(bmp, 0, 0, w, h)
    return { data: g.getImageData(0, 0, w, h).data, w, h }
}

async function localEncode(data: Uint8ClampedArray, w: number, h: number, q: number) {
    const { c, g } = cpuCanvas(w, h)
    g.putImageData(new ImageData(data as unknown as Uint8ClampedArray<ArrayBuffer>, w, h), 0, 0)
    return toJpeg(c, q)
}

async function localFinish(page: Uint8ClampedArray, w: number, h: number, mode: ScanMode, rotation: number): Promise<RenderedPage> {
    enhance(page, w, h, mode)
    const r = rotateRGBA(page, w, h, rotation)
    const filtered = await localEncode(r.data, r.width, r.height, QUALITY)
    const s = Math.min(1, THUMB_LONG / Math.max(r.width, r.height))
    const full = cpuCanvas(r.width, r.height)
    full.g.putImageData(new ImageData(r.data as unknown as Uint8ClampedArray<ArrayBuffer>, r.width, r.height), 0, 0)
    const t = cpuCanvas(Math.round(r.width * s), Math.round(r.height * s))
    t.g.drawImage(full.c, 0, 0, t.c.width, t.c.height)
    return { filtered, thumb: await toJpeg(t.c, 0.8), width: r.width, height: r.height }
}

// ---------- Public API ----------

export interface ProcessInput {
    /** Full photo (gallery file, camera still) or a captured video frame. */
    source: Blob | ImageBitmap
    sourceWidth: number
    sourceHeight: number
    /** Page corners in source pixels; null keeps the whole picture. */
    quad: Quad | null
    mode: ScanMode
    rotation: number
}

const edge = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y)

/** Flattens, enhances and encodes one page. */
export async function processPage(input: ProcessInput): Promise<ProcessedPage> {
    const { sourceWidth: sw, sourceHeight: sh, quad } = input
    const qw = quad ? (edge(quad.tl, quad.tr) + edge(quad.bl, quad.br)) / 2 : sw
    const qh = quad ? (edge(quad.tl, quad.bl) + edge(quad.tr, quad.br)) / 2 : sh
    const size = pageSize(qw, qh, maxPageLong())
    // Shrink a huge photo first so the page is never sampled from more than
    // ~1.3x its own size: sharper result, a fraction of the memory.
    const ratio = Math.max(qw / size.width, qh / size.height)
    const scale = ratio > 1.3 ? 1.3 / ratio : 1
    const job = {
        op: 'process',
        source: input.source,
        scale,
        quad,
        width: size.width,
        height: size.height,
        mode: input.mode,
        rotation: input.rotation,
        thumbLong: THUMB_LONG,
        quality: QUALITY,
    }
    if (!workerBroken) {
        try {
            // Copied, not transferred: if this WebView's worker can't do the job,
            // the fallback below still has the frame.
            return await viaWorker<ProcessedPage>(job)
        } catch (err) {
            if (!FALL_BACK.has((err as Error).message)) throw err
            workerBroken = true
        }
    }
    const src = await localPixels(input.source, scale)
    const k = (p: { x: number; y: number }) => ({ x: p.x * scale, y: p.y * scale })
    const q = quad
        ? { tl: k(quad.tl), tr: k(quad.tr), br: k(quad.br), bl: k(quad.bl) }
        : { tl: { x: 0, y: 0 }, tr: { x: src.w, y: 0 }, br: { x: src.w, y: src.h }, bl: { x: 0, y: src.h } }
    const page = warpPerspective(src.data, src.w, src.h, q, size.width, size.height)
    const original = await localEncode(page, size.width, size.height, 0.92)
    const out = await localFinish(page, size.width, size.height, input.mode, input.rotation)
    return { original, ...out }
}

/** Re-applies a filter and rotation to an already flattened page. */
export async function renderPage(original: Blob, mode: ScanMode, rotation: number): Promise<RenderedPage> {
    const job = { op: 'render', original, mode, rotation, thumbLong: THUMB_LONG, quality: QUALITY }
    if (!workerBroken) {
        try {
            return await viaWorker<RenderedPage>(job)
        } catch (err) {
            if (!FALL_BACK.has((err as Error).message)) throw err
            workerBroken = true
        }
    }
    const src = await localPixels(original, 1)
    return localFinish(src.data, src.w, src.h, mode, rotation)
}

/** Turns a captured camera frame into a JPEG photo (kept for re-cropping). */
export async function frameToBlob(frame: ImageBitmap): Promise<{ blob: Blob; width: number; height: number }> {
    if (!workerBroken) {
        try {
            return await viaWorker<{ blob: Blob; width: number; height: number }>({ op: 'still', source: frame })
        } catch (err) {
            if (!FALL_BACK.has((err as Error).message)) throw err
            workerBroken = true
        }
    }
    const { c, g } = cpuCanvas(frame.width, frame.height)
    g.drawImage(frame, 0, 0)
    return { blob: await toJpeg(c, 0.92), width: frame.width, height: frame.height }
}

/** Long side the page finder works at (fast, and what it is tuned for). */
const DETECT_LONG = 320

/** Size of a picture as displayed (EXIF orientation applied), without decoding it all. */
export function imageSize(file: Blob): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file)
        const img = new Image()
        img.onload = () => {
            URL.revokeObjectURL(url)
            resolve({ width: img.naturalWidth, height: img.naturalHeight })
        }
        img.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error('This picture could not be opened.'))
        }
        img.src = url
    })
}

/** Finds the page in a photo. Returns corners in the photo's own pixels. */
export async function findPage(file: Blob, width: number, height: number): Promise<Quad | null> {
    const k = DETECT_LONG / Math.max(width, height)
    const dw = Math.max(1, Math.round(width * k))
    const dh = Math.max(1, Math.round(height * k))
    try {
        const bmp = await createImageBitmap(file, { resizeWidth: dw, resizeHeight: dh, resizeQuality: 'medium' })
        const { g } = cpuCanvas(dw, dh)
        g.drawImage(bmp, 0, 0)
        bmp.close()
        const found = detectDocumentQuad(g.getImageData(0, 0, dw, dh), dw, dh)
        if (!found) return null
        const up = (p: { x: number; y: number }) => ({ x: p.x / k, y: p.y / k })
        return insetQuad({ tl: up(found.quad.tl), tr: up(found.quad.tr), br: up(found.quad.br), bl: up(found.quad.bl) })
    } catch {
        return null
    }
}

/**
 * Pulls auto-detected corners in by a hair (0.6% of the page) so a sliver of
 * desk or drop shadow never shows as a grey edge on the scan.
 */
export function insetQuad(q: Quad, amount = 0.006): Quad {
    const cx = (q.tl.x + q.tr.x + q.br.x + q.bl.x) / 4
    const cy = (q.tl.y + q.tr.y + q.br.y + q.bl.y) / 4
    const k = (p: { x: number; y: number }) => ({ x: p.x + (cx - p.x) * amount * 2, y: p.y + (cy - p.y) * amount * 2 })
    return { tl: k(q.tl), tr: k(q.tr), br: k(q.br), bl: k(q.bl) }
}

/** Starts the worker early (e.g. when the camera opens) so the first page doesn't wait for it. */
export function warmScanWorker(): void {
    getWorker()
}

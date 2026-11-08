import type { PixelResult } from "@/lib/cad/detect"
import type { Box } from "@/lib/cad/geometry"

export const abortError = () => new DOMException("Aborted", "AbortError")
export const isAbort = (e: unknown) => (e as Error)?.name === "AbortError"

type Pending = {
    resolve: (r: PixelResult | null) => void
    reject: (e: unknown) => void
    onProgress: (done: number) => void
}

/**
 * One background worker for page pixels (src/lib/cad/detect-worker.ts). Cancelling a page
 * terminates the worker outright, so work for a page the user has left never keeps
 * the CPU busy; the next page gets a fresh worker. If the worker can't start (old
 * browser, blocked script), `available` turns false and callers fall back to the
 * main thread.
 */
export class PageWorker {
    private worker: Worker | null = null
    private broken = false
    private seq = 0
    private pending = new Map<number, Pending>()

    get available(): boolean {
        return (
            !this.broken &&
            typeof Worker !== "undefined" &&
            typeof OffscreenCanvas !== "undefined" &&
            typeof createImageBitmap === "function"
        )
    }

    markBroken() {
        this.broken = true
        this.cancel()
    }

    private ensure(): Worker {
        if (this.worker) return this.worker
        // Built from src/lib/cad/detect-worker.ts by scripts/build-cad-worker.mjs (prebuild).
        const w = new Worker("/cad-detect-worker.js")
        w.onmessage = (e: MessageEvent) => {
            const m = e.data as { id: number; type: string; done?: number; result?: PixelResult | null; message?: string }
            const p = this.pending.get(m.id)
            if (!p) return
            if (m.type === "progress") p.onProgress(m.done ?? 0)
            else if (m.type === "done") {
                this.pending.delete(m.id)
                p.resolve(m.result ?? null)
            } else {
                this.pending.delete(m.id)
                p.reject(new Error(m.message || "Worker failed"))
            }
        }
        w.onerror = (e) => {
            e.preventDefault()
            this.broken = true
            this.stop(new Error(`Page worker failed: ${e.message || "could not start"}`))
        }
        this.worker = w
        return w
    }

    /** Hands `bitmap` (transferred) to the worker and resolves with what it finds in the pixels. */
    run(bitmap: ImageBitmap, detect: { scale: number; textBoxes: Box[] }, signal: AbortSignal, onProgress: (done: number) => void): Promise<PixelResult> {
        if (signal.aborted) {
            bitmap.close()
            return Promise.reject(abortError())
        }
        const w = this.ensure()
        const id = ++this.seq
        return new Promise((resolve, reject) => {
            const onAbort = () => this.cancel()
            signal.addEventListener("abort", onAbort, { once: true })
            const done = () => signal.removeEventListener("abort", onAbort)
            this.pending.set(id, {
                resolve: (r) => {
                    done()
                    if (r) resolve(r)
                    else reject(new Error("Worker returned no result"))
                },
                reject: (e) => {
                    done()
                    reject(e)
                },
                onProgress,
            })
            w.postMessage({ id, bitmap, W: bitmap.width, H: bitmap.height, detect }, [bitmap])
        })
    }

    /** Stops whatever the worker is doing; pending jobs reject with AbortError. */
    cancel() {
        this.stop(abortError())
    }

    private stop(reason: unknown) {
        this.worker?.terminate()
        this.worker = null
        const all = [...this.pending.values()]
        this.pending.clear()
        all.forEach((p) => p.reject(reason))
    }
}

/** Gives the browser a turn (input, paint) between slices of main-thread work. */
export function yieldToMain(): Promise<void> {
    const s = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler
    if (s?.yield) return s.yield()
    return new Promise((resolve) => {
        const ch = new MessageChannel()
        ch.port1.onmessage = () => resolve()
        ch.port2.postMessage(null)
    })
}

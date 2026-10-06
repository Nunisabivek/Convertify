import type { ComponentType } from 'react'

type ToolModule = { default: ComponentType<any> }
type Loader = () => Promise<ToolModule>

/**
 * One loader per Android tool. The sheet renders each through React.lazy, and
 * `preloadTool` calls the same loader early, so by the time the user taps a
 * tile the JS chunk is already downloaded and evaluated. Parsing a tool's
 * chunk (pdf-lib, canvas helpers) is the heaviest thing that used to happen
 * *during* the slide-up, which is what made low-end phones stutter.
 */
export const TOOL_LOADERS: Record<string, Loader> = {
    'compress-pdf': () => import('@/app/compress-pdf/mobile-client'),
    'fit-to-size': () => import('@/app/fit-to-size/client'),
    'passport-photo': () => import('@/app/passport-photo/client'),
    'remove-background': () => import('@/app/remove-background/client'),
    'merge-pdf': () => import('@/app/merge-pdf/client'),
    'split-pdf': () => import('@/app/split-pdf/client'),
    'rotate-pdf': () => import('@/app/rotate-pdf/client'),
    'jpg-to-pdf': () => import('@/app/jpg-to-pdf/mobile-client'),
    'png-to-pdf': () => import('@/app/png-to-pdf/client'),
    'pdf-to-jpg': () => import('@/app/pdf-to-jpg/client'),
    'pdf-to-png': () => import('@/app/pdf-to-png/client'),
    'word-to-pdf': () => import('@/app/word-to-pdf/client'),
    'pdf-to-word': () => import('@/app/pdf-to-word/client'),
    'excel-to-pdf': () => import('@/app/excel-to-pdf/client'),
    'image-compressor': () => import('@/app/image-compressor/mobile-client'),
    'resize-image': () => import('@/app/resize-image/client'),
    'heic-to-jpg': () => import('@/app/heic-to-jpg/client'),
    'webp-converter': () => import('@/app/webp-converter/client'),
    'watermark-pdf': () => import('@/app/watermark-pdf/client'),
    'add-page-numbers': () => import('@/app/add-page-numbers/client'),
    'qr-code-generator': () => import('@/app/qr-code-generator/client'),
    'autocad-pdf-editor': () => import('@/app/autocad-pdf-editor/client'),
    'ocr-pdf': () => import('@/app/ocr-pdf/client'),
    'scan-document': () => import('@/app/ocr-pdf/client'),
}

const started = new Set<string>()

/** Start downloading + evaluating a tool's chunk. Safe to call repeatedly. */
export function preloadTool(id: string): void {
    const load = TOOL_LOADERS[id]
    if (!load || started.has(id)) return
    started.add(id)
    void load().catch(() => {
        // Allow a retry on the next tap if the chunk failed.
        started.delete(id)
    })
}

/** True on phones where eager background work would itself cause jank. */
export function isLowEndDevice(): boolean {
    if (typeof navigator === 'undefined') return false
    const nav = navigator as Navigator & {
        deviceMemory?: number
        connection?: { saveData?: boolean }
    }
    const cores = nav.hardwareConcurrency ?? 8
    const memory = nav.deviceMemory ?? 8
    return cores <= 4 || memory <= 3 || nav.connection?.saveData === true
}

/**
 * Warm the tool chunks one at a time while the main thread is idle, starting
 * with the Home quick tools. Low-end devices only warm the first few, so
 * preloading never competes with the user's scrolling for memory or CPU.
 */
export function preloadToolsWhenIdle(priority: string[]): void {
    if (typeof window === 'undefined') return
    const rest = Object.keys(TOOL_LOADERS).filter((id) => !priority.includes(id))
    const queue = isLowEndDevice() ? priority.slice(0, 4) : [...priority, ...rest]
    const idle =
        (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
            .requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 350))

    const next = () => {
        const id = queue.shift()
        if (!id) return
        preloadTool(id)
        idle(next, { timeout: 2500 })
    }
    idle(next, { timeout: 2500 })
}

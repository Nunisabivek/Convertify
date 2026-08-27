import { PDFDocument } from 'pdf-lib'
import { MAX_INPUT_BYTES, TOO_BIG } from '@/lib/brand'
import { yieldToUi } from '@/lib/jobs/media'

const MAX_PAGES = 40

export async function fitPdfToRange(
    file: File,
    minBytes: number,
    maxBytes: number,
    signal: AbortSignal,
    onProgress: (info: { size: number; note: string }) => void
): Promise<Blob> {
    if (signal.aborted) throw new DOMException('Cancelled', 'AbortError')
    if (file.size > MAX_INPUT_BYTES) throw new Error(TOO_BIG)
    const { loadPdfjs } = await import('@/lib/pdfjs')
    const pdfjsLib = await loadPdfjs()
    const data = await file.arrayBuffer()
    const src = await pdfjsLib.getDocument({ data }).promise
    if (src.numPages > MAX_PAGES) {
        throw new Error('This PDF has too many pages for this phone. Split it first.')
    }

    let scale = src.numPages > 12 ? 1.0 : 1.25
    let quality = 0.72
    let best: Blob | null = null

    for (let attempt = 0; attempt < 8; attempt++) {
        if (signal.aborted) throw new DOMException('Cancelled', 'AbortError')
        try {
            best = await buildPdf(src, src.numPages, scale, quality, signal, (page) => {
                onProgress({
                    size: best?.size ?? file.size,
                    note: `Page ${page} of ${src.numPages}`,
                })
            })
        } catch (error) {
            if ((error as Error).name === 'AbortError') throw error
            throw new Error(TOO_BIG)
        }
        onProgress({ size: best.size, note: `Now ${(best.size / 1024).toFixed(0)} KB` })
        if (best.size >= minBytes && best.size <= maxBytes) return best
        if (best.size > maxBytes) {
            if (quality > 0.35) quality = Math.max(0.28, quality - 0.12)
            else scale = Math.max(0.45, scale * 0.8)
        } else {
            if (quality < 0.9) quality = Math.min(0.92, quality + 0.1)
            else scale = Math.min(2.0, scale * 1.12)
        }
        await yieldToUi()
    }
    return best!
}

async function buildPdf(
    srcPdf: { getPage: (n: number) => Promise<any>; numPages: number },
    numPages: number,
    scale: number,
    quality: number,
    signal: AbortSignal,
    onPage: (page: number) => void
): Promise<Blob> {
    const out = await PDFDocument.create()
    for (let i = 1; i <= numPages; i++) {
        if (signal.aborted) throw new DOMException('Cancelled', 'AbortError')
        const page = await srcPdf.getPage(i)
        const viewport = page.getViewport({ scale })
        if (viewport.width * viewport.height > 8_000_000) {
            throw new Error(TOO_BIG)
        }
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.floor(viewport.width))
        canvas.height = Math.max(1, Math.floor(viewport.height))
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error(TOO_BIG)
        await page.render({ canvasContext: ctx, viewport, canvas } as any).promise
        const blob: Blob = await new Promise((resolve, reject) => {
            canvas.toBlob((b) => (b ? resolve(b) : reject(new Error(TOO_BIG))), 'image/jpeg', quality)
        })
        const bytes = new Uint8Array(await blob.arrayBuffer())
        const jpg = await out.embedJpg(bytes)
        const newPage = out.addPage([jpg.width, jpg.height])
        newPage.drawImage(jpg, { x: 0, y: 0, width: jpg.width, height: jpg.height })
        canvas.width = 1
        canvas.height = 1
        onPage(i)
        await yieldToUi()
    }
    const pdfBytes = await out.save()
    return new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
}

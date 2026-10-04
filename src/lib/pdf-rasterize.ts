import { PDFDocument } from 'pdf-lib'

// The slice of a pdf.js page this needs, so callers can pass pdf.js objects as they are.
type Viewport = { width: number; height: number }
export interface RasterizablePage {
    getViewport(options: { scale: number }): Viewport
    render(options: { canvasContext: CanvasRenderingContext2D; viewport: Viewport }): { promise: Promise<unknown> }
}
export interface RasterizableDocument {
    numPages: number
    getPage(pageNumber: number): Promise<RasterizablePage>
}

/**
 * Last-resort recovery: draw every page pdf.js can read onto a canvas and put
 * the pictures into a fresh, valid PDF. Text is no longer selectable, but the
 * pages look exactly as pdf.js shows them. Pages that cannot be drawn are
 * skipped; throws if none can.
 */
export async function rasterizePdfDocument(doc: RasterizableDocument, scale = 2) {
    const out = await PDFDocument.create()
    let pagesRecovered = 0
    for (let i = 1; i <= doc.numPages; i++) {
        try {
            const page = await doc.getPage(i)
            const viewport = page.getViewport({ scale })
            const canvas = document.createElement('canvas')
            canvas.width = Math.ceil(viewport.width)
            canvas.height = Math.ceil(viewport.height)
            const ctx = canvas.getContext('2d')
            if (!ctx) continue
            await page.render({ canvasContext: ctx, viewport }).promise
            const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
            if (!blob) continue
            const image = await out.embedPng(new Uint8Array(await blob.arrayBuffer()))
            const size = page.getViewport({ scale: 1 })
            out.addPage([size.width, size.height]).drawImage(image, { x: 0, y: 0, width: size.width, height: size.height })
            pagesRecovered++
        } catch {
            // Unreadable page: leave it out and keep going.
        }
    }
    if (pagesRecovered === 0) throw new Error('No readable pages.')
    return { bytes: await out.save(), pagesRecovered, pagesTotal: doc.numPages }
}

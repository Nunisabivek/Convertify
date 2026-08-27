/**
 * Load pdf.js with a worker that ships in the app (copied to /pdf.worker.min.mjs).
 * The website previously pointed at unpkg, which breaks offline and in Capacitor.
 */
let loading: Promise<typeof import('pdfjs-dist')> | null = null

export async function loadPdfjs() {
    if (!loading) {
        loading = (async () => {
            const pdfjsLib = await import('pdfjs-dist')
            pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
            return pdfjsLib
        })()
    }
    return loading
}

/**
 * Load pdf.js with a worker that ships in the app (copied to /pdf.worker.min.mjs by
 * `prebuild` and build-mobile — the file is gitignored). Every pdf.js caller must go
 * through here: hand-rolled CDN worker URLs 404'd and broke 11 tools in production.
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

import { askPdfPassword, knownPdfPasswords, rememberPdfPassword } from './pdf-password'

/**
 * Load pdf.js with a worker that ships in the app (copied to /pdf.worker.min.mjs by
 * `prebuild` and build-mobile — the file is gitignored). Every pdf.js caller must go
 * through here: hand-rolled CDN worker URLs 404'd and broke 11 tools in production.
 *
 * getDocument is wrapped so password-protected PDFs ask for their password (once per
 * session, shared with loadPdf in pdf-password.ts) instead of failing. Callers that pass
 * their own `password` (Unlock PDF) keep handling PasswordException themselves.
 */
type Pdfjs = typeof import('pdfjs-dist')
let loading: Promise<Pdfjs> | null = null

export async function loadPdfjs(): Promise<Pdfjs> {
    if (!loading) {
        loading = (async () => {
            const pdfjsLib = await import('pdfjs-dist')
            pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
            const getDocument: Pdfjs['getDocument'] = (src) => {
                const task = pdfjsLib.getDocument(src)
                if (src && typeof src === 'object' && 'password' in src) return task
                const tries = knownPdfPasswords().slice(1) // pdf.js already tried the empty one
                let typed: string | null = null
                task.onPassword = (update: (pw: string) => void) => {
                    const next = tries.shift()
                    if (next !== undefined) return update(next)
                    const pw = askPdfPassword('This PDF', typed !== null)
                    if (pw === null) {
                        void task.destroy()
                        return
                    }
                    typed = pw
                    update(pw)
                }
                task.promise.then(() => { if (typed) rememberPdfPassword(typed) }, () => {})
                return task
            }
            return { ...pdfjsLib, getDocument }
        })()
    }
    return loading
}

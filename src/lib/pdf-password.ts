import * as pdfLib from 'pdf-lib'
import { configure, unlockInPlace } from 'pdf-lib-encrypt'

configure(pdfLib)

const WRONG_PW = 'Wrong password for this PDF.'

// Passwords typed this session. A tool that previews with pdf.js and saves
// with pdf-lib opens the same file twice; this keeps it to one prompt.
const remembered: string[] = []

export function rememberPdfPassword(pw: string) {
    if (pw && !remembered.includes(pw)) remembered.unshift(pw)
}

/** Every password worth trying before asking: none, then the ones typed this session. */
export function knownPdfPasswords(): string[] {
    return ['', ...remembered]
}

/** Native prompt: works on desktop, mobile browsers and the Capacitor WebView. Null = cancelled. */
export function askPdfPassword(name: string, retry: boolean): string | null {
    if (typeof window === 'undefined') return null
    const pw = window.prompt(retry
        ? `Wrong password for "${name}". Try again:`
        : `"${name}" is password-protected. Enter its password to open it:`)
    return pw === null ? null : pw
}

/**
 * PDFDocument.load that also opens encrypted PDFs. Permissions-only PDFs
 * (no open password, common for bank statements and e-tickets) open without
 * asking; a PDF that needs a password asks for it. The returned document is
 * decrypted, so whatever the tool saves is an ordinary unlocked PDF.
 */
export async function loadPdf(
    bytes: ArrayBuffer | Uint8Array,
    name = 'This PDF',
    ask: (name: string, retry: boolean) => string | null = askPdfPassword,
): Promise<pdfLib.PDFDocument> {
    try {
        return await pdfLib.PDFDocument.load(bytes)
    } catch (e) {
        // pdf-lib is compiled to ES5, so `instanceof EncryptedPDFError` is always false; match the message.
        if (!(e instanceof Error && /is encrypted/.test(e.message))) throw e
    }
    const doc = await pdfLib.PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false })
    const tryPassword = async (pw: string) => {
        try {
            // Validates the password before touching anything, so a wrong one leaves doc intact.
            await unlockInPlace(doc, pw)
            return true
        } catch (e) {
            if (e instanceof Error && e.message === WRONG_PW) return false
            throw new Error(`"${name}" uses encryption this tool can't open. Try Unlock PDF first.`)
        }
    }
    for (const pw of knownPdfPasswords()) if (await tryPassword(pw)) return doc
    for (let retry = false; ; retry = true) {
        const pw = ask(name, retry)
        if (pw === null) throw new Error(`"${name}" is password-protected.`)
        if (await tryPassword(pw)) {
            rememberPdfPassword(pw)
            return doc
        }
    }
}

import { PDFDocument } from 'pdf-lib'

export type FlatPage = { png: Uint8Array; width: number; height: number }

/**
 * Rebuild a PDF with some pages replaced by flat PNG renders (the pages that
 * carry redaction boxes). Returns the new file's bytes.
 *
 * The output is a fresh document, not an edit of the source. pdf-lib writes
 * every object it holds, so drawing a box over text, or removing the page,
 * still leaves the original text in the file. Each replaced page is also
 * emptied in place before copying. Otherwise anything on a kept page that
 * points at it, like a link or a form field spanning pages, would drag its
 * old content across with copyPages.
 */
export async function buildRedactedPdf(src: ArrayBuffer | Uint8Array, flat: Map<number, FlatPage>) {
    const srcDoc = await PDFDocument.load(src)
    const pages = srcDoc.getPages()
    for (const i of flat.keys()) {
        const node = pages[i].node
        for (const key of node.keys()) node.delete(key)
    }

    const out = await PDFDocument.create()
    const kept = await out.copyPages(srcDoc, pages.map((_, i) => i).filter(i => !flat.has(i)))
    for (let i = 0, k = 0; i < pages.length; i++) {
        const f = flat.get(i)
        if (!f) {
            out.addPage(kept[k++])
            continue
        }
        const img = await out.embedPng(f.png)
        out.addPage([f.width, f.height]).drawImage(img, { x: 0, y: 0, width: f.width, height: f.height })
    }
    return out.save()
}

import { PDFDocument } from 'pdf-lib'

// One char per byte, so string offsets equal byte offsets.
function bytesToBinaryString(bytes: Uint8Array): string {
    let out = ''
    const CHUNK = 0x8000
    for (let i = 0; i < bytes.length; i += CHUNK) {
        out += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
    }
    return out
}

/**
 * Give a PDF whose end was cut off, or whose trailer / cross-reference table is
 * damaged, a fresh trailer so a normal parser can open it.
 *
 * The usual cause is an interrupted download: every object is still in the
 * file but the `trailer`, `startxref` and `%%EOF` markers are gone. pdf-lib
 * does not use the xref offsets (it reads objects in order), it only needs a
 * trailer that names the document catalog. This finds the catalog and the
 * highest object number by scanning, drops anything after the last complete
 * `endobj`, and appends a synthesized trailer.
 *
 * When the catalog sits inside a compressed object stream a text scan cannot
 * see it, so the trailer is written without /Root and pdf-lib finds the catalog
 * itself once it has parsed the object streams. Returns null only when the
 * file has no complete object at all.
 */
export function rebuildTrailer(input: Uint8Array): Uint8Array | null {
    const head = bytesToBinaryString(input.subarray(0, Math.min(1024, input.length)))
    const start = Math.max(0, head.indexOf('%PDF'))
    const bytes = input.subarray(start)

    const text = bytesToBinaryString(bytes)
    const lastEndobj = text.lastIndexOf('endobj')
    if (lastEndobj === -1) return null
    const cut = lastEndobj + 'endobj'.length
    const body = text.slice(0, cut)

    let maxObj = 0
    for (const m of body.matchAll(/(\d+)\s+(\d+)\s+obj\b/g)) {
        maxObj = Math.max(maxObj, Number(m[1]))
    }

    // Latest object that declares /Type /Catalog wins (incremental updates
    // append newer versions at the end).
    let catalog = -1
    for (const m of body.matchAll(/\/Type\s*\/Catalog\b/g)) {
        const before = body.lastIndexOf(' obj', m.index)
        if (before === -1) continue
        const header = body.slice(Math.max(0, before - 24), before + 4).match(/(\d+)\s+(\d+)\s+obj$/)
        if (header) catalog = Number(header[1])
    }
    const root = catalog === -1 ? '' : ` /Root ${catalog} 0 R`
    const trailer = `\ntrailer\n<< /Size ${maxObj + 1}${root} >>\nstartxref\n0\n%%EOF\n`
    const out = new Uint8Array(cut + trailer.length)
    out.set(bytes.subarray(0, cut), 0)
    for (let i = 0; i < trailer.length; i++) out[cut + i] = trailer.charCodeAt(i)
    return out
}

export type RepairResult = { bytes: Uint8Array; pagesRecovered: number; pagesTotal: number }

/**
 * Open a damaged PDF with progressively more forgiving strategies and copy
 * every page that can be read into a fresh document.
 */
export async function repairPdf(input: ArrayBuffer | Uint8Array): Promise<RepairResult> {
    const raw = input instanceof Uint8Array ? input : new Uint8Array(input)

    const attempts: Array<() => Uint8Array | null> = [
        () => raw,
        () => {
            // Junk before the header.
            const head = bytesToBinaryString(raw.subarray(0, Math.min(1024, raw.length)))
            const at = head.indexOf('%PDF')
            return at > 0 ? raw.subarray(at) : null
        },
        () => rebuildTrailer(raw),
    ]

    let src: PDFDocument | null = null
    for (const attempt of attempts) {
        try {
            const candidate = attempt()
            if (!candidate) continue
            src = await PDFDocument.load(candidate, { ignoreEncryption: true, updateMetadata: false })
            if (src.getPageCount() > 0) break
            src = null
        } catch {
            src = null
        }
    }
    if (!src) throw new Error('Unable to parse valid PDF structures.')

    const out = await PDFDocument.create()
    const pagesTotal = src.getPageCount()
    let pagesRecovered = 0
    for (let i = 0; i < pagesTotal; i++) {
        try {
            const [page] = await out.copyPages(src, [i])
            out.addPage(page)
            pagesRecovered++
        } catch {
            // A page whose objects were lost in the damage; keep the rest.
        }
    }
    if (pagesRecovered === 0) throw new Error('No readable pages.')
    return { bytes: await out.save(), pagesRecovered, pagesTotal }
}

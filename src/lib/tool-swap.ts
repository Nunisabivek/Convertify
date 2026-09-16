/**
 * Swap only between tools that both have a real conversion client.
 *
 * Reverse routes that are noindex Coming Soon stubs (pdf-to-excel,
 * pdf-to-powerpoint, protect/unlock, edit-pdf, …) are never offered.
 * A stub page may still swap *to* a working tool (pdf-to-excel → excel-to-pdf).
 */

export const WORKING_CLIENT_IDS = new Set<string>([
    'fit-to-size',
    'passport-photo',
    'remove-background',
    'merge-pdf',
    'split-pdf',
    'compress-pdf',
    'rotate-pdf',
    'jpg-to-pdf',
    'png-to-pdf',
    'pdf-to-jpg',
    'pdf-to-png',
    'word-to-pdf',
    'pdf-to-word',
    'excel-to-pdf',
    'image-compressor',
    'resize-image',
    'heic-to-jpg',
    'webp-converter',
    'watermark-pdf',
    'add-page-numbers',
    'qr-code-generator',
    'pdf-to-text',
    'text-to-pdf',
    'jpg-to-png',
    'png-to-jpg',
    'csv-to-json',
    'json-to-csv',
    'xml-to-json',
    'svg-to-png',
    'bmp-to-jpg',
    'gif-to-png',
    'tiff-to-pdf',
    'html-to-pdf',
    'markdown-to-pdf',
    'base64',
    'autocad-pdf-editor',
    'organize-pdf',
])

/** Short labels on Swap chips and convert glyphs. */
export const FORMAT_SHORT: Record<string, string> = {
    pdf: 'PDF',
    jpg: 'JPG',
    jpeg: 'JPG',
    png: 'PNG',
    word: 'Word',
    excel: 'Excel',
    powerpoint: 'PPT',
    text: 'Text',
    csv: 'CSV',
    json: 'JSON',
    xml: 'XML',
    heic: 'HEIC',
    svg: 'SVG',
    bmp: 'BMP',
    gif: 'GIF',
    tiff: 'TIFF',
    html: 'HTML',
    markdown: 'MD',
}

/** Compact 3–4 letter badges for Home / Tools icons. */
export const FORMAT_BADGE: Record<string, string> = {
    pdf: 'PDF',
    jpg: 'JPG',
    jpeg: 'JPG',
    png: 'PNG',
    word: 'DOC',
    excel: 'XLS',
    powerpoint: 'PPT',
    text: 'TXT',
    csv: 'CSV',
    json: 'JSON',
    xml: 'XML',
    heic: 'HEIC',
    svg: 'SVG',
    bmp: 'BMP',
    gif: 'GIF',
    tiff: 'TIF',
    html: 'HTML',
    markdown: 'MD',
}

/**
 * Logical reverse of a convert (or merge/split) route.
 * Target is only used when it is in WORKING_CLIENT_IDS.
 */
const REVERSE_ROUTE: Record<string, string> = {
    'pdf-to-jpg': 'jpg-to-pdf',
    'jpg-to-pdf': 'pdf-to-jpg',
    'pdf-to-png': 'png-to-pdf',
    'png-to-pdf': 'pdf-to-png',
    'pdf-to-word': 'word-to-pdf',
    'word-to-pdf': 'pdf-to-word',
    'pdf-to-text': 'text-to-pdf',
    'text-to-pdf': 'pdf-to-text',
    'jpg-to-png': 'png-to-jpg',
    'png-to-jpg': 'jpg-to-png',
    'csv-to-json': 'json-to-csv',
    'json-to-csv': 'csv-to-json',
    'merge-pdf': 'split-pdf',
    'split-pdf': 'merge-pdf',
    // Stub → working only. excel-to-pdf does not reverse to the stub.
    'pdf-to-excel': 'excel-to-pdf',
}

const ACTION_LABEL: Record<string, string> = {
    'merge-pdf': 'Merge PDF',
    'split-pdf': 'Split PDF',
}

export type ConvertDirection = {
    from: string
    to: string
    fromBadge: string
    toBadge: string
}

export function parseConvertDirection(toolId: string): ConvertDirection | null {
    const match = /^([a-z0-9]+)-to-([a-z0-9]+)$/.exec(toolId)
    if (!match) return null
    const from = FORMAT_SHORT[match[1]]
    const to = FORMAT_SHORT[match[2]]
    const fromBadge = FORMAT_BADGE[match[1]]
    const toBadge = FORMAT_BADGE[match[2]]
    if (!from || !to || !fromBadge || !toBadge) return null
    return { from, to, fromBadge, toBadge }
}

export type SwapInfo = {
    target: string
    /** e.g. "JPG → PDF" or "Split PDF" */
    targetDirection: string
    targetFrom: string
    targetTo: string
    currentDirection: string | null
    currentFrom: string | null
    currentTo: string | null
}

function directionLabel(id: string): string {
    const parsed = parseConvertDirection(id)
    if (parsed) return `${parsed.from} → ${parsed.to}`
    return ACTION_LABEL[id] ?? id
}

export function getSwapInfo(toolId: string): SwapInfo | null {
    const target = REVERSE_ROUTE[toolId]
    if (!target || !WORKING_CLIENT_IDS.has(target)) return null

    const current = parseConvertDirection(toolId)
    const next = parseConvertDirection(target)

    return {
        target,
        targetDirection: directionLabel(target),
        targetFrom: next?.from ?? ACTION_LABEL[target] ?? target,
        targetTo: next?.to ?? '',
        currentDirection: current ? `${current.from} → ${current.to}` : ACTION_LABEL[toolId] ?? null,
        currentFrom: current?.from ?? null,
        currentTo: current?.to ?? null,
    }
}

/** Pairs where *both* sides have a working client (for docs / tests). */
export function listWorkingSwapPairs(): Array<{ a: string; b: string }> {
    const seen = new Set<string>()
    const pairs: Array<{ a: string; b: string }> = []
    for (const [from, to] of Object.entries(REVERSE_ROUTE)) {
        if (!WORKING_CLIENT_IDS.has(from) || !WORKING_CLIENT_IDS.has(to)) continue
        const [a, b] = [from, to].sort()
        const key = `${a}|${b}`
        if (seen.has(key)) continue
        seen.add(key)
        pairs.push({ a, b })
    }
    return pairs.sort((x, y) => x.a.localeCompare(y.a))
}

/** Compatibility shape used by the old website swapper. */
export const SWAP_PAIRS: Record<string, { target: string; fromFormat: string; toFormat: string }> = {}
for (const from of Object.keys(REVERSE_ROUTE)) {
    const info = getSwapInfo(from)
    if (!info) continue
    SWAP_PAIRS[from] = {
        target: info.target,
        fromFormat: info.targetFrom,
        toFormat: info.targetTo || info.targetDirection,
    }
}

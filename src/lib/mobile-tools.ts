import {
    TOOL_CATEGORIES,
    getAllTools,
    type Tool,
    type ToolCategory,
} from './tools-registry.ts'

/**
 * Android v1 allowlist. Website registry may mark unfinished tools as
 * "active"; the app must never show those even if the website does.
 */
export const ANDROID_V1_TOOL_IDS = [
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
    'autocad-pdf-editor',
] as const

export type AndroidV1ToolId = (typeof ANDROID_V1_TOOL_IDS)[number]

const ANDROID_V1_SET = new Set<string>(ANDROID_V1_TOOL_IDS)

/** Home Quick Tools — common jobs, including buried convert reverses. */
export const ANDROID_QUICK_TOOL_IDS = [
    'fit-to-size',
    'passport-photo',
    'compress-pdf',
    'jpg-to-pdf',
    'pdf-to-jpg',
    'merge-pdf',
    'remove-background',
    'word-to-pdf',
] as const

/** Extra phrases a non-technical person would type. */
const SEARCH_ALIASES: Record<string, string[]> = {
    'fit-to-size': [
        '20kb', '50kb', '100kb', '200kb', '300kb', 'kb', 'size',
        'upsc', 'epfo', 'form', 'too big', 'too small', 'increase kb',
        'government', 'job form', 'job portal', 'university', '1mb', '2mb', 'visa',
    ],
    'passport-photo': [
        'passport', 'passport seva', 'icao', '630', 'photo', 'selfie',
        'signature', 'upsc photo', 'white background', 'bank photo',
        'ibps', 'ssc', 'thumb', 'thumb impression', '10kb', '20kb',
        '2x2', '600x600', 'us passport', 'visa photo', 'schengen', '35x45',
    ],
    'remove-background': [
        'background', 'remove bg', 'white background', 'kyc photo', 'cutout',
        'linkedin', 'headshot', 'id photo',
    ],
    'merge-pdf': ['combine', 'join', 'put together', 'one pdf'],
    'split-pdf': ['separate', 'extract pages', 'cut'],
    'compress-pdf': [
        '100kb', '200kb', '300kb', 'small', 'reduce size', 'shrink',
        'government', 'kyc', 'job form', 'form upload',
        'gmail', 'email', '10mb', '25mb', 'attachment',
    ],
    'jpg-to-pdf': [
        'photo to pdf', 'picture to pdf', 'image to pdf', 'camera to pdf',
        'gallery', 'photos', 'jpg to pdf', 'jpeg',
    ],
    'png-to-pdf': ['photo to pdf', 'picture to pdf', 'image to pdf', 'png'],
    'pdf-to-jpg': ['pdf to photo', 'pdf to picture', 'pdf to image', 'jpg'],
    'pdf-to-png': ['pdf to photo', 'pdf to picture', 'pdf to image', 'png'],
    'word-to-pdf': ['docx', 'document to pdf', 'word file'],
    'pdf-to-word': ['edit pdf', 'docx', 'word'],
    'excel-to-pdf': ['xls', 'xlsx', 'spreadsheet', 'sheet to pdf'],
    'heic-to-jpg': ['iphone photo', 'heif', 'apple photo', 'iphone'],
    'image-compressor': ['shrink photo', 'compress photo', 'reduce image'],
    'resize-image': ['photo size', 'make photo smaller', 'dimensions'],
    'webp-converter': ['webp to jpg', 'webp to png'],
    'watermark-pdf': ['stamp', 'confidential', 'draft'],
    'add-page-numbers': ['page number', 'number pages'],
    'qr-code-generator': ['qr', 'barcode', 'scan code'],
    'rotate-pdf': ['turn page', 'upside down', 'landscape'],
    'autocad-pdf-editor': [
        'edit pdf', 'fix pdf text', 'autocad', 'cad pdf', 'shx', 'label',
        'dimension', 'blueprint text', 'correct text', 'change text',
    ],
}

export function isAndroidV1Tool(id: string): boolean {
    return ANDROID_V1_SET.has(id)
}

export function getAndroidV1Tools(): Tool[] {
    return getAllTools().filter((tool) => isAndroidV1Tool(tool.id))
}

export function getAndroidQuickTools(): Tool[] {
    const byId = new Map(getAndroidV1Tools().map((t) => [t.id, t]))
    return ANDROID_QUICK_TOOL_IDS
        .map((id) => byId.get(id))
        .filter((t): t is Tool => Boolean(t))
}

export function getAndroidV1Categories(): ToolCategory[] {
    return TOOL_CATEGORIES
        .map((category) => ({
            ...category,
            name: category.id === 'forms-kyc' ? 'Form photos' : category.name,
            tools: category.tools.filter((tool) => isAndroidV1Tool(tool.id)),
        }))
        .filter((category) => category.tools.length > 0)
}

export function searchAndroidV1Tools(query: string): Tool[] {
    const q = query.trim().toLowerCase()
    if (!q) return getAndroidV1Tools()

    return getAndroidV1Tools().filter((tool) => {
        const aliases = SEARCH_ALIASES[tool.id] ?? []
        return (
            tool.name.toLowerCase().includes(q) ||
            tool.description.toLowerCase().includes(q) ||
            tool.keywords.some((k) => k.toLowerCase().includes(q)) ||
            aliases.some((a) => a.includes(q) || q.includes(a))
        )
    })
}

/** Short labels for home cards — one or two words, no jargon. */
export const ANDROID_SHORT_NAMES: Record<string, string> = {
    'fit-to-size': 'Fit to size',
    'passport-photo': 'Passport photo',
    'remove-background': 'Background',
    'merge-pdf': 'Merge',
    'split-pdf': 'Split',
    'compress-pdf': 'Compress PDF',
    'rotate-pdf': 'Rotate',
    'jpg-to-pdf': 'JPG → PDF',
    'png-to-pdf': 'PNG → PDF',
    'pdf-to-jpg': 'PDF → JPG',
    'pdf-to-png': 'PDF → PNG',
    'word-to-pdf': 'Word → PDF',
    'pdf-to-word': 'PDF → Word',
    'excel-to-pdf': 'Excel → PDF',
    'image-compressor': 'Shrink photo',
    'resize-image': 'Resize photo',
    'heic-to-jpg': 'HEIC to JPG',
    'webp-converter': 'WebP',
    'watermark-pdf': 'Watermark',
    'add-page-numbers': 'Page numbers',
    'qr-code-generator': 'QR code',
    'autocad-pdf-editor': 'Edit PDF text',
}

export const ANDROID_QUICK_HINTS: Record<string, string> = {
    'fit-to-size': 'Hit the size a form wants',
    'passport-photo': 'US, India, visa, bank',
    'compress-pdf': 'Small enough to upload',
    'jpg-to-pdf': 'Photos into one PDF',
    'pdf-to-jpg': 'Each page as a photo',
    'remove-background': 'White ID backdrop',
    'merge-pdf': 'Combine PDFs',
    'word-to-pdf': 'Word file into a PDF',
}

export function shortToolName(tool: Tool): string {
    return ANDROID_SHORT_NAMES[tool.id] ?? tool.name
}

/** One or two lines on the Tools list — website descriptions stay long for SEO. */
export const ANDROID_SHORT_DESCRIPTIONS: Record<string, string> = {
    'fit-to-size': 'Make a file the size a form asks for.',
    'passport-photo': 'US 2x2, India, visa, or bank photo.',
    'remove-background': 'Replace a backdrop with white or light blue.',
    'merge-pdf': 'Combine several PDFs into one file.',
    'split-pdf': 'Pull pages out of a PDF.',
    'compress-pdf': 'Make a PDF small enough to upload.',
    'rotate-pdf': 'Turn pages the right way up.',
    'jpg-to-pdf': 'Photos into one PDF, in any order.',
    'png-to-pdf': 'Turn PNG pictures into one PDF.',
    'pdf-to-jpg': 'Save each PDF page as a photo.',
    'pdf-to-png': 'Save each PDF page as a PNG.',
    'word-to-pdf': 'Turn a Word file into a PDF.',
    'pdf-to-word': 'Turn a PDF into a Word file.',
    'excel-to-pdf': 'Turn a spreadsheet into a PDF.',
    'image-compressor': 'Make a photo small enough to upload.',
    'resize-image': 'Change a photo’s width and height.',
    'heic-to-jpg': 'Convert HEIC photos to JPG.',
    'webp-converter': 'Convert WebP pictures to JPG or PNG.',
    'watermark-pdf': 'Stamp text on every page.',
    'add-page-numbers': 'Add page numbers to a PDF.',
    'qr-code-generator': 'Make a QR code from a link or some text.',
    'autocad-pdf-editor': 'Correct labels and notes on AutoCAD-exported PDFs.',
}

export function shortToolDescription(tool: Tool): string {
    return ANDROID_SHORT_DESCRIPTIONS[tool.id] ?? tool.description
}

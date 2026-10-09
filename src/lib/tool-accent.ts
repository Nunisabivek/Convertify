/**
 * Per-tool accent color for the Android app. Keeping every tool the same blue
 * made the app feel flat; each family now gets its own hue while the brand
 * blue stays the app chrome (nav, buttons, header).
 *
 * The CSS classes `accent-<name>` live in mobile.css and only set variables,
 * so adding a hue never touches component code.
 */
export type ToolAccent = 'blue' | 'coral' | 'violet' | 'green' | 'amber' | 'pink' | 'teal'

const ACCENTS: Record<string, ToolAccent> = {
    // Form photos & dimensions
    'fit-to-size': 'teal',
    'passport-photo': 'violet',
    'remove-background': 'pink',

    // Organize PDF & PDF Targets (Adobe Acrobat / Smallpdf red-coral)
    'merge-pdf': 'coral',
    'split-pdf': 'coral',
    'compress-pdf': 'coral',
    'rotate-pdf': 'coral',
    'organize-pdf': 'coral',
    'jpg-to-pdf': 'coral',
    'png-to-pdf': 'coral',
    'tiff-to-pdf': 'coral',

    // Image tools (Emerald Green)
    'image-compressor': 'green',
    'resize-image': 'green',
    'heic-to-jpg': 'green',
    'webp-converter': 'green',
    'pdf-to-jpg': 'green',
    'pdf-to-png': 'green',
    'jpg-to-png': 'green',
    'png-to-jpg': 'green',

    // Edit PDF & CAD (Warm Amber)
    'watermark-pdf': 'amber',
    'add-page-numbers': 'amber',
    'autocad-pdf-editor': 'amber',
    'pdf-to-text': 'amber',
    'text-to-pdf': 'amber',

    // Utilities & Documents
    'excel-to-pdf': 'teal',
    'word-to-pdf': 'blue',
    'pdf-to-word': 'blue',
    'qr-code-generator': 'pink',
    'ocr-pdf': 'teal',
    'scan-document': 'teal',
}

export function toolAccent(toolId: string): ToolAccent {
    return ACCENTS[toolId] ?? 'blue'
}

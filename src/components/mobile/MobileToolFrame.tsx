'use client'

import { ReactNode } from 'react'
import { ANDROID_SHORT_NAMES } from '@/lib/mobile-tools'
import { getToolById } from '@/lib/tools-registry'

const LEADS: Record<string, string> = {
    'fit-to-size': 'Pick a PDF or photo and set the min and max KB a form asks for.',
    'passport-photo': 'Make a white-background photo at the usual pixel and KB numbers.',
    'remove-background': 'Replace a plain wall with white or light blue. Works best on a simple backdrop.',
    'merge-pdf': 'Combine several PDFs into one file.',
    'split-pdf': 'Pull pages out of a PDF.',
    'compress-pdf': 'Make a PDF small enough for a job form or KYC upload.',
    'rotate-pdf': 'Turn pages the right way up.',
    'jpg-to-pdf': 'Turn photos into one PDF. Drag to change the order.',
    'png-to-pdf': 'Turn PNG pictures into one PDF.',
    'pdf-to-jpg': 'Save each PDF page as a photo.',
    'pdf-to-png': 'Save each PDF page as a PNG.',
    'word-to-pdf': 'Turn a Word file into a PDF.',
    'pdf-to-word': 'Turn a PDF into a Word file.',
    'excel-to-pdf': 'Turn a spreadsheet into a PDF.',
    'image-compressor': 'Make a photo smaller without a fuss.',
    'resize-image': 'Change a photo’s width and height.',
    'heic-to-jpg': 'Turn iPhone photos into JPG so any phone can open them.',
    'webp-converter': 'Convert WebP pictures to JPG or PNG.',
    'watermark-pdf': 'Stamp text on every page.',
    'add-page-numbers': 'Add page numbers to a PDF.',
    'qr-code-generator': 'Make a QR code from a link or some text.',
}

export default function MobileToolFrame({
    toolId,
    children,
}: {
    toolId: string
    children: ReactNode
}) {
    const tool = getToolById(toolId)
    const title = ANDROID_SHORT_NAMES[toolId] ?? tool?.name ?? 'Tool'
    const lead = LEADS[toolId] ?? tool?.description ?? ''

    return (
        <div className="mobile-tool-frame">
            <h1 className="mobile-tool-title">{title}</h1>
            <p className="mobile-tool-lead">{lead}</p>
            {children}
        </div>
    )
}

'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeftRight } from 'lucide-react'
import { ANDROID_SHORT_NAMES, isAndroidV1Tool } from '@/lib/mobile-tools'
import { getToolById } from '@/lib/tools-registry'
import { getSwapInfo, parseConvertDirection } from '@/lib/tool-swap'
import { ToolGlyph } from '@/components/mobile/ToolGlyph'
import { tapHaptic } from '@/lib/haptics'

const LEADS: Record<string, string> = {
    'fit-to-size': 'Pick a PDF or photo. Type the size a form asks for, or tap a shortcut. We keep quality first.',
    'passport-photo': 'Passport, visa, bank photo, signature, or thumb. Crop, then we hit the size the form wants.',
    'remove-background': 'Swap a plain wall for white or light blue. Works best on a simple backdrop.',
    'merge-pdf': 'Combine several PDFs into one file.',
    'split-pdf': 'Pull pages out of a PDF.',
    'compress-pdf': 'Type a target size. We lower quality first and only shrink pixels if we have to.',
    'rotate-pdf': 'Turn pages the right way up.',
    'jpg-to-pdf': 'Turn photos into one PDF. Drag to change the order.',
    'png-to-pdf': 'Turn PNG pictures into one PDF.',
    'pdf-to-jpg': 'Save each PDF page as a photo.',
    'pdf-to-png': 'Save each PDF page as a PNG.',
    'word-to-pdf': 'Turn a Word file into a PDF.',
    'pdf-to-word': 'Turn a PDF into a Word file you can edit.',
    'excel-to-pdf': 'Turn a spreadsheet into a PDF.',
    'image-compressor': 'Type a target size. Quality first, then a smaller photo only if needed.',
    'resize-image': "Change a photo's width and height.",
    'heic-to-jpg': 'Turn iPhone photos into JPG so any phone can open them.',
    'webp-converter': 'Convert WebP pictures to JPG or PNG.',
    'watermark-pdf': 'Stamp text on every page.',
    'add-page-numbers': 'Add page numbers to a PDF.',
    'qr-code-generator': 'Make a QR code from a link or some text.',
    'autocad-pdf-editor': 'Open an AutoCAD-exported PDF, tap a label or note, type the fix, then save.',
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
    const direction = parseConvertDirection(toolId)
    const swap = getSwapInfo(toolId)
    const showSwap = Boolean(swap && isAndroidV1Tool(swap.target))

    return (
        <div className="mobile-tool-frame">
            <div className="mobile-tool-hero">
                <div className="mobile-tool-hero-icon" aria-hidden>
                    <ToolGlyph toolId={toolId} size={34} />
                </div>
                <div className="mobile-tool-hero-copy">
                    <p className="mobile-tool-eyebrow">Convertify</p>
                    <h1 className="mobile-tool-title">{title}</h1>
                    <p className="mobile-tool-lead">{lead}</p>
                </div>
            </div>

            {(direction || showSwap) && (
                <div className="mobile-tool-chips">
                    {direction ? (
                        <div className="mobile-dir-chips" aria-hidden>
                            <span className="mobile-dir-chip">{direction.from}</span>
                            <span className="mobile-dir-arrow" aria-hidden>
                                →
                            </span>
                            <span className="mobile-dir-chip is-out">{direction.to}</span>
                        </div>
                    ) : null}
                    {showSwap && swap ? (
                        <Link
                            href={`/${swap.target}`}
                            className="mobile-swap-btn"
                            onClick={() => {
                                void tapHaptic()
                            }}
                        >
                            <ArrowLeftRight size={18} strokeWidth={2.4} aria-hidden />
                            Swap to {swap.targetDirection}
                        </Link>
                    ) : null}
                </div>
            )}

            <div className="mobile-tool-body">{children}</div>
        </div>
    )
}

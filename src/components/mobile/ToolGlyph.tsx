'use client'

import {
    FileStack,
    Scissors,
    Minimize2,
    RotateCw,
    FileText,
    Droplet,
    Hash,
    QrCode,
    Globe,
    Scaling,
    Gauge,
    UserRound,
    Eraser,
    Shrink,
    type LucideIcon,
} from 'lucide-react'
import { parseConvertDirection } from '@/lib/tool-swap'

const ACTION_ICONS: Record<string, LucideIcon> = {
    'fit-to-size': Gauge,
    'passport-photo': UserRound,
    'remove-background': Eraser,
    'merge-pdf': FileStack,
    'split-pdf': Scissors,
    'compress-pdf': Minimize2,
    'rotate-pdf': RotateCw,
    'image-compressor': Shrink,
    'resize-image': Scaling,
    'webp-converter': Globe,
    'watermark-pdf': Droplet,
    'add-page-numbers': Hash,
    'qr-code-generator': QrCode,
}

function ConvertBadgeGlyph({ from, to }: { from: string; to: string }) {
    return (
        <span className="mobile-convert-glyph" aria-hidden>
            <span className="mobile-convert-from">{from}</span>
            <span className="mobile-convert-arrow">↓</span>
            <span className="mobile-convert-to">{to}</span>
        </span>
    )
}

export function ToolGlyph({
    toolId,
    size = 28,
    className,
}: {
    toolId: string
    size?: number
    className?: string
}) {
    const convert = parseConvertDirection(toolId)
    if (convert) {
        return <ConvertBadgeGlyph from={convert.fromBadge} to={convert.toBadge} />
    }

    const Icon = ACTION_ICONS[toolId] || FileText
    return (
        <Icon
            className={className}
            size={size}
            strokeWidth={2.4}
            color="#026EFF"
            aria-hidden
        />
    )
}

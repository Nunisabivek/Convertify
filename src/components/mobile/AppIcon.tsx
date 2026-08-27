'use client'

import {
    FileStack,
    Scissors,
    Minimize2,
    RotateCw,
    Image as ImageIcon,
    FileText,
    Sheet,
    Droplet,
    Hash,
    QrCode,
    Smartphone,
    Globe,
    Scaling,
    Home,
    LayoutGrid,
    Info,
    Search,
    ChevronRight,
    ChevronLeft,
    Check,
    Plus,
    type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
    FileStack,
    Scissors,
    Minimize2,
    RotateCw,
    Image: ImageIcon,
    FileText,
    Sheet,
    Droplet,
    Hash,
    QrCode,
    Smartphone,
    Globe,
    Scaling,
    Home,
    LayoutGrid,
    Info,
    Search,
    ChevronRight,
    ChevronLeft,
    Check,
    Plus,
}

export function AppIcon({
    name,
    className,
    size = 22,
}: {
    name: string
    className?: string
    size?: number
}) {
    const Icon = ICONS[name] || FileText
    return <Icon className={className} size={size} strokeWidth={2} aria-hidden />
}

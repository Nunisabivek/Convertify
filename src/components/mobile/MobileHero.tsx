'use client'

import { ShieldCheck } from 'lucide-react'

export default function MobileHero() {
    return (
        <div className="mobile-hero">
            <div className="mobile-hero-badge">
                <ShieldCheck size={14} strokeWidth={2.4} color="#026EFF" />
                <span>On-Device • 100% Private</span>
            </div>
            <h1 className="mobile-hero-title">Convertify</h1>
            <p className="mobile-hero-subtitle">
                Compress, convert, and edit documents & photos instantly. Files never leave this device.
            </p>
        </div>
    )
}

'use client'

import { ShieldCheck } from 'lucide-react'

export default function MobileHero() {
    return (
        <div className="mobile-hero">
            <div className="mobile-hero-badge">
                <ShieldCheck size={14} strokeWidth={2.4} />
                <span>On-Device • 100% Private</span>
            </div>
            <h1 className="mobile-hero-title">PDF &amp; photo tools</h1>
            <p className="mobile-hero-subtitle">
                Fit files to any form, scan documents, convert and compress. Everything stays on this phone.
            </p>
        </div>
    )
}

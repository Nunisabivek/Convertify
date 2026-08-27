import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'
import MobileToolFrame from '@/components/mobile/MobileToolFrame'
import RemoveBackgroundClient from './client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Background',
    description: 'Replace a plain backdrop with white or light blue for KYC photos.',
    robots: { index: false, follow: true },
}

export default function Page() {
    if (IS_MOBILE_BUILD) {
        return (
            <MobileToolFrame toolId="remove-background">
                <RemoveBackgroundClient />
            </MobileToolFrame>
        )
    }
    return (
        <div className="container mx-auto max-w-2xl px-4 py-10">
            <h1 className="text-3xl font-bold mb-2">Background</h1>
            <p className="text-slate-600 mb-6">Replace a plain backdrop with white or light blue for KYC photos.</p>
            <RemoveBackgroundClient />
        </div>
    )
}

import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'
import MobileToolFrame from '@/components/mobile/MobileToolFrame'
import FitToSizeClient from './client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Fit to size',
    description: 'Make a PDF or photo land between a min and max KB for a form upload.',
    robots: { index: false, follow: true },
}

export default function Page() {
    if (IS_MOBILE_BUILD) {
        return (
            <MobileToolFrame toolId="fit-to-size">
                <FitToSizeClient />
            </MobileToolFrame>
        )
    }
    return (
        <div className="container mx-auto max-w-2xl px-4 py-10">
            <h1 className="text-3xl font-bold mb-2">Fit to size</h1>
            <p className="text-slate-600 mb-6">Make a PDF or photo land between a min and max KB for a form upload.</p>
            <FitToSizeClient />
        </div>
    )
}

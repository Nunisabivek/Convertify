import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'
import MobileToolFrame from '@/components/mobile/MobileToolFrame'
import PassportPhotoClient from './client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Passport photo',
    description: 'Make a 630×810 JPEG on a white background for digital uploads.',
    robots: { index: false, follow: true },
}

export default function Page() {
    if (IS_MOBILE_BUILD) {
        return (
            <MobileToolFrame toolId="passport-photo">
                <PassportPhotoClient />
            </MobileToolFrame>
        )
    }
    return (
        <div className="container mx-auto max-w-2xl px-4 py-10">
            <h1 className="text-3xl font-bold mb-2">Passport photo</h1>
            <p className="text-slate-600 mb-6">Make a 630×810 JPEG on a white background for digital uploads.</p>
            <PassportPhotoClient />
        </div>
    )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'
import MobileFilesPage from '@/components/mobile/MobileFilesPage'

// The Android app's file library. The website has nothing to show here.
export const metadata: Metadata = {
    title: 'Files',
    robots: { index: false, follow: false },
}

export default function Page() {
    if (!IS_MOBILE_BUILD) notFound()
    return <MobileFilesPage />
}

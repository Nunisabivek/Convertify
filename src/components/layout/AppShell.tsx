import type { ReactNode } from 'react'
import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'
import ClientLayout from '@/components/layout/ClientLayout'
import MobileLayout from '@/components/mobile/MobileLayout'

/**
 * Website chrome vs Android shell. AdMob lives only in MobileLayout /
 * native-ads.ts and is a no-op unless IS_MOBILE_BUILD.
 */
export default function AppShell({ children }: { children: ReactNode }) {
    if (IS_MOBILE_BUILD) {
        return <MobileLayout>{children}</MobileLayout>
    }
    return <ClientLayout>{children}</ClientLayout>
}

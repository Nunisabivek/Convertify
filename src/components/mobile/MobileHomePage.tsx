'use client';

import { MobileHero, MobileToolGrid, MobileRecentFiles } from '@/components/mobile';

export default function MobileHomePage() {
    return (
        <>
            {/* Hero Section */}
            <MobileHero />

            {/* Quick Tools Grid */}
            <MobileToolGrid maxTools={6} showTitle={true} />

            {/* Recent Files */}
            <MobileRecentFiles />
        </>
    );
}

'use client';

import { MobileHero, MobileToolGrid, MobileRecentFiles } from '@/components/mobile';
import { AdBanner } from '@/components/ads/banner';

export default function MobileHomePage() {
    return (
        <>
            {/* Hero Section */}
            <MobileHero />

            {/* Quick Tools Grid */}
            <MobileToolGrid maxTools={6} showTitle={true} />

            {/* Single non-intrusive ad between sections */}
            <div className="mobile-ad-container">
                <div>
                    <div className="mobile-ad-label">Sponsored</div>
                    <AdBanner variant="mobile-banner" />
                </div>
            </div>

            {/* Recent Files */}
            <MobileRecentFiles />
        </>
    );
}

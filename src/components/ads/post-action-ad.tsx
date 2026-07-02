"use client"

import { AdBanner } from "./banner"

/**
 * Post-Action Ad — shows after a user completes their primary task
 * (e.g., after file conversion, between tool and SEO content).
 * 
 * This is the highest-value ad placement because:
 * 1. User is in a "satisfied" state — they got what they came for
 * 2. Natural content break — doesn't interrupt the workflow
 * 3. High viewability — users scroll past this on their way out
 * 4. Non-intrusive — it's between sections, not overlaying content
 * 
 * Revenue strategy: Show rectangle ad on desktop, mobile-banner on mobile.
 * Both are lazy-loaded via IntersectionObserver so they don't hurt LCP.
 */
export function PostActionAd() {
    return (
        <div className="w-full py-6 flex justify-center" aria-hidden="true">
            <div className="max-w-4xl mx-auto px-4 w-full">
                <div className="relative bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-slate-100">
                    {/* Desktop: rectangle */}
                    <div className="hidden md:flex justify-center">
                        <AdBanner variant="rectangle" />
                    </div>
                    {/* Mobile: horizontal banner */}
                    <div className="md:hidden flex justify-center">
                        <AdBanner variant="mobile-banner" />
                    </div>
                </div>
            </div>
        </div>
    )
}

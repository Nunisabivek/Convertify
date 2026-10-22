"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { ADSENSE_CLIENT } from "@/lib/adsense"

// Build-time flag: true when building the Capacitor Android app (npm run build:mobile)
// All ad components return null so zero ad code is bundled into the app.
const IS_MOBILE_BUILD = process.env.NEXT_PUBLIC_MOBILE_BUILD === 'true'

// Website ads are Monetag (src/lib/monetag.ts): formats that need no slot and load only after
// the visitor's file is saved. These in-page slots therefore render nothing, but stay wired
// for Google AdSense: set NEXT_PUBLIC_ADSENSE_CLIENT and the slot ids and every slot fills.
/** False while no slot can fill: wrappers that draw a box around a slot should render nothing. Auto ads need no slots. */
export const AD_SLOTS_ON = !IS_MOBILE_BUILD && Boolean(process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE)
const SLOTS = {
    rectangle: { slot: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE, width: 300, height: 250 },
    "mobile-banner": { slot: process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOBILE, width: 320, height: 50 },
    skyscraper: { slot: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SKYSCRAPER, width: 160, height: 600 },
}

interface AdBannerProps {
    variant?: "rectangle" | "native" | "skyscraper" | "responsive" | "mobile-banner"
    slot?: string
    className?: string
}

function AdSenseUnit({ client, slot, width, height }: { client: string; slot: string; width: number; height: number }) {
    const pathname = usePathname()

    useEffect(() => {
        try {
            // Client-side route changes need a fresh push for the new <ins>.
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
        } catch {
            // AdSense push errors are not actionable here
        }
    }, [pathname, slot])

    return (
        <div style={{ width, height, maxWidth: "100%", overflow: "hidden" }} className="flex items-center justify-center">
            <ins
                className="adsbygoogle"
                style={{ display: "inline-block", width: `${width}px`, height: `${height}px` }}
                data-ad-client={client}
                data-ad-slot={slot}
                data-full-width-responsive="true"
            />
        </div>
    )
}

export function AdBanner({ variant }: AdBannerProps) {
    if (IS_MOBILE_BUILD || !ADSENSE_CLIENT) return null
    const { slot, width, height } = SLOTS[variant === "mobile-banner" || variant === "skyscraper" ? variant : "rectangle"]
    if (!slot) return null
    return (
        <div className="w-full flex items-center justify-center py-4">
            <AdSenseUnit client={ADSENSE_CLIENT} slot={slot} width={width} height={height} />
        </div>
    )
}

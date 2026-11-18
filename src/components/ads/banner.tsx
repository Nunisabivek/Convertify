"use client"

import { useEffect, useRef, useState } from "react"
import { IS_MOBILE_BUILD } from "@/lib/is-mobile-build"
import { ADSTERRA_ON, AD_FRAME_ORIGIN, SIZES, UNITS, bannerFrameUrl, wideSize, type BannerSize } from "@/lib/adsterra"

// Website banners are Adsterra (src/lib/adsterra.ts); Monetag (src/lib/monetag.ts) runs the corner
// card and the after-download vignette. The Android build shows AdMob instead, so this renders nothing there.

/** False while no banner unit is set up: wrappers that draw a box around a slot should render nothing. */
export const AD_SLOTS_ON = !IS_MOBILE_BUILD && ADSTERRA_ON

interface AdBannerProps {
    variant?: "rectangle" | "responsive" | "mobile-banner"
    /** "top" slots sit above a tool, so they use the short wide banner instead of the 300x250. */
    slot?: "top" | "bottom"
    className?: string
}

/**
 * One banner in its own iframe: Adsterra's tag reads a global, so each unit needs its own document.
 * The frame comes from AD_FRAME_ORIGIN, so the ad can't touch this page. It reports "empty" itself
 * (after 12 s with no creative) because the page can't look inside a cross-origin frame.
 */
export function AdFrame({ size, onEmpty }: { size: BannerSize; onEmpty?: () => void }) {
    const unit = UNITS[size]
    const src = unit ? bannerFrameUrl(unit, size) : null
    const ref = useRef<HTMLIFrameElement>(null)
    useEffect(() => {
        if (!onEmpty) return
        const onMessage = (e: MessageEvent) => {
            if (e.origin === AD_FRAME_ORIGIN && e.source === ref.current?.contentWindow && e.data?.cvAd === "empty") onEmpty()
        }
        window.addEventListener("message", onMessage)
        return () => window.removeEventListener("message", onMessage)
    }, [onEmpty])
    if (!src) return null
    const { width, height } = SIZES[size]
    return (
        <iframe
            ref={ref}
            title="Advertisement"
            src={src}
            width={width}
            height={height}
            scrolling="no"
            // allow-same-origin is safe here only because the frame's origin is not this site's: the
            // ad keeps its own storage but can't reach this page. No allow-top-navigation: an ad can
            // open a new tab on click but can never send the visitor away from a tool.
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            style={{ border: 0, display: "block", maxWidth: "100%", overflow: "hidden" }}
        />
    )
}

/** Picks the size after mount (it depends on the viewport) and loads the ad only when it's near the screen. */
function LazyBanner({ wide, className }: { wide: boolean; className?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    // undefined until the slot nears the screen (the size depends on the viewport); null when no unit fits.
    const [size, setSize] = useState<BannerSize | null | undefined>(undefined)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const pick = () => setSize(wide || !UNITS.rectangle ? wideSize(window.innerWidth) : "rectangle")
        if (typeof IntersectionObserver === "undefined") {
            const raf = requestAnimationFrame(pick)
            return () => cancelAnimationFrame(raf)
        }
        // A slot hidden with display:none never intersects, so hidden copies never load an ad.
        const io = new IntersectionObserver((entries) => {
            if (!entries.some((e) => e.isIntersecting)) return
            io.disconnect()
            pick()
        }, { rootMargin: "300px 0px" })
        io.observe(el)
        return () => io.disconnect()
    }, [wide])

    if (size === null) return null
    // Reserve the banner's height up front so the page doesn't jump when it fills.
    const height = size ? SIZES[size].height : wide ? undefined : SIZES.rectangle.height
    return (
        <div ref={ref} className={`w-full flex flex-col items-center py-4 ${className ?? ""}`}>
            <span className="mb-1 text-[10px] uppercase tracking-wider text-slate-400">Advertisement</span>
            <div
                className={`flex justify-center w-full ${size ? "" : "h-[50px] md:h-[90px]"}`}
                style={height ? { height } : undefined}
            >
                {size ? <AdFrame size={size} onEmpty={() => setSize(null)} /> : null}
            </div>
        </div>
    )
}

export function AdBanner({ variant, slot, className }: AdBannerProps) {
    if (!AD_SLOTS_ON) return null
    const wide = variant === "responsive" || variant === "mobile-banner" || slot === "top"
    return <LazyBanner wide={wide} className={className} />
}

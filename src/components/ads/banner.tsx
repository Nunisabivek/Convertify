"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { IS_MOBILE_BUILD } from "@/lib/is-mobile-build"
import { ADSTERRA_ON, SIZES, UNITS, bannerDocument, wideSize, type BannerSize } from "@/lib/adsterra"

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

// Inactive units and no-fill answers leave the frame empty; after this long the slot gives its space back.
const FILL_CHECK_MS = 4000

/** True when the banner document holds something visible (Adsterra draws an iframe, image or link). */
function hasCreative(frame: HTMLIFrameElement | null): boolean {
    let body: HTMLElement | null | undefined
    try {
        body = frame?.contentDocument?.body
    } catch {
        return true // can't look inside: assume it filled rather than hide a live ad
    }
    if (!body) return true
    return [...body.querySelectorAll("iframe, img, a, ins, div, canvas, video")].some((el) => {
        const r = el.getBoundingClientRect()
        return r.width >= 20 && r.height >= 20
    })
}

/** One banner in its own iframe: Adsterra's tag reads a global, so each unit needs its own document. */
export function AdFrame({ size, onEmpty }: { size: BannerSize; onEmpty?: () => void }) {
    const unit = UNITS[size]
    const doc = useMemo(() => (unit ? bannerDocument(unit, size) : null), [unit, size])
    const ref = useRef<HTMLIFrameElement>(null)
    const timer = useRef<number | undefined>(undefined)
    useEffect(() => () => window.clearTimeout(timer.current), [])
    if (!doc) return null
    const { width, height } = SIZES[size]
    const checkFill = () => {
        if (!onEmpty) return
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => {
            if (!hasCreative(ref.current)) onEmpty()
        }, FILL_CHECK_MS)
    }
    return (
        <iframe
            ref={ref}
            title="Advertisement"
            srcDoc={doc}
            width={width}
            height={height}
            scrolling="no"
            onLoad={checkFill}
            // No allow-top-navigation: an ad can open a new tab on click but can never send the
            // visitor away from a tool with their work in it.
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

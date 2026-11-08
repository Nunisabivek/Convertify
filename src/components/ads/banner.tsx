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

// Adsterra's tag takes 5-9 s to place its creative. A unit that is inactive or has no fill answers
// with an empty script and never adds anything; only after this long with nothing added does the
// slot give its space back. Collapsing earlier would remove ads that already counted a view.
const NO_FILL_AFTER_MS = 12000

/** True once the banner document holds anything besides its own scripts (Adsterra adds an iframe). */
function hasCreative(body: HTMLElement): boolean {
    return body.querySelector(":not(script):not(style):not(noscript):not(link)") !== null
}

/** One banner in its own iframe: Adsterra's tag reads a global, so each unit needs its own document. */
export function AdFrame({ size, onEmpty }: { size: BannerSize; onEmpty?: () => void }) {
    const unit = UNITS[size]
    const doc = useMemo(() => (unit ? bannerDocument(unit, size) : null), [unit, size])
    const ref = useRef<HTMLIFrameElement>(null)
    const watch = useRef<{ timer?: number; observer?: MutationObserver }>({})
    const stopWatching = () => {
        window.clearTimeout(watch.current.timer)
        watch.current.observer?.disconnect()
        watch.current = {}
    }
    useEffect(() => stopWatching, [])
    if (!doc) return null
    const { width, height } = SIZES[size]
    const watchFill = () => {
        stopWatching()
        if (!onEmpty) return
        let body: HTMLElement | null | undefined
        try {
            body = ref.current?.contentDocument?.body
        } catch {
            return // can't look inside: never hide what may be a live ad
        }
        if (!body || hasCreative(body)) return
        const observer = new MutationObserver(() => {
            if (body && hasCreative(body)) stopWatching()
        })
        observer.observe(body, { childList: true, subtree: true })
        const timer = window.setTimeout(() => {
            const filled = body ? hasCreative(body) : true
            stopWatching()
            if (!filled) onEmpty()
        }, NO_FILL_AFTER_MS)
        watch.current = { timer, observer }
    }
    return (
        <iframe
            ref={ref}
            title="Advertisement"
            srcDoc={doc}
            width={width}
            height={height}
            scrolling="no"
            onLoad={watchFill}
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

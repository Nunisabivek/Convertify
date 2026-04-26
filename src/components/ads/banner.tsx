"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"

// Build-time flag: true when building the Capacitor Android app (npm run build:mobile)
// All ad components return null so zero ad code is bundled into the app.
const IS_MOBILE_BUILD = process.env.NEXT_PUBLIC_MOBILE_BUILD === 'true'

// LocalStorage key used to remember the user dismissed the floating footer ad.
// Re-shows after FOOTER_AD_REVISIT_HOURS so revenue isn't permanently zeroed.
const FOOTER_AD_DISMISS_KEY = "convertify:footerAdDismissedAt"
const FOOTER_AD_REVISIT_HOURS = 24

interface AdBannerProps {
    variant?: "footer" | "rectangle" | "native" | "skyscraper" | "responsive" | "mobile-banner"
}

// ── Adsterra ad-key configuration ─────────────────────────────────────────────
// These are real Adsterra ad keys (served from tonicgoverness.com). Numeric
// placement IDs from the Adsterra dashboard map to these keys internally.
// To swap a key, just update it here — no other file needs to change.
// ─────────────────────────────────────────────────────────────────────────────
const ADSTERRA_KEYS = {
    rectangle300x250: {
        key: "616f9cf69cb04c34acb730e9239646e0",
        height: 250,
        width: 300,
        url: "//tonicgoverness.com/616f9cf69cb04c34acb730e9239646e0/invoke.js",
    },
    mobileBanner320x50: {
        key: "ee2936c122e5b6cd6be8ae3b8019a581",
        height: 50,
        width: 320,
        url: "//tonicgoverness.com/ee2936c122e5b6cd6be8ae3b8019a581/invoke.js",
    },
    leaderboard728x90: {
        key: "d84ed579e24fb0e02224fedd00bed35b",
        height: 90,
        width: 728,
        url: "//tonicgoverness.com/d84ed579e24fb0e02224fedd00bed35b/invoke.js",
    },
    skyscraper160x600: {
        key: "616f9cf69cb04c34acb730e9239646e0",
        height: 600,
        width: 160,
        url: "//tonicgoverness.com/616f9cf69cb04c34acb730e9239646e0/invoke.js",
    },
} as const

type AdConfig = (typeof ADSTERRA_KEYS)[keyof typeof ADSTERRA_KEYS]

// Lazy-loads an ad iframe using IntersectionObserver. The iframe is only
// created (and the third-party script only fetched) once the slot enters
// the viewport. This protects LCP and saves CWV score.
//
// Crucial detail for CLS: the parent container always reserves the ad's
// width/height, so when the ad finally loads it doesn't push content down.
function useLazyAdSlot(conf: AdConfig, enabled: boolean) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!enabled) return
        const container = containerRef.current
        if (!container) return

        let injected = false
        const inject = () => {
            if (injected) return
            injected = true

            const iframe = document.createElement("iframe")
            iframe.style.width = `${conf.width}px`
            iframe.style.height = `${conf.height}px`
            iframe.style.border = "none"
            iframe.style.overflow = "hidden"
            iframe.scrolling = "no"
            iframe.loading = "lazy"
            iframe.title = "Advertisement"
            iframe.setAttribute("aria-hidden", "true")

            container.innerHTML = ""
            container.appendChild(iframe)

            const doc = iframe.contentWindow?.document || iframe.contentDocument
            if (doc) {
                doc.open()
                doc.write(`<!DOCTYPE html><html><body style="margin:0;padding:0;overflow:hidden;"><script>atOptions={'key':'${conf.key}','format':'iframe','height':${conf.height},'width':${conf.width},'params':{}};</script><script src="${conf.url}"></script></body></html>`)
                doc.close()
            }
        }

        // If IntersectionObserver isn't supported, just inject immediately.
        if (typeof IntersectionObserver === "undefined") {
            inject()
            return () => {
                if (container) container.innerHTML = ""
            }
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    inject()
                    observer.disconnect()
                }
            },
            { rootMargin: "200px" } // start loading just before scrolled into view
        )
        observer.observe(container)

        return () => {
            observer.disconnect()
            if (container) container.innerHTML = ""
        }
    }, [conf, enabled])

    return containerRef
}

export function AdBanner({ variant = "footer" }: AdBannerProps) {
    const [isMobile, setIsMobile] = useState(false)
    const [isDismissed, setIsDismissed] = useState(false)
    // Hydration safety: do not render the floating footer until after mount.
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        if (IS_MOBILE_BUILD) return
        setHasMounted(true)
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Restore dismiss state from localStorage on mount.
    useEffect(() => {
        if (IS_MOBILE_BUILD) return
        if (variant !== "footer") return
        try {
            const ts = localStorage.getItem(FOOTER_AD_DISMISS_KEY)
            if (!ts) return
            const dismissedAt = parseInt(ts, 10)
            const hoursSince = (Date.now() - dismissedAt) / (1000 * 60 * 60)
            if (hoursSince < FOOTER_AD_REVISIT_HOURS) {
                setIsDismissed(true)
            }
        } catch {
            // localStorage may be blocked; fall through to showing the ad
        }
    }, [variant])

    const dismissFooter = () => {
        setIsDismissed(true)
        try {
            localStorage.setItem(FOOTER_AD_DISMISS_KEY, Date.now().toString())
        } catch {
            // ignore
        }
    }

    // Pick the right ad config for the variant.
    let conf: AdConfig = ADSTERRA_KEYS.rectangle300x250
    if (variant === "rectangle" || variant === "responsive" || variant === "native") {
        conf = ADSTERRA_KEYS.rectangle300x250
    } else if (variant === "mobile-banner") {
        conf = ADSTERRA_KEYS.mobileBanner320x50
    } else if (variant === "footer") {
        conf = isMobile ? ADSTERRA_KEYS.mobileBanner320x50 : ADSTERRA_KEYS.leaderboard728x90
    } else if (variant === "skyscraper") {
        conf = ADSTERRA_KEYS.skyscraper160x600
    }

    const shouldRender = !IS_MOBILE_BUILD && hasMounted && !(variant === "footer" && isDismissed)
    const containerRef = useLazyAdSlot(conf, shouldRender)

    if (IS_MOBILE_BUILD) return null

    if (variant === "rectangle" || variant === "responsive" || variant === "native") {
        return (
            <div className="w-full flex items-center justify-center py-4">
                {/* Reserved-size wrapper prevents CLS even before the ad loads */}
                <div
                    className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm relative"
                    style={{ width: 300, height: 250, maxWidth: "100%" }}
                >
                    <span className="absolute top-1 right-2 text-[10px] text-slate-400 uppercase tracking-wider z-10 pointer-events-none">
                        Ad
                    </span>
                    <div ref={containerRef} className="flex items-center justify-center" style={{ width: 300, height: 250 }} />
                </div>
            </div>
        )
    }

    if (variant === "mobile-banner") {
        return (
            <div className="w-full flex items-center justify-center py-2">
                <div
                    className="flex items-center justify-center overflow-hidden rounded-lg relative"
                    style={{ width: 320, height: 50, maxWidth: "100%" }}
                >
                    <span className="absolute top-0 right-1 text-[9px] text-slate-400 uppercase tracking-wider z-10 pointer-events-none">
                        Ad
                    </span>
                    <div ref={containerRef} className="flex items-center justify-center" style={{ width: 320, height: 50 }} />
                </div>
            </div>
        )
    }

    if (variant === "skyscraper") {
        return (
            <div className="hidden xl:flex items-center justify-center h-full">
                <div
                    className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden sticky top-24 shadow-sm relative"
                    style={{ width: 160, height: 600 }}
                >
                    <span className="absolute top-1 right-2 text-[10px] text-slate-400 uppercase tracking-wider z-10 pointer-events-none">
                        Ad
                    </span>
                    <div ref={containerRef} className="flex items-center justify-center" style={{ width: 160, height: 600 }} />
                </div>
            </div>
        )
    }

    // Footer Ad — fixed bottom, dismissible, hidden until mount (no SSR flash)
    if (!hasMounted || isDismissed) return null
    const adWidth = isMobile ? 320 : 728
    const adHeight = isMobile ? 50 : 90
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 border-t backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-lg flex justify-center overflow-hidden">
            <div className={isMobile ? "py-1 relative" : "py-2 relative"}>
                <button
                    type="button"
                    onClick={dismissFooter}
                    aria-label="Dismiss advertisement"
                    className="absolute top-0 right-0 z-10 p-1 rounded-bl bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
                <span className="absolute top-0 left-1 text-[9px] text-slate-400 uppercase tracking-wider z-10 pointer-events-none">
                    Ad
                </span>
                <div
                    ref={containerRef}
                    className="flex items-center justify-center overflow-hidden"
                    style={{ width: adWidth, height: adHeight }}
                />
            </div>
        </div>
    )
}

// In-content responsive ad for blog posts
export function BlogAd() {
    if (IS_MOBILE_BUILD) return null
    return (
        <div className="w-full my-8">
            <div className="hidden md:flex justify-center">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <AdBanner variant="rectangle" />
                </div>
            </div>
            <div className="md:hidden flex justify-center">
                <AdBanner variant="mobile-banner" />
            </div>
        </div>
    )
}

// Mobile-optimized inline ad for tool pages
export function MobileInlineAd() {
    if (IS_MOBILE_BUILD) return null
    return (
        <div className="w-full my-4 flex justify-center">
            <div className="md:hidden w-full flex justify-center bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg py-3">
                <AdBanner variant="mobile-banner" />
            </div>
            <div className="hidden md:flex justify-center">
                <AdBanner variant="rectangle" />
            </div>
        </div>
    )
}

// Compact ad for between sections
export function CompactAd() {
    if (IS_MOBILE_BUILD) return null
    return (
        <div className="w-full py-4 flex justify-center bg-slate-50/50">
            <AdBanner variant="rectangle" />
        </div>
    )
}

// ── NATIVE BANNER (in-content, lazy-loaded) ───────────────────────────────────
// Uses IntersectionObserver to defer the third-party script until the user
// actually scrolls near the ad slot. This protects LCP/INP for tool pages.
// To swap to a different Adsterra native unit: replace containerId + script src.
// ─────────────────────────────────────────────────────────────────────────────
export function TonicNativeBanner() {
    const containerRef = useRef<HTMLDivElement>(null)
    const containerId = "container-601b8193a0d113517d9d00bae103c5f9"

    useEffect(() => {
        if (IS_MOBILE_BUILD) return
        const target = containerRef.current
        if (!target) return

        let injected = false
        const inject = () => {
            if (injected) return
            injected = true
            if (document.getElementById("tonic-native-script")) return
            const script = document.createElement("script")
            script.id = "tonic-native-script"
            script.src = "https://tonicgoverness.com/601b8193a0d113517d9d00bae103c5f9/invoke.js"
            script.async = true
            script.setAttribute("data-cfasync", "false")
            document.body.appendChild(script)
        }

        if (typeof IntersectionObserver === "undefined") {
            inject()
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    inject()
                    observer.disconnect()
                }
            },
            { rootMargin: "300px" }
        )
        observer.observe(target)
        return () => observer.disconnect()
    }, [])

    if (IS_MOBILE_BUILD) return null

    // Reserve a minimum height so the lazy-injected native ad doesn't cause CLS.
    return (
        <div className="w-full my-6">
            <div ref={containerRef} id={containerId} style={{ minHeight: 250 }} />
        </div>
    )
}

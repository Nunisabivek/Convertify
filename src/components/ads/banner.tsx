"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { X } from "lucide-react"
import { usePathname } from "next/navigation"

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
        key: "c7edb639dc75a369ede3a87c6bbe2ee7",
        height: 300,
        width: 160,
        url: "//tonicgoverness.com/c7edb639dc75a369ede3a87c6bbe2ee7/invoke.js",
    },
} as const

type AdConfig = (typeof ADSTERRA_KEYS)[keyof typeof ADSTERRA_KEYS]

// ── SSR-safe client hooks ─────────────────────────────────────────────────────
// These read client-only values via useSyncExternalStore instead of a
// setState-in-effect. getServerSnapshot returns the SSR default (no window
// access), so there's no hydration mismatch and no cascading render.
// ─────────────────────────────────────────────────────────────────────────────
const noopSubscribe = () => () => {}

// True only after the component is running on the client (false during SSR).
function useIsClient() {
    return useSyncExternalStore(
        noopSubscribe,
        () => true,
        () => false,
    )
}

function subscribeResize(callback: () => void) {
    window.addEventListener("resize", callback)
    return () => window.removeEventListener("resize", callback)
}

// Tracks the < 768px breakpoint, re-reading on resize. SSR default is false.
function useIsMobile() {
    return useSyncExternalStore(
        subscribeResize,
        () => window.innerWidth < 768,
        () => false,
    )
}

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

// Reads the persisted footer-ad dismissal from localStorage. SSR-safe: returns
// false when there's no window. Used as a lazy useState initializer so we avoid
// a setState-in-effect. Safe against hydration mismatch because the footer ad
// only renders once hasMounted is true (i.e. after hydration).
function readFooterDismissed(variant: AdBannerProps["variant"]) {
    if (typeof window === "undefined" || IS_MOBILE_BUILD || variant !== "footer") return false
    try {
        const ts = localStorage.getItem(FOOTER_AD_DISMISS_KEY)
        if (!ts) return false
        const hoursSince = (Date.now() - parseInt(ts, 10)) / (1000 * 60 * 60)
        return hoursSince < FOOTER_AD_REVISIT_HOURS
    } catch {
        return false
    }
}

// Component to render a Google AdSense ad unit dynamically
function AdSenseUnit({
    client,
    slot,
    width,
    height,
    responsive = "true",
}: {
    client: string
    slot?: string
    width: number
    height: number
    responsive?: string
}) {
    const pathname = usePathname()

    useEffect(() => {
        if (typeof window !== "undefined" && slot) {
            try {
                // Next.js client-side route navigation can cause duplicate ins tags
                // or require pushing to adsbygoogle array.
                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
            } catch (err) {
                // Silence typical AdSense push warnings/errors
            }
        }
    }, [pathname, slot])

    if (!slot) {
        // If slot ID is not defined, we return null to avoid blank spaces
        return null
    }

    return (
        <div style={{ width, height, maxWidth: "100%", overflow: "hidden" }} className="flex items-center justify-center">
            <ins
                className="adsbygoogle"
                style={{ display: "inline-block", width: `${width}px`, height: `${height}px` }}
                data-ad-client={client}
                data-ad-slot={slot}
                data-full-width-responsive={responsive}
            />
        </div>
    )
}

export function AdBanner({ variant = "footer" }: AdBannerProps) {
    const isMobile = useIsMobile()
    const hasMounted = useIsClient()
    const [isDismissed, setIsDismissed] = useState(() => readFooterDismissed(variant))

    const dismissFooter = () => {
        setIsDismissed(true)
        try {
            localStorage.setItem(FOOTER_AD_DISMISS_KEY, Date.now().toString())
        } catch {
            // ignore
        }
    }

    if (IS_MOBILE_BUILD) return null

    const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

    // Determine slot and dimensions
    let adsenseSlot: string | undefined = undefined
    let adWidth = 300
    let adHeight = 250

    if (adsenseClient) {
        if (variant === "rectangle" || variant === "responsive" || variant === "native") {
            adsenseSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE
            adWidth = 300
            adHeight = 250
        } else if (variant === "mobile-banner") {
            adsenseSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOBILE
            adWidth = 320
            adHeight = 50
        } else if (variant === "skyscraper") {
            adsenseSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SKYSCRAPER
            adWidth = 160
            adHeight = 600
        } else if (variant === "footer") {
            adsenseSlot = isMobile 
                ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOBILE 
                : process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD
            adWidth = isMobile ? 320 : 728
            adHeight = isMobile ? 50 : 90
        }
    } else {
        if (variant === "rectangle" || variant === "responsive" || variant === "native") {
            adWidth = 300
            adHeight = 250
        } else if (variant === "mobile-banner") {
            adWidth = 320
            adHeight = 50
        } else if (variant === "skyscraper") {
            adWidth = 160
            adHeight = 300 // Match the user's 160x300 Adsterra unit
        } else if (variant === "footer") {
            adWidth = isMobile ? 320 : 728
            adHeight = isMobile ? 50 : 90
        }
    }

    // If AdSense is configured but NO slot ID is provided for this variant,
    // we hide the manual container completely to prevent blank spaces.
    // Google AdSense Auto Ads will automatically handle placing ads.
    if (adsenseClient && !adsenseSlot) {
        return null
    }

    // Pick the right ad config for the variant (Adsterra Fallback).
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

    const shouldRender = hasMounted && !(variant === "footer" && isDismissed)
    const containerRef = useLazyAdSlot(conf, shouldRender && !adsenseClient)

    if (variant === "rectangle" || variant === "responsive" || variant === "native") {
        return (
            <div className="w-full flex items-center justify-center py-4">
                <div
                    className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm relative"
                    style={{ width: adWidth, height: adHeight, maxWidth: "100%" }}
                >
                    <span className="absolute top-1 right-2 text-[10px] text-slate-400 uppercase tracking-wider z-10 pointer-events-none">
                        Ad
                    </span>
                    {adsenseClient ? (
                        <AdSenseUnit client={adsenseClient} slot={adsenseSlot} width={adWidth} height={adHeight} />
                    ) : (
                        <div ref={containerRef} className="flex items-center justify-center" style={{ width: adWidth, height: adHeight }} />
                    )}
                </div>
            </div>
        )
    }

    if (variant === "mobile-banner") {
        return (
            <div className="w-full flex items-center justify-center py-2">
                <div
                    className="flex items-center justify-center overflow-hidden rounded-lg relative"
                    style={{ width: adWidth, height: adHeight, maxWidth: "100%" }}
                >
                    <span className="absolute top-0 right-1 text-[9px] text-slate-400 uppercase tracking-wider z-10 pointer-events-none">
                        Ad
                    </span>
                    {adsenseClient ? (
                        <AdSenseUnit client={adsenseClient} slot={adsenseSlot} width={adWidth} height={adHeight} />
                    ) : (
                        <div ref={containerRef} className="flex items-center justify-center" style={{ width: adWidth, height: adHeight }} />
                    )}
                </div>
            </div>
        )
    }

    if (variant === "skyscraper") {
        return (
            <div className="hidden xl:flex items-start justify-center">
                <div
                    className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden sticky top-20 shadow-sm relative"
                    style={{ width: adWidth, height: adHeight }}
                >
                    <span className="absolute top-1 right-2 text-[10px] text-slate-400 uppercase tracking-wider z-10 pointer-events-none">
                        Ad
                    </span>
                    {adsenseClient ? (
                        <AdSenseUnit client={adsenseClient} slot={adsenseSlot} width={adWidth} height={adHeight} />
                    ) : (
                        <div ref={containerRef} className="flex items-center justify-center" style={{ width: adWidth, height: adHeight }} />
                    )}
                </div>
            </div>
        )
    }

    // Footer Ad — fixed bottom, dismissible, hidden until mount (no SSR flash)
    if (!hasMounted || isDismissed) return null

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
                {adsenseClient ? (
                    <AdSenseUnit client={adsenseClient} slot={adsenseSlot} width={adWidth} height={adHeight} />
                ) : (
                    <div
                        ref={containerRef}
                        className="flex items-center justify-center overflow-hidden"
                        style={{ width: adWidth, height: adHeight }}
                    />
                )}
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

    const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
    const adsenseSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE

    useEffect(() => {
        if (IS_MOBILE_BUILD || adsenseClient) return
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
    }, [adsenseClient])

    if (IS_MOBILE_BUILD) return null

    if (adsenseClient) {
        if (adsenseSlot) {
            return (
                <div className="w-full my-6 flex justify-center">
                    <AdSenseUnit client={adsenseClient} slot={adsenseSlot} width={300} height={250} />
                </div>
            )
        }
        return null
    }

    // Reserve a minimum height so the lazy-injected native ad doesn't cause CLS.
    return (
        <div className="w-full my-6">
            <div ref={containerRef} id={containerId} style={{ minHeight: 250 }} />
        </div>
    )
}

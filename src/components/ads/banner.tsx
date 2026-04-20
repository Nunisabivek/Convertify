"use client"

import { useEffect, useRef, useState } from "react"

// Build-time flag: true when building the Capacitor Android app (npm run build:mobile)
// All ad components return null so zero ad code is bundled into the app.
const IS_MOBILE_BUILD = process.env.NEXT_PUBLIC_MOBILE_BUILD === 'true'

interface AdBannerProps {
    variant?: "footer" | "rectangle" | "native" | "skyscraper" | "responsive" | "mobile-banner"
}

export function AdBanner({ variant = "footer" }: AdBannerProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        if (IS_MOBILE_BUILD) return
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    useEffect(() => {
        if (IS_MOBILE_BUILD) return
        const container = containerRef.current
        if (!container) return

        container.innerHTML = ""

        // ── AD NETWORK CONFIGURATION ──────────────────────────────────────────
        // Currently: Tonic Governess  |  Swap keys/urls here to change networks
        // ─────────────────────────────────────────────────────────────────────
        let conf = {
            key: "616f9cf69cb04c34acb730e9239646e0",
            height: 250,
            width: 300,
            url: "//tonicgoverness.com/616f9cf69cb04c34acb730e9239646e0/invoke.js",
        }

        if (variant === "rectangle" || variant === "responsive") {
            conf = {
                key: "616f9cf69cb04c34acb730e9239646e0",
                height: 250,
                width: 300,
                url: "//tonicgoverness.com/616f9cf69cb04c34acb730e9239646e0/invoke.js",
            }
        } else if (variant === "mobile-banner") {
            conf = {
                key: "ee2936c122e5b6cd6be8ae3b8019a581",
                height: 50,
                width: 320,
                url: "//tonicgoverness.com/ee2936c122e5b6cd6be8ae3b8019a581/invoke.js",
            }
        } else if (variant === "footer") {
            if (isMobile) {
                conf = {
                    key: "ee2936c122e5b6cd6be8ae3b8019a581",
                    height: 50,
                    width: 320,
                    url: "//tonicgoverness.com/ee2936c122e5b6cd6be8ae3b8019a581/invoke.js",
                }
            } else {
                conf = {
                    key: "d84ed579e24fb0e02224fedd00bed35b",
                    height: 90,
                    width: 728,
                    url: "//tonicgoverness.com/d84ed579e24fb0e02224fedd00bed35b/invoke.js",
                }
            }
        } else if (variant === "skyscraper") {
            conf = {
                key: "616f9cf69cb04c34acb730e9239646e0",
                height: 600,
                width: 160,
                url: "//tonicgoverness.com/616f9cf69cb04c34acb730e9239646e0/invoke.js",
            }
        }

        const iframe = document.createElement("iframe")
        iframe.style.width = `${conf.width}px`
        iframe.style.height = `${conf.height}px`
        iframe.style.border = "none"
        iframe.style.overflow = "hidden"
        iframe.scrolling = "no"

        container.appendChild(iframe)

        const doc = iframe.contentWindow?.document || iframe.contentDocument
        if (doc) {
            doc.open()
            doc.write(`
        <!DOCTYPE html>
        <html>
          <body style="margin:0;padding:0;overflow:hidden;">
            <script type="text/javascript">
              atOptions = {
                'key' : '${conf.key}',
                'format' : 'iframe',
                'height' : ${conf.height},
                'width' : ${conf.width},
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="${conf.url}"></script>
          </body>
        </html>
      `)
            doc.close()
        }

        return () => {
            if (container) container.innerHTML = ""
        }
    }, [variant, isMobile])

    // Never render in the app build
    if (IS_MOBILE_BUILD) return null

    if (variant === "rectangle" || variant === "responsive") {
        return (
            <div className="w-full flex items-center justify-center py-4">
                <div
                    ref={containerRef}
                    className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm"
                    style={{ width: 300, height: 250, maxWidth: "100%" }}
                />
            </div>
        )
    }

    if (variant === "mobile-banner") {
        return (
            <div className="w-full flex items-center justify-center py-2">
                <div
                    ref={containerRef}
                    className="flex items-center justify-center overflow-hidden rounded-lg"
                    style={{ width: 320, height: 50, maxWidth: "100%" }}
                />
            </div>
        )
    }

    if (variant === "skyscraper") {
        return (
            <div className="hidden xl:flex items-center justify-center h-full">
                <div
                    ref={containerRef}
                    className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden sticky top-24 shadow-sm"
                    style={{ width: 160, height: 600 }}
                />
            </div>
        )
    }

    // Footer Ad
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 border-t backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-lg flex justify-center overflow-hidden">
            <div className={isMobile ? "py-1" : "py-2"}>
                <div className={isMobile ? "" : "transform md:scale-[0.8] lg:scale-100 origin-bottom transition-transform"}>
                    <div
                        ref={containerRef}
                        className="flex items-center justify-center overflow-hidden"
                        style={isMobile ? { width: 320, height: 50 } : { width: 728, height: 90 }}
                    />
                </div>
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

// ── NATIVE BANNER (in-content) ────────────────────────────────────────────────
// Currently: Tonic Governess native unit
// To switch to Adsterra: replace containerId + script src below
// ─────────────────────────────────────────────────────────────────────────────
export function TonicNativeBanner() {
    if (IS_MOBILE_BUILD) return null

    const containerId = "container-601b8193a0d113517d9d00bae103c5f9"

    useEffect(() => {
        if (document.getElementById("tonic-native-script")) return
        const script = document.createElement("script")
        script.id = "tonic-native-script"
        script.src = "https://tonicgoverness.com/601b8193a0d113517d9d00bae103c5f9/invoke.js"
        script.async = true
        script.setAttribute("data-cfasync", "false")
        document.body.appendChild(script)
    }, [])

    return (
        <div className="w-full my-6">
            <div id={containerId} />
        </div>
    )
}

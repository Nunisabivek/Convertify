"use client"

import { useEffect, useRef, useState } from "react"

interface AdBannerProps {
    variant?: "footer" | "rectangle" | "native" | "skyscraper" | "responsive"
}

export function AdBanner({ variant = "footer" }: AdBannerProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        // Check screen size
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        // Clear previous content
        container.innerHTML = ""

        // Configuration based on variant and screen size
        let conf = {
            key: "616f9cf69cb04c34acb730e9239646e0",
            height: 250,
            width: 300,
            url: "//entertainenslave.com/616f9cf69cb04c34acb730e9239646e0/invoke.js",
        }

        if (variant === "rectangle" || variant === "responsive") {
            // 300x250 Rectangle - works well on all devices
            conf = {
                key: "616f9cf69cb04c34acb730e9239646e0",
                height: 250,
                width: 300,
                url: "//entertainenslave.com/616f9cf69cb04c34acb730e9239646e0/invoke.js",
            }
        } else if (variant === "footer") {
            if (isMobile) {
                // Mobile footer: 300x250 instead of 728x90
                conf = {
                    key: "616f9cf69cb04c34acb730e9239646e0",
                    height: 250,
                    width: 300,
                    url: "//entertainenslave.com/616f9cf69cb04c34acb730e9239646e0/invoke.js",
                }
            } else {
                // Desktop footer: 728x90
                conf = {
                    key: "d84ed579e24fb0e02224fedd00bed35b",
                    height: 90,
                    width: 728,
                    url: "//entertainenslave.com/d84ed579e24fb0e02224fedd00bed35b/invoke.js",
                }
            }
        } else if (variant === "skyscraper") {
            // Skyscraper: 160x600 (hidden on mobile via CSS)
            conf = {
                key: "616f9cf69cb04c34acb730e9239646e0",
                height: 600,
                width: 160,
                url: "//entertainenslave.com/616f9cf69cb04c34acb730e9239646e0/invoke.js",
            }
        }

        // Create a friendly iframe to house the ad script
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

    // Rectangle Ad - Responsive container
    if (variant === "rectangle" || variant === "responsive") {
        return (
            <div className="w-full flex items-center justify-center py-4">
                <div
                    ref={containerRef}
                    className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm"
                    style={{
                        width: 300,
                        height: 250,
                        maxWidth: "100%"
                    }}
                />
            </div>
        )
    }

    // Skyscraper Ad - Hidden on mobile
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

    // Footer Ad - Responsive with different sizes
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 border-t backdrop-blur supports-[backdrop-filter]:bg-white/60 p-2 shadow-lg flex justify-center overflow-hidden">
            {/* Mobile: Show rectangle ad */}
            <div className="md:hidden">
                <div
                    ref={containerRef}
                    className="flex items-center justify-center overflow-hidden"
                    style={{ width: 300, height: 250 }}
                />
            </div>
            {/* Desktop: Show banner ad with scaling */}
            <div className="hidden md:block">
                <div className="transform md:scale-[0.8] lg:scale-100 origin-bottom transition-transform duration-300 ease-out">
                    <div
                        ref={containerRef}
                        className="flex items-center justify-center overflow-hidden"
                        style={{ width: 728, height: 90 }}
                    />
                </div>
            </div>
        </div>
    )
}

// In-content responsive ad specifically for blog posts
export function BlogAd() {
    return (
        <div className="w-full my-8">
            {/* Desktop: Centered rectangle */}
            <div className="flex justify-center">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <AdBanner variant="rectangle" />
                </div>
            </div>
        </div>
    )
}

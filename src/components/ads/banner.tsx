"use client"

import { useEffect, useRef } from "react"

interface AdBannerProps {
    variant?: "footer" | "rectangle" | "native" | "skyscraper"
}

export function AdBanner({ variant = "footer" }: AdBannerProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        // Clear previous content
        container.innerHTML = ""

        // Configuration based on variant
        const isRectangle = variant === "rectangle"
        const conf = isRectangle
            ? {
                key: "616f9cf69cb04c34acb730e9239646e0",
                height: 250,
                width: 300,
                url: "//entertainenslave.com/616f9cf69cb04c34acb730e9239646e0/invoke.js",
            }
            : {
                // Footer (728x90)
                key: "d84ed579e24fb0e02224fedd00bed35b",
                height: 90,
                width: 728,
                url: "//entertainenslave.com/d84ed579e24fb0e02224fedd00bed35b/invoke.js",
            }

        if (variant === "skyscraper") {
            // Skyscraper (160x600) - TODO: Replace with actual key
            // Using rectangle key temporarily for demo
            Object.assign(conf, {
                key: "616f9cf69cb04c34acb730e9239646e0",
                height: 600,
                width: 160,
                // url: "//entertainenslave.com/YOUR_SKYSCRAPER_KEY/invoke.js"
            })
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
    }, [variant])

    if (variant === "rectangle") {
        return (
            <div className="mx-auto my-8 flex items-center justify-center">
                <div
                    ref={containerRef}
                    className="flex items-center justify-center bg-slate-50 border rounded-lg overflow-hidden"
                    style={{ width: 300, height: 250 }}
                />
            </div>
        )
    }

    if (variant === "skyscraper") {
        return (
            <div className="flex items-center justify-center h-full">
                <div
                    ref={containerRef}
                    className="flex items-center justify-center bg-slate-50 border rounded-lg overflow-hidden sticky top-24"
                    style={{ width: 160, height: 600 }}
                />
            </div>
        )
    }

    // Sticky Footer
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 border-t backdrop-blur supports-[backdrop-filter]:bg-white/60 p-2 shadow-lg flex justify-center overflow-hidden">
            <div className="transform scale-[0.45] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 origin-bottom transition-transform duration-300 ease-out">
                <div
                    ref={containerRef}
                    className="flex items-center justify-center overflow-hidden"
                    style={{ width: 728, height: 90 }}
                />
            </div>
        </div>
    )
}

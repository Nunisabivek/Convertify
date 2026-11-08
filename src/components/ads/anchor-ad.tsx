"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import { AdFrame, AD_SLOTS_ON } from "./banner"
import { SIZES, anchorAllowed, anchorSize, type BannerSize } from "@/lib/adsterra"

const CLOSED_KEY = "cv-anchor-ad-closed"
// Let the page and the tool load first; the banner never competes with the first paint.
const SHOW_AFTER_MS = 3000

/**
 * A short banner pinned to the bottom of the screen (320x50 on phones, 728x90 on desktop) with a
 * close button that holds for the rest of the visit. Skipped on canvas editors, where it would sit
 * on the working area. Each page change loads a fresh ad; nothing refreshes on a timer.
 */
export function AnchorAd() {
    const pathname = usePathname()
    const [size, setSize] = useState<BannerSize | null>(null)
    const [closed, setClosed] = useState(false)

    useEffect(() => {
        if (!AD_SLOTS_ON) return
        const t = setTimeout(() => {
            try {
                if (sessionStorage.getItem(CLOSED_KEY) === "1") return
            } catch {
                // Storage blocked: the close button still works for this page.
            }
            setSize(anchorSize(window.innerWidth))
        }, SHOW_AFTER_MS)
        return () => clearTimeout(t)
    }, [])

    if (!AD_SLOTS_ON || closed || !size || !anchorAllowed(pathname)) return null

    const close = () => {
        setClosed(true)
        try {
            sessionStorage.setItem(CLOSED_KEY, "1")
        } catch {
            // ignore
        }
    }
    const { height } = SIZES[size]
    return (
        <>
            {/* Room at the end of the page so the banner never hides the footer. */}
            <div aria-hidden="true" style={{ height: height + 12 }} />
            <div
                className="fixed inset-x-0 bottom-0 z-40 flex justify-center pointer-events-none"
                style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
                <div className="relative pointer-events-auto bg-white/95 border border-b-0 border-slate-200 rounded-t-lg shadow-[0_-2px_10px_rgba(0,0,0,0.08)] px-1 pt-1">
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Close advertisement"
                        className="absolute -top-7 right-0 flex h-7 w-9 items-center justify-center rounded-t-md border border-b-0 border-slate-200 bg-white text-slate-500 hover:text-slate-900"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <AdFrame key={pathname} size={size} onEmpty={() => setSize(null)} />
                </div>
            </div>
        </>
    )
}

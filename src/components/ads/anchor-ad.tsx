"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import { AdFrame, AD_SLOTS_ON } from "./banner"
import { SIZES, anchorAllowed, anchorSize, type BannerSize } from "@/lib/adsterra"
import { FILE_SAVED_EVENT } from "@/lib/monetag"

const CLOSED_KEY = "cv-anchor-ad-closed"

/**
 * A short banner pinned to the bottom of the screen (320x50 on phones, 728x90 on desktop) with a
 * close button that holds for the rest of the visit. It appears only once the visitor has scrolled
 * past the first screen or saved a file, so it never covers a tool's upload area on arrival (what a
 * visitor from search sees first). Skipped on canvas editors. Each page change loads a fresh ad.
 */
export function AnchorAd() {
    const pathname = usePathname()
    const [size, setSize] = useState<BannerSize | null>(null)
    const [closed, setClosed] = useState(false)

    useEffect(() => {
        if (!AD_SLOTS_ON) return
        const show = () => {
            stop()
            try {
                if (sessionStorage.getItem(CLOSED_KEY) === "1") return
            } catch {
                // Storage blocked: the close button still works for this page.
            }
            setSize(anchorSize(window.innerWidth))
        }
        const onScroll = () => {
            if (window.scrollY > window.innerHeight) show()
        }
        const stop = () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener(FILE_SAVED_EVENT, show)
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener(FILE_SAVED_EVENT, show)
        return stop
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

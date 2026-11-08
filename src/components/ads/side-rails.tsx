"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { AdFrame, AD_SLOTS_ON } from "./banner"
import { RAIL_MIN_WIDTH, RAIL_STRIP, UNITS, anchorAllowed } from "@/lib/adsterra"

// Let the page settle (fonts, the tool UI) before measuring its margins.
const SHOW_AFTER_MS = 3000
const RAIL_TOP = 128
const RAIL_HEIGHT = 316 // label + 300 px banner
const MEDIA = "img, svg, canvas, video, input, textarea, select, button, iframe"

/**
 * True when no text or media inside the page body reaches into the strips at the screen edges.
 * Text is measured by its glyph boxes, not its element: a full-width heading with centred text
 * leaves the margins free. The footer is handled separately (the rails hide when it scrolls up).
 */
function marginsFree(): boolean {
    const main = document.querySelector("main")
    if (!main) return false
    const vw = document.documentElement.clientWidth
    const blocks = (r: DOMRect) => r.width >= 2 && r.height >= 2 && (r.left < RAIL_STRIP || r.right > vw - RAIL_STRIP)
    for (const el of main.querySelectorAll(MEDIA)) if (blocks(el.getBoundingClientRect())) return false
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT)
    const range = document.createRange()
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        if (!n.textContent?.trim()) continue
        range.selectNodeContents(n)
        for (const r of range.getClientRects()) if (blocks(r)) return false
    }
    return true
}

/**
 * Two 160x300 banners pinned in the empty side margins of very wide screens. They show only when
 * the page's own content stays clear of both edges, and never on the canvas editors.
 */
export function SideRails() {
    const pathname = usePathname()
    const [shownOn, setShownOn] = useState<string | null>(null)
    const [footerNear, setFooterNear] = useState(false)
    // Set the first time the rails are on screen with the footer out of the way: an ad never
    // loads while hidden, and hiding them later (opacity) doesn't reload them.
    const [liveOn, setLiveOn] = useState<string | null>(null)
    const [empty, setEmpty] = useState(false)

    useEffect(() => {
        if (!AD_SLOTS_ON || !UNITS.skyscraper || !anchorAllowed(pathname)) return
        const mq = window.matchMedia(`(min-width: ${RAIL_MIN_WIDTH}px)`)
        const update = () => setShownOn(mq.matches && marginsFree() ? pathname : null)
        const t = window.setTimeout(update, SHOW_AFTER_MS)
        mq.addEventListener("change", update)
        return () => {
            window.clearTimeout(t)
            mq.removeEventListener("change", update)
        }
    }, [pathname])

    // The footer's links run to the screen edges: step aside before it reaches the rails.
    useEffect(() => {
        if (shownOn !== pathname) return
        const footer = document.querySelector("footer")
        if (!footer) return
        let raf = 0
        const onScroll = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(() => {
                const near = footer.getBoundingClientRect().top < RAIL_TOP + RAIL_HEIGHT + 16
                setFooterNear(near)
                if (!near) setLiveOn(pathname)
            })
        }
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)
        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
        }
    }, [shownOn, pathname])

    if (!AD_SLOTS_ON || empty || shownOn !== pathname || liveOn !== pathname) return null
    const rail = (side: "left" | "right") => (
        <div
            className="fixed z-30 flex flex-col items-center transition-opacity duration-200"
            style={{ top: RAIL_TOP, [side]: 16, width: 160, opacity: footerNear ? 0 : 1, pointerEvents: footerNear ? "none" : undefined }}
            aria-hidden={footerNear || undefined}
        >
            <span className="mb-1 text-[10px] uppercase tracking-wider text-slate-400">Advertisement</span>
            <AdFrame key={`${pathname}-${side}`} size="skyscraper" onEmpty={() => setEmpty(true)} />
        </div>
    )
    return (
        <>
            {rail("left")}
            {rail("right")}
        </>
    )
}

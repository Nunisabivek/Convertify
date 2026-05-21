"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const IS_MOBILE_BUILD = process.env.NEXT_PUBLIC_MOBILE_BUILD === "true"

const POPUNDER_SRC =
    "https://tonicgoverness.com/c9/10/84/c91084acdeea2a9474360f743f122509.js"

const TOOL_PATH_PATTERN =
    /^\/(merge-pdf|compress-pdf|split-pdf|pdf-to-word|word-to-pdf|pdf-to-jpg|jpg-to-pdf|excel-to-pdf|pdf-to-png|png-to-pdf|rotate-pdf|protect-pdf|unlock-pdf|add-page-numbers|delete-pdf-pages|watermark-pdf|reorder-pdf|organize-pdf|image-compressor|resize-image|heic-to-jpg|jpg-to-png|png-to-jpg|webp-converter|pdf-to-text|html-to-pdf|bmp-to-jpg|gif-to-png|svg-to-png|tiff-to-pdf|qr-code-generator|csv-to-json|json-to-csv|xml-to-json|base64|markdown-to-pdf|text-to-pdf|edit-pdf|autocad-pdf-editor|sign-pdf|crop-pdf|repair-pdf|redact-pdf|compare-pdf|pdf-to-excel|pdf-to-powerpoint|pdf-to-pdfa|powerpoint-to-pdf|ocr-pdf)$/

const STATE_KEY = "__convertifyPopunderLoaded"
const LAST_FIRED_KEY = "convertify:popunderLastFiredAt"
const COOLDOWN_MS = 30 * 60 * 1000

declare global {
    interface Window {
        __convertifyPopunderLoaded?: boolean
    }
}

function loadOnce() {
    if (typeof window === "undefined") return
    if (window[STATE_KEY]) return

    try {
        const last = parseInt(localStorage.getItem(LAST_FIRED_KEY) || "0", 10)
        if (last && Date.now() - last < COOLDOWN_MS) {
            window[STATE_KEY] = true
            return
        }
    } catch {
        // localStorage may be blocked; ignore
    }

    window[STATE_KEY] = true
    const s = document.createElement("script")
    s.src = POPUNDER_SRC
    s.async = true
    document.body.appendChild(s)

    try {
        localStorage.setItem(LAST_FIRED_KEY, Date.now().toString())
    } catch {
        // ignore
    }
}

export function PopunderLoader() {
    const pathname = usePathname() ?? "/"

    useEffect(() => {
        if (IS_MOBILE_BUILD) return
        if (typeof window === "undefined") return

        const isToolPage = TOOL_PATH_PATTERN.test(pathname)

        const handleAllow = () => loadOnce()

        // Tools dispatch this after a successful conversion.
        window.addEventListener("convertify:popunder-allow", handleAllow)

        // Universal signal: any <a download> click means a tool just produced
        // a file. This lets us monetize at the ideal moment (right after the
        // user got what they came for) without editing 34 tool components.
        const onAnchorClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null
            if (!target) return
            const anchor = target.closest("a") as HTMLAnchorElement | null
            if (!anchor) return
            if (anchor.hasAttribute("download")) {
                loadOnce()
            }
        }
        document.addEventListener("click", onAnchorClick, true)

        // Failsafe so non-tool pages (homepage, blog, /all-tools) still earn:
        // long delay + at least one user interaction. Tool pages skip this so
        // we never interrupt someone trying to use a converter.
        let timer: ReturnType<typeof setTimeout> | null = null
        let interacted = false
        const onInteract = () => {
            interacted = true
        }

        if (!isToolPage) {
            const events = ["scroll", "click", "keydown", "touchstart"] as const
            events.forEach((evt) =>
                window.addEventListener(evt, onInteract, { once: true, passive: true } as AddEventListenerOptions),
            )
            timer = setTimeout(() => {
                if (interacted) loadOnce()
            }, 45_000)
        }

        return () => {
            window.removeEventListener("convertify:popunder-allow", handleAllow)
            document.removeEventListener("click", onAnchorClick, true)
            if (timer) clearTimeout(timer)
            const events = ["scroll", "click", "keydown", "touchstart"] as const
            events.forEach((evt) => window.removeEventListener(evt, onInteract))
        }
    }, [pathname])

    return null
}

// Fire from any tool's success/download flow:
//   import { firePopunderAllow } from "@/components/ads/popunder"
//   firePopunderAllow()
export function firePopunderAllow() {
    if (typeof window === "undefined") return
    if (IS_MOBILE_BUILD) return
    window.dispatchEvent(new Event("convertify:popunder-allow"))
}

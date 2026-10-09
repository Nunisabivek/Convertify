import Link from "next/link"
import Image from "next/image"
import { Smartphone, ShieldCheck, Sparkles, Star } from "lucide-react"

export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.convertify.work"

/**
 * Standard 4-color Google Play brand triangle vector logo.
 */
export function GooglePlayIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
            <path
                fill="#4285F4"
                d="M48.2 38.6c-4.2 4.4-6.8 11.2-6.8 20.2v394.4c0 9 2.6 15.8 6.8 20.2l2.3 2.1 221.4-221.4v-5.2L50.5 36.5l-2.3 2.1z"
            />
            <path
                fill="#FFBA00"
                d="M345.5 319.4l-73.6-73.6v-5.2l73.6-73.6 1.7 1 87.2 49.5c24.9 14.1 24.9 37.3 0 51.5l-87.2 49.4-1.7 1z"
            />
            <path
                fill="#EA4335"
                d="M347.2 318.4L271.9 243 48.2 466.7c8.2 8.7 21.8 9.8 37 1.2l262-149.5z"
            />
            <path
                fill="#34A853"
                d="M347.2 167.6L85.2 18.1C70 9.5 56.4 10.6 48.2 19.3l223.7 223.7 75.3-75.4z"
            />
        </svg>
    )
}

/**
 * Official-style "GET IT ON Google Play" button badge.
 */
export function GooglePlayButton({
    className = "",
    size = "default",
}: {
    className?: string
    size?: "default" | "sm" | "lg"
}) {
    const isSm = size === "sm"
    const isLg = size === "lg"

    return (
        <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get Convertify on Google Play"
            className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 active:scale-95 text-white border border-slate-800 shadow-md transition-all duration-200 group select-none ${
                isSm ? "py-1.5 px-3 rounded-lg" : isLg ? "py-3.5 px-6 rounded-2xl" : ""
            } ${className}`}
        >
            <GooglePlayIcon className={isSm ? "w-5 h-5 shrink-0" : isLg ? "w-8 h-8 shrink-0" : "w-6 h-6 shrink-0"} />
            <div className="flex flex-col text-left leading-none">
                <span className="text-[9px] uppercase tracking-widest text-slate-300 font-semibold mb-0.5">
                    GET IT ON
                </span>
                <span className={`font-bold tracking-tight text-white group-hover:text-blue-300 transition-colors ${
                    isSm ? "text-xs" : isLg ? "text-base" : "text-sm"
                }`}>
                    Google Play
                </span>
            </div>
        </a>
    )
}

/**
 * High-converting promotion banner displayed below every tool page and landing page.
 */
export function PlayStoreBanner({ className = "" }: { className?: string }) {
    return (
        <aside
            aria-label="Download Convertify Android App"
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 border border-indigo-900/60 shadow-xl ${className}`}
        >
            {/* Subtle decorative glow */}
            <div
                className="absolute -top-24 -right-24 w-72 h-72 bg-[#026EFF]/20 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
            />
            <div
                className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
                {/* Left side: App Info & Highlights */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                    <div className="relative shrink-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#026EFF] to-indigo-600 p-0.5 shadow-lg flex items-center justify-center">
                            <Image
                                src="/images/Convertify.png"
                                alt="Convertify App Icon"
                                width={64}
                                height={64}
                                className="w-full h-full object-contain rounded-2xl"
                            />
                        </div>
                        <span className="absolute -bottom-2 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                            App
                        </span>
                    </div>

                    <div className="space-y-1.5 max-w-xl">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Official Android App
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                5.0 on Play Store
                            </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                            Convertify is on Google Play!
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Scan paper documents with direct camera auto-edge tracking, Xerox photocopy filters, and compress & convert 40+ file formats offline on your phone. 100% Free & Private.
                        </p>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                Files Never Leave Device
                            </span>
                            <span className="flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                                No Subscriptions
                            </span>
                            <span className="flex items-center gap-1">
                                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                                Works Offline
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right side: Google Play CTA Button */}
                <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
                    <GooglePlayButton size="lg" className="shadow-2xl hover:shadow-blue-500/20 border-slate-700" />
                    <span className="text-[11px] text-slate-400 font-medium">
                        Free download • Android 8.0+
                    </span>
                </div>
            </div>
        </aside>
    )
}

/**
 * Compact, responsive callout placed directly inside every individual tool page
 * immediately below the active converter workspace.
 * Highly optimized for Mobile (320px–640px), Tablet (641px–1024px), Laptop & Desktop.
 */
export function InToolPlayStoreCallout({
    toolName,
    className = "",
}: {
    toolName?: string
    className?: string
}) {
    return (
        <aside
            aria-label="Download Convertify Android App"
            className={`w-full max-w-4xl mx-auto my-8 relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 md:p-7 border border-indigo-900/60 shadow-xl select-none ${className}`}
        >
            {/* Ambient background glows */}
            <div
                className="absolute -top-16 -right-16 w-56 h-56 bg-[#026EFF]/20 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
            />
            <div
                className="absolute -bottom-16 -left-16 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8">
                {/* Left: App icon and key benefits */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 md:gap-5 w-full">
                    <div className="relative shrink-0">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#026EFF] to-indigo-600 p-0.5 shadow-lg flex items-center justify-center">
                            <Image
                                src="/images/Convertify.png"
                                alt="Convertify Icon"
                                width={56}
                                height={56}
                                className="w-full h-full object-contain rounded-2xl"
                            />
                        </div>
                        <span className="absolute -bottom-1.5 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow">
                            App
                        </span>
                    </div>

                    <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Official Google Play App
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-semibold border border-amber-500/30">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                5.0 Rating
                            </span>
                        </div>

                        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight">
                            {toolName ? `Take ${toolName} on the go!` : "Convertify is on Google Play!"}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                            Scan paper documents with live camera auto-edge detection, apply Xerox photocopy filters, and convert 40+ formats offline on your Android phone. 100% Free &amp; Private.
                        </p>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                Files Stay On Device
                            </span>
                            <span className="flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                Free • No Subscription
                            </span>
                            <span className="flex items-center gap-1">
                                <Smartphone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                Works Offline
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Google Play Button */}
                <div className="flex flex-col items-center md:items-end gap-1.5 shrink-0 w-full sm:w-auto">
                    <GooglePlayButton
                        size="default"
                        className="w-full sm:w-auto justify-center shadow-xl hover:shadow-blue-500/20 border-slate-700"
                    />
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium text-center md:text-right">
                        Free download • Android 8.0+
                    </span>
                </div>
            </div>
        </aside>
    )
}

/**
 * Prominent front badge placed at the very top of tool pages (above the fold)
 * so users never have to scroll to find the Google Play app download link.
 */
export function ToolFrontPlayBadge({
    toolName,
    className = "",
}: {
    toolName?: string
    className?: string
}) {
    return (
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 my-4 select-none ${className}`}>
            <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download Convertify on Google Play"
                className="group inline-flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-950 hover:bg-slate-900 active:scale-95 text-white border border-slate-800 shadow-sm hover:shadow-md transition-all duration-200"
            >
                <GooglePlayIcon className="w-5 h-5 shrink-0" />
                <div className="flex flex-col text-left leading-none">
                    <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
                        GET IT ON
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                        Google Play
                    </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 ml-1 pl-2 border-l border-slate-700">
                    <Star className="w-3 h-3 fill-amber-400" />
                    5.0
                </span>
            </a>

            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium text-center">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-semibold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Offline &amp; Private
                </span>
                <span className="text-slate-500 text-[11px]">
                    {toolName ? `Use ${toolName} on Android` : "Free Android App"}
                </span>
            </div>
        </div>
    )
}

/**
 * Top announcement smart bar displayed right under the header across all pages.
 * Zero-scroll guarantee: visible immediately on mobile, tablet, and desktop viewports.
 */
export function PlayStoreTopBar({ className = "" }: { className?: string }) {
    return (
        <aside
            aria-label="Convertify Android App Announcement"
            className={`w-full bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white px-3 sm:px-4 py-2 border-b border-indigo-900/60 shadow-xs select-none ${className}`}
        >
            <div className="container max-w-6xl mx-auto flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#026EFF] to-indigo-600 p-0.5 shrink-0 flex items-center justify-center shadow-xs">
                        <Image
                            src="/images/Convertify.png"
                            alt="Convertify"
                            width={22}
                            height={22}
                            className="w-full h-full object-contain rounded-md"
                        />
                    </div>
                    <p className="truncate text-slate-200 text-xs">
                        <span className="font-bold text-white">Convertify on Google Play</span>
                        <span className="hidden md:inline text-slate-300"> — Camera document scanner, Xerox photocopy filters &amp; 100% offline conversion.</span>
                        <span className="inline md:hidden text-slate-300"> — Free offline scanner &amp; converter.</span>
                    </p>
                </div>
                <a
                    href={PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-[11px] border border-white/20 shadow-xs transition-all hover:text-blue-200"
                    aria-label="Download Convertify on Google Play"
                >
                    <GooglePlayIcon className="w-3.5 h-3.5" />
                    <span>Get App</span>
                </a>
            </div>
        </aside>
    )
}



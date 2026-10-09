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

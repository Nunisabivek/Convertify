"use client"

import Link from "next/link"
import { ArrowLeftRight, Sparkles } from "lucide-react"
import { usePathname } from "next/navigation"

interface SwapPair {
    target: string
    fromFormat: string
    toFormat: string
    fromColor: string
    toColor: string
}

const SWAP_PAIRS: Record<string, SwapPair> = {
    // PDF <-> Image (JPG)
    "pdf-to-jpg": {
        target: "jpg-to-pdf",
        fromFormat: "JPG",
        toFormat: "PDF",
        fromColor: "from-amber-500 to-orange-500",
        toColor: "from-red-500 to-rose-500"
    },
    "jpg-to-pdf": {
        target: "pdf-to-jpg",
        fromFormat: "PDF",
        toFormat: "JPG",
        fromColor: "from-red-500 to-rose-500",
        toColor: "from-amber-500 to-orange-500"
    },

    // PDF <-> Image (PNG)
    "pdf-to-png": {
        target: "png-to-pdf",
        fromFormat: "PNG",
        toFormat: "PDF",
        fromColor: "from-emerald-500 to-teal-500",
        toColor: "from-red-500 to-rose-500"
    },
    "png-to-pdf": {
        target: "pdf-to-png",
        fromFormat: "PDF",
        toFormat: "PNG",
        fromColor: "from-red-500 to-rose-500",
        toColor: "from-emerald-500 to-teal-500"
    },

    // PDF <-> Word
    "pdf-to-word": {
        target: "word-to-pdf",
        fromFormat: "Word",
        toFormat: "PDF",
        fromColor: "from-blue-500 to-indigo-500",
        toColor: "from-red-500 to-rose-500"
    },
    "word-to-pdf": {
        target: "pdf-to-word",
        fromFormat: "PDF",
        toFormat: "Word",
        fromColor: "from-red-500 to-rose-500",
        toColor: "from-blue-500 to-indigo-500"
    },

    // PDF <-> Excel
    "pdf-to-excel": {
        target: "excel-to-pdf",
        fromFormat: "Excel",
        toFormat: "PDF",
        fromColor: "from-green-500 to-emerald-500",
        toColor: "from-red-500 to-rose-500"
    },
    "excel-to-pdf": {
        target: "pdf-to-excel",
        fromFormat: "PDF",
        toFormat: "Excel",
        fromColor: "from-red-500 to-rose-500",
        toColor: "from-green-500 to-emerald-500"
    },

    // PDF <-> PowerPoint
    "pdf-to-powerpoint": {
        target: "powerpoint-to-pdf",
        fromFormat: "PPT",
        toFormat: "PDF",
        fromColor: "from-orange-500 to-red-500",
        toColor: "from-red-500 to-rose-500"
    },
    "powerpoint-to-pdf": {
        target: "pdf-to-powerpoint",
        fromFormat: "PDF",
        toFormat: "PPT",
        fromColor: "from-red-500 to-rose-500",
        toColor: "from-orange-500 to-red-500"
    },

    // PDF <-> Text
    "pdf-to-text": {
        target: "text-to-pdf",
        fromFormat: "Text",
        toFormat: "PDF",
        fromColor: "from-slate-500 to-gray-600",
        toColor: "from-red-500 to-rose-500"
    },
    "text-to-pdf": {
        target: "pdf-to-text",
        fromFormat: "PDF",
        toFormat: "Text",
        fromColor: "from-red-500 to-rose-500",
        toColor: "from-slate-500 to-gray-600"
    },
    // Protect <-> Unlock
    "protect-pdf": {
        target: "unlock-pdf",
        fromFormat: "Protected",
        toFormat: "Unlocked",
        fromColor: "from-slate-600 to-gray-700",
        toColor: "from-lime-500 to-green-500"
    },
    "unlock-pdf": {
        target: "protect-pdf",
        fromFormat: "Unlocked",
        toFormat: "Protected",
        fromColor: "from-lime-500 to-green-500",
        toColor: "from-slate-600 to-gray-700"
    },

    // Merge <-> Split
    "merge-pdf": {
        target: "split-pdf",
        fromFormat: "Merged",
        toFormat: "Split",
        fromColor: "from-red-500 to-rose-500",
        toColor: "from-orange-500 to-amber-500"
    },
    "split-pdf": {
        target: "merge-pdf",
        fromFormat: "Split",
        toFormat: "Merged",
        fromColor: "from-orange-500 to-amber-500",
        toColor: "from-red-500 to-rose-500"
    },
}

export function ToolSwapper() {
    const pathname = usePathname()
    const currentTool = pathname?.replace(/^\//, "")

    const swapInfo = currentTool ? SWAP_PAIRS[currentTool] : null

    if (!swapInfo) return null

    return (
        <div className="flex justify-center mb-8">
            <Link
                href={`/${swapInfo.target}`}
                className="group relative overflow-hidden"
            >
                {/* Main Button Container */}
                <div className="relative flex items-center gap-1 px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl shadow-lg hover:shadow-xl hover:border-indigo-300 transition-all duration-300">

                    {/* Sparkle decoration */}
                    <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />

                    {/* Current format badge */}
                    <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${swapInfo.fromColor} text-white font-bold text-sm shadow-md`}>
                        {swapInfo.fromFormat}
                    </div>

                    {/* Swap icon with animation */}
                    <div className="relative mx-2 p-2 rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                        <ArrowLeftRight className="w-5 h-5 text-indigo-600 group-hover:scale-110 group-hover:rotate-180 transition-all duration-500" />
                    </div>

                    {/* Target format badge */}
                    <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${swapInfo.toColor} text-white font-bold text-sm shadow-md`}>
                        {swapInfo.toFormat}
                    </div>

                    {/* Divider */}
                    <div className="w-px h-8 bg-slate-200 mx-3"></div>

                    {/* Call to action */}
                    <div className="text-sm">
                        <span className="text-slate-500">Wrong direction?</span>
                        <span className="ml-1 font-bold text-indigo-600 group-hover:text-indigo-700">Swap →</span>
                    </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
        </div>
    )
}

// Export the pairs for use in other components/SEO
export { SWAP_PAIRS }

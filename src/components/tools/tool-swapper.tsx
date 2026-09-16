"use client"

import Link from "next/link"
import { ArrowLeftRight } from "lucide-react"
import { usePathname } from "next/navigation"
import { getSwapInfo, SWAP_PAIRS } from "@/lib/tool-swap"

export function ToolSwapper() {
    const pathname = usePathname()
    const currentTool = pathname?.replace(/^\//, "")
    const swap = currentTool ? getSwapInfo(currentTool) : null

    if (!swap) return null

    return (
        <div className="flex justify-center mb-8 px-4">
            <Link
                href={`/${swap.target}`}
                className="group inline-flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-5 py-3 shadow-sm transition-colors hover:border-indigo-400 hover:shadow-md"
            >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <ArrowLeftRight className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-left">
                    <span className="block text-sm text-slate-500">Wrong direction?</span>
                    <span className="block text-base font-bold text-indigo-700 group-hover:text-indigo-800">
                        Swap to {swap.targetDirection}
                    </span>
                </span>
            </Link>
        </div>
    )
}

export { SWAP_PAIRS }

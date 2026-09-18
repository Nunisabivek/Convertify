"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { AdBanner } from "@/components/ads/banner"
import { Progress } from "@/components/ui/progress"

interface ProcessingWaitProps {
    progress: number
    title?: string
    status?: string
    description?: string
}

export function ProcessingWait({ progress, title = "Working…", status, description }: ProcessingWaitProps) {
    const displayStatus = description || status || "This stays on your device."
    const [tipIndex, setTipIndex] = useState(0)

    const tips = [
        "Did you know? PDF stands for Portable Document Format.",
        "Pro Tip: You can merge unlimited files with Convertify.",
        "We are processing your file locally for maximum speed.",
        "Keep this tab open while we work!",
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setTipIndex((prev) => (prev + 1) % tips.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 py-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3 text-[#026EFF]">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <h2 className="text-2xl font-bold">{title}</h2>
                </div>
                <p className="text-slate-500">{displayStatus}</p>

                {/* Progress Bar Container */}
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border">
                    <div
                        className="h-full bg-[#026EFF] transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-sm font-mono text-slate-400">{Math.round(progress)}%</p>

                <div className="bg-blue-50 text-[#026EFF] font-medium px-4 py-2 rounded-lg text-sm inline-block border border-blue-100">
                    💡 {tips[tipIndex]}
                </div>
            </div>

            <div className="flex justify-center border-t border-b py-8 bg-slate-50/50">
                {/* This is the key revenue driver - displayed during the wait */}
                <AdBanner variant="rectangle" />
            </div>

            <p className="text-center text-xs text-slate-400">
                Your file is being processed securely 100% in your browser. No files uploaded.
            </p>
        </div>
    )
}

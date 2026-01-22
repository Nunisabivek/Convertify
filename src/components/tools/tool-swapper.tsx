"use client"

import Link from "next/link"
import { ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

const SWAP_PAIRS: Record<string, { target: string, label: string }> = {
    // PDF <-> Image
    "pdf-to-jpg": { target: "jpg-to-pdf", label: "Swap to JPG to PDF" },
    "jpg-to-pdf": { target: "pdf-to-jpg", label: "Swap to PDF to JPG" },

    // PDF <-> Word
    "pdf-to-word": { target: "word-to-pdf", label: "Swap to Word to PDF" },
    "word-to-pdf": { target: "pdf-to-word", label: "Swap to PDF to Word" },

    // PDF <-> Excel
    "pdf-to-excel": { target: "excel-to-pdf", label: "Swap to Excel to PDF" },
    "excel-to-pdf": { target: "pdf-to-excel", label: "Swap to PDF to Excel" },

    // PDF <-> PowerPoint
    "pdf-to-powerpoint": { target: "powerpoint-to-pdf", label: "Swap to PPT to PDF" },
    "powerpoint-to-pdf": { target: "pdf-to-powerpoint", label: "Swap to PDF to PPT" },

    // PDF <-> Text
    "pdf-to-text": { target: "text-to-pdf", label: "Swap to Text to PDF" },
    "text-to-pdf": { target: "pdf-to-text", label: "Swap to PDF to Text" },
}

export function ToolSwapper() {
    const pathname = usePathname()
    // Current tool slug is usually the pathname minus the leading slash
    const currentTool = pathname?.replace(/^\//, "")

    const swapInfo = currentTool ? SWAP_PAIRS[currentTool] : null

    if (!swapInfo) return null

    return (
        <div className="flex justify-center mb-8">
            <Button
                variant="outline"
                size="lg"
                className="group rounded-full border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-all font-medium"
                asChild
            >
                <Link href={`/${swapInfo.target}`}>
                    <ArrowRightLeft className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    {swapInfo.label}
                </Link>
            </Button>
        </div>
    )
}

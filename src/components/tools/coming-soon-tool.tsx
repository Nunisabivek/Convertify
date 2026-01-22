"use client"

import { Button } from "@/components/ui/button"
import { Construction } from "lucide-react"
import Link from "next/link"

import { ToolSwapper } from "@/components/tools/tool-swapper"

export function ComingSoonTool() {
    return (
        <>
            <ToolSwapper />
            <div className="w-full max-w-4xl mx-auto p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 text-center space-y-6">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600">
                    <Construction className="w-10 h-10" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-800">Tool Under Construction</h3>
                    <p className="text-slate-600 mt-2 max-w-lg mx-auto">
                        We're currently building this feature to make it perfect for you.
                        It will be available very soon!
                    </p>
                </div>
                <div className="pt-4">
                    <Button asChild>
                        <Link href="/all-tools">Explore Other Tools</Link>
                    </Button>
                </div>
            </div>
        </>
    )
}

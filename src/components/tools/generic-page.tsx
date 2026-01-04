"use client"

import { ComingSoon } from "@/components/layout/coming-soon"
import { usePathname } from "next/navigation"

export default function GenericToolPage() {
    const pathname = usePathname()
    const toolName = pathname?.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    return (
        <ComingSoon
            title={`${toolName} - Coming Soon`}
            description={`We are currently building the ${toolName} tool. It will be available shortly!`}
        />
    )
}

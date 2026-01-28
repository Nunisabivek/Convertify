"use client"

import Link from "next/link"
import {
    FileStack,
    Scissors,
    Minimize2,
    Image as ImageIcon,
    FileImage,
    FileText,
    Sheet,
    Presentation,
    FilePenLine,
    Signature,
    Droplet,
    RotateCw,
    Lock,
    LockOpen,
    Grid3x3,
    FileCheck,
    FileSearch,
    FileMinus2,
    Crop,
    Hash,
    Code,
    WandSparkles,
    ScanLine,
    LucideIcon,
} from "lucide-react"

interface ToolLink {
    title: string
    href: string
    icon: LucideIcon
    color: string
    description: string
}

// Complete list of all 29 tools for 1-click access
const allToolLinks: ToolLink[] = [
    // Organize PDF
    { title: "Merge PDF", href: "/merge-pdf", icon: FileStack, color: "text-red-500", description: "Combine multiple PDFs into one" },
    { title: "Split PDF", href: "/split-pdf", icon: Scissors, color: "text-blue-500", description: "Extract pages from PDF" },
    { title: "Organize PDF", href: "/organize-pdf", icon: Grid3x3, color: "text-violet-500", description: "Rearrange & delete pages" },
    { title: "Rotate PDF", href: "/rotate-pdf", icon: RotateCw, color: "text-pink-500", description: "Rotate PDF pages" },

    // Optimize PDF
    { title: "Compress PDF", href: "/compress-pdf", icon: Minimize2, color: "text-green-500", description: "Reduce PDF file size" },
    { title: "Repair PDF", href: "/repair-pdf", icon: WandSparkles, color: "text-amber-500", description: "Fix corrupted PDFs" },
    { title: "OCR PDF", href: "/ocr-pdf", icon: ScanLine, color: "text-teal-500", description: "Extract text from scanned PDFs" },

    // Convert from PDF
    { title: "PDF to Word", href: "/pdf-to-word", icon: FileText, color: "text-blue-600", description: "Convert PDF to DOCX" },
    { title: "PDF to Excel", href: "/pdf-to-excel", icon: Sheet, color: "text-emerald-600", description: "Extract tables to spreadsheet" },
    { title: "PDF to PowerPoint", href: "/pdf-to-powerpoint", icon: Presentation, color: "text-orange-500", description: "Convert PDF to PPTX" },
    { title: "PDF to JPG", href: "/pdf-to-jpg", icon: FileImage, color: "text-yellow-500", description: "Convert PDF pages to images" },
    { title: "PDF to PNG", href: "/pdf-to-png", icon: FileImage, color: "text-cyan-500", description: "High-quality PNG images" },
    { title: "PDF to Text", href: "/pdf-to-text", icon: FileText, color: "text-slate-500", description: "Extract text content" },

    // Convert to PDF
    { title: "Word to PDF", href: "/word-to-pdf", icon: FileText, color: "text-indigo-600", description: "DOC/DOCX to PDF" },
    { title: "Excel to PDF", href: "/excel-to-pdf", icon: Sheet, color: "text-green-600", description: "Spreadsheet to PDF" },
    { title: "PowerPoint to PDF", href: "/powerpoint-to-pdf", icon: Presentation, color: "text-orange-600", description: "PPTX to PDF" },
    { title: "JPG to PDF", href: "/jpg-to-pdf", icon: ImageIcon, color: "text-purple-500", description: "Images to PDF" },
    { title: "PNG to PDF", href: "/png-to-pdf", icon: ImageIcon, color: "text-emerald-500", description: "PNG images to PDF" },
    { title: "Text to PDF", href: "/text-to-pdf", icon: FileText, color: "text-slate-600", description: "TXT files to PDF" },
    { title: "HTML to PDF", href: "/html-to-pdf", icon: Code, color: "text-rose-500", description: "Web pages to PDF" },

    // Edit PDF
    { title: "Edit PDF", href: "/edit-pdf", icon: FilePenLine, color: "text-purple-600", description: "Add text & annotations" },
    { title: "Sign PDF", href: "/sign-pdf", icon: Signature, color: "text-indigo-500", description: "E-sign documents" },
    { title: "Watermark PDF", href: "/watermark-pdf", icon: Droplet, color: "text-sky-500", description: "Add watermarks" },
    { title: "Add Page Numbers", href: "/add-page-numbers", icon: Hash, color: "text-fuchsia-500", description: "Number PDF pages" },
    { title: "Crop PDF", href: "/crop-pdf", icon: Crop, color: "text-lime-600", description: "Trim PDF pages" },

    // Security
    { title: "Protect PDF", href: "/protect-pdf", icon: Lock, color: "text-red-600", description: "Password protect" },
    { title: "Unlock PDF", href: "/unlock-pdf", icon: LockOpen, color: "text-green-600", description: "Remove password" },
    { title: "Redact PDF", href: "/redact-pdf", icon: FileMinus2, color: "text-yellow-600", description: "Blackout sensitive info" },

    // Advanced
    { title: "Compare PDF", href: "/compare-pdf", icon: FileSearch, color: "text-cyan-600", description: "Find differences" },
    { title: "PDF to PDF/A", href: "/pdf-to-pdfa", icon: FileCheck, color: "text-emerald-600", description: "Archival format" },
]

interface InternalLinkMapProps {
    excludeTools?: string[] // Array of hrefs to exclude (e.g., current page)
    maxItems?: number // Maximum number of tools to show
    title?: string
}

export function InternalLinkMap({
    excludeTools = [],
    maxItems,
    title = "All PDF Tools • 1-Click Access"
}: InternalLinkMapProps) {
    const filteredTools = allToolLinks.filter(tool => !excludeTools.includes(tool.href))
    const displayTools = maxItems ? filteredTools.slice(0, maxItems) : filteredTools

    return (
        <section className="w-full py-10 bg-gradient-to-b from-slate-50 to-white border-t">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-6 flex items-center justify-center gap-2">
                    <Grid3x3 className="w-6 h-6 text-indigo-600" />
                    {title}
                </h2>
                <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto">
                    Quick access to all {allToolLinks.length} PDF tools. Every conversion tool is just 1-click away.
                </p>

                {/* Grid of all tools - optimized for internal linking */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {displayTools.map((tool) => (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className="group flex flex-col items-center p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
                            title={`${tool.title} - ${tool.description}`}
                        >
                            <tool.icon className={`w-6 h-6 ${tool.color} mb-2 group-hover:scale-110 transition-transform`} />
                            <span className="text-sm font-medium text-slate-800 text-center group-hover:text-indigo-600 transition-colors">
                                {tool.title}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* All Tools CTA */}
                <div className="text-center mt-8">
                    <Link
                        href="/all-tools"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                    >
                        <Grid3x3 className="w-5 h-5" />
                        View All {allToolLinks.length} Tools
                    </Link>
                </div>
            </div>
        </section>
    )
}

// Compact version for footer or sidebar
export function InternalLinkMapCompact({ excludeTools = [] }: { excludeTools?: string[] }) {
    const filteredTools = allToolLinks.filter(tool => !excludeTools.includes(tool.href))

    const categories = [
        { name: "Organize", tools: filteredTools.slice(0, 4) },
        { name: "Optimize", tools: filteredTools.slice(4, 7) },
        { name: "Convert from PDF", tools: filteredTools.slice(7, 13) },
        { name: "Convert to PDF", tools: filteredTools.slice(13, 20) },
        { name: "Edit", tools: filteredTools.slice(20, 25) },
        { name: "Security", tools: filteredTools.slice(25, 28) },
        { name: "Advanced", tools: filteredTools.slice(28) },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
                <div key={category.name}>
                    <h4 className="font-semibold text-slate-900 mb-3">{category.name}</h4>
                    <ul className="space-y-2">
                        {category.tools.map((tool) => (
                            <li key={tool.href}>
                                <Link
                                    href={tool.href}
                                    className="text-sm text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2"
                                >
                                    <tool.icon className={`w-4 h-4 ${tool.color}`} />
                                    {tool.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}

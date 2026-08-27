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
    Droplet,
    RotateCw,
    Grid3x3,
    Hash,
    Code,
    QrCode,
    Braces,
    Ruler,
    Shrink,
    FileType,
    PenLine,
    Gauge,
    UserRound,
    Eraser,
    LucideIcon,
} from "lucide-react"

interface ToolLink {
    title: string
    href: string
    icon: LucideIcon
    color: string
    description: string
}

// Only tools that actually work and are in the sitemap. The 13 "coming
// soon" placeholder tools that used to be listed here (edit-pdf, ocr-pdf,
// protect-pdf, unlock-pdf, sign-pdf, redact-pdf, crop-pdf, compare-pdf,
// repair-pdf, pdf-to-excel, pdf-to-powerpoint, powerpoint-to-pdf,
// pdf-to-pdfa) are all noindex — linking them from the homepage sent both
// crawlers and real users into dead ends. Add an entry back here only when
// its tool ships and rejoins the sitemap.
const allToolLinks: ToolLink[] = [
    // Forms & KYC (indexed unique tools — not placeholders)
    { title: "Fit to size", href: "/fit-to-size", icon: Gauge, color: "text-blue-500", description: "Hit an exact KB or MB window" },
    { title: "Passport photo", href: "/passport-photo", icon: UserRound, color: "text-indigo-500", description: "US 2×2, 630×810, visa sizes" },
    { title: "White background", href: "/remove-background", icon: Eraser, color: "text-sky-500", description: "Passport, KYC, LinkedIn headshot" },

    // Organize PDF
    { title: "Merge PDF", href: "/merge-pdf", icon: FileStack, color: "text-red-500", description: "Combine multiple PDFs into one" },
    { title: "Split PDF", href: "/split-pdf", icon: Scissors, color: "text-blue-500", description: "Extract pages from PDF" },
    { title: "Organize PDF", href: "/organize-pdf", icon: Grid3x3, color: "text-violet-500", description: "Rearrange & delete pages" },
    { title: "Rotate PDF", href: "/rotate-pdf", icon: RotateCw, color: "text-pink-500", description: "Rotate PDF pages" },
    { title: "Add Page Numbers", href: "/add-page-numbers", icon: Hash, color: "text-fuchsia-500", description: "Number PDF pages" },
    { title: "Watermark PDF", href: "/watermark-pdf", icon: Droplet, color: "text-sky-500", description: "Add a watermark" },

    // Optimize
    { title: "Compress PDF", href: "/compress-pdf", icon: Minimize2, color: "text-green-500", description: "Reduce PDF file size" },
    { title: "Compress Image", href: "/image-compressor", icon: Shrink, color: "text-lime-600", description: "Shrink JPG & PNG files" },
    { title: "Resize Image", href: "/resize-image", icon: Ruler, color: "text-amber-500", description: "Change image dimensions" },

    // Convert from PDF
    { title: "PDF to Word", href: "/pdf-to-word", icon: FileText, color: "text-blue-600", description: "Extract PDF text to DOCX" },
    { title: "PDF to JPG", href: "/pdf-to-jpg", icon: FileImage, color: "text-yellow-500", description: "Convert PDF pages to images" },
    { title: "PDF to PNG", href: "/pdf-to-png", icon: FileImage, color: "text-cyan-500", description: "High-quality PNG images" },
    { title: "PDF to Text", href: "/pdf-to-text", icon: FileText, color: "text-slate-500", description: "Extract text content" },

    // Convert to PDF
    { title: "Word to PDF", href: "/word-to-pdf", icon: FileText, color: "text-indigo-600", description: "DOCX to PDF" },
    { title: "Excel to PDF", href: "/excel-to-pdf", icon: Sheet, color: "text-green-600", description: "Spreadsheet to PDF" },
    { title: "JPG to PDF", href: "/jpg-to-pdf", icon: ImageIcon, color: "text-purple-500", description: "Images to PDF" },
    { title: "PNG to PDF", href: "/png-to-pdf", icon: ImageIcon, color: "text-emerald-500", description: "PNG images to PDF" },
    { title: "Text to PDF", href: "/text-to-pdf", icon: FileText, color: "text-slate-600", description: "TXT files to PDF" },
    { title: "HTML to PDF", href: "/html-to-pdf", icon: Code, color: "text-rose-500", description: "HTML markup to PDF" },
    { title: "Markdown to PDF", href: "/markdown-to-pdf", icon: FileType, color: "text-stone-600", description: "README & docs to PDF" },
    { title: "TIFF to PDF", href: "/tiff-to-pdf", icon: FileImage, color: "text-orange-500", description: "Multi-page scans to PDF" },

    // Images
    { title: "HEIC to JPG", href: "/heic-to-jpg", icon: ImageIcon, color: "text-teal-500", description: "iPhone photos to JPG" },
    { title: "WebP Converter", href: "/webp-converter", icon: ImageIcon, color: "text-sky-600", description: "WebP to and from JPG/PNG" },
    { title: "JPG to PNG", href: "/jpg-to-png", icon: FileImage, color: "text-indigo-500", description: "Convert JPG to PNG" },
    { title: "PNG to JPG", href: "/png-to-jpg", icon: FileImage, color: "text-red-400", description: "Convert PNG to JPG" },
    { title: "BMP to JPG", href: "/bmp-to-jpg", icon: FileImage, color: "text-violet-500", description: "Shrink old bitmaps" },
    { title: "GIF to PNG", href: "/gif-to-png", icon: FileImage, color: "text-pink-500", description: "Extract GIF frames" },
    { title: "SVG to PNG", href: "/svg-to-png", icon: FileImage, color: "text-emerald-600", description: "Rasterize vector art" },

    // Data & developer tools
    { title: "CSV to JSON", href: "/csv-to-json", icon: Braces, color: "text-cyan-600", description: "Spreadsheet rows to JSON" },
    { title: "JSON to CSV", href: "/json-to-csv", icon: Sheet, color: "text-blue-500", description: "JSON to Excel & Sheets" },
    { title: "XML to JSON", href: "/xml-to-json", icon: Braces, color: "text-purple-600", description: "Convert API data" },
    { title: "Base64", href: "/base64", icon: Code, color: "text-slate-700", description: "Encode & decode Base64" },
    { title: "QR Code Generator", href: "/qr-code-generator", icon: QrCode, color: "text-neutral-800", description: "Make a QR code" },
    { title: "AutoCAD PDF Editor", href: "/autocad-pdf-editor", icon: PenLine, color: "text-amber-600", description: "Edit SHX vector text" },
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

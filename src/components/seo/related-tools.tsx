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
    Code,
    Lock,
    Unlock,
    Signature,
    Droplet,
    RotateCw,
    ScanLine,
    FileSearch,
    FileJson,
    FileSpreadsheet,
    FileCode,
    Binary,
    QrCode,
    Smartphone,
    Globe,
    Scaling,
    LucideIcon
} from "lucide-react"

interface Tool {
    title: string
    href: string
    icon: LucideIcon
    color: string
    category: string
}

const allTools: Tool[] = [
    // Organize PDF
    { title: "Merge PDF", href: "/merge-pdf", icon: FileStack, color: "bg-red-100 text-red-600", category: "organize" },
    { title: "Split PDF", href: "/split-pdf", icon: Scissors, color: "bg-orange-100 text-orange-600", category: "organize" },
    { title: "Compress PDF", href: "/compress-pdf", icon: Minimize2, color: "bg-green-100 text-green-600", category: "organize" },
    { title: "Rotate PDF", href: "/rotate-pdf", icon: RotateCw, color: "bg-pink-100 text-pink-600", category: "organize" },
    { title: "OCR PDF", href: "/ocr-pdf", icon: ScanLine, color: "bg-teal-100 text-teal-600", category: "organize" },
    // Convert from PDF
    { title: "PDF to Word", href: "/pdf-to-word", icon: FileText, color: "bg-blue-100 text-blue-600", category: "convert-from" },
    { title: "PDF to JPG", href: "/pdf-to-jpg", icon: FileImage, color: "bg-purple-100 text-purple-600", category: "convert-from" },
    { title: "PDF to PNG", href: "/pdf-to-png", icon: FileImage, color: "bg-fuchsia-100 text-fuchsia-600", category: "convert-from" },
    { title: "PDF to Excel", href: "/pdf-to-excel", icon: Sheet, color: "bg-green-100 text-green-600", category: "convert-from" },
    { title: "PDF to PowerPoint", href: "/pdf-to-powerpoint", icon: Presentation, color: "bg-orange-100 text-orange-600", category: "convert-from" },
    { title: "PDF to Text", href: "/pdf-to-text", icon: FileText, color: "bg-gray-100 text-gray-600", category: "convert-from" },
    // Convert to PDF
    { title: "Word to PDF", href: "/word-to-pdf", icon: FileText, color: "bg-indigo-100 text-indigo-600", category: "convert-to" },
    { title: "JPG to PDF", href: "/jpg-to-pdf", icon: ImageIcon, color: "bg-rose-100 text-rose-600", category: "convert-to" },
    { title: "PNG to PDF", href: "/png-to-pdf", icon: ImageIcon, color: "bg-violet-100 text-violet-600", category: "convert-to" },
    { title: "Excel to PDF", href: "/excel-to-pdf", icon: Sheet, color: "bg-emerald-100 text-emerald-600", category: "convert-to" },
    { title: "PowerPoint to PDF", href: "/powerpoint-to-pdf", icon: Presentation, color: "bg-amber-100 text-amber-600", category: "convert-to" },
    { title: "HTML to PDF", href: "/html-to-pdf", icon: Code, color: "bg-rose-100 text-rose-600", category: "convert-to" },
    { title: "Markdown to PDF", href: "/markdown-to-pdf", icon: FileText, color: "bg-violet-100 text-violet-600", category: "convert-to" },
    // Image tools
    { title: "HEIC to JPG", href: "/heic-to-jpg", icon: Smartphone, color: "bg-blue-100 text-blue-600", category: "image" },
    { title: "JPG to PNG", href: "/jpg-to-png", icon: ImageIcon, color: "bg-purple-100 text-purple-600", category: "image" },
    { title: "PNG to JPG", href: "/png-to-jpg", icon: ImageIcon, color: "bg-yellow-100 text-yellow-600", category: "image" },
    { title: "WebP Converter", href: "/webp-converter", icon: Globe, color: "bg-teal-100 text-teal-600", category: "image" },
    { title: "Image Compressor", href: "/image-compressor", icon: Minimize2, color: "bg-green-100 text-green-600", category: "image" },
    { title: "Resize Image", href: "/resize-image", icon: Scaling, color: "bg-orange-100 text-orange-600", category: "image" },
    { title: "SVG to PNG", href: "/svg-to-png", icon: FileImage, color: "bg-indigo-100 text-indigo-600", category: "image" },
    // Edit PDF
    { title: "Sign PDF", href: "/sign-pdf", icon: Signature, color: "bg-cyan-100 text-cyan-600", category: "edit" },
    { title: "Protect PDF", href: "/protect-pdf", icon: Lock, color: "bg-slate-100 text-slate-600", category: "edit" },
    { title: "Unlock PDF", href: "/unlock-pdf", icon: Unlock, color: "bg-lime-100 text-lime-600", category: "edit" },
    { title: "Watermark PDF", href: "/watermark-pdf", icon: Droplet, color: "bg-blue-100 text-blue-600", category: "edit" },
    // Advanced
    { title: "Compare PDF", href: "/compare-pdf", icon: FileSearch, color: "bg-cyan-100 text-cyan-600", category: "advanced" },
    // Developer tools
    { title: "CSV to JSON", href: "/csv-to-json", icon: FileJson, color: "bg-emerald-100 text-emerald-600", category: "developer" },
    { title: "JSON to CSV", href: "/json-to-csv", icon: FileSpreadsheet, color: "bg-blue-100 text-blue-600", category: "developer" },
    { title: "XML to JSON", href: "/xml-to-json", icon: FileCode, color: "bg-orange-100 text-orange-600", category: "developer" },
    { title: "Base64", href: "/base64", icon: Binary, color: "bg-gray-100 text-gray-600", category: "developer" },
    { title: "QR Code Generator", href: "/qr-code-generator", icon: QrCode, color: "bg-slate-100 text-slate-600", category: "developer" },
]

// Map tool paths to categories for contextual recommendations
function getToolCategory(toolHref: string): string {
    return allTools.find(t => t.href === toolHref)?.category || "organize"
}

interface RelatedToolsProps {
    currentTool: string
    limit?: number
}

export function RelatedTools({ currentTool, limit = 4 }: RelatedToolsProps) {
    const currentCategory = getToolCategory(currentTool)

    // First show tools from same category, then popular tools from other categories
    const relatedTools = allTools
        .filter(tool => tool.href !== currentTool)
        .sort((a, b) => {
            const aMatch = a.category === currentCategory ? 0 : 1
            const bMatch = b.category === currentCategory ? 0 : 1
            return aMatch - bMatch
        })
        .slice(0, limit)

    return (
        <section className="w-full max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                Other Tools You Might Need
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedTools.map((tool) => (
                    <Link
                        key={tool.href}
                        href={tool.href}
                        className="group flex flex-col items-center p-4 bg-white rounded-xl border border-slate-100 hover:shadow-lg hover:border-indigo-200 transition-all"
                    >
                        <div className={`p-3 rounded-xl ${tool.color} mb-3 group-hover:scale-110 transition-transform`}>
                            <tool.icon className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 text-center group-hover:text-indigo-600 transition-colors">
                            {tool.title}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    )
}

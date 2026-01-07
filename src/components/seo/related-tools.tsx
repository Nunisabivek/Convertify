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
    LucideIcon
} from "lucide-react"

interface Tool {
    title: string
    href: string
    icon: LucideIcon
    color: string
}

const allTools: Tool[] = [
    { title: "Merge PDF", href: "/merge-pdf", icon: FileStack, color: "bg-red-100 text-red-600" },
    { title: "Split PDF", href: "/split-pdf", icon: Scissors, color: "bg-blue-100 text-blue-600" },
    { title: "Compress PDF", href: "/compress-pdf", icon: Minimize2, color: "bg-green-100 text-green-600" },
    { title: "JPG to PDF", href: "/jpg-to-pdf", icon: ImageIcon, color: "bg-purple-100 text-purple-600" },
    { title: "PNG to PDF", href: "/png-to-pdf", icon: ImageIcon, color: "bg-emerald-100 text-emerald-600" },
    { title: "Word to PDF", href: "/word-to-pdf", icon: FileText, color: "bg-indigo-100 text-indigo-600" },
    { title: "Excel to PDF", href: "/excel-to-pdf", icon: Sheet, color: "bg-green-100 text-green-600" },
    { title: "PowerPoint to PDF", href: "/powerpoint-to-pdf", icon: Presentation, color: "bg-orange-100 text-orange-600" },
    { title: "PDF to JPG", href: "/pdf-to-jpg", icon: FileImage, color: "bg-yellow-100 text-yellow-600" },
    { title: "PDF to PNG", href: "/pdf-to-png", icon: FileImage, color: "bg-cyan-100 text-cyan-600" },
    { title: "PDF to Text", href: "/pdf-to-text", icon: FileText, color: "bg-gray-100 text-gray-600" },
    { title: "Text to PDF", href: "/text-to-pdf", icon: FileText, color: "bg-slate-100 text-slate-600" },
]

interface RelatedToolsProps {
    currentTool: string
    limit?: number
}

export function RelatedTools({ currentTool, limit = 4 }: RelatedToolsProps) {
    const relatedTools = allTools
        .filter(tool => tool.href !== currentTool)
        .slice(0, limit)

    return (
        <section className="w-full max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                Other PDF Tools You Might Need
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

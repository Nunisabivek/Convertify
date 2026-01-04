import Link from "next/link"
import {
    FileText,
    Scissors,
    Merge,
    Minimize2,
    Image as ImageIcon,
    FileType,
    Presentation,
    Sheet,
    ArrowRight
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"

const tools = [
    {
        category: "Organize PDF",
        items: [
            {
                title: "Merge PDF",
                description: "Combine multiple PDFs into one unified document.",
                icon: Merge,
                href: "/merge-pdf",
                color: "text-indigo-600 bg-indigo-50",
            },
            {
                title: "Split PDF",
                description: "Extract pages or split your PDF into multiple files.",
                icon: Scissors,
                href: "/split-pdf",
                color: "text-blue-600 bg-blue-50",
            },
            {
                title: "Compress PDF",
                description: "Reduce file size while maintaining good quality.",
                icon: Minimize2,
                href: "/compress-pdf",
                color: "text-orange-600 bg-orange-50",
            },
        ]
    },
    {
        category: "Convert to PDF",
        items: [
            {
                title: "JPG to PDF",
                description: "Convert JPG images to PDF.",
                icon: ImageIcon,
                href: "/jpg-to-pdf",
                color: "text-purple-600 bg-purple-50",
            },
            {
                title: "PNG to PDF",
                description: "Convert PNG images to PDF.",
                icon: ImageIcon,
                href: "/png-to-pdf",
                color: "text-emerald-600 bg-emerald-50",
            },
            {
                title: "Word to PDF",
                description: "Convert DOCX to PDF.",
                icon: FileText,
                href: "/word-to-pdf",
                color: "text-blue-600 bg-blue-50",
            },
            {
                title: "Excel to PDF",
                description: "Convert Spreadsheets to PDF.",
                icon: Sheet,
                href: "/excel-to-pdf",
                color: "text-green-600 bg-green-50",
            },
            {
                title: "PowerPoint to PDF",
                description: "Convert PPTX to PDF.",
                icon: Presentation,
                href: "/powerpoint-to-pdf",
                color: "text-red-600 bg-red-50",
            },
            {
                title: "Text to PDF",
                description: "Convert TXT files to PDF.",
                icon: FileText,
                href: "/text-to-pdf",
                color: "text-slate-600 bg-slate-50",
            },
        ]
    },
    {
        category: "Convert from PDF",
        items: [
            {
                title: "PDF to JPG",
                description: "Convert PDF pages to JPG images.",
                icon: FileType,
                href: "/pdf-to-jpg",
                color: "text-yellow-600 bg-yellow-50",
            },
            {
                title: "PDF to PNG",
                description: "Convert PDF pages to PNG images.",
                icon: FileType,
                href: "/pdf-to-png",
                color: "text-cyan-600 bg-cyan-50",
            },
            {
                title: "PDF to Text",
                description: "Extract text content from PDF.",
                icon: FileText,
                href: "/pdf-to-text",
                color: "text-gray-600 bg-gray-50",
            },
        ]
    }
]

export default function AllToolsPage() {
    return (
        <div className="container py-12 space-y-16">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">All PDF Tools</h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                    Make use of our collection of PDF tools to process your digital documents.
                </p>
                <div className="pt-8 flex justify-center">
                    <AdBanner variant="rectangle" />
                </div>
            </div>

            <div className="space-y-12">
                {tools.map((section) => (
                    <div key={section.category} className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">{section.category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {section.items.map((tool) => (
                                <Link key={tool.title} href={tool.href} className="group">
                                    <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 border-slate-200">
                                        <CardHeader>
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${tool.color}`}>
                                                <tool.icon className="w-6 h-6" />
                                            </div>
                                            <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">
                                                {tool.title}
                                            </CardTitle>
                                            <CardDescription className="text-base pt-2">
                                                {tool.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Use Tool <ArrowRight className="ml-1 w-4 h-4" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

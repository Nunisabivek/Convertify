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
    ArrowRight,
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
    FileStack,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "All PDF Tools | Convertify",
    description: "Browse our complete collection of 30+ free PDF tools. Merge, split, compress, convert, and edit PDFs online with privacy-first client-side processing.",
    keywords: ["pdf tools list", "all pdf converters", "free pdf tools", "online pdf editor", "convertify tools"],
    alternates: {
        canonical: "/all-tools",
    },
}

const tools = [
    {
        category: "Organize PDF",
        items: [
            { title: "Merge PDF", description: "Combine multiple PDFs into one unified document.", icon: FileStack, href: "/merge-pdf", color: "text-red-600 bg-red-50" },
            { title: "Split PDF", description: "Extract pages or split your PDF into multiple files.", icon: Scissors, href: "/split-pdf", color: "text-blue-600 bg-blue-50" },
            { title: "Organize PDF", description: "Reorder, rotate, and organize PDF pages.", icon: Grid3x3, href: "/organize-pdf", color: "text-violet-600 bg-violet-50" },
            { title: "Rotate PDF", description: "Rotate your PDF pages as needed.", icon: RotateCw, href: "/rotate-pdf", color: "text-pink-600 bg-pink-50" },
        ]
    },
    {
        category: "Optimize PDF",
        items: [
            { title: "Compress PDF", description: "Reduce file size while maintaining good quality.", icon: Minimize2, href: "/compress-pdf", color: "text-green-600 bg-green-50" },
            { title: "Repair PDF", description: "Fix corrupted PDF files automatically.", icon: WandSparkles, href: "/repair-pdf", color: "text-amber-600 bg-amber-50" },
            { title: "OCR PDF", description: "Extract text from scanned PDFs.", icon: ScanLine, href: "/ocr-pdf", color: "text-teal-600 bg-teal-50" },
        ]
    },
    {
        category: "Convert from PDF",
        items: [
            { title: "PDF to Word", description: "Convert PDF to editable DOCX documents.", icon: FileText, href: "/pdf-to-word", color: "text-blue-600 bg-blue-50" },
            { title: "PDF to Excel", description: "Extract data from PDF to spreadsheets.", icon: Sheet, href: "/pdf-to-excel", color: "text-green-600 bg-green-50" },
            { title: "PDF to PowerPoint", description: "Convert PDF to editable presentations.", icon: Presentation, href: "/pdf-to-powerpoint", color: "text-orange-600 bg-orange-50" },
            { title: "PDF to JPG", description: "Convert PDF pages to JPG images.", icon: ImageIcon, href: "/pdf-to-jpg", color: "text-yellow-600 bg-yellow-50" },
            { title: "PDF to PNG", description: "Convert PDF pages to PNG images.", icon: ImageIcon, href: "/pdf-to-png", color: "text-cyan-600 bg-cyan-50" },
            { title: "PDF to Text", description: "Extract text content from PDF.", icon: FileText, href: "/pdf-to-text", color: "text-gray-600 bg-gray-50" },
        ]
    },
    {
        category: "Convert to PDF",
        items: [
            { title: "Word to PDF", description: "Convert DOCX to PDF.", icon: FileText, href: "/word-to-pdf", color: "text-indigo-600 bg-indigo-50" },
            { title: "Excel to PDF", description: "Convert Spreadsheets to PDF.", icon: Sheet, href: "/excel-to-pdf", color: "text-green-600 bg-green-50" },
            { title: "PowerPoint to PDF", description: "Convert PPTX to PDF.", icon: Presentation, href: "/powerpoint-to-pdf", color: "text-orange-600 bg-orange-50" },
            { title: "JPG to PDF", description: "Convert JPG images to PDF.", icon: ImageIcon, href: "/jpg-to-pdf", color: "text-purple-600 bg-purple-50" },
            { title: "PNG to PDF", description: "Convert PNG images to PDF.", icon: ImageIcon, href: "/png-to-pdf", color: "text-emerald-600 bg-emerald-50" },
            { title: "Text to PDF", description: "Convert TXT files to PDF.", icon: FileText, href: "/text-to-pdf", color: "text-slate-600 bg-slate-50" },
            { title: "HTML to PDF", description: "Convert web pages and HTML to PDF.", icon: Code, href: "/html-to-pdf", color: "text-rose-600 bg-rose-50" },
        ]
    },
    {
        category: "Edit PDF",
        items: [
            { title: "Edit PDF", description: "Add text, images and annotations to PDF.", icon: FilePenLine, href: "/edit-pdf", color: "text-purple-600 bg-purple-50" },
            { title: "Sign PDF", description: "Add electronic signatures to your PDF.", icon: Signature, href: "/sign-pdf", color: "text-indigo-600 bg-indigo-50" },
            { title: "Watermark PDF", description: "Add text or image watermarks to PDF.", icon: Droplet, href: "/watermark-pdf", color: "text-sky-600 bg-sky-50" },
            { title: "Add Page Numbers", description: "Insert page numbers to your PDF.", icon: Hash, href: "/add-page-numbers", color: "text-fuchsia-600 bg-fuchsia-50" },
            { title: "Crop PDF", description: "Trim and crop PDF pages easily.", icon: Crop, href: "/crop-pdf", color: "text-lime-600 bg-lime-50" },
        ]
    },
    {
        category: "Security",
        items: [
            { title: "Protect PDF", description: "Add password protection to your PDF.", icon: Lock, href: "/protect-pdf", color: "text-red-600 bg-red-50" },
            { title: "Unlock PDF", description: "Remove password from protected PDF.", icon: LockOpen, href: "/unlock-pdf", color: "text-green-600 bg-green-50" },
            { title: "Redact PDF", description: "Remove sensitive information from PDF.", icon: FileMinus2, href: "/redact-pdf", color: "text-yellow-600 bg-yellow-50" },
        ]
    },
    {
        category: "Advanced Tools",
        items: [
            { title: "Compare PDF", description: "Find differences between two PDFs.", icon: FileSearch, href: "/compare-pdf", color: "text-cyan-600 bg-cyan-50" },
            { title: "PDF to PDF/A", description: "Convert to archival PDF/A format.", icon: FileCheck, href: "/pdf-to-pdfa", color: "text-emerald-600 bg-emerald-50" },
        ]
    }
]

const totalTools = tools.reduce((sum, cat) => sum + cat.items.length, 0)

export default function AllToolsPage() {
    return (
        <div className="container py-12 space-y-16">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">All PDF Tools ({totalTools}+)</h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                    Every tool you need to work with PDFs in one place. All completely free.
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

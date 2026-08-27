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
    QrCode,
    Braces,
    Ruler,
    Shrink,
    PenLine,
    FileImage,
    Gauge,
    UserRound,
    Eraser,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { Metadata } from "next"
import { IS_MOBILE_BUILD } from "@/lib/is-mobile-build"
import { MobileToolsDashboard } from "@/components/mobile"

export const metadata: Metadata = {
    title: "All Free PDF Tools | Convertify - No Pricing, No Download, 100% Free",
    description: "Browse 30+ free PDF tools from Convertify. Merge, split, compress, convert PDF to Word and images online. No download, no registration, and no file limits.",
    keywords: ["convertify tools", "free pdf tools", "pdf tools list", "all pdf converters", "online pdf editor", "pdf to images converter online"],
    alternates: {
        canonical: "https://convertify.work/all-tools",
    },
}

// `comingSoon` tools have no working implementation yet. They render as a
// greyed-out card with a badge instead of a link, so visitors don't click
// through to a dead page and crawlers don't follow links into noindex
// placeholders. Drop the flag when the tool actually ships.
interface Tool {
    title: string
    description: string
    icon: typeof FileText
    href: string
    color: string
    comingSoon?: boolean
}

const tools: { category: string; items: Tool[] }[] = [
    {
        category: "Forms & KYC",
        items: [
            { title: "Fit to size", description: "Hit an exact KB or MB window for forms and uploads.", icon: Gauge, href: "/fit-to-size", color: "text-blue-600 bg-blue-50" },
            { title: "Passport photo", description: "US 2×2, India 630×810, visa 35×45, bank and signature.", icon: UserRound, href: "/passport-photo", color: "text-blue-600 bg-blue-50" },
            { title: "Background", description: "White backdrop for passport, KYC, and LinkedIn photos.", icon: Eraser, href: "/remove-background", color: "text-blue-600 bg-blue-50" },
        ]
    },
    {
        category: "Organize PDF",
        items: [
            { title: "Merge PDF", description: "Combine multiple PDFs into one unified document.", icon: FileStack, href: "/merge-pdf", color: "text-red-600 bg-red-50" },
            { title: "Split PDF", description: "Extract pages or split your PDF into multiple files.", icon: Scissors, href: "/split-pdf", color: "text-blue-600 bg-blue-50" },
            { title: "Organize PDF", description: "Reorder, rotate, and organize PDF pages.", icon: Grid3x3, href: "/organize-pdf", color: "text-violet-600 bg-violet-50" },
            { title: "Rotate PDF", description: "Rotate your PDF pages as needed.", icon: RotateCw, href: "/rotate-pdf", color: "text-pink-600 bg-pink-50" },
            { title: "Add Page Numbers", description: "Insert page numbers into your PDF.", icon: Hash, href: "/add-page-numbers", color: "text-fuchsia-600 bg-fuchsia-50" },
            { title: "Watermark PDF", description: "Stamp text or an image across every page.", icon: Droplet, href: "/watermark-pdf", color: "text-sky-600 bg-sky-50" },
        ]
    },
    {
        category: "Optimize",
        items: [
            { title: "Compress PDF", description: "100KB, 200KB, 10MB, or Gmail’s 25MB cap.", icon: Minimize2, href: "/compress-pdf", color: "text-green-600 bg-green-50" },
            { title: "Compress Image", description: "Shrink JPG and PNG files without visible loss.", icon: Shrink, href: "/image-compressor", color: "text-lime-600 bg-lime-50" },
            { title: "Resize Image", description: "Change image dimensions to an exact size.", icon: Ruler, href: "/resize-image", color: "text-amber-600 bg-amber-50" },
        ]
    },
    {
        category: "Convert from PDF",
        items: [
            { title: "PDF to Word", description: "Pull the text out of a PDF into an editable DOCX.", icon: FileText, href: "/pdf-to-word", color: "text-blue-600 bg-blue-50" },
            { title: "PDF to JPG", description: "Convert PDF pages to JPG images.", icon: ImageIcon, href: "/pdf-to-jpg", color: "text-yellow-600 bg-yellow-50" },
            { title: "PDF to PNG", description: "Convert PDF pages to PNG images.", icon: ImageIcon, href: "/pdf-to-png", color: "text-cyan-600 bg-cyan-50" },
            { title: "PDF to Text", description: "Extract plain text content from a PDF.", icon: FileText, href: "/pdf-to-text", color: "text-gray-600 bg-gray-50" },
        ]
    },
    {
        category: "Convert to PDF",
        items: [
            { title: "Word to PDF", description: "Convert DOCX to PDF.", icon: FileText, href: "/word-to-pdf", color: "text-indigo-600 bg-indigo-50" },
            { title: "Excel to PDF", description: "Convert XLS and XLSX spreadsheets to PDF.", icon: Sheet, href: "/excel-to-pdf", color: "text-green-600 bg-green-50" },
            { title: "JPG to PDF", description: "Convert JPG images to PDF.", icon: ImageIcon, href: "/jpg-to-pdf", color: "text-purple-600 bg-purple-50" },
            { title: "PNG to PDF", description: "Convert PNG images to PDF.", icon: ImageIcon, href: "/png-to-pdf", color: "text-emerald-600 bg-emerald-50" },
            { title: "Text to PDF", description: "Convert TXT files to PDF.", icon: FileText, href: "/text-to-pdf", color: "text-slate-600 bg-slate-50" },
            { title: "HTML to PDF", description: "Paste HTML markup and get a PDF.", icon: Code, href: "/html-to-pdf", color: "text-rose-600 bg-rose-50" },
            { title: "Markdown to PDF", description: "Turn a README or notes file into a PDF.", icon: FileType, href: "/markdown-to-pdf", color: "text-stone-600 bg-stone-50" },
            { title: "TIFF to PDF", description: "Bundle multi-page TIFF scans into one PDF.", icon: FileImage, href: "/tiff-to-pdf", color: "text-orange-600 bg-orange-50" },
        ]
    },
    {
        category: "Image Tools",
        items: [
            { title: "HEIC to JPG", description: "Convert iPhone HEIC photos to JPG.", icon: ImageIcon, href: "/heic-to-jpg", color: "text-teal-600 bg-teal-50" },
            { title: "WebP Converter", description: "Convert WebP to and from JPG and PNG.", icon: ImageIcon, href: "/webp-converter", color: "text-sky-600 bg-sky-50" },
            { title: "JPG to PNG", description: "Convert JPG images to PNG.", icon: FileImage, href: "/jpg-to-png", color: "text-indigo-600 bg-indigo-50" },
            { title: "PNG to JPG", description: "Convert PNG images to JPG.", icon: FileImage, href: "/png-to-jpg", color: "text-red-600 bg-red-50" },
            { title: "BMP to JPG", description: "Convert and shrink old bitmap files.", icon: FileImage, href: "/bmp-to-jpg", color: "text-violet-600 bg-violet-50" },
            { title: "GIF to PNG", description: "Extract GIF frames as PNG images.", icon: FileImage, href: "/gif-to-png", color: "text-pink-600 bg-pink-50" },
            { title: "SVG to PNG", description: "Rasterize vector art at any resolution.", icon: FileImage, href: "/svg-to-png", color: "text-emerald-600 bg-emerald-50" },
        ]
    },
    {
        category: "Data & Developer Tools",
        items: [
            { title: "CSV to JSON", description: "Turn spreadsheet rows into JSON.", icon: Braces, href: "/csv-to-json", color: "text-cyan-600 bg-cyan-50" },
            { title: "JSON to CSV", description: "Flatten JSON into Excel-ready CSV.", icon: Sheet, href: "/json-to-csv", color: "text-blue-600 bg-blue-50" },
            { title: "XML to JSON", description: "Convert XML API responses to JSON.", icon: Braces, href: "/xml-to-json", color: "text-purple-600 bg-purple-50" },
            { title: "Base64", description: "Encode and decode Base64 text and images.", icon: Code, href: "/base64", color: "text-slate-600 bg-slate-50" },
            { title: "QR Code Generator", description: "Generate a QR code for any link or text.", icon: QrCode, href: "/qr-code-generator", color: "text-neutral-700 bg-neutral-100" },
            { title: "AutoCAD PDF Editor", description: "Edit SHX vector text inside CAD PDFs.", icon: PenLine, href: "/autocad-pdf-editor", color: "text-amber-600 bg-amber-50" },
        ]
    },
    {
        category: "In Development",
        items: [
            { title: "Edit PDF", description: "Add text, images and annotations to PDF.", icon: FilePenLine, href: "/edit-pdf", color: "text-purple-600 bg-purple-50", comingSoon: true },
            { title: "Sign PDF", description: "Add electronic signatures to your PDF.", icon: Signature, href: "/sign-pdf", color: "text-indigo-600 bg-indigo-50", comingSoon: true },
            { title: "OCR PDF", description: "Recognize text inside scanned PDFs.", icon: ScanLine, href: "/ocr-pdf", color: "text-teal-600 bg-teal-50", comingSoon: true },
            { title: "Protect PDF", description: "Add password protection to your PDF.", icon: Lock, href: "/protect-pdf", color: "text-red-600 bg-red-50", comingSoon: true },
            { title: "Unlock PDF", description: "Remove the password from a protected PDF.", icon: LockOpen, href: "/unlock-pdf", color: "text-green-600 bg-green-50", comingSoon: true },
            { title: "Redact PDF", description: "Permanently remove sensitive information.", icon: FileMinus2, href: "/redact-pdf", color: "text-yellow-600 bg-yellow-50", comingSoon: true },
            { title: "Crop PDF", description: "Trim and crop PDF page margins.", icon: Crop, href: "/crop-pdf", color: "text-lime-600 bg-lime-50", comingSoon: true },
            { title: "Repair PDF", description: "Rebuild corrupted PDF files.", icon: WandSparkles, href: "/repair-pdf", color: "text-amber-600 bg-amber-50", comingSoon: true },
            { title: "Compare PDF", description: "Find differences between two PDFs.", icon: FileSearch, href: "/compare-pdf", color: "text-cyan-600 bg-cyan-50", comingSoon: true },
            { title: "PDF to Excel", description: "Extract PDF tables into a spreadsheet.", icon: Sheet, href: "/pdf-to-excel", color: "text-green-600 bg-green-50", comingSoon: true },
            { title: "PDF to PowerPoint", description: "Convert PDF pages into slides.", icon: Presentation, href: "/pdf-to-powerpoint", color: "text-orange-600 bg-orange-50", comingSoon: true },
            { title: "PowerPoint to PDF", description: "Convert PPTX presentations to PDF.", icon: Presentation, href: "/powerpoint-to-pdf", color: "text-orange-600 bg-orange-50", comingSoon: true },
            { title: "PDF to PDF/A", description: "Convert to the PDF/A archival format.", icon: FileCheck, href: "/pdf-to-pdfa", color: "text-emerald-600 bg-emerald-50", comingSoon: true },
        ]
    }
]

const liveTools = tools.flatMap(cat => cat.items).filter(t => !t.comingSoon)
const totalTools = liveTools.length

export default function AllToolsPage() {
    if (IS_MOBILE_BUILD) {
        return <MobileToolsDashboard />
    }

    return (
        <div className="container py-12 space-y-16">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">All Free PDF Tools ({totalTools} Working Tools)</h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                    Every PDF tool you need in one place. Convertify is 100% free — no pricing tiers, no download required. Works directly in your browser.
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
                            {section.items.map((tool) => tool.comingSoon ? (
                                <Card key={tool.title} className="h-full border-slate-200 border-dashed bg-slate-50/60 opacity-70">
                                    <CardHeader>
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 grayscale ${tool.color}`}>
                                            <tool.icon className="w-6 h-6" />
                                        </div>
                                        <CardTitle className="text-xl text-slate-600 flex items-center gap-2 flex-wrap">
                                            {tool.title}
                                            <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                                                Coming soon
                                            </span>
                                        </CardTitle>
                                        <CardDescription className="text-base pt-2 text-slate-500">
                                            {tool.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-slate-400">Not available yet</div>
                                    </CardContent>
                                </Card>
                            ) : (
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

            {/* SEO Content Section - Combat thin content */}
            <section className="mt-16 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-8 md:p-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Why Choose Convertify PDF Tools?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-slate-700">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-slate-900">🔒 100% Private & Secure</h3>
                        <p className="text-sm leading-relaxed">All PDF processing happens directly in your browser using WebAssembly technology. Your files never leave your device - no uploads, no tracking, complete privacy.</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-slate-900">📱 Works on Any Device</h3>
                        <p className="text-sm leading-relaxed">Use our tools on desktop, tablet, or mobile. No app installation required - just open your browser and start working with PDFs instantly.</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-slate-900">💯 Completely Free</h3>
                        <p className="text-sm leading-relaxed">No hidden fees, no subscriptions, no sign-up required. All {totalTools}+ tools are available completely free with no watermarks on your documents.</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-slate-900">⚡ Fast Processing</h3>
                        <p className="text-sm leading-relaxed">Since everything runs locally in your browser, processing is lightning-fast. Merge, split, or compress PDFs in seconds without waiting for server uploads.</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-slate-900">🌐 Works Offline</h3>
                        <p className="text-sm leading-relaxed">Once loaded, many of our tools work without an internet connection. Perfect for working with sensitive documents on the go.</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-slate-900">🎯 Professional Quality</h3>
                        <p className="text-sm leading-relaxed">Get professional-grade results without expensive software. Our tools maintain document quality while giving you full control over output settings.</p>
                    </div>
                </div>
            </section>

            {/* Address Common Queries: Pricing, Download, Free */}
            <section className="mt-8 bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked About Convertify</h2>
                <div className="grid md:grid-cols-2 gap-6 text-slate-700">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-slate-900">💰 Is Convertify free? What about pricing?</h3>
                        <p className="text-sm leading-relaxed">Convertify has <strong>no pricing plans</strong> and is <strong>completely free</strong>. There are no subscriptions, no hidden fees, and no premium tiers. All {totalTools}+ tools are available at no cost, forever.</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-slate-900">📥 Do I need to download Convertify?</h3>
                        <p className="text-sm leading-relaxed"><strong>No download required.</strong> Convertify works entirely in your web browser. There is no desktop application to install — just visit convertify.work and start using any tool instantly on any device.</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-slate-900">🔒 Is Convertify safe for confidential documents?</h3>
                        <p className="text-sm leading-relaxed">Yes. All processing happens locally in your browser using client-side technology. Your files are never uploaded to any server, making it safe for legal, financial, and personal documents.</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-slate-900">🖼️ Can Convertify convert PDF to images?</h3>
                        <p className="text-sm leading-relaxed">Yes! Our <strong>PDF to images converter online</strong> tool lets you extract every page as high-quality JPG or PNG images at up to 300 DPI. Perfect for social media, presentations, and design work.</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

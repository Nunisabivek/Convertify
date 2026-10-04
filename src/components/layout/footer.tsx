import Link from "next/link"

// Every indexable tool page is linked from here, so every page on the site
// passes link equity to every tool. ocr-pdf and pdf-to-pdfa are deliberately
// absent: they are noindex until they do what their queries promise.
const toolColumns: { title: string; links: { href: string; label: string }[] }[] = [
    {
        title: "Organize PDF",
        links: [
            { href: "/merge-pdf", label: "Merge PDF" },
            { href: "/split-pdf", label: "Split PDF" },
            { href: "/organize-pdf", label: "Organize PDF" },
            { href: "/reorder-pdf", label: "Reorder Pages" },
            { href: "/delete-pdf-pages", label: "Delete Pages" },
            { href: "/rotate-pdf", label: "Rotate PDF" },
            { href: "/crop-pdf", label: "Crop PDF" },
            { href: "/add-page-numbers", label: "Add Page Numbers" },
        ],
    },
    {
        title: "Edit & Secure PDF",
        links: [
            { href: "/edit-pdf", label: "Edit PDF" },
            { href: "/sign-pdf", label: "Sign PDF" },
            { href: "/redact-pdf", label: "Redact PDF" },
            { href: "/watermark-pdf", label: "Watermark PDF" },
            { href: "/protect-pdf", label: "Protect PDF" },
            { href: "/unlock-pdf", label: "Unlock PDF" },
            { href: "/compare-pdf", label: "Compare PDF" },
            { href: "/repair-pdf", label: "Repair PDF" },
            { href: "/autocad-pdf-editor", label: "AutoCAD PDF Editor" },
        ],
    },
    {
        title: "Compress & Resize",
        links: [
            { href: "/compress-pdf", label: "Compress PDF" },
            { href: "/fit-to-size", label: "Fit to Exact KB/MB" },
            { href: "/image-compressor", label: "Compress Image" },
            { href: "/resize-image", label: "Resize Image" },
            { href: "/passport-photo", label: "Passport Photo" },
            { href: "/remove-background", label: "White Background" },
        ],
    },
    {
        title: "Convert from PDF",
        links: [
            { href: "/pdf-to-word", label: "PDF to Word" },
            { href: "/pdf-to-excel", label: "PDF to Excel" },
            { href: "/pdf-to-powerpoint", label: "PDF to PowerPoint" },
            { href: "/pdf-to-jpg", label: "PDF to JPG" },
            { href: "/pdf-to-png", label: "PDF to PNG" },
            { href: "/pdf-to-text", label: "PDF to Text" },
        ],
    },
    {
        title: "Convert to PDF",
        links: [
            { href: "/word-to-pdf", label: "Word to PDF" },
            { href: "/powerpoint-to-pdf", label: "PowerPoint to PDF" },
            { href: "/excel-to-pdf", label: "Excel to PDF" },
            { href: "/jpg-to-pdf", label: "JPG to PDF" },
            { href: "/png-to-pdf", label: "PNG to PDF" },
            { href: "/tiff-to-pdf", label: "TIFF to PDF" },
            { href: "/text-to-pdf", label: "Text to PDF" },
            { href: "/html-to-pdf", label: "HTML to PDF" },
            { href: "/markdown-to-pdf", label: "Markdown to PDF" },
        ],
    },
    {
        title: "Images & Data",
        links: [
            { href: "/heic-to-jpg", label: "HEIC to JPG" },
            { href: "/jpg-to-png", label: "JPG to PNG" },
            { href: "/png-to-jpg", label: "PNG to JPG" },
            { href: "/webp-converter", label: "WebP Converter" },
            { href: "/svg-to-png", label: "SVG to PNG" },
            { href: "/bmp-to-jpg", label: "BMP to JPG" },
            { href: "/gif-to-png", label: "GIF to PNG" },
            { href: "/csv-to-json", label: "CSV to JSON" },
            { href: "/json-to-csv", label: "JSON to CSV" },
            { href: "/xml-to-json", label: "XML to JSON" },
            { href: "/base64", label: "Base64" },
            { href: "/qr-code-generator", label: "QR Code Generator" },
        ],
    },
]

const toolCount = toolColumns.reduce((n, col) => n + col.links.length, 0)

const linkClass = "hover:text-indigo-600 transition-colors"

export function Footer() {
    return (
        <footer className="w-full border-t bg-slate-50 border-slate-200">
            {/* Primary Footer - Tool Categories for SEO Internal Linking */}
            <div className="container py-12 px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-6 mb-12">
                    {toolColumns.map((col) => (
                        <div key={col.title}>
                            <h4 className="font-semibold text-slate-900 mb-3 text-sm">{col.title}</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                {col.links.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className={linkClass}>{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-3 text-sm">Resources</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link href="/all-tools" className={`${linkClass} font-medium`}>All Tools</Link></li>
                            <li><Link href="/blog" className={linkClass}>Blog & Guides</Link></li>
                            <li><Link href="/about" className={linkClass}>About</Link></li>
                            <li><Link href="/pricing" className={linkClass}>Pricing</Link></li>
                            <li><Link href="/security" className={linkClass}>Security</Link></li>
                            <li><Link href="/privacy" className={linkClass}>Privacy Policy</Link></li>
                            <li><Link href="/terms" className={linkClass}>Terms</Link></li>
                            <li><Link href="/contact" className={linkClass}>Contact Us</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Brand & Copyright */}
                <div className="pt-8 border-t border-slate-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-bold text-indigo-950">Convertify</span>
                            <span className="text-sm text-slate-500">Free PDF Tools</span>
                        </div>
                        <p className="text-center text-sm text-slate-500">
                            © 2026 Convertify. All rights reserved. Made with ❤️ for everyone.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>{toolCount} Tools</span>
                            <span>•</span>
                            <span>100% Free</span>
                            <span>•</span>
                            <span>No Watermarks</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile bottom padding for fixed ad */}
            <div className="h-16 md:h-24" />
        </footer>
    )
}

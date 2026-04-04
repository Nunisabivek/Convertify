'use client';

import Link from "next/link";
import {
    FileStack,
    Scissors,
    Minimize2,
    Image as ImageIcon,
    FileImage,
    FileText,
    Sheet,
    Presentation,
    BookOpen,
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
    CheckCircle2,
    Smartphone,
    Globe,
    Scaling
} from "lucide-react";
import { InternalLinkMap } from "@/components/seo/internal-link-map";
import { AdBanner } from "@/components/ads/banner";
import { blogPosts } from "@/lib/blog-data";

// Organized tool categories like ilovePDF
const toolCategories = [
    {
        category: "Organize PDF",
        description: "Merge, split, and organize your PDFs",
        tools: [
            {
                title: "Merge PDF",
                description: "Combine multiple PDFs into one document.",
                icon: FileStack,
                color: "bg-red-100 text-red-600",
                href: "/merge-pdf",
            },
            {
                title: "Split PDF",
                description: "Separate pages from your PDF file.",
                icon: Scissors,
                color: "bg-blue-100 text-blue-600",
                href: "/split-pdf",
            },
            {
                title: "Organize PDF",
                description: "Reorder, rotate, and organize PDF pages.",
                icon: Grid3x3,
                color: "bg-violet-100 text-violet-600",
                href: "/organize-pdf",
            },
            {
                title: "Rotate PDF",
                description: "Rotate your PDF pages as needed.",
                icon: RotateCw,
                color: "bg-pink-100 text-pink-600",
                href: "/rotate-pdf",
            },
        ],
    },
    {
        category: "Optimize PDF",
        description: "Compress and enhance your PDFs",
        tools: [
            {
                title: "Compress PDF",
                description: "Reduce file size while keeping quality.",
                icon: Minimize2,
                color: "bg-green-100 text-green-600",
                href: "/compress-pdf",
            },
            {
                title: "Repair PDF",
                description: "Fix corrupted PDF files automatically.",
                icon: WandSparkles,
                color: "bg-amber-100 text-amber-600",
                href: "/repair-pdf",
            },
            {
                title: "OCR PDF",
                description: "Extract text from scanned PDFs.",
                icon: ScanLine,
                color: "bg-teal-100 text-teal-600",
                href: "/ocr-pdf",
            },
        ],
    },
    {
        category: "Convert from PDF",
        description: "Convert PDFs to other formats",
        tools: [
            {
                title: "PDF to Word",
                description: "Convert PDF to editable DOCX documents.",
                icon: FileText,
                color: "bg-blue-100 text-blue-600",
                href: "/pdf-to-word",
            },
            {
                title: "PDF to Excel",
                description: "Extract data from PDF to spreadsheets.",
                icon: Sheet,
                color: "bg-green-100 text-green-600",
                href: "/pdf-to-excel",
            },
            {
                title: "PDF to PowerPoint",
                description: "Convert PDF to editable presentations.",
                icon: Presentation,
                color: "bg-orange-100 text-orange-600",
                href: "/pdf-to-powerpoint",
            },
            {
                title: "PDF to JPG",
                description: "Convert PDF pages to JPG images.",
                icon: FileImage,
                color: "bg-yellow-100 text-yellow-600",
                href: "/pdf-to-jpg",
            },
            {
                title: "PDF to PNG",
                description: "Get high-quality PNG images from PDF.",
                icon: FileImage,
                color: "bg-cyan-100 text-cyan-600",
                href: "/pdf-to-png",
            },
            {
                title: "PDF to Text",
                description: "Extract text content from PDF files.",
                icon: FileText,
                color: "bg-gray-100 text-gray-600",
                href: "/pdf-to-text",
            },
        ],
    },
    {
        category: "Convert to PDF",
        description: "Create PDFs from other formats",
        tools: [
            {
                title: "Word to PDF",
                description: "Convert DOC and DOCX to PDF format.",
                icon: FileText,
                color: "bg-indigo-100 text-indigo-600",
                href: "/word-to-pdf",
            },
            {
                title: "Excel to PDF",
                description: "Convert spreadsheets to PDF documents.",
                icon: Sheet,
                color: "bg-green-100 text-green-600",
                href: "/excel-to-pdf",
            },
            {
                title: "PowerPoint to PDF",
                description: "Convert PPTX presentations to PDF.",
                icon: Presentation,
                color: "bg-orange-100 text-orange-600",
                href: "/powerpoint-to-pdf",
            },
            {
                title: "JPG to PDF",
                description: "Turn your JPG images into PDF.",
                icon: ImageIcon,
                color: "bg-purple-100 text-purple-600",
                href: "/jpg-to-pdf",
            },
            {
                title: "PNG to PDF",
                description: "Convert PNG images to PDF format.",
                icon: ImageIcon,
                color: "bg-emerald-100 text-emerald-600",
                href: "/png-to-pdf",
            },
            {
                title: "Text to PDF",
                description: "Convert TXT files to PDF documents.",
                icon: FileText,
                color: "bg-slate-100 text-slate-600",
                href: "/text-to-pdf",
            },
            {
                title: "HTML to PDF",
                description: "Convert web pages and HTML to PDF.",
                icon: Code,
                color: "bg-rose-100 text-rose-600",
                href: "/html-to-pdf",
            },
        ],
    },
    {
        category: "Image Tools",
        description: "Convert and optimize images",
        tools: [
            {
                title: "HEIC to JPG",
                description: "Convert iPhone HEIC photos to JPG.",
                icon: Smartphone,
                color: "bg-blue-100 text-blue-600",
                href: "/heic-to-jpg",
            },
            {
                title: "JPG to PNG",
                description: "Convert JPG images to PNG format.",
                icon: ImageIcon,
                color: "bg-purple-100 text-purple-600",
                href: "/jpg-to-png",
            },
            {
                title: "PNG to JPG",
                description: "Convert PNG images to JPG format.",
                icon: ImageIcon,
                color: "bg-yellow-100 text-yellow-600",
                href: "/png-to-jpg",
            },
            {
                title: "Image Compressor",
                description: "Compress images without losing quality.",
                icon: Minimize2,
                color: "bg-green-100 text-green-600",
                href: "/image-compressor",
            },
            {
                title: "Resize Image",
                description: "Resize images to any dimension.",
                icon: Scaling,
                color: "bg-orange-100 text-orange-600",
                href: "/resize-image",
            },
            {
                title: "WebP Converter",
                description: "Convert images to and from WebP.",
                icon: Globe,
                color: "bg-teal-100 text-teal-600",
                href: "/webp-converter",
            },
        ],
    },
    {
        category: "Edit PDF",
        description: "Modify and annotate your PDFs",
        tools: [
            {
                title: "Edit PDF",
                description: "Add text, images and annotations to PDF.",
                icon: FilePenLine,
                color: "bg-purple-100 text-purple-600",
                href: "/edit-pdf",
            },
            {
                title: "Sign PDF",
                description: "Add electronic signatures to your PDF.",
                icon: Signature,
                color: "bg-indigo-100 text-indigo-600",
                href: "/sign-pdf",
            },
            {
                title: "Watermark PDF",
                description: "Add text or image watermarks to PDF.",
                icon: Droplet,
                color: "bg-sky-100 text-sky-600",
                href: "/watermark-pdf",
            },
            {
                title: "Add Page Numbers",
                description: "Insert page numbers to your PDF.",
                icon: Hash,
                color: "bg-fuchsia-100 text-fuchsia-600",
                href: "/add-page-numbers",
            },
            {
                title: "Crop PDF",
                description: "Trim and crop PDF pages easily.",
                icon: Crop,
                color: "bg-lime-100 text-lime-600",
                href: "/crop-pdf",
            },
        ],
    },
    {
        category: "Security",
        description: "Protect and secure your PDFs",
        tools: [
            {
                title: "Protect PDF",
                description: "Add password protection to your PDF.",
                icon: Lock,
                color: "bg-red-100 text-red-600",
                href: "/protect-pdf",
            },
            {
                title: "Unlock PDF",
                description: "Remove password from protected PDF.",
                icon: LockOpen,
                color: "bg-green-100 text-green-600",
                href: "/unlock-pdf",
            },
            {
                title: "Redact PDF",
                description: "Remove sensitive information from PDF.",
                icon: FileMinus2,
                color: "bg-yellow-100 text-yellow-600",
                href: "/redact-pdf",
            },
        ],
    },
    {
        category: "Advanced Tools",
        description: "Professional PDF features",
        tools: [
            {
                title: "Compare PDF",
                description: "Find differences between two PDFs.",
                icon: FileSearch,
                color: "bg-cyan-100 text-cyan-600",
                href: "/compare-pdf",
            },
            {
                title: "PDF to PDF/A",
                description: "Convert to archival PDF/A format.",
                icon: FileCheck,
                color: "bg-emerald-100 text-emerald-600",
                href: "/pdf-to-pdfa",
            },
        ],
    },
];

// Flatten all tools for the "All Tools" page
const allTools = toolCategories.flatMap(cat => cat.tools);

export default function WebHomePage() {
    return (
        <div className="flex flex-col items-center">
            {/* Hero Section */}
            <section className="w-full pt-20 pb-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-white text-center px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
                    Convertify: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Free Online PDF Tools</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed">
                    Merge, convert, compress, and edit PDFs entirely in your browser. Your files never leave your device — 100% private, no sign-up required.
                </p>
                {/* Trust Badges - Addresses "convertify pricing" queries */}
                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100/80 text-green-700 rounded-full text-sm font-semibold border border-green-200">
                        <CheckCircle2 className="w-4 h-4" />
                        100% Free Forever
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/80 text-indigo-700 rounded-full text-sm font-semibold border border-indigo-200">
                        <Lock className="w-4 h-4" />
                        No Sign-Up Required
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100/80 text-purple-700 rounded-full text-sm font-semibold border border-purple-200">
                        <FileStack className="w-4 h-4" />
                        No Watermarks
                    </div>
                </div>
            </section>

            {/* Ad Section - Hidden on mobile for better LCP, shown after first category */}
            <div className="hidden md:flex w-full justify-center py-4 bg-white">
                <AdBanner variant="rectangle" />
            </div>

            {/* Tools Grid - Organized by Category */}
            <section className="w-full max-w-7xl px-4 pt-4 pb-16">
                {toolCategories.map((category, idx) => (
                    <div key={category.category} className={idx > 0 ? "mt-16" : ""}>
                        {/* Category Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                                {category.category}
                            </h2>
                            <p className="text-slate-600">
                                {category.description}
                            </p>
                        </div>

                        {/* Tools Grid for this category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {category.tools.map((tool) => (
                                <Link
                                    key={tool.title}
                                    href={tool.href}
                                    className="group relative flex flex-col p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:border-indigo-300/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className={`p-3.5 rounded-2xl w-14 h-14 flex items-center justify-center mb-5 ${tool.color} group-hover:scale-110 transition-transform duration-300`}>
                                        <tool.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
                                        {tool.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        {tool.description}
                                    </p>
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Ad - Only after first category for better LCP */}
                        {idx === 0 && (
                            <div className="md:hidden w-full flex justify-center mt-8">
                                <AdBanner variant="mobile-banner" />
                            </div>
                        )}
                    </div>
                ))}

                {/* View All Tools Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/all-tools"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
                    >
                        View All {allTools.length} Tools
                        <FileStack className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Latest Guides Section - NEW for SEO */}
            <section className="w-full max-w-6xl px-4 py-16">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-900 mb-3 flex items-center justify-center gap-2">
                        <BookOpen className="w-8 h-8 text-indigo-600" />
                        Latest Guides & Tutorials
                    </h2>
                    <p className="text-slate-600">
                        Learn how to get the most out of your PDF tools
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {blogPosts.slice(0, 6).map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="text-xs text-indigo-600 font-semibold uppercase mb-2">
                                    {post.category}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 mb-2 line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>{post.readingTime} min read</span>
                                    <span className="text-indigo-600 group-hover:text-indigo-700 font-medium">
                                        Read Guide →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="text-center">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        View All Guides
                        <BookOpen className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* How it Works (Simple) */}
            <section className="w-full bg-slate-50 py-16 text-center border-t">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold border-2 border-indigo-600 mb-4 shadow-sm">1</div>
                            <h4 className="text-xl font-semibold mb-2">Choose a Tool</h4>
                            <p className="text-slate-500">Select what you want to do with your file.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold border-2 border-indigo-600 mb-4 shadow-sm">2</div>
                            <h4 className="text-xl font-semibold mb-2">Upload File</h4>
                            <p className="text-slate-500">Pick your file from your computer or phone.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold border-2 border-indigo-600 mb-4 shadow-sm">3</div>
                            <h4 className="text-xl font-semibold mb-2">Download</h4>
                            <p className="text-slate-500">Get your processed file instantly.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Internal Linking Map - All Tools 1-Click Away (SEO Critical) */}
            <InternalLinkMap title="All PDF Tools • Quick Access" />

            {/* Why Convertify / Pricing FAQ Section */}
            <section className="w-full bg-white py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Convertify?</h2>
                        <p className="text-lg text-slate-600">The best things in life are free, and so are our tools.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-indigo-600" /> Secure & Private
                            </h3>
                            <p className="text-slate-600">
                                Your files are processed securely. We don't store your documents—they are automatically deleted from our servers after processing.
                            </p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-indigo-600" /> 100% Free Forever
                            </h3>
                            <p className="text-slate-600">
                                No hidden fees, no subscriptions, and no credit card required. Use all our premium features completely free of charge.
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-12">
                        <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-lg text-slate-800 mb-2">Are online PDF tools safe for confidential documents?</h4>
                                <p className="text-slate-600">Yes, Convertify is designed with privacy first. We use client-side processing, meaning your files are processed locally on your machine and never uploaded to our servers. This ensures 100% confidentiality for legal, financial, and personal documents.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg text-slate-800 mb-2">Do free PDF converters have file size limits?</h4>
                                <p className="text-slate-600">Unlike many competitors that cap file sizes at 10MB or 50MB, Convertify operates with no artificial file size limits. Because we use your browser&apos;s power for client-side conversion, you can compress or merge large PDF files as long as your device has the memory to handle them.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg text-slate-800 mb-2">Can I use PDF tools without creating an account?</h4>
                                <p className="text-slate-600">Absolutely. Convertify is a "no sign-up" platform. There is no registration, no email requirement, and no subscription fees. You can use all our premium-grade features instantly and indefinitely without ever sharing your personal information.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg text-slate-800 mb-2">How do I merge PDFs without uploading to servers?</h4>
                                <p className="text-slate-600">Simply use our "Merge PDF" tool. Our advanced technology runs logic directly in your web browser (WebAssembly/Javascript), so your files are combined locally. This is the safest way to merge sensitive documents without risk of data breaches from server-side storage.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg text-slate-800 mb-2">What is the pricing for Convertify?</h4>
                                <p className="text-slate-600">There is no pricing — Convertify is 100% free forever. Unlike Adobe Acrobat, SmallPDF, or iLovePDF that require subscriptions, Convertify has zero pricing tiers. All tools (merge, compress, convert, edit, sign) are completely free with no hidden costs. Simply open convertify.work in your browser and start using any tool instantly.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg text-slate-800 mb-2">Do I need to download Convertify?</h4>
                                <p className="text-slate-600">No download is needed. Convertify works entirely in your web browser — Chrome, Firefox, Safari, or Edge. No desktop app, no extensions, no plugins. Just visit convertify.work on any device (Windows, Mac, iPhone, Android) and use all PDF tools instantly. Your files are processed locally in your browser for maximum privacy.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}

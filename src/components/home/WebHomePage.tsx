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
    CheckCircle2
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
                    Convertify is the best iLovePDF alternative—100% free online PDF tools with client-side processing for ultimate privacy. Merge, convert, compress, or edit PDFs instantly without sign-ups, limits, or uploads.
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
                        </div>
                    </div>

                    {/* Detailed SEO Content Section */}
                    <div className="mt-20 prose prose-slate max-w-none border-t pt-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">The Best iLovePDF Alternative for Privacy-Conscious Users</h2>
                        <div className="grid md:grid-cols-2 gap-10 text-slate-600 leading-relaxed mb-12">
                            <div>
                                <p className="mb-4">
                                    Convertify was built to solve the biggest problem with online file converters: <strong>privacy</strong>. Most "free" tools require you to upload your sensitive files to their servers, where they may be stored, analyzed, or leaked. Convertify changes the game by bringing the processing power to <em>you</em>.
                                </p>
                                <p className="mb-4">
                                    Our suite of tools—including the popular <strong>Compress PDF to 100KB</strong>, <strong>Excel to PDF converter</strong>, and <strong>Word to PDF tool</strong>—runs entirely in your browser. Whether you are on Windows, macOS, or mobile, you get high-speed, secure results without a single byte ever being uploaded to our cloud.
                                </p>
                                <p>
                                    Why trust a cloud server with your legal contracts, medical records, or financial statements? With Convertify, your data stays in your RAM, processed by secure WebAssembly logic that ensures the output is as professional as it is private.
                                </p>
                            </div>
                            <div>
                                <p className="mb-4">
                                    Beyond privacy, we focus on <strong>accuracy</strong>. Our Word to PDF and Excel to PDF converters are optimized to preserve fonts, margins, and complex table layouts perfectly. No more broken spreadsheets or shifted text in your professional documents.
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Merge PDF:</strong> Combine unlimited files with zero watermarks.</li>
                                    <li><strong>Compress PDF:</strong> Shrink large files for email without losing readability.</li>
                                    <li><strong>PDF to Word:</strong> Turn scans into editable DOCX files in seconds.</li>
                                    <li><strong>Secure PDF:</strong> Add AES-256 encryption to your files locally.</li>
                                </ul>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Elevate Your PDF Productivity with No Limits</h2>
                        <div className="space-y-6 text-slate-600 leading-relaxed">
                            <p>
                                In today's digital workflow, the ability to manipulate files quickly is essential. Convertify removes the friction of traditional PDF software. No more <strong>"daily limit reached"</strong> messages or <strong>"pay to unlock"</strong> prompts. We believe that basic document tools should be accessible to everyone, everywhere, for free.
                            </p>
                            <div className="grid md:grid-cols-3 gap-6 my-10">
                                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">No Software Needed</h4>
                                    <p className="text-sm">Forget heavy installations. Convertify works directly in Chrome, Firefox, Safari, and Edge. Just bookmark and go.</p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Cross-Platform Support</h4>
                                    <p className="text-sm">Seamlessly transition from your desktop to your smartphone. Our responsive design ensures a premium experience on any screen size.</p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">High-Fidelity Output</h4>
                                    <p className="text-sm">We use the latest rendering engines to ensure that your PDF conversions maintain 100% of their original quality and formatting.</p>
                                </div>
                            </div>
                            <p>
                                Whether you are a student needing to <strong>organize research papers</strong>, a business professional <strong>signing contracts</strong>, or a developer <strong>extracting text from scans</strong>, Convertify provides the tools you need to succeed. Our <strong>OCR PDF</strong> tool uses advanced optical character recognition to make scanned images searchable, while our <strong>PDF to PDF/A</strong> tool ensures your documents are ready for long-term archiving.
                            </p>
                            <p>
                                Join thousands of users who have made the switch to a faster, safer, and more reliable PDF suite. At Convertify, we aren't just building tools; we're building a more open and secure web. Explore our full range of <strong>PDF editors, mergers, and converters</strong> today and experience the difference of client-side power.
                            </p>

                            <h3 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Complete List of PDF Capabilities</h3>
                            <p>
                                Our platform covers every aspect of document management. From <strong>adding page numbers</strong> for thesis submissions to <strong>redacting sensitive information</strong> for legal compliance, we have a specialized tool for every task. Need to <strong>rotate a scanned page</strong>? Our Rotate PDF tool makes it effortless. Want to <strong>repair a corrupted file</strong>? Our Repair PDF algorithm attempts to recover data from damaged headers and cross-reference tables.
                            </p>
                            <p>
                                Every tool is designed with a "single-click" philosophy. We value your time as much as your privacy. That's why we've eliminated splash screens, advertisements (on processing pages), and complex configuration menus. Select your tool, pick your file, and get your result. It's that simple.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

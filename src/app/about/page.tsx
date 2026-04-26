import { Metadata } from "next"
import Link from "next/link"
import { Shield, Zap, Globe, Lock, Users, Heart, FileCheck, Code2, Calendar } from "lucide-react"

export const metadata: Metadata = {
    title: "About Convertify — Privacy-First, Browser-Based PDF Tools",
    description: "Convertify is a privacy-first online PDF and file converter built by engineers who got tired of uploading sensitive documents to unknown servers. Every tool runs 100% in your browser. Meet the team and methodology behind 40+ tools used by millions.",
    alternates: { canonical: "https://convertify.work/about" },
    openGraph: {
        title: "About Convertify — Privacy-First File Tools",
        description: "How we build, test, and review every PDF and file tool on Convertify. Learn about our editorial standards, security model, and team.",
        url: "/about",
    },
}

const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "url": "https://convertify.work/about",
    "mainEntity": {
        "@type": "Organization",
        "name": "Convertify",
        "url": "https://convertify.work",
        "logo": "https://convertify.work/images/Convertify.png",
        "foundingDate": "2024-01-01",
        "description":
            "Convertify is a privacy-first, browser-based file conversion suite. Every tool processes files client-side — nothing is uploaded to any server.",
        "knowsAbout": [
            "PDF manipulation",
            "PDF compression",
            "Image conversion",
            "Document privacy",
            "Browser-based file processing",
            "Client-side cryptography",
            "AES-256 encryption",
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "email": "support@convertify.work",
            "url": "https://convertify.work/contact",
        },
    },
}

export default function AboutPage() {
    return (
        <div className="flex flex-col items-center">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
            />
            <section className="w-full py-16 bg-gradient-to-b from-indigo-50 to-white">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 text-center">
                        About Convertify
                    </h1>
                    <p className="text-xl text-slate-600 text-center max-w-2xl mx-auto mb-4">
                        Privacy-first file tools that run 100% in your browser.
                        No uploads. No servers. No compromises.
                    </p>
                    <p className="text-sm text-slate-500 text-center">
                        Last reviewed: <time dateTime="2026-04-26">April 26, 2026</time>
                    </p>
                </div>
            </section>

            <section className="w-full max-w-4xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Mission</h2>
                <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-600 mb-4">
                        Convertify was built on a simple belief: essential file tools should be free, private, and accessible to everyone.
                        Too many online converters require you to upload sensitive documents to unknown servers, create accounts,
                        or pay for basic functionality.
                    </p>
                    <p className="text-lg text-slate-600 mb-4">
                        We took a different approach. Every Convertify tool processes files directly in your web browser using
                        client-side JavaScript. Your documents — whether they contain tax information, medical records, legal contracts,
                        or personal photos — never leave your device.
                    </p>
                    <p className="text-lg text-slate-600 mb-8">
                        With 40+ tools covering PDF manipulation, image conversion, and data format transformation,
                        Convertify serves millions of users who need reliable file tools without the privacy trade-offs.
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-12">Why Convertify?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <Shield className="w-8 h-8 text-indigo-600 mb-3" />
                        <h3 className="font-bold text-slate-900 mb-2">Privacy First</h3>
                        <p className="text-slate-600 text-sm">
                            Files are processed 100% in your browser. Nothing is ever uploaded to our servers.
                            We can&apos;t see your documents because they never leave your device.
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <Zap className="w-8 h-8 text-amber-600 mb-3" />
                        <h3 className="font-bold text-slate-900 mb-2">Instant Processing</h3>
                        <p className="text-slate-600 text-sm">
                            No waiting for server uploads and downloads. Files are processed instantly
                            on your machine, regardless of file size or internet speed.
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <Globe className="w-8 h-8 text-emerald-600 mb-3" />
                        <h3 className="font-bold text-slate-900 mb-2">Works Everywhere</h3>
                        <p className="text-slate-600 text-sm">
                            Use Convertify on Windows, Mac, Linux, iOS, Android, or Chromebook.
                            Any device with a modern browser — no software to install.
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <Lock className="w-8 h-8 text-red-600 mb-3" />
                        <h3 className="font-bold text-slate-900 mb-2">No Sign-Up Required</h3>
                        <p className="text-slate-600 text-sm">
                            Every tool works immediately without creating an account,
                            providing personal information, or subscribing to anything.
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <Users className="w-8 h-8 text-blue-600 mb-3" />
                        <h3 className="font-bold text-slate-900 mb-2">No Limits</h3>
                        <p className="text-slate-600 text-sm">
                            No file size limits, no daily usage caps, no watermarks on output files.
                            Use Convertify as much as you need, completely free.
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <Heart className="w-8 h-8 text-pink-600 mb-3" />
                        <h3 className="font-bold text-slate-900 mb-2">Built for Everyone</h3>
                        <p className="text-slate-600 text-sm">
                            Students, professionals, small businesses, and anyone who needs file tools
                            but shouldn&apos;t have to pay for basic conversions.
                        </p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-6">How It Works</h2>
                <div className="bg-indigo-50 rounded-xl p-8 mb-12">
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0">1</span>
                            <div>
                                <h3 className="font-bold text-slate-900">Choose a tool</h3>
                                <p className="text-slate-600">Pick from 40+ tools for PDFs, images, and data files.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0">2</span>
                            <div>
                                <h3 className="font-bold text-slate-900">Select your files</h3>
                                <p className="text-slate-600">Drag and drop or browse. Files stay in your browser — nothing is uploaded.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0">3</span>
                            <div>
                                <h3 className="font-bold text-slate-900">Download the result</h3>
                                <p className="text-slate-600">Processing happens instantly. Download your converted files right away.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Tools</h2>
                <p className="text-lg text-slate-600 mb-6">
                    Convertify offers a comprehensive suite of tools across multiple categories:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-12">
                    <div className="p-4 bg-white rounded-lg border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-2">PDF Tools</h3>
                        <p className="text-sm text-slate-600">Merge, split, compress, rotate, edit, sign, protect, watermark, compare, and convert PDFs.</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-2">Image Converters</h3>
                        <p className="text-sm text-slate-600">Convert between JPG, PNG, WebP, HEIC, SVG, BMP, GIF, and TIFF formats. Compress and resize images.</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-2">Document Converters</h3>
                        <p className="text-sm text-slate-600">Convert Word, Excel, PowerPoint, HTML, and Markdown to and from PDF.</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-2">Developer & Data Tools</h3>
                        <p className="text-sm text-slate-600">CSV to JSON, JSON to CSV, XML to JSON, Base64 encoder/decoder, QR code generator.</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-12">Our Editorial &amp; Testing Methodology</h2>
                <div className="bg-white rounded-xl border border-slate-200 p-6 mb-12 space-y-4 text-slate-600">
                    <div className="flex gap-3">
                        <FileCheck className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-slate-900">Real-document testing</h3>
                            <p>
                                Every tool is tested on real artifacts before it ships: actual government forms (visa, passport, EPF),
                                large scanned PDFs, design exports from Figma and Sketch, and source code files. We don&apos;t just test the
                                happy path — we test 100MB PDFs, multi-language OCR, password-protected files, and broken inputs.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Code2 className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-slate-900">Open-source libraries we trust</h3>
                            <p>
                                Convertify is built on battle-tested open-source: <strong>pdf-lib</strong> for PDF construction,
                                <strong> pdf.js</strong> (Mozilla) for rendering, <strong>WebAssembly</strong> ports of libvips for image processing,
                                and <strong>Web Crypto API</strong> for AES-256 encryption. No proprietary black boxes.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-slate-900">Security model</h3>
                            <p>
                                We have no servers that touch your files. Period. Open your browser&apos;s DevTools → Network tab on any
                                Convertify tool — you&apos;ll see analytics requests but never a request that uploads your file. That&apos;s the
                                threat model: even if Convertify itself were compromised, your documents would still be safe because
                                they only exist on your device.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Calendar className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-slate-900">Reviewed every quarter</h3>
                            <p>
                                Every tool page and editorial guide has a <em>Last reviewed</em> date. We re-test workflows on the current
                                browser versions and update steps when interfaces or libraries change. If something stops working, please
                                let us know at <a href="mailto:support@convertify.work" className="text-indigo-600 hover:underline">support@convertify.work</a>.
                            </p>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-6">Who Writes Convertify</h2>
                <div className="bg-indigo-50 rounded-xl p-6 mb-12">
                    <p className="text-slate-700 leading-relaxed mb-3">
                        Convertify&apos;s editorial team is a small group of engineers and writers who use these tools daily on their own
                        documents. Every guide is written by someone who has actually hit the problem they&apos;re solving — usually because
                        they got rejected by a government portal or stuck on a 100MB email attachment.
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                        Reach the team at{" "}
                        <a href="mailto:support@convertify.work" className="text-indigo-600 font-semibold hover:underline">
                            support@convertify.work
                        </a>
                        {" "}or via our{" "}
                        <Link href="/contact" className="text-indigo-600 font-semibold hover:underline">
                            contact page
                        </Link>
                        . We read every message.
                    </p>
                </div>

                <div className="text-center">
                    <Link
                        href="/all-tools"
                        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Browse All Tools
                    </Link>
                </div>
            </section>
        </div>
    )
}

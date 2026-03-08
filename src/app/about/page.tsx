import { Metadata } from "next"
import Link from "next/link"
import { Shield, Zap, Globe, Lock, Users, Heart } from "lucide-react"

export const metadata: Metadata = {
    title: "About Convertify - Free Privacy-First PDF Tools",
    description: "Convertify is a free online PDF and file converter that processes everything in your browser. No uploads, no servers, no sign-up. Learn about our mission and privacy-first approach.",
    alternates: { canonical: "https://convertify.work/about" },
    openGraph: {
        title: "About Convertify - Privacy-First File Tools",
        description: "Learn about Convertify's mission to provide free, secure, browser-based file tools.",
        url: "/about",
    },
}

export default function AboutPage() {
    return (
        <div className="flex flex-col items-center">
            <section className="w-full py-16 bg-gradient-to-b from-indigo-50 to-white">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 text-center">
                        About Convertify
                    </h1>
                    <p className="text-xl text-slate-600 text-center max-w-2xl mx-auto mb-12">
                        Free, privacy-first file tools that work entirely in your browser.
                        No uploads. No servers. No compromises.
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

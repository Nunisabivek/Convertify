import Link from "next/link"
import { InternalLinkMapCompact } from "@/components/seo/internal-link-map"

export function Footer() {
    return (
        <footer className="w-full border-t bg-slate-50 border-slate-200">
            {/* Primary Footer - Tool Categories for SEO Internal Linking */}
            <div className="container py-12 px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
                    {/* Organize PDF */}
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-3 text-sm">Organize PDF</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link href="/merge-pdf" className="hover:text-indigo-600 transition-colors">Merge PDF</Link></li>
                            <li><Link href="/split-pdf" className="hover:text-indigo-600 transition-colors">Split PDF</Link></li>
                            <li><Link href="/organize-pdf" className="hover:text-indigo-600 transition-colors">Organize PDF</Link></li>
                            <li><Link href="/rotate-pdf" className="hover:text-indigo-600 transition-colors">Rotate PDF</Link></li>
                        </ul>
                    </div>

                    {/* Optimize PDF */}
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-3 text-sm">Optimize PDF</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link href="/compress-pdf" className="hover:text-indigo-600 transition-colors">Compress PDF</Link></li>
                            <li><Link href="/repair-pdf" className="hover:text-indigo-600 transition-colors">Repair PDF</Link></li>
                            <li><Link href="/ocr-pdf" className="hover:text-indigo-600 transition-colors">OCR PDF</Link></li>
                        </ul>
                    </div>

                    {/* Convert from PDF */}
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-3 text-sm">Convert from PDF</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link href="/pdf-to-word" className="hover:text-indigo-600 transition-colors">PDF to Word</Link></li>
                            <li><Link href="/pdf-to-excel" className="hover:text-indigo-600 transition-colors">PDF to Excel</Link></li>
                            <li><Link href="/pdf-to-jpg" className="hover:text-indigo-600 transition-colors">PDF to JPG</Link></li>
                            <li><Link href="/pdf-to-png" className="hover:text-indigo-600 transition-colors">PDF to PNG</Link></li>
                            <li><Link href="/pdf-to-powerpoint" className="hover:text-indigo-600 transition-colors">PDF to PPT</Link></li>
                        </ul>
                    </div>

                    {/* Convert to PDF */}
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-3 text-sm">Convert to PDF</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link href="/word-to-pdf" className="hover:text-indigo-600 transition-colors">Word to PDF</Link></li>
                            <li><Link href="/jpg-to-pdf" className="hover:text-indigo-600 transition-colors">JPG to PDF</Link></li>
                            <li><Link href="/png-to-pdf" className="hover:text-indigo-600 transition-colors">PNG to PDF</Link></li>
                            <li><Link href="/excel-to-pdf" className="hover:text-indigo-600 transition-colors">Excel to PDF</Link></li>
                            <li><Link href="/html-to-pdf" className="hover:text-indigo-600 transition-colors">HTML to PDF</Link></li>
                        </ul>
                    </div>

                    {/* Edit & Security */}
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-3 text-sm">Edit & Secure</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link href="/edit-pdf" className="hover:text-indigo-600 transition-colors">Edit PDF</Link></li>
                            <li><Link href="/sign-pdf" className="hover:text-indigo-600 transition-colors">Sign PDF</Link></li>
                            <li><Link href="/protect-pdf" className="hover:text-indigo-600 transition-colors">Protect PDF</Link></li>
                            <li><Link href="/unlock-pdf" className="hover:text-indigo-600 transition-colors">Unlock PDF</Link></li>
                            <li><Link href="/watermark-pdf" className="hover:text-indigo-600 transition-colors">Watermark</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-3 text-sm">Resources</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link href="/all-tools" className="hover:text-indigo-600 transition-colors font-medium">All Tools</Link></li>
                            <li><Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog & Guides</Link></li>
                            <li><Link href="/security" className="hover:text-indigo-600 transition-colors">Security</Link></li>
                            <li><Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link></li>
                            <li><Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact Us</Link></li>
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
                            © 2025 Convertify. All rights reserved. Made with ❤️ for everyone.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>29 Tools</span>
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

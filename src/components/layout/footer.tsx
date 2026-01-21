import Link from "next/link"

export function Footer() {
    return (
        <footer className="w-full border-t bg-slate-50 border-slate-200">
            <div className="container py-12 px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-slate-900">Convertify</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Simple, fast, and secure online PDF tools.
                            Process documents right in your browser.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Popular Tools</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link href="/merge-pdf" className="hover:text-indigo-600 transition-colors">Merge PDF</Link></li>
                            <li><Link href="/compress-pdf" className="hover:text-indigo-600 transition-colors">Compress PDF</Link></li>
                            <li><Link href="/pdf-to-word" className="hover:text-indigo-600 transition-colors">PDF to Word</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Convert</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link href="/jpg-to-pdf" className="hover:text-indigo-600 transition-colors">JPG to PDF</Link></li>
                            <li><Link href="/word-to-pdf" className="hover:text-indigo-600 transition-colors">Word to PDF</Link></li>
                            <li><Link href="/html-to-pdf" className="hover:text-indigo-600 transition-colors">HTML to PDF</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-center text-sm text-slate-500">
                        © 2025 Convertify. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

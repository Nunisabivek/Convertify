'use client'

import { useState } from "react"
import { Code, FileDown, Loader2, AlertCircle } from "lucide-react"
import { htmlToText, textToPdf } from "@/lib/text-pdf"
import { AdBanner } from "@/components/ads/banner"

export default function HtmlToPdfClient() {
    const [htmlContent, setHtmlContent] = useState("")
    const [isConverting, setIsConverting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const convertToPdf = async () => {
        if (!htmlContent) {
            setError("Please paste some HTML code")
            return
        }

        setIsConverting(true)
        setError(null)

        try {
            // Plain text with paragraph breaks; DOMParser decodes entities and never runs scripts.
            const text = htmlToText(htmlContent, (h) => new DOMParser().parseFromString(h, "text/html").body.textContent ?? "")
            const pdfBytes = await textToPdf(text)
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
            const downloadUrl = URL.createObjectURL(blob)

            const link = document.createElement("a")
            link.href = downloadUrl
            link.download = "html-content.pdf"
            link.click()
        } catch (err) {
            console.error(err)
            setError("Failed to convert HTML to PDF. Please check your input.")
        } finally {
            setIsConverting(false)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            {/* HTML Input */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Code className="w-4 h-4 inline mr-1" />
                    Paste Your HTML Code
                </label>
                <textarea
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    placeholder="<html><body><h1>Hello World</h1></body></html>"
                    rows={12}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent font-mono text-sm"
                />
            </div>

            {/* Ad Banner */}
            <div className="my-6 flex justify-center">
                <AdBanner variant="rectangle" />
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            {/* Convert Button */}
            <div className="flex justify-center">
                <button
                    onClick={convertToPdf}
                    disabled={isConverting}
                    className="px-8 py-4 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 disabled:bg-rose-300 transition-colors flex items-center gap-2 shadow-lg"
                >
                    {isConverting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Converting...
                        </>
                    ) : (
                        <>
                            <FileDown className="w-5 h-5" />
                            Convert to PDF
                        </>
                    )}
                </button>
            </div>

            {/* Info Section */}
            <div className="mt-12 p-6 bg-slate-50 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">How to Convert HTML to PDF</h3>
                <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>Paste your HTML code into the box above</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>Click Convert to PDF to generate your document</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>Your PDF will download automatically</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>All processing happens in your browser - completely secure and private</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}



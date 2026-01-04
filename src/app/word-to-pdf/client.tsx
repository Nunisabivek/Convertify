"use client"

import { useState } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { FileText, Printer, Loader2, ArrowLeft } from "lucide-react"

export default function WordToPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [htmlContent, setHtmlContent] = useState<string | null>(null)

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0) setFile(files[0])
    }

    const handleConvert = async () => {
        if (!file) return
        setIsProcessing(true)

        try {
            // Dynamic import for mammoth using CDN or check if I can 'import "mammoth"' if it was installed (it's not).
            // Since I cannot install packages, I will load it via script tag or just fetch it.
            // Actually, for a clean React implementation without npm, using a script loader is tricky.
            // I will use a simple fetch to a CDN to get the library? No, that evaluates it.
            // Best bet: use the 'mammoth' browser global.

            // Check if script exists
            if (!(window as any).mammoth) {
                const script = document.createElement("script")
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"
                script.async = true
                document.body.appendChild(script)

                await new Promise((resolve, reject) => {
                    script.onload = resolve
                    script.onerror = reject
                })
            }

            const arrayBuffer = await file.arrayBuffer()
            const result = await (window as any).mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
            setHtmlContent(result.value)

        } catch (error) {
            console.error("Conversion error:", error)
            alert("Failed to read Word file. Please try again.")
        } finally {
            setIsProcessing(false)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    if (htmlContent) {
        return (
            <div className="container py-8 max-w-4xl">
                <div className="flex items-center justify-between mb-6 no-print">
                    <Button variant="ghost" onClick={() => {
                        setFile(null)
                        setHtmlContent(null)
                    }}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Convert Another
                    </Button>
                    <div className="flex gap-4">
                        <Button size="lg" onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
                            <Printer className="mr-2 h-5 w-5" />
                            Save as PDF
                        </Button>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg mb-8 text-sm flex items-start gap-3 no-print">
                    <FileText className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                        <strong>How to Save:</strong> Your document is ready! Click "Save as PDF" and choose
                        "Save to PDF" in the print destination options.
                    </div>
                </div>

                {/* The Printable Area */}
                <div className="print-content bg-white shadow-lg p-10 md:p-20 min-h-[1000px] text-slate-900 prose prose-slate max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </div>

                <div className="mt-12 no-print">
                    <AdBanner variant="rectangle" />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 max-w-4xl px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">Word to PDF</h1>
                <p className="text-slate-500 text-lg">Convert Docx files to PDF instantly in your browser.</p>
            </div>

            {!file ? (
                <FileUploader onFilesSelected={handleFilesSelected} multiple={false} accept={{ "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] }} />
            ) : (
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border p-8 flex flex-col items-center gap-6">
                        <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                            <FileText className="w-12 h-12" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-slate-800">{file.name}</h3>
                            <p className="text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>

                        <Button size="xl" onClick={handleConvert} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto px-12">
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Convert to PDF"
                            )}
                        </Button>

                        <Button variant="ghost" onClick={() => setFile(null)} disabled={isProcessing} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            Remove File
                        </Button>
                    </div>
                    <AdBanner variant="rectangle" />
                </div>
            )}
        </div>
    )
}

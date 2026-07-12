"use client"

import { useState } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { FileText, Download, Loader2, ArrowLeft, AlertCircle } from "lucide-react"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

async function buildPdfFromText(rawText: string): Promise<Blob> {
    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontSize = 12
    const pageWidth = 595
    const pageHeight = 842
    const margin = 50
    const maxWidth = pageWidth - margin * 2

    let page = pdfDoc.addPage([pageWidth, pageHeight])
    let y = pageHeight - margin

    const newPage = () => {
        page = pdfDoc.addPage([pageWidth, pageHeight])
        y = pageHeight - margin
    }

    const paragraphs = rawText.split(/\n+/)
    for (const paragraph of paragraphs) {
        const words = paragraph.split(/\s+/).filter(Boolean)
        if (words.length === 0) {
            y -= fontSize + 6
            if (y < margin) newPage()
            continue
        }

        let line = ""
        for (const word of words) {
            const testLine = line ? `${line} ${word}` : word
            if (font.widthOfTextAtSize(testLine, fontSize) > maxWidth && line) {
                if (y < margin) newPage()
                page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) })
                y -= fontSize + 4
                line = word
            } else {
                line = testLine
            }
        }
        if (line) {
            if (y < margin) newPage()
            page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) })
            y -= fontSize + 4
        }
        y -= 8 // paragraph spacing
    }

    const bytes = await pdfDoc.save()
    return new Blob([bytes as any], { type: "application/pdf" })
}

export default function WordToPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [htmlPreview, setHtmlPreview] = useState<string | null>(null)
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0) setFile(files[0])
    }

    const handleConvert = async () => {
        if (!file) return
        setIsProcessing(true)
        setError(null)

        try {
            const mammothModule: any = await import("mammoth")
            const mammoth = mammothModule.default ?? mammothModule
            const arrayBuffer = await file.arrayBuffer()

            const [htmlResult, textResult] = await Promise.all([
                mammoth.convertToHtml({ arrayBuffer }),
                mammoth.extractRawText({ arrayBuffer }),
            ])

            const blob = await buildPdfFromText(textResult.value)
            setPdfUrl(URL.createObjectURL(blob))
            setHtmlPreview(htmlResult.value)
        } catch (err) {
            console.error("Conversion error:", err)
            setError("Failed to read this Word file. Make sure it's a valid .docx document.")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleDownload = () => {
        if (!pdfUrl || !file) return
        const link = document.createElement("a")
        link.href = pdfUrl
        link.download = file.name.replace(/\.docx$/i, "") + ".pdf"
        link.click()
    }

    if (htmlPreview) {
        return (
            <div className="container py-8 max-w-4xl">
                <div className="flex items-center justify-between mb-6 no-print">
                    <Button variant="ghost" onClick={() => {
                        setFile(null)
                        setHtmlPreview(null)
                        setPdfUrl(null)
                    }}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Convert Another
                    </Button>
                    <Button size="lg" onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
                        <Download className="mr-2 h-5 w-5" />
                        Download PDF
                    </Button>
                </div>

                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-8 text-sm flex items-start gap-3 no-print">
                    <FileText className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                        <strong>Ready!</strong> Your PDF has been generated. Click "Download PDF" to save it.
                        Preview below shows your document's text and structure.
                    </div>
                </div>

                {/* Preview only - the actual PDF is generated separately via pdf-lib */}
                <div className="print-content bg-white shadow-lg p-10 md:p-20 min-h-[1000px] text-slate-900 prose prose-slate max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: htmlPreview }} />
                </div>

                <div className="mt-12 no-print">
                    <AdBanner variant="rectangle" />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl px-4">
            {!file ? (
                <FileUploader
                    onFilesSelected={handleFilesSelected}
                    multiple={false}
                    accept={{ "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] }}
                    fileTypeLabel="Word documents (.docx)"
                    iconType="word"
                />
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

                        {error && (
                            <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

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

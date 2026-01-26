"use client"

import { useState } from "react"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { FileText, Download } from "lucide-react"

export default function TextToPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [processedUrl, setProcessedUrl] = useState<string | null>(null)

    const handleConvert = async () => {
        if (!file) return
        setIsProcessing(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 3000))
            const text = await file.text()

            const pdfDoc = await PDFDocument.create()
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
            const fontSize = 12

            let page = pdfDoc.addPage()
            const { width, height } = page.getSize()
            const margin = 50
            let y = height - margin

            const lines = text.split('\n')

            for (const line of lines) {
                if (y < margin) {
                    page = pdfDoc.addPage()
                    y = height - margin
                }
                // Very basic text wrapping/rendering
                page.drawText(line.substring(0, 90), { // Truncate for simplicity in this basic version
                    x: margin,
                    y,
                    size: fontSize,
                    font,
                    color: rgb(0, 0, 0),
                })
                y -= fontSize + 5
            }

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
            setProcessedUrl(URL.createObjectURL(blob))
        } catch (e) {
            console.error(e)
            alert("Error converting text")
        } finally {
            setIsProcessing(false)
        }
    }

    if (isProcessing) return <ProcessingWait progress={90} title="Creating PDF from Text..." />

    if (processedUrl) {
        return (
            <div className="container mx-auto py-20 max-w-2xl text-center space-y-8">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-600">
                    <Download className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-bold">PDF Created!</h1>
                <div className="flex flex-col gap-4">
                    <Button size="xl" asChild className="w-full">
                        <a href={processedUrl} download="converted.pdf">Download PDF</a>
                    </Button>
                    <AdBanner variant="rectangle" />
                    <Button variant="outline" onClick={() => { setFile(null); setProcessedUrl(null) }}>Convert More</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 max-w-4xl px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Text to PDF</h1>
                <p className="text-slate-500 text-lg">Convert plain text files (.txt) to PDF.</p>
            </div>
            {!file ? (
                <FileUploader
                    onFilesSelected={(f) => setFile(f[0])}
                    multiple={false}
                    accept={{ "text/plain": [".txt"] }}
                    fileTypeLabel="Text files (.txt)"
                    iconType="text"
                />
            ) : (
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl border text-center">
                        <p className="mb-4 font-bold">{file.name}</p>
                        <Button size="xl" onClick={handleConvert}>Convert to PDF</Button>
                    </div>
                    <AdBanner variant="rectangle" />
                </div>
            )}
        </div>
    )
}


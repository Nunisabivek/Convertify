"use client"

import { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { ImageIcon, Download } from "lucide-react"

export default function PngToPdfPage() {
    const [files, setFiles] = useState<File[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null)

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles((prev) => [...prev, ...newFiles])
    }

    const handleConvert = async () => {
        setIsProcessing(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 3000))

            const pdfDoc = await PDFDocument.create()

            for (const file of files) {
                const imageBytes = await file.arrayBuffer()
                const image = await pdfDoc.embedPng(imageBytes)
                const page = pdfDoc.addPage([image.width, image.height])
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                })
            }

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
            setProcessedPdfUrl(URL.createObjectURL(blob))
        } catch (error) {
            console.error("Error:", error)
            alert("Failed. Please ensure files are valid PNGs.")
        } finally {
            setIsProcessing(false)
        }
    }

    if (isProcessing) return <ProcessingWait progress={80} title="Converting PNGs..." />

    if (processedPdfUrl) {
        return (
            <div className="container mx-auto py-20 max-w-2xl text-center space-y-8">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <Download className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-bold">PDF Ready!</h1>
                <div className="flex flex-col gap-4">
                    <Button size="xl" asChild className="w-full">
                        <a href={processedPdfUrl} download="images.pdf">Download PDF</a>
                    </Button>
                    <AdBanner variant="rectangle" />
                    <Button variant="outline" onClick={() => { setFiles([]); setProcessedPdfUrl(null) }}>Convert More</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 max-w-4xl px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">PNG to PDF</h1>
                <p className="text-slate-500 text-lg">Convert PNG images to PDF documents.</p>
            </div>
            {files.length === 0 ? (
                <FileUploader onFilesSelected={handleFilesSelected} accept={{ "image/png": [".png"] }} />
            ) : (
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl border text-center">
                        <p className="mb-4 font-bold">{files.length} PNG files selected</p>
                        <Button size="xl" onClick={handleConvert}>Convert to PDF</Button>
                    </div>
                    <AdBanner variant="rectangle" />
                </div>
            )}
        </div>
    )
}

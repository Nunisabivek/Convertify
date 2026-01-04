"use client"

import { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { Minimize2, Download, Loader2, FileText } from "lucide-react"

export default function CompressPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null)
    const [compressionStats, setCompressionStats] = useState<{ original: number, compressed: number } | null>(null)
    const [progress, setProgress] = useState(0)

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0) setFile(files[0])
    }

    const handleCompress = async () => {
        if (!file) return
        setIsProcessing(true)
        setProgress(0)

        try {
            // Dynamic import for PDF.js
            const pdfjsLib = await import("pdfjs-dist")
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

            const arrayBuffer = await file.arrayBuffer()
            const srcPdf = await pdfjsLib.getDocument(arrayBuffer).promise
            const numPages = srcPdf.numPages

            // Create new PDF
            const newPdf = await PDFDocument.create()

            for (let i = 1; i <= numPages; i++) {
                // Render page to canvas
                const page = await srcPdf.getPage(i)
                const viewport = page.getViewport({ scale: 1.5 }) // Moderate scale for balance

                const canvas = document.createElement("canvas")
                const context = canvas.getContext("2d")
                canvas.width = viewport.width
                canvas.height = viewport.height

                if (context) {
                    await page.render({
                        canvasContext: context,
                        viewport: viewport,
                    } as any).promise

                    // Convert to JPEG with compression
                    const imgData = canvas.toDataURL("image/jpeg", 0.6) // 60% quality
                    const imgBytes = await fetch(imgData).then(res => res.arrayBuffer())

                    // Embed in new PDF
                    const jpgImage = await newPdf.embedJpg(imgBytes)
                    const newPage = newPdf.addPage([jpgImage.width, jpgImage.height])
                    newPage.drawImage(jpgImage, {
                        x: 0,
                        y: 0,
                        width: jpgImage.width,
                        height: jpgImage.height,
                    })
                }
                setProgress(Math.round((i / numPages) * 100))
            }

            const pdfBytes = await newPdf.save()
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)

            setProcessedPdfUrl(url)
            setCompressionStats({
                original: file.size,
                compressed: blob.size
            })

        } catch (error) {
            console.error("Compression error:", error)
            alert("Failed to compress PDF. Please try again.")
        } finally {
            setIsProcessing(false)
        }
    }

    if (processedPdfUrl && compressionStats) {
        const savings = Math.round(((compressionStats.original - compressionStats.compressed) / compressionStats.original) * 100)
        const isSmaller = compressionStats.compressed < compressionStats.original

        return (
            <div className="container py-20 max-w-2xl text-center space-y-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <Download className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-bold">Compression Complete!</h1>
                <div className="bg-slate-50 p-6 rounded-xl border">
                    <p className="text-slate-500 mb-2">File size change:</p>
                    <div className="flex items-center justify-center gap-4 text-xl">
                        <span className="line-through text-slate-400">{(compressionStats.original / 1024 / 1024).toFixed(2)} MB</span>
                        <ArrowRight className="w-6 h-6 text-slate-300" />
                        <span className="font-bold text-green-600">{(compressionStats.compressed / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    {isSmaller ? (
                        <p className="text-green-600 font-bold mt-2">Reduced by {savings}%</p>
                    ) : (
                        <p className="text-orange-500 font-bold mt-2">Already optimized (Size increased due to rasterization)</p>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <Button size="xl" asChild className="w-full">
                        <a href={processedPdfUrl} download={`compressed-${file!.name}`}>
                            Download Compressed PDF
                        </a>
                    </Button>
                    <AdBanner variant="rectangle" />
                    <Button variant="outline" size="xl" onClick={() => {
                        setFile(null)
                        setProcessedPdfUrl(null)
                        setCompressionStats(null)
                    }}>
                        Compress Another PDF
                    </Button>
                    <Button variant="ghost" asChild>
                        <a href="/">Back to Home</a>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 max-w-4xl px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">Compress PDF</h1>
                <p className="text-slate-500 text-lg">Reduce file size while maintaining readable quality.</p>
            </div>

            {!file ? (
                <FileUploader onFilesSelected={handleFilesSelected} multiple={false} />
            ) : (
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border p-8 flex flex-col items-center gap-6">
                        <div className="p-4 bg-orange-100 rounded-full text-orange-600">
                            <FileText className="w-12 h-12" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-slate-800">{file.name}</h3>
                            <p className="text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>

                        <Button size="xl" onClick={handleCompress} disabled={isProcessing} className="bg-orange-600 hover:bg-orange-700 w-full md:w-auto px-12">
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Compressing {progress}%...
                                </>
                            ) : (
                                "Compress Now"
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

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}

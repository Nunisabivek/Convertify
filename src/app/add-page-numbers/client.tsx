"use client"

import { useState } from "react"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { FileText, Download, Hash } from "lucide-react"

enum PageNumberPosition {
    TopLeft = "TopLeft",
    TopCenter = "TopCenter",
    TopRight = "TopRight",
    BottomLeft = "BottomLeft",
    BottomCenter = "BottomCenter",
    BottomRight = "BottomRight",
}

export default function AddPageNumbersClient() {
    const [files, setFiles] = useState<File[]>([])
    const [position, setPosition] = useState<PageNumberPosition>(PageNumberPosition.BottomCenter)
    const [startFrom, setStartFrom] = useState(1)
    const [isProcessing, setIsProcessing] = useState(false)
    const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null)

    const handleFilesSelected = (newFiles: File[]) => {
        if (newFiles.length > 0) {
            setFiles([newFiles[0]]) // Only single file for now
        }
    }

    const processPdf = async () => {
        if (files.length === 0) return
        setIsProcessing(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 2000)) // Min wait for ads

            const fileBuffer = await files[0].arrayBuffer()
            const pdfDoc = await PDFDocument.load(fileBuffer)
            const pages = pdfDoc.getPages()
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

            pages.forEach((page, index) => {
                const { width, height } = page.getSize()
                const pageNumber = index + startFrom
                const text = `${pageNumber}`
                const fontSize = 12
                const textWidth = font.widthOfTextAtSize(text, fontSize)
                const margin = 20

                let x = 0
                let y = 0

                switch (position) {
                    case PageNumberPosition.TopLeft:
                        x = margin
                        y = height - margin
                        break
                    case PageNumberPosition.TopCenter:
                        x = (width - textWidth) / 2
                        y = height - margin
                        break
                    case PageNumberPosition.TopRight:
                        x = width - margin - textWidth
                        y = height - margin
                        break
                    case PageNumberPosition.BottomLeft:
                        x = margin
                        y = margin
                        break
                    case PageNumberPosition.BottomCenter:
                        x = (width - textWidth) / 2
                        y = margin
                        break
                    case PageNumberPosition.BottomRight:
                        x = width - margin - textWidth
                        y = margin
                        break
                }

                page.drawText(text, {
                    x,
                    y,
                    size: fontSize,
                    font,
                    color: rgb(0, 0, 0),
                })
            })

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
            const url = URL.createObjectURL(blob)
            setProcessedPdfUrl(url)

        } catch (error) {
            console.error("Error adding page numbers:", error)
            alert("Failed to process PDF.")
        } finally {
            setIsProcessing(false)
        }
    }

    if (isProcessing) {
        return <ProcessingWait progress={60} title="Adding Page Numbers..." />
    }

    if (processedPdfUrl) {
        return (
            <div className="container py-20 max-w-2xl text-center space-y-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <Download className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-bold">Page Numbers Added!</h1>
                <div className="flex flex-col gap-4">
                    <Button size="xl" asChild className="w-full">
                        <a href={processedPdfUrl} download={`numbered-${files[0].name}`}>
                            Download PDF
                        </a>
                    </Button>
                    <Button variant="outline" size="xl" onClick={() => {
                        setFiles([])
                        setProcessedPdfUrl(null)
                    }}>
                        Process Another File
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 max-w-4xl px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800">Customize Your Page Numbers</h2>
            </div>
            {files.length === 0 ? (
                <FileUploader onFilesSelected={handleFilesSelected} multiple={false} />
            ) : (
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col gap-6">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border">
                            <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">{files[0].name}</p>
                                <p className="text-sm text-slate-500">{(files[0].size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button variant="ghost" className="text-red-500" onClick={() => setFiles([])}>Remove</Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Position</label>
                                <div className="relative">
                                    <select
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value as PageNumberPosition)}
                                        className="flex h-12 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                    >
                                        <option value={PageNumberPosition.TopLeft}>Top Left</option>
                                        <option value={PageNumberPosition.TopCenter}>Top Center</option>
                                        <option value={PageNumberPosition.TopRight}>Top Right</option>
                                        <option value={PageNumberPosition.BottomLeft}>Bottom Left</option>
                                        <option value={PageNumberPosition.BottomCenter}>Bottom Center</option>
                                        <option value={PageNumberPosition.BottomRight}>Bottom Right</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Start Page Numbering From</label>
                                <input
                                    type="number"
                                    value={startFrom}
                                    onChange={(e) => setStartFrom(parseInt(e.target.value) || 1)}
                                    className="flex h-12 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <Button size="xl" onClick={processPdf} className="w-full bg-indigo-600 hover:bg-indigo-700">
                            Add Page Numbers <Hash className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                    <AdBanner variant="rectangle" />
                </div>
            )}
        </div>
    )
}

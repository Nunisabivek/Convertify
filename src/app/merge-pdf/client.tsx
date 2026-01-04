"use client"

import { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { Trash2, ArrowUp, ArrowDown, FileText, Download, Merge } from "lucide-react"

export default function MergePdfPage() {
    const [files, setFiles] = useState<File[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null)

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles((prev) => [...prev, ...newFiles])
    }

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const moveFile = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === files.length - 1) return

        const newFiles = [...files]
        const swapIndex = direction === 'up' ? index - 1 : index + 1
        const temp = newFiles[index]
        newFiles[index] = newFiles[swapIndex]
        newFiles[swapIndex] = temp
        setFiles(newFiles)
    }

    const handleMerge = async () => {
        setIsProcessing(true)
        try {
            // Artificial delay to ensure ads are seen (3 seconds min)
            await new Promise(resolve => setTimeout(resolve, 3000))

            const mergedPdf = await PDFDocument.create()

            for (const file of files) {
                const fileBuffer = await file.arrayBuffer()
                const pdf = await PDFDocument.load(fileBuffer)
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
                copiedPages.forEach((page) => mergedPdf.addPage(page))
            }

            const pdfBytes = await mergedPdf.save()
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            setProcessedPdfUrl(url)
        } catch (error) {
            console.error("Error merging PDFs:", error)
            alert("Failed to merge PDFs. Please try again.")
        } finally {
            setIsProcessing(false)
        }
    }

    if (isProcessing) {
        return <ProcessingWait progress={75} title="Merging Files..." />
    }

    if (processedPdfUrl) {
        return (
            <div className="container py-20 max-w-2xl text-center space-y-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <Download className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-bold">PDF Merged Successfully!</h1>
                <div className="flex flex-col gap-4">
                    <Button size="xl" asChild className="w-full">
                        <a href={processedPdfUrl} download="merged-convertify.pdf">
                            Download Merged PDF
                        </a>
                    </Button>
                    <Button variant="outline" size="xl" onClick={() => {
                        setFiles([])
                        setProcessedPdfUrl(null)
                    }}>
                        Merge More Files
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
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">Merge PDF Files</h1>
                <p className="text-slate-500 text-lg">Combine multiple PDFs into one single file. Fast & Secure.</p>
            </div>

            {files.length === 0 ? (
                <FileUploader onFilesSelected={handleFilesSelected} />
            ) : (
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
                        {files.map((file, index) => (
                            <div key={`${file.name}-${index}`} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="p-3 bg-red-100 rounded-lg text-red-600">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="truncate font-medium text-slate-700">
                                        {file.name}
                                        <span className="block text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="icon" variant="ghost" onClick={() => moveFile(index, 'up')} disabled={index === 0}>
                                        <ArrowUp className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => moveFile(index, 'down')} disabled={index === files.length - 1}>
                                        <ArrowDown className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="destructive" onClick={() => removeFile(index)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Button variant="outline" size="xl" onClick={() => setFiles([])}>Clear All</Button>
                        <Button size="xl" onClick={handleMerge} disabled={isProcessing} className="bg-indigo-600 hover:bg-indigo-700">
                            {isProcessing ? "Merging..." : "Merge Files"}
                            {!isProcessing && <Merge className="ml-2 w-5 h-5" />}
                        </Button>
                    </div>

                    <AdBanner variant="rectangle" />

                    <div className="text-center mt-4">
                        <FileUploader onFilesSelected={handleFilesSelected} />
                    </div>
                </div>
            )}
        </div>
    )
}

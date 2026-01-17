"use client"

import { useState } from "react"
import { PDFDocument } from "pdf-lib"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { Scissors, FileText, Download, Loader2 } from "lucide-react"

export default function SplitPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isDone, setIsDone] = useState(false)

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]) // Only take the first file for splitting
        }
    }

    const handleSplit = async () => {
        if (!file) return
        setIsProcessing(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 3000))
            const fileBuffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(fileBuffer)
            const zip = new JSZip()
            const numPages = pdfDoc.getPageCount()

            for (let i = 0; i < numPages; i++) {
                const newPdf = await PDFDocument.create()
                const [copiedPage] = await newPdf.copyPages(pdfDoc, [i])
                newPdf.addPage(copiedPage)
                const pdfBytes = await newPdf.save()

                // Pad page number with leading zeros: 001, 002, etc.
                const pageNum = (i + 1).toString().padStart(3, '0')
                zip.file(`${file.name.replace('.pdf', '')}-page-${pageNum}.pdf`, pdfBytes as any)
            }

            const zipContent = await zip.generateAsync({ type: "blob" })
            saveAs(zipContent, `${file.name.replace('.pdf', '')}-split.zip`)
            setIsDone(true)
        } catch (error) {
            console.error("Error splitting PDF:", error)
            alert("Failed to split PDF. Please try again.")
        } finally {
            setIsProcessing(false)
        }
    }

    if (isProcessing) {
        return <ProcessingWait progress={50} title="Splitting PDF..." />
    }

    if (isDone) {
        return (
            <div className="container py-20 max-w-2xl text-center space-y-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <Scissors className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-bold">PDF Split Successfully!</h1>
                <p className="text-slate-500">Your download should have started automatically.</p>
                <div className="flex flex-col gap-4">
                    <Button variant="outline" size="xl" onClick={() => {
                        setFile(null)
                        setIsDone(false)
                    }}>
                        Split Another PDF
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
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">Split PDF File</h1>
                <p className="text-slate-500 text-lg">Extract all pages into separate PDF files.</p>
            </div>

            {!file ? (
                <FileUploader onFilesSelected={handleFilesSelected} multiple={false} />
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

                        <Button size="xl" onClick={handleSplit} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto px-12">
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Splitting...
                                </>
                            ) : (
                                "Split PDF"
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


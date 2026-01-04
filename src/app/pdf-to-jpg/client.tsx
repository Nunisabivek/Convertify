"use client"

import { useState, useRef } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { FileImage, Download, Loader2 } from "lucide-react"
import JSZip from "jszip"
import { saveAs } from "file-saver"

export default function PdfToJpgPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isDone, setIsDone] = useState(false)

    // To keep track of progress
    const [progress, setProgress] = useState(0)
    const [total, setTotal] = useState(0)

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0) setFile(files[0])
    }

    const handleConvert = async () => {
        if (!file) return
        setIsProcessing(true)
        setIsDone(false)
        setProgress(0)

        try {
            // Dynamic import to avoid SSR 'DOMMatrix is not defined' error
            const pdfjsLib = await import("pdfjs-dist")
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

            const arrayBuffer = await file.arrayBuffer()
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
            const numPages = pdf.numPages
            setTotal(numPages)

            const zip = new JSZip()

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i)
                const viewport = page.getViewport({ scale: 2.0 }) // High resolution

                const canvas = document.createElement("canvas")
                const context = canvas.getContext("2d")
                canvas.height = viewport.height
                canvas.width = viewport.width

                if (context) {
                    await page.render({
                        canvasContext: context,
                        viewport: viewport,
                    } as any).promise

                    const imgData = canvas.toDataURL("image/jpeg", 0.8)
                    // Remove "data:image/jpeg;base64,"
                    const data = imgData.split(',')[1]

                    zip.file(`page-${i.toString().padStart(3, '0')}.jpg`, data, { base64: true })
                }

                setProgress(i)
            }

            const content = await zip.generateAsync({ type: "blob" })
            saveAs(content, `${file.name.replace('.pdf', '')}-images.zip`)
            setIsDone(true)

        } catch (error) {
            console.error("Conversion error:", error)
            alert("Failed to convert PDF to JPG. Please try again.")
        } finally {
            setIsProcessing(false)
        }
    }

    if (isDone) {
        return (
            <div className="container py-20 max-w-2xl text-center space-y-8">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto text-yellow-600">
                    <Download className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-bold">Images Ready!</h1>
                <p className="text-slate-500">Your ZIP file download started automatically.</p>
                <div className="flex flex-col gap-4">
                    <Button variant="outline" size="xl" onClick={() => {
                        setFile(null)
                        setIsDone(false)
                    }}>
                        Convert Another PDF
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
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">PDF to JPG</h1>
                <p className="text-slate-500 text-lg">Convert each PDF page into a high-quality image.</p>
            </div>

            {!file ? (
                <FileUploader onFilesSelected={handleFilesSelected} multiple={false} accept={{ "application/pdf": [".pdf"] }} />
            ) : (
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border p-8 flex flex-col items-center gap-6">
                        <div className="p-4 bg-yellow-100 rounded-full text-yellow-600">
                            <FileImage className="w-12 h-12" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-slate-800">{file.name}</h3>
                            <p className="text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>

                        <Button size="xl" onClick={handleConvert} disabled={isProcessing} className="bg-yellow-600 hover:bg-yellow-700 w-full md:w-auto px-12 text-white">
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Converting {progress}/{total}...
                                </>
                            ) : (
                                "Convert to Images"
                            )}
                        </Button>

                        <Button variant="ghost" onClick={() => setFile(null)} disabled={isProcessing} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            Remove File
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

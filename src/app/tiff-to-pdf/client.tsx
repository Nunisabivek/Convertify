"use client"

import { useState } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { Download, Loader2, X } from "lucide-react"
import { PDFDocument } from "pdf-lib"

interface ConvertedFile {
    name: string
    url: string
}

export default function TiffToPdfClient() {
    const [files, setFiles] = useState<File[]>([])
    const [converted, setConverted] = useState<ConvertedFile[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles(prev => [...prev, ...newFiles])
        setConverted([])
        setError(null)
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const convertFiles = async () => {
        setIsProcessing(true)
        setError(null)
        const results: ConvertedFile[] = []

        try {
            for (const file of files) {
                // Load TIFF as image via canvas
                const url = URL.createObjectURL(file)
                const img = new Image()
                await new Promise<void>((resolve, reject) => {
                    img.onload = () => resolve()
                    img.onerror = () => reject(new Error(`Failed to load ${file.name}`))
                    img.src = url
                })

                const canvas = document.createElement("canvas")
                canvas.width = img.naturalWidth
                canvas.height = img.naturalHeight
                const ctx = canvas.getContext("2d")!
                ctx.drawImage(img, 0, 0)
                URL.revokeObjectURL(url)

                // Convert canvas to PNG bytes then embed in PDF
                const pngDataUrl = canvas.toDataURL("image/png")
                const pngBytes = Uint8Array.from(atob(pngDataUrl.split(",")[1]), c => c.charCodeAt(0))

                const pdfDoc = await PDFDocument.create()
                const pngImage = await pdfDoc.embedPng(pngBytes)
                const page = pdfDoc.addPage([pngImage.width, pngImage.height])
                page.drawImage(pngImage, { x: 0, y: 0, width: pngImage.width, height: pngImage.height })

                const pdfBytes = await pdfDoc.save()
                const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" })
                const pdfName = file.name.replace(/\.tiff?$/i, ".pdf")
                results.push({ name: pdfName, url: URL.createObjectURL(blob) })
            }
            setConverted(results)
        } catch (e) {
            setError(e instanceof Error ? e.message : "Conversion failed")
        } finally {
            setIsProcessing(false)
        }
    }

    const downloadFile = (file: ConvertedFile) => {
        const a = document.createElement("a")
        a.href = file.url
        a.download = file.name
        a.click()
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {converted.length === 0 ? (
                <>
                    <FileUploader onFilesSelected={handleFilesSelected} accept={{ "image/tiff": [".tiff", ".tif"] }} multiple={true} />
                    {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {files.map((file, i) => (
                                <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                                    <span className="text-sm text-slate-700 truncate">{file.name}</span>
                                    <button onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                                </div>
                            ))}
                            <Button onClick={convertFiles} disabled={isProcessing} className="w-full mt-4">
                                {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Converting...</> : `Convert ${files.length} file${files.length > 1 ? "s" : ""} to PDF`}
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="space-y-3">
                    {converted.map((file, i) => (
                        <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                            <span className="text-sm text-slate-700 truncate">{file.name}</span>
                            <button onClick={() => downloadFile(file)} className="text-indigo-600 hover:text-indigo-800"><Download className="w-4 h-4" /></button>
                        </div>
                    ))}
                    <Button onClick={() => converted.forEach(downloadFile)} className="w-full"><Download className="w-4 h-4 mr-2" />Download All</Button>
                    <Button variant="outline" onClick={() => { setConverted([]); setFiles([]) }} className="w-full">Convert More Files</Button>
                </div>
            )}
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
    )
}

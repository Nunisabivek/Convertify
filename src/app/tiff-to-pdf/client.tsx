"use client"

import { useState } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { Download, Loader2, X } from "lucide-react"
import { PDFDocument } from "pdf-lib"
import { iterateTiffPages } from "@/lib/tiff-pages"
import { nameFromSources } from "@/lib/human-filename"

interface ConvertedFile {
    name: string
    url: string
}

export default function TiffToPdfClient() {
    const [files, setFiles] = useState<File[]>([])
    const [converted, setConverted] = useState<ConvertedFile[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    // Several TIFFs become one multi-page PDF by default; untick for one PDF each.
    const [combine, setCombine] = useState(true)

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles(prev => [...prev, ...newFiles])
        setConverted([])
        setError(null)
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    // Draw one decoded TIFF page onto a canvas and return it as PNG bytes
    // (lossless, so scans keep their original quality).
    const pageToPng = async (page: { width: number; height: number; rgba: Uint8Array }) => {
        const canvas = document.createElement("canvas")
        canvas.width = page.width
        canvas.height = page.height
        const ctx = canvas.getContext("2d")
        if (!ctx) throw new Error("Your browser could not create a drawing surface.")
        const pixels = ctx.createImageData(page.width, page.height)
        pixels.data.set(page.rgba)
        ctx.putImageData(pixels, 0, 0)
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"))
        if (!blob) throw new Error("Could not encode a TIFF page.")
        return new Uint8Array(await blob.arrayBuffer())
    }

    // Append every page of one TIFF to a PDF document.
    const addTiffToPdf = async (pdfDoc: PDFDocument, file: File) => {
        // TIFF is decoded in JS: Chrome, Edge and Firefox cannot show TIFF in an <img>.
        const buffer = await file.arrayBuffer()
        try {
            for (const page of iterateTiffPages(buffer)) {
                const png = await pdfDoc.embedPng(await pageToPng(page))
                const pdfPage = pdfDoc.addPage([page.pageWidthPt, page.pageHeightPt])
                pdfPage.drawImage(png, { x: 0, y: 0, width: page.pageWidthPt, height: page.pageHeightPt })
            }
        } catch (e) {
            const reason = e instanceof Error ? e.message : "unknown error"
            throw new Error(`Could not read ${file.name}: ${reason}`)
        }
    }

    const savePdf = async (pdfDoc: PDFDocument, name: string): Promise<ConvertedFile> => {
        const pdfBytes = await pdfDoc.save()
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" })
        return { name, url: URL.createObjectURL(blob) }
    }

    const convertFiles = async () => {
        setIsProcessing(true)
        setError(null)
        const results: ConvertedFile[] = []

        try {
            if (combine && files.length > 1) {
                const pdfDoc = await PDFDocument.create()
                for (const file of files) await addTiffToPdf(pdfDoc, file)
                results.push(await savePdf(pdfDoc, nameFromSources(files, "pdf")))
            } else {
                for (const file of files) {
                    const pdfDoc = await PDFDocument.create()
                    await addTiffToPdf(pdfDoc, file)
                    results.push(await savePdf(pdfDoc, file.name.replace(/\.tiff?$/i, ".pdf")))
                }
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
                    <FileUploader onFilesSelected={handleFilesSelected} accept={{ "image/tiff": [".tiff", ".tif"] }} multiple={true} fileTypeLabel="TIFF images" iconType="image" />
                    {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {files.map((file, i) => (
                                <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                                    <span className="text-sm text-slate-700 truncate">{file.name}</span>
                                    <button onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                                </div>
                            ))}
                            {files.length > 1 && (
                                <label className="flex items-center gap-2 pt-2 text-sm text-slate-700">
                                    <input type="checkbox" checked={combine} onChange={(e) => setCombine(e.target.checked)} />
                                    Combine all files into one PDF (in the order shown)
                                </label>
                            )}
                            <Button onClick={convertFiles} disabled={isProcessing} className="w-full mt-4">
                                {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Converting...</> : files.length > 1 && combine ? `Combine ${files.length} files into one PDF` : `Convert ${files.length} file${files.length > 1 ? "s" : ""} to PDF`}
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

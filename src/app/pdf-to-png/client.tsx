"use client"

import { useState } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { FileImage, Download } from "lucide-react"
import JSZip from "jszip"
import { saveAs } from "file-saver"

export default function PdfToPngPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isDone, setIsDone] = useState(false)

    const handleConvert = async () => {
        if (!file) return
        setIsProcessing(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 3000))

            const pdfjsLib = await import("pdfjs-dist")
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

            const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise
            const zip = new JSZip()

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i)
                const viewport = page.getViewport({ scale: 2.0 })
                const canvas = document.createElement("canvas")
                const ctx = canvas.getContext("2d")
                canvas.width = viewport.width
                canvas.height = viewport.height
                if (ctx) {
                    await page.render({ canvasContext: ctx, viewport } as any).promise
                    const imgData = canvas.toDataURL("image/png")
                    zip.file(`page-${i}.png`, imgData.split(',')[1], { base64: true })
                }
            }

            const content = await zip.generateAsync({ type: "blob" })
            saveAs(content, "converted-images.zip")
            setIsDone(true)
        } catch (e) {
            console.error(e)
            alert("Error converting PDF to PNG")
        } finally {
            setIsProcessing(false)
        }
    }

    if (isProcessing) return <ProcessingWait progress={60} title="Converting to PNG..." />

    if (isDone) {
        return (
            <div className="container mx-auto py-20 max-w-2xl text-center space-y-8">
                <div className="w-24 h-24 bg-cyan-100 rounded-full flex items-center justify-center mx-auto text-cyan-600">
                    <Download className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-bold">Images Downloaded!</h1>
                <div className="flex flex-col gap-4">
                    <AdBanner variant="rectangle" />
                    <Button variant="outline" onClick={() => { setFile(null); setIsDone(false) }}>Convert More</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 max-w-4xl px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">PDF to PNG</h1>
                <p className="text-slate-500 text-lg">Extract PDF pages as high-quality PNGs.</p>
            </div>
            {!file ? (
                <FileUploader onFilesSelected={(f) => setFile(f[0])} multiple={false} accept={{ "application/pdf": [".pdf"] }} />
            ) : (
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl border text-center">
                        <p className="mb-4 font-bold">{file.name}</p>
                        <Button size="xl" onClick={handleConvert}>Convert to PNG</Button>
                    </div>
                    <AdBanner variant="rectangle" />
                </div>
            )}
        </div>
    )
}

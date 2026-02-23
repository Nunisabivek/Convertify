"use client"

import { useState } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { FileImage, Download, Loader2 } from "lucide-react"
import JSZip from "jszip"
import { saveAs } from "file-saver"

export default function PdfToPngPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isDone, setIsDone] = useState(false)
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
    const [downloadName, setDownloadName] = useState("")
    const [isZip, setIsZip] = useState(false)
    const [progress, setProgress] = useState(0)
    const [total, setTotal] = useState(0)

    const handleConvert = async () => {
        if (!file) return
        setIsProcessing(true)
        setProgress(0)

        try {
            const pdfjsLib = await import("pdfjs-dist")
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

            const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise
            const numPages = pdf.numPages
            setTotal(numPages)

            if (numPages === 1) {
                const page = await pdf.getPage(1)
                const viewport = page.getViewport({ scale: 2.0 })
                const canvas = document.createElement("canvas")
                const ctx = canvas.getContext("2d")
                canvas.width = viewport.width
                canvas.height = viewport.height

                if (ctx) {
                    await page.render({ canvasContext: ctx, viewport } as any).promise
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const url = URL.createObjectURL(blob)
                            setDownloadUrl(url)
                            setDownloadName(`${file.name.replace('.pdf', '')}.png`)
                            setIsZip(false)
                            setIsDone(true)
                        }
                    }, "image/png")
                }
                setProgress(1)
            } else {
                await new Promise(resolve => setTimeout(resolve, 2000))

                const zip = new JSZip()

                for (let i = 1; i <= numPages; i++) {
                    const page = await pdf.getPage(i)
                    const viewport = page.getViewport({ scale: 2.0 })
                    const canvas = document.createElement("canvas")
                    const ctx = canvas.getContext("2d")
                    canvas.width = viewport.width
                    canvas.height = viewport.height
                    if (ctx) {
                        await page.render({ canvasContext: ctx, viewport } as any).promise
                        const imgData = canvas.toDataURL("image/png")
                        zip.file(`page-${i.toString().padStart(3, '0')}.png`, imgData.split(',')[1], { base64: true })
                    }
                    setProgress(i)
                }

                const content = await zip.generateAsync({ type: "blob" })
                const url = URL.createObjectURL(content)
                setDownloadUrl(url)
                setDownloadName(`${file.name.replace('.pdf', '')}-images.zip`)
                setIsZip(true)
                setIsDone(true)
            }
        } catch (e) {
            console.error(e)
            alert("Error converting PDF to PNG")
        } finally {
            setIsProcessing(false)
        }
    }

    if (isProcessing) return <ProcessingWait progress={total > 0 ? Math.round((progress / total) * 100) : 50} title="Converting to PNG..." />

    if (isDone && downloadUrl) {
        return (
            <div className="container mx-auto py-20 max-w-2xl text-center space-y-8">
                <div className="w-24 h-24 bg-cyan-100 rounded-full flex items-center justify-center mx-auto text-cyan-600">
                    <Download className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-bold">{isZip ? 'Images Ready!' : 'Image Ready!'}</h1>
                <p className="text-slate-500">
                    {isZip ? 'Your images are ready to download.' : 'Your image is ready to download.'}
                </p>
                <Button size="xl" asChild className="bg-cyan-600 hover:bg-cyan-700">
                    <a href={downloadUrl} download={downloadName}>
                        <Download className="mr-2 w-5 h-5" />
                        Download {isZip ? 'ZIP' : 'PNG'}
                    </a>
                </Button>
                <div className="flex flex-col gap-4">
                    <Button variant="outline" size="xl" onClick={() => { setFile(null); setIsDone(false); setDownloadUrl(null) }}>Convert Another PDF</Button>
                    <Button variant="ghost" asChild><a href="/">Back to Home</a></Button>
                </div>
                <AdBanner variant="rectangle" />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 max-w-4xl px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">PDF to PNG</h1>
                <p className="text-slate-500 text-lg">Extract PDF pages as high-quality PNGs with transparency.</p>
            </div>
            {!file ? (
                <FileUploader onFilesSelected={(f) => setFile(f[0])} multiple={false} accept={{ "application/pdf": [".pdf"] }} />
            ) : (
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border p-8 flex flex-col items-center gap-6">
                        <div className="p-4 bg-cyan-100 rounded-full text-cyan-600">
                            <FileImage className="w-12 h-12" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-slate-800">{file.name}</h3>
                            <p className="text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>

                        <Button size="xl" onClick={handleConvert} disabled={isProcessing} className="bg-cyan-600 hover:bg-cyan-700 w-full md:w-auto px-12 text-white">
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Converting {progress}/{total}...
                                </>
                            ) : (
                                "Convert to PNG"
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

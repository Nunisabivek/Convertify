"use client"

import { useState, useEffect } from "react"
import { PDFDocument } from "pdf-lib"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { Minimize2, Download, Loader2, FileText, ArrowRight, Settings2 } from "lucide-react"


// Checking if Slider exists in previous ls list? No. I'll use standard range input for simplicity or check ui folder.
// I'll stick to standard HTML range for now to be safe and fast.

export default function CompressPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null)
    const [compressionStats, setCompressionStats] = useState<{ original: number, compressed: number } | null>(null)
    const [progress, setProgress] = useState(0)

    // Settings
    const [quality, setQuality] = useState(0.6) // 0.1 to 1.0
    const [resolutionScale, setResolutionScale] = useState(1.5) // 0.5 to 3.0
    const [targetSizeMB, setTargetSizeMB] = useState<string>("")
    const [estimatedSize, setEstimatedSize] = useState<string>("")

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0])
            // Reset settings
            setQuality(0.6)
            setResolutionScale(1.5)
            setTargetSizeMB("")
        }
    }

    // Heuristic Update when Target Size changes
    useEffect(() => {
        if (!targetSizeMB || !file) return
        const targetBytes = parseFloat(targetSizeMB) * 1024 * 1024
        if (isNaN(targetBytes) || targetBytes <= 0) return

        // Very rough heuristic assumption: 
        // A4 Page at Scale 1.0, Quality 0.6 ~= 150KB
        // Size ~= BaseSize * Scale^2 * Quality

        // We don't know page count yet without loading PDFJS, but let's assume average PDF is 1-10 pages. 
        // Actually, we can't accurately guess without page count. 
        // Let's just adjust "aggressiveness" based on ratio of Target vs Original.

        const ratio = targetBytes / file.size

        if (ratio < 0.2) { // Wants massive reduction
            setResolutionScale(0.8)
            setQuality(0.4)
        } else if (ratio < 0.5) {
            setResolutionScale(1.0)
            setQuality(0.5)
        } else if (ratio < 0.8) {
            setResolutionScale(1.2)
            setQuality(0.6)
        } else {
            setResolutionScale(1.5)
            setQuality(0.7)
        }

    }, [targetSizeMB, file])

    const handleCompress = async () => {
        if (!file) return
        setIsProcessing(true)
        setProgress(0)

        try {
            // Dynamic import for PDF.js to avoid SSR issues
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
                const viewport = page.getViewport({ scale: resolutionScale })

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
                    const imgData = canvas.toDataURL("image/jpeg", quality)
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
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${isSmaller ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {isSmaller ? <Download className="w-12 h-12" /> : <Minimize2 className="w-12 h-12" />}
                </div>
                <h1 className="text-4xl font-bold">{isSmaller ? "Compression Complete!" : "Optimization Complete"}</h1>

                <div className="bg-slate-50 p-6 rounded-xl border">
                    <p className="text-slate-500 mb-2">File size change:</p>
                    <div className="flex items-center justify-center gap-4 text-xl">
                        <span className="line-through text-slate-400">{(compressionStats.original / 1024 / 1024).toFixed(2)} MB</span>
                        <ArrowRight className="w-6 h-6 text-slate-300" />
                        <span className={`font-bold ${isSmaller ? 'text-green-600' : 'text-orange-600'}`}>{(compressionStats.compressed / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    {isSmaller ? (
                        <p className="text-green-600 font-bold mt-2">Reduced by {savings}%</p>
                    ) : (
                        <div className="mt-2 text-sm text-orange-600 bg-orange-100 p-2 rounded">
                            <p className="font-bold">File size increased.</p>
                            <p>This happens when the document is already optimized or text-based. Try lowering the "Page Resolution" or "Image Quality" in settings to force a smaller size.</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <Button size="xl" asChild className="w-full">
                        <a href={processedPdfUrl} download={`compressed-${file!.name}`}>
                            Download PDF
                        </a>
                    </Button>
                    <AdBanner variant="rectangle" />
                    <Button variant="outline" size="xl" onClick={() => {
                        setFile(null)
                        setProcessedPdfUrl(null)
                        setCompressionStats(null)
                        setTargetSizeMB("")
                    }}>
                        Compress Another PDF
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 max-w-4xl px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">Compress PDF</h1>
                <p className="text-slate-500 text-lg">Reduce file size with customizable quality settings.</p>
            </div>

            {!file ? (
                <FileUploader onFilesSelected={handleFilesSelected} multiple={false} />
            ) : (
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row gap-8">
                        {/* File Info */}
                        <div className="flex-1 space-y-4 border-r border-slate-100 pr-4">
                            <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
                                <FileText className="w-10 h-10 text-orange-500" />
                                <div>
                                    <h3 className="font-bold text-slate-800 truncate max-w-[200px]">{file.name}</h3>
                                    <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <Button variant="ghost" onClick={() => setFile(null)} className="w-full text-red-500 hover:bg-red-50">
                                Remove File
                            </Button>
                        </div>

                        {/* Settings */}
                        <div className="flex-[2] space-y-6">
                            <div className="flex items-center gap-2 text-slate-800 font-bold border-b pb-2">
                                <Settings2 className="w-5 h-5" />
                                Compression Settings
                            </div>

                            {/* Target Size Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Target File Size (Approx. MB)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="e.g. 1.5"
                                        value={targetSizeMB}
                                        onChange={(e) => setTargetSizeMB(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                    <div className="flex items-center px-3 bg-slate-100 border border-slate-200 rounded-md text-slate-500 text-sm">
                                        MB
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400">Optional. Enter a value lower than the original size.</p>
                            </div>

                            {/* Manual Sliders */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-sm font-medium text-slate-700">Image Quality</label>
                                        <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{Math.round(quality * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.1" max="1.0" step="0.1"
                                        value={quality}
                                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                    />
                                    <p className="text-xs text-slate-400">Lower quality = Smaller file size</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-sm font-medium text-slate-700">Page Resolution (Scale)</label>
                                        <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{resolutionScale}x</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.5" max="2.0" step="0.1"
                                        value={resolutionScale}
                                        onChange={(e) => setResolutionScale(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                    />
                                    <p className="text-xs text-slate-400">Lower resolution = Smaller file size (may blur text)</p>
                                </div>
                            </div>

                            <Button size="xl" onClick={handleCompress} disabled={isProcessing} className="w-full bg-orange-600 hover:bg-orange-700 mt-4">
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Compressing {progress}%...
                                    </>
                                ) : (
                                    "Compress PDF"
                                )}
                            </Button>
                        </div>
                    </div>
                    <AdBanner variant="rectangle" />
                </div>
            )}
        </div>
    )
}

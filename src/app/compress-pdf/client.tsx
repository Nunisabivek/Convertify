"use client"

import { useState, useEffect } from "react"
import { PDFDocument } from "pdf-lib"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { Minimize2, Download, Loader2, FileText, ArrowRight, Settings2, Target, AlertCircle, Image as ImageIcon } from "lucide-react"

type SizeUnit = "KB" | "MB"

export default function CompressPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [processedFileUrl, setProcessedFileUrl] = useState<string | null>(null)
    const [compressionStats, setCompressionStats] = useState<{ original: number, compressed: number } | null>(null)
    const [progress, setProgress] = useState(0)

    // Settings
    const [quality, setQuality] = useState(0.6)
    const [resolutionScale, setResolutionScale] = useState(1.5)
    const [targetSize, setTargetSize] = useState<string>("")
    const [sizeUnit, setSizeUnit] = useState<SizeUnit>("KB")
    const [showAdvanced, setShowAdvanced] = useState(false)

    const isPdf = file ? (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) : false

    // Accept PDF and common image formats
    const ACCEPTED_TYPES = {
        "application/pdf": [".pdf"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"]
    }

    // Convert target to bytes for calculations
    const getTargetBytes = (): number => {
        const value = parseFloat(targetSize)
        if (isNaN(value) || value <= 0) return 0
        return sizeUnit === "KB" ? value * 1024 : value * 1024 * 1024
    }

    // Format file size for display
    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`
    }

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0])
            setQuality(0.6)
            setResolutionScale(1.5)
            setTargetSize("")
            setSizeUnit("KB")
            setProcessedFileUrl(null)
            setCompressionStats(null)
        }
    }

    // Auto-adjust compression settings based on target size
    useEffect(() => {
        const targetBytes = getTargetBytes()
        if (!targetBytes || !file) return

        const ratio = targetBytes / file.size

        if (ratio < 0.1) {
            // Extreme compression needed
            setResolutionScale(0.6)
            setQuality(0.3)
        } else if (ratio < 0.2) {
            setResolutionScale(0.8)
            setQuality(0.4)
        } else if (ratio < 0.4) {
            setResolutionScale(1.0)
            setQuality(0.5)
        } else if (ratio < 0.6) {
            setResolutionScale(1.2)
            setQuality(0.6)
        } else if (ratio < 0.8) {
            setResolutionScale(1.4)
            setQuality(0.7)
        } else {
            setResolutionScale(1.5)
            setQuality(0.8)
        }
    }, [targetSize, sizeUnit, file])

    // Preset button handler
    const handlePreset = (value: number, unit: SizeUnit) => {
        setTargetSize(value.toString())
        setSizeUnit(unit)
    }

    // Helper: compress an image at given scale and quality, returns blob
    const compressImageAtSettings = (file: File, scale: number, q: number): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = URL.createObjectURL(file)
            img.onload = () => {
                const effectiveScale = scale > 1.0 ? 1.0 : scale
                const canvas = document.createElement("canvas")
                canvas.width = Math.max(1, Math.floor(img.width * effectiveScale))
                canvas.height = Math.max(1, Math.floor(img.height * effectiveScale))

                const ctx = canvas.getContext("2d")
                if (!ctx) { reject(new Error("Canvas context failed")); return }

                ctx.fillStyle = "#FFFFFF"
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                canvas.toBlob(
                    (blob) => { blob ? resolve(blob) : reject(new Error("Compression failed")) },
                    "image/jpeg",
                    q
                )
                URL.revokeObjectURL(img.src)
            }
            img.onerror = () => { URL.revokeObjectURL(img.src); reject(new Error("Image load failed")) }
        })
    }

    // Helper: build a PDF at given scale and quality, returns byte size and blob
    const buildPdfAtSettings = async (
        srcPdf: any,
        numPages: number,
        scale: number,
        q: number,
        onPageDone?: (page: number) => void
    ): Promise<Blob> => {
        const newPdf = await PDFDocument.create()

        for (let i = 1; i <= numPages; i++) {
            const page = await srcPdf.getPage(i)
            const viewport = page.getViewport({ scale })

            const canvas = document.createElement("canvas")
            const context = canvas.getContext("2d")
            canvas.width = Math.floor(viewport.width)
            canvas.height = Math.floor(viewport.height)

            if (context) {
                await page.render({ canvasContext: context, viewport } as any).promise

                const imgData = canvas.toDataURL("image/jpeg", q)
                const imgBytes = await fetch(imgData).then(res => res.arrayBuffer())

                const jpgImage = await newPdf.embedJpg(imgBytes)
                const newPage = newPdf.addPage([jpgImage.width, jpgImage.height])
                newPage.drawImage(jpgImage, { x: 0, y: 0, width: jpgImage.width, height: jpgImage.height })
            }
            onPageDone?.(i)
        }

        const pdfBytes = await newPdf.save()
        return new Blob([pdfBytes as any], { type: 'application/pdf' })
    }

    const handleCompress = async () => {
        if (!file) return
        setIsProcessing(true)
        setProgress(0)

        try {
            const targetBytes = getTargetBytes()

            if (isPdf) {
                // PDF Compression with iterative target-seeking
                const { loadPdfjs } = await import("@/lib/pdfjs")
                const pdfjsLib = await loadPdfjs()

                const arrayBuffer = await file.arrayBuffer()
                const srcPdf = await pdfjsLib.getDocument(arrayBuffer).promise
                const numPages = srcPdf.numPages

                if (targetBytes > 0) {
                    // ITERATIVE COMPRESSION: binary search on quality to hit target
                    // Strategy: fix resolution scale, binary search quality (faster convergence)
                    // If still too large at min quality, reduce resolution scale and retry
                    
                    let bestBlob: Blob | null = null
                    let bestSize = Infinity
                    const MAX_ITERATIONS = 6

                    // Try up to 3 resolution tiers, binary-searching quality within each
                    const resolutionTiers = [
                        Math.min(resolutionScale, 1.5),
                        Math.min(resolutionScale * 0.7, 1.0),
                        Math.min(resolutionScale * 0.4, 0.6),
                    ]

                    for (const resTier of resolutionTiers) {
                        let qLow = 0.05
                        let qHigh = 0.95
                        let iterCount = 0

                        while (iterCount < MAX_ITERATIONS) {
                            const qMid = (qLow + qHigh) / 2
                            setProgress(Math.round(((resolutionTiers.indexOf(resTier) * MAX_ITERATIONS + iterCount) / (resolutionTiers.length * MAX_ITERATIONS)) * 90))

                            const blob = await buildPdfAtSettings(srcPdf, numPages, resTier, qMid)

                            if (blob.size <= targetBytes) {
                                // Success! But try to get higher quality while still under target
                                bestBlob = blob
                                bestSize = blob.size
                                qLow = qMid + 0.01
                            } else {
                                qHigh = qMid - 0.01
                            }

                            iterCount++

                            // If we're within 5% of target on the upper side, good enough
                            if (blob.size <= targetBytes && blob.size >= targetBytes * 0.85) {
                                bestBlob = blob
                                bestSize = blob.size
                                break
                            }
                        }

                        // If we found a result under target at this resolution, stop
                        if (bestBlob && bestSize <= targetBytes) break
                    }

                    // If iterative search couldn't hit target, use the smallest we found
                    // or fall back to lowest settings
                    if (!bestBlob || bestSize > targetBytes) {
                        const fallbackBlob = await buildPdfAtSettings(
                            srcPdf, numPages,
                            Math.min(resolutionScale * 0.35, 0.5),
                            0.05,
                            (pg) => setProgress(90 + Math.round((pg / numPages) * 10))
                        )
                        if (!bestBlob || fallbackBlob.size < bestSize) {
                            bestBlob = fallbackBlob
                            bestSize = fallbackBlob.size
                        }
                    }

                    setProgress(100)
                    const url = URL.createObjectURL(bestBlob!)
                    setProcessedFileUrl(url)
                    setCompressionStats({ original: file.size, compressed: bestBlob!.size })

                } else {
                    // No target size — single-pass with user settings
                    const blob = await buildPdfAtSettings(
                        srcPdf, numPages, resolutionScale, quality,
                        (pg) => setProgress(Math.round((pg / numPages) * 100))
                    )
                    const url = URL.createObjectURL(blob)
                    setProcessedFileUrl(url)
                    setCompressionStats({ original: file.size, compressed: blob.size })
                }

            } else {
                // IMAGE Compression with iterative target-seeking
                if (targetBytes > 0) {
                    let bestBlob: Blob | null = null
                    let bestSize = Infinity
                    const MAX_ITERATIONS = 8

                    // Binary search quality first at current scale
                    const scaleTiers = [
                        Math.min(resolutionScale > 1.0 ? 1.0 : resolutionScale, 1.0),
                        0.7,
                        0.5,
                        0.3,
                    ]

                    for (const scaleTier of scaleTiers) {
                        let qLow = 0.05
                        let qHigh = 0.95
                        let iterCount = 0

                        while (iterCount < MAX_ITERATIONS) {
                            const qMid = (qLow + qHigh) / 2
                            setProgress(Math.round(((scaleTiers.indexOf(scaleTier) * MAX_ITERATIONS + iterCount) / (scaleTiers.length * MAX_ITERATIONS)) * 100))

                            const blob = await compressImageAtSettings(file, scaleTier, qMid)

                            if (blob.size <= targetBytes) {
                                bestBlob = blob
                                bestSize = blob.size
                                qLow = qMid + 0.01
                            } else {
                                qHigh = qMid - 0.01
                            }

                            iterCount++

                            if (blob.size <= targetBytes && blob.size >= targetBytes * 0.85) {
                                bestBlob = blob
                                bestSize = blob.size
                                break
                            }
                        }

                        if (bestBlob && bestSize <= targetBytes) break
                    }

                    // Fallback: lowest possible settings
                    if (!bestBlob || bestSize > targetBytes) {
                        const fallback = await compressImageAtSettings(file, 0.2, 0.05)
                        if (!bestBlob || fallback.size < bestSize) {
                            bestBlob = fallback
                            bestSize = fallback.size
                        }
                    }

                    setProgress(100)
                    const url = URL.createObjectURL(bestBlob!)
                    setProcessedFileUrl(url)
                    setCompressionStats({ original: file.size, compressed: bestBlob!.size })

                } else {
                    // No target — single pass
                    const blob = await compressImageAtSettings(file, resolutionScale, quality)
                    const url = URL.createObjectURL(blob)
                    setProcessedFileUrl(url)
                    setCompressionStats({ original: file.size, compressed: blob.size })
                    setProgress(100)
                }
            }

        } catch (error) {
            console.error("Compression error:", error)
            alert("Failed to compress file. Please try again.")
        } finally {
            setIsProcessing(false)
        }
    }

    // Result screen
    if (processedFileUrl && compressionStats) {
        const savings = Math.round(((compressionStats.original - compressionStats.compressed) / compressionStats.original) * 100)
        const isSmaller = compressionStats.compressed < compressionStats.original
        const targetBytes = getTargetBytes()
        const hitTarget = targetBytes > 0 && compressionStats.compressed <= targetBytes

        return (
            <div className="container py-20 max-w-2xl text-center space-y-8">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${isSmaller ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {isSmaller ? <Download className="w-12 h-12" /> : <Minimize2 className="w-12 h-12" />}
                </div>
                <h1 className="text-4xl font-bold">{isSmaller ? "Compression Complete!" : "Optimization Complete"}</h1>

                <div className="bg-slate-50 p-6 rounded-xl border">
                    <p className="text-slate-500 mb-2">File size change:</p>
                    <div className="flex items-center justify-center gap-4 text-xl">
                        <span className="line-through text-slate-400">{formatFileSize(compressionStats.original)}</span>
                        <ArrowRight className="w-6 h-6 text-slate-300" />
                        <span className={`font-bold ${isSmaller ? 'text-green-600' : 'text-orange-600'}`}>
                            {formatFileSize(compressionStats.compressed)}
                        </span>
                    </div>

                    {isSmaller && (
                        <p className="text-green-600 font-bold mt-2">Reduced by {savings}%</p>
                    )}

                    {targetBytes > 0 && (
                        <div className={`mt-4 p-3 rounded-lg ${hitTarget ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {hitTarget ? (
                                <p className="font-medium">✓ Target of {targetSize} {sizeUnit} achieved!</p>
                            ) : (
                                <p className="font-medium">
                                    Target was {targetSize} {sizeUnit}. Best result: {formatFileSize(compressionStats.compressed)}.
                                    <br />
                                    <span className="text-sm">We tried multiple compression passes but this is the smallest achievable size for this file without making it unreadable. The content itself has an irreducible minimum size.</span>
                                </p>
                            )}
                        </div>
                    )}

                    {!isSmaller && (
                        <div className="mt-2 text-sm text-orange-600 bg-orange-100 p-2 rounded">
                            <p className="font-bold">File size increased.</p>
                            <p>This happens when the file is already optimized. Try lowering the settings.</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <Button size="xl" asChild className="w-full bg-green-600 hover:bg-green-700">
                        <a href={processedFileUrl} download={`compressed-${file!.name.split('.')[0]}.${isPdf ? 'pdf' : 'jpg'}`}>
                            <Download className="mr-2 w-5 h-5" />
                            Download Compressed {isPdf ? 'PDF' : 'Image'}
                        </a>
                    </Button>
                    <AdBanner variant="rectangle" />
                    <Button variant="outline" size="xl" onClick={() => {
                        setFile(null)
                        setProcessedFileUrl(null)
                        setCompressionStats(null)
                        setTargetSize("")
                    }}>
                        Compress Another File
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 max-w-4xl px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">Compress PDF & Images</h2>
                <p className="text-slate-500 text-lg">Reduce file size of PDFs, JPGs, PNGs to your exact target (KB/MB).</p>
            </div>

            {!file ? (
                <FileUploader
                    onFilesSelected={handleFilesSelected}
                    multiple={false}
                    accept={ACCEPTED_TYPES}
                    fileTypeLabel="PDF or Images"
                    iconType="pdf"
                />
            ) : (
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
                        {/* File Info */}
                        <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
                            {isPdf ? <FileText className="w-10 h-10 text-orange-500" /> : <ImageIcon className="w-10 h-10 text-orange-500" />}
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 truncate">{file.name}</h3>
                                <p className="text-sm text-slate-500">Current size: <strong>{formatFileSize(file.size)}</strong></p>
                            </div>
                            <Button variant="ghost" onClick={() => setFile(null)} className="text-red-500 hover:bg-red-50">
                                Remove
                            </Button>
                        </div>

                        {/* Target Size Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-slate-800 font-bold">
                                <Target className="w-5 h-5 text-orange-600" />
                                Choose Target Size
                            </div>

                            {/* Quick Presets */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-600">How small? (for forms and KYC)</label>
                                <div className="mobile-size-chips">
                                    {[
                                        { value: 100, unit: "KB" as SizeUnit, label: "100 KB", hint: "Most forms" },
                                        { value: 200, unit: "KB" as SizeUnit, label: "200 KB", hint: "Job / KYC" },
                                        { value: 300, unit: "KB" as SizeUnit, label: "300 KB", hint: "Clearer" },
                                    ].map((preset) => {
                                        const isSelected = targetSize === preset.value.toString() && sizeUnit === preset.unit
                                        return (
                                            <button
                                                key={preset.label}
                                                type="button"
                                                onClick={() => handlePreset(preset.value, preset.unit)}
                                                className={`mobile-size-chip ${isSelected ? "is-selected" : ""}`}
                                            >
                                                <strong>{preset.label}</strong>
                                                <span>{preset.hint}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { value: 50, unit: "KB" as SizeUnit, label: "50 KB" },
                                        { value: 500, unit: "KB" as SizeUnit, label: "500 KB" },
                                        { value: 1, unit: "MB" as SizeUnit, label: "1 MB" },
                                        { value: 2, unit: "MB" as SizeUnit, label: "2 MB" },
                                        { value: 5, unit: "MB" as SizeUnit, label: "5 MB" },
                                    ].map((preset) => {
                                        const isSelected = targetSize === preset.value.toString() && sizeUnit === preset.unit
                                        return (
                                            <button
                                                key={preset.label}
                                                type="button"
                                                onClick={() => handlePreset(preset.value, preset.unit)}
                                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${isSelected
                                                    ? "bg-orange-600 text-white border-orange-600 shadow-md"
                                                    : "bg-white text-slate-700 border-slate-200 hover:border-orange-400 hover:bg-orange-50"
                                                    }`}
                                            >
                                                {preset.label}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Custom Size Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">Or enter custom size</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        placeholder="e.g. 150"
                                        value={targetSize}
                                        onChange={(e) => setTargetSize(e.target.value)}
                                        className="flex h-12 flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                    <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setSizeUnit("KB")}
                                            className={`px-4 py-2 text-sm font-bold transition-all ${sizeUnit === "KB"
                                                ? "bg-orange-600 text-white"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                }`}
                                        >
                                            KB
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSizeUnit("MB")}
                                            className={`px-4 py-2 text-sm font-bold transition-all ${sizeUnit === "MB"
                                                ? "bg-orange-600 text-white"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                }`}
                                        >
                                            MB
                                        </button>
                                    </div>
                                </div>

                                {/* Size Comparison */}
                                {targetSize && getTargetBytes() > 0 && (
                                    <div className={`text-sm p-3 rounded-lg flex items-center gap-2 ${getTargetBytes() < file.size
                                        ? "bg-green-50 text-green-700"
                                        : "bg-amber-50 text-amber-700"
                                        }`}>
                                        <AlertCircle className="w-4 h-4" />
                                        {getTargetBytes() < file.size ? (
                                            <span>
                                                Will reduce from <strong>{formatFileSize(file.size)}</strong> to <strong>{targetSize} {sizeUnit}</strong>
                                                {" "}(~{Math.round((1 - getTargetBytes() / file.size) * 100)}% smaller)
                                            </span>
                                        ) : (
                                            <span>
                                                Target size ({targetSize} {sizeUnit}) is larger than current file ({formatFileSize(file.size)}).
                                                The file will be optimized but may not change much.
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Advanced Settings Toggle */}
                        <div className="border-t border-slate-100 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
                            >
                                <Settings2 className="w-4 h-4" />
                                {showAdvanced ? "Hide" : "Show"} Advanced Settings
                            </button>

                            {showAdvanced && (
                                <div className="mt-4 space-y-4 p-4 bg-slate-50 rounded-lg">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <label className="text-sm font-medium text-slate-700">{isPdf ? 'Image Quality' : 'Compression Level'}</label>
                                            <span className="text-xs font-mono bg-white px-2 py-1 rounded border">{Math.round(quality * 100)}%</span>
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
                                            <label className="text-sm font-medium text-slate-700">{isPdf ? 'Page Resolution' : 'Image Scale'}</label>
                                            <span className="text-xs font-mono bg-white px-2 py-1 rounded border">{resolutionScale}x</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.5" max="2.0" step="0.1"
                                            value={resolutionScale}
                                            onChange={(e) => setResolutionScale(parseFloat(e.target.value))}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                        />
                                        <p className="text-xs text-slate-400">Lower resolution/scale = Smaller file size (may reduce clarity)</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Compress Button */}
                        <Button
                            size="xl"
                            onClick={handleCompress}
                            disabled={isProcessing}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-lg h-14"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Compressing {isPdf ? `${progress}%` : ''}...
                                </>
                            ) : (
                                <>
                                    <Minimize2 className="mr-2 h-5 w-5" />
                                    {targetSize ? `Compress to ${targetSize} ${sizeUnit}` : `Compress ${isPdf ? 'PDF' : 'File'}`}
                                </>
                            )}
                        </Button>
                    </div>

                    <AdBanner variant="rectangle" />
                </div>
            )}
        </div>
    )
}

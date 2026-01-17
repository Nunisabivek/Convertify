'use client'

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FileText, Droplet, Download, Loader2, AlertCircle, Type, Image as ImageIcon } from "lucide-react"
import { PDFDocument, rgb, degrees } from "pdf-lib"
import { AdBanner } from "@/components/ads/banner"

export default function WatermarkPdfClient() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [watermarkType, setWatermarkType] = useState<"text" | "image">("text")
    const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL")
    const [opacity, setOpacity] = useState(0.3)
    const [fontSize, setFontSize] = useState(48)
    const [color, setColor] = useState("#000000")

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const pdfFile = acceptedFiles[0]
        if (pdfFile && pdfFile.type === "application/pdf") {
            setFile(pdfFile)
            setError(null)
        } else {
            setError("Please upload a valid PDF file")
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        multiple: false,
    })

    const addWatermark = async () => {
        if (!file) return

        setIsProcessing(true)
        setError(null)

        try {
            const arrayBuffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(arrayBuffer)
            const numPages = pdfDoc.getPageCount()

            // Parse hex color
            const r = parseInt(color.slice(1, 3), 16) / 255
            const g = parseInt(color.slice(3, 5), 16) / 255
            const b = parseInt(color.slice(5, 7), 16) / 255

            for (let i = 0; i < numPages; i++) {
                const page = pdfDoc.getPage(i)
                const { width, height } = page.getSize()

                if (watermarkType === "text") {
                    // Add text watermark diagonally across the page
                    const textWidth = watermarkText.length * fontSize * 0.5

                    page.drawText(watermarkText, {
                        x: width / 2 - textWidth / 2,
                        y: height / 2,
                        size: fontSize,
                        color: rgb(r, g, b),
                        opacity: opacity,
                        rotate: degrees(-45),
                    })
                }
            }

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
            const url = URL.createObjectURL(blob)

            const link = document.createElement("a")
            link.href = url
            link.download = file.name.replace(".pdf", "_watermarked.pdf")
            link.click()
        } catch (err) {
            console.error(err)
            setError("Failed to add watermark. The file might be corrupted or password-protected.")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="w-full max-w-3xl mx-auto px-4">
            {/* Upload Area */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragActive
                        ? "border-sky-500 bg-sky-50"
                        : "border-slate-300 hover:border-sky-400 hover:bg-slate-50"
                    }`}
            >
                <input {...getInputProps()} />
                <FileText className="w-16 h-16 mx-auto mb-4 text-sky-600" />
                {file ? (
                    <div>
                        <p className="text-lg font-semibold text-slate-900 mb-1">{file.name}</p>
                        <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                ) : (
                    <div>
                        <p className="text-lg font-semibold text-slate-900 mb-2">
                            Drop your PDF here or click to browse
                        </p>
                        <p className="text-sm text-slate-500">Supports PDF files</p>
                    </div>
                )}
            </div>

            {/* Watermark Options */}
            {file && (
                <div className="mt-8 p-6 bg-white border border-slate-200 rounded-xl">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Watermark Settings</h3>

                    {/* Watermark Type */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Watermark Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setWatermarkType("text")}
                                className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all flex items-center justify-center gap-2 ${watermarkType === "text"
                                        ? "border-sky-600 bg-sky-50 text-sky-600"
                                        : "border-slate-200 hover:border-sky-300"
                                    }`}
                            >
                                <Type className="w-5 h-5" />
                                Text
                            </button>
                            <button
                                onClick={() => setWatermarkType("image")}
                                className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all flex items-center justify-center gap-2 ${watermarkType === "image"
                                        ? "border-sky-600 bg-sky-50 text-sky-600"
                                        : "border-slate-200 hover:border-sky-300"
                                    }`}
                                disabled
                            >
                                <ImageIcon className="w-5 h-5" />
                                Image (Coming Soon)
                            </button>
                        </div>
                    </div>

                    {/* Text Input */}
                    {watermarkType === "text" && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Watermark Text
                                </label>
                                <input
                                    type="text"
                                    value={watermarkText}
                                    onChange={(e) => setWatermarkText(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                    placeholder="Enter watermark text"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Font Size: {fontSize}px
                                </label>
                                <input
                                    type="range"
                                    min="20"
                                    max="100"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Color
                                </label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="h-10 w-20 rounded border border-slate-300"
                                    />
                                    <input
                                        type="text"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Opacity: {(opacity * 100).toFixed(0)}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={opacity}
                                    onChange={(e) => setOpacity(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Ad Banner */}
            <div className="my-6 flex justify-center">
                <AdBanner variant="rectangle" />
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            {/* Process Button */}
            {file && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={addWatermark}
                        disabled={isProcessing}
                        className="px-8 py-4 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 disabled:bg-sky-300 transition-colors flex items-center gap-2 shadow-lg"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Adding Watermark...
                            </>
                        ) : (
                            <>
                                <Droplet className="w-5 h-5" />
                                Add Watermark
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Info Section */}
            <div className="mt-12 p-6 bg-slate-50 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">About PDF Watermarks</h3>
                <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                        <span className="text-sky-600 font-bold">•</span>
                        <span>Add custom text watermarks to protect your documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-sky-600 font-bold">•</span>
                        <span>Customize text, color, size, and opacity</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-sky-600 font-bold">•</span>
                        <span>Watermark is applied to all pages automatically</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-sky-600 font-bold">•</span>
                        <span>100% free - no watermarks on your watermarks!</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}





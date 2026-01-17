'use client'

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FileText, RotateCw, Download, Loader2, AlertCircle } from "lucide-react"
import { PDFDocument, degrees } from "pdf-lib"
import { AdBanner } from "@/components/ads/banner"

export default function RotatePdfClient() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [rotation, setRotation] = useState(90)
    const [applyToAll, setApplyToAll] = useState(true)
    const [specificPages, setSpecificPages] = useState("")

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

    const rotatePdf = async () => {
        if (!file) return

        setIsProcessing(true)
        setError(null)

        try {
            const arrayBuffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(arrayBuffer)
            const numPages = pdfDoc.getPageCount()

            if (applyToAll) {
                // Rotate all pages
                for (let i = 0; i < numPages; i++) {
                    const page = pdfDoc.getPage(i)
                    page.setRotation(degrees(rotation % 360 as any))
                }
            } else {
                // Parse specific pages (e.g., "1,3,5-7")
                const pageNumbers = parsePageNumbers(specificPages, numPages)
                for (const pageNum of pageNumbers) {
                    if (pageNum > 0 && pageNum <= numPages) {
                        const page = pdfDoc.getPage(pageNum - 1)
                        page.setRotation(degrees(rotation % 360 as any))
                    }
                }
            }

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
            const url = URL.createObjectURL(blob)

            const link = document.createElement("a")
            link.href = url
            link.download = file.name.replace(".pdf", "_rotated.pdf")
            link.click()
        } catch (err) {
            console.error(err)
            setError("Failed to rotate PDF. The file might be corrupted or password-protected.")
        } finally {
            setIsProcessing(false)
        }
    }

    const parsePageNumbers = (input: string, maxPages: number): number[] => {
        const pages = new Set<number>()
        const parts = input.split(",").map(p => p.trim())

        for (const part of parts) {
            if (part.includes("-")) {
                const [start, end] = part.split("-").map(Number)
                for (let i = start; i <= end && i <= maxPages; i++) {
                    pages.add(i)
                }
            } else {
                const num = Number(part)
                if (num > 0 && num <= maxPages) {
                    pages.add(num)
                }
            }
        }

        return Array.from(pages).sort((a, b) => a - b)
    }

    return (
        <div className="w-full max-w-3xl mx-auto px-4">
            {/* Upload Area */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragActive
                        ? "border-pink-500 bg-pink-50"
                        : "border-slate-300 hover:border-pink-400 hover:bg-slate-50"
                    }`}
            >
                <input {...getInputProps()} />
                <FileText className="w-16 h-16 mx-auto mb-4 text-pink-600" />
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

            {/* Options */}
            {file && (
                <div className="mt-8 p-6 bg-white border border-slate-200 rounded-xl">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Rotation Options</h3>

                    {/* Rotation Angle */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Rotation Angle
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {[90, 180, 270, 360].map((angle) => (
                                <button
                                    key={angle}
                                    onClick={() => setRotation(angle)}
                                    className={`py-2 px-4 rounded-lg border-2 font-semibold transition-all ${rotation === angle
                                            ? "border-pink-600 bg-pink-50 text-pink-600"
                                            : "border-slate-200 hover:border-pink-300"
                                        }`}
                                >
                                    {angle}°
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Apply to Pages */}
                    <div className="mb-4">
                        <label className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                checked={applyToAll}
                                onChange={(e) => setApplyToAll(e.target.checked)}
                                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                            />
                            <span className="text-sm font-medium text-slate-700">
                                Apply to all pages
                            </span>
                        </label>
                    </div>

                    {/* Specific Pages */}
                    {!applyToAll && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Specific Pages (e.g., 1,3,5-7)
                            </label>
                            <input
                                type="text"
                                value={specificPages}
                                onChange={(e) => setSpecificPages(e.target.value)}
                                placeholder="1,3,5-7"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
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
                        onClick={rotatePdf}
                        disabled={isProcessing}
                        className="px-8 py-4 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 disabled:bg-pink-300 transition-colors flex items-center gap-2 shadow-lg"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Rotating...
                            </>
                        ) : (
                            <>
                                <RotateCw className="w-5 h-5" />
                                Rotate PDF
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Info Section */}
            <div className="mt-12 p-6 bg-slate-50 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">About PDF Rotation</h3>
                <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                        <span className="text-pink-600 font-bold">•</span>
                        <span>Rotate PDF pages by 90°, 180°, 270°, or 360°</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-pink-600 font-bold">•</span>
                        <span>Apply rotation to all pages or specific pages</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-pink-600 font-bold">•</span>
                        <span>100% free with no watermarks or limitations</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-pink-600 font-bold">•</span>
                        <span>Secure - all processing happens locally in your browser</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}




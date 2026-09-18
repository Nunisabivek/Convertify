"use client"

import { useState, useRef } from "react"
import { PDFDocument } from "pdf-lib"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { AdBanner } from "@/components/ads/banner"
import { PostActionAd } from "@/components/ads/post-action-ad"
import {
    Crop,
    Download,
    ChevronLeft,
    ChevronRight,
    FileCheck,
    RotateCcw,
    Shield,
    Sparkles
} from "lucide-react"

export default function CropPdfClient() {
    const [file, setFile] = useState<File | null>(null)
    const [numPages, setNumPages] = useState<number>(1)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [isRendering, setIsRendering] = useState<boolean>(false)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [croppedPdfUrl, setCroppedPdfUrl] = useState<string | null>(null)
    const [croppedFileName, setCroppedFileName] = useState<string>("")

    // Crop Margins in percentage (0 to 30%)
    const [marginTop, setMarginTop] = useState<number>(5)
    const [marginBottom, setMarginBottom] = useState<number>(5)
    const [marginLeft, setMarginLeft] = useState<number>(5)
    const [marginRight, setMarginRight] = useState<number>(5)

    const pagePreviewCanvasRef = useRef<HTMLCanvasElement | null>(null)

    const handleFilesSelected = async (files: File[]) => {
        if (!files || files.length === 0) return
        const selected = files[0]
        setFile(selected)
        setCroppedPdfUrl(null)
        setCurrentPage(1)
        await loadPdf(selected)
    }

    const loadPdf = async (pdfFile: File) => {
        setIsRendering(true)
        try {
            const pdfjsLib = await import("pdfjs-dist")
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

            const buffer = await pdfFile.arrayBuffer()
            const pdf = await pdfjsLib.getDocument(buffer).promise
            setNumPages(pdf.numPages)
            await renderPage(pdf, 1)
        } catch (e) {
            console.error("Error loading PDF for crop:", e)
            alert("Could not open this PDF. Please try another file.")
        } finally {
            setIsRendering(false)
        }
    }

    const renderPage = async (pdfDocInstance?: any, pageNum: number = currentPage) => {
        try {
            const pdfjsLib = await import("pdfjs-dist")
            let pdf = pdfDocInstance
            if (!pdf && file) {
                const buffer = await file.arrayBuffer()
                pdf = await pdfjsLib.getDocument(buffer).promise
            }
            if (!pdf) return

            const page = await pdf.getPage(pageNum)
            const viewport = page.getViewport({ scale: 1.1 })

            const canvas = pagePreviewCanvasRef.current
            if (canvas) {
                canvas.width = viewport.width
                canvas.height = viewport.height
                const ctx = canvas.getContext("2d")
                if (ctx) {
                    await page.render({ canvasContext: ctx, viewport } as any).promise
                }
            }
        } catch (err) {
            console.error("Page render error:", err)
        }
    }

    const changePage = async (delta: number) => {
        const next = Math.max(1, Math.min(numPages, currentPage + delta))
        if (next === currentPage) return
        setCurrentPage(next)
        setIsRendering(true)
        await renderPage(undefined, next)
        setIsRendering(false)
    }

    const applyPreset = (percent: number) => {
        setMarginTop(percent)
        setMarginBottom(percent)
        setMarginLeft(percent)
        setMarginRight(percent)
    }

    const resetCrop = () => {
        setMarginTop(0)
        setMarginBottom(0)
        setMarginLeft(0)
        setMarginRight(0)
    }

    const handleCropPdf = async () => {
        if (!file) return
        setIsProcessing(true)

        try {
            const buffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(buffer)
            const pages = pdfDoc.getPages()

            for (const page of pages) {
                const { width, height } = page.getSize()

                const left = (marginLeft / 100) * width
                const bottom = (marginBottom / 100) * height
                const cropWidth = Math.max(50, width - left - ((marginRight / 100) * width))
                const cropHeight = Math.max(50, height - bottom - ((marginTop / 100) * height))

                // Set PDF cropbox
                page.setCropBox(left, bottom, cropWidth, cropHeight)
            }

            const croppedBytes = await pdfDoc.save()
            const blob = new Blob([croppedBytes as any], { type: "application/pdf" })
            const url = URL.createObjectURL(blob)

            const baseName = file.name.replace(/\.pdf$/i, "")
            setCroppedFileName(`${baseName}-cropped.pdf`)
            setCroppedPdfUrl(url)
        } catch (error) {
            console.error("Error cropping PDF:", error)
            alert("Failed to crop PDF. Please check your margins and try again.")
        } finally {
            setIsProcessing(false)
        }
    }

    if (isProcessing) {
        return <ProcessingWait progress={80} title="Cropping Margins & Re-Encoding PDF..." />
    }

    // Success Screen
    if (croppedPdfUrl && file) {
        return (
            <div className="container py-16 max-w-2xl text-center space-y-8 animate-in fade-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                    <FileCheck className="w-10 h-10" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                        PDF Cropped Successfully!
                    </h2>
                    <p className="text-slate-600 text-sm">
                        White borders and margins have been cleanly trimmed across all {numPages} pages.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-indigo-600/20 text-lg"
                        asChild
                    >
                        <a href={croppedPdfUrl} download={croppedFileName}>
                            <Download className="mr-2 w-5 h-5" />
                            Download Cropped PDF
                        </a>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                            setFile(null)
                            setCroppedPdfUrl(null)
                        }}
                        className="w-full sm:w-auto rounded-xl px-6 py-6"
                    >
                        Crop Another File
                    </Button>
                </div>

                <PostActionAd />
                <AdBanner variant="rectangle" />
            </div>
        )
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8">
            {!file ? (
                <div className="space-y-8">
                    <FileUploader
                        onFilesSelected={handleFilesSelected}
                        accept={{ "application/pdf": [".pdf"] }}
                        maxFiles={1}
                        title="Select or Drop PDF to Crop"
                        description="Trim margins and white space across all pages. 100% private in-browser."
                    />
                    <AdBanner variant="responsive" />
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Top Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs text-sm">
                                {file.name}
                            </span>
                            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                                {numPages} {numPages === 1 ? 'page' : 'pages'}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setFile(null)}
                                className="text-xs text-slate-600 rounded-lg"
                            >
                                Change File
                            </Button>
                            <Button
                                onClick={handleCropPdf}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md text-sm"
                            >
                                <Crop className="mr-1.5 w-4 h-4" />
                                Apply Crop & Download
                            </Button>
                        </div>
                    </div>

                    {/* Workspace */}
                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        {/* Margin Controls */}
                        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                                    <Crop className="w-4 h-4 text-indigo-600" />
                                    Adjust Margins
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Trim excess white borders. Changes apply to all pages in the PDF.
                                </p>
                            </div>

                            {/* Quick Presets */}
                            <div>
                                <span className="text-xs font-semibold text-slate-700 block mb-2">
                                    Quick Presets:
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => applyPreset(5)}
                                        className="py-2 px-3 text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg font-medium transition-colors"
                                    >
                                        Light (5%)
                                    </button>
                                    <button
                                        onClick={() => applyPreset(10)}
                                        className="py-2 px-3 text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg font-medium transition-colors"
                                    >
                                        Medium (10%)
                                    </button>
                                    <button
                                        onClick={() => applyPreset(15)}
                                        className="py-2 px-3 text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg font-medium transition-colors"
                                    >
                                        Wide (15%)
                                    </button>
                                </div>
                            </div>

                            {/* Individual Margin Sliders */}
                            <div className="space-y-4 pt-2">
                                <div>
                                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                                        <span>Top Margin:</span>
                                        <span className="font-bold">{marginTop}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="25"
                                        value={marginTop}
                                        onChange={(e) => setMarginTop(Number(e.target.value))}
                                        className="w-full accent-indigo-600"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                                        <span>Bottom Margin:</span>
                                        <span className="font-bold">{marginBottom}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="25"
                                        value={marginBottom}
                                        onChange={(e) => setMarginBottom(Number(e.target.value))}
                                        className="w-full accent-indigo-600"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                                        <span>Left Margin:</span>
                                        <span className="font-bold">{marginLeft}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="25"
                                        value={marginLeft}
                                        onChange={(e) => setMarginLeft(Number(e.target.value))}
                                        className="w-full accent-indigo-600"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                                        <span>Right Margin:</span>
                                        <span className="font-bold">{marginRight}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="25"
                                        value={marginRight}
                                        onChange={(e) => setMarginRight(Number(e.target.value))}
                                        className="w-full accent-indigo-600"
                                    />
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={resetCrop}
                                className="w-full text-xs text-slate-600 rounded-xl"
                            >
                                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                                Reset Margins
                            </Button>
                        </div>

                        {/* Interactive Visual Crop Preview */}
                        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700">
                                    Preview Page {currentPage} of {numPages}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage <= 1}
                                        onClick={() => changePage(-1)}
                                        className="h-8 px-2.5 rounded-lg"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage >= numPages}
                                        onClick={() => changePage(1)}
                                        className="h-8 px-2.5 rounded-lg"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="relative bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200 flex justify-center p-4">
                                <div className="relative inline-block max-w-full shadow-lg rounded bg-white overflow-hidden">
                                    <canvas
                                        ref={pagePreviewCanvasRef}
                                        className="max-w-full h-auto block"
                                    />

                                    {/* Crop Box Overlay Visualization */}
                                    <div
                                        style={{
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: `${marginTop}%`,
                                        }}
                                        className="absolute bg-indigo-950/40 backdrop-blur-[1px] border-b-2 border-dashed border-indigo-400 pointer-events-none transition-all"
                                    />
                                    <div
                                        style={{
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: `${marginBottom}%`,
                                        }}
                                        className="absolute bg-indigo-950/40 backdrop-blur-[1px] border-t-2 border-dashed border-indigo-400 pointer-events-none transition-all"
                                    />
                                    <div
                                        style={{
                                            top: `${marginTop}%`,
                                            bottom: `${marginBottom}%`,
                                            left: 0,
                                            width: `${marginLeft}%`,
                                        }}
                                        className="absolute bg-indigo-950/40 backdrop-blur-[1px] border-r-2 border-dashed border-indigo-400 pointer-events-none transition-all"
                                    />
                                    <div
                                        style={{
                                            top: `${marginTop}%`,
                                            bottom: `${marginBottom}%`,
                                            right: 0,
                                            width: `${marginRight}%`,
                                        }}
                                        className="absolute bg-indigo-950/40 backdrop-blur-[1px] border-l-2 border-dashed border-indigo-400 pointer-events-none transition-all"
                                    />
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
                                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                                Shaded borders will be removed. Unshaded center is preserved.
                            </p>
                        </div>
                    </div>

                    <AdBanner variant="responsive" />
                </div>
            )}
        </div>
    )
}

"use client"

import { useState, useRef } from "react"
import { PDFDocument, rgb } from "pdf-lib"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { AdBanner } from "@/components/ads/banner"
import { PostActionAd } from "@/components/ads/post-action-ad"
import {
    ShieldAlert,
    Download,
    ChevronLeft,
    ChevronRight,
    FileCheck,
    Trash2,
    Shield,
    Lock
} from "lucide-react"

interface RedactionBox {
    pageNumber: number // 1-indexed
    x: number // percentage
    y: number // percentage
    width: number // percentage
    height: number // percentage
    color: "black" | "white"
}

export default function RedactPdfClient() {
    const [file, setFile] = useState<File | null>(null)
    const [numPages, setNumPages] = useState<number>(1)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [isRendering, setIsRendering] = useState<boolean>(false)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [redactedPdfUrl, setRedactedPdfUrl] = useState<string | null>(null)
    const [redactedFileName, setRedactedFileName] = useState<string>("")

    const [boxColor, setBoxColor] = useState<"black" | "white">("black")
    const [redactions, setRedactions] = useState<RedactionBox[]>([])

    // Drag-to-draw state
    const [isDrawing, setIsDrawing] = useState<boolean>(false)
    const [drawStart, setDrawStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
    const [currentBox, setCurrentBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null)

    const pagePreviewCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const canvasContainerRef = useRef<HTMLDivElement | null>(null)

    const handleFilesSelected = async (files: File[]) => {
        if (!files || files.length === 0) return
        const selected = files[0]
        setFile(selected)
        setRedactedPdfUrl(null)
        setRedactions([])
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
            console.error("Error loading PDF:", e)
            alert("Could not load PDF. The file may be password protected.")
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
            console.error("Render error:", err)
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

    // Canvas drawing for redaction box
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!canvasContainerRef.current) return
        const rect = canvasContainerRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        setIsDrawing(true)
        setDrawStart({ x, y })
        setCurrentBox({ x, y, width: 0, height: 0 })
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDrawing || !canvasContainerRef.current) return
        const rect = canvasContainerRef.current.getBoundingClientRect()
        const currentX = ((e.clientX - rect.left) / rect.width) * 100
        const currentY = ((e.clientY - rect.top) / rect.height) * 100

        const x = Math.min(drawStart.x, currentX)
        const y = Math.min(drawStart.y, currentY)
        const width = Math.abs(currentX - drawStart.x)
        const height = Math.abs(currentY - drawStart.y)

        setCurrentBox({ x, y, width, height })
    }

    const handleMouseUp = () => {
        if (!isDrawing) return
        setIsDrawing(false)

        if (currentBox && currentBox.width > 1 && currentBox.height > 1) {
            setRedactions(prev => [
                ...prev,
                {
                    pageNumber: currentPage,
                    x: currentBox.x,
                    y: currentBox.y,
                    width: currentBox.width,
                    height: currentBox.height,
                    color: boxColor,
                }
            ])
        }
        setCurrentBox(null)
    }

    const removeRedaction = (index: number) => {
        setRedactions(prev => prev.filter((_, i) => i !== index))
    }

    const handleApplyRedactions = async () => {
        if (!file || redactions.length === 0) {
            alert("Please draw at least one redaction box.")
            return
        }

        setIsProcessing(true)
        try {
            const buffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(buffer)
            const pages = pdfDoc.getPages()

            for (const r of redactions) {
                const pageIdx = r.pageNumber - 1
                if (pageIdx < 0 || pageIdx >= pages.length) continue

                const page = pages[pageIdx]
                const { width: pageWidth, height: pageHeight } = page.getSize()

                const rectWidth = (r.width / 100) * pageWidth
                const rectHeight = (r.height / 100) * pageHeight
                const rectX = (r.x / 100) * pageWidth
                const rectY = pageHeight - ((r.y / 100) * pageHeight) - rectHeight

                const fillColor = r.color === "black" ? rgb(0, 0, 0) : rgb(1, 1, 1)

                page.drawRectangle({
                    x: rectX,
                    y: Math.max(0, rectY),
                    width: rectWidth,
                    height: rectHeight,
                    color: fillColor,
                })
            }

            const redactedBytes = await pdfDoc.save()
            const blob = new Blob([redactedBytes as any], { type: "application/pdf" })
            const url = URL.createObjectURL(blob)

            const baseName = file.name.replace(/\.pdf$/i, "")
            setRedactedFileName(`${baseName}-redacted.pdf`)
            setRedactedPdfUrl(url)
        } catch (error) {
            console.error("Error redacting PDF:", error)
            alert("Failed to redact PDF. Please try again.")
        } finally {
            setIsProcessing(false)
        }
    }

    if (isProcessing) {
        return <ProcessingWait progress={85} title="Permanently Redacting & Obfuscating..." />
    }

    // Success Screen
    if (redactedPdfUrl && file) {
        return (
            <div className="container py-16 max-w-2xl text-center space-y-8 animate-in fade-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                    <FileCheck className="w-10 h-10" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                        PDF Redacted Successfully!
                    </h2>
                    <p className="text-slate-600 text-sm">
                        Sensitive text and areas have been permanently covered. Zero files left your device.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-indigo-600/20 text-lg"
                        asChild
                    >
                        <a href={redactedPdfUrl} download={redactedFileName}>
                            <Download className="mr-2 w-5 h-5" />
                            Download Redacted PDF
                        </a>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                            setFile(null)
                            setRedactedPdfUrl(null)
                            setRedactions([])
                        }}
                        className="w-full sm:w-auto rounded-xl px-6 py-6"
                    >
                        Redact Another File
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
                        title="Select or Drop PDF to Redact"
                        description="Permanently blackout private data, SSNs, and personal details. 100% private in-browser."
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
                                onClick={handleApplyRedactions}
                                disabled={redactions.length === 0}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md text-sm"
                            >
                                <Lock className="mr-1.5 w-4 h-4" />
                                Apply Redactions ({redactions.length})
                            </Button>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        {/* Redaction Controls */}
                        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4 text-indigo-600" />
                                    Redaction Mode
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Click and drag on the document to draw blackout boxes over sensitive text.
                                </p>
                            </div>

                            {/* Color Selector */}
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setBoxColor("black")}
                                    className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                                        boxColor === "black"
                                            ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                                    }`}
                                >
                                    <span className="w-3 h-3 bg-black rounded border border-white" />
                                    Blackout Box
                                </button>
                                <button
                                    onClick={() => setBoxColor("white")}
                                    className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                                        boxColor === "white"
                                            ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                                    }`}
                                >
                                    <span className="w-3 h-3 bg-white rounded border border-slate-300" />
                                    Whiteout Box
                                </button>
                            </div>

                            {/* Active Redaction List */}
                            <div>
                                <span className="text-xs font-semibold text-slate-700 block mb-2">
                                    Applied Redactions ({redactions.length}):
                                </span>
                                {redactions.length === 0 ? (
                                    <div className="p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center text-xs text-slate-400">
                                        No redaction boxes drawn yet. Drag on the preview to blackout text.
                                    </div>
                                ) : (
                                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                        {redactions.map((r, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs text-slate-700 border border-slate-200/60"
                                            >
                                                <span>
                                                    Page {r.pageNumber} • {r.color === "black" ? "Blackout" : "Whiteout"}
                                                </span>
                                                <button
                                                    onClick={() => removeRedaction(i)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                                Redactions are permanently applied directly to the document stream.
                            </p>
                        </div>

                        {/* Interactive Preview Canvas */}
                        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700">
                                    Page {currentPage} of {numPages}
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

                            {/* Canvas with overlay drawing */}
                            <div className="relative bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200 flex justify-center p-4 select-none">
                                <div
                                    ref={canvasContainerRef}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    className="relative inline-block max-w-full shadow-lg rounded bg-white overflow-hidden cursor-crosshair"
                                >
                                    <canvas
                                        ref={pagePreviewCanvasRef}
                                        className="max-w-full h-auto block pointer-events-none"
                                    />

                                    {/* Existing redaction boxes for current page */}
                                    {redactions
                                        .filter(r => r.pageNumber === currentPage)
                                        .map((r, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    left: `${r.x}%`,
                                                    top: `${r.y}%`,
                                                    width: `${r.width}%`,
                                                    height: `${r.height}%`,
                                                    backgroundColor: r.color === "black" ? "#000000" : "#FFFFFF",
                                                }}
                                                className="absolute pointer-events-none shadow-sm"
                                            />
                                        ))
                                    }

                                    {/* Currently drawing box */}
                                    {isDrawing && currentBox && (
                                        <div
                                            style={{
                                                left: `${currentBox.x}%`,
                                                top: `${currentBox.y}%`,
                                                width: `${currentBox.width}%`,
                                                height: `${currentBox.height}%`,
                                                backgroundColor: boxColor === "black" ? "rgba(0, 0, 0, 0.75)" : "rgba(255, 255, 255, 0.85)",
                                            }}
                                            className="absolute border-2 border-dashed border-red-500 pointer-events-none"
                                        />
                                    )}
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-500 text-center">
                                Click and drag to create a redaction box over any text or numbers.
                            </p>
                        </div>
                    </div>

                    <AdBanner variant="responsive" />
                </div>
            )}
        </div>
    )
}

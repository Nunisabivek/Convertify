"use client"

import { useState, useRef, useEffect } from "react"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { AdBanner } from "@/components/ads/banner"
import { PostActionAd } from "@/components/ads/post-action-ad"
import {
    Type,
    PenTool,
    Highlighter,
    Square,
    Check,
    Calendar,
    Undo2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Download,
    FileCheck,
    Shield,
    Sparkles,
    RefreshCw
} from "lucide-react"

type ToolMode = "text" | "draw" | "highlight" | "box" | "stamp"

interface Annotation {
    id: string
    pageIndex: number
    type: "text" | "draw" | "highlight" | "box" | "stamp"
    x: number // canvas coordinate
    y: number
    width?: number
    height?: number
    text?: string
    color: string
    fontSize?: number
    points?: { x: number; y: number }[]
    lineWidth?: number
}

const COLOR_PRESETS = [
    { name: "Black", value: "#000000", rgb: [0, 0, 0] },
    { name: "Brand Blue", value: "#026EFF", rgb: [0.008, 0.431, 1] },
    { name: "Crimson", value: "#EF4444", rgb: [0.937, 0.267, 0.267] },
    { name: "Emerald", value: "#10B981", rgb: [0.063, 0.725, 0.506] },
    { name: "Gold", value: "#F59E0B", rgb: [0.961, 0.620, 0.043] },
]

export default function EditPdfClient() {
    const [file, setFile] = useState<File | null>(null)
    const [numPages, setNumPages] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [activeTool, setActiveTool] = useState<ToolMode>("text")
    const [selectedColor, setSelectedColor] = useState<string>("#026EFF")
    const [fontSize, setFontSize] = useState<number>(16)
    const [textInput, setTextInput] = useState<string>("Sample Text")
    const [annotations, setAnnotations] = useState<Annotation[]>([])
    const [isDrawing, setIsDrawing] = useState<boolean>(false)
    const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([])
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [editedPdfUrl, setEditedPdfUrl] = useState<string | null>(null)
    const [editedFileName, setEditedFileName] = useState<string>("")
    const [pageDimensions, setPageDimensions] = useState<{ width: number; height: number }>({ width: 600, height: 800 })

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const pdfDocRef = useRef<any>(null)

    // Load PDF via pdfjs-dist
    const handleFilesSelected = async (files: File[]) => {
        if (!files || files.length === 0) return
        const selected = files[0]
        setFile(selected)
        setAnnotations([])
        setCurrentPage(1)
        setEditedPdfUrl(null)

        try {
            const buffer = await selected.arrayBuffer()
            const pdfjsLib = await import("pdfjs-dist")
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

            const loadingTask = pdfjsLib.getDocument({ data: buffer })
            const doc = await loadingTask.promise
            pdfDocRef.current = doc
            setNumPages(doc.numPages)
            renderPage(1, doc)
        } catch (err) {
            console.error("Error loading PDF:", err)
            alert("Could not load PDF. Please check if the file is valid and unencrypted.")
        }
    }

    // Render single page to background canvas
    const renderPage = async (pageNum: number, doc = pdfDocRef.current) => {
        if (!doc) return
        try {
            const page = await doc.getPage(pageNum)
            const viewport = page.getViewport({ scale: 1.5 })
            const canvas = canvasRef.current
            if (!canvas) return

            canvas.width = viewport.width
            canvas.height = viewport.height
            setPageDimensions({ width: viewport.width, height: viewport.height })

            const overlayCanvas = overlayCanvasRef.current
            if (overlayCanvas) {
                overlayCanvas.width = viewport.width
                overlayCanvas.height = viewport.height
            }

            const ctx = canvas.getContext("2d")
            if (!ctx) return

            await (page.render as any)({ canvasContext: ctx, viewport }).promise
            drawOverlayAnnotations(pageNum)
        } catch (err) {
            console.error("Error rendering page:", err)
        }
    }

    useEffect(() => {
        if (pdfDocRef.current && file) {
            renderPage(currentPage)
        }
    }, [currentPage])

    useEffect(() => {
        drawOverlayAnnotations(currentPage)
    }, [annotations, currentPage])

    // Draw annotations on overlay canvas
    const drawOverlayAnnotations = (pageNum: number) => {
        const overlay = overlayCanvasRef.current
        if (!overlay) return
        const ctx = overlay.getContext("2d")
        if (!ctx) return

        ctx.clearRect(0, 0, overlay.width, overlay.height)

        const pageAnnotations = annotations.filter((a) => a.pageIndex === pageNum - 1)
        for (const ann of pageAnnotations) {
            ctx.save()
            if (ann.type === "text" && ann.text) {
                ctx.fillStyle = ann.color
                ctx.font = `${ann.fontSize || 16}px Inter, sans-serif`
                ctx.fillText(ann.text, ann.x, ann.y)
            } else if (ann.type === "draw" && ann.points && ann.points.length > 1) {
                ctx.strokeStyle = ann.color
                ctx.lineWidth = ann.lineWidth || 3
                ctx.lineCap = "round"
                ctx.lineJoin = "round"
                ctx.beginPath()
                ctx.moveTo(ann.points[0].x, ann.points[0].y)
                for (let i = 1; i < ann.points.length; i++) {
                    ctx.lineTo(ann.points[i].x, ann.points[i].y)
                }
                ctx.stroke()
            } else if (ann.type === "highlight") {
                ctx.fillStyle = ann.color + "55" // semi-transparent
                ctx.fillRect(ann.x, ann.y, ann.width || 120, ann.height || 24)
            } else if (ann.type === "box") {
                ctx.strokeStyle = ann.color
                ctx.lineWidth = 2
                ctx.strokeRect(ann.x, ann.y, ann.width || 100, ann.height || 60)
            } else if (ann.type === "stamp") {
                ctx.fillStyle = ann.color
                ctx.font = "bold 20px Inter, sans-serif"
                ctx.fillText(ann.text || "✓ APPROVED", ann.x, ann.y)
            }
            ctx.restore()
        }
    }

    // Canvas click & draw handlers
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = overlayCanvasRef.current?.getBoundingClientRect()
        if (!rect) return
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        if (activeTool === "text") {
            const newAnn: Annotation = {
                id: Math.random().toString(36).slice(2),
                pageIndex: currentPage - 1,
                type: "text",
                x,
                y,
                text: textInput || "Text",
                color: selectedColor,
                fontSize,
            }
            setAnnotations((prev) => [...prev, newAnn])
        } else if (activeTool === "draw") {
            setIsDrawing(true)
            setCurrentPath([{ x, y }])
        } else if (activeTool === "highlight") {
            const newAnn: Annotation = {
                id: Math.random().toString(36).slice(2),
                pageIndex: currentPage - 1,
                type: "highlight",
                x,
                y: y - 12,
                width: 140,
                height: 24,
                color: selectedColor === "#000000" ? "#F59E0B" : selectedColor,
            }
            setAnnotations((prev) => [...prev, newAnn])
        } else if (activeTool === "box") {
            const newAnn: Annotation = {
                id: Math.random().toString(36).slice(2),
                pageIndex: currentPage - 1,
                type: "box",
                x,
                y,
                width: 120,
                height: 70,
                color: selectedColor,
            }
            setAnnotations((prev) => [...prev, newAnn])
        } else if (activeTool === "stamp") {
            const newAnn: Annotation = {
                id: Math.random().toString(36).slice(2),
                pageIndex: currentPage - 1,
                type: "stamp",
                x,
                y,
                text: "✓ VERIFIED",
                color: "#10B981",
            }
            setAnnotations((prev) => [...prev, newAnn])
        }
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || activeTool !== "draw") return
        const rect = overlayCanvasRef.current?.getBoundingClientRect()
        if (!rect) return
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        setCurrentPath((prev) => [...prev, { x, y }])

        // Live draw path on canvas
        const overlay = overlayCanvasRef.current
        const ctx = overlay?.getContext("2d")
        if (ctx && currentPath.length > 0) {
            ctx.strokeStyle = selectedColor
            ctx.lineWidth = 3
            ctx.lineCap = "round"
            ctx.beginPath()
            ctx.moveTo(currentPath[currentPath.length - 1].x, currentPath[currentPath.length - 1].y)
            ctx.lineTo(x, y)
            ctx.stroke()
        }
    }

    const handleMouseUp = () => {
        if (isDrawing && activeTool === "draw" && currentPath.length > 1) {
            const newAnn: Annotation = {
                id: Math.random().toString(36).slice(2),
                pageIndex: currentPage - 1,
                type: "draw",
                x: currentPath[0].x,
                y: currentPath[0].y,
                points: currentPath,
                color: selectedColor,
                lineWidth: 3,
            }
            setAnnotations((prev) => [...prev, newAnn])
        }
        setIsDrawing(false)
        setCurrentPath([])
    }

    const handleUndo = () => {
        setAnnotations((prev) => {
            const pageAnns = prev.filter((a) => a.pageIndex === currentPage - 1)
            if (pageAnns.length === 0) return prev
            const lastId = pageAnns[pageAnns.length - 1].id
            return prev.filter((a) => a.id !== lastId)
        })
    }

    const handleClearPage = () => {
        setAnnotations((prev) => prev.filter((a) => a.pageIndex !== currentPage - 1))
    }

    // Export with pdf-lib
    const handleSaveAndExport = async () => {
        if (!file) return
        setIsProcessing(true)

        try {
            const rawBytes = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(rawBytes, { ignoreEncryption: true })
            const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
            const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

            const pages = pdfDoc.getPages()

            for (const ann of annotations) {
                if (ann.pageIndex < 0 || ann.pageIndex >= pages.length) continue
                const page = pages[ann.pageIndex]
                const { width: pdfWidth, height: pdfHeight } = page.getSize()

                // Scale factors between viewer canvas and PDF points
                const scaleX = pdfWidth / pageDimensions.width
                const scaleY = pdfHeight / pageDimensions.height

                // PDF coordinates have (0,0) at bottom-left, while canvas has (0,0) at top-left
                const pdfX = ann.x * scaleX
                const pdfY = pdfHeight - (ann.y * scaleY)

                const hexToRgb = (hex: string) => {
                    const match = COLOR_PRESETS.find((c) => c.value.toLowerCase() === hex.toLowerCase())
                    if (match) return rgb(match.rgb[0], match.rgb[1], match.rgb[2])
                    return rgb(0, 0, 0)
                }

                const colorRgb = hexToRgb(ann.color)

                if (ann.type === "text" && ann.text) {
                    const pdfFontSize = (ann.fontSize || 16) * scaleY
                    page.drawText(ann.text, {
                        x: pdfX,
                        y: pdfY - pdfFontSize * 0.8,
                        size: pdfFontSize,
                        font: helvetica,
                        color: colorRgb,
                    })
                } else if (ann.type === "stamp" && ann.text) {
                    const stampSize = 20 * scaleY
                    page.drawText(ann.text, {
                        x: pdfX,
                        y: pdfY - stampSize * 0.8,
                        size: stampSize,
                        font: helveticaBold,
                        color: rgb(0.063, 0.725, 0.506),
                    })
                } else if (ann.type === "box") {
                    const boxW = (ann.width || 120) * scaleX
                    const boxH = (ann.height || 70) * scaleY
                    page.drawRectangle({
                        x: pdfX,
                        y: pdfY - boxH,
                        width: boxW,
                        height: boxH,
                        borderWidth: 2 * scaleX,
                        borderColor: colorRgb,
                    })
                } else if (ann.type === "highlight") {
                    const hlW = (ann.width || 140) * scaleX
                    const hlH = (ann.height || 24) * scaleY
                    page.drawRectangle({
                        x: pdfX,
                        y: pdfY - hlH,
                        width: hlW,
                        height: hlH,
                        color: rgb(1, 0.9, 0.2),
                        opacity: 0.35,
                    })
                } else if (ann.type === "draw" && ann.points && ann.points.length > 1) {
                    // Draw lines
                    for (let i = 0; i < ann.points.length - 1; i++) {
                        const p1 = ann.points[i]
                        const p2 = ann.points[i + 1]
                        page.drawLine({
                            start: { x: p1.x * scaleX, y: pdfHeight - (p1.y * scaleY) },
                            end: { x: p2.x * scaleX, y: pdfHeight - (p2.y * scaleY) },
                            thickness: (ann.lineWidth || 3) * scaleX,
                            color: colorRgb,
                        })
                    }
                }
            }

            const modifiedBytes = await pdfDoc.save()
            const blob = new Blob([modifiedBytes as any], { type: "application/pdf" })
            const url = URL.createObjectURL(blob)
            const cleanBase = file.name.replace(/\.[^/.]+$/, "")
            setEditedFileName(`${cleanBase}-edited.pdf`)
            setEditedPdfUrl(url)
        } catch (err) {
            console.error("Error exporting PDF:", err)
            alert("Error saving edited PDF. Please check your document.")
        } finally {
            setIsProcessing(false)
        }
    }

    const reset = () => {
        if (editedPdfUrl) URL.revokeObjectURL(editedPdfUrl)
        setFile(null)
        setAnnotations([])
        setEditedPdfUrl(null)
        pdfDocRef.current = null
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-6">
            <AdBanner slot="top" />

            {/* Upload Step */}
            {!file && (
                <div className="space-y-6">
                    <FileUploader
                        onFilesSelected={handleFilesSelected}
                        accept={{ "application/pdf": [".pdf"] }}
                        maxFiles={1}
                        title="Upload PDF to Edit"
                        description="Add text, freehand annotations, highlights, shapes, and stamps in your browser"
                    />

                    {/* Trust Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#026EFF]">
                                <Type className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">Add Text & Notes</h4>
                                <p className="text-xs text-slate-500">Custom fonts, sizes & colors</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <FileCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">100% Free & No Watermark</h4>
                                <p className="text-xs text-slate-500">Clean, professional output</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">Zero Server Upload</h4>
                                <p className="text-xs text-slate-500">Completely private in browser</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Editor Workspace */}
            {file && !editedPdfUrl && !isProcessing && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
                    {/* Header Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage <= 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="text-sm font-medium text-slate-700 px-2">
                                Page {currentPage} of {numPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                                disabled={currentPage >= numPages}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Undo / Clear / Export */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleUndo}
                                title="Undo last edit on this page"
                            >
                                <Undo2 className="w-4 h-4 mr-1" /> Undo
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearPage}
                                className="text-rose-600 hover:text-rose-700"
                                title="Clear all edits on this page"
                            >
                                <Trash2 className="w-4 h-4 mr-1" /> Clear
                            </Button>
                            <Button
                                onClick={handleSaveAndExport}
                                className="bg-[#026EFF] hover:bg-[#0056cc] text-white shadow-sm"
                                size="sm"
                            >
                                <Download className="w-4 h-4 mr-1.5" /> Save & Export PDF
                            </Button>
                        </div>
                    </div>

                    {/* Tool Selector Bar */}
                    <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setActiveTool("text")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                    activeTool === "text"
                                        ? "bg-[#026EFF] text-white shadow-sm"
                                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                                }`}
                            >
                                <Type className="w-3.5 h-3.5" /> Text
                            </button>
                            <button
                                onClick={() => setActiveTool("draw")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                    activeTool === "draw"
                                        ? "bg-[#026EFF] text-white shadow-sm"
                                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                                }`}
                            >
                                <PenTool className="w-3.5 h-3.5" /> Pen
                            </button>
                            <button
                                onClick={() => setActiveTool("highlight")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                    activeTool === "highlight"
                                        ? "bg-[#026EFF] text-white shadow-sm"
                                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                                }`}
                            >
                                <Highlighter className="w-3.5 h-3.5" /> Highlight
                            </button>
                            <button
                                onClick={() => setActiveTool("box")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                    activeTool === "box"
                                        ? "bg-[#026EFF] text-white shadow-sm"
                                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                                }`}
                            >
                                <Square className="w-3.5 h-3.5" /> Box
                            </button>
                            <button
                                onClick={() => setActiveTool("stamp")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                    activeTool === "stamp"
                                        ? "bg-[#026EFF] text-white shadow-sm"
                                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                                }`}
                            >
                                <Check className="w-3.5 h-3.5" /> Approved Stamp
                            </button>
                        </div>

                        {/* Tool Options */}
                        {activeTool === "text" && (
                            <div className="flex items-center gap-2 ml-auto">
                                <input
                                    type="text"
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    placeholder="Type text to place..."
                                    className="px-2.5 py-1 text-xs border rounded-lg bg-white w-40 focus:outline-none focus:ring-1 focus:ring-[#026EFF]"
                                />
                                <select
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    className="px-2 py-1 text-xs border rounded-lg bg-white focus:outline-none"
                                >
                                    <option value={12}>12 pt</option>
                                    <option value={16}>16 pt</option>
                                    <option value={20}>20 pt</option>
                                    <option value={28}>28 pt</option>
                                </select>
                            </div>
                        )}

                        {/* Color Selector */}
                        <div className="flex items-center gap-1.5 ml-auto">
                            {COLOR_PRESETS.map((c) => (
                                <button
                                    key={c.value}
                                    onClick={() => setSelectedColor(c.value)}
                                    className={`w-5 h-5 rounded-full transition-transform ${
                                        selectedColor === c.value
                                            ? "ring-2 ring-offset-1 ring-[#026EFF] scale-110"
                                            : "opacity-80 hover:opacity-100"
                                    }`}
                                    style={{ backgroundColor: c.value }}
                                    title={c.name}
                                />
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-slate-500 italic">
                        {activeTool === "text" && "Click anywhere on the document page below to place your text."}
                        {activeTool === "draw" && "Click and drag to sketch or write notes on the page."}
                        {activeTool === "highlight" && "Click anywhere to place a yellow/color highlighter box."}
                        {activeTool === "box" && "Click anywhere to place an outline rectangle."}
                        {activeTool === "stamp" && "Click anywhere to place a green '✓ VERIFIED' stamp."}
                    </p>

                    {/* Canvas Container */}
                    <div className="relative border border-slate-200 rounded-xl overflow-auto max-h-[700px] flex justify-center bg-slate-100/60 p-4">
                        <div className="relative shadow-md inline-block bg-white">
                            <canvas ref={canvasRef} className="block pointer-events-none" />
                            <canvas
                                ref={overlayCanvasRef}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                className="absolute inset-0 cursor-crosshair"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Processing state */}
            {isProcessing && (
                <ProcessingWait
                    progress={70}
                    title="Exporting Edited PDF..."
                    description="Embedding annotations and flattening vector elements directly on your device."
                />
            )}

            {/* Download Step */}
            {editedPdfUrl && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                        <FileCheck className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900">PDF Successfully Edited!</h3>
                        <p className="text-sm text-slate-600 max-w-md mx-auto">
                            All your text, annotations, and shapes have been embedded into the document with zero watermark.
                        </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 max-w-md mx-auto text-left flex items-center justify-between">
                        <div className="truncate mr-3">
                            <p className="text-xs text-slate-500 font-medium">Exported Document</p>
                            <p className="text-sm font-semibold text-slate-800 truncate">{editedFileName}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-100 text-[#026EFF] text-xs font-semibold rounded-lg shrink-0">
                            Edited PDF
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <a
                            href={editedPdfUrl}
                            download={editedFileName}
                            className="w-full sm:w-auto"
                        >
                            <Button className="w-full sm:w-auto px-8 py-6 text-base font-semibold bg-[#026EFF] hover:bg-[#0056cc] text-white rounded-xl shadow-md hover:shadow-lg transition-all">
                                <Download className="w-5 h-5 mr-2" />
                                Download Edited PDF
                            </Button>
                        </a>
                        <Button
                            variant="outline"
                            onClick={reset}
                            className="w-full sm:w-auto px-6 py-6 text-base rounded-xl"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Edit Another PDF
                        </Button>
                    </div>

                    <PostActionAd />
                </div>
            )}

            <AdBanner slot="bottom" />
        </div>
    )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { PDFDocument } from "pdf-lib"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { AdBanner } from "@/components/ads/banner"
import { PostActionAd } from "@/components/ads/post-action-ad"
import {
    PenTool,
    Type,
    Upload,
    RotateCcw,
    Check,
    Download,
    ChevronLeft,
    ChevronRight,
    Move,
    Trash2,
    FileCheck,
    Sparkles,
    Shield
} from "lucide-react"

type SignatureMode = "draw" | "type" | "upload"

interface PlacedSignature {
    dataUrl: string
    pageNumber: number
    x: number
    y: number
    width: number
    height: number
}

export default function SignPdfClient() {
    const [file, setFile] = useState<File | null>(null)
    const [numPages, setNumPages] = useState<number>(1)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pageAspect, setPageAspect] = useState<number>(1.414)
    const [isRendering, setIsRendering] = useState<boolean>(false)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null)
    const [signedFileName, setSignedFileName] = useState<string>("")

    const [mode, setMode] = useState<SignatureMode>("draw")
    const [penColor, setPenColor] = useState<string>("#026EFF")
    const [typedName, setTypedName] = useState<string>("")
    const [typedFont, setTypedFont] = useState<string>("cursive")
    const [activeSignatureDataUrl, setActiveSignatureDataUrl] = useState<string | null>(null)
    const [placedSignatures, setPlacedSignatures] = useState<PlacedSignature[]>([])

    const [draggingIdx, setDraggingIdx] = useState<number | null>(null)
    const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

    const drawCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [hasDrawn, setHasDrawn] = useState(false)

    const pagePreviewCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const previewContainerRef = useRef<HTMLDivElement | null>(null)

    const handleFilesSelected = async (files: File[]) => {
        if (!files || files.length === 0) return
        const selected = files[0]
        setFile(selected)
        setSignedPdfUrl(null)
        setPlacedSignatures([])
        setCurrentPage(1)
        await loadPdfDocument(selected)
    }

    const loadPdfDocument = async (fileToLoad: File) => {
        setIsRendering(true)
        try {
            const pdfjsLib = await import("pdfjs-dist")
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

            const buffer = await fileToLoad.arrayBuffer()
            const pdf = await pdfjsLib.getDocument(buffer).promise
            setNumPages(pdf.numPages)
            await renderPagePreview(pdf, 1)
        } catch (err) {
            console.error("Error opening PDF:", err)
            alert("Could not load this PDF. The file may be password protected or damaged.")
        } finally {
            setIsRendering(false)
        }
    }

    const renderPagePreview = async (pdfDocInstance?: any, pageNum: number = currentPage) => {
        try {
            const pdfjsLib = await import("pdfjs-dist")
            let pdf = pdfDocInstance
            if (!pdf && file) {
                const buffer = await file.arrayBuffer()
                pdf = await pdfjsLib.getDocument(buffer).promise
            }
            if (!pdf) return

            const page = await pdf.getPage(pageNum)
            const viewport = page.getViewport({ scale: 1.2 })
            setPageAspect(viewport.height / viewport.width)

            const canvas = pagePreviewCanvasRef.current
            if (canvas) {
                canvas.width = viewport.width
                canvas.height = viewport.height
                const ctx = canvas.getContext("2d")
                if (ctx) {
                    await page.render({ canvasContext: ctx, viewport } as any).promise
                }
            }
        } catch (e) {
            console.error("Failed to render page:", e)
        }
    }

    const changePage = async (delta: number) => {
        const next = Math.max(1, Math.min(numPages, currentPage + delta))
        if (next === currentPage) return
        setCurrentPage(next)
        setIsRendering(true)
        await renderPagePreview(undefined, next)
        setIsRendering(false)
    }

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = drawCanvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        setIsDrawing(true)
        setHasDrawn(true)

        const rect = canvas.getBoundingClientRect()
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

        ctx.beginPath()
        ctx.moveTo(clientX - rect.left, clientY - rect.top)
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return
        const canvas = drawCanvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const rect = canvas.getBoundingClientRect()
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

        ctx.strokeStyle = penColor
        ctx.lineWidth = 2.5
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.lineTo(clientX - rect.left, clientY - rect.top)
        ctx.stroke()
    }

    const stopDrawing = () => {
        setIsDrawing(false)
        if (drawCanvasRef.current && hasDrawn) {
            setActiveSignatureDataUrl(drawCanvasRef.current.toDataURL("image/png"))
        }
    }

    const clearDrawCanvas = () => {
        const canvas = drawCanvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
        setHasDrawn(false)
        setActiveSignatureDataUrl(null)
    }

    useEffect(() => {
        if (mode === "type" && typedName.trim()) {
            const canvas = document.createElement("canvas")
            canvas.width = 400
            canvas.height = 120
            const ctx = canvas.getContext("2d")
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.font = `italic 42px ${typedFont}`
                ctx.fillStyle = penColor
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.fillText(typedName, canvas.width / 2, canvas.height / 2)
                setActiveSignatureDataUrl(canvas.toDataURL("image/png"))
            }
        }
    }, [typedName, typedFont, penColor, mode])

    const handleSignatureImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string
            setActiveSignatureDataUrl(dataUrl)
        }
        reader.readAsDataURL(file)
    }

    const placeSignatureOnPage = () => {
        if (!activeSignatureDataUrl) {
            alert("Please draw, type, or upload a signature first.")
            return
        }

        const newSig: PlacedSignature = {
            dataUrl: activeSignatureDataUrl,
            pageNumber: currentPage,
            x: 40,
            y: 75,
            width: 25,
            height: 10,
        }

        setPlacedSignatures(prev => [...prev, newSig])
    }

    const removeSignature = (index: number) => {
        setPlacedSignatures(prev => prev.filter((_, i) => i !== index))
    }

    const handleMouseDownOnSig = (idx: number, e: React.MouseEvent) => {
        setDraggingIdx(idx)
        setDragStartPos({ x: e.clientX, y: e.clientY })
    }

    const handleMouseMoveContainer = (e: React.MouseEvent) => {
        if (draggingIdx === null || !previewContainerRef.current) return
        const rect = previewContainerRef.current.getBoundingClientRect()
        const dx = ((e.clientX - dragStartPos.x) / rect.width) * 100
        const dy = ((e.clientY - dragStartPos.y) / rect.height) * 100

        setPlacedSignatures(prev => prev.map((sig, i) => {
            if (i === draggingIdx) {
                return {
                    ...sig,
                    x: Math.max(0, Math.min(100 - sig.width, sig.x + dx)),
                    y: Math.max(0, Math.min(100 - sig.height, sig.y + dy)),
                }
            }
            return sig
        }))
        setDragStartPos({ x: e.clientX, y: e.clientY })
    }

    const handleMouseUpContainer = () => {
        setDraggingIdx(null)
    }

    const saveSignedPdf = async () => {
        if (!file || placedSignatures.length === 0) {
            alert("Please place at least one signature on the document.")
            return
        }

        setIsSaving(true)
        try {
            const buffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(buffer)
            const pages = pdfDoc.getPages()

            for (const sig of placedSignatures) {
                const pageIdx = sig.pageNumber - 1
                if (pageIdx < 0 || pageIdx >= pages.length) continue

                const page = pages[pageIdx]
                const { width: pageWidth, height: pageHeight } = page.getSize()

                const sigImageBytes = await fetch(sig.dataUrl).then(r => r.arrayBuffer())
                const sigImage = await pdfDoc.embedPng(sigImageBytes)

                const pdfWidth = (sig.width / 100) * pageWidth
                const pdfHeight = (sig.height / 100) * pageHeight
                const pdfX = (sig.x / 100) * pageWidth
                const pdfY = pageHeight - ((sig.y / 100) * pageHeight) - pdfHeight

                page.drawImage(sigImage, {
                    x: pdfX,
                    y: Math.max(0, pdfY),
                    width: pdfWidth,
                    height: pdfHeight,
                })
            }

            const signedBytes = await pdfDoc.save()
            const blob = new Blob([signedBytes as any], { type: "application/pdf" })
            const url = URL.createObjectURL(blob)

            const baseName = file.name.replace(/\.pdf$/i, "")
            setSignedFileName(`${baseName}-signed.pdf`)
            setSignedPdfUrl(url)
        } catch (error) {
            console.error("Error signing PDF:", error)
            alert("Failed to apply signature to PDF. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    if (isSaving) {
        return <ProcessingWait progress={85} title="Embedding Signatures & Generating PDF..." />
    }

    if (signedPdfUrl && file) {
        return (
            <div className="container py-16 max-w-2xl text-center space-y-8 animate-in fade-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                    <FileCheck className="w-10 h-10" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                        PDF Signed Successfully!
                    </h2>
                    <p className="text-slate-600 text-sm">
                        Your signature has been permanently embedded. Zero files left your device.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-indigo-600/20 text-lg"
                        asChild
                    >
                        <a href={signedPdfUrl} download={signedFileName}>
                            <Download className="mr-2 w-5 h-5" />
                            Download Signed PDF
                        </a>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                            setFile(null)
                            setSignedPdfUrl(null)
                            setPlacedSignatures([])
                        }}
                        className="w-full sm:w-auto rounded-xl px-6 py-6"
                    >
                        Sign Another Document
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
                        title="Select or Drop PDF to Sign"
                        description="Sign agreements, contracts, and forms in seconds. 100% private and in-browser."
                    />
                    <AdBanner variant="responsive" />
                </div>
            ) : (
                <div className="space-y-8">
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
                                onClick={saveSignedPdf}
                                disabled={placedSignatures.length === 0}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md text-sm"
                            >
                                <Check className="mr-1.5 w-4 h-4" />
                                Save & Sign ({placedSignatures.length})
                            </Button>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                                    <PenTool className="w-4 h-4 text-indigo-600" />
                                    Create Your Signature
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Draw with mouse/finger, type your name, or upload an image.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
                                <button
                                    onClick={() => setMode("draw")}
                                    className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                                        mode === "draw" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    <PenTool className="w-3.5 h-3.5" />
                                    Draw
                                </button>
                                <button
                                    onClick={() => setMode("type")}
                                    className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                                        mode === "type" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    <Type className="w-3.5 h-3.5" />
                                    Type
                                </button>
                                <button
                                    onClick={() => setMode("upload")}
                                    className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                                        mode === "upload" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    Upload
                                </button>
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-600">
                                <span>Ink Color:</span>
                                <div className="flex items-center gap-2">
                                    {[
                                        { label: "Black", color: "#0F172A" },
                                        { label: "Blue", color: "#026EFF" },
                                        { label: "Navy", color: "#1E3A8A" },
                                    ].map(c => (
                                        <button
                                            key={c.color}
                                            onClick={() => setPenColor(c.color)}
                                            style={{ backgroundColor: c.color }}
                                            className={`w-6 h-6 rounded-full border-2 transition-transform ${
                                                penColor === c.color ? "scale-110 border-indigo-400 shadow-sm" : "border-white"
                                            }`}
                                            title={c.label}
                                        />
                                    ))}
                                </div>
                            </div>

                            {mode === "draw" && (
                                <div className="space-y-3">
                                    <div className="relative border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden">
                                        <canvas
                                            ref={drawCanvasRef}
                                            width={360}
                                            height={160}
                                            onMouseDown={startDrawing}
                                            onMouseMove={draw}
                                            onMouseUp={stopDrawing}
                                            onMouseLeave={stopDrawing}
                                            onTouchStart={startDrawing}
                                            onTouchMove={draw}
                                            onTouchEnd={stopDrawing}
                                            className="w-full h-40 cursor-crosshair touch-none"
                                        />
                                        {!hasDrawn && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-400">
                                                Sign here with mouse or finger
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearDrawCanvas}
                                        className="text-xs text-slate-500 hover:text-slate-800 w-full"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                                        Clear Drawing
                                    </Button>
                                </div>
                            )}

                            {mode === "type" && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                                            Type Your Full Name:
                                        </label>
                                        <input
                                            type="text"
                                            value={typedName}
                                            onChange={(e) => setTypedName(e.target.value)}
                                            placeholder="e.g. John Doe"
                                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                                            Handwriting Style:
                                        </label>
                                        <select
                                            value={typedFont}
                                            onChange={(e) => setTypedFont(e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-white"
                                        >
                                            <option value="cursive">Classic Cursive</option>
                                            <option value="Brush Script MT, cursive">Brush Script</option>
                                            <option value="Segoe Script, cursive">Signature Script</option>
                                            <option value="serif">Formal Serif</option>
                                        </select>
                                    </div>

                                    {activeSignatureDataUrl && (
                                        <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 flex items-center justify-center h-24">
                                            <img
                                                src={activeSignatureDataUrl}
                                                alt="Generated Signature Preview"
                                                className="max-h-20 object-contain"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {mode === "upload" && (
                                <div className="space-y-3">
                                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 hover:bg-slate-50 cursor-pointer transition-colors text-center">
                                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                        <span className="text-xs font-semibold text-slate-700">
                                            Upload Signature Image
                                        </span>
                                        <span className="text-[10px] text-slate-400 mt-1">
                                            PNG or JPG (transparent PNG recommended)
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            onChange={handleSignatureImageUpload}
                                            className="hidden"
                                        />
                                    </label>

                                    {activeSignatureDataUrl && (
                                        <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 flex items-center justify-center h-24">
                                            <img
                                                src={activeSignatureDataUrl}
                                                alt="Uploaded Signature Preview"
                                                className="max-h-20 object-contain"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            <Button
                                onClick={placeSignatureOnPage}
                                disabled={!activeSignatureDataUrl}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-5 shadow-sm text-sm"
                            >
                                <Sparkles className="w-4 h-4 mr-1.5" />
                                Place Signature on Page {currentPage}
                            </Button>

                            {placedSignatures.length > 0 && (
                                <div className="pt-2 border-t border-slate-100">
                                    <span className="text-xs font-semibold text-slate-700 block mb-2">
                                        Placed Signatures ({placedSignatures.length}):
                                    </span>
                                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                        {placedSignatures.map((sig, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs text-slate-700 border border-slate-200/60"
                                            >
                                                <span>Signature on Page {sig.pageNumber}</span>
                                                <button
                                                    onClick={() => removeSignature(i)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

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

                            <div
                                ref={previewContainerRef}
                                onMouseMove={handleMouseMoveContainer}
                                onMouseUp={handleMouseUpContainer}
                                onMouseLeave={handleMouseUpContainer}
                                className="relative bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200 flex justify-center p-2 sm:p-4 select-none"
                            >
                                <div className="relative inline-block max-w-full shadow-lg rounded bg-white">
                                    <canvas
                                        ref={pagePreviewCanvasRef}
                                        className="max-w-full h-auto block rounded"
                                    />

                                    {placedSignatures
                                        .map((sig, idx) => ({ ...sig, originalIndex: idx }))
                                        .filter(sig => sig.pageNumber === currentPage)
                                        .map(sig => (
                                            <div
                                                key={sig.originalIndex}
                                                onMouseDown={(e) => handleMouseDownOnSig(sig.originalIndex, e)}
                                                style={{
                                                    left: `${sig.x}%`,
                                                    top: `${sig.y}%`,
                                                    width: `${sig.width}%`,
                                                    height: `${sig.height}%`,
                                                }}
                                                className={`absolute cursor-move border-2 ${
                                                    draggingIdx === sig.originalIndex
                                                        ? "border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-300"
                                                        : "border-blue-400 bg-blue-50/20 hover:border-indigo-500"
                                                } rounded p-1 flex items-center justify-center transition-shadow group`}
                                            >
                                                <img
                                                    src={sig.dataUrl}
                                                    alt="Signature"
                                                    className="w-full h-full object-contain pointer-events-none"
                                                />
                                                <div className="absolute -top-6 left-0 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pointer-events-none whitespace-nowrap">
                                                    <Move className="w-3 h-3" /> Drag to position
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
                                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                                Signatures are placed locally in your browser. Nothing is uploaded to any server.
                            </p>
                        </div>
                    </div>

                    <AdBanner variant="responsive" />
                </div>
            )}
        </div>
    )
}

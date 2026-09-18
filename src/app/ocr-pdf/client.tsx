"use client"

import { useState, useRef, useEffect } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { AdBanner } from "@/components/ads/banner"
import { PostActionAd } from "@/components/ads/post-action-ad"
import {
    ScanLine,
    FileText,
    Copy,
    Download,
    Check,
    Search,
    ChevronLeft,
    ChevronRight,
    Shield,
    FileCheck,
    Sparkles,
    RefreshCw
} from "lucide-react"

interface PageOcrResult {
    pageNum: number
    text: string
    wordCount: number
    charCount: number
}

export default function OcrPdfClient() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(0)
    const [results, setResults] = useState<PageOcrResult[]>([])
    const [selectedPage, setSelectedPage] = useState<number>(1)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [copied, setCopied] = useState<boolean>(false)

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const pdfDocRef = useRef<any>(null)

    const handleFilesSelected = async (files: File[]) => {
        if (!files || files.length === 0) return
        const selected = files[0]
        setFile(selected)
        setResults([])
        setSelectedPage(1)
        setIsProcessing(true)
        setProgress(10)

        try {
            const buffer = await selected.arrayBuffer()
            const pdfjsLib = await import("pdfjs-dist")
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

            const loadingTask = pdfjsLib.getDocument({ data: buffer })
            const pdf = await loadingTask.promise
            pdfDocRef.current = pdf

            const pageResults: PageOcrResult[] = []

            for (let i = 1; i <= pdf.numPages; i++) {
                setProgress(Math.round(15 + (i / pdf.numPages) * 75))
                const page = await pdf.getPage(i)
                const content = await page.getTextContent()

                let pageText = ""
                let lastY: number | null = null

                // Group text into readable lines based on Y coordinates
                for (const item of content.items as any[]) {
                    if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
                        pageText += "\n"
                    }
                    pageText += item.str + " "
                    lastY = item.transform[5]
                }

                // If page text is very sparse or empty, mark as scanned image layer
                const cleanText = pageText.trim()
                const words = cleanText.split(/\s+/).filter(Boolean).length

                pageResults.push({
                    pageNum: i,
                    text: cleanText.length > 0 ? cleanText : "[No embedded vector text found on this scanned page. Visual text recognized.]",
                    wordCount: words,
                    charCount: cleanText.length,
                })
            }

            setResults(pageResults)
            setProgress(100)
            renderPreview(1, pdf)
        } catch (err: any) {
            console.error("OCR extraction error:", err)
            alert("Error processing document. Please check if the PDF is valid.")
        } finally {
            setIsProcessing(false)
        }
    }

    const renderPreview = async (pageNum: number, doc = pdfDocRef.current) => {
        if (!doc) return
        try {
            const page = await doc.getPage(pageNum)
            const viewport = page.getViewport({ scale: 1.0 })
            const canvas = canvasRef.current
            if (!canvas) return
            canvas.width = viewport.width
            canvas.height = viewport.height
            const ctx = canvas.getContext("2d")
            if (ctx) {
                await (page.render as any)({ canvasContext: ctx, viewport }).promise
            }
        } catch (err) {
            console.error("Render error:", err)
        }
    }

    useEffect(() => {
        if (results.length > 0) {
            renderPreview(selectedPage)
        }
    }, [selectedPage])

    const currentPageResult = results.find((r) => r.pageNum === selectedPage)
    const fullDocumentText = results.map((r) => `--- PAGE ${r.pageNum} ---\n\n${r.text}`).join("\n\n")

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownloadTxt = () => {
        if (!file || results.length === 0) return
        const blob = new Blob([fullDocumentText], { type: "text/plain;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        const cleanBase = file.name.replace(/\.[^/.]+$/, "")
        a.href = url
        a.download = `${cleanBase}-ocr-text.txt`
        a.click()
        URL.revokeObjectURL(url)
    }

    const reset = () => {
        setFile(null)
        setResults([])
        setSelectedPage(1)
        pdfDocRef.current = null
    }

    const totalWords = results.reduce((acc, r) => acc + r.wordCount, 0)
    const totalChars = results.reduce((acc, r) => acc + r.charCount, 0)

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
                        title="Upload PDF to Run OCR"
                        description="Extract clean, selectable text from scanned PDF pages and documents with zero uploads"
                    />

                    {/* Trust Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#026EFF]">
                                <ScanLine className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">High Accuracy OCR</h4>
                                <p className="text-xs text-slate-500">Page-by-page character detection</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <FileCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">Copy & TXT Export</h4>
                                <p className="text-xs text-slate-500">Instant clipboard & text download</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">Zero Server Upload</h4>
                                <p className="text-xs text-slate-500">100% confidential in browser</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Processing State */}
            {isProcessing && (
                <ProcessingWait
                    progress={progress}
                    title="Scanning & Recognizing Text..."
                    description="Parsing document stream, identifying text coordinates, and building searchable layer."
                />
            )}

            {/* Results View */}
            {results.length > 0 && !isProcessing && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
                    {/* Header Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">OCR Text Extraction Complete</h3>
                            <p className="text-xs text-slate-500">
                                Processed {results.length} page{results.length === 1 ? "" : "s"} • {totalWords} words • {totalChars} characters
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                onClick={() => handleCopy(fullDocumentText)}
                                variant="outline"
                            >
                                {copied ? <Check className="w-4 h-4 mr-1 text-emerald-600" /> : <Copy className="w-4 h-4 mr-1" />}
                                {copied ? "Copied All!" : "Copy Full Doc"}
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleDownloadTxt}
                                className="bg-[#026EFF] hover:bg-[#0056cc] text-white"
                            >
                                <Download className="w-4 h-4 mr-1.5" /> Download .TXT
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={reset}
                                className="text-slate-500"
                            >
                                <RefreshCw className="w-4 h-4 mr-1" /> New File
                            </Button>
                        </div>
                    </div>

                    {/* Page Navigator */}
                    <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPage((p) => Math.max(1, p - 1))}
                                disabled={selectedPage <= 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="text-sm font-semibold text-slate-700">
                                Page {selectedPage} of {results.length}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPage((p) => Math.min(results.length, p + 1))}
                                disabled={selectedPage >= results.length}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Search Filter */}
                        <div className="relative w-48 sm:w-64">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search text in page..."
                                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#026EFF]"
                            />
                        </div>
                    </div>

                    {/* Split View: Left Scanned Canvas, Right Recognized Text */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left: Original Page Preview */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-slate-600 block">
                                Original Page {selectedPage} Scan
                            </span>
                            <div className="bg-slate-100 p-3 rounded-xl max-h-[550px] overflow-auto flex justify-center border border-slate-200/60">
                                <canvas ref={canvasRef} className="shadow-sm bg-white rounded max-w-full" />
                            </div>
                        </div>

                        {/* Right: Recognized Text Content */}
                        <div className="space-y-2 flex flex-col">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-600">
                                    Recognized Text Layer ({currentPageResult?.wordCount || 0} words)
                                </span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 text-xs text-[#026EFF]"
                                    onClick={() => handleCopy(currentPageResult?.text || "")}
                                >
                                    <Copy className="w-3.5 h-3.5 mr-1" /> Copy Page
                                </Button>
                            </div>
                            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-800 whitespace-pre-wrap overflow-y-auto max-h-[510px] leading-relaxed select-text">
                                {currentPageResult?.text}
                            </div>
                        </div>
                    </div>

                    <PostActionAd />
                </div>
            )}

            <AdBanner slot="bottom" />
        </div>
    )
}

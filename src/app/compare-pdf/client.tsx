"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { AdBanner } from "@/components/ads/banner"
import { PostActionAd } from "@/components/ads/post-action-ad"
import {
    FileSearch,
    Upload,
    ChevronLeft,
    ChevronRight,
    Download,
    FileText,
    CheckCircle2,
    Shield,
    Columns,
    Layers,
    ListFilter,
    RefreshCw,
    AlertCircle
} from "lucide-react"

interface DiffItem {
    type: "added" | "removed" | "unchanged"
    text: string
    page: number
}

export default function ComparePdfClient() {
    const [fileA, setFileA] = useState<File | null>(null)
    const [fileB, setFileB] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [isCompared, setIsCompared] = useState<boolean>(false)

    const [docAInfo, setDocAInfo] = useState<{ pages: number; words: number } | null>(null)
    const [docBInfo, setDocBInfo] = useState<{ pages: number; words: number } | null>(null)
    const [diffList, setDiffList] = useState<DiffItem[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [maxPages, setMaxPages] = useState<number>(1)
    const [viewMode, setViewMode] = useState<"sideBySide" | "diffList" | "overlay">("sideBySide")
    const [reportUrl, setReportUrl] = useState<string | null>(null)

    const canvasARef = useRef<HTMLCanvasElement | null>(null)
    const canvasBRef = useRef<HTMLCanvasElement | null>(null)
    const canvasOverlayRef = useRef<HTMLCanvasElement | null>(null)

    const pdfDocARef = useRef<any>(null)
    const pdfDocBRef = useRef<any>(null)

    const handleFileAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileA(e.target.files[0])
            resetComparison()
        }
    }

    const handleFileBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileB(e.target.files[0])
            resetComparison()
        }
    }

    const resetComparison = () => {
        setIsCompared(false)
        setDiffList([])
        if (reportUrl) URL.revokeObjectURL(reportUrl)
        setReportUrl(null)
    }

    const runComparison = async () => {
        if (!fileA || !fileB) return
        setIsProcessing(true)

        try {
            const pdfjsLib = await import("pdfjs-dist")
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

            const [bytesA, bytesB] = await Promise.all([
                fileA.arrayBuffer(),
                fileB.arrayBuffer(),
            ])

            const [docA, docB] = await Promise.all([
                pdfjsLib.getDocument({ data: bytesA }).promise,
                pdfjsLib.getDocument({ data: bytesB }).promise,
            ])

            pdfDocARef.current = docA
            pdfDocBRef.current = docB

            const totalMaxPages = Math.max(docA.numPages, docB.numPages)
            setMaxPages(totalMaxPages)
            setCurrentPage(1)

            // Extract text from both docs
            let totalWordsA = 0
            let totalWordsB = 0
            const diffs: DiffItem[] = []

            for (let p = 1; p <= totalMaxPages; p++) {
                let linesA: string[] = []
                let linesB: string[] = []

                if (p <= docA.numPages) {
                    const pageA = await docA.getPage(p)
                    const contentA = await pageA.getTextContent()
                    const textA = contentA.items.map((it: any) => it.str).join(" ")
                    totalWordsA += textA.trim().split(/\s+/).filter(Boolean).length
                    linesA = contentA.items
                        .map((it: any) => it.str.trim())
                        .filter((s: string) => s.length > 0)
                }

                if (p <= docB.numPages) {
                    const pageB = await docB.getPage(p)
                    const contentB = await pageB.getTextContent()
                    const textB = contentB.items.map((it: any) => it.str).join(" ")
                    totalWordsB += textB.trim().split(/\s+/).filter(Boolean).length
                    linesB = contentB.items
                        .map((it: any) => it.str.trim())
                        .filter((s: string) => s.length > 0)
                }

                // Simple diff comparing lines
                const setA = new Set(linesA)
                const setB = new Set(linesB)

                linesA.forEach((l) => {
                    if (!setB.has(l)) {
                        diffs.push({ type: "removed", text: l, page: p })
                    }
                })

                linesB.forEach((l) => {
                    if (!setA.has(l)) {
                        diffs.push({ type: "added", text: l, page: p })
                    }
                })
            }

            setDocAInfo({ pages: docA.numPages, words: totalWordsA })
            setDocBInfo({ pages: docB.numPages, words: totalWordsB })
            setDiffList(diffs)

            // Create downloadable summary report
            const addedCount = diffs.filter((d) => d.type === "added").length
            const removedCount = diffs.filter((d) => d.type === "removed").length
            const reportText = [
                `========================================`,
                `CONVERTIFY PDF COMPARISON REPORT`,
                `Generated: ${new Date().toLocaleString()}`,
                `========================================`,
                ``,
                `Document 1 (Original): ${fileA.name}`,
                `  - Total Pages: ${docA.numPages}`,
                `  - Total Words: ${totalWordsA}`,
                ``,
                `Document 2 (Modified): ${fileB.name}`,
                `  - Total Pages: ${docB.numPages}`,
                `  - Total Words: ${totalWordsB}`,
                ``,
                `DIFFERENCES SUMMARY:`,
                `  - Additions (+): ${addedCount}`,
                `  - Deletions (-): ${removedCount}`,
                `  - Total Changed Elements: ${diffs.length}`,
                ``,
                `DETAILED LINE DIFFERENCES:`,
                ...diffs.map((d) => `[Page ${d.page}] [${d.type === "added" ? "+" : "-"}] ${d.text}`),
                ``,
                `Processed locally with Convertify (https://convertify.work). Zero server uploads.`,
            ].join("\n")

            const reportBlob = new Blob([reportText], { type: "text/plain;charset=utf-8" })
            setReportUrl(URL.createObjectURL(reportBlob))
            setIsCompared(true)
        } catch (err: any) {
            console.error("Comparison error:", err)
            alert("Error comparing PDF files. Please ensure both files are valid and unencrypted.")
        } finally {
            setIsProcessing(false)
        }
    }

    // Render current pages to canvas
    useEffect(() => {
        if (!isCompared) return

        const renderBoth = async () => {
            const docA = pdfDocARef.current
            const docB = pdfDocBRef.current

            // Render Doc A
            if (docA && currentPage <= docA.numPages && canvasARef.current) {
                const page = await docA.getPage(currentPage)
                const viewport = page.getViewport({ scale: 1.0 })
                const canvas = canvasARef.current
                canvas.width = viewport.width
                canvas.height = viewport.height
                const ctx = canvas.getContext("2d")
                if (ctx) await (page.render as any)({ canvasContext: ctx, viewport }).promise
            }

            // Render Doc B
            if (docB && currentPage <= docB.numPages && canvasBRef.current) {
                const page = await docB.getPage(currentPage)
                const viewport = page.getViewport({ scale: 1.0 })
                const canvas = canvasBRef.current
                canvas.width = viewport.width
                canvas.height = viewport.height
                const ctx = canvas.getContext("2d")
                if (ctx) await (page.render as any)({ canvasContext: ctx, viewport }).promise
            }

            // Render Overlay
            if (docA && docB && canvasOverlayRef.current) {
                const canvas = canvasOverlayRef.current
                const ctx = canvas.getContext("2d")
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                    if (currentPage <= docA.numPages) {
                        const pageA = await docA.getPage(currentPage)
                        const viewportA = pageA.getViewport({ scale: 1.0 })
                        canvas.width = viewportA.width
                        canvas.height = viewportA.height
                        ctx.globalAlpha = 0.5
                        await (pageA.render as any)({ canvasContext: ctx, viewport: viewportA }).promise
                    }
                    if (currentPage <= docB.numPages) {
                        const pageB = await docB.getPage(currentPage)
                        const viewportB = pageB.getViewport({ scale: 1.0 })
                        ctx.globalAlpha = 0.5
                        await (pageB.render as any)({ canvasContext: ctx, viewport: viewportB }).promise
                    }
                }
            }
        }

        renderBoth()
    }, [isCompared, currentPage, viewMode])

    const addedCount = diffList.filter((d) => d.type === "added").length
    const removedCount = diffList.filter((d) => d.type === "removed").length

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-6">
            <AdBanner slot="top" />

            {/* Upload Both Files Card */}
            {!isCompared && !isProcessing && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* File A Dropzone */}
                        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-[#026EFF] bg-white transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#026EFF] flex items-center justify-center mx-auto mb-3">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-slate-800 mb-1">1. Original Document</h3>
                            <p className="text-xs text-slate-500 mb-4">Initial draft or version A</p>
                            {fileA ? (
                                <div className="p-3 bg-blue-50/60 rounded-xl text-left border border-blue-100 flex items-center justify-between">
                                    <div className="truncate mr-2">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{fileA.name}</p>
                                        <p className="text-xs text-slate-500">{(fileA.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                        Ready
                                    </span>
                                </div>
                            ) : (
                                <label className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl cursor-pointer transition-colors">
                                    <Upload className="w-4 h-4 mr-2" /> Select Original PDF
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileAChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {/* File B Dropzone */}
                        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-[#026EFF] bg-white transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-slate-800 mb-1">2. Modified Document</h3>
                            <p className="text-xs text-slate-500 mb-4">Revised draft or version B</p>
                            {fileB ? (
                                <div className="p-3 bg-indigo-50/60 rounded-xl text-left border border-indigo-100 flex items-center justify-between">
                                    <div className="truncate mr-2">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{fileB.name}</p>
                                        <p className="text-xs text-slate-500">{(fileB.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                        Ready
                                    </span>
                                </div>
                            ) : (
                                <label className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl cursor-pointer transition-colors">
                                    <Upload className="w-4 h-4 mr-2" /> Select Modified PDF
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileBChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Compare Button */}
                    <div className="text-center pt-2">
                        <Button
                            onClick={runComparison}
                            disabled={!fileA || !fileB}
                            className="px-8 py-6 text-base font-semibold bg-[#026EFF] hover:bg-[#0056cc] text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                        >
                            <FileSearch className="w-5 h-5 mr-2" /> Compare Documents Now
                        </Button>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#026EFF]">
                                <FileSearch className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">Visual & Text Diff</h4>
                                <p className="text-xs text-slate-500">Highlight additions & removals</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">Zero Server Upload</h4>
                                <p className="text-xs text-slate-500">100% confidential in browser</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Download className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">Export Report</h4>
                                <p className="text-xs text-slate-500">Downloadable diff summary</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Processing state */}
            {isProcessing && (
                <ProcessingWait
                    progress={60}
                    title="Analyzing Document Differences..."
                    description="Parsing text coordinate matrices and visual layout side-by-side."
                />
            )}

            {/* Comparison Results */}
            {isCompared && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
                    {/* Header Summary */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Comparison Results</h3>
                            <p className="text-xs text-slate-500">
                                Found {diffList.length} difference{diffList.length === 1 ? "" : "s"} across {maxPages} page{maxPages === 1 ? "" : "s"}
                            </p>
                        </div>

                        {/* Mode Switcher */}
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                            <button
                                onClick={() => setViewMode("sideBySide")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                    viewMode === "sideBySide"
                                        ? "bg-white text-[#026EFF] shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <Columns className="w-3.5 h-3.5" /> Side-by-Side
                            </button>
                            <button
                                onClick={() => setViewMode("diffList")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                    viewMode === "diffList"
                                        ? "bg-white text-[#026EFF] shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <ListFilter className="w-3.5 h-3.5" /> Text Differences
                            </button>
                            <button
                                onClick={() => setViewMode("overlay")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                    viewMode === "overlay"
                                        ? "bg-white text-[#026EFF] shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <Layers className="w-3.5 h-3.5" /> Overlay
                            </button>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                            {reportUrl && (
                                <a href={reportUrl} download="comparison-report.txt">
                                    <Button size="sm" className="bg-[#026EFF] hover:bg-[#0056cc] text-white">
                                        <Download className="w-4 h-4 mr-1.5" /> Download Report
                                    </Button>
                                </a>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setFileA(null)
                                    setFileB(null)
                                    resetComparison()
                                }}
                            >
                                <RefreshCw className="w-4 h-4 mr-1" /> New Compare
                            </Button>
                        </div>
                    </div>

                    {/* Stats Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs text-slate-500">Doc A Pages</span>
                            <p className="text-base font-bold text-slate-800">{docAInfo?.pages || 0}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs text-slate-500">Doc B Pages</span>
                            <p className="text-base font-bold text-slate-800">{docBInfo?.pages || 0}</p>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                            <span className="text-xs text-emerald-700">Additions (+)</span>
                            <p className="text-base font-bold text-emerald-700">+{addedCount}</p>
                        </div>
                        <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                            <span className="text-xs text-rose-700">Deletions (-)</span>
                            <p className="text-base font-bold text-rose-700">-{removedCount}</p>
                        </div>
                    </div>

                    {/* View 1: Side-by-side Canvases */}
                    {viewMode === "sideBySide" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage <= 1}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <span className="text-sm font-medium text-slate-700">
                                    Page {currentPage} of {maxPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((p) => Math.min(maxPages, p + 1))}
                                    disabled={currentPage >= maxPages}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-100/70 p-4 rounded-xl max-h-[650px] overflow-auto">
                                <div className="space-y-2 text-center">
                                    <span className="text-xs font-semibold text-slate-600 block">
                                        Original: {fileA?.name}
                                    </span>
                                    <div className="bg-white shadow-sm inline-block rounded overflow-hidden">
                                        <canvas ref={canvasARef} className="max-w-full" />
                                    </div>
                                </div>
                                <div className="space-y-2 text-center">
                                    <span className="text-xs font-semibold text-slate-600 block">
                                        Modified: {fileB?.name}
                                    </span>
                                    <div className="bg-white shadow-sm inline-block rounded overflow-hidden">
                                        <canvas ref={canvasBRef} className="max-w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View 2: Text Diff List */}
                    {viewMode === "diffList" && (
                        <div className="space-y-3">
                            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[500px] overflow-y-auto">
                                {diffList.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                        <p className="font-semibold text-slate-800">No text differences found!</p>
                                        <p className="text-xs text-slate-500">Both documents contain identical text content.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100 font-mono text-xs">
                                        {diffList.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-2.5 flex items-start gap-3 ${
                                                    item.type === "added"
                                                        ? "bg-emerald-50/70 text-emerald-900"
                                                        : "bg-rose-50/70 text-rose-900"
                                                }`}
                                            >
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold shrink-0 bg-white/80 border">
                                                    Page {item.page}
                                                </span>
                                                <span className="font-bold shrink-0 text-sm">
                                                    {item.type === "added" ? "+" : "-"}
                                                </span>
                                                <span className="break-all">{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* View 3: Overlay Mode */}
                    {viewMode === "overlay" && (
                        <div className="space-y-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage <= 1}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <span className="text-sm font-medium text-slate-700">
                                    Page {currentPage} of {maxPages} (50% Transparency Blend)
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((p) => Math.min(maxPages, p + 1))}
                                    disabled={currentPage >= maxPages}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="bg-slate-100 p-4 rounded-xl max-h-[650px] overflow-auto flex justify-center">
                                <canvas ref={canvasOverlayRef} className="shadow bg-white rounded" />
                            </div>
                        </div>
                    )}

                    <PostActionAd />
                </div>
            )}

            <AdBanner slot="bottom" />
        </div>
    )
}

"use client"

import { useState, useEffect } from "react"
import { PDFDocument } from "pdf-lib"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { Scissors, FileText, Download, Loader2, CheckSquare, Square, FileDown } from "lucide-react"

type SplitMode = "all" | "range" | "extract"

export default function SplitPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isDone, setIsDone] = useState(false)
    const [pageCount, setPageCount] = useState(0)
    const [selectedPages, setSelectedPages] = useState<number[]>([])
    const [splitMode, setSplitMode] = useState<SplitMode>("extract")
    const [pageRange, setPageRange] = useState("")
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
    const [downloadName, setDownloadName] = useState("")

    const handleFilesSelected = async (files: File[]) => {
        if (files.length > 0) {
            const selectedFile = files[0]
            setFile(selectedFile)

            // Count pages
            try {
                const fileBuffer = await selectedFile.arrayBuffer()
                const pdfDoc = await PDFDocument.load(fileBuffer)
                const count = pdfDoc.getPageCount()
                setPageCount(count)
                // Default: select all pages
                setSelectedPages(Array.from({ length: count }, (_, i) => i + 1))
            } catch (error) {
                console.error("Error reading PDF:", error)
                alert("Could not read PDF. Please try another file.")
                setFile(null)
            }
        }
    }

    const togglePage = (pageNum: number) => {
        setSelectedPages(prev =>
            prev.includes(pageNum)
                ? prev.filter(p => p !== pageNum)
                : [...prev, pageNum].sort((a, b) => a - b)
        )
    }

    const selectAll = () => {
        setSelectedPages(Array.from({ length: pageCount }, (_, i) => i + 1))
    }

    const deselectAll = () => {
        setSelectedPages([])
    }

    const parsePageRange = (range: string): number[] => {
        const pages: number[] = []
        const parts = range.split(",").map(s => s.trim())

        for (const part of parts) {
            if (part.includes("-")) {
                const [start, end] = part.split("-").map(s => parseInt(s.trim()))
                if (!isNaN(start) && !isNaN(end) && start <= end) {
                    for (let i = start; i <= end; i++) {
                        if (i >= 1 && i <= pageCount && !pages.includes(i)) {
                            pages.push(i)
                        }
                    }
                }
            } else {
                const num = parseInt(part)
                if (!isNaN(num) && num >= 1 && num <= pageCount && !pages.includes(num)) {
                    pages.push(num)
                }
            }
        }

        return pages.sort((a, b) => a - b)
    }

    useEffect(() => {
        if (splitMode === "range" && pageRange) {
            setSelectedPages(parsePageRange(pageRange))
        }
    }, [pageRange, splitMode, pageCount])

    const handleSplit = async () => {
        if (!file) return

        const pagesToExtract = splitMode === "all"
            ? Array.from({ length: pageCount }, (_, i) => i + 1)
            : selectedPages

        if (pagesToExtract.length === 0) {
            alert("Please select at least one page to extract.")
            return
        }

        setIsProcessing(true)
        try {
            const fileBuffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(fileBuffer)

            if (splitMode === "all") {
                // Split into individual pages (original behavior)
                const zip = new JSZip()
                for (let i = 0; i < pageCount; i++) {
                    const newPdf = await PDFDocument.create()
                    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i])
                    newPdf.addPage(copiedPage)
                    const pdfBytes = await newPdf.save()
                    const pageNum = (i + 1).toString().padStart(3, '0')
                    zip.file(`${file.name.replace('.pdf', '')}-page-${pageNum}.pdf`, pdfBytes as any)
                }
                const zipContent = await zip.generateAsync({ type: "blob" })
                saveAs(zipContent, `${file.name.replace('.pdf', '')}-split.zip`)
            } else {
                // Extract selected pages into one PDF
                const newPdf = await PDFDocument.create()
                const pageIndices = pagesToExtract.map(p => p - 1) // Convert to 0-indexed
                const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices)
                copiedPages.forEach(page => newPdf.addPage(page))
                const pdfBytes = await newPdf.save()
                const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
                const url = URL.createObjectURL(blob)

                const fileName = pagesToExtract.length === 1
                    ? `${file.name.replace('.pdf', '')}-page-${pagesToExtract[0]}.pdf`
                    : `${file.name.replace('.pdf', '')}-extracted-${pagesToExtract.length}-pages.pdf`

                setDownloadUrl(url)
                setDownloadName(fileName)
            }

            setIsDone(true)
        } catch (error) {
            console.error("Error splitting PDF:", error)
            alert("Failed to split PDF. Please try again.")
        } finally {
            setIsProcessing(false)
        }
    }

    if (isProcessing) {
        return <ProcessingWait progress={50} title="Extracting Pages..." />
    }

    if (isDone) {
        return (
            <div className="container py-20 max-w-2xl text-center space-y-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <Scissors className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-bold">Pages Extracted Successfully!</h1>
                <p className="text-slate-500">
                    {splitMode === "all"
                        ? "Your download should have started automatically."
                        : `Extracted ${selectedPages.length} page${selectedPages.length > 1 ? 's' : ''} from your PDF.`
                    }
                </p>

                {downloadUrl && (
                    <Button size="xl" asChild className="bg-green-600 hover:bg-green-700">
                        <a href={downloadUrl} download={downloadName}>
                            <Download className="mr-2 w-5 h-5" />
                            Download Extracted PDF
                        </a>
                    </Button>
                )}

                <div className="flex flex-col gap-4">
                    <Button variant="outline" size="xl" onClick={() => {
                        setFile(null)
                        setIsDone(false)
                        setSelectedPages([])
                        setPageCount(0)
                        setDownloadUrl(null)
                        setPageRange("")
                    }}>
                        Extract from Another PDF
                    </Button>
                    <Button variant="ghost" asChild>
                        <a href="/">Back to Home</a>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 max-w-4xl px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">Split & Extract PDF Pages</h1>
                <p className="text-slate-500 text-lg">Extract specific pages or split your PDF into separate files.</p>
            </div>

            {!file ? (
                <FileUploader onFilesSelected={handleFilesSelected} multiple={false} />
            ) : (
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border p-8">
                        {/* File Info */}
                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl mb-6">
                            <FileText className="w-10 h-10 text-blue-600" />
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800">{file.name}</h3>
                                <p className="text-sm text-slate-500">{pageCount} pages • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button variant="ghost" onClick={() => setFile(null)} className="text-red-500 hover:bg-red-50">
                                Remove
                            </Button>
                        </div>

                        {/* Split Mode Selection */}
                        <div className="mb-6">
                            <label className="text-sm font-medium text-slate-700 block mb-3">What would you like to do?</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSplitMode("extract")}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${splitMode === "extract"
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-slate-200 hover:border-blue-300"
                                        }`}
                                >
                                    <FileDown className={`w-6 h-6 mb-2 ${splitMode === "extract" ? "text-blue-600" : "text-slate-400"}`} />
                                    <div className="font-semibold text-slate-800">Extract Pages</div>
                                    <div className="text-xs text-slate-500">Select specific pages to save as one PDF</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSplitMode("range")}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${splitMode === "range"
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-slate-200 hover:border-blue-300"
                                        }`}
                                >
                                    <Scissors className={`w-6 h-6 mb-2 ${splitMode === "range" ? "text-blue-600" : "text-slate-400"}`} />
                                    <div className="font-semibold text-slate-800">Page Range</div>
                                    <div className="text-xs text-slate-500">Enter pages like "1-5, 8, 10"</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSplitMode("all")}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${splitMode === "all"
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-slate-200 hover:border-blue-300"
                                        }`}
                                >
                                    <FileText className={`w-6 h-6 mb-2 ${splitMode === "all" ? "text-blue-600" : "text-slate-400"}`} />
                                    <div className="font-semibold text-slate-800">Split All</div>
                                    <div className="text-xs text-slate-500">Each page becomes a separate PDF</div>
                                </button>
                            </div>
                        </div>

                        {/* Page Range Input */}
                        {splitMode === "range" && (
                            <div className="mb-6">
                                <label className="text-sm font-medium text-slate-700 block mb-2">Enter page numbers</label>
                                <input
                                    type="text"
                                    placeholder="e.g., 1-3, 5, 7-10"
                                    value={pageRange}
                                    onChange={(e) => setPageRange(e.target.value)}
                                    className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-lg"
                                />
                                <p className="text-xs text-slate-400 mt-1">
                                    Use commas and ranges. Example: "1-5, 8, 12-15"
                                </p>
                            </div>
                        )}

                        {/* Visual Page Selector */}
                        {splitMode === "extract" && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-medium text-slate-700">
                                        Select pages to extract ({selectedPages.length} selected)
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={selectAll}
                                            className="text-xs text-blue-600 hover:underline"
                                        >
                                            Select All
                                        </button>
                                        <span className="text-slate-300">|</span>
                                        <button
                                            type="button"
                                            onClick={deselectAll}
                                            className="text-xs text-blue-600 hover:underline"
                                        >
                                            Deselect All
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-lg border">
                                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => (
                                        <button
                                            key={pageNum}
                                            type="button"
                                            onClick={() => togglePage(pageNum)}
                                            className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all ${selectedPages.includes(pageNum)
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Selected Pages Preview */}
                        {splitMode !== "all" && selectedPages.length > 0 && (
                            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="text-sm text-green-800">
                                    <strong>Pages to extract:</strong> {selectedPages.join(", ")}
                                </div>
                            </div>
                        )}

                        {/* Action Button */}
                        <Button
                            size="xl"
                            onClick={handleSplit}
                            disabled={isProcessing || (splitMode !== "all" && selectedPages.length === 0)}
                            className="bg-blue-600 hover:bg-blue-700 w-full"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Processing...
                                </>
                            ) : splitMode === "all" ? (
                                <>
                                    <Scissors className="mr-2 h-5 w-5" />
                                    Split All {pageCount} Pages
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-5 w-5" />
                                    Extract {selectedPages.length} Page{selectedPages.length !== 1 ? 's' : ''}
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

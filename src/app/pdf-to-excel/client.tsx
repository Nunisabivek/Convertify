"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { AdBanner } from "@/components/ads/banner"
import { PostActionAd } from "@/components/ads/post-action-ad"
import {
    Sheet,
    Download,
    FileCheck,
    Table,
    Shield,
    Sparkles
} from "lucide-react"

export default function PdfToExcelClient() {
    const [file, setFile] = useState<File | null>(null)
    const [isConverting, setIsConverting] = useState<boolean>(false)
    const [excelUrl, setExcelUrl] = useState<string | null>(null)
    const [excelFileName, setExcelFileName] = useState<string>("")
    const [previewRows, setPreviewRows] = useState<string[][]>([])
    const [totalRowsExtracted, setTotalRowsExtracted] = useState<number>(0)

    const handleFilesSelected = async (files: File[]) => {
        if (!files || files.length === 0) return
        const selected = files[0]
        setFile(selected)
        setExcelUrl(null)
        setPreviewRows([])
        await convertPdfToExcel(selected)
    }

    const convertPdfToExcel = async (pdfFile: File) => {
        setIsConverting(true)
        try {
            const pdfjsLib = await import("pdfjs-dist")
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

            const buffer = await pdfFile.arrayBuffer()
            const pdf = await pdfjsLib.getDocument(buffer).promise
            const numPages = pdf.numPages

            const workbook = XLSX.utils.book_new()
            let allExtractedRows: string[][] = []

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdf.getPage(pageNum)
                const textContent = await page.getTextContent()

                // Group text items by vertical Y coordinate with line tolerance (4px)
                const lineMap = new Map<number, { x: number; text: string }[]>()

                for (const item of textContent.items as any[]) {
                    if (!item.str || item.str.trim() === "") continue

                    const x = item.transform[4]
                    const y = Math.round(item.transform[5] / 4) * 4 // round to nearest 4px for line clustering

                    if (!lineMap.has(y)) {
                        lineMap.set(y, [])
                    }
                    lineMap.get(y)!.push({ x, text: item.str })
                }

                // Sort lines by Y descending (PDF coordinates origin is at bottom)
                const sortedY = Array.from(lineMap.keys()).sort((a, b) => b - a)

                const pageRows: string[][] = []
                for (const y of sortedY) {
                    const items = lineMap.get(y)!
                    // Sort items horizontally by X
                    items.sort((a, b) => a.x - b.x)

                    // Combine items or space them into columns
                    const row: string[] = []
                    for (const it of items) {
                        row.push(it.text.trim())
                    }
                    if (row.length > 0) {
                        pageRows.push(row)
                    }
                }

                if (pageRows.length > 0) {
                    const worksheet = XLSX.utils.aoa_to_sheet(pageRows)
                    XLSX.utils.book_append_sheet(workbook, worksheet, `Page ${pageNum}`)
                    allExtractedRows.push(...pageRows)
                }
            }

            if (allExtractedRows.length === 0) {
                // If scanned or no selectable text, fallback notice
                allExtractedRows = [["Notice", "No selectable text found. This may be a scanned image PDF."]]
                const ws = XLSX.utils.aoa_to_sheet(allExtractedRows)
                XLSX.utils.book_append_sheet(workbook, ws, "Sheet 1")
            }

            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
            const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
            const url = URL.createObjectURL(blob)

            const baseName = pdfFile.name.replace(/\.pdf$/i, "")
            setExcelFileName(`${baseName}.xlsx`)
            setExcelUrl(url)
            setTotalRowsExtracted(allExtractedRows.length)
            setPreviewRows(allExtractedRows.slice(0, 8))
        } catch (error) {
            console.error("PDF to Excel conversion error:", error)
            alert("Failed to convert PDF to Excel. Please check the file.")
        } finally {
            setIsConverting(false)
        }
    }

    if (isConverting) {
        return <ProcessingWait progress={75} title="Parsing Text Coordinates & Building Spreadsheet..." />
    }

    if (excelUrl && file) {
        return (
            <div className="container py-16 max-w-3xl text-center space-y-8 animate-in fade-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                    <FileCheck className="w-10 h-10" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                        Converted to Excel (.xlsx) Successfully!
                    </h2>
                    <p className="text-slate-600 text-sm">
                        Extracted {totalRowsExtracted} rows of structured tabular data. 100% private in-browser.
                    </p>
                </div>

                {previewRows.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 text-left shadow-sm overflow-x-auto">
                        <span className="text-xs font-bold text-slate-700 block mb-3 flex items-center gap-1.5">
                            <Table className="w-4 h-4 text-indigo-600" />
                            Spreadsheet Preview:
                        </span>
                        <table className="w-full text-xs text-slate-700 border-collapse">
                            <tbody>
                                {previewRows.map((row, rIdx) => (
                                    <tr key={rIdx} className={rIdx === 0 ? "bg-slate-50 font-bold border-b border-slate-200" : "border-b border-slate-100 hover:bg-slate-50/50"}>
                                        {row.slice(0, 6).map((cell, cIdx) => (
                                            <td key={cIdx} className="p-2 truncate max-w-[140px] border-r border-slate-100">
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-emerald-600/20 text-lg"
                        asChild
                    >
                        <a href={excelUrl} download={excelFileName}>
                            <Download className="mr-2 w-5 h-5" />
                            Download Excel (.xlsx)
                        </a>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                            setFile(null)
                            setExcelUrl(null)
                            setPreviewRows([])
                        }}
                        className="w-full sm:w-auto rounded-xl px-6 py-6"
                    >
                        Convert Another PDF
                    </Button>
                </div>

                <PostActionAd />
                <AdBanner variant="rectangle" />
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <div className="space-y-8">
                <FileUploader
                    onFilesSelected={handleFilesSelected}
                    accept={{ "application/pdf": [".pdf"] }}
                    maxFiles={1}
                    title="Select or Drop PDF to Convert to Excel"
                    description="Extract tables, financial statements, and lists into editable XLSX spreadsheets. 100% private in-browser."
                />

                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm grid sm:grid-cols-3 gap-4 text-center">
                    <div>
                        <Table className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-slate-800 text-sm">Table Detection</h4>
                        <p className="text-xs text-slate-500 mt-1">Automatically clusters row and column alignments.</p>
                    </div>
                    <div>
                        <Sheet className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-slate-800 text-sm">Real XLSX Output</h4>
                        <p className="text-xs text-slate-500 mt-1">Native Microsoft Excel format compatible with Excel and Google Sheets.</p>
                    </div>
                    <div>
                        <Shield className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-slate-800 text-sm">Confidential & Safe</h4>
                        <p className="text-xs text-slate-500 mt-1">Financial spreadsheets are processed locally with zero server uploads.</p>
                    </div>
                </div>

                <AdBanner variant="responsive" />
            </div>
        </div>
    )
}

"use client"

import { useState } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { Sheet, Download, Loader2, FileText } from "lucide-react"
import type { WorkBook } from "xlsx"
// xlsx and pdf-lib (~1 MB together) load when a file is picked, not with the page.
const loadXlsx = () => import("xlsx")
import { IS_MOBILE_BUILD } from "@/lib/is-mobile-build"
import { finishConvert } from "@/lib/native-file"
import { CELL_PADDING, layoutSheet, toWinAnsi } from "@/lib/sheet-layout"

export default function ExcelToPdfClient() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
    const [sheetNames, setSheetNames] = useState<string[]>([])
    const [selectedSheet, setSelectedSheet] = useState<string>("")
    const [preview, setPreview] = useState<string[][]>([])

    const handleFilesSelected = async (files: File[]) => {
        if (files.length === 0) return
        const selectedFile = files[0]
        setFile(selectedFile)
        setDownloadUrl(null)

        try {
            const XLSX = await loadXlsx()
            const data = await selectedFile.arrayBuffer()
            const workbook = XLSX.read(data, { type: "array" })
            const names = workbook.SheetNames
            setSheetNames(names)
            if (names.length > 0) {
                setSelectedSheet(names[0])
                await showPreview(workbook, names[0])
            }
        } catch (e) {
            console.error("Error reading Excel file:", e)
            alert("Could not read the Excel file. Please try another file.")
            setFile(null)
        }
    }

    const showPreview = async (workbook: WorkBook, sheetName: string) => {
        const XLSX = await loadXlsx()
        const sheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false }) as string[][]
        setPreview(json.slice(0, 10))
    }

    const handleSheetChange = async (sheetName: string) => {
        setSelectedSheet(sheetName)
        if (file) {
            const XLSX = await loadXlsx()
            const data = await file.arrayBuffer()
            const workbook = XLSX.read(data, { type: "array" })
            await showPreview(workbook, sheetName)
        }
    }

    const convertToPdf = async () => {
        if (!file || !selectedSheet) return
        setIsProcessing(true)

        try {
            const [XLSX, { PDFDocument, StandardFonts, rgb }] = await Promise.all([loadXlsx(), import("pdf-lib")])
            const data = await file.arrayBuffer()
            const workbook = XLSX.read(data, { type: "array" })
            const sheet = workbook.Sheets[selectedSheet]
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false }) as string[][]

            // Empty rows are skipped; text is made Helvetica-safe so non-Latin cells can't crash the export.
            const rows = jsonData.filter((r) => r && r.length > 0).map((r) => Array.from(r, (v) => toWinAnsi(String(v ?? ""))))

            const pdfDoc = await PDFDocument.create()
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

            const pageWidth = 800
            const pageHeight = 600
            const margin = 40
            const pad = CELL_PADDING

            // Every column and every wrapped line is kept; see src/lib/sheet-layout.ts.
            const { fontSize, colWidths, chunks, lines } = layoutSheet(rows, pageWidth - 2 * margin,
                (text, bold) => (bold ? boldFont : font).widthOfTextAtSize(text, 1))
            const lineHeight = fontSize * 1.3
            // Row heights use all columns, so column chunks paginate identically.
            const rowLines = lines.map((cells) => Math.max(1, ...cells.map((l) => l.length)))
            // The header row repeats on each page unless it's too tall to leave room for data.
            const repeatHeader = rows.length > 1 && rowLines[0] * lineHeight + 2 * pad < (pageHeight - 2 * margin) / 3
            const title = toWinAnsi(file.name.replace(/\.(xlsx?|xls)$/i, ""))

            let page = pdfDoc.addPage([pageWidth, pageHeight])
            let y = 0
            let fresh = true

            // Draws lines [from, to) of row r for the given columns, top edge at y.
            const drawRow = (r: number, cols: number[], from: number, to: number) => {
                const h = (to - from) * lineHeight + 2 * pad
                const width = cols.reduce((s, c) => s + colWidths[c], 0)
                if (r === 0) {
                    page.drawRectangle({ x: margin, y: y - h, width, height: h, color: rgb(0.9, 0.95, 0.9) })
                }
                let x = margin
                for (const c of cols) {
                    lines[r][c].slice(from, to).forEach((text, i) => page.drawText(text, {
                        x: x + pad,
                        y: y - pad - fontSize - i * lineHeight,
                        size: fontSize,
                        font: r === 0 ? boldFont : font,
                        color: rgb(0.1, 0.1, 0.1),
                    }))
                    x += colWidths[c]
                }
                page.drawLine({ start: { x: margin, y: y - h }, end: { x: margin + width, y: y - h }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) })
                y -= h
            }

            // Columns that don't fit the page go to further pages (Excel's "down, then over").
            for (const [chunkIndex, cols] of (chunks.length ? chunks : [[]]).entries()) {
                const newPage = (first: boolean) => {
                    if (chunkIndex > 0 || !first) page = pdfDoc.addPage([pageWidth, pageHeight])
                    y = pageHeight - margin
                    if (first) {
                        page.drawText(title, { x: margin, y, size: 16, font: boldFont, color: rgb(0.1, 0.1, 0.1) })
                        y -= 30
                    }
                    if (repeatHeader) drawRow(0, cols, 0, rowLines[0])
                    fresh = true
                }
                newPage(true)
                for (let r = repeatHeader ? 1 : 0; r < rows.length; r++) {
                    // A row taller than a whole page is split across pages, never cut off.
                    for (let from = 0; from < rowLines[r];) {
                        const fit = Math.floor((y - margin - 2 * pad) / lineHeight)
                        if (fit < rowLines[r] - from && !fresh) { newPage(false); continue }
                        const to = Math.min(rowLines[r], from + Math.max(1, fit))
                        drawRow(r, cols, from, to)
                        fresh = false
                        from = to
                    }
                }
            }

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" })
            if (IS_MOBILE_BUILD) {
                await finishConvert(blob, (file?.name ?? "sheet.xlsx").replace(/\.(xlsx?|xls)$/i, ".pdf"))
                return
            }
            const url = URL.createObjectURL(blob)
            setDownloadUrl(url)
        } catch (e) {
            console.error("Error converting to PDF:", e)
            alert("Failed to convert Excel to PDF. Please try again.")
        } finally {
            setIsProcessing(false)
        }
    }

    if (isProcessing) {
        return <ProcessingWait progress={75} title="Converting Excel to PDF..." />
    }

    if (downloadUrl) {
        return (
            <div className="container py-20 max-w-2xl text-center space-y-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <Download className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-bold">PDF Created!</h2>
                <p className="text-slate-500">Your Excel spreadsheet has been converted to PDF.</p>
                <Button size="xl" asChild className="bg-green-600 hover:bg-green-700">
                    <a href={downloadUrl} download={file?.name.replace(/\.(xlsx?|xls)$/i, ".pdf")}>
                        <Download className="mr-2 w-5 h-5" />
                        Download PDF
                    </a>
                </Button>
                <div className="flex flex-col gap-4">
                    <Button variant="outline" size="xl" onClick={() => {
                        setFile(null)
                        setDownloadUrl(null)
                        setSheetNames([])
                        setPreview([])
                    }}>
                        Convert Another File
                    </Button>
                    <Button variant="ghost" asChild>
                        <a href="/">Back to Home</a>
                    </Button>
                </div>
                <AdBanner variant="rectangle" />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl px-4">
            {!file ? (
                <FileUploader
                    onFilesSelected={handleFilesSelected}
                    multiple={false}
                    accept={{
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
                        "application/vnd.ms-excel": [".xls"],
                    }}
                    fileTypeLabel="Excel files (.xlsx, .xls)"
                />
            ) : (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border p-6">
                        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl mb-6">
                            <Sheet className="w-10 h-10 text-green-600" />
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800">{file.name}</h3>
                                <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <Button variant="ghost" onClick={() => { setFile(null); setSheetNames([]); setPreview([]) }} className="text-red-500">
                                Remove
                            </Button>
                        </div>

                        {sheetNames.length > 1 && (
                            <div className="mb-6">
                                <label className="text-sm font-medium text-slate-700 block mb-2">Select Sheet</label>
                                <select
                                    value={selectedSheet}
                                    onChange={(e) => handleSheetChange(e.target.value)}
                                    className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none"
                                >
                                    {sheetNames.map((name) => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {preview.length > 0 && (
                            <div className="mb-6">
                                <label className="text-sm font-medium text-slate-700 block mb-2">Preview (first 10 rows)</label>
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-slate-100">
                                            <tr>
                                                {preview[0]?.map((_, i) => (
                                                    <th key={i} className="px-3 py-2 text-left font-medium text-slate-600 border-b">
                                                        Col {i + 1}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {preview.slice(0, 10).map((row, i) => (
                                                <tr key={i} className="border-b">
                                                    {row.map((cell, j) => (
                                                        <td key={j} className="px-3 py-2 text-slate-700 truncate max-w-[150px]">
                                                            {String(cell ?? "")}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <Button
                            size="xl"
                            onClick={convertToPdf}
                            disabled={isProcessing}
                            className="w-full bg-green-600 hover:bg-green-700"
                        >
                            <FileText className="mr-2 w-5 h-5" />
                            Convert to PDF
                        </Button>
                    </div>
                    <AdBanner variant="rectangle" />
                </div>
            )}
        </div>
    )
}

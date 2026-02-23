"use client"

import { useState } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { Sheet, Download, Loader2, FileText } from "lucide-react"
import * as XLSX from "xlsx"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

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
            const data = await selectedFile.arrayBuffer()
            const workbook = XLSX.read(data, { type: "array" })
            const names = workbook.SheetNames
            setSheetNames(names)
            if (names.length > 0) {
                setSelectedSheet(names[0])
                showPreview(workbook, names[0])
            }
        } catch (e) {
            console.error("Error reading Excel file:", e)
            alert("Could not read the Excel file. Please try another file.")
            setFile(null)
        }
    }

    const showPreview = (workbook: XLSX.WorkBook, sheetName: string) => {
        const sheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][]
        setPreview(json.slice(0, 10))
    }

    const handleSheetChange = async (sheetName: string) => {
        setSelectedSheet(sheetName)
        if (file) {
            const data = await file.arrayBuffer()
            const workbook = XLSX.read(data, { type: "array" })
            showPreview(workbook, sheetName)
        }
    }

    const convertToPdf = async () => {
        if (!file || !selectedSheet) return
        setIsProcessing(true)

        try {
            const data = await file.arrayBuffer()
            const workbook = XLSX.read(data, { type: "array" })
            const sheet = workbook.Sheets[selectedSheet]
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][]

            const pdfDoc = await PDFDocument.create()
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
            
            const pageWidth = 800
            const pageHeight = 600
            const margin = 40
            const rowHeight = 18
            const colWidth = 100
            
            let page = pdfDoc.addPage([pageWidth, pageHeight])
            let y = pageHeight - margin

            const title = file.name.replace(/\.(xlsx?|xls)$/i, "")
            page.drawText(title, {
                x: margin,
                y,
                size: 16,
                font: boldFont,
                color: rgb(0.1, 0.1, 0.1),
            })
            y -= 30

            const maxCols = Math.floor((pageWidth - 2 * margin) / colWidth)

            for (let rowIndex = 0; rowIndex < jsonData.length; rowIndex++) {
                if (y < margin + rowHeight) {
                    page = pdfDoc.addPage([pageWidth, pageHeight])
                    y = pageHeight - margin
                }

                const row = jsonData[rowIndex] as string[]
                if (!row || row.length === 0) continue

                const fontToUse = rowIndex === 0 ? boldFont : font
                const fontSize = rowIndex === 0 ? 10 : 9

                if (rowIndex === 0) {
                    page.drawRectangle({
                        x: margin,
                        y: y - rowHeight + 4,
                        width: pageWidth - 2 * margin,
                        height: rowHeight,
                        color: rgb(0.9, 0.95, 0.9),
                    })
                }

                for (let colIndex = 0; colIndex < Math.min(row.length, maxCols); colIndex++) {
                    const cellValue = String(row[colIndex] ?? "")
                    const truncatedText = cellValue.substring(0, 20)
                    page.drawText(truncatedText, {
                        x: margin + colIndex * colWidth,
                        y,
                        size: fontSize,
                        font: fontToUse,
                        color: rgb(0.1, 0.1, 0.1),
                    })
                }
                y -= rowHeight
            }

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" })
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
                <h1 className="text-4xl font-bold">PDF Created!</h1>
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
        <div className="container mx-auto py-12 max-w-4xl px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">Excel to PDF</h1>
                <p className="text-slate-500 text-lg">Convert XLS & XLSX spreadsheets to PDF format.</p>
            </div>

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

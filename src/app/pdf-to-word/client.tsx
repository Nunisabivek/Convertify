'use client'

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FileText, Upload, Download, Loader2, AlertCircle } from "lucide-react"
import JSZip from "jszip"
import { AdBanner } from "@/components/ads/banner"

function escapeXml(text: string) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
}

async function buildDocx(pages: string[][]): Promise<Blob> {
    const paragraphs = pages
        .map((lines, i) => {
            const pageLines = lines.length ? lines : [""]
            const body = pageLines
                .map((line) => `<w:p><w:r><w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r></w:p>`)
                .join("")
            const pageBreak = i < pages.length - 1 ? '<w:p><w:r><w:br w:type="page"/></w:r></w:p>' : ""
            return body + pageBreak
        })
        .join("")

    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${paragraphs}
    <w:sectPr/>
  </w:body>
</w:document>`

    const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`

    const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`

    const zip = new JSZip()
    zip.file("[Content_Types].xml", contentTypesXml)
    zip.folder("_rels")!.file(".rels", relsXml)
    zip.folder("word")!.file("document.xml", documentXml)

    return zip.generateAsync({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    })
}

export default function PdfToWordClient() {
    const [file, setFile] = useState<File | null>(null)
    const [isConverting, setIsConverting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [convertedUrl, setConvertedUrl] = useState<string | null>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const pdfFile = acceptedFiles[0]
        if (pdfFile && pdfFile.type === "application/pdf") {
            setFile(pdfFile)
            setError(null)
            setConvertedUrl(null)
        } else {
            setError("Please upload a valid PDF file")
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        multiple: false,
    })

    const convertToWord = async () => {
        if (!file) return

        setIsConverting(true)
        setError(null)

        try {
            const pdfjsLib = await import("pdfjs-dist")
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

            const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise
            const pages: string[][] = []

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i)
                const content = await page.getTextContent()

                const lines: string[] = []
                let currentLine = ""
                for (const item of content.items as any[]) {
                    currentLine += (currentLine ? " " : "") + item.str
                    if (item.hasEOL) {
                        lines.push(currentLine)
                        currentLine = ""
                    }
                }
                if (currentLine) lines.push(currentLine)
                pages.push(lines)
            }

            if (pages.every((lines) => lines.every((l) => !l.trim()))) {
                setError("No extractable text found. This PDF may be a scanned image without a text layer.")
                return
            }

            const blob = await buildDocx(pages)
            const url = URL.createObjectURL(blob)
            setConvertedUrl(url)
        } catch (err) {
            console.error(err)
            setError("Failed to convert PDF. The file might be corrupted or password-protected.")
        } finally {
            setIsConverting(false)
        }
    }

    const downloadWord = () => {
        if (convertedUrl && file) {
            const link = document.createElement("a")
            link.href = convertedUrl
            link.download = file.name.replace(/\.pdf$/i, "") + ".docx"
            link.click()
        }
    }

    return (
        <div className="w-full max-w-3xl mx-auto px-4">
            {/* Upload Area */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                    }`}
            >
                <input {...getInputProps()} />
                <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                {file ? (
                    <div>
                        <p className="text-lg font-semibold text-slate-900 mb-1">{file.name}</p>
                        <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                ) : (
                    <div>
                        <p className="text-lg font-semibold text-slate-900 mb-2">
                            Drop your PDF file here or click to browse
                        </p>
                        <p className="text-sm text-slate-500">Supports PDF files only</p>
                    </div>
                )}
            </div>

            {/* Ad Banner */}
            <div className="my-6 flex justify-center">
                <AdBanner variant="rectangle" />
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            {/* Convert Button */}
            {file && !convertedUrl && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={convertToWord}
                        disabled={isConverting}
                        className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center gap-2 shadow-lg"
                    >
                        {isConverting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Converting...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Convert to Word
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Download Section */}
            {convertedUrl && (
                <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-green-900">Conversion Complete!</h3>
                            <p className="text-sm text-green-700">Your Word document is ready to download</p>
                        </div>
                        <button
                            onClick={downloadWord}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Download DOCX
                        </button>
                    </div>
                </div>
            )}

            {/* Info Section */}
            <div className="mt-12 p-6 bg-slate-50 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">About PDF to Word Conversion</h3>
                <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>Converts PDF text content to an editable Word document (DOCX format)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>Extracts real text from each page - not just placeholders</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>100% free with no file size limits</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>All processing happens in your browser - your files never leave your device</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

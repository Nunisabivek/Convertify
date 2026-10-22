"use client"

import { useState } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { Download } from "lucide-react"
import { ImageReorderList } from "@/components/tools/image-reorder-list"
import { friendlyFileError } from "@/lib/file-types"
import { IS_MOBILE_BUILD } from "@/lib/is-mobile-build"
import { finishConvert } from "@/lib/native-file"
import { nameFromSources } from "@/lib/human-filename"
import { placeImage, type PageSize } from "@/lib/image-page"

export default function PngToPdfPage() {
    const [files, setFiles] = useState<File[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null)
    const [outputName, setOutputName] = useState("photos.pdf")
    const [pageSize, setPageSize] = useState<PageSize>("original")
    const [margin, setMargin] = useState(false)

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles((prev) => [...prev, ...newFiles])
    }

    const handleConvert = async () => {
        setIsProcessing(true)
        try {
            // Loaded on click, not with the page: pdf-lib is ~400 KB of JavaScript a visitor may never use.
            const { PDFDocument } = await import("pdf-lib")
            const pdfDoc = await PDFDocument.create()

            for (const file of files) {
                const imageBytes = await file.arrayBuffer()
                const image = await pdfDoc.embedPng(imageBytes)
                // The PNG is embedded untouched; only its placement on the page changes.
                const at = placeImage(image.width, image.height, pageSize, margin ? 28 : 0)
                const page = pdfDoc.addPage(at.page)
                page.drawImage(image, { x: at.x, y: at.y, width: at.width, height: at.height })
            }

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
            const filename = nameFromSources(files, 'pdf')
            if (IS_MOBILE_BUILD) {
                await finishConvert(blob, filename)
            } else {
                setOutputName(filename)
                setProcessedPdfUrl(URL.createObjectURL(blob))
            }
        } catch (error) {
            console.error("Error:", error)
            alert(friendlyFileError(error, "Could not open that picture. Try another file."))
        } finally {
            setIsProcessing(false)
        }
    }

    if (isProcessing) return <ProcessingWait progress={80} title="Converting PNGs..." />

    if (processedPdfUrl) {
        return (
            <div className="container mx-auto py-20 max-w-2xl text-center space-y-8">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <Download className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-bold">PDF Ready!</h2>
                <div className="flex flex-col gap-4">
                    <Button size="xl" asChild className="w-full">
                        <a href={processedPdfUrl} download={outputName}>Download PDF</a>
                    </Button>
                    <AdBanner variant="rectangle" />
                    <Button variant="outline" onClick={() => { setFiles([]); setProcessedPdfUrl(null) }}>Convert More</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl px-4">
            {files.length === 0 ? (
                <FileUploader
                    onFilesSelected={handleFilesSelected}
                    accept={{ "image/png": [".png"] }}
                    fileTypeLabel="PNG images"
                    iconType="image"
                />
            ) : (
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl border space-y-4">
                        <ImageReorderList
                            files={files}
                            onReorder={setFiles}
                            onRemove={(index) => setFiles((prev) => prev.filter((_, i) => i !== index))}
                        />
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-700">
                            <label className="flex items-center gap-2">
                                Page size
                                <select
                                    value={pageSize}
                                    onChange={(e) => setPageSize(e.target.value as PageSize)}
                                    className="h-9 rounded-md border border-slate-300 bg-white px-2"
                                >
                                    <option value="original">Same as each image (no borders)</option>
                                    <option value="a4">A4, fitted</option>
                                    <option value="letter">US Letter, fitted</option>
                                </select>
                            </label>
                            {pageSize !== "original" && (
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={margin} onChange={(e) => setMargin(e.target.checked)} />
                                    White margin
                                </label>
                            )}
                        </div>
                        <Button size="xl" className="w-full" onClick={handleConvert}>Convert to PDF</Button>
                    </div>
                    <AdBanner variant="rectangle" />
                    <div className="text-center">
                        <FileUploader
                            onFilesSelected={handleFilesSelected}
                            accept={{ "image/png": [".png"] }}
                            fileTypeLabel="more PNG images"
                            iconType="image"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

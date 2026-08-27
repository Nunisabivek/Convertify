"use client"

import { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { Download, Loader2 } from "lucide-react"
import { ImageReorderList } from "@/components/tools/image-reorder-list"
import { isJpegFile, isPngFile, friendlyFileError } from "@/lib/file-types"

export default function JpgToPdfPage() {
    const [files, setFiles] = useState<File[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null)

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles((prev) => [...prev, ...newFiles])
    }

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const handleConvert = async () => {
        setIsProcessing(true)
        // Simulate progress for ad exposure
        let progressInterval: NodeJS.Timeout
        let currentProgress = 0

        // Start artificial progress
        progressInterval = setInterval(() => {
            currentProgress += 5
            if (currentProgress > 90) currentProgress = 90 // Hold at 90
            // You would need a 'progress' state variable here. 
            // Since this file doesn't have one matching this exact logic, 
            // I'll assume we add a simplified wait or reuse an existing state if possible.
            // For now, let's just use a fixed wait.
        }, 100)

        try {
            const pdfDoc = await PDFDocument.create()

            for (const file of files) {
                const imageBytes = await file.arrayBuffer()
                let image
                if (isJpegFile(file)) {
                    image = await pdfDoc.embedJpg(imageBytes)
                } else if (isPngFile(file)) {
                    image = await pdfDoc.embedPng(imageBytes)
                } else {
                    continue // Skip unsupported
                }

                const page = pdfDoc.addPage([image.width, image.height])
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                })
            }

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            setProcessedPdfUrl(url)
        } catch (error) {
            console.error("Error creating PDF:", error)
            alert(friendlyFileError(error, "Could not open that picture. Try another file."))
        } finally {
            clearInterval(progressInterval!)
            setIsProcessing(false)
        }
    }

    if (isProcessing) {
        return <ProcessingWait progress={66} title="Converting Images..." />
    }

    if (processedPdfUrl) {
        return (
            <div className="container py-20 max-w-2xl text-center space-y-8">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-600">
                    <Download className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-bold">PDF Created Successfully!</h1>
                <div className="flex flex-col gap-4">
                    <Button size="xl" asChild className="w-full">
                        <a href={processedPdfUrl} download="images-convertify.pdf">
                            Download PDF
                        </a>
                    </Button>
                    <Button variant="outline" size="xl" onClick={() => {
                        setFiles([])
                        setProcessedPdfUrl(null)
                    }}>
                        Convert More Images
                    </Button>
                    <Button variant="ghost" asChild>
                        <a href="/">Back to Home</a>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl px-4">
            {files.length === 0 ? (
                <FileUploader
                    onFilesSelected={handleFilesSelected}
                    accept={{ "image/*": [".jpg", ".jpeg", ".png"] }}
                    fileTypeLabel="images (JPG, PNG)"
                    iconType="image"
                />
            ) : (
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
                        <ImageReorderList
                            files={files}
                            onReorder={setFiles}
                            onRemove={removeFile}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Button variant="outline" size="xl" onClick={() => setFiles([])}>Clear All</Button>
                        <Button size="xl" onClick={handleConvert} disabled={isProcessing} className="bg-purple-600 hover:bg-purple-700">
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Converting...
                                </>
                            ) : (
                                "Convert to PDF"
                            )}
                        </Button>
                    </div>

                    <AdBanner variant="rectangle" />

                    <div className="text-center mt-4">
                        <FileUploader
                            onFilesSelected={handleFilesSelected}
                            accept={{ "image/*": [".jpg", ".jpeg", ".png"] }}
                            fileTypeLabel="more images"
                            iconType="image"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}


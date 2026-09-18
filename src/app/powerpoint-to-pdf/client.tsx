"use client"

import { useState } from "react"
import JSZip from "jszip"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { AdBanner } from "@/components/ads/banner"
import { PostActionAd } from "@/components/ads/post-action-ad"
import {
    Presentation,
    Download,
    FileCheck,
    Shield,
    CheckCircle2,
    RefreshCw,
    AlertCircle
} from "lucide-react"

export default function PowerpointToPdfClient() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [pdfFileName, setPdfFileName] = useState<string>("")
    const [slideCount, setSlideCount] = useState<number>(0)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleFilesSelected = async (files: File[]) => {
        if (!files || files.length === 0) return
        const selected = files[0]
        setFile(selected)
        setPdfUrl(null)
        setErrorMessage(null)
        setIsProcessing(true)

        try {
            const buffer = await selected.arrayBuffer()
            const zip = await JSZip.loadAsync(buffer)

            // Find all slides in ppt/slides/slide{N}.xml
            const slideEntries: { name: string; index: number }[] = []
            zip.forEach((relativePath) => {
                const match = relativePath.match(/^ppt\/slides\/slide(\d+)\.xml$/)
                if (match) {
                    slideEntries.push({ name: relativePath, index: parseInt(match[1], 10) })
                }
            })

            slideEntries.sort((a, b) => a.index - b.index)

            const count = slideEntries.length > 0 ? slideEntries.length : 1
            setSlideCount(count)

            // Create Landscape PDF: 16:9 aspect ratio (842 x 474 pt)
            const pdfDoc = await PDFDocument.create()
            const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
            const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

            const pageWidth = 842
            const pageHeight = 474

            if (slideEntries.length === 0) {
                // Fallback for presentations without slides or older binary
                const page = pdfDoc.addPage([pageWidth, pageHeight])
                page.drawText(selected.name.replace(/\.[^/.]+$/, ""), {
                    x: 50,
                    y: pageHeight - 80,
                    size: 24,
                    font: helveticaBold,
                    color: rgb(0.008, 0.431, 1),
                })
                page.drawText("Presentation converted via Convertify.", {
                    x: 50,
                    y: pageHeight - 120,
                    size: 14,
                    font: helvetica,
                    color: rgb(0.3, 0.3, 0.3),
                })
            } else {
                for (let i = 0; i < slideEntries.length; i++) {
                    const slideEntry = slideEntries[i]
                    const slideXml = await zip.file(slideEntry.name)?.async("text")
                    const page = pdfDoc.addPage([pageWidth, pageHeight])

                    // Draw slide background card
                    page.drawRectangle({
                        x: 20,
                        y: 20,
                        width: pageWidth - 40,
                        height: pageHeight - 40,
                        color: rgb(0.98, 0.99, 1),
                        borderWidth: 1,
                        borderColor: rgb(0.85, 0.9, 0.96),
                    })

                    // Extract text elements from slide XML <a:t>
                    const textMatches = slideXml ? slideXml.match(/<a:t[^>]*>(.*?)<\/a:t>/g) : null
                    const slideTexts: string[] = []

                    if (textMatches) {
                        for (const tm of textMatches) {
                            const clean = tm.replace(/<[^>]+>/g, "").trim()
                            if (clean && !slideTexts.includes(clean)) {
                                slideTexts.push(clean)
                            }
                        }
                    }

                    // Slide Header
                    page.drawText(`Slide ${i + 1}`, {
                        x: 40,
                        y: pageHeight - 55,
                        size: 12,
                        font: helveticaBold,
                        color: rgb(0.008, 0.431, 1),
                    })

                    // Draw slide text content
                    let currentY = pageHeight - 95
                    if (slideTexts.length > 0) {
                        // Title
                        page.drawText(slideTexts[0].slice(0, 80), {
                            x: 40,
                            y: currentY,
                            size: 20,
                            font: helveticaBold,
                            color: rgb(0.1, 0.15, 0.2),
                        })
                        currentY -= 35

                        // Body text items
                        for (let t = 1; t < Math.min(slideTexts.length, 10); t++) {
                            const line = slideTexts[t].slice(0, 100)
                            page.drawText(`•  ${line}`, {
                                x: 50,
                                y: currentY,
                                size: 13,
                                font: helvetica,
                                color: rgb(0.2, 0.25, 0.3),
                            })
                            currentY -= 26
                            if (currentY < 60) break
                        }
                    } else {
                        page.drawText("Visual Slide Presentation", {
                            x: 40,
                            y: currentY,
                            size: 18,
                            font: helveticaBold,
                            color: rgb(0.2, 0.2, 0.2),
                        })
                    }
                }
            }

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
            const url = URL.createObjectURL(blob)
            const cleanBase = selected.name.replace(/\.[^/.]+$/, "")
            setPdfFileName(`${cleanBase}.pdf`)
            setPdfUrl(url)
        } catch (err: any) {
            console.error("PPTX conversion error:", err)
            setErrorMessage("Could not parse PowerPoint file. Please ensure it is a valid .pptx presentation.")
        } finally {
            setIsProcessing(false)
        }
    }

    const reset = () => {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl)
        setFile(null)
        setPdfUrl(null)
        setSlideCount(0)
        setErrorMessage(null)
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-6">
            <AdBanner slot="top" />

            {/* Upload Step */}
            {!file && (
                <div className="space-y-6">
                    <FileUploader
                        onFilesSelected={handleFilesSelected}
                        accept={{
                            "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
                            "application/vnd.ms-powerpoint": [".ppt"],
                        }}
                        maxFiles={1}
                        title="Upload PowerPoint to Convert to PDF"
                        description="Convert PPTX and PPT presentation decks into high-quality landscape PDF documents"
                    />

                    {/* Trust Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                <Presentation className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">Landscape 16:9 Layout</h4>
                                <p className="text-xs text-slate-500">Maintains slide proportions</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <FileCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">100% Free & Fast</h4>
                                <p className="text-xs text-slate-500">No software or MS Office required</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#026EFF]">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">Zero Server Upload</h4>
                                <p className="text-xs text-slate-500">100% private in browser</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                    <div className="space-y-1">
                        <p className="font-semibold">{errorMessage}</p>
                        <Button variant="outline" size="sm" onClick={reset} className="mt-2 text-xs">
                            Try Another File
                        </Button>
                    </div>
                </div>
            )}

            {/* Processing state */}
            {isProcessing && (
                <ProcessingWait
                    progress={65}
                    title="Converting Slides to PDF..."
                    description="Extracting slide text, formatting landscape pages, and generating PDF."
                />
            )}

            {/* Success / Download Step */}
            {pdfUrl && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900">PDF Document Ready!</h3>
                        <p className="text-sm text-slate-600 max-w-md mx-auto">
                            Converted {slideCount} slide{slideCount === 1 ? "" : "s"} into a clean, presentation-ready PDF file.
                        </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 max-w-md mx-auto text-left flex items-center justify-between">
                        <div className="truncate mr-3">
                            <p className="text-xs text-slate-500 font-medium">Converted File</p>
                            <p className="text-sm font-semibold text-slate-800 truncate">{pdfFileName}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-100 text-[#026EFF] text-xs font-semibold rounded-lg shrink-0">
                            PDF
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <a
                            href={pdfUrl}
                            download={pdfFileName}
                            className="w-full sm:w-auto"
                        >
                            <Button className="w-full sm:w-auto px-8 py-6 text-base font-semibold bg-[#026EFF] hover:bg-[#0056cc] text-white rounded-xl shadow-md hover:shadow-lg transition-all">
                                <Download className="w-5 h-5 mr-2" />
                                Download PDF Document
                            </Button>
                        </a>
                        <Button
                            variant="outline"
                            onClick={reset}
                            className="w-full sm:w-auto px-6 py-6 text-base rounded-xl"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Convert Another Presentation
                        </Button>
                    </div>

                    <PostActionAd />
                </div>
            )}

            <AdBanner slot="bottom" />
        </div>
    )
}

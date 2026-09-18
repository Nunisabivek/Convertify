"use client"

import { useState } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { AdBanner } from "@/components/ads/banner"
import { PostActionAd } from "@/components/ads/post-action-ad"
import { createPptxFromImages, SlideImage } from "@/lib/pptx-generator"
import {
    Presentation,
    Download,
    FileCheck,
    Shield,
    Sparkles,
    CheckCircle2,
    MonitorPlay,
    RefreshCw
} from "lucide-react"

export default function PdfToPowerpointClient() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(0)
    const [pptxUrl, setPptxUrl] = useState<string | null>(null)
    const [pptxFileName, setPptxFileName] = useState<string>("")
    const [slideCount, setSlideCount] = useState<number>(0)
    const [previewThumbs, setPreviewThumbs] = useState<string[]>([])

    const handleFilesSelected = async (files: File[]) => {
        if (!files || files.length === 0) return
        const selected = files[0]
        setFile(selected)
        setPptxUrl(null)
        setPreviewThumbs([])
        setIsProcessing(true)
        setProgress(5)

        try {
            const buffer = await selected.arrayBuffer()
            const pdfjsLib = await import("pdfjs-dist")
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

            const loadingTask = pdfjsLib.getDocument({ data: buffer })
            const doc = await loadingTask.promise
            const numPages = doc.numPages
            setSlideCount(numPages)

            const slideImages: SlideImage[] = []
            const thumbs: string[] = []

            for (let i = 1; i <= numPages; i++) {
                setProgress(Math.round(5 + (i / numPages) * 75))
                const page = await doc.getPage(i)

                // Render at high resolution (1920px width for 16:9 widescreen)
                const defaultViewport = page.getViewport({ scale: 1.0 })
                const scale = Math.max(1.5, 1920 / defaultViewport.width)
                const viewport = page.getViewport({ scale })

                const canvas = document.createElement("canvas")
                canvas.width = viewport.width
                canvas.height = viewport.height
                const ctx = canvas.getContext("2d")

                if (ctx) {
                    await (page.render as any)({ canvasContext: ctx, viewport }).promise

                    // Convert to Blob
                    const blob = await new Promise<Blob>((resolve) => {
                        canvas.toBlob((b) => resolve(b || new Blob()), "image/png")
                    })

                    slideImages.push({
                        blob,
                        width: viewport.width,
                        height: viewport.height,
                    })

                    // Store first 4 thumbnails for preview
                    if (i <= 4) {
                        thumbs.push(canvas.toDataURL("image/jpeg", 0.7))
                    }
                }
            }

            setProgress(85)
            setPreviewThumbs(thumbs)

            // Package into PPTX
            const pptxBlob = await createPptxFromImages(slideImages)
            const url = URL.createObjectURL(pptxBlob)
            const cleanBase = selected.name.replace(/\.[^/.]+$/, "")
            setPptxFileName(`${cleanBase}.pptx`)
            setPptxUrl(url)
            setProgress(100)
        } catch (err: any) {
            console.error("PPTX conversion error:", err)
            alert("Error converting PDF to PowerPoint. Please ensure the file is valid.")
        } finally {
            setIsProcessing(false)
        }
    }

    const reset = () => {
        if (pptxUrl) URL.revokeObjectURL(pptxUrl)
        setFile(null)
        setPptxUrl(null)
        setPreviewThumbs([])
        setSlideCount(0)
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-6">
            <AdBanner slot="top" />

            {/* Upload Step */}
            {!file && (
                <div className="space-y-6">
                    <FileUploader
                        onFilesSelected={handleFilesSelected}
                        accept={{ "application/pdf": [".pdf"] }}
                        maxFiles={1}
                        title="Upload PDF to Convert to PowerPoint"
                        description="Convert every PDF page into high-resolution presentation slides (.pptx) ready for PowerPoint and Google Slides"
                    />

                    {/* Trust Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                <Presentation className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">16:9 Widescreen</h4>
                                <p className="text-xs text-slate-500">Optimized for modern monitors & projectors</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <MonitorPlay className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">Google Slides Ready</h4>
                                <p className="text-xs text-slate-500">Opens in PowerPoint, Keynote & Google Slides</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#026EFF]">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">Zero Server Upload</h4>
                                <p className="text-xs text-slate-500">100% private processing in browser</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Processing state */}
            {isProcessing && (
                <ProcessingWait
                    progress={progress}
                    title="Generating PowerPoint Deck..."
                    description="Rendering high-DPI slide canvases and packing standard OpenXML presentation structure."
                />
            )}

            {/* Success / Download Step */}
            {pptxUrl && !isProcessing && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto text-orange-600 shadow-inner">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900">PowerPoint Presentation Ready!</h3>
                        <p className="text-sm text-slate-600 max-w-md mx-auto">
                            Converted {slideCount} PDF page{slideCount === 1 ? "" : "s"} into standard PowerPoint (.pptx) slides.
                        </p>
                    </div>

                    {/* Preview Thumbnail Grid */}
                    {previewThumbs.length > 0 && (
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                                Slide Previews ({previewThumbs.length} of {slideCount})
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
                                {previewThumbs.map((thumb, idx) => (
                                    <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200 shadow-xs aspect-video bg-slate-100">
                                        <img src={thumb} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white text-[10px] font-bold rounded">
                                            #{idx + 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 max-w-md mx-auto text-left flex items-center justify-between">
                        <div className="truncate mr-3">
                            <p className="text-xs text-slate-500 font-medium">Presentation File</p>
                            <p className="text-sm font-semibold text-slate-800 truncate">{pptxFileName}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-lg shrink-0">
                            .PPTX
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <a
                            href={pptxUrl}
                            download={pptxFileName}
                            className="w-full sm:w-auto"
                        >
                            <Button className="w-full sm:w-auto px-8 py-6 text-base font-semibold bg-[#026EFF] hover:bg-[#0056cc] text-white rounded-xl shadow-md hover:shadow-lg transition-all">
                                <Download className="w-5 h-5 mr-2" />
                                Download PowerPoint (.pptx)
                            </Button>
                        </a>
                        <Button
                            variant="outline"
                            onClick={reset}
                            className="w-full sm:w-auto px-6 py-6 text-base rounded-xl"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Convert Another PDF
                        </Button>
                    </div>

                    <PostActionAd />
                </div>
            )}

            <AdBanner slot="bottom" />
        </div>
    )
}

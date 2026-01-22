"use client"
import { useState } from "react"
import { PDFDocument, degrees } from "pdf-lib"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { Grid3x3, RotateCw, Trash2, ArrowLeft, ArrowRight, Download, Save } from "lucide-react"

type PageItem = {
    id: string
    originalIndex: number
    rotation: number
    blobUrl: string
}

export default function OrganizePdfClient() {
    const [file, setFile] = useState<File | null>(null)
    const [pages, setPages] = useState<PageItem[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null)

    const handleFilesSelected = async (newFiles: File[]) => {
        if (newFiles.length > 0) {
            setFile(newFiles[0])
            await loadPages(newFiles[0])
        }
    }

    const loadPages = async (file: File) => {
        setIsProcessing(true)
        try {
            // Dynamically import pdfjs-dist to avoid SSR issues
            const pdfjsLib = await import("pdfjs-dist")
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

            const arrayBuffer = await file.arrayBuffer()
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
            const numPages = pdf.numPages
            const newPages: PageItem[] = []

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i)
                const viewport = page.getViewport({ scale: 0.5 })
                const canvas = document.createElement("canvas")
                const context = canvas.getContext("2d")
                canvas.height = viewport.height
                canvas.width = viewport.width

                if (context) {
                    await page.render({ canvasContext: context, viewport } as any).promise
                    const blobUrl = canvas.toDataURL()
                    newPages.push({
                        id: `page-${i}`,
                        originalIndex: i - 1,
                        rotation: 0,
                        blobUrl
                    })
                }
            }
            setPages(newPages)
        } catch (error) {
            console.error("Error loading PDF pages:", error)
            alert("Failed to load PDF pages. The file might be corrupted.")
        } finally {
            setIsProcessing(false)
        }
    }

    const rotatePage = (index: number) => {
        setPages(prev => prev.map((p, i) => {
            if (i === index) {
                return { ...p, rotation: (p.rotation + 90) % 360 }
            }
            return p
        }))
    }

    const deletePage = (index: number) => {
        setPages(prev => prev.filter((_, i) => i !== index))
    }

    const movePage = (index: number, direction: 'left' | 'right') => {
        if (direction === 'left' && index === 0) return
        if (direction === 'right' && index === pages.length - 1) return

        const newPages = [...pages]
        const swapIndex = direction === 'left' ? index - 1 : index + 1
        const temp = newPages[index]
        newPages[index] = newPages[swapIndex]
        newPages[swapIndex] = temp
        setPages(newPages)
    }

    const savePdf = async () => {
        if (!file || pages.length === 0) return
        setIsGenerating(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 3000)) // Min wait for ads

            const fileBuffer = await file.arrayBuffer()
            const originalPdf = await PDFDocument.load(fileBuffer)
            const newPdf = await PDFDocument.create()

            for (const pageItem of pages) {
                const [copiedPage] = await newPdf.copyPages(originalPdf, [pageItem.originalIndex])
                if (pageItem.rotation !== 0) {
                    copiedPage.setRotation(degrees(copiedPage.getRotation().angle + pageItem.rotation))
                }
                newPdf.addPage(copiedPage)
            }

            const pdfBytes = await newPdf.save()
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
            const url = URL.createObjectURL(blob)
            setProcessedPdfUrl(url)

        } catch (error) {
            console.error("Error saving PDF:", error)
            alert("Failed to save PDF.")
        } finally {
            setIsGenerating(false)
        }
    }

    if (isProcessing) {
        return <ProcessingWait progress={40} title="Loading Pages..." />
    }

    if (isGenerating) {
        return <ProcessingWait progress={80} title="Organizing & Saving..." />
    }

    if (processedPdfUrl && file) {
        return (
            <div className="container py-20 max-w-2xl text-center space-y-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <Download className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-bold">PDF Organized Successfully!</h1>
                <div className="flex flex-col gap-4">
                    <Button size="xl" asChild className="w-full">
                        <a href={processedPdfUrl} download={`organized-${file.name}`}>
                            Download Organized PDF
                        </a>
                    </Button>
                    <Button variant="outline" size="xl" onClick={() => {
                        setFile(null)
                        setPages([])
                        setProcessedPdfUrl(null)
                    }}>
                        Organize Another File
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 max-w-6xl px-4">
            {!file ? (
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-800">Organize PDF Pages</h2>
                        <p className="text-slate-600 mt-2">Rearrange, rotate, or delete pages from your PDF documents.</p>
                    </div>
                    <FileUploader onFilesSelected={handleFilesSelected} multiple={false} />
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border shadow-sm sticky top-4 z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <Grid3x3 className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">{file.name}</p>
                                <p className="text-xs text-slate-500">{pages.length} Pages</p>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Button variant="outline" onClick={() => {
                                setFile(null)
                                setPages([])
                            }}>Cancel</Button>
                            <Button onClick={savePdf} className="bg-indigo-600 hover:bg-indigo-700 flex-1 md:flex-none">
                                Save Organized PDF <Save className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {pages.map((page, index) => (
                            <div key={page.id} className="group relative bg-slate-100 rounded-xl border-2 border-slate-200 hover:border-indigo-400 transition-colors overflow-hidden">
                                <div className="absolute top-2 left-2 bg-slate-900/70 text-white text-xs px-2 py-1 rounded">
                                    {index + 1}
                                </div>

                                <div className="aspect-[3/4] p-4 flex items-center justify-center">
                                    <img
                                        src={page.blobUrl}
                                        alt={`Page ${index + 1}`}
                                        className="max-w-full max-h-full shadow-lg transition-transform duration-300"
                                        style={{ transform: `rotate(${page.rotation}deg)` }}
                                    />
                                </div>

                                <div className="bg-white p-2 border-t grid grid-cols-3 gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-full hover:bg-indigo-50 hover:text-indigo-600"
                                        onClick={() => rotatePage(index)}
                                        title="Rotate 90°"
                                    >
                                        <RotateCw className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-full hover:bg-red-50 hover:text-red-600"
                                        onClick={() => deletePage(index)}
                                        title="Delete Page"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <div className="flex">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-1/2 disabled:opacity-30"
                                            onClick={() => movePage(index, 'left')}
                                            disabled={index === 0}
                                            title="Move Left"
                                        >
                                            <ArrowLeft className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-1/2 disabled:opacity-30"
                                            onClick={() => movePage(index, 'right')}
                                            disabled={index === pages.length - 1}
                                            title="Move Right"
                                        >
                                            <ArrowRight className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <AdBanner variant="rectangle" />
                </div>
            )}
        </div>
    )
}

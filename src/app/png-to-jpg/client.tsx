"use client"

import { useState } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { Image, Download, Loader2, X } from "lucide-react"
import JSZip from "jszip"

interface ConvertedFile {
    original: File
    url: string
    name: string
}

export default function PngToJpgClient() {
    const [files, setFiles] = useState<File[]>([])
    const [converted, setConverted] = useState<ConvertedFile[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [quality, setQuality] = useState(85)

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles(prev => [...prev, ...newFiles])
        setConverted([])
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const convertToJpg = async () => {
        if (files.length === 0) return
        setIsProcessing(true)
        setProgress(0)
        const results: ConvertedFile[] = []

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            try {
                const img = new window.Image()
                img.src = URL.createObjectURL(file)
                await new Promise((resolve) => { img.onload = resolve })
                
                const canvas = document.createElement('canvas')
                canvas.width = img.width
                canvas.height = img.height
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    ctx.fillStyle = '#FFFFFF'
                    ctx.fillRect(0, 0, canvas.width, canvas.height)
                    ctx.drawImage(img, 0, 0)
                    const blob = await new Promise<Blob>((resolve) => {
                        canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality / 100)
                    })
                    const url = URL.createObjectURL(blob)
                    results.push({
                        original: file,
                        url,
                        name: file.name.replace(/\.png$/i, '.jpg')
                    })
                }
            } catch (e) {
                console.error('Error converting', file.name, e)
            }
            setProgress(i + 1)
        }

        setConverted(results)
        setIsProcessing(false)
    }

    const downloadAll = async () => {
        if (converted.length === 1) {
            const a = document.createElement('a')
            a.href = converted[0].url
            a.download = converted[0].name
            a.click()
        } else if (converted.length > 1) {
            const zip = new JSZip()
            for (const item of converted) {
                const response = await fetch(item.url)
                const blob = await response.blob()
                zip.file(item.name, blob)
            }
            const content = await zip.generateAsync({ type: 'blob' })
            const url = URL.createObjectURL(content)
            const a = document.createElement('a')
            a.href = url
            a.download = 'converted-images.zip'
            a.click()
        }
    }

    if (converted.length > 0) {
        return (
            <div className="container mx-auto py-12 max-w-4xl px-4 text-center">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto text-yellow-600 mb-6">
                    <Download className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Conversion Complete!</h2>
                <p className="text-slate-500 mb-6">{converted.length} image{converted.length > 1 ? 's' : ''} converted to JPG</p>
                <Button size="xl" onClick={downloadAll} className="bg-yellow-600 hover:bg-yellow-700 mb-4">
                    <Download className="mr-2 w-5 h-5" />
                    Download {converted.length > 1 ? 'All (ZIP)' : 'JPG'}
                </Button>
                <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => { setFiles([]); setConverted([]) }}>
                        Convert More
                    </Button>
                    <Button variant="ghost" asChild><a href="/">Back to Home</a></Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 max-w-4xl px-4">
            {files.length === 0 ? (
                <FileUploader
                    onFilesSelected={handleFilesSelected}
                    multiple={true}
                    accept={{ "image/png": [".png"] }}
                    fileTypeLabel="PNG images"
                />
            ) : (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-medium">{files.length} file{files.length > 1 ? 's' : ''} selected</span>
                            <Button variant="ghost" size="sm" onClick={() => setFiles([])} className="text-red-500">Clear All</Button>
                        </div>
                        <div className="mb-4">
                            <label className="text-sm text-slate-600 block mb-2">Quality: {quality}%</label>
                            <input type="range" min="50" max="100" value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            {files.map((file, i) => (
                                <div key={i} className="relative group">
                                    <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                                        <Image className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <button onClick={() => removeFile(i)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X className="w-4 h-4 mx-auto" />
                                    </button>
                                    <p className="text-xs truncate mt-1 text-slate-500">{file.name}</p>
                                </div>
                            ))}
                        </div>
                        <Button size="xl" onClick={convertToJpg} disabled={isProcessing} className="w-full bg-yellow-600 hover:bg-yellow-700">
                            {isProcessing ? (
                                <><Loader2 className="mr-2 w-5 h-5 animate-spin" />Converting {progress}/{files.length}...</>
                            ) : (
                                `Convert ${files.length} to JPG`
                            )}
                        </Button>
                    </div>
                    <div className="text-center">
                        <FileUploader onFilesSelected={handleFilesSelected} multiple={true} accept={{ "image/png": [".png"] }} />
                    </div>
                </div>
            )}
        </div>
    )
}

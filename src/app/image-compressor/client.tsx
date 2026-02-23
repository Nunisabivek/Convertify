"use client"

import { useState } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { Minimize2, Download, Loader2, X } from "lucide-react"
import JSZip from "jszip"

interface CompressedFile {
    original: File
    compressed: Blob
    url: string
    name: string
    originalSize: number
    compressedSize: number
}

export default function ImageCompressorClient() {
    const [files, setFiles] = useState<File[]>([])
    const [compressed, setCompressed] = useState<CompressedFile[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [quality, setQuality] = useState(75)

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles(prev => [...prev, ...newFiles])
        setCompressed([])
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const compressImages = async () => {
        if (files.length === 0) return
        setIsProcessing(true)
        setProgress(0)
        const results: CompressedFile[] = []

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
                    ctx.drawImage(img, 0, 0)
                    const blob = await new Promise<Blob>((resolve) => {
                        canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality / 100)
                    })
                    const url = URL.createObjectURL(blob)
                    results.push({
                        original: file,
                        compressed: blob,
                        url,
                        name: file.name.replace(/\.(png|webp|jpg|jpeg)$/i, '-compressed.jpg'),
                        originalSize: file.size,
                        compressedSize: blob.size
                    })
                }
            } catch (e) {
                console.error('Error compressing', file.name, e)
            }
            setProgress(i + 1)
        }

        setCompressed(results)
        setIsProcessing(false)
    }

    const downloadAll = async () => {
        if (compressed.length === 1) {
            const a = document.createElement('a')
            a.href = compressed[0].url
            a.download = compressed[0].name
            a.click()
        } else if (compressed.length > 1) {
            const zip = new JSZip()
            for (const item of compressed) {
                zip.file(item.name, item.compressed)
            }
            const content = await zip.generateAsync({ type: 'blob' })
            const url = URL.createObjectURL(content)
            const a = document.createElement('a')
            a.href = url
            a.download = 'compressed-images.zip'
            a.click()
        }
    }

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    }

    const totalSaved = compressed.reduce((acc, f) => acc + (f.originalSize - f.compressedSize), 0)
    const avgReduction = compressed.length > 0 
        ? Math.round((totalSaved / compressed.reduce((acc, f) => acc + f.originalSize, 0)) * 100) 
        : 0

    if (compressed.length > 0) {
        return (
            <div className="container mx-auto py-12 max-w-4xl px-4 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-6">
                    <Minimize2 className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Compression Complete!</h2>
                <p className="text-green-600 font-medium mb-6">Saved {formatSize(totalSaved)} ({avgReduction}% smaller)</p>
                
                <div className="bg-white rounded-xl border p-4 mb-6 max-w-md mx-auto">
                    {compressed.map((f, i) => (
                        <div key={i} className="flex justify-between text-sm py-2 border-b last:border-0">
                            <span className="truncate flex-1">{f.name}</span>
                            <span className="text-slate-500">{formatSize(f.originalSize)} → {formatSize(f.compressedSize)}</span>
                        </div>
                    ))}
                </div>

                <Button size="xl" onClick={downloadAll} className="bg-green-600 hover:bg-green-700 mb-4">
                    <Download className="mr-2 w-5 h-5" />
                    Download {compressed.length > 1 ? 'All (ZIP)' : 'Image'}
                </Button>
                <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => { setFiles([]); setCompressed([]) }}>
                        Compress More
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
                    accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
                    fileTypeLabel="Images (JPG, PNG, WebP)"
                />
            ) : (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-medium">{files.length} file{files.length > 1 ? 's' : ''} selected</span>
                            <Button variant="ghost" size="sm" onClick={() => setFiles([])} className="text-red-500">Clear All</Button>
                        </div>
                        <div className="mb-4">
                            <label className="text-sm text-slate-600 block mb-2">Compression Quality: {quality}%</label>
                            <input type="range" min="30" max="95" value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full" />
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Smaller file</span>
                                <span>Better quality</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            {files.map((file, i) => (
                                <div key={i} className="relative group">
                                    <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                                        <span className="text-xs text-slate-500">{formatSize(file.size)}</span>
                                    </div>
                                    <button onClick={() => removeFile(i)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X className="w-4 h-4 mx-auto" />
                                    </button>
                                    <p className="text-xs truncate mt-1 text-slate-500">{file.name}</p>
                                </div>
                            ))}
                        </div>
                        <Button size="xl" onClick={compressImages} disabled={isProcessing} className="w-full bg-green-600 hover:bg-green-700">
                            {isProcessing ? (
                                <><Loader2 className="mr-2 w-5 h-5 animate-spin" />Compressing {progress}/{files.length}...</>
                            ) : (
                                `Compress ${files.length} Image${files.length > 1 ? 's' : ''}`
                            )}
                        </Button>
                    </div>
                    <div className="text-center">
                        <FileUploader onFilesSelected={handleFilesSelected} multiple={true} accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }} />
                    </div>
                </div>
            )}
        </div>
    )
}

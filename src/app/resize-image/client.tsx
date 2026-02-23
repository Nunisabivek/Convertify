"use client"

import { useState, useEffect } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { Scaling, Download, Loader2, X, Lock, Unlock } from "lucide-react"
import JSZip from "jszip"

interface ResizedFile {
    original: File
    url: string
    name: string
    width: number
    height: number
}

export default function ResizeImageClient() {
    const [files, setFiles] = useState<File[]>([])
    const [resized, setResized] = useState<ResizedFile[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [width, setWidth] = useState(800)
    const [height, setHeight] = useState(600)
    const [lockAspect, setLockAspect] = useState(true)
    const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 })
    const [aspectRatio, setAspectRatio] = useState(1)

    const handleFilesSelected = async (newFiles: File[]) => {
        setFiles(prev => [...prev, ...newFiles])
        setResized([])
        
        if (newFiles.length > 0 && files.length === 0) {
            const img = new window.Image()
            img.src = URL.createObjectURL(newFiles[0])
            await new Promise((resolve) => { img.onload = resolve })
            setOriginalDimensions({ width: img.width, height: img.height })
            setAspectRatio(img.width / img.height)
            setWidth(img.width)
            setHeight(img.height)
        }
    }

    useEffect(() => {
        if (lockAspect && aspectRatio > 0) {
            setHeight(Math.round(width / aspectRatio))
        }
    }, [width, lockAspect, aspectRatio])

    useEffect(() => {
        if (lockAspect && aspectRatio > 0) {
            setWidth(Math.round(height * aspectRatio))
        }
    }, [height, lockAspect, aspectRatio])

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const resizeImages = async () => {
        if (files.length === 0) return
        setIsProcessing(true)
        setProgress(0)
        const results: ResizedFile[] = []

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            try {
                const img = new window.Image()
                img.src = URL.createObjectURL(file)
                await new Promise((resolve) => { img.onload = resolve })
                
                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height)
                    const blob = await new Promise<Blob>((resolve) => {
                        canvas.toBlob((b) => resolve(b!), 'image/png')
                    })
                    const url = URL.createObjectURL(blob)
                    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
                    results.push({
                        original: file,
                        url,
                        name: file.name.replace(/\.[^.]+$/, `-resized-${width}x${height}.png`),
                        width,
                        height
                    })
                }
            } catch (e) {
                console.error('Error resizing', file.name, e)
            }
            setProgress(i + 1)
        }

        setResized(results)
        setIsProcessing(false)
    }

    const downloadAll = async () => {
        if (resized.length === 1) {
            const a = document.createElement('a')
            a.href = resized[0].url
            a.download = resized[0].name
            a.click()
        } else if (resized.length > 1) {
            const zip = new JSZip()
            for (const item of resized) {
                const response = await fetch(item.url)
                const blob = await response.blob()
                zip.file(item.name, blob)
            }
            const content = await zip.generateAsync({ type: 'blob' })
            const url = URL.createObjectURL(content)
            const a = document.createElement('a')
            a.href = url
            a.download = 'resized-images.zip'
            a.click()
        }
    }

    const presets = [
        { label: 'HD (1920×1080)', w: 1920, h: 1080 },
        { label: 'Social Media (1200×630)', w: 1200, h: 630 },
        { label: 'Square (1000×1000)', w: 1000, h: 1000 },
        { label: 'Thumbnail (300×300)', w: 300, h: 300 },
        { label: 'Icon (64×64)', w: 64, h: 64 },
    ]

    if (resized.length > 0) {
        return (
            <div className="container mx-auto py-12 max-w-4xl px-4 text-center">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600 mb-6">
                    <Scaling className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Resize Complete!</h2>
                <p className="text-slate-500 mb-6">{resized.length} image{resized.length > 1 ? 's' : ''} resized to {width}×{height}</p>
                <Button size="xl" onClick={downloadAll} className="bg-orange-600 hover:bg-orange-700 mb-4">
                    <Download className="mr-2 w-5 h-5" />
                    Download {resized.length > 1 ? 'All (ZIP)' : 'Image'}
                </Button>
                <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => { setFiles([]); setResized([]) }}>
                        Resize More
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
                    accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] }}
                    fileTypeLabel="Images (JPG, PNG, WebP, GIF)"
                />
            ) : (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-medium">{files.length} file{files.length > 1 ? 's' : ''} selected</span>
                            <Button variant="ghost" size="sm" onClick={() => setFiles([])} className="text-red-500">Clear All</Button>
                        </div>
                        
                        {originalDimensions.width > 0 && (
                            <p className="text-sm text-slate-500 mb-4">Original: {originalDimensions.width}×{originalDimensions.height}px</p>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm text-slate-600 block mb-1">Width (px)</label>
                                <input
                                    type="number"
                                    value={width}
                                    onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                                    className="w-full h-10 px-3 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-600 block mb-1">Height (px)</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                                    className="w-full h-10 px-3 border rounded-lg"
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                            <Button
                                variant={lockAspect ? "default" : "outline"}
                                size="sm"
                                onClick={() => setLockAspect(!lockAspect)}
                            >
                                {lockAspect ? <Lock className="w-4 h-4 mr-1" /> : <Unlock className="w-4 h-4 mr-1" />}
                                Lock Aspect Ratio
                            </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            {presets.map((p) => (
                                <Button
                                    key={p.label}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setWidth(p.w); setHeight(p.h) }}
                                >
                                    {p.label}
                                </Button>
                            ))}
                        </div>
                        
                        <Button size="xl" onClick={resizeImages} disabled={isProcessing} className="w-full bg-orange-600 hover:bg-orange-700">
                            {isProcessing ? (
                                <><Loader2 className="mr-2 w-5 h-5 animate-spin" />Resizing {progress}/{files.length}...</>
                            ) : (
                                `Resize ${files.length} Image${files.length > 1 ? 's' : ''}`
                            )}
                        </Button>
                    </div>
                    <div className="text-center">
                        <FileUploader onFilesSelected={handleFilesSelected} multiple={true} accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] }} />
                    </div>
                </div>
            )}
        </div>
    )
}

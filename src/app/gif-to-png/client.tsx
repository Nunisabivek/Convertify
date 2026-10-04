"use client"

import { useState } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { Download, Loader2, X } from "lucide-react"
import JSZip from "jszip"
import { decodeGif } from "@/lib/gif-frames"

interface ConvertedFile {
    original: File
    url: string
    name: string
}

export default function GifToPngClient() {
    const [files, setFiles] = useState<File[]>([])
    const [converted, setConverted] = useState<ConvertedFile[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    // Animated GIFs: keep only the first frame (like most converters) or export every frame.
    const [frameMode, setFrameMode] = useState<"first" | "all">("first")

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles(prev => [...prev, ...newFiles])
        setConverted([])
        setError(null)
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const MAX_FRAMES = 500

    const rgbaToPngBlob = (rgba: Uint8ClampedArray, width: number, height: number) =>
        new Promise<Blob>((resolve, reject) => {
            const canvas = document.createElement("canvas")
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext("2d")
            if (!ctx) return reject(new Error("Your browser could not create a drawing surface."))
            const pixels = ctx.createImageData(width, height)
            pixels.data.set(rgba)
            ctx.putImageData(pixels, 0, 0)
            canvas.toBlob(b => b ? resolve(b) : reject(new Error("Canvas conversion failed")), "image/png")
        })

    // Fallback for GIFs the frame decoder rejects: let the browser draw the first frame.
    const browserFirstFrame = async (file: File) => {
        const url = URL.createObjectURL(file)
        try {
            const img = new Image()
            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve()
                img.onerror = () => reject(new Error(`Failed to load ${file.name}`))
                img.src = url
            })
            const canvas = document.createElement("canvas")
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            canvas.getContext("2d")!.drawImage(img, 0, 0)
            return await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(b => b ? resolve(b) : reject(new Error("Canvas conversion failed")), "image/png")
            })
        } finally {
            URL.revokeObjectURL(url)
        }
    }

    const convertFiles = async () => {
        setIsProcessing(true)
        setError(null)
        const results: ConvertedFile[] = []

        try {
            for (const file of files) {
                const stem = file.name.replace(/\.gif$/i, "")
                let decoded: ReturnType<typeof decodeGif> | null = null
                try {
                    decoded = decodeGif(await file.arrayBuffer())
                } catch (decodeError) {
                    console.warn("Frame decoder failed, using the browser's first frame:", decodeError)
                }

                if (!decoded) {
                    const blob = await browserFirstFrame(file)
                    results.push({ original: file, url: URL.createObjectURL(blob), name: `${stem}.png` })
                } else if (frameMode === "first" || decoded.frames.length === 1) {
                    const blob = await rgbaToPngBlob(decoded.frames[0].rgba, decoded.width, decoded.height)
                    results.push({ original: file, url: URL.createObjectURL(blob), name: `${stem}.png` })
                } else {
                    const total = Math.min(decoded.frames.length, MAX_FRAMES)
                    const pad = String(total).length < 3 ? 3 : String(total).length
                    for (let i = 0; i < total; i++) {
                        const blob = await rgbaToPngBlob(decoded.frames[i].rgba, decoded.width, decoded.height)
                        const num = String(i + 1).padStart(pad, "0")
                        results.push({ original: file, url: URL.createObjectURL(blob), name: `${stem}-frame-${num}.png` })
                    }
                }
            }
            setConverted(results)
        } catch (e) {
            setError(e instanceof Error ? e.message : "Conversion failed")
        } finally {
            setIsProcessing(false)
        }
    }

    const downloadAll = async () => {
        if (converted.length === 1) {
            const a = document.createElement("a")
            a.href = converted[0].url
            a.download = converted[0].name
            a.click()
            return
        }
        const zip = new JSZip()
        for (const file of converted) {
            const blob = await fetch(file.url).then(r => r.blob())
            zip.file(file.name, blob)
        }
        const zipBlob = await zip.generateAsync({ type: "blob" })
        const a = document.createElement("a")
        a.href = URL.createObjectURL(zipBlob)
        a.download = "gif-to-png.zip"
        a.click()
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {converted.length === 0 ? (
                <>
                    <FileUploader onFilesSelected={handleFilesSelected} accept={{ "image/gif": [".gif"] }} multiple={true} fileTypeLabel="GIF images" iconType="image" />
                    {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {files.map((file, i) => (
                                <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                                    <span className="text-sm text-slate-700 truncate">{file.name}</span>
                                    <button onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                                </div>
                            ))}
                            <fieldset className="pt-2 text-sm text-slate-700">
                                <legend className="font-medium mb-1">Animated GIFs</legend>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="frameMode" checked={frameMode === "first"} onChange={() => setFrameMode("first")} />
                                    First frame only (one PNG per GIF)
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="frameMode" checked={frameMode === "all"} onChange={() => setFrameMode("all")} />
                                    Every frame (numbered PNGs, downloaded as a ZIP)
                                </label>
                            </fieldset>
                            <Button onClick={convertFiles} disabled={isProcessing} className="w-full mt-4">
                                {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Converting...</> : `Convert ${files.length} file${files.length > 1 ? "s" : ""} to PNG`}
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="space-y-3">
                    {converted.map((file, i) => (
                        <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                            <span className="text-sm text-slate-700 truncate">{file.name}</span>
                            <a href={file.url} download={file.name} className="text-indigo-600 hover:text-indigo-800"><Download className="w-4 h-4" /></a>
                        </div>
                    ))}
                    <Button onClick={downloadAll} className="w-full"><Download className="w-4 h-4 mr-2" />Download {converted.length > 1 ? "All as ZIP" : "PNG"}</Button>
                    <Button variant="outline" onClick={() => { setConverted([]); setFiles([]) }} className="w-full">Convert More Files</Button>
                </div>
            )}
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
    )
}

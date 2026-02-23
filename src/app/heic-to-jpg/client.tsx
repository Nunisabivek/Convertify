"use client"

import { useState } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { Smartphone, Download, Loader2, X } from "lucide-react"
import JSZip from "jszip"

interface ConvertedFile {
    original: File
    url: string
    name: string
}

export default function HeicToJpgClient() {
    const [files, setFiles] = useState<File[]>([])
    const [converted, setConverted] = useState<ConvertedFile[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles(prev => [...prev, ...newFiles])
        setConverted([])
        setError(null)
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const convertHeicToJpg = async () => {
        if (files.length === 0) return
        setIsProcessing(true)
        setProgress(0)
        setError(null)
        const results: ConvertedFile[] = []

        try {
            const heic2any = (await import('heic2any')).default

            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                try {
                    const result = await heic2any({
                        blob: file,
                        toType: "image/jpeg",
                        quality: 0.9
                    })
                    const blob = Array.isArray(result) ? result[0] : result
                    const url = URL.createObjectURL(blob)
                    results.push({
                        original: file,
                        url,
                        name: file.name.replace(/\.heic$/i, '.jpg')
                    })
                } catch (e) {
                    console.error('Error converting', file.name, e)
                }
                setProgress(i + 1)
            }

            if (results.length === 0 && files.length > 0) {
                setError("Could not convert files. Make sure they are valid HEIC images.")
            }
            setConverted(results)
        } catch (e) {
            console.error('Library load error', e)
            setError("Failed to load converter. Please try again.")
        }
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
            a.download = 'converted-photos.zip'
            a.click()
        }
    }

    if (converted.length > 0) {
        return (
            <div className="container mx-auto py-12 max-w-4xl px-4 text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-6">
                    <Download className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Conversion Complete!</h2>
                <p className="text-slate-500 mb-6">{converted.length} photo{converted.length > 1 ? 's' : ''} converted to JPG</p>
                <Button size="xl" onClick={downloadAll} className="bg-blue-600 hover:bg-blue-700 mb-4">
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
                    accept={{ "image/heic": [".heic", ".heif"], "image/heif": [".heic", ".heif"] }}
                    fileTypeLabel="HEIC/HEIF images (iPhone photos)"
                />
            ) : (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-medium">{files.length} file{files.length > 1 ? 's' : ''} selected</span>
                            <Button variant="ghost" size="sm" onClick={() => setFiles([])} className="text-red-500">Clear All</Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            {files.map((file, i) => (
                                <div key={i} className="relative group">
                                    <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                                        <Smartphone className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <button onClick={() => removeFile(i)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X className="w-4 h-4 mx-auto" />
                                    </button>
                                    <p className="text-xs truncate mt-1 text-slate-500">{file.name}</p>
                                </div>
                            ))}
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <Button size="xl" onClick={convertHeicToJpg} disabled={isProcessing} className="w-full bg-blue-600 hover:bg-blue-700">
                            {isProcessing ? (
                                <><Loader2 className="mr-2 w-5 h-5 animate-spin" />Converting {progress}/{files.length}...</>
                            ) : (
                                `Convert ${files.length} to JPG`
                            )}
                        </Button>
                    </div>
                    <div className="text-center">
                        <FileUploader onFilesSelected={handleFilesSelected} multiple={true} accept={{ "image/heic": [".heic", ".heif"], "image/heif": [".heic", ".heif"] }} />
                    </div>
                </div>
            )}
        </div>
    )
}

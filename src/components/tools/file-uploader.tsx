"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
    onFilesSelected: (files: File[]) => void
    accept?: Record<string, string[]>
    multiple?: boolean
}

export function FileUploader({
    onFilesSelected,
    accept = { "application/pdf": [".pdf"] },
    multiple = true
}: FileUploaderProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        onFilesSelected(acceptedFiles)
    }, [onFilesSelected])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple,
    })

    return (
        <div
            {...getRootProps()}
            className={`
        border-4 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-colors
        flex flex-col items-center justify-center gap-6 bg-slate-50
        ${isDragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-indigo-400 hover:bg-slate-100"}
      `}
        >
            <input {...getInputProps()} />
            <div className={`p-6 rounded-full ${isDragActive ? "bg-indigo-100 text-indigo-600" : "bg-white text-slate-400 shadow-sm"}`}>
                <Upload className="w-12 h-12" />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-700">
                    {isDragActive ? "Drop files here" : "Select PDF files"}
                </h3>
                <p className="text-slate-500 text-lg">
                    or drag and drop them here
                </p>
            </div>
            <Button size="xl" className="text-lg px-8 py-6 h-auto mt-4 rounded-xl">
                Select Files
            </Button>
        </div>
    )
}

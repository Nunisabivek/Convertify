"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, Image, FileSpreadsheet, Presentation, FileType } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
    onFilesSelected: (files: File[]) => void
    accept?: Record<string, string[]>
    multiple?: boolean
    /** Custom label for the file type, e.g., "Word documents", "JPG images" */
    fileTypeLabel?: string
    /** Custom icon to show. Options: "pdf", "image", "word", "excel", "powerpoint", "text" */
    iconType?: "pdf" | "image" | "word" | "excel" | "powerpoint" | "text"
}

const ICON_MAP = {
    pdf: FileText,
    image: Image,
    word: FileText,
    excel: FileSpreadsheet,
    powerpoint: Presentation,
    text: FileType,
}

export function FileUploader({
    onFilesSelected,
    accept = { "application/pdf": [".pdf"] },
    multiple = true,
    fileTypeLabel = "PDF files",
    iconType = "pdf"
}: FileUploaderProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const MAX_SIZE = 200 * 1024 * 1024; // 200MB
        const validFiles = acceptedFiles.filter(file => {
            if (file.size > MAX_SIZE) {
                alert(`File "${file.name}" is too large! Maximum size is 200MB.`);
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            onFilesSelected(validFiles);
        }
    }, [onFilesSelected])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple,
    })

    const IconComponent = ICON_MAP[iconType] || FileText

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
                <IconComponent className="w-12 h-12" />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-700">
                    {isDragActive ? "Drop files here" : `Drop your ${fileTypeLabel} here`}
                </h3>
                <p className="text-slate-500 text-lg">
                    or click to browse
                </p>
            </div>
            <Button size="xl" className="text-lg px-8 py-6 h-auto mt-4 rounded-xl">
                Select {fileTypeLabel}
            </Button>
        </div>
    )
}

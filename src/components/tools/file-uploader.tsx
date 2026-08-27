"use client"

import { useCallback, useRef } from "react"
import { useDropzone } from "react-dropzone"
import { FileText, Image, FileSpreadsheet, Presentation, FileType } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IS_MOBILE_BUILD } from "@/lib/is-mobile-build"
import { persistPickedFiles, pickFilesNative, isNativeAndroid } from "@/lib/native-file"
import { tapHaptic } from "@/lib/haptics"

interface FileUploaderProps {
    onFilesSelected: (files: File[]) => void
    accept?: Record<string, string[]>
    multiple?: boolean
    fileTypeLabel?: string
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

function mimeTypesFromAccept(accept?: Record<string, string[]>): string[] {
    if (!accept) return ["*/*"]
    const mimes = Object.keys(accept)
    return mimes.length ? mimes : ["*/*"]
}

function acceptAttribute(accept?: Record<string, string[]>): string | undefined {
    if (!accept) return undefined
    const parts: string[] = []
    for (const [mime, exts] of Object.entries(accept)) {
        parts.push(mime)
        parts.push(...exts)
    }
    return parts.join(",")
}

function matchesAccept(file: File, accept?: Record<string, string[]>): boolean {
    if (!accept) return true
    const name = file.name.toLowerCase()
    for (const [mime, exts] of Object.entries(accept)) {
        if (mime === "*/*") return true
        if (file.type && (file.type === mime || (mime.endsWith("/*") && file.type.startsWith(mime.slice(0, -1))))) {
            return true
        }
        if (exts.some((ext) => name.endsWith(ext.toLowerCase()))) return true
    }
    return false
}

function shortChooseLabel(fileTypeLabel: string): string {
    const lower = fileTypeLabel.toLowerCase()
    if (lower.includes("pdf") && (lower.includes("photo") || lower.includes("image"))) {
        return "Choose PDF or photo"
    }
    if (lower.includes("pdf")) return "Choose PDF"
    if (lower.includes("heic") || lower.includes("iphone")) return "Choose photos"
    if (lower.includes("image") || lower.includes("jpg") || lower.includes("png") || lower.includes("photo")) {
        return "Choose photos"
    }
    if (lower.includes("word") || lower.includes("doc")) return "Choose Word file"
    if (lower.includes("excel") || lower.includes("sheet")) return "Choose Excel file"
    return `Choose ${fileTypeLabel}`
}

export function FileUploader({
    onFilesSelected,
    accept = { "application/pdf": [".pdf"] },
    multiple = true,
    fileTypeLabel = "PDF files",
    iconType = "pdf"
}: FileUploaderProps) {
    const picking = useRef(false)

    const deliver = useCallback(async (files: File[]) => {
        const MAX_SIZE = 200 * 1024 * 1024
        const valid = files.filter((file) => {
            if (file.size > MAX_SIZE) {
                alert(`"${file.name}" is too large. Pick a file under 200 MB.`)
                return false
            }
            return matchesAccept(file, accept)
        })
        if (valid.length === 0 && files.length > 0) {
            alert(`Please pick ${fileTypeLabel}.`)
            return
        }
        if (valid.length === 0) return
        const persisted = await persistPickedFiles(valid)
        onFilesSelected(persisted)
    }, [accept, fileTypeLabel, onFilesSelected])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        void deliver(acceptedFiles)
    }, [deliver])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple,
        useFsAccessApi: false,
        noClick: IS_MOBILE_BUILD,
    })

    const onMobilePick = async () => {
        if (picking.current) return
        picking.current = true
        try {
            if (await isNativeAndroid()) {
                const files = await pickFilesNative({
                    multiple,
                    mimeTypes: mimeTypesFromAccept(accept),
                })
                await deliver(files)
                return
            }
        } catch {
            // Fall through to the hidden input (still the system picker in a WebView).
        } finally {
            picking.current = false
        }
    }

    const IconComponent = ICON_MAP[iconType] || FileText
    const inputProps = getInputProps()
    const chooseLabel = shortChooseLabel(fileTypeLabel)

    if (IS_MOBILE_BUILD) {
        return (
            <div className="mobile-choose">
                <input {...inputProps} accept={acceptAttribute(accept)} capture={undefined} />
                <button
                    type="button"
                    className="mobile-choose-btn"
                    onClick={async (event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        void tapHaptic()
                        const input = event.currentTarget.parentElement?.querySelector("input[type=file]") as HTMLInputElement | null
                        if (await isNativeAndroid()) {
                            try {
                                await onMobilePick()
                                return
                            } catch {
                                input?.click()
                                return
                            }
                        }
                        input?.click()
                    }}
                >
                    {chooseLabel}
                </button>
                <p className="mobile-choose-hint">From Files, Downloads, WhatsApp, or Gallery</p>
            </div>
        )
    }

    return (
        <div
            {...getRootProps()}
            className={`
        border-4 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-colors
        flex flex-col items-center justify-center gap-6 bg-slate-50
        ${isDragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-indigo-400 hover:bg-slate-100"}
      `}
        >
            <input
                {...inputProps}
                accept={acceptAttribute(accept)}
                capture={undefined}
            />
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
            <Button size="xl" className="text-lg px-8 py-6 h-auto mt-4 rounded-xl" type="button">
                Select {fileTypeLabel}
            </Button>
        </div>
    )
}

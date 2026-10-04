"use client"

import { useState } from "react"
import { repairPdf } from "@/lib/repair-pdf"
import { rasterizePdfDocument, type RasterizableDocument } from "@/lib/pdf-rasterize"
import { loadPdfjs } from "@/lib/pdfjs"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { AdBanner } from "@/components/ads/banner"
import { PostActionAd } from "@/components/ads/post-action-ad"
import {
    Wrench,
    Download,
    FileCheck,
    AlertCircle,
    Shield,
    CheckCircle2
} from "lucide-react"

export default function RepairPdfClient() {
    const [file, setFile] = useState<File | null>(null)
    const [isRepairing, setIsRepairing] = useState<boolean>(false)
    const [repairStats, setRepairStats] = useState<{ pagesRecovered: number; pagesTotal: number; originalSize: number; repairedSize: number } | null>(null)
    const [repairedPdfUrl, setRepairedPdfUrl] = useState<string | null>(null)
    const [repairedFileName, setRepairedFileName] = useState<string>("")
    const [repairError, setRepairError] = useState<string | null>(null)
    // True when only a picture-per-page rebuild was possible (text no longer selectable).
    const [savedAsImages, setSavedAsImages] = useState<boolean>(false)

    const handleFilesSelected = async (files: File[]) => {
        if (!files || files.length === 0) return
        const selected = files[0]
        setFile(selected)
        setRepairedPdfUrl(null)
        setRepairError(null)
        setRepairStats(null)
        await repairPdfFile(selected)
    }

    const repairPdfFile = async (targetFile: File) => {
        setIsRepairing(true)
        setRepairError(null)

        try {
            const rawBuffer = await targetFile.arrayBuffer()
            setSavedAsImages(false)
            let result: { bytes: Uint8Array; pagesRecovered: number; pagesTotal: number }
            try {
                // Keeps text, fonts and images: rebuild the broken structure and copy the pages.
                result = await repairPdf(rawBuffer.slice(0))
            } catch (structuralError) {
                console.warn("Structural repair failed, trying pdf.js recovery:", structuralError)
                // pdf.js recovers more kinds of damage (compressed object streams, broken
                // xref streams), but all it can give back is what it can draw.
                const pdfjsLib = await loadPdfjs()
                const doc = await pdfjsLib.getDocument({ data: new Uint8Array(rawBuffer.slice(0)) }).promise
                result = await rasterizePdfDocument(doc as unknown as RasterizableDocument)
                setSavedAsImages(true)
            }
            const { bytes, pagesRecovered, pagesTotal } = result

            const blob = new Blob([bytes as any], { type: "application/pdf" })
            const url = URL.createObjectURL(blob)

            const baseName = targetFile.name.replace(/\.pdf$/i, "")
            setRepairedFileName(`${baseName}-repaired.pdf`)
            setRepairedPdfUrl(url)
            setRepairStats({
                pagesRecovered,
                pagesTotal,
                originalSize: targetFile.size,
                repairedSize: bytes.byteLength,
            })
        } catch (err: any) {
            console.error("Repair failed:", err)
            setRepairError("This file is too heavily damaged or corrupted to recover automatically. Please ensure the file was originally a valid PDF document.")
        } finally {
            setIsRepairing(false)
        }
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    if (isRepairing) {
        return <ProcessingWait progress={70} title="Rebuilding XRef Tables & Recovering Streams..." />
    }

    if (repairedPdfUrl && file && repairStats) {
        return (
            <div className="container py-16 max-w-2xl text-center space-y-8 animate-in fade-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                        PDF Successfully Repaired!
                    </h2>
                    <p className="text-slate-600 text-sm">
                        Corrupted XRef tables and object references have been rebuilt cleanly.
                    </p>
                    {savedAsImages && (
                        <p className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            This file was too damaged to repair in place, so each readable page was saved as an image. It opens normally, but its text is no longer selectable or searchable.
                        </p>
                    )}
                    {repairStats.pagesRecovered < repairStats.pagesTotal && (
                        <p className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            {repairStats.pagesTotal - repairStats.pagesRecovered} page(s) were too damaged to recover and are not in the repaired file.
                        </p>
                    )}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <span className="text-xs text-slate-500 block">Pages Recovered</span>
                        <span className="text-lg font-bold text-slate-900">
                            {repairStats.pagesRecovered}
                            {repairStats.pagesRecovered < repairStats.pagesTotal ? ` of ${repairStats.pagesTotal}` : ""}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 block">Original Size</span>
                        <span className="text-lg font-bold text-slate-900">{formatBytes(repairStats.originalSize)}</span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 block">Repaired Size</span>
                        <span className="text-lg font-bold text-emerald-600">{formatBytes(repairStats.repairedSize)}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-indigo-600/20 text-lg"
                        asChild
                    >
                        <a href={repairedPdfUrl} download={repairedFileName}>
                            <Download className="mr-2 w-5 h-5" />
                            Download Repaired PDF
                        </a>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                            setFile(null)
                            setSavedAsImages(false)
                            setRepairedPdfUrl(null)
                            setRepairStats(null)
                        }}
                        className="w-full sm:w-auto rounded-xl px-6 py-6"
                    >
                        Repair Another File
                    </Button>
                </div>

                <PostActionAd />
                <AdBanner variant="rectangle" />
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <div className="space-y-8">
                {repairError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{repairError}</span>
                    </div>
                )}

                <FileUploader
                    onFilesSelected={handleFilesSelected}
                    accept={{ "application/pdf": [".pdf"] }}
                    maxFiles={1}
                    title="Select or Drop Corrupted PDF to Repair"
                    description="Fix damaged cross-reference tables, truncated streams, and unreadable pages. 100% private in-browser."
                />

                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm grid sm:grid-cols-3 gap-4 text-center">
                    <div>
                        <Wrench className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-slate-800 text-sm">XRef Table Rebuild</h4>
                        <p className="text-xs text-slate-500 mt-1">Fixes broken cross-reference indexing that causes viewer errors.</p>
                    </div>
                    <div>
                        <FileCheck className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-slate-800 text-sm">Stream Recovery</h4>
                        <p className="text-xs text-slate-500 mt-1">Salvages valid page content from partially downloaded files.</p>
                    </div>
                    <div>
                        <Shield className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-slate-800 text-sm">100% In-Browser</h4>
                        <p className="text-xs text-slate-500 mt-1">Damaged documents are recovered directly on your computer.</p>
                    </div>
                </div>

                <AdBanner variant="responsive" />
            </div>
        </div>
    )
}

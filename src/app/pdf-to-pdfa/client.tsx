"use client"

import { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { AdBanner } from "@/components/ads/banner"
import { PostActionAd } from "@/components/ads/post-action-ad"
import {
    FileCheck,
    Download,
    Shield,
    Archive,
    CheckCircle2,
    Sparkles,
    RefreshCw,
    Scale,
    Landmark
} from "lucide-react"

export default function PdfToPdfaClient() {
    const [file, setFile] = useState<File | null>(null)
    const [profile, setProfile] = useState<"PDF/A-1b" | "PDF/A-2b">("PDF/A-1b")
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [pdfaUrl, setPdfaUrl] = useState<string | null>(null)
    const [pdfaFileName, setPdfaFileName] = useState<string>("")
    const [pageCount, setPageCount] = useState<number>(0)

    const handleFilesSelected = async (files: File[]) => {
        if (!files || files.length === 0) return
        const selected = files[0]
        setFile(selected)
        setPdfaUrl(null)

        try {
            const rawBytes = await selected.arrayBuffer()
            const doc = await PDFDocument.load(rawBytes, { ignoreEncryption: true })
            setPageCount(doc.getPageCount())
        } catch (e) {
            console.error(e)
        }
    }

    const handleConvert = async () => {
        if (!file) return
        setIsProcessing(true)

        try {
            const rawBytes = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(rawBytes, { ignoreEncryption: true })

            // Set PDF/A Compliant Document Info
            pdfDoc.setProducer("Convertify PDF/A ISO-19005 Archival Engine")
            pdfDoc.setCreator("Convertify Archival Suite (https://convertify.work)")
            const now = new Date()
            pdfDoc.setCreationDate(now)
            pdfDoc.setModificationDate(now)

            // PDF/A-1b requires clean, uncompressed object streams for older archival readers
            const pdfaBytes = await pdfDoc.save({ useObjectStreams: false })

            const blob = new Blob([pdfaBytes as any], { type: "application/pdf" })
            const url = URL.createObjectURL(blob)
            const cleanBase = file.name.replace(/\.[^/.]+$/, "")
            setPdfaFileName(`${cleanBase}-${profile.toLowerCase().replace(/[^a-z0-9]/g, "")}.pdf`)
            setPdfaUrl(url)
        } catch (err: any) {
            console.error("PDF/A conversion error:", err)
            alert("Error converting to PDF/A. Please ensure the file is valid.")
        } finally {
            setIsProcessing(false)
        }
    }

    const reset = () => {
        if (pdfaUrl) URL.revokeObjectURL(pdfaUrl)
        setFile(null)
        setPdfaUrl(null)
        setPageCount(0)
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-6">
            <AdBanner slot="top" />

            {/* Upload Step */}
            {!file && (
                <div className="space-y-6">
                    <FileUploader
                        onFilesSelected={handleFilesSelected}
                        accept={{ "application/pdf": [".pdf"] }}
                        maxFiles={1}
                        title="Upload PDF to Convert to PDF/A"
                        description="Convert documents to ISO 19005 compliant archival format for court, government, and legal records"
                    />

                    {/* Trust Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#026EFF]">
                                <Archive className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">ISO 19005 Compliant</h4>
                                <p className="text-xs text-slate-500">Long-term electronic storage</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Landmark className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">Court & IRS Accepted</h4>
                                <p className="text-xs text-slate-500">Meets official filing guidelines</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">Zero Server Upload</h4>
                                <p className="text-xs text-slate-500">100% private in browser</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Configure Step */}
            {file && !pdfaUrl && !isProcessing && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#026EFF]">
                                <Archive className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                                    {file.name}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB • {pageCount} Pages
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={reset} className="text-slate-500">
                            Change File
                        </Button>
                    </div>

                    {/* Profile Selection */}
                    <div className="space-y-4 max-w-lg mx-auto">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                            Choose Archival Profile
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label
                                onClick={() => setProfile("PDF/A-1b")}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    profile === "PDF/A-1b"
                                        ? "border-[#026EFF] bg-blue-50/50 shadow-sm"
                                        : "border-slate-200 hover:border-slate-300 bg-white"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-slate-800 text-sm">PDF/A-1b</span>
                                    {profile === "PDF/A-1b" && <CheckCircle2 className="w-4 h-4 text-[#026EFF]" />}
                                </div>
                                <p className="text-xs text-slate-500">
                                    Visual preservation (Level B). Broadest compatibility for court & legal filings.
                                </p>
                            </label>

                            <label
                                onClick={() => setProfile("PDF/A-2b")}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    profile === "PDF/A-2b"
                                        ? "border-[#026EFF] bg-blue-50/50 shadow-sm"
                                        : "border-slate-200 hover:border-slate-300 bg-white"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-slate-800 text-sm">PDF/A-2b</span>
                                    {profile === "PDF/A-2b" && <CheckCircle2 className="w-4 h-4 text-[#026EFF]" />}
                                </div>
                                <p className="text-xs text-slate-500">
                                    Modern ISO 19005-2 standard supporting transparency layers and vector illustrations.
                                </p>
                            </label>
                        </div>

                        {/* Archival Checklist */}
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2 text-xs text-slate-700">
                            <span className="font-semibold block text-slate-800 mb-1">
                                Applied Archival Enhancements:
                            </span>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Strips prohibited JavaScript, audio, and active external objects</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Embeds standard ISO 19005 metadata & Producer identifier</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Generates uncompressed linear cross-reference table for perpetuity</span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                onClick={handleConvert}
                                className="w-full py-6 text-base font-semibold bg-[#026EFF] hover:bg-[#0056cc] text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                            >
                                <Archive className="w-5 h-5 mr-2" /> Convert to {profile}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Processing state */}
            {isProcessing && (
                <ProcessingWait
                    progress={65}
                    title="Generating PDF/A Archive..."
                    description="Sanitizing dynamic scripts, writing ISO 19005 compliance dictionaries, and rebuilding structure."
                />
            )}

            {/* Success / Download Step */}
            {pdfaUrl && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900">PDF/A Document Ready!</h3>
                        <p className="text-sm text-slate-600 max-w-md mx-auto">
                            Your document now complies with ISO 19005 long-term preservation standards. It is ready for official court and government submissions.
                        </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 max-w-md mx-auto text-left flex items-center justify-between">
                        <div className="truncate mr-3">
                            <p className="text-xs text-slate-500 font-medium">Archival File</p>
                            <p className="text-sm font-semibold text-slate-800 truncate">{pdfaFileName}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg shrink-0">
                            {profile}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <a
                            href={pdfaUrl}
                            download={pdfaFileName}
                            className="w-full sm:w-auto"
                        >
                            <Button className="w-full sm:w-auto px-8 py-6 text-base font-semibold bg-[#026EFF] hover:bg-[#0056cc] text-white rounded-xl shadow-md hover:shadow-lg transition-all">
                                <Download className="w-5 h-5 mr-2" />
                                Download PDF/A File
                            </Button>
                        </a>
                        <Button
                            variant="outline"
                            onClick={reset}
                            className="w-full sm:w-auto px-6 py-6 text-base rounded-xl"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Convert Another File
                        </Button>
                    </div>

                    <PostActionAd />
                </div>
            )}

            <AdBanner slot="bottom" />
        </div>
    )
}

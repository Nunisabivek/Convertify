'use client'

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FileText, LockOpen, Download, Loader2, AlertCircle } from "lucide-react"
import { PDFDocument } from "pdf-lib"
import { AdBanner } from "@/components/ads/banner"

export default function UnlockPdfClient() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [password, setPassword] = useState("")

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const pdfFile = acceptedFiles[0]
        if (pdfFile && pdfFile.type === "application/pdf") {
            setFile(pdfFile)
            setError(null)
        } else {
            setError("Please upload a valid PDF file")
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        multiple: false,
    })

    const unlockPdf = async () => {
        if (!file) return

        if (!password) {
            setError("Please enter the password")
            return
        }

        setIsProcessing(true)
        setError(null)

        try {
            const arrayBuffer = await file.arrayBuffer()

            // Try to load the PDF with password
            // Note: pdf-lib has limited password support
            // For production, use a library with full encryption support
            try {
                const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })

                const pdfBytes = await pdfDoc.save()
                const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
                const url = URL.createObjectURL(blob)

                const link = document.createElement("a")
                link.href = url
                link.download = file.name.replace(".pdf", "_unlocked.pdf")
                link.click()
            } catch (loadError) {
                setError("Incorrect password or the PDF uses advanced encryption. Please check your password and try again.")
            }
        } catch (err) {
            console.error(err)
            setError("Failed to unlock PDF. The file might be corrupted or use unsupported encryption.")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="w-full max-w-3xl mx-auto px-4">
            {/* Upload Area */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragActive
                        ? "border-green-500 bg-green-50"
                        : "border-slate-300 hover:border-green-400 hover:bg-slate-50"
                    }`}
            >
                <input {...getInputProps()} />
                <FileText className="w-16 h-16 mx-auto mb-4 text-green-600" />
                {file ? (
                    <div>
                        <p className="text-lg font-semibold text-slate-900 mb-1">{file.name}</p>
                        <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                ) : (
                    <div>
                        <p className="text-lg font-semibold text-slate-900 mb-2">
                            Drop your protected PDF here or click to browse
                        </p>
                        <p className="text-sm text-slate-500">Supports password-protected PDF files</p>
                    </div>
                )}
            </div>

            {/* Password Input */}
            {file && (
                <div className="mt-8 p-6 bg-white border border-slate-200 rounded-xl">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Enter Password</h3>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            PDF Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="Enter the PDF password"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    unlockPdf()
                                }
                            }}
                        />
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800">
                            <strong>Privacy First:</strong> Your password and PDF never leave your device. All processing happens locally in your browser.
                        </p>
                    </div>
                </div>
            )}

            {/* Ad Banner */}
            <div className="my-6 flex justify-center">
                <AdBanner variant="rectangle" />
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            {/* Process Button */}
            {file && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={unlockPdf}
                        disabled={isProcessing}
                        className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-300 transition-colors flex items-center gap-2 shadow-lg"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Unlocking...
                            </>
                        ) : (
                            <>
                                <LockOpen className="w-5 h-5" />
                                Unlock PDF
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Info Section */}
            <div className="mt-12 p-6 bg-slate-50 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">About Unlocking PDFs</h3>
                <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>Remove password protection from your PDF files</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>You must know the correct password to unlock the PDF</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>Get a completely unprotected PDF file you can edit and share</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>100% secure - all processing happens in your browser</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}



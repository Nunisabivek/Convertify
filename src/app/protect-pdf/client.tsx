"use client"

import { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { configure, lock } from "pdf-lib-encrypt"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { AdBanner } from "@/components/ads/banner"
import { PostActionAd } from "@/components/ads/post-action-ad"
import {
    Lock,
    Shield,
    Download,
    FileCheck,
    AlertCircle,
    Eye,
    EyeOff,
    CheckCircle2,
    KeyRound,
    RefreshCw
} from "lucide-react"

// Initialize pdf-lib-encrypt with pdf-lib
configure(PDFDocument as any)

export default function ProtectPdfClient() {
    const [file, setFile] = useState<File | null>(null)
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [preventPrinting, setPreventPrinting] = useState<boolean>(false)
    const [preventCopying, setPreventCopying] = useState<boolean>(false)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [protectedPdfUrl, setProtectedPdfUrl] = useState<string | null>(null)
    const [protectedFileName, setProtectedFileName] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleFilesSelected = (files: File[]) => {
        if (!files || files.length === 0) return
        setFile(files[0])
        setProtectedPdfUrl(null)
        setErrorMessage(null)
    }

    const calculateStrength = (pwd: string): { label: string; score: number; color: string } => {
        if (!pwd) return { label: "Empty", score: 0, color: "bg-slate-200" }
        let score = 0
        if (pwd.length >= 6) score += 1
        if (pwd.length >= 10) score += 1
        if (/[A-Z]/.test(pwd)) score += 1
        if (/[0-9]/.test(pwd)) score += 1
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1

        if (score <= 2) return { label: "Weak", score: 25, color: "bg-rose-500" }
        if (score === 3) return { label: "Medium", score: 60, color: "bg-amber-500" }
        if (score === 4) return { label: "Strong", score: 85, color: "bg-blue-500" }
        return { label: "Very Strong", score: 100, color: "bg-emerald-500" }
    }

    const strength = calculateStrength(password)

    const handleProtect = async () => {
        if (!file) return
        if (!password) {
            setErrorMessage("Please enter a password to protect your PDF.")
            return
        }
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match. Please re-check.")
            return
        }

        setIsProcessing(true)
        setErrorMessage(null)

        try {
            const rawBytes = await file.arrayBuffer()

            // Load and save cleanly first to ensure standard object streams
            const pdfDoc = await PDFDocument.load(rawBytes, { ignoreEncryption: true })
            const plainBytes = await pdfDoc.save()

            // Permissions bitmask: standard PDF permissions flags
            // Full permissions is 0xFFFFFFFC (-4).
            // Bit 3 = print (4), Bit 5 = copy (16)
            let perms = -4
            if (preventPrinting) perms &= ~4
            if (preventCopying) perms &= ~16

            // Lock document with AES-256
            const encryptedBytes = await lock(plainBytes, password, {
                permissions: perms,
            })

            const blob = new Blob([encryptedBytes as any], { type: "application/pdf" })
            const url = URL.createObjectURL(blob)
            const cleanBase = file.name.replace(/\.[^/.]+$/, "")
            setProtectedFileName(`${cleanBase}-protected.pdf`)
            setProtectedPdfUrl(url)
        } catch (err: any) {
            console.error("Encryption error:", err)
            setErrorMessage(err?.message || "Failed to encrypt PDF. Please try a different file.")
        } finally {
            setIsProcessing(false)
        }
    }

    const reset = () => {
        if (protectedPdfUrl) {
            URL.revokeObjectURL(protectedPdfUrl)
        }
        setFile(null)
        setPassword("")
        setConfirmPassword("")
        setProtectedPdfUrl(null)
        setErrorMessage(null)
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-6">
            <AdBanner slot="top" />

            {/* Upload View */}
            {!file && (
                <div className="space-y-6">
                    <FileUploader
                        onFilesSelected={handleFilesSelected}
                        accept={{ "application/pdf": [".pdf"] }}
                        maxFiles={1}
                        title="Upload PDF to Password Protect"
                        description="Select a PDF file to encrypt with military-grade AES-256 protection"
                    />

                    {/* Trust Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#026EFF]">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">AES-256 Encryption</h4>
                                <p className="text-xs text-slate-500">Industry-standard bank security</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <FileCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">Zero Server Upload</h4>
                                <p className="text-xs text-slate-500">100% private in your browser</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <KeyRound className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">Universal Support</h4>
                                <p className="text-xs text-slate-500">Opens in Acrobat, Chrome & iOS</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Configure & Encrypt View */}
            {file && !protectedPdfUrl && !isProcessing && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#026EFF]">
                                <Lock className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                                    {file.name}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to protect
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={reset} className="text-slate-500">
                            Change File
                        </Button>
                    </div>

                    {errorMessage && (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Password Inputs */}
                    <div className="space-y-4 max-w-md mx-auto">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Document Password <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter a strong password"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#026EFF]/20 focus:border-[#026EFF] text-sm pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Password Strength Meter */}
                            {password && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex justify-between items-center text-xs text-slate-500">
                                        <span>Strength: {strength.label}</span>
                                        <span>{strength.score}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${strength.color}`}
                                            style={{ width: `${strength.score}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Confirm Password <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter your password"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#026EFF]/20 focus:border-[#026EFF] text-sm"
                            />
                        </div>

                        {/* Optional Permissions */}
                        <div className="pt-2 border-t border-slate-100 space-y-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                                Additional Restrictions (Optional)
                            </span>
                            <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={preventPrinting}
                                    onChange={(e) => setPreventPrinting(e.target.checked)}
                                    className="w-4 h-4 rounded text-[#026EFF] border-slate-300 focus:ring-[#026EFF]"
                                />
                                <span>Restrict Printing (Disallow document printing)</span>
                            </label>
                            <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={preventCopying}
                                    onChange={(e) => setPreventCopying(e.target.checked)}
                                    className="w-4 h-4 rounded text-[#026EFF] border-slate-300 focus:ring-[#026EFF]"
                                />
                                <span>Restrict Copying (Disallow text extraction & copying)</span>
                            </label>
                        </div>

                        <div className="pt-4">
                            <Button
                                onClick={handleProtect}
                                disabled={!password || password !== confirmPassword}
                                className="w-full py-6 text-base font-semibold bg-[#026EFF] hover:bg-[#0056cc] text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                            >
                                <Lock className="w-5 h-5 mr-2" />
                                Protect PDF with AES-256
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Processing state */}
            {isProcessing && (
                <ProcessingWait
                    progress={65}
                    title="Encrypting PDF..."
                    description="Applying AES-256 cipher and setting document restrictions locally in your browser."
                />
            )}

            {/* Success / Download View */}
            {protectedPdfUrl && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900">PDF Successfully Protected!</h3>
                        <p className="text-sm text-slate-600 max-w-md mx-auto">
                            Your document has been encrypted with military-grade AES-256. Anyone opening it will now require the password you set.
                        </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 max-w-md mx-auto text-left flex items-center justify-between">
                        <div className="truncate mr-3">
                            <p className="text-xs text-slate-500 font-medium">Encrypted File</p>
                            <p className="text-sm font-semibold text-slate-800 truncate">{protectedFileName}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-100 text-[#026EFF] text-xs font-semibold rounded-lg shrink-0">
                            AES-256
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <a
                            href={protectedPdfUrl}
                            download={protectedFileName}
                            className="w-full sm:w-auto"
                        >
                            <Button className="w-full sm:w-auto px-8 py-6 text-base font-semibold bg-[#026EFF] hover:bg-[#0056cc] text-white rounded-xl shadow-md hover:shadow-lg transition-all">
                                <Download className="w-5 h-5 mr-2" />
                                Download Protected PDF
                            </Button>
                        </a>
                        <Button
                            variant="outline"
                            onClick={reset}
                            className="w-full sm:w-auto px-6 py-6 text-base rounded-xl"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Protect Another File
                        </Button>
                    </div>

                    <PostActionAd />
                </div>
            )}

            <AdBanner slot="bottom" />
        </div>
    )
}

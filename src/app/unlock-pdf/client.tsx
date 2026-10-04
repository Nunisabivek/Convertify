"use client"

import { loadPdfjs } from "@/lib/pdfjs"
import { useState } from "react"
import * as pdfLib from "pdf-lib"
import { configure, unlockInPlace } from "pdf-lib-encrypt"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { AdBanner } from "@/components/ads/banner"
import { PostActionAd } from "@/components/ads/post-action-ad"
import {
    LockOpen,
    Key,
    Download,
    FileCheck,
    AlertCircle,
    Shield,
    Eye,
    EyeOff
} from "lucide-react"

const { PDFDocument } = pdfLib
configure(pdfLib)

export default function UnlockPdfClient() {
    const [file, setFile] = useState<File | null>(null)
    const [isChecking, setIsChecking] = useState<boolean>(false)
    const [isUnlocking, setIsUnlocking] = useState<boolean>(false)
    const [needsPassword, setNeedsPassword] = useState<boolean>(false)
    const [password, setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [unlockedPdfUrl, setUnlockedPdfUrl] = useState<string | null>(null)
    const [unlockedFileName, setUnlockedFileName] = useState<string>("")
    // True when the file's encryption could not be removed in place and the pages
    // were re-drawn as images instead (text is no longer selectable).
    const [savedAsImages, setSavedAsImages] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleFilesSelected = async (files: File[]) => {
        if (!files || files.length === 0) return
        const selected = files[0]
        setFile(selected)
        setUnlockedPdfUrl(null)
        setSavedAsImages(false)
        setErrorMessage(null)
        setPassword("")
        setNeedsPassword(false)
        await testAndUnlock(selected, "")
    }

    const testAndUnlock = async (pdfFile: File, userPass: string) => {
        setIsChecking(true)
        setErrorMessage(null)

        try {
            const rawBuffer = await pdfFile.arrayBuffer()

            // Step 1: Check with pdfjs-dist
            const pdfjsLib = await loadPdfjs()

            let isEncrypted = false
            let pdfDoc: any = null

            try {
                // pdf.js transfers the buffer to its worker, which detaches it.
                // Hand it a copy so rawBuffer is still readable for the unlock below.
                const loadingTask = pdfjsLib.getDocument({
                    data: new Uint8Array(rawBuffer.slice(0)),
                    password: userPass,
                })
                pdfDoc = await loadingTask.promise
            } catch (err: any) {
                if (err.name === "PasswordException") {
                    isEncrypted = true
                    setNeedsPassword(true)
                    setIsChecking(false)
                    if (userPass) {
                        setErrorMessage("Incorrect password. Please verify and try again.")
                    }
                    return
                }
                throw err
            }

            // If we are here, the document is accessible (either unencrypted, permissions-only, or password matched)
            setIsUnlocking(true)

            // Preferred path: decrypt in place with the password pdf.js just
            // accepted. Text, fonts, images and links are all kept and the file
            // stays about the same size. unlockInPlace returns false for a file
            // with no encryption (we just re-save it) and throws for encryption
            // it cannot handle (AES-128, encrypted object streams, ...).
            let unlockedBytes: Uint8Array | null = null
            let usedImageFallback = false
            try {
                const doc = await PDFDocument.load(rawBuffer, { ignoreEncryption: true, updateMetadata: false })
                await unlockInPlace(doc, userPass)
                unlockedBytes = await doc.save()
            } catch (decryptErr) {
                console.warn("In-place unlock not possible, falling back to page images:", decryptErr)
                // Fallback: pdf.js can read the file, so redraw each page as an
                // image. This always works but loses selectable text.
                if (pdfDoc) {
                    usedImageFallback = true
                    const newDoc = await PDFDocument.create()
                    const numPages = pdfDoc.numPages

                    for (let i = 1; i <= numPages; i++) {
                        const page = await pdfDoc.getPage(i)
                        const viewport = page.getViewport({ scale: 2.0 }) // Crisp 150-200 DPI
                        const canvas = document.createElement("canvas")
                        canvas.width = viewport.width
                        canvas.height = viewport.height
                        const ctx = canvas.getContext("2d")

                        if (ctx) {
                            await page.render({ canvasContext: ctx, viewport } as any).promise
                            const pngDataUrl = canvas.toDataURL("image/png")
                            const pngBytes = await fetch(pngDataUrl).then(r => r.arrayBuffer())
                            const pngImage = await newDoc.embedPng(pngBytes)

                            // Match original page dimensions (points)
                            const origViewport = page.getViewport({ scale: 1.0 })
                            const newPage = newDoc.addPage([origViewport.width, origViewport.height])
                            newPage.drawImage(pngImage, {
                                x: 0,
                                y: 0,
                                width: origViewport.width,
                                height: origViewport.height,
                            })
                        }
                    }
                    unlockedBytes = await newDoc.save()
                }
            }
            setSavedAsImages(usedImageFallback)

            if (!unlockedBytes) {
                throw new Error("Could not decrypt document.")
            }

            const blob = new Blob([unlockedBytes as any], { type: "application/pdf" })
            const url = URL.createObjectURL(blob)

            const baseName = pdfFile.name.replace(/\.pdf$/i, "")
            setUnlockedFileName(`${baseName}-unlocked.pdf`)
            setUnlockedPdfUrl(url)
            setNeedsPassword(false)
        } catch (error: any) {
            console.error("Unlock error:", error)
            setErrorMessage("Failed to unlock this PDF. Please check if the file is valid.")
        } finally {
            setIsChecking(false)
            setIsUnlocking(false)
        }
    }

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file || !password) return
        await testAndUnlock(file, password)
    }

    if (isUnlocking) {
        return <ProcessingWait progress={80} title="Decrypting & Stripping Restrictions..." />
    }

    if (unlockedPdfUrl && file) {
        return (
            <div className="container py-16 max-w-2xl text-center space-y-8 animate-in fade-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                    <FileCheck className="w-10 h-10" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                        PDF Unlocked Successfully!
                    </h2>
                    <p className="text-slate-600 text-sm">
                        All passwords, printing restrictions, and editing blocks have been permanently removed.
                    </p>
                    {savedAsImages && (
                        <p className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            This file used an encryption type that cannot be removed in place, so each page was saved as an image. It opens without a password, but its text is no longer selectable or searchable.
                        </p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-emerald-600/20 text-lg"
                        asChild
                    >
                        <a href={unlockedPdfUrl} download={unlockedFileName}>
                            <Download className="mr-2 w-5 h-5" />
                            Download Unlocked PDF
                        </a>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                            setFile(null)
                            setUnlockedPdfUrl(null)
                            setPassword("")
                            setNeedsPassword(false)
                        }}
                        className="w-full sm:w-auto rounded-xl px-6 py-6"
                    >
                        Unlock Another PDF
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
                {errorMessage && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                {!file || (!needsPassword && !unlockedPdfUrl) ? (
                    <FileUploader
                        onFilesSelected={handleFilesSelected}
                        accept={{ "application/pdf": [".pdf"] }}
                        maxFiles={1}
                        title="Select or Drop Locked PDF to Unlock"
                        description="Remove owner permissions, printing restrictions, or open passwords. 100% private in-browser."
                    />
                ) : null}

                {/* Password Input Prompt */}
                {file && needsPassword && (
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto space-y-6">
                        <div className="text-center">
                            <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600 mb-3">
                                <Key className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">
                                Enter Document Password
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                This PDF is encrypted with an open password. Enter it once to permanently decrypt.
                            </p>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter PDF password"
                                    required
                                    className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            <Button
                                type="submit"
                                disabled={isChecking || !password}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 rounded-xl shadow-md text-base"
                            >
                                <LockOpen className="w-4 h-4 mr-2" />
                                Unlock PDF
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setFile(null)
                                    setNeedsPassword(false)
                                    setPassword("")
                                }}
                                className="w-full text-xs text-slate-500"
                            >
                                Choose a Different File
                            </Button>
                        </form>
                    </div>
                )}

                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm grid sm:grid-cols-3 gap-4 text-center">
                    <div>
                        <LockOpen className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-slate-800 text-sm">Remove Restrictions</h4>
                        <p className="text-xs text-slate-500 mt-1">Strips printing, copying, and editing lockouts completely.</p>
                    </div>
                    <div>
                        <Key className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-slate-800 text-sm">Permanent Decryption</h4>
                        <p className="text-xs text-slate-500 mt-1">The resulting file opens freely without prompting for passwords.</p>
                    </div>
                    <div>
                        <Shield className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-slate-800 text-sm">Zero Server Uploads</h4>
                        <p className="text-xs text-slate-500 mt-1">Your password and files are processed strictly in your browser.</p>
                    </div>
                </div>

                <AdBanner variant="responsive" />
            </div>
        </div>
    )
}

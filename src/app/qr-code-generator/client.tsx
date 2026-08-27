"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function QrCodeClient() {
    const [text, setText] = useState("")
    const [size, setSize] = useState(400)
    const [error, setError] = useState<string | null>(null)
    const [qrUrl, setQrUrl] = useState("")

    useEffect(() => {
        let revoked = ""
        const value = text.trim()
        if (!value) {
            setQrUrl("")
            return
        }
        let cancelled = false
        ;(async () => {
            try {
                const QRCode = (await import("qrcode")).default
                const url = await QRCode.toDataURL(value, {
                    width: size,
                    margin: 2,
                    errorCorrectionLevel: "M",
                })
                if (!cancelled) setQrUrl(url)
            } catch {
                if (!cancelled) {
                    setQrUrl("")
                    setError("Could not make that QR code. Try shorter text.")
                }
            }
        })()
        return () => {
            cancelled = true
            if (revoked) URL.revokeObjectURL(revoked)
        }
    }, [text, size])

    const downloadQr = async () => {
        if (!qrUrl) return
        setError(null)
        try {
            const response = await fetch(qrUrl)
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `qr-code-${size}x${size}.png`
            a.click()
            URL.revokeObjectURL(url)
        } catch {
            setError("Could not save that QR code. Try again.")
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Link or text</label>
                    <textarea
                        value={text}
                        onChange={e => { setText(e.target.value); setError(null) }}
                        placeholder="Paste a link or type some text"
                        className="w-full h-24 p-3 border rounded-lg text-sm resize-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                        maxLength={4000}
                    />
                    <p className="text-xs text-slate-400 mt-1">{text.length}/4000</p>
                </div>

                <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Size</label>
                    <div className="flex gap-2">
                        {[256, 400, 512].map(s => (
                            <button
                                key={s}
                                onClick={() => setSize(s)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    size === s ? "bg-indigo-600 text-white" : "bg-white text-slate-600 border hover:bg-slate-50"
                                }`}
                            >
                                {s}px
                            </button>
                        ))}
                    </div>
                </div>

                {qrUrl && (
                    <div className="flex flex-col items-center py-6">
                        <div className="bg-white p-4 rounded-xl border shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={qrUrl}
                                alt="QR code"
                                width={Math.min(size, 300)}
                                height={Math.min(size, 300)}
                                className="rounded"
                            />
                        </div>
                        <Button onClick={downloadQr} className="mt-4 min-h-12">
                            <Download className="w-4 h-4 mr-2" />
                            Save QR code
                        </Button>
                    </div>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
        </div>
    )
}

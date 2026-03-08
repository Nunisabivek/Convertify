"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

export default function Base64Client() {
    const [mode, setMode] = useState<"encode" | "decode">("encode")
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleConvert = () => {
        setError(null)
        try {
            if (mode === "encode") {
                setOutput(btoa(unescape(encodeURIComponent(input))))
            } else {
                setOutput(decodeURIComponent(escape(atob(input.trim()))))
            }
        } catch {
            setError(mode === "encode" ? "Failed to encode text" : "Invalid Base64 string")
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setError(null)
        const reader = new FileReader()
        if (mode === "encode") {
            reader.onload = (ev) => {
                const result = ev.target?.result as string
                // Extract base64 part from data URL
                const base64 = result.split(",")[1] || result
                setOutput(base64)
                setInput(`[File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]`)
            }
            reader.readAsDataURL(file)
        } else {
            reader.onload = (ev) => {
                setInput(ev.target?.result as string)
            }
            reader.readAsText(file)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex gap-2 mb-6 justify-center">
                <button
                    onClick={() => { setMode("encode"); setInput(""); setOutput(""); setError(null) }}
                    className={`px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${mode === "encode" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 border hover:bg-slate-50"}`}
                >
                    Encode
                </button>
                <button
                    onClick={() => { setMode("decode"); setInput(""); setOutput(""); setError(null) }}
                    className={`px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${mode === "decode" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 border hover:bg-slate-50"}`}
                >
                    Decode
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-slate-700">
                            {mode === "encode" ? "Text / File Input" : "Base64 Input"}
                        </label>
                        <button onClick={() => fileRef.current?.click()} className="text-xs text-indigo-600 hover:underline">
                            Upload file
                        </button>
                        <input ref={fileRef} type="file" onChange={handleFileUpload} className="hidden" />
                    </div>
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={mode === "encode" ? "Enter text to encode..." : "Paste Base64 string to decode..."}
                        className="w-full h-48 p-3 border rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                        {mode === "encode" ? "Base64 Output" : "Decoded Output"}
                    </label>
                    <textarea
                        value={output}
                        readOnly
                        placeholder="Output will appear here..."
                        className="w-full h-48 p-3 border rounded-lg font-mono text-sm resize-none bg-slate-50"
                    />
                </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex gap-3 mt-4">
                <Button onClick={handleConvert} disabled={!input.trim()} className="flex-1">
                    {mode === "encode" ? "Encode to Base64" : "Decode Base64"}
                </Button>
                {output && (
                    <Button variant="outline" onClick={copyToClipboard}>
                        {copied ? <><Check className="w-4 h-4 mr-1" />Copied</> : <><Copy className="w-4 h-4 mr-1" />Copy</>}
                    </Button>
                )}
            </div>
        </div>
    )
}

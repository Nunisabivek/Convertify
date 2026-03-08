"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download, Copy, Check, Loader2 } from "lucide-react"

function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
    const result: Record<string, string> = {}
    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key
        const value = obj[key]
        if (value && typeof value === "object" && !Array.isArray(value)) {
            Object.assign(result, flattenObject(value as Record<string, unknown>, fullKey))
        } else if (Array.isArray(value)) {
            result[fullKey] = JSON.stringify(value)
        } else {
            result[fullKey] = value == null ? "" : String(value)
        }
    }
    return result
}

function jsonToCsv(data: unknown[]): string {
    if (!Array.isArray(data) || data.length === 0) return ""
    const flattened = data.map(item => flattenObject(item as Record<string, unknown>))
    const headers = [...new Set(flattened.flatMap(row => Object.keys(row)))]
    const escapeCell = (val: string) => {
        if (val.includes(",") || val.includes('"') || val.includes("\n")) {
            return `"${val.replace(/"/g, '""')}"`
        }
        return val
    }
    const rows = flattened.map(row => headers.map(h => escapeCell(row[h] || "")).join(","))
    return [headers.map(escapeCell).join(","), ...rows].join("\n")
}

export default function JsonToCsvClient() {
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleConvert = () => {
        setError(null)
        try {
            const parsed = JSON.parse(input)
            const data = Array.isArray(parsed) ? parsed : [parsed]
            const csv = jsonToCsv(data)
            if (!csv) throw new Error("No data to convert")
            setOutput(csv)
        } catch (e) {
            setError(e instanceof Error ? e.message : "Invalid JSON")
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => { setInput(ev.target?.result as string); setOutput(""); setError(null) }
        reader.readAsText(file)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const downloadCsv = () => {
        const blob = new Blob([output], { type: "text/csv" })
        const a = document.createElement("a")
        a.href = URL.createObjectURL(blob)
        a.download = "output.csv"
        a.click()
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-slate-700">JSON Input</label>
                        <button onClick={() => fileRef.current?.click()} className="text-xs text-indigo-600 hover:underline">Upload file</button>
                        <input ref={fileRef} type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                    </div>
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={'[\n  {"name": "John", "age": 30},\n  {"name": "Jane", "age": 25}\n]'}
                        className="w-full h-64 p-3 border rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">CSV Output</label>
                    <textarea
                        value={output}
                        readOnly
                        placeholder="CSV output will appear here..."
                        className="w-full h-64 p-3 border rounded-lg font-mono text-sm resize-none bg-slate-50"
                    />
                </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex gap-3 mt-4">
                <Button onClick={handleConvert} disabled={!input.trim()} className="flex-1">Convert to CSV</Button>
                {output && (
                    <>
                        <Button variant="outline" onClick={copyToClipboard}>
                            {copied ? <><Check className="w-4 h-4 mr-1" />Copied</> : <><Copy className="w-4 h-4 mr-1" />Copy</>}
                        </Button>
                        <Button variant="outline" onClick={downloadCsv}><Download className="w-4 h-4 mr-1" />Download</Button>
                    </>
                )}
            </div>
        </div>
    )
}

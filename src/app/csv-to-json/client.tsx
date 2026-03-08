"use client"

import { useState, useCallback } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { Loader2, Copy, Download, CheckCircle, AlertCircle, Upload } from "lucide-react"

function parseCSV(text: string): Record<string, string>[] {
    const lines: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < text.length; i++) {
        const char = text[i]
        if (char === '"') {
            if (inQuotes && text[i + 1] === '"') {
                current += '"'
                i++
            } else {
                inQuotes = !inQuotes
            }
        } else if ((char === "\n" || (char === "\r" && text[i + 1] === "\n")) && !inQuotes) {
            lines.push(current)
            current = ""
            if (char === "\r") i++
        } else {
            current += char
        }
    }
    if (current.trim()) lines.push(current)

    if (lines.length < 2) return []

    const parseRow = (row: string): string[] => {
        const fields: string[] = []
        let field = ""
        let insideQuotes = false

        for (let i = 0; i < row.length; i++) {
            const ch = row[i]
            if (ch === '"') {
                if (insideQuotes && row[i + 1] === '"') {
                    field += '"'
                    i++
                } else {
                    insideQuotes = !insideQuotes
                }
            } else if (ch === "," && !insideQuotes) {
                fields.push(field.trim())
                field = ""
            } else {
                field += ch
            }
        }
        fields.push(field.trim())
        return fields
    }

    const headers = parseRow(lines[0])
    const result: Record<string, string>[] = []

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue
        const values = parseRow(lines[i])
        const obj: Record<string, string> = {}
        headers.forEach((header, idx) => {
            obj[header] = values[idx] ?? ""
        })
        result.push(obj)
    }

    return result
}

export default function CsvToJsonClient() {
    const [csvInput, setCsvInput] = useState("")
    const [jsonOutput, setJsonOutput] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [mode, setMode] = useState<"paste" | "upload">("paste")

    const handleFileSelected = useCallback((files: File[]) => {
        if (files.length === 0) return
        const file = files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target?.result as string
            setCsvInput(text)
            setJsonOutput("")
            setError(null)
        }
        reader.readAsText(file)
    }, [])

    const handleConvert = async () => {
        if (!csvInput.trim()) {
            setError("Please provide CSV data to convert.")
            return
        }

        setIsProcessing(true)
        setError(null)
        setJsonOutput("")

        try {
            await new Promise((r) => setTimeout(r, 300))
            const parsed = parseCSV(csvInput)
            if (parsed.length === 0) {
                setError("Could not parse CSV. Make sure your data has at least a header row and one data row.")
                return
            }
            setJsonOutput(JSON.stringify(parsed, null, 2))
        } catch (err) {
            console.error(err)
            setError("Failed to parse CSV data. Please check your input format.")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(jsonOutput)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const blob = new Blob([jsonOutput], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "converted.json"
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            {/* Mode Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setMode("paste")}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                        mode === "paste"
                            ? "bg-emerald-600 text-white shadow-lg"
                            : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300"
                    }`}
                >
                    Paste CSV
                </button>
                <button
                    onClick={() => setMode("upload")}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                        mode === "upload"
                            ? "bg-emerald-600 text-white shadow-lg"
                            : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300"
                    }`}
                >
                    <Upload className="w-5 h-5 inline mr-2" />
                    Upload File
                </button>
            </div>

            {/* Input */}
            {mode === "paste" ? (
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">CSV Data</label>
                    <textarea
                        value={csvInput}
                        onChange={(e) => { setCsvInput(e.target.value); setError(null) }}
                        placeholder={"name,email,age\nJohn Doe,john@example.com,30\nJane Smith,jane@example.com,25"}
                        rows={10}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                    />
                </div>
            ) : (
                <div className="mb-6">
                    {csvInput ? (
                        <div className="bg-white p-4 rounded-xl border text-center space-y-3">
                            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                            <p className="font-medium text-slate-700">File loaded ({csvInput.split("\n").length} lines)</p>
                            <Button variant="outline" size="sm" onClick={() => { setCsvInput(""); setJsonOutput("") }}>
                                Clear
                            </Button>
                        </div>
                    ) : (
                        <FileUploader
                            onFilesSelected={handleFileSelected}
                            multiple={false}
                            accept={{ "text/csv": [".csv"] }}
                            fileTypeLabel="CSV files (.csv)"
                            iconType="text"
                        />
                    )}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* Convert Button */}
            <div className="flex justify-center mb-8">
                <Button
                    onClick={handleConvert}
                    disabled={isProcessing || !csvInput.trim()}
                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-lg"
                    size="lg"
                >
                    {isProcessing ? (
                        <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Converting...</>
                    ) : (
                        "Convert to JSON"
                    )}
                </Button>
            </div>

            {/* Output */}
            {jsonOutput && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-slate-700">JSON Output</label>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleCopy}>
                                {copied ? <><CheckCircle className="w-4 h-4 mr-1" /> Copied!</> : <><Copy className="w-4 h-4 mr-1" /> Copy</>}
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDownload}>
                                <Download className="w-4 h-4 mr-1" /> Download .json
                            </Button>
                        </div>
                    </div>
                    <textarea
                        value={jsonOutput}
                        readOnly
                        rows={15}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 font-mono text-sm"
                    />
                </div>
            )}

            {/* Info Section */}
            <div className="mt-8 p-6 bg-slate-50 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">How to Convert CSV to JSON</h3>
                <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">1.</span>
                        <span>Paste your CSV data or upload a .csv file</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">2.</span>
                        <span>Click &quot;Convert to JSON&quot; to parse and transform your data</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">3.</span>
                        <span>Copy the JSON output to clipboard or download as a .json file</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">4.</span>
                        <span>All processing happens in your browser - completely private and secure</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

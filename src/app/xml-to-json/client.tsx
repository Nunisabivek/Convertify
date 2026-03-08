"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download, Copy, Check } from "lucide-react"

function xmlToJson(node: Element): unknown {
    const obj: Record<string, unknown> = {}

    // Handle attributes
    if (node.attributes.length > 0) {
        for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i]
            obj[`@${attr.name}`] = attr.value
        }
    }

    // Handle child nodes
    for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i]
        if (child.nodeType === Node.ELEMENT_NODE) {
            const childElement = child as Element
            const key = childElement.tagName
            const value = xmlToJson(childElement)

            if (obj[key]) {
                if (!Array.isArray(obj[key])) {
                    obj[key] = [obj[key]]
                }
                (obj[key] as unknown[]).push(value)
            } else {
                obj[key] = value
            }
        } else if (child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE) {
            const text = (child.textContent || "").trim()
            if (text) {
                if (Object.keys(obj).length === 0) return text
                obj["#text"] = text
            }
        }
    }

    return Object.keys(obj).length === 0 ? "" : obj
}

export default function XmlToJsonClient() {
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleConvert = () => {
        setError(null)
        try {
            const parser = new DOMParser()
            const doc = parser.parseFromString(input, "application/xml")
            const parseError = doc.querySelector("parsererror")
            if (parseError) throw new Error("Invalid XML: " + parseError.textContent?.slice(0, 100))
            const result = { [doc.documentElement.tagName]: xmlToJson(doc.documentElement) }
            setOutput(JSON.stringify(result, null, 2))
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to parse XML")
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

    const downloadJson = () => {
        const blob = new Blob([output], { type: "application/json" })
        const a = document.createElement("a")
        a.href = URL.createObjectURL(blob)
        a.download = "output.json"
        a.click()
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-slate-700">XML Input</label>
                        <button onClick={() => fileRef.current?.click()} className="text-xs text-indigo-600 hover:underline">Upload file</button>
                        <input ref={fileRef} type="file" accept=".xml" onChange={handleFileUpload} className="hidden" />
                    </div>
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={'<root>\n  <item id="1">\n    <name>Example</name>\n  </item>\n</root>'}
                        className="w-full h-64 p-3 border rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">JSON Output</label>
                    <textarea
                        value={output}
                        readOnly
                        placeholder="JSON output will appear here..."
                        className="w-full h-64 p-3 border rounded-lg font-mono text-sm resize-none bg-slate-50"
                    />
                </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex gap-3 mt-4">
                <Button onClick={handleConvert} disabled={!input.trim()} className="flex-1">Convert to JSON</Button>
                {output && (
                    <>
                        <Button variant="outline" onClick={copyToClipboard}>
                            {copied ? <><Check className="w-4 h-4 mr-1" />Copied</> : <><Copy className="w-4 h-4 mr-1" />Copy</>}
                        </Button>
                        <Button variant="outline" onClick={downloadJson}><Download className="w-4 h-4 mr-1" />Download</Button>
                    </>
                )}
            </div>
        </div>
    )
}

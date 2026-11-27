"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"

function markdownToHtml(md: string): string {
    // Escape first: the preview uses dangerouslySetInnerHTML, so raw HTML in the input must not run.
    let html = md
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Code blocks (must come before inline code)
        .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
        // Headings
        .replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
        .replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
        .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
        .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
        .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
        .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
        // Bold and italic
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code style="background:#f1f5f9;padding:2px 6px;border-radius:3px;font-size:0.9em">$1</code>')
        // Links
        .replace(/\[([^\]]+)\]\(((?:https?:|mailto:|\/|#)[^)\s"]*)\)/g, '<a href="$2" style="color:#4F46E5">$1</a>')
        // Blockquotes (">" is already escaped)
        .replace(/^&gt;\s+(.+)$/gm, '<blockquote style="border-left:3px solid #cbd5e1;padding-left:12px;color:#64748b;margin:8px 0">$1</blockquote>')
        // Horizontal rules
        .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0">')
        // Unordered lists
        .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
        // Ordered lists (marked apart from bullets so they get <ol> and keep their numbers)
        .replace(/^\d+\.\s+(.+)$/gm, '<li data-ol>$1</li>')

    // Wrap consecutive items in <ol> / <ul>
    // Bullets first: once numbered items lose their marker they'd match the <ul> pattern too.
    html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul style="margin:8px 0;padding-left:24px">${match}</ul>`)
    html = html.replace(/(<li data-ol>.*<\/li>\n?)+/g, (match) => `<ol style="margin:8px 0;padding-left:24px">${match.replace(/<li data-ol>/g, '<li>')}</ol>`)

    // Paragraphs for remaining text
    html = html.split('\n\n').map(block => {
        const trimmed = block.trim()
        if (!trimmed) return ''
        if (trimmed.startsWith('<h') || trimmed.startsWith('<pre') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<hr')) return trimmed
        return `<p style="margin:8px 0;line-height:1.6">${trimmed}</p>`
    }).join('\n')

    return html
}

// Browser print-to-PDF in a hidden frame: for scripts the built-in PDF fonts can't draw.
async function printHtml(body: string) {
    const iframe = document.createElement("iframe")
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0"
    document.body.appendChild(iframe)
    const doc = iframe.contentDocument
    if (!doc) throw new Error("Could not create print frame")
    doc.open()
    doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        body { font-family: system-ui, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #1e293b; font-size: 14px; line-height: 1.6; }
        h1 { font-size: 28px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
        h2 { font-size: 22px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
        pre { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; white-space: pre-wrap; }
        code { font-family: monospace; }
    </style></head><body>${body}</body></html>`)
    doc.close()
    await new Promise((r) => setTimeout(r, 500))
    iframe.contentWindow?.print()
    setTimeout(() => iframe.remove(), 1000)
}

export default function MarkdownToPdfClient() {
    const [input, setInput] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => { setInput(ev.target?.result as string); setError(null) }
        reader.readAsText(file)
    }

    const downloadPdf = async () => {
        setIsProcessing(true)
        setError(null)
        try {
            // Loaded on click: the renderer pulls in pdf-lib (~400 KB) that a visitor may never need.
            const { markdownToPdf, latinOnly } = await import("@/lib/markdown-pdf")
            // The built-in PDF fonts are Latin-only; other scripts go through the browser's
            // print-to-PDF, which uses system fonts, so no character turns into "?".
            if (!latinOnly(input)) return await printHtml(markdownToHtml(input))
            const bytes = await markdownToPdf(input)
            const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }))
            const a = document.createElement("a")
            const title = /^#\s+(.+)$/m.exec(input)?.[1]?.replace(/[^\w\- ]+/g, "").trim().slice(0, 60)
            a.href = url
            a.download = `${title || "document"}.pdf`
            a.click()
            setTimeout(() => URL.revokeObjectURL(url), 60_000)
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to generate PDF")
        } finally {
            setIsProcessing(false)
        }
    }

    const preview = input ? markdownToHtml(input) : ""

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-slate-700">Markdown Input</label>
                        <button onClick={() => fileRef.current?.click()} className="text-xs text-indigo-600 hover:underline">Upload .md file</button>
                        <input ref={fileRef} type="file" accept=".md,.markdown,.txt" onChange={handleFileUpload} className="hidden" />
                    </div>
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={"# My Document\n\nWrite your **Markdown** here...\n\n- Item 1\n- Item 2\n\n```\ncode block\n```"}
                        className="w-full h-80 p-3 border rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Preview</label>
                    <div
                        className="w-full h-80 p-4 border rounded-lg bg-white overflow-auto prose prose-sm"
                        dangerouslySetInnerHTML={{ __html: preview || '<p class="text-slate-400">Preview will appear here...</p>' }}
                    />
                </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <Button onClick={downloadPdf} disabled={!input.trim() || isProcessing} className="w-full mt-4">
                {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Download className="w-4 h-4 mr-2" />Download PDF</>}
            </Button>
            <p className="text-center text-xs text-slate-500 mt-2">
                Saves an A4 PDF with real, selectable text. Documents in non-Latin scripts (Hindi, Chinese, Arabic…) open your browser&apos;s print window instead; choose &ldquo;Save as PDF&rdquo;.
            </p>
        </div>
    )
}

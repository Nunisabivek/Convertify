"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"

function markdownToHtml(md: string): string {
    let html = md
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
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#4F46E5">$1</a>')
        // Blockquotes
        .replace(/^>\s+(.+)$/gm, '<blockquote style="border-left:3px solid #cbd5e1;padding-left:12px;color:#64748b;margin:8px 0">$1</blockquote>')
        // Horizontal rules
        .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0">')
        // Unordered lists
        .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
        // Ordered lists
        .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')

    // Wrap consecutive <li> in <ul>
    html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul style="margin:8px 0;padding-left:24px">${match}</ul>`)

    // Paragraphs for remaining text
    html = html.split('\n\n').map(block => {
        const trimmed = block.trim()
        if (!trimmed) return ''
        if (trimmed.startsWith('<h') || trimmed.startsWith('<pre') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<hr')) return trimmed
        return `<p style="margin:8px 0;line-height:1.6">${trimmed}</p>`
    }).join('\n')

    return html
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
            const htmlContent = markdownToHtml(input)
            const fullHtml = `<!DOCTYPE html><html><head><style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #1e293b; font-size: 14px; line-height: 1.6; }
                h1 { font-size: 28px; margin: 24px 0 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
                h2 { font-size: 22px; margin: 20px 0 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
                h3 { font-size: 18px; margin: 16px 0 8px; }
                pre { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; overflow-x: auto; }
                code { font-family: 'Courier New', monospace; }
            </style></head><body>${htmlContent}</body></html>`

            // Use print-to-PDF via iframe
            const iframe = document.createElement("iframe")
            iframe.style.position = "fixed"
            iframe.style.right = "0"
            iframe.style.bottom = "0"
            iframe.style.width = "0"
            iframe.style.height = "0"
            iframe.style.border = "none"
            document.body.appendChild(iframe)

            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
            if (!iframeDoc) throw new Error("Could not create print frame")
            iframeDoc.open()
            iframeDoc.write(fullHtml)
            iframeDoc.close()

            // Wait for content to render
            await new Promise(resolve => setTimeout(resolve, 500))
            iframe.contentWindow?.print()
            setTimeout(() => document.body.removeChild(iframe), 1000)
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
        </div>
    )
}

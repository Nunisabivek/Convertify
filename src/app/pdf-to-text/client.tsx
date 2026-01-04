"use client"

import { useState } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/banner"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { FileText, Copy } from "lucide-react"

export default function PdfToTextPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [extractedText, setExtractedText] = useState<string | null>(null)

    const handleConvert = async () => {
        if (!file) return
        setIsProcessing(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 3000))

            const pdfjsLib = await import("pdfjs-dist")
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

            const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise
            let text = ""

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i)
                const content = await page.getTextContent()
                const strings = content.items.map((item: any) => item.str)
                text += strings.join(" ") + "\n\n"
            }

            setExtractedText(text)
        } catch (e) {
            console.error(e)
            alert("Error extracting text")
        } finally {
            setIsProcessing(false)
        }
    }

    if (isProcessing) return <ProcessingWait progress={70} title="Extracting Text..." />

    if (extractedText) {
        return (
            <div className="container mx-auto py-12 max-w-4xl space-y-8">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-600 mb-4">
                        <FileText className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold">Text Extracted!</h1>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm relative">
                    <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-4 right-4"
                        onClick={() => navigator.clipboard.writeText(extractedText)}
                    >
                        <Copy className="w-4 h-4 mr-2" /> Copy
                    </Button>
                    <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 max-h-[500px] overflow-y-auto">
                        {extractedText}
                    </pre>
                </div>

                <div className="flex flex-col gap-4 text-center">
                    <AdBanner variant="rectangle" />
                    <Button variant="outline" onClick={() => { setFile(null); setExtractedText(null) }}>Convert Another</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 max-w-4xl px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">PDF to Text</h1>
                <p className="text-slate-500 text-lg">Extract editable text from PDF documents.</p>
            </div>
            {!file ? (
                <FileUploader onFilesSelected={(f) => setFile(f[0])} multiple={false} accept={{ "application/pdf": [".pdf"] }} />
            ) : (
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl border text-center">
                        <p className="mb-4 font-bold">{file.name}</p>
                        <Button size="xl" onClick={handleConvert}>Extract Text</Button>
                    </div>
                    <AdBanner variant="rectangle" />
                </div>
            )}
        </div>
    )
}

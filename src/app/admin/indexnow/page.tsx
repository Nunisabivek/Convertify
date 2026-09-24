'use client'

import { useState } from 'react'
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

// Pages to push to IndexNow. Order matters — Bing/Yandex prioritize the
// first URLs in the payload. Lead with the top tools so re-crawl prioritizes
// the highest value search targets.
const TOP_PAGES = [
    // Primary core tools & high-traffic unique utilities
    '/',
    '/all-tools',
    '/compress-pdf',
    '/passport-photo',
    '/fit-to-size',
    '/remove-background',
    '/merge-pdf',
    '/split-pdf',
    '/edit-pdf',
    '/sign-pdf',
    '/protect-pdf',
    '/unlock-pdf',
    '/ocr-pdf',
    '/compare-pdf',
    '/crop-pdf',
    '/redact-pdf',
    '/repair-pdf',
    '/pdf-to-word',
    '/word-to-pdf',
    '/pdf-to-excel',
    '/excel-to-pdf',
    '/pdf-to-powerpoint',
    '/powerpoint-to-pdf',
    '/pdf-to-pdfa',
    '/pdf-to-jpg',
    '/jpg-to-pdf',
    '/pdf-to-png',
    '/png-to-pdf',
    '/pdf-to-text',
    '/text-to-pdf',
    '/rotate-pdf',
    '/watermark-pdf',
    '/organize-pdf',
    '/pricing',
    '/security',
]

export default function IndexNowAdmin() {
    const [urls, setUrls] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const submitToApi = async (urlList: string[]) => {
        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const response = await fetch('/api/indexnow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ urls: urlList }),
            })

            const data = await response.json()

            if (response.ok) {
                setResult(data)
            } else {
                setError(data.error || 'Submission failed')
            }
        } catch (err) {
            setError('Failed to contact API')
        } finally {
            setLoading(false)
        }
    }

    const submitUrls = async () => {
        const urlList = urls
            .split('\n')
            .map(url => url.trim())
            .filter(url => url.length > 0)

        await submitToApi(urlList)
    }

    const submitTopPages = async () => {
        await submitToApi(TOP_PAGES)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-3">
                        IndexNow Submission
                    </h1>
                    <p className="text-lg text-slate-600">
                        Instantly notify search engines about your content updates
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Quick Actions
                        </label>
                        <button
                            onClick={submitTopPages}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            Submit Top Pages ({TOP_PAGES.length} URLs)
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Custom URLs (one per line)
                        </label>
                        <textarea
                            value={urls}
                            onChange={(e) => setUrls(e.target.value)}
                            rows={8}
                            placeholder={`/\n/merge-pdf\n/compress-pdf\n/blog/how-to-compress-pdf`}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm"
                        />
                    </div>

                    <button
                        onClick={submitUrls}
                        disabled={loading || !urls.trim()}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        Submit Custom URLs
                    </button>

                    {/* Results */}
                    {result && (
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 space-y-2">
                            <div className="flex items-center gap-2 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                Submitted {result.submitted} URLs successfully
                            </div>
                            <div className="text-xs text-emerald-700 font-mono space-y-1">
                                {result.results?.map((r: any, i: number) => (
                                    <div key={i}>
                                        {r.endpoint}: {r.success ? 'OK (200)' : `Status ${r.status}`}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-red-800 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

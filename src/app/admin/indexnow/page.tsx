'use client'

import { useState } from 'react'
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

// Top pages to submit
const TOP_PAGES = [
    '/',
    '/all-tools',
    '/merge-pdf',
    '/split-pdf',
    '/compress-pdf',
    '/pdf-to-word',
    '/pdf-to-jpg',
    '/pdf-to-png',
    '/jpg-to-pdf',
    '/png-to-pdf',
    '/rotate-pdf',
    '/watermark-pdf',
    '/protect-pdf',
    '/unlock-pdf',
    '/html-to-pdf',
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
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-3">
                        IndexNow Submission
                    </h1>
                    <p className="text-lg text-slate-600">
                        Instantly notify search engines about your content updates
                    </p>
                </div>

                {/* Quick Submit Top Pages */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                        Quick Submit - Top 15 Pages
                    </h2>
                    <p className="text-slate-600 mb-6">
                        Submit your most important pages (homepage + top tools) instantly to IndexNow via server-side proxy (bypasses CORS).
                    </p>
                    <button
                        onClick={submitTopPages}
                        disabled={loading}
                        className="w-full py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Submit Top Pages Now
                            </>
                        )}
                    </button>
                </div>

                {/* Custom URL Submission */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                        Submit Custom URLs
                    </h2>
                    <p className="text-slate-600 mb-4">
                        Enter URLs (one per line) to submit to IndexNow:
                    </p>
                    <textarea
                        value={urls}
                        onChange={(e) => setUrls(e.target.value)}
                        placeholder="/merge-pdf&#10;/compress-pdf&#10;/pdf-to-word"
                        rows={10}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm mb-4"
                    />
                    <button
                        onClick={submitUrls}
                        disabled={loading || !urls.trim()}
                        className="w-full py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-300 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Submit URLs
                            </>
                        )}
                    </button>
                </div>

                {/* Results */}
                {result && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                            <h3 className="text-xl font-bold text-green-900">
                                Submission Successful!
                            </h3>
                        </div>
                        <p className="text-green-800 mb-4">
                            Submitted {result.urlsSubmitted} URLs to IndexNow endpoints
                        </p>
                        <div className="space-y-2">
                            {result.results?.map((r: any, i: number) => (
                                <div
                                    key={i}
                                    className={`p-3 rounded-lg ${r.success ? 'bg-green-100' : 'bg-red-100'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                            {r.endpoint.replace('https://', '').split('/')[0]}
                                        </span>
                                        <span className={r.success ? 'text-green-700' : 'text-red-700'}>
                                            {r.success ? '✓ Success' : '✗ Failed'} {r.status > 0 ? `(HTTP ${r.status})` : ''}
                                            {r.error && <span className="text-xs block text-red-600">{r.error}</span>}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                            <h3 className="text-xl font-bold text-red-900">Error</h3>
                        </div>
                        <p className="text-red-800 mt-2">{error}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

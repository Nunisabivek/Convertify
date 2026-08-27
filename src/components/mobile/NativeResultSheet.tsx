'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import {
    isNativeAndroid,
    storeOutput,
    shareStoredOutput,
    saveStoredOutputToDownloads,
    type StoredOutput,
} from '@/lib/native-file'

function downloadName(anchor: HTMLAnchorElement): string {
    const attr = anchor.getAttribute('download')
    if (attr && attr !== 'true' && attr !== '') return attr
    try {
        const url = new URL(anchor.href, window.location.href)
        const last = url.pathname.split('/').filter(Boolean).pop()
        return last || 'converted-file'
    } catch {
        return 'converted-file'
    }
}

/**
 * After a convert, Android gets Share + Save — never a naked blob download.
 */
export default function NativeResultSheet() {
    const [native, setNative] = useState(false)
    const [busy, setBusy] = useState(false)
    const [output, setOutput] = useState<StoredOutput | null>(null)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let alive = true
        isNativeAndroid().then((value) => {
            if (alive) setNative(value)
        })
        return () => {
            alive = false
        }
    }, [])

    useEffect(() => {
        if (!native) return

        const onClick = async (event: MouseEvent) => {
            const target = event.target as Element | null
            const anchor = target?.closest?.('a[download]') as HTMLAnchorElement | null
            if (!anchor?.href) return

            event.preventDefault()
            event.stopPropagation()
            setError(null)
            setSaved(false)
            setBusy(true)
            try {
                const response = await fetch(anchor.href)
                const blob = await response.blob()
                const stored = await storeOutput(blob, downloadName(anchor))
                setOutput(stored)
            } catch {
                setError('Could not save that file. Try again.')
            } finally {
                setBusy(false)
            }
        }

        document.addEventListener('click', onClick, true)
        return () => document.removeEventListener('click', onClick, true)
    }, [native])

    if (!native || (!output && !busy && !error)) return null

    return (
        <div className="mobile-result-sheet" role="dialog" aria-label="Save or share">
            <div className="mobile-result-card">
                <div className="mobile-result-check">
                    <Check size={28} />
                </div>
                <h2>{saved ? 'Saved' : busy ? 'Saving…' : 'Done'}</h2>
                {output && <p className="mobile-result-name">{output.filename}</p>}
                {saved && (
                    <p className="mobile-result-note">
                        Saved. You can find it in Files → Downloads → Convertify.
                    </p>
                )}
                {error && <p className="mobile-result-error">{error}</p>}
                <div className="mobile-result-actions">
                    <button
                        type="button"
                        className="mobile-result-primary"
                        disabled={!output || busy}
                        onClick={async () => {
                            if (!output) return
                            setError(null)
                            try {
                                await shareStoredOutput(output)
                            } catch {
                                setError('Could not open the share sheet. Try Save instead.')
                            }
                        }}
                    >
                        Share
                    </button>
                    <button
                        type="button"
                        className="mobile-result-secondary"
                        disabled={!output || busy}
                        onClick={async () => {
                            if (!output) return
                            setError(null)
                            try {
                                await saveStoredOutputToDownloads(output)
                                setSaved(true)
                            } catch {
                                setError('Could not save. Try Share and pick Files.')
                            }
                        }}
                    >
                        Save to Files
                    </button>
                    <button
                        type="button"
                        className="mobile-result-ghost"
                        onClick={() => {
                            setOutput(null)
                            setSaved(false)
                            setError(null)
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

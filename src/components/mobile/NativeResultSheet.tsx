'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import {
    isNativeAndroid,
    storeOutput,
    shareStoredOutput,
    saveStoredOutputToDownloads,
    CONVERT_OFFER,
    type StoredOutput,
} from '@/lib/native-file'

export interface OfferOutputDetail {
    blob?: Blob
    href?: string
    filename: string
    note?: string
}

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

function isDownloadAnchor(el: HTMLAnchorElement | null): el is HTMLAnchorElement {
    if (!el) return false
    if (!el.hasAttribute('download')) return false
    return Boolean(el.getAttribute('href') || el.href)
}

/**
 * After a convert, Android gets Share + Save — never a naked blob download.
 * Intercepts in-document clicks AND detached `a.click()` / file-saver.
 */
export default function NativeResultSheet() {
    const [native, setNative] = useState(false)
    const [busy, setBusy] = useState(false)
    const [output, setOutput] = useState<StoredOutput | null>(null)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [note, setNote] = useState<string | null>(null)

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

        let lastKey = ''
        let lastAt = 0
        const capture = async (href: string, filename: string) => {
            const key = `${href}|${filename}`
            const now = Date.now()
            if (key === lastKey && now - lastAt < 600) return
            lastKey = key
            lastAt = now
            setError(null)
            setSaved(false)
            setBusy(true)
            try {
                const response = await fetch(href)
                const blob = await response.blob()
                const stored = await storeOutput(blob, filename)
                setOutput(stored)
                void import('@/lib/native-ads').then((m) => m.noteSuccessfulConversion()).catch(() => {})
            } catch {
                setError('Could not save that file. Try again.')
            } finally {
                setBusy(false)
            }
        }

        const captureBlob = async (blob: Blob, filename: string, quality?: string) => {
            setError(null)
            setSaved(false)
            setNote(quality ?? null)
            setBusy(true)
            try {
                const stored = await storeOutput(blob, filename)
                setOutput(stored)
                void import('@/lib/native-ads').then((m) => m.noteSuccessfulConversion()).catch(() => {})
            } catch {
                setError('Could not save that file. Try again.')
            } finally {
                setBusy(false)
            }
        }

        const onClick = (event: MouseEvent) => {
            const target = event.target as Element | null
            const anchor = target?.closest?.('a[download]') as HTMLAnchorElement | null
            if (!isDownloadAnchor(anchor)) return
            event.preventDefault()
            event.stopPropagation()
            void capture(anchor.href, downloadName(anchor))
        }

        const originalClick = HTMLAnchorElement.prototype.click
        HTMLAnchorElement.prototype.click = function patchedClick(this: HTMLAnchorElement) {
            if (isDownloadAnchor(this)) {
                void capture(this.href, downloadName(this))
                return
            }
            return originalClick.call(this)
        }

        const originalDispatch = EventTarget.prototype.dispatchEvent
        EventTarget.prototype.dispatchEvent = function patchedDispatch(this: EventTarget, event: Event) {
            if (
                this instanceof HTMLAnchorElement &&
                event?.type === 'click' &&
                isDownloadAnchor(this)
            ) {
                void capture(this.href, downloadName(this))
                return true
            }
            return originalDispatch.call(this, event)
        }

        const onOffer = (event: Event) => {
            const detail = (event as CustomEvent<OfferOutputDetail>).detail
            if (!detail?.filename) return
            if (detail.blob) {
                void captureBlob(detail.blob, detail.filename, detail.note)
                return
            }
            if (detail.href) {
                void capture(detail.href, detail.filename)
            }
        }

        document.addEventListener('click', onClick, true)
        window.addEventListener(CONVERT_OFFER, onOffer)
        return () => {
            HTMLAnchorElement.prototype.click = originalClick
            EventTarget.prototype.dispatchEvent = originalDispatch
            document.removeEventListener('click', onClick, true)
            window.removeEventListener(CONVERT_OFFER, onOffer)
        }
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
                {note && !busy ? <p className="mobile-result-quality">{note}</p> : null}
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
                            setNote(null)
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export function offerNativeOutput(detail: OfferOutputDetail): void {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent<OfferOutputDetail>(CONVERT_OFFER, { detail }))
}

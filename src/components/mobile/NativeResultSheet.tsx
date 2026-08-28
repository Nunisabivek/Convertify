'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AlertTriangle, Check, FileText } from 'lucide-react'
import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'
import {
    storeOutput,
    shareStoredOutput,
    saveStoredOutputToDownloads,
    CONVERT_OFFER,
    mimeFromName,
    type StoredOutput,
    type ResultTone,
} from '@/lib/native-file'
import { bindResultSheet, setResultSheetOpen } from '@/lib/result-sheet'

export interface OfferOutputDetail {
    blob?: Blob
    href?: string
    filename: string
    note?: string
    tone?: ResultTone
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

function previewUrlFor(blob: Blob, filename: string): string | null {
    const mime = blob.type || mimeFromName(filename)
    if (!mime.startsWith('image/')) return null
    return URL.createObjectURL(blob)
}

/**
 * After a convert, Android gets Share + Save — never a naked blob download.
 * Intercepts in-document clicks AND detached `a.click()` / file-saver.
 */
export default function NativeResultSheet() {
    const pathname = usePathname() || '/'
    const [busy, setBusy] = useState(false)
    const [output, setOutput] = useState<StoredOutput | null>(null)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [note, setNote] = useState<string | null>(null)
    const [tone, setTone] = useState<ResultTone>('ok')
    const [thumb, setThumb] = useState<string | null>(null)

    const reset = useCallback(() => {
        setOutput(null)
        setSaved(false)
        setError(null)
        setNote(null)
        setTone('ok')
        setThumb((prev) => {
            if (prev) URL.revokeObjectURL(prev)
            return null
        })
        setResultSheetOpen(false)
    }, [])

    useEffect(() => {
        return bindResultSheet(reset)
    }, [reset])

    useEffect(() => {
        reset()
    }, [pathname, reset])

    useEffect(() => {
        if (!IS_MOBILE_BUILD) return

        let lastKey = ''
        let lastAt = 0
        const capture = async (href: string, filename: string, nextTone: ResultTone = 'ok') => {
            const key = `${href}|${filename}`
            const now = Date.now()
            if (key === lastKey && now - lastAt < 600) return
            lastKey = key
            lastAt = now
            setError(null)
            setSaved(false)
            setTone(nextTone)
            setBusy(true)
            try {
                const response = await fetch(href)
                const blob = await response.blob()
                const stored = await storeOutput(blob, filename)
                setThumb((prev) => {
                    if (prev) URL.revokeObjectURL(prev)
                    return previewUrlFor(blob, filename)
                })
                setOutput(stored)
                setResultSheetOpen(true)
                void import('@/lib/native-ads').then((m) => m.noteSuccessfulConversion()).catch(() => {})
            } catch {
                setError('Could not save that file. Try again.')
                setResultSheetOpen(true)
            } finally {
                setBusy(false)
            }
        }

        const captureBlob = async (blob: Blob, filename: string, quality?: string, nextTone: ResultTone = 'ok') => {
            setError(null)
            setSaved(false)
            setNote(quality ?? null)
            setTone(nextTone)
            setBusy(true)
            try {
                const stored = await storeOutput(blob, filename)
                setThumb((prev) => {
                    if (prev) URL.revokeObjectURL(prev)
                    return previewUrlFor(blob, filename)
                })
                setOutput(stored)
                setResultSheetOpen(true)
                void import('@/lib/native-ads').then((m) => m.noteSuccessfulConversion()).catch(() => {})
            } catch {
                setError('Could not save that file. Try again.')
                setResultSheetOpen(true)
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
            const nextTone = detail.tone ?? 'ok'
            if (detail.blob) {
                void captureBlob(detail.blob, detail.filename, detail.note, nextTone)
                return
            }
            if (detail.href) {
                setNote(detail.note ?? null)
                void capture(detail.href, detail.filename, nextTone)
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
    }, [])

    if (!IS_MOBILE_BUILD || (!output && !busy && !error)) return null

    const warn = tone === 'warn' && !saved
    const title = saved ? 'Saved' : busy ? 'Saving…' : warn ? 'Not quite' : 'Done'

    return (
        <div className="mobile-result-sheet" role="dialog" aria-label="Save or share">
            <div className="mobile-result-card">
                <div className={`mobile-result-check${warn ? ' is-warn' : ''}`}>
                    {warn ? <AlertTriangle size={28} /> : <Check size={28} />}
                </div>
                <h2>{title}</h2>
                {thumb ? (
                    // Blob object URL from the just-converted photo — Next/Image cannot host it.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="mobile-result-thumb" src={thumb} alt="" />
                ) : output && !busy ? (
                    <div className="mobile-result-thumb is-file" aria-hidden>
                        <FileText size={32} />
                    </div>
                ) : null}
                {output && <p className="mobile-result-name">{output.filename}</p>}
                {note && !busy ? <p className={`mobile-result-quality${warn ? ' is-warn' : ''}`}>{note}</p> : null}
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
                    <button type="button" className="mobile-result-ghost" onClick={reset}>
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

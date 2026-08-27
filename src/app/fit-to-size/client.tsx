'use client'

import { useEffect, useRef, useState } from 'react'
import { FileUploader } from '@/components/tools/file-uploader'
import MobileWorkBar from '@/components/mobile/MobileWorkBar'
import { formatFileSize, finishConvert } from '@/lib/native-file'
import { tapHaptic } from '@/lib/haptics'
import { abortConvertWorker, assertFitsPhone, warmConvertWorker, workerFitImage } from '@/lib/jobs/media'
import { fitPdfToRange } from '@/lib/jobs/fit-pdf'
import { TOO_BIG } from '@/lib/brand'

const RANGES: { min: number; max: number; label: string }[] = [
    { min: 20, max: 50, label: '20–50' },
    { min: 20, max: 100, label: '20–100' },
    { min: 20, max: 200, label: '20–200' },
    { min: 20, max: 300, label: '20–300' },
    { min: 50, max: 200, label: '50–200' },
    { min: 100, max: 200, label: '100–200' },
]

function isPdf(file: File) {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

export default function FitToSizeClient() {
    const [file, setFile] = useState<File | null>(null)
    const [minKb, setMinKb] = useState(20)
    const [maxKb, setMaxKb] = useState(200)
    const [customMin, setCustomMin] = useState('20')
    const [customMax, setCustomMax] = useState('200')
    const [working, setWorking] = useState(false)
    const [note, setNote] = useState('')
    const [liveSize, setLiveSize] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        warmConvertWorker()
        return () => {
            abortRef.current?.abort()
            abortConvertWorker()
        }
    }, [])

    const applyChip = async (min: number, max: number) => {
        await tapHaptic()
        setMinKb(min)
        setMaxKb(max)
        setCustomMin(String(min))
        setCustomMax(String(max))
    }

    const onCustom = () => {
        const min = Math.max(1, parseInt(customMin, 10) || 20)
        const max = Math.max(min + 1, parseInt(customMax, 10) || 200)
        setMinKb(min)
        setMaxKb(max)
    }

    const cancel = () => {
        abortRef.current?.abort()
        abortConvertWorker()
        setWorking(false)
        setNote('')
    }

    const run = async () => {
        if (!file) return
        const min = Math.max(1, parseInt(customMin, 10) || 20)
        const max = Math.max(min + 1, parseInt(customMax, 10) || 200)
        setMinKb(min)
        setMaxKb(max)
        setCustomMin(String(min))
        setCustomMax(String(max))
        const minBytes = min * 1024
        const maxBytes = max * 1024
        setError(null)
        setWorking(true)
        setLiveSize(file.size)
        setNote('Working…')
        const ac = new AbortController()
        abortRef.current = ac
        await tapHaptic()
        try {
            assertFitsPhone(file)
            let blob: Blob
            if (isPdf(file)) {
                blob = await fitPdfToRange(file, minBytes, maxBytes, ac.signal, ({ size, note: n }) => {
                    setLiveSize(size)
                    setNote(n)
                })
            } else {
                blob = await workerFitImage(file, minBytes, maxBytes, ac.signal, (size) => {
                    setLiveSize(size)
                    setNote('Fitting photo…')
                })
            }
            const inRange = blob.size >= minBytes && blob.size <= maxBytes
            if (!inRange && blob.size > maxBytes) {
                setError(`Smallest we could get is ${formatFileSize(blob.size)}. Need ${min}–${max} KB.`)
            } else if (!inRange && blob.size < minBytes) {
                setError(`Largest we could get is ${formatFileSize(blob.size)}. Need ${min}–${max} KB.`)
            }
            const base = file.name.replace(/\.[^.]+$/, '')
            const name = isPdf(file) ? `${base}-fit.pdf` : `${base}-fit.jpg`
            await finishConvert(blob, name)
        } catch (err) {
            if ((err as Error).name === 'AbortError') return
            setError((err as Error).message || TOO_BIG)
        } finally {
            setWorking(false)
        }
    }

    return (
        <div className="mobile-job">
            {!file ? (
                <FileUploader
                    onFilesSelected={(files) => {
                        setFile(files[0] ?? null)
                        setError(null)
                        setLiveSize(files[0]?.size ?? null)
                    }}
                    multiple={false}
                    accept={{
                        'application/pdf': ['.pdf'],
                        'image/jpeg': ['.jpg', '.jpeg'],
                        'image/png': ['.png'],
                        'image/webp': ['.webp'],
                    }}
                    fileTypeLabel="PDF or photo"
                    iconType="pdf"
                />
            ) : (
                <div className="mobile-picked">
                    <div className="mobile-picked-row">
                        <div>
                            <strong>{file.name}</strong>
                            <p>{formatFileSize(file.size)}</p>
                        </div>
                        <button type="button" className="mobile-text-btn" onClick={() => setFile(null)}>
                            Change
                        </button>
                    </div>
                </div>
            )}

            <p className="mobile-live-size">
                Now {formatFileSize(liveSize ?? file?.size ?? 0)} → need {minKb}–{maxKb} KB
            </p>

            <p className="mobile-chip-label">Size a form asks for</p>
            <div className="mobile-range-chips">
                {RANGES.map((chip) => {
                    const on = minKb === chip.min && maxKb === chip.max
                    return (
                        <button
                            key={chip.label}
                            type="button"
                            className={`mobile-size-chip ${on ? 'is-selected' : ''}`}
                            onClick={() => applyChip(chip.min, chip.max)}
                        >
                            <strong>{chip.label}</strong>
                            <span>KB</span>
                        </button>
                    )
                })}
            </div>

            <div className="mobile-custom-range">
                <label>
                    Min KB
                    <input
                        type="number"
                        min={1}
                        value={customMin}
                        onChange={(e) => setCustomMin(e.target.value)}
                        onBlur={onCustom}
                    />
                </label>
                <label>
                    Max KB
                    <input
                        type="number"
                        min={2}
                        value={customMax}
                        onChange={(e) => setCustomMax(e.target.value)}
                        onBlur={onCustom}
                    />
                </label>
            </div>

            {error ? <p className="mobile-job-error">{error}</p> : null}

            <button type="button" className="mobile-choose-btn" disabled={!file || working} onClick={run}>
                Fit to size
            </button>

            {working ? (
                <MobileWorkBar
                    note={note}
                    sizeLabel={`Now ${formatFileSize(liveSize ?? 0)} → need ${minKb}–${maxKb} KB`}
                    onCancel={cancel}
                />
            ) : null}
        </div>
    )
}

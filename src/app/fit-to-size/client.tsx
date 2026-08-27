'use client'

import { useEffect, useRef, useState } from 'react'
import { FileUploader } from '@/components/tools/file-uploader'
import MobileWorkBar from '@/components/mobile/MobileWorkBar'
import MobileSizeControl from '@/components/mobile/MobileSizeControl'
import { formatFileSize, finishConvert } from '@/lib/native-file'
import { tapHaptic } from '@/lib/haptics'
import { abortConvertWorker, assertFitsPhone, workerFitImage } from '@/lib/jobs/media'
import { fitPdfToRange } from '@/lib/jobs/fit-pdf'
import { qualityNote, releaseJob, takeJob } from '@/lib/jobs/session'
import { TOO_BIG } from '@/lib/brand'

const RANGES: { min: number; max: number; label: string; unit?: string }[] = [
    { min: 10, max: 20, label: '10–20' },
    { min: 20, max: 50, label: '20–50' },
    { min: 20, max: 100, label: '20–100' },
    { min: 20, max: 200, label: '20–200' },
    { min: 20, max: 300, label: '20–300' },
    { min: 50, max: 200, label: '50–200' },
    { min: 100, max: 200, label: '100–200' },
]

const MB_RANGES: { min: number; max: number; label: string }[] = [
    { min: 500, max: 1024, label: '0.5–1 MB' },
    { min: 1024, max: 2048, label: '1–2 MB' },
    { min: 2048, max: 5000, label: '2–5 MB' },
]

function isPdf(file: File) {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

export default function FitToSizeClient() {
    const [file, setFile] = useState<File | null>(null)
    const [minKb, setMinKb] = useState(20)
    const [maxKb, setMaxKb] = useState(200)
    const [working, setWorking] = useState(false)
    const [note, setNote] = useState('')
    const [liveSize, setLiveSize] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => () => {
        abortRef.current?.abort()
        abortConvertWorker()
    }, [])

    const applyChip = (min: number, max: number) => {
        void tapHaptic()
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
        const min = Math.max(1, minKb)
        const max = Math.max(min + 1, maxKb)
        const minBytes = min * 1024
        const maxBytes = max * 1024
        setError(null)
        setWorking(true)
        setLiveSize(file.size)
        setNote('Working…')
        const ac = takeJob()
        abortRef.current = ac
        await tapHaptic()
        try {
            assertFitsPhone(file)
            const result = isPdf(file)
                ? await fitPdfToRange(file, minBytes, maxBytes, ac.signal, ({ size, note: n }) => {
                    setLiveSize(size)
                    setNote(n)
                })
                : await workerFitImage(file, minBytes, maxBytes, ac.signal, (size) => {
                    setLiveSize(size)
                    setNote('Fitting photo…')
                })
            const inRange = result.blob.size >= minBytes && result.blob.size <= maxBytes
            if (!inRange && result.blob.size > maxBytes) {
                setError(`Smallest we could get is ${formatFileSize(result.blob.size)}. Need ${min}–${max} KB.`)
            } else if (!inRange && result.blob.size < minBytes) {
                setError(`Largest we could get is ${formatFileSize(result.blob.size)}. Need ${min}–${max} KB.`)
            }
            const base = file.name.replace(/\.[^.]+$/, '')
            const name = isPdf(file) ? `${base}-fit.pdf` : `${base}-fit.jpg`
            await finishConvert(result.blob, name, qualityNote(result.shrunk))
        } catch (err) {
            if ((err as Error).name === 'AbortError') return
            setError((err as Error).message || TOO_BIG)
        } finally {
            releaseJob(ac)
            setWorking(false)
        }
    }

    const now = liveSize ?? file?.size ?? 0

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
                <div className="mobile-picked-row">
                    <div>
                        <strong>{file.name}</strong>
                        <p>{formatFileSize(file.size)}</p>
                    </div>
                    <button type="button" className="mobile-text-btn" onClick={() => setFile(null)}>
                        Change
                    </button>
                </div>
            )}

            <p className="mobile-live-size">
                {formatFileSize(now)} → {minKb}–{maxKb} KB
            </p>

            <p className="mobile-chip-label">KB a form asks for</p>
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
            <p className="mobile-chip-label">Job / university MB caps</p>
            <div className="mobile-range-chips">
                {MB_RANGES.map((chip) => {
                    const on = minKb === chip.min && maxKb === chip.max
                    return (
                        <button
                            key={chip.label}
                            type="button"
                            className={`mobile-size-chip ${on ? 'is-selected' : ''}`}
                            onClick={() => applyChip(chip.min, chip.max)}
                        >
                            <strong>{chip.label}</strong>
                            <span>range</span>
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
                        value={minKb}
                        onChange={(e) => setMinKb(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    />
                </label>
                <label>
                    Max KB
                    <input
                        type="number"
                        min={2}
                        value={maxKb}
                        onChange={(e) => setMaxKb(Math.max(2, parseInt(e.target.value, 10) || 2))}
                    />
                </label>
            </div>

            <MobileSizeControl
                valueKb={maxKb}
                onChangeKb={(kb) => {
                    setMaxKb(kb)
                    if (minKb >= kb) setMinKb(Math.max(1, Math.round(kb * 0.2)))
                }}
                fileBytes={file?.size}
                minKb={10}
            />

            {error ? <p className="mobile-job-error">{error}</p> : null}

            <button type="button" className="mobile-choose-btn" disabled={!file || working} onClick={run}>
                Fit to size
            </button>

            {working ? (
                <MobileWorkBar
                    note={note}
                    sizeLabel={`${formatFileSize(now)} → ${minKb}–${maxKb} KB`}
                    onCancel={cancel}
                />
            ) : null}
        </div>
    )
}

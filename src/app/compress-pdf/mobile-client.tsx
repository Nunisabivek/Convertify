'use client'

import { useEffect, useRef, useState } from 'react'
import { FileUploader } from '@/components/tools/file-uploader'
import MobileWorkBar from '@/components/mobile/MobileWorkBar'
import MobileSizeControl from '@/components/mobile/MobileSizeControl'
import { formatFileSize, finishConvert } from '@/lib/native-file'
import { tapHaptic } from '@/lib/haptics'
import { abortConvertWorker, assertFitsPhone, workerCompressImage } from '@/lib/jobs/media'
import { fitPdfToRange } from '@/lib/jobs/fit-pdf'
import { qualityNote, releaseJob, takeJob } from '@/lib/jobs/session'
import { TOO_BIG } from '@/lib/brand'

const CHIPS = [
    { kb: 100, hint: 'Most forms' },
    { kb: 200, hint: 'Job / KYC' },
    { kb: 300, hint: 'Clearer' },
]

function isPdf(file: File) {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

export default function CompressMobileClient() {
    const [file, setFile] = useState<File | null>(null)
    const [targetKb, setTargetKb] = useState(200)
    const [working, setWorking] = useState(false)
    const [note, setNote] = useState('')
    const [liveSize, setLiveSize] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => () => {
        abortRef.current?.abort()
        abortConvertWorker()
    }, [])

    const cancel = () => {
        abortRef.current?.abort()
        abortConvertWorker()
        setWorking(false)
    }

    const run = async () => {
        if (!file) return
        const maxBytes = Math.max(5 * 1024, targetKb * 1024)
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
                ? await fitPdfToRange(file, 1, maxBytes, ac.signal, ({ size, note: n }) => {
                    setLiveSize(size)
                    setNote(n)
                })
                : await workerCompressImage(file, 1, maxBytes, ac.signal, (size) => {
                    setLiveSize(size)
                    setNote('Compressing photo…')
                })
            if (result.blob.size > maxBytes) {
                setError(`Smallest we could get is ${formatFileSize(result.blob.size)}. Need ${targetKb} KB.`)
            }
            const base = file.name.replace(/\.[^.]+$/, '')
            const name = isPdf(file) ? `${base}-compressed.pdf` : `${base}-compressed.jpg`
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
                {formatFileSize(now)} → {targetKb >= 1024 ? `${(targetKb / 1024).toFixed(1)} MB` : `${targetKb} KB`}
            </p>

            <p className="mobile-chip-label">Shortcuts</p>
            <div className="mobile-range-chips">
                {CHIPS.map((chip) => (
                    <button
                        key={chip.kb}
                        type="button"
                        className={`mobile-size-chip ${targetKb === chip.kb ? 'is-selected' : ''}`}
                        onClick={() => {
                            void tapHaptic()
                            setTargetKb(chip.kb)
                        }}
                    >
                        <strong>{chip.kb} KB</strong>
                        <span>{chip.hint}</span>
                    </button>
                ))}
            </div>

            <MobileSizeControl
                valueKb={targetKb}
                onChangeKb={setTargetKb}
                fileBytes={file?.size}
                minKb={10}
            />

            {error ? <p className="mobile-job-error">{error}</p> : null}

            <button type="button" className="mobile-choose-btn" disabled={!file || working} onClick={run}>
                Compress
            </button>

            {working ? (
                <MobileWorkBar
                    note={note}
                    sizeLabel={`${formatFileSize(now)} → ${targetKb} KB`}
                    onCancel={cancel}
                />
            ) : null}
        </div>
    )
}

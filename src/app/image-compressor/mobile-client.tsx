'use client'

import { useEffect, useRef, useState } from 'react'
import { FileUploader } from '@/components/tools/file-uploader'
import MobileWorkBar from '@/components/mobile/MobileWorkBar'
import MobileSizeControl from '@/components/mobile/MobileSizeControl'
import MobileJobCta from '@/components/mobile/MobileJobCta'
import { formatFileSize, finishConvert } from '@/lib/native-file'
import { tapHaptic } from '@/lib/haptics'
import { abortConvertWorker, assertFitsPhone, workerCompressImage } from '@/lib/jobs/media'
import { qualityNote, releaseJob, takeJob } from '@/lib/jobs/session'
import { TOO_BIG } from '@/lib/brand'

const CHIPS = [50, 100, 200, 300]

export default function ImageCompressMobile() {
    const [file, setFile] = useState<File | null>(null)
    const [targetKb, setTargetKb] = useState(200)
    const [working, setWorking] = useState(false)
    const [liveSize, setLiveSize] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => () => {
        abortRef.current?.abort()
        abortConvertWorker()
    }, [])

    const run = async () => {
        if (!file) return
        const maxBytes = Math.max(5 * 1024, targetKb * 1024)
        setError(null)
        setWorking(true)
        setLiveSize(file.size)
        const ac = takeJob()
        abortRef.current = ac
        await tapHaptic()
        try {
            assertFitsPhone(file)
            const result = await workerCompressImage(file, 1, maxBytes, ac.signal, (size) => {
                setLiveSize(size)
            })
            if (result.blob.size > maxBytes) {
                setError(`Smallest we could get is ${formatFileSize(result.blob.size)}. Need ${targetKb} KB.`)
            }
            await finishConvert(
                result.blob,
                file.name.replace(/\.[^.]+$/, '') + '-compressed.jpg',
                qualityNote(result.shrunk)
            )
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
                        setLiveSize(files[0]?.size ?? null)
                        setError(null)
                    }}
                    multiple={false}
                    accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
                    fileTypeLabel="photo"
                    iconType="image"
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
                {formatFileSize(now)} → {targetKb} KB
            </p>

            <div className="mobile-range-chips">
                {CHIPS.map((kb) => (
                    <button
                        key={kb}
                        type="button"
                        className={`mobile-size-chip ${targetKb === kb ? 'is-selected' : ''}`}
                        onClick={() => {
                            void tapHaptic()
                            setTargetKb(kb)
                        }}
                    >
                        <strong>{kb} KB</strong>
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

            {file ? (
                <MobileJobCta>
                    {working ? (
                        <MobileWorkBar
                            note="Compressing photo…"
                            sizeLabel={`${formatFileSize(now)} → ${targetKb} KB`}
                            onCancel={() => {
                                abortRef.current?.abort()
                                abortConvertWorker()
                                setWorking(false)
                            }}
                        />
                    ) : (
                        <button type="button" className="mobile-choose-btn" disabled={working} onClick={run}>
                            Compress
                        </button>
                    )}
                </MobileJobCta>
            ) : null}
        </div>
    )
}

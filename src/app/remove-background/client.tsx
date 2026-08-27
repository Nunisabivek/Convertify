'use client'

import { useEffect, useRef, useState } from 'react'
import { FileUploader } from '@/components/tools/file-uploader'
import MobileWorkBar from '@/components/mobile/MobileWorkBar'
import { finishConvert, formatFileSize } from '@/lib/native-file'
import { tapHaptic } from '@/lib/haptics'
import { abortConvertWorker, warmConvertWorker, workerRemoveBackground } from '@/lib/jobs/media'
import { qualityNote, releaseJob, takeJob } from '@/lib/jobs/session'
import { TOO_BIG } from '@/lib/brand'

const FILLS = {
    white: [255, 255, 255] as [number, number, number],
    blue: [220, 233, 255] as [number, number, number],
}

export default function RemoveBackgroundClient() {
    const [file, setFile] = useState<File | null>(null)
    const [fill, setFill] = useState<'white' | 'blue'>('white')
    const [preview, setPreview] = useState<string | null>(null)
    const [working, setWorking] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        warmConvertWorker()
        return () => {
            abortRef.current?.abort()
            abortConvertWorker()
        }
    }, [])

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview)
        }
    }, [preview])

    const cancel = () => {
        abortRef.current?.abort()
        abortConvertWorker()
        setWorking(false)
    }

    const run = async () => {
        if (!file) return
        setError(null)
        setWorking(true)
        const ac = takeJob()
        abortRef.current = ac
        await tapHaptic()
        try {
            const { blob } = await workerRemoveBackground(file, FILLS[fill], ac.signal)
            if (preview) URL.revokeObjectURL(preview)
            setPreview(URL.createObjectURL(blob))
            await finishConvert(blob, file.name.replace(/\.[^.]+$/, '') + '-bg.jpg', qualityNote(false))
        } catch (err) {
            if ((err as Error).name === 'AbortError') return
            setError((err as Error).message || TOO_BIG)
        } finally {
            releaseJob(ac)
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

            <p className="mobile-chip-label">Replace background with</p>
            <div className="mobile-range-chips">
                <button
                    type="button"
                    className={`mobile-size-chip ${fill === 'white' ? 'is-selected' : ''}`}
                    onClick={() => setFill('white')}
                >
                    <strong>White</strong>
                    <span>Passport / ID</span>
                </button>
                <button
                    type="button"
                    className={`mobile-size-chip ${fill === 'blue' ? 'is-selected' : ''}`}
                    onClick={() => setFill('blue')}
                >
                    <strong>Light blue</strong>
                    <span>Soft studio</span>
                </button>
            </div>

            {preview ? <img className="mobile-bg-preview" src={preview} alt="" /> : null}
            {error ? <p className="mobile-job-error">{error}</p> : null}

            <button type="button" className="mobile-choose-btn" disabled={!file || working} onClick={run}>
                Remove background
            </button>

            {working ? (
                <MobileWorkBar note="Picking out the background…" onCancel={cancel} />
            ) : null}
        </div>
    )
}

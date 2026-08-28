'use client'

import { useEffect, useRef, useState } from 'react'
import { FileUploader } from '@/components/tools/file-uploader'
import MobileWorkBar from '@/components/mobile/MobileWorkBar'
import MobileSizeControl from '@/components/mobile/MobileSizeControl'
import MobileJobCta from '@/components/mobile/MobileJobCta'
import { finishConvert, formatFileSize } from '@/lib/native-file'
import { tapHaptic } from '@/lib/haptics'
import { abortConvertWorker, workerMakePhoto } from '@/lib/jobs/media'
import { qualityNote, releaseJob, takeJob } from '@/lib/jobs/session'
import { TOO_BIG } from '@/lib/brand'
import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'

type Preset = {
    id: string
    label: string
    hint: string
    width: number
    height: number
    minKb: number
    maxKb: number
    fill: string
    cropClass: string
}

const PRESETS: Preset[] = [
    {
        id: 'passport',
        label: 'India 630×810',
        hint: '630×810, 10–250 KB',
        width: 630,
        height: 810,
        minKb: 10,
        maxKb: 250,
        fill: '#FFFFFF',
        cropClass: '',
    },
    {
        id: 'us-2x2',
        label: 'US 2×2',
        hint: '600×600, 50–240 KB',
        width: 600,
        height: 600,
        minKb: 50,
        maxKb: 240,
        fill: '#FFFFFF',
        cropClass: 'is-square',
    },
    {
        id: 'visa-35x45',
        label: 'Visa 35×45',
        hint: '600×750, 50–240 KB',
        width: 600,
        height: 750,
        minKb: 50,
        maxKb: 240,
        fill: '#FFFFFF',
        cropClass: 'is-uk',
    },
    {
        id: 'upsc',
        label: 'UPSC photo',
        hint: '3.5×4.5 cm, 20–300 KB',
        width: 413,
        height: 531,
        minKb: 20,
        maxKb: 300,
        fill: '#FFFFFF',
        cropClass: '',
    },
    {
        id: 'bank',
        label: 'Bank photo',
        hint: '200×230, 20–50 KB',
        width: 200,
        height: 230,
        minKb: 20,
        maxKb: 50,
        fill: '#F2F4F7',
        cropClass: 'is-bank',
    },
    {
        id: 'sign',
        label: 'Signature',
        hint: '140×60, 10–20 KB',
        width: 140,
        height: 60,
        minKb: 10,
        maxKb: 20,
        fill: '#FFFFFF',
        cropClass: 'is-sign',
    },
    {
        id: 'thumb',
        label: 'Thumb',
        hint: '160×200, 10–20 KB',
        width: 160,
        height: 200,
        minKb: 10,
        maxKb: 20,
        fill: '#FFFFFF',
        cropClass: 'is-thumb',
    },
    {
        id: 'custom',
        label: 'Custom',
        hint: 'Your KB and crop',
        width: 413,
        height: 531,
        minKb: 20,
        maxKb: 200,
        fill: '#FFFFFF',
        cropClass: '',
    },
]

function outputNameForPreset(preset: Preset): string {
    switch (preset.id) {
        case 'us-2x2':
            return 'us-passport-photo.jpg'
        case 'visa-35x45':
            return 'visa-photo.jpg'
        case 'upsc':
            return 'upsc-photo.jpg'
        case 'bank':
            return 'bank-photo.jpg'
        case 'sign':
            return 'signature.jpg'
        case 'thumb':
            return 'thumb.jpg'
        case 'custom':
            return 'form-photo.jpg'
        default:
            return 'passport-photo.jpg'
    }
}

export default function PassportPhotoClient() {
    const [file, setFile] = useState<File | null>(null)
    const [preset, setPreset] = useState<Preset>(PRESETS[0])
    const [preview, setPreview] = useState<string | null>(null)
    const [zoom, setZoom] = useState(1.15)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [working, setWorking] = useState(false)
    const [liveSize, setLiveSize] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [customW, setCustomW] = useState(413)
    const [customH, setCustomH] = useState(531)
    const [maxKb, setMaxKb] = useState(PRESETS[0].maxKb)
    const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)
    const abortRef = useRef<AbortController | null>(null)
    const imgRef = useRef<HTMLImageElement | null>(null)
    const frameRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => () => {
        abortRef.current?.abort()
        abortConvertWorker()
    }, [])

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview)
        }
    }, [preview])

    const pick = (files: File[]) => {
        const next = files[0]
        if (preview) URL.revokeObjectURL(preview)
        if (!next) {
            setFile(null)
            setPreview(null)
            setLiveSize(null)
            return
        }
        setFile(next)
        setPreview(URL.createObjectURL(next))
        setZoom(preset.id === 'sign' ? 1.05 : 1.15)
        setOffset({ x: 0, y: 0 })
        setError(null)
        setLiveSize(next.size)
    }

    const applyPreset = (item: Preset) => {
        void tapHaptic()
        setPreset(item)
        setMaxKb(item.maxKb)
        if (item.id !== 'custom') {
            setCustomW(item.width)
            setCustomH(item.height)
        }
    }

    const onPointerDown = (event: React.PointerEvent) => {
        drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y }
        ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
    }
    const onPointerMove = (event: React.PointerEvent) => {
        if (!drag.current) return
        setOffset({
            x: drag.current.ox + (event.clientX - drag.current.x),
            y: drag.current.oy + (event.clientY - drag.current.y),
        })
    }
    const onPointerUp = () => {
        drag.current = null
    }

    const cancel = () => {
        abortRef.current?.abort()
        abortConvertWorker()
        setWorking(false)
    }

    const cropNorm = () => {
        const frame = frameRef.current
        const img = imgRef.current
        if (!frame || !img) throw new Error('Could not read that photo. Try another.')
        const fr = frame.getBoundingClientRect()
        const ir = img.getBoundingClientRect()
        return {
            x: (fr.left - ir.left) / ir.width,
            y: (fr.top - ir.top) / ir.height,
            w: fr.width / ir.width,
            h: fr.height / ir.height,
        }
    }

    const run = async () => {
        if (!file || !preview) return
        const width = preset.id === 'custom' ? customW : preset.width
        const height = preset.id === 'custom' ? customH : preset.height
        const minKb = preset.minKb
        const cap = Math.max(minKb + 1, maxKb)
        setError(null)
        setWorking(true)
        const ac = takeJob()
        abortRef.current = ac
        await tapHaptic()
        try {
            const result = await workerMakePhoto(
                file,
                {
                    width,
                    height,
                    minBytes: minKb * 1024,
                    maxBytes: cap * 1024,
                    fill: preset.fill,
                    crop: cropNorm(),
                },
                ac.signal,
                (size) => setLiveSize(size)
            )
            if (result.blob.size < minKb * 1024 || result.blob.size > cap * 1024) {
                setError(`Got ${formatFileSize(result.blob.size)}. Need ${minKb}–${cap} KB.`)
            }
            await finishConvert(result.blob, outputNameForPreset(preset), qualityNote(result.shrunk))
        } catch (err) {
            if ((err as Error).name === 'AbortError') return
            setError((err as Error).message || TOO_BIG)
        } finally {
            releaseJob(ac)
            setWorking(false)
        }
    }

    const isWide = preset.cropClass === 'is-sign'

    return (
        <div className="mobile-job">
            <p className="mobile-fineprint">
                Hits the pixel and KB numbers the form lists. This is not an official State Department, MEA, or GOV.UK pose check.
            </p>
            <div className="mobile-preset-row">
                {PRESETS.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`mobile-preset-chip ${preset.id === item.id ? 'is-selected' : ''}`}
                        onClick={() => applyPreset(item)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
            <p className="mobile-preset-hint">{preset.hint}</p>

            {!file ? (
                <FileUploader
                    onFilesSelected={pick}
                    multiple={false}
                    accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
                    fileTypeLabel="photo"
                    iconType="image"
                />
            ) : (
                <>
                    <div className="mobile-picked-row">
                        <div>
                            <strong>{file.name}</strong>
                            <p>{formatFileSize(file.size)}</p>
                        </div>
                        <button type="button" className="mobile-text-btn" onClick={() => pick([])}>
                            Change
                        </button>
                    </div>
                    <div
                        ref={frameRef}
                        className={`mobile-crop ${preset.cropClass} ${isWide ? 'is-sign' : ''}`}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                    >
                        {preview ? (
                            <img
                                ref={imgRef}
                                src={preview}
                                alt=""
                                draggable={false}
                                style={{
                                    transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                                }}
                            />
                        ) : null}
                        <div className="mobile-crop-guide" />
                    </div>
                    {IS_MOBILE_BUILD ? (
                        <details className="mobile-job-advanced">
                            <summary>Zoom and size</summary>
                            <PassportAdvancedControls
                                zoom={zoom}
                                setZoom={setZoom}
                                preset={preset}
                                customW={customW}
                                customH={customH}
                                setCustomW={setCustomW}
                                setCustomH={setCustomH}
                                maxKb={maxKb}
                                setMaxKb={setMaxKb}
                                fileSize={file.size}
                            />
                        </details>
                    ) : (
                        <PassportAdvancedControls
                            zoom={zoom}
                            setZoom={setZoom}
                            preset={preset}
                            customW={customW}
                            customH={customH}
                            setCustomW={setCustomW}
                            setCustomH={setCustomH}
                            maxKb={maxKb}
                            setMaxKb={setMaxKb}
                            fileSize={file.size}
                        />
                    )}
                    {IS_MOBILE_BUILD ? null : (
                        <p className="mobile-live-size">
                            {liveSize ? formatFileSize(liveSize) : formatFileSize(file.size)} → {preset.minKb}–{maxKb} KB
                        </p>
                    )}
                    {error ? <p className="mobile-job-error">{error}</p> : null}
                    <MobileJobCta>
                        {working ? (
                            <MobileWorkBar
                                note="Building the photo…"
                                sizeLabel={liveSize ? `${formatFileSize(liveSize)} → ${preset.minKb}–${maxKb} KB` : undefined}
                                onCancel={cancel}
                            />
                        ) : (
                            <>
                                {IS_MOBILE_BUILD ? (
                                    <p className="mobile-job-cta-hint">
                                        {liveSize ? formatFileSize(liveSize) : formatFileSize(file.size)} → {preset.minKb}–{maxKb} KB
                                    </p>
                                ) : null}
                                <button type="button" className="mobile-choose-btn" disabled={working} onClick={run}>
                                    Make photo
                                </button>
                            </>
                        )}
                    </MobileJobCta>
                </>
            )}
        </div>
    )
}

function PassportAdvancedControls({
    zoom,
    setZoom,
    preset,
    customW,
    customH,
    setCustomW,
    setCustomH,
    maxKb,
    setMaxKb,
    fileSize,
}: {
    zoom: number
    setZoom: (value: number) => void
    preset: Preset
    customW: number
    customH: number
    setCustomW: (value: number) => void
    setCustomH: (value: number) => void
    maxKb: number
    setMaxKb: (value: number) => void
    fileSize: number
}) {
    return (
        <>
            <label className="mobile-zoom">
                Zoom
                <input
                    type="range"
                    min={1}
                    max={2.4}
                    step={0.02}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                />
            </label>
            {preset.id === 'custom' ? (
                <div className="mobile-custom-range">
                    <label>
                        Width px
                        <input
                            type="number"
                            min={40}
                            value={customW}
                            onChange={(e) => setCustomW(Math.max(40, parseInt(e.target.value, 10) || 40))}
                        />
                    </label>
                    <label>
                        Height px
                        <input
                            type="number"
                            min={40}
                            value={customH}
                            onChange={(e) => setCustomH(Math.max(40, parseInt(e.target.value, 10) || 40))}
                        />
                    </label>
                </div>
            ) : null}
            <MobileSizeControl
                valueKb={maxKb}
                onChangeKb={setMaxKb}
                fileBytes={fileSize}
                minKb={preset.minKb}
            />
        </>
    )
}

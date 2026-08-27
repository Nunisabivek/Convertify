'use client'

import { useEffect, useRef, useState } from 'react'
import { FileUploader } from '@/components/tools/file-uploader'
import MobileWorkBar from '@/components/mobile/MobileWorkBar'
import { finishConvert, formatFileSize } from '@/lib/native-file'
import { tapHaptic } from '@/lib/haptics'
import { abortConvertWorker, assertFitsPhone, canvasFromBitmap, fitJpegOnCanvas, loadImageBitmap } from '@/lib/jobs/media'
import { TOO_BIG } from '@/lib/brand'

type Preset = {
    id: string
    label: string
    hint: string
    width: number
    height: number
    minKb: number
    maxKb: number
    aimMin: number
    aimMax: number
}

const PRESETS: Preset[] = [
    {
        id: 'passport',
        label: 'Passport',
        hint: '630×810, 10–250 KB',
        width: 630,
        height: 810,
        minKb: 10,
        maxKb: 250,
        aimMin: 50,
        aimMax: 200,
    },
    {
        id: 'upsc',
        label: 'UPSC photo',
        hint: '3.5×4.5 cm, 20–300 KB',
        width: 413,
        height: 531,
        minKb: 20,
        maxKb: 300,
        aimMin: 20,
        aimMax: 300,
    },
    {
        id: 'sign',
        label: 'Signature',
        hint: 'JPG 20–100 KB',
        width: 360,
        height: 120,
        minKb: 20,
        maxKb: 100,
        aimMin: 20,
        aimMax: 100,
    },
]

export default function PassportPhotoClient() {
    const [file, setFile] = useState<File | null>(null)
    const [preset, setPreset] = useState<Preset>(PRESETS[0])
    const [preview, setPreview] = useState<string | null>(null)
    const [zoom, setZoom] = useState(1.15)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [working, setWorking] = useState(false)
    const [liveSize, setLiveSize] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)
    const abortRef = useRef<AbortController | null>(null)
    const imgRef = useRef<HTMLImageElement | null>(null)

    useEffect(() => () => {
        abortRef.current?.abort()
        abortConvertWorker()
        if (preview) URL.revokeObjectURL(preview)
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
        setZoom(1.15)
        setOffset({ x: 0, y: 0 })
        setError(null)
        setLiveSize(next.size)
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

    const run = async () => {
        if (!file || !preview) return
        setError(null)
        setWorking(true)
        const ac = new AbortController()
        abortRef.current = ac
        await tapHaptic()
        try {
            assertFitsPhone(file)
            const bitmap = await loadImageBitmap(file)
            const source = await canvasFromBitmap(bitmap)
            bitmap.close()
            const out = document.createElement('canvas')
            out.width = preset.width
            out.height = preset.height
            const ctx = out.getContext('2d')
            if (!ctx) throw new Error(TOO_BIG)
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, preset.width, preset.height)

            const frame = imgRef.current?.parentElement
            const img = imgRef.current
            if (!frame || !img) throw new Error('Could not read that photo. Try another.')
            const fr = frame.getBoundingClientRect()
            const ir = img.getBoundingClientRect()
            const scaleX = source.width / ir.width
            const scaleY = source.height / ir.height
            const sx = Math.max(0, (fr.left - ir.left) * scaleX)
            const sy = Math.max(0, (fr.top - ir.top) * scaleY)
            const sw = Math.min(source.width - sx, fr.width * scaleX)
            const sh = Math.min(source.height - sy, fr.height * scaleY)
            ctx.drawImage(source, sx, sy, sw, sh, 0, 0, preset.width, preset.height)

            const blob = await fitJpegOnCanvas(
                out,
                preset.aimMin * 1024,
                preset.aimMax * 1024,
                ac.signal,
                (size) => setLiveSize(size)
            )
            if (blob.size < preset.minKb * 1024 || blob.size > preset.maxKb * 1024) {
                setError(`Got ${formatFileSize(blob.size)}. Need ${preset.minKb}–${preset.maxKb} KB.`)
            }
            await finishConvert(blob, `${preset.id}-${Date.now()}.jpg`)
        } catch (err) {
            if ((err as Error).name === 'AbortError') return
            setError((err as Error).message || TOO_BIG)
        } finally {
            setWorking(false)
        }
    }

    return (
        <div className="mobile-job">
            <p className="mobile-fineprint">
                Hits the usual pixel and KB numbers. This is not an official MEA check.
            </p>
            <div className="mobile-range-chips">
                {PRESETS.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`mobile-size-chip ${preset.id === item.id ? 'is-selected' : ''}`}
                        onClick={async () => {
                            await tapHaptic()
                            setPreset(item)
                        }}
                    >
                        <strong>{item.label}</strong>
                        <span>{item.hint}</span>
                    </button>
                ))}
            </div>

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
                        className={`mobile-crop ${preset.id === 'sign' ? 'is-sign' : ''}`}
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
                    <p className="mobile-live-size">
                        Need {preset.minKb}–{preset.maxKb} KB
                        {liveSize ? ` · last save ${formatFileSize(liveSize)}` : ''}
                    </p>
                    {error ? <p className="mobile-job-error">{error}</p> : null}
                    <button type="button" className="mobile-choose-btn" disabled={working} onClick={run}>
                        Make photo
                    </button>
                </>
            )}

            {working ? (
                <MobileWorkBar
                    note="Building the photo…"
                    sizeLabel={liveSize ? formatFileSize(liveSize) : undefined}
                    onCancel={cancel}
                />
            ) : null}
        </div>
    )
}

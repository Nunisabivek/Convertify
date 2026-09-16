'use client'

import { useEffect, useRef, useState } from 'react'
import { FileUploader } from '@/components/tools/file-uploader'
import { ImageReorderList } from '@/components/tools/image-reorder-list'
import MobileWorkBar from '@/components/mobile/MobileWorkBar'
import MobileJobCta from '@/components/mobile/MobileJobCta'
import { finishConvert } from '@/lib/native-file'
import { nameFromSources } from '@/lib/human-filename'
import { isJpegFile, isPngFile, friendlyFileError } from '@/lib/file-types'
import { tapHaptic } from '@/lib/haptics'
import { releaseJob, takeJob } from '@/lib/jobs/session'
import { PDFDocument } from 'pdf-lib'

export default function JpgToPdfMobileClient() {
    const [files, setFiles] = useState<File[]>([])
    const [working, setWorking] = useState(false)
    const [note, setNote] = useState('')
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => () => {
        abortRef.current?.abort()
    }, [])

    const cancel = () => {
        abortRef.current?.abort()
        setWorking(false)
    }

    const run = async () => {
        if (files.length === 0) return
        setError(null)
        setWorking(true)
        setNote(files.length === 1 ? 'Making your PDF…' : `Adding photo 1 of ${files.length}…`)
        const ac = takeJob()
        abortRef.current = ac
        await tapHaptic()
        try {
            const pdfDoc = await PDFDocument.create()
            let added = 0
            for (let i = 0; i < files.length; i++) {
                if (ac.signal.aborted) throw new DOMException('Aborted', 'AbortError')
                const file = files[i]
                setNote(
                    files.length === 1
                        ? 'Making your PDF…'
                        : `Adding photo ${i + 1} of ${files.length}…`,
                )
                const imageBytes = await file.arrayBuffer()
                let image
                if (isJpegFile(file)) {
                    image = await pdfDoc.embedJpg(imageBytes)
                } else if (isPngFile(file)) {
                    image = await pdfDoc.embedPng(imageBytes)
                } else {
                    continue
                }
                const page = pdfDoc.addPage([image.width, image.height])
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                })
                added += 1
            }
            if (added === 0) {
                throw new Error('Could not open those pictures. Try JPG or PNG.')
            }
            setNote('Finishing PDF…')
            const pdfBytes = await pdfDoc.save()
            if (ac.signal.aborted) throw new DOMException('Aborted', 'AbortError')
            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
            await finishConvert(blob, nameFromSources(files, 'pdf'))
        } catch (err) {
            if ((err as Error).name === 'AbortError') return
            setError(friendlyFileError(err, 'Could not make that PDF. Try again.'))
        } finally {
            releaseJob(ac)
            setWorking(false)
        }
    }

    return (
        <div className="mobile-job">
            {files.length === 0 ? (
                <FileUploader
                    onFilesSelected={(picked) => {
                        setFiles((prev) => [...prev, ...picked])
                        setError(null)
                    }}
                    accept={{ 'image/*': ['.jpg', '.jpeg', '.png'] }}
                    fileTypeLabel="images (JPG, PNG)"
                    iconType="image"
                />
            ) : (
                <>
                    <ImageReorderList
                        files={files}
                        onReorder={setFiles}
                        onRemove={(index) => setFiles((prev) => prev.filter((_, i) => i !== index))}
                    />
                    <button
                        type="button"
                        className="mobile-text-btn"
                        onClick={() => setFiles([])}
                    >
                        Clear photos
                    </button>
                </>
            )}

            {error ? <p className="mobile-job-error">{error}</p> : null}

            {files.length > 0 ? (
                <MobileJobCta>
                    {working ? (
                        <MobileWorkBar note={note} onCancel={cancel} />
                    ) : (
                        <>
                            <p className="mobile-job-cta-hint">
                                {files.length === 1
                                    ? '1 photo → 1 PDF'
                                    : `${files.length} photos → 1 PDF`}
                            </p>
                            <button type="button" className="mobile-choose-btn" onClick={run}>
                                Make PDF
                            </button>
                        </>
                    )}
                </MobileJobCta>
            ) : null}
        </div>
    )
}

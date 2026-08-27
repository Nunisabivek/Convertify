'use client'

import { useEffect, useState } from 'react'
import { Reorder } from 'framer-motion'
import { Trash2 } from 'lucide-react'

interface ImageReorderListProps {
    files: File[]
    onReorder: (files: File[]) => void
    onRemove: (index: number) => void
}

export function ImageReorderList({ files, onReorder, onRemove }: ImageReorderListProps) {
    const [previews, setPreviews] = useState<string[]>([])

    useEffect(() => {
        const urls = files.map((file) => URL.createObjectURL(file))
        setPreviews(urls)
        return () => urls.forEach((url) => URL.revokeObjectURL(url))
    }, [files])

    return (
        <div className="space-y-3">
            <p className="text-sm font-medium text-slate-600 px-1">
                Hold and drag to change page order
            </p>
            <Reorder.Group axis="y" values={files} onReorder={onReorder} className="mobile-reorder-list">
                {files.map((file, index) => (
                    <Reorder.Item
                        key={`${file.name}-${file.size}-${file.lastModified}`}
                        value={file}
                        className="mobile-reorder-item"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={previews[index]}
                            alt=""
                            className="mobile-reorder-thumb"
                        />
                        <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">{file.name}</div>
                            <div className="text-xs text-slate-500">Page {index + 1}</div>
                        </div>
                        <button
                            type="button"
                            className="p-3"
                            aria-label={`Remove ${file.name}`}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => onRemove(index)}
                        >
                            <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </div>
    )
}

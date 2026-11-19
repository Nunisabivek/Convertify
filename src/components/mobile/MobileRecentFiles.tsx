'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AppIcon } from '@/components/mobile/AppIcon'
import { LIBRARY_EVENT, loadLibrary, type LibFile } from '@/lib/library'
import { formatFileSize, formatRecentTime, openLibraryFile } from '@/lib/native-file'
import { haptic } from '@/lib/haptics'

const SHOWN = 4

export default function MobileRecentFiles() {
    const [recent, setRecent] = useState<LibFile[]>([])
    const [total, setTotal] = useState(0)
    const [problem, setProblem] = useState<string | null>(null)

    useEffect(() => {
        const refresh = () => {
            const files = loadLibrary().files.slice().sort((a, b) => b.createdAt - a.createdAt)
            setTotal(files.length)
            setRecent(files.slice(0, SHOWN))
        }
        refresh()
        window.addEventListener(LIBRARY_EVENT, refresh)
        window.addEventListener('storage', refresh)
        return () => {
            window.removeEventListener(LIBRARY_EVENT, refresh)
            window.removeEventListener('storage', refresh)
        }
    }, [])

    const open = async (file: LibFile) => {
        void haptic('tap')
        setProblem(null)
        try {
            await openLibraryFile(file)
        } catch (err) {
            setProblem((err as Error)?.message || 'That file could not be opened.')
        }
    }

    return (
        <div className="mobile-section">
            <div className="mobile-section-header">
                <h2 className="mobile-section-title">Recent files</h2>
                {total > 0 && (
                    <Link href="/files" className="mobile-section-action" onClick={() => void haptic('tap')}>
                        See all{total > SHOWN ? ` (${total})` : ''}
                    </Link>
                )}
            </div>

            {recent.length === 0 ? (
                <div className="mobile-empty-line" style={{ borderRadius: 16, textAlign: 'center', padding: '22px 16px' }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>No files yet</p>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--c-text-2, #5b6474)' }}>
                        Everything you make is kept in Files, on this phone.
                    </p>
                </div>
            ) : (
                <div className="mobile-file-list">
                    {recent.map((file) => (
                        <button type="button" key={file.id} className="mobile-file-item" onClick={() => void open(file)}>
                            <div className="mobile-file-icon">
                                <AppIcon name="FileText" size={20} />
                            </div>
                            <div className="mobile-file-info">
                                <div className="mobile-file-name">{file.name}</div>
                                <div className="mobile-file-meta">
                                    {formatRecentTime(file.createdAt)} · {formatFileSize(file.size)}
                                </div>
                            </div>
                            <AppIcon name="ChevronRight" className="mobile-file-chevron" size={16} />
                        </button>
                    ))}
                </div>
            )}
            {problem && <p className="mobile-job-error" style={{ marginTop: 8 }}>{problem}</p>}
        </div>
    )
}

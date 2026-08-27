'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AppIcon } from '@/components/mobile/AppIcon'
import {
    loadRecentFiles,
    formatFileSize,
    formatRecentTime,
    shareRecentFile,
    clearRecentFiles,
    type RecentFile,
} from '@/lib/native-file'

export default function MobileRecentFiles() {
    const [recentFiles, setRecentFiles] = useState<RecentFile[]>([])

    const refresh = () => setRecentFiles(loadRecentFiles())

    useEffect(() => {
        refresh()
        const onChange = () => refresh()
        window.addEventListener('convertify-recents-changed', onChange)
        window.addEventListener('storage', onChange)
        return () => {
            window.removeEventListener('convertify-recents-changed', onChange)
            window.removeEventListener('storage', onChange)
        }
    }, [])

    const onOpen = async (file: RecentFile) => {
        try {
            await shareRecentFile(file)
        } catch {
            alert('File is no longer on this phone.')
        }
    }

    return (
        <div className="mobile-section">
            <div className="mobile-section-header">
                <h2 className="mobile-section-title">Recent files</h2>
                {recentFiles.length > 0 && (
                    <button
                        type="button"
                        className="mobile-section-action"
                        onClick={clearRecentFiles}
                    >
                        Clear
                    </button>
                )}
            </div>

            {recentFiles.length === 0 ? (
                <p className="mobile-empty-line">Nothing here yet. Convert a file and it will show up.</p>
            ) : (
                <div className="mobile-file-list">
                    {recentFiles.map((file) => (
                        <motion.button
                            type="button"
                            key={file.id}
                            className="mobile-file-item"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onOpen(file)}
                        >
                            <div className="mobile-file-icon">
                                <AppIcon name="FileText" size={22} />
                            </div>
                            <div className="mobile-file-info">
                                <div className="mobile-file-name">{file.name}</div>
                                <div className="mobile-file-meta">
                                    {formatRecentTime(file.timestamp)} · {formatFileSize(file.size)}
                                </div>
                            </div>
                            <AppIcon name="ChevronRight" className="mobile-file-chevron" size={18} />
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    )
}

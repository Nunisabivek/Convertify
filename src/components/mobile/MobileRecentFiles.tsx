'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
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

    const reduceMotion = useReducedMotion()

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
                <h2 className="mobile-section-title">Recent Files</h2>
                {recentFiles.length > 0 && (
                    <button
                        type="button"
                        className="mobile-section-action"
                        onClick={clearRecentFiles}
                    >
                        Clear All
                    </button>
                )}
            </div>

            {recentFiles.length === 0 ? (
                <div className="mobile-empty-line" style={{ borderRadius: 20, textAlign: 'center', padding: '24px 16px' }}>
                    <p style={{ margin: 0, fontWeight: 600, color: '#000000', fontSize: 15 }}>No Recent Files</p>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6c6c70' }}>Files you convert or edit on this phone will appear here.</p>
                </div>
            ) : (
                <div className="mobile-file-list">
                    {recentFiles.map((file) => (
                        <motion.button
                            type="button"
                            key={file.id}
                            className="mobile-file-item"
                            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                            onClick={() => onOpen(file)}
                        >
                            <div className="mobile-file-icon">
                                <AppIcon name="FileText" size={20} />
                            </div>
                            <div className="mobile-file-info">
                                <div className="mobile-file-name">{file.name}</div>
                                <div className="mobile-file-meta">
                                    {formatRecentTime(file.timestamp)} · {formatFileSize(file.size)}
                                </div>
                            </div>
                            <AppIcon name="ChevronRight" className="mobile-file-chevron" size={16} />
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    )
}

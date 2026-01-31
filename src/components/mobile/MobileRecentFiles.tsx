'use client';

import { useState, useEffect } from 'react';

interface RecentFile {
    id: string;
    name: string;
    timestamp: string;
    size: string;
    type: string;
}

// Sample recent files for demo - in real app, this would come from storage
const sampleRecentFiles: RecentFile[] = [
    {
        id: '1',
        name: 'Invoice_March_2024.pdf',
        timestamp: 'Converted 3 hours ago',
        size: '1.2 MB',
        type: 'pdf',
    },
    {
        id: '2',
        name: 'Contract_Final.pdf',
        timestamp: 'Merged yesterday',
        size: '3.4 MB',
        type: 'pdf',
    },
    {
        id: '3',
        name: 'Report_Q1.pdf',
        timestamp: '2 days ago',
        size: '892 KB',
        type: 'pdf',
    },
];

export default function MobileRecentFiles() {
    const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);

    useEffect(() => {
        // Try to load from localStorage
        const stored = localStorage.getItem('convertify-recent-files');
        if (stored) {
            try {
                setRecentFiles(JSON.parse(stored));
            } catch {
                setRecentFiles(sampleRecentFiles);
            }
        } else {
            // Use sample data for demo
            setRecentFiles(sampleRecentFiles);
        }
    }, []);

    if (recentFiles.length === 0) {
        return null;
    }

    return (
        <div className="mobile-section">
            <div className="mobile-section-header">
                <h2 className="mobile-section-title">Recent Files</h2>
                <button
                    className="mobile-section-action"
                    onClick={() => {
                        localStorage.removeItem('convertify-recent-files');
                        setRecentFiles([]);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    See all
                </button>
            </div>

            <div className="mobile-file-list">
                {recentFiles.map((file) => (
                    <div key={file.id} className="mobile-file-item">
                        <div className="mobile-file-icon">
                            <span className="material-icons">picture_as_pdf</span>
                        </div>
                        <div className="mobile-file-info">
                            <div className="mobile-file-name">{file.name}</div>
                            <div className="mobile-file-meta">
                                {file.timestamp} • {file.size}
                            </div>
                        </div>
                        <button
                            className="mobile-icon-btn"
                            aria-label="More options"
                            style={{ marginLeft: 'auto' }}
                        >
                            <span className="material-icons">more_vert</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { AppIcon } from '@/components/mobile/AppIcon'
import { ToolGlyph } from '@/components/mobile/ToolGlyph'
import MobileSearch from '@/components/mobile/MobileSearch'
import { tapHaptic } from '@/lib/haptics'
import {
    getAndroidV1Categories,
    searchAndroidV1Tools,
    shortToolName,
    shortToolDescription,
} from '@/lib/mobile-tools'
import { useToolSheet } from '@/components/mobile/ToolSheetContext'

const SEGMENTS = [
    { id: 'all', label: 'All' },
    { id: 'pdf', label: 'PDF' },
    { id: 'photo', label: 'Photo' },
    { id: 'convert', label: 'Convert' },
] as const

export default function MobileToolsDashboard() {
    const [query, setQuery] = useState('')
    const [activeSegment, setActiveSegment] = useState<typeof SEGMENTS[number]['id']>('all')
    const categories = getAndroidV1Categories()
    const results = useMemo(() => searchAndroidV1Tools(query), [query])
    const searching = query.trim().length > 0

    const filteredCategories = useMemo(() => {
        if (activeSegment === 'all') return categories
        return categories
            .map((cat) => {
                const tools = cat.tools.filter((t) => {
                    if (activeSegment === 'pdf') {
                        return t.id.includes('pdf') || cat.name.toLowerCase().includes('pdf')
                    }
                    if (activeSegment === 'photo') {
                        return (
                            t.id.includes('image') ||
                            t.id.includes('photo') ||
                            t.id.includes('background') ||
                            t.id.includes('heic') ||
                            t.id.includes('webp') ||
                            t.id.includes('jpg') ||
                            t.id.includes('png')
                        )
                    }
                    if (activeSegment === 'convert') {
                        return t.id.includes('to') || t.id.includes('converter')
                    }
                    return true
                })
                return { ...cat, tools }
            })
            .filter((cat) => cat.tools.length > 0)
    }, [categories, activeSegment])

    return (
        <div className="mobile-tools-dashboard">
            <MobileSearch onSearch={setQuery} placeholder="Search 40+ tools..." />

            {!searching && (
                <div className="mobile-segment-control" role="tablist">
                    {SEGMENTS.map((seg) => (
                        <button
                            key={seg.id}
                            type="button"
                            role="tab"
                            aria-selected={activeSegment === seg.id}
                            className={`mobile-segment-item${activeSegment === seg.id ? ' is-active' : ''}`}
                            onClick={() => {
                                void tapHaptic()
                                setActiveSegment(seg.id)
                            }}
                        >
                            {seg.label}
                        </button>
                    ))}
                </div>
            )}

            {searching ? (
                <div className="mobile-category">
                    <div className="mobile-tool-list">
                        {results.length === 0 ? (
                            <div className="mobile-empty-line" style={{ borderRadius: 20, textAlign: 'center', padding: '24px 16px' }}>
                                <p style={{ margin: 0, fontWeight: 600, color: '#000000', fontSize: 15 }}>No Matching Tools</p>
                                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6c6c70' }}>Try searching “merge”, “compress”, or “passport”.</p>
                            </div>
                        ) : (
                            results.map((tool) => (
                                <ToolRow
                                    key={tool.id}
                                    id={tool.id}
                                    href={tool.href}
                                    name={shortToolName(tool)}
                                    description={shortToolDescription(tool)}
                                    color={tool.color.hex}
                                />
                            ))
                        )}
                    </div>
                </div>
            ) : (
                filteredCategories.map((category) => (
                    <div key={category.id} className="mobile-category">
                        <div className="mobile-category-header">
                            <span className="mobile-category-name">{category.name}</span>
                        </div>
                        <div className="mobile-tool-list">
                            {category.tools.map((tool) => (
                                <ToolRow
                                    key={tool.id}
                                    id={tool.id}
                                    href={tool.href}
                                    name={shortToolName(tool)}
                                    description={shortToolDescription(tool)}
                                    color={tool.color.hex}
                                />
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

function ToolRow({
    id,
    href,
    name,
    description,
}: {
    id: string
    href: string
    name: string
    description: string
    color: string
}) {
    const reduceMotion = useReducedMotion()
    const { openTool } = useToolSheet()
    return (
        <motion.div whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
            <a
                href={`/${href}`}
                className="mobile-tool-list-item"
                onClick={(e) => {
                    e.preventDefault()
                    openTool(id)
                }}
            >
                <div className="mobile-tool-list-icon">
                    <ToolGlyph toolId={id} size={24} />
                </div>
                <div className="mobile-tool-list-content">
                    <div className="mobile-tool-list-name">{name}</div>
                    <div className="mobile-tool-list-desc">{description}</div>
                </div>
                <AppIcon name="ChevronRight" className="mobile-tool-list-arrow" size={16} />
            </a>
        </motion.div>
    )
}

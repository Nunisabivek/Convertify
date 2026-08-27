'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AppIcon } from '@/components/mobile/AppIcon'
import MobileSearch from '@/components/mobile/MobileSearch'
import {
    getAndroidV1Categories,
    searchAndroidV1Tools,
    shortToolName,
} from '@/lib/mobile-tools'

export default function MobileToolsDashboard() {
    const [query, setQuery] = useState('')
    const categories = getAndroidV1Categories()
    const results = useMemo(() => searchAndroidV1Tools(query), [query])
    const searching = query.trim().length > 0

    return (
        <div className="mobile-tools-dashboard">
            <MobileSearch onSearch={setQuery} placeholder="Try “20kb” or “passport”" />

            {searching ? (
                <div className="mobile-tool-list">
                    {results.length === 0 ? (
                        <p className="mobile-empty-line">No tools match that. Try “merge” or “jpg”.</p>
                    ) : (
                        results.map((tool) => (
                            <ToolRow key={tool.id} id={tool.id} href={tool.href} lucide={tool.icon.lucide} name={shortToolName(tool)} description={tool.description} color={tool.color.hex} />
                        ))
                    )}
                </div>
            ) : (
                categories.map((category) => (
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
                                    lucide={tool.icon.lucide}
                                    name={shortToolName(tool)}
                                    description={tool.description}
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
    href,
    lucide,
    name,
    description,
    color,
}: {
    id: string
    href: string
    lucide: string
    name: string
    description: string
    color: string
}) {
    return (
        <motion.div whileTap={{ scale: 0.98 }}>
            <Link
                href={`/${href}`}
                className="mobile-tool-list-item"
                style={{ '--tool-color': color } as React.CSSProperties}
            >
                <div className="mobile-tool-list-icon">
                    <AppIcon name={lucide} size={22} />
                </div>
                <div className="mobile-tool-list-content">
                    <div className="mobile-tool-list-name">{name}</div>
                    <div className="mobile-tool-list-desc">{description}</div>
                </div>
                <AppIcon name="ChevronRight" className="mobile-tool-list-arrow" size={18} />
            </Link>
        </motion.div>
    )
}

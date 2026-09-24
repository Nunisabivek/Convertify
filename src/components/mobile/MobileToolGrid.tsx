'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ToolGlyph } from '@/components/mobile/ToolGlyph'
import { getAndroidQuickTools, shortToolName, ANDROID_QUICK_HINTS } from '@/lib/mobile-tools'
import { tapHaptic } from '@/lib/haptics'
import { useToolSheet } from '@/components/mobile/ToolSheetContext'

export default function MobileToolGrid() {
    const tools = getAndroidQuickTools()
    const reduceMotion = useReducedMotion()
    const { openTool } = useToolSheet()

    return (
        <div className="mobile-section">
            <div className="mobile-section-header">
                <h2 className="mobile-section-title">Quick Tools</h2>
                <Link
                    href="/all-tools"
                    className="mobile-section-action"
                    onClick={() => {
                        void tapHaptic()
                    }}
                >
                    See All
                </Link>
            </div>

            <div className="mobile-tool-grid">
                {tools.map((tool) => (
                    <motion.div
                        key={tool.id}
                        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                        <a
                            href={`/${tool.href}`}
                            className="mobile-tool-card"
                            onClick={(e) => {
                                e.preventDefault()
                                openTool(tool.id)
                            }}
                        >
                            <div className="mobile-tool-icon">
                                <ToolGlyph toolId={tool.id} size={30} />
                            </div>
                            <span className="mobile-tool-name">{shortToolName(tool)}</span>
                            <span className="mobile-tool-hint">{ANDROID_QUICK_HINTS[tool.id] ?? shortToolName(tool)}</span>
                        </a>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

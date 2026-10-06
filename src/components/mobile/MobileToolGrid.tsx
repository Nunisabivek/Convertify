'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ToolGlyph } from '@/components/mobile/ToolGlyph'
import { getAndroidQuickTools, shortToolName, ANDROID_QUICK_HINTS } from '@/lib/mobile-tools'
import { toolAccent } from '@/lib/tool-accent'
import { tapHaptic } from '@/lib/haptics'
import { useToolSheet } from '@/components/mobile/ToolSheetContext'
import { preloadTool, preloadToolsWhenIdle } from '@/components/mobile/tool-loaders'

export default function MobileToolGrid() {
    const tools = getAndroidQuickTools()
    const { openTool } = useToolSheet()

    // Warm the tool chunks in the background once Home is on screen, so the
    // first tap never waits on JS being downloaded and evaluated.
    useEffect(() => {
        preloadToolsWhenIdle(tools.map((t) => t.id))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                {tools.map((tool, index) => (
                    <a
                        key={tool.id}
                        href={`/${tool.href}`}
                        className={`mobile-tool-card accent-${toolAccent(tool.id)}`}
                        style={{ ['--i' as string]: index }}
                        onPointerDown={() => preloadTool(tool.id)}
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
                ))}
            </div>
        </div>
    )
}

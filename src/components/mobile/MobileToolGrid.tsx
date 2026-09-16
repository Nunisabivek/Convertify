'use client'

import Link from 'next/link'
import { ToolGlyph } from '@/components/mobile/ToolGlyph'
import { getAndroidQuickTools, shortToolName, ANDROID_QUICK_HINTS } from '@/lib/mobile-tools'
import { tapHaptic } from '@/lib/haptics'

export default function MobileToolGrid() {
    const tools = getAndroidQuickTools()

    return (
        <div className="mobile-section">
            <div className="mobile-section-header">
                <h2 className="mobile-section-title">Quick tools</h2>
                <Link href="/all-tools" className="mobile-section-action">
                    All tools
                </Link>
            </div>

            <div className="mobile-tool-grid">
                {tools.map((tool) => (
                    <Link
                        key={tool.id}
                        href={`/${tool.href}`}
                        className="mobile-tool-card"
                        onClick={() => {
                            void tapHaptic()
                        }}
                    >
                        <div className="mobile-tool-icon">
                            <ToolGlyph toolId={tool.id} size={32} />
                        </div>
                        <span className="mobile-tool-name">{shortToolName(tool)}</span>
                        <span className="mobile-tool-hint">{ANDROID_QUICK_HINTS[tool.id] ?? shortToolName(tool)}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

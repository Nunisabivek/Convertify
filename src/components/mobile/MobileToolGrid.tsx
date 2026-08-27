'use client'

import Link from 'next/link'
import { AppIcon } from '@/components/mobile/AppIcon'
import { getAndroidQuickTools, shortToolName } from '@/lib/mobile-tools'
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
                            <AppIcon name={tool.icon.lucide} size={26} />
                        </div>
                        <span className="mobile-tool-name">{shortToolName(tool)}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
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
                    <motion.div key={tool.id} whileTap={{ scale: 0.97 }} transition={{ duration: 0.08 }}>
                        <Link
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
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

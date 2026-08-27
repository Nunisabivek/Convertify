'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { AppIcon } from '@/components/mobile/AppIcon'
import { getAndroidQuickTools, shortToolName } from '@/lib/mobile-tools'

export default function MobileToolGrid() {
    const tools = getAndroidQuickTools()

    const handlePress = async () => {
        try {
            const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
            const { Capacitor } = await import('@capacitor/core')
            if (Capacitor.isNativePlatform()) {
                await Haptics.impact({ style: ImpactStyle.Light })
            }
        } catch {
            // optional
        }
    }

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
                    <motion.div key={tool.id} whileTap={{ scale: 0.96 }}>
                        <Link
                            href={`/${tool.href}`}
                            className="mobile-tool-card"
                            onClick={handlePress}
                            style={{ '--tool-color': tool.color.hex } as React.CSSProperties}
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

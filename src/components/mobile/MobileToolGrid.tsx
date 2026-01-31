'use client';

import Link from 'next/link';
import { TOOL_CATEGORIES, Tool } from '@/lib/tools-registry';

interface MobileToolGridProps {
    maxTools?: number;
    showTitle?: boolean;
}

// Get top priority tools for the home screen grid
function getTopTools(count: number = 6): Tool[] {
    const allTools = TOOL_CATEGORIES
        .flatMap(category => category.tools)
        .filter(tool => tool.status === 'active')
        .sort((a, b) => b.priority - a.priority);

    return allTools.slice(0, count);
}

export default function MobileToolGrid({ maxTools = 6, showTitle = true }: MobileToolGridProps) {
    const tools = getTopTools(maxTools);

    const handleToolClick = async () => {
        // Try to trigger haptic feedback if available
        try {
            const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
            const { Capacitor } = await import('@capacitor/core');

            if (Capacitor.isNativePlatform()) {
                await Haptics.impact({ style: ImpactStyle.Light });
            }
        } catch {
            // Haptics not available, that's okay
        }
    };

    return (
        <div className="mobile-section">
            {showTitle && (
                <div className="mobile-section-header">
                    <h2 className="mobile-section-title">Quick Tools</h2>
                    <Link href="/all-tools" className="mobile-section-action">
                        See all
                    </Link>
                </div>
            )}

            <div className="mobile-tool-grid">
                {tools.map((tool) => (
                    <Link
                        key={tool.id}
                        href={`/${tool.href}`}
                        className="mobile-tool-card"
                        onClick={handleToolClick}
                        style={{ '--tool-color': tool.color.hex } as React.CSSProperties}
                    >
                        <div className="mobile-tool-icon">
                            <span className="material-icons">{tool.icon.material}</span>
                        </div>
                        <span className="mobile-tool-name">{tool.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

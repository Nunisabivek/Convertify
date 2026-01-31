/**
 * TOOLS GRID COMPONENT
 * ====================
 * 
 * This component renders the tools grid using the centralized registry.
 * It works on both web and mobile (Capacitor) platforms.
 * 
 * Usage:
 *   import { ToolsGrid } from '@/components/tools/tools-grid';
 *   <ToolsGrid />
 * 
 * Features:
 * - Automatically syncs with tools-registry.ts
 * - Responsive grid layout
 * - Haptic feedback on mobile
 * - Search/filter support
 * - Category grouping
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    TOOL_CATEGORIES,
    getAllTools,
    searchTools,
    getActiveToolCount,
    type Tool,
    type ToolCategory
} from '@/lib/tools-registry';

// Lucide icons mapping - add all icons used in tools-registry
import {
    FileStack,
    Scissors,
    Minimize2,
    RotateCw,
    Trash2,
    ArrowUpDown,
    ScanLine,
    FileText,
    Image,
    Sheet,
    Presentation,
    Code,
    FilePenLine,
    PenLine,
    Droplet,
    Lock,
    Unlock,
    Hash,
    FileMinus2,
    FileSearch,
    FileCheck,
    type LucideIcon,
} from 'lucide-react';

// Icon name to component mapping
const ICON_MAP: Record<string, LucideIcon> = {
    FileStack,
    Scissors,
    Minimize2,
    RotateCw,
    Trash2,
    ArrowUpDown,
    ScanLine,
    FileText,
    Image,
    Sheet,
    Presentation,
    Code,
    FilePenLine,
    Signature: PenLine, // Alias
    Droplet,
    Lock,
    Unlock,
    Hash,
    FileMinus2,
    FileSearch,
    FileCheck,
};

// Check if running in Capacitor (mobile)
const isNativePlatform = () => {
    if (typeof window === 'undefined') return false;
    return !!(window as any).Capacitor?.isNativePlatform?.();
};

// Haptic feedback for mobile
const triggerHaptic = async () => {
    if (!isNativePlatform()) return;
    try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
        // Haptics not available
    }
};

interface ToolCardProps {
    tool: Tool;
}

function ToolCard({ tool }: ToolCardProps) {
    const IconComponent = ICON_MAP[tool.icon.lucide] || FileText;

    return (
        <Link
            href={`/${tool.href}`}
            onClick={triggerHaptic}
            className={`
        group relative flex flex-col items-center justify-center
        p-4 rounded-xl border border-gray-200 dark:border-gray-700
        hover:shadow-lg hover:scale-[1.02] transition-all duration-200
        ${tool.color.bg} dark:bg-opacity-20
        min-h-[120px]
      `}
        >
            {/* Status badges */}
            {tool.status === 'new' && (
                <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium bg-green-500 text-white rounded-full">
                    NEW
                </span>
            )}
            {tool.status === 'beta' && (
                <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium bg-yellow-500 text-white rounded-full">
                    BETA
                </span>
            )}
            {tool.premium && (
                <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-medium bg-purple-500 text-white rounded-full">
                    PRO
                </span>
            )}

            {/* Icon */}
            <div className={`p-3 rounded-full ${tool.color.bg} ${tool.color.text} mb-2`}>
                <IconComponent className="w-6 h-6" />
            </div>

            {/* Title */}
            <h3 className="text-sm font-medium text-gray-900 dark:text-white text-center">
                {tool.name}
            </h3>

            {/* Description - shown on hover (desktop) or always (mobile) */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity md:block hidden">
                {tool.description}
            </p>
        </Link>
    );
}

interface ToolsGridProps {
    /** Show only specific categories */
    categories?: string[];
    /** Show search bar */
    showSearch?: boolean;
    /** Maximum number of tools to show */
    limit?: number;
    /** Show category headers */
    showCategories?: boolean;
    /** Grid columns - tailwind classes */
    gridCols?: string;
}

export function ToolsGrid({
    categories,
    showSearch = false,
    limit,
    showCategories = true,
    gridCols = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
}: ToolsGridProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter categories if specified
    const displayCategories = useMemo(() => {
        if (categories) {
            return TOOL_CATEGORIES.filter(c => categories.includes(c.id));
        }
        return TOOL_CATEGORIES;
    }, [categories]);

    // Apply search filter
    const filteredTools = useMemo(() => {
        if (searchQuery.trim()) {
            return searchTools(searchQuery);
        }
        return null; // null means show by category
    }, [searchQuery]);

    // Apply limit if specified
    const limitedTools = useMemo(() => {
        if (filteredTools && limit) {
            return filteredTools.slice(0, limit);
        }
        return filteredTools;
    }, [filteredTools, limit]);

    return (
        <div className="tools-grid-container">
            {/* Search Bar */}
            {showSearch && (
                <div className="mb-6">
                    <div className="relative max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Search tools..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="
                w-full px-4 py-3 pl-10
                border border-gray-300 dark:border-gray-600
                rounded-lg bg-white dark:bg-gray-800
                text-gray-900 dark:text-white
                focus:ring-2 focus:ring-purple-500 focus:border-transparent
                transition-all
              "
                        />
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {getActiveToolCount()} free tools available
                    </p>
                </div>
            )}

            {/* Search Results */}
            {limitedTools && (
                <div className={`grid ${gridCols} gap-4`}>
                    {limitedTools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))}
                    {limitedTools.length === 0 && (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            No tools found for "{searchQuery}"
                        </div>
                    )}
                </div>
            )}

            {/* Category View */}
            {!limitedTools && (
                <div className="space-y-8">
                    {displayCategories.map((category) => (
                        <div key={category.id}>
                            {showCategories && (
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="material-icons text-purple-500 hidden md:inline">
                                        {category.icon}
                                    </span>
                                    {category.name}
                                    <span className="text-sm font-normal text-gray-400">
                                        ({category.tools.filter(t => t.status === 'active').length} tools)
                                    </span>
                                </h2>
                            )}
                            <div className={`grid ${gridCols} gap-4`}>
                                {category.tools
                                    .filter((t) => t.status === 'active')
                                    .slice(0, limit)
                                    .map((tool) => (
                                        <ToolCard key={tool.id} tool={tool} />
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * Mobile-optimized tools grid
 * Uses larger touch targets and bottom sheet navigation
 */
export function MobileToolsGrid() {
    return (
        <ToolsGrid
            showSearch={true}
            showCategories={true}
            gridCols="grid-cols-3 gap-3"
        />
    );
}

/**
 * Quick access grid for homepage
 * Shows top 8 most popular tools
 */
export function QuickToolsGrid() {
    const topTools = useMemo(() => {
        return getAllTools()
            .filter(t => t.status === 'active')
            .slice(0, 8);
    }, []);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {topTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
            ))}
        </div>
    );
}

export default ToolsGrid;

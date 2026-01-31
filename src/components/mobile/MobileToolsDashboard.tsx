'use client';

import Link from 'next/link';
import { TOOL_CATEGORIES, ToolCategory } from '@/lib/tools-registry';

// Material icons mapping for categories
const categoryIcons: Record<string, string> = {
    'organize': 'folder_special',
    'convert-from-pdf': 'transform',
    'convert-to-pdf': 'picture_as_pdf',
    'edit-pdf': 'edit',
    'advanced': 'auto_awesome',
};

export default function MobileToolsDashboard() {
    return (
        <div className="mobile-tools-dashboard">
            {TOOL_CATEGORIES.map((category: ToolCategory) => (
                <div key={category.id} className="mobile-category">
                    <div className="mobile-category-header">
                        <div className="mobile-category-icon">
                            <span className="material-icons">
                                {categoryIcons[category.id] || category.icon}
                            </span>
                        </div>
                        <span className="mobile-category-name">{category.name}</span>
                    </div>

                    <div className="mobile-tool-list">
                        {category.tools
                            .filter(tool => tool.status === 'active')
                            .sort((a, b) => b.priority - a.priority)
                            .map((tool) => (
                                <Link
                                    key={tool.id}
                                    href={`/${tool.href}`}
                                    className="mobile-tool-list-item"
                                    style={{ '--tool-color': tool.color.hex } as React.CSSProperties}
                                >
                                    <div className="mobile-tool-list-icon">
                                        <span className="material-icons">{tool.icon.material}</span>
                                    </div>
                                    <div className="mobile-tool-list-content">
                                        <div className="mobile-tool-list-name">{tool.name}</div>
                                        <div className="mobile-tool-list-desc">{tool.description}</div>
                                    </div>
                                    <span className="material-icons mobile-tool-list-arrow">
                                        chevron_right
                                    </span>
                                </Link>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

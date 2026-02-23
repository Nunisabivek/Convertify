/**
 * CONVERTIFY TOOLS REGISTRY
 * ========================
 * 
 * 🎯 SINGLE SOURCE OF TRUTH for all PDF tools
 * 
 * This file is the centralized registry for all tools in Convertify.
 * Both the website AND the mobile app read from this file.
 * 
 * ✅ ADD A NEW TOOL HERE and it will automatically appear in:
 *    - Website homepage
 *    - /all-tools page
 *    - Mobile app home screen
 *    - Mobile app tool grid
 *    - Sitemap
 *    - Navigation
 * 
 * HOW TO ADD A NEW TOOL:
 * 1. Add the tool to the appropriate category in TOOL_CATEGORIES
 * 2. Add SEO data in src/lib/seo-data.ts
 * 3. Create the tool page in src/app/[tool-name]/page.tsx
 * 4. Run `npm run build` - the tool syncs to mobile automatically!
 */

// =============================================================================
// TYPES
// =============================================================================

export type ToolStatus = 'active' | 'coming-soon' | 'beta' | 'new';

export interface Tool {
    /** Unique identifier, matches the URL path (e.g., 'merge-pdf') */
    id: string;

    /** Display name (e.g., 'Merge PDF') */
    name: string;

    /** Short description for cards and listings */
    description: string;

    /** Icon name - use Lucide icon names for web, Material icons for mobile */
    icon: {
        lucide: string;      // e.g., 'FileStack' for web
        material: string;    // e.g., 'merge_type' for mobile
    };

    /** URL path without leading slash */
    href: string;

    /** Color scheme for the tool card */
    color: {
        text: string;        // Tailwind text color class
        bg: string;          // Tailwind bg color class
        hex: string;         // Hex color for mobile
    };

    /** Tool status */
    status: ToolStatus;

    /** Keywords for search functionality */
    keywords: string[];

    /** Is this tool available offline in mobile app? */
    offlineSupported: boolean;

    /** Is this a premium-only feature? */
    premium: boolean;

    /** Priority for sorting (higher = shown first) */
    priority: number;
}

export interface ToolCategory {
    /** Category identifier */
    id: string;

    /** Display name */
    name: string;

    /** Material icon name for mobile */
    icon: string;

    /** Tools in this category */
    tools: Tool[];
}

// =============================================================================
// TOOL DEFINITIONS
// =============================================================================

export const TOOL_CATEGORIES: ToolCategory[] = [
    {
        id: 'organize',
        name: 'Organize PDF',
        icon: 'folder_special',
        tools: [
            {
                id: 'merge-pdf',
                name: 'Merge PDF',
                description: 'Combine multiple PDFs into one unified document.',
                icon: { lucide: 'FileStack', material: 'merge_type' },
                href: 'merge-pdf',
                color: { text: 'text-red-600', bg: 'bg-red-50', hex: '#DC2626' },
                status: 'active',
                keywords: ['merge', 'combine', 'join', 'concatenate'],
                offlineSupported: true,
                premium: false,
                priority: 100,
            },
            {
                id: 'split-pdf',
                name: 'Split PDF',
                description: 'Extract pages from your PDF into separate files.',
                icon: { lucide: 'Scissors', material: 'call_split' },
                href: 'split-pdf',
                color: { text: 'text-orange-600', bg: 'bg-orange-50', hex: '#EA580C' },
                status: 'active',
                keywords: ['split', 'extract', 'separate', 'pages'],
                offlineSupported: true,
                premium: false,
                priority: 95,
            },
            {
                id: 'compress-pdf',
                name: 'Compress PDF',
                description: 'Reduce file size while maintaining quality.',
                icon: { lucide: 'Minimize2', material: 'compress' },
                href: 'compress-pdf',
                color: { text: 'text-green-600', bg: 'bg-green-50', hex: '#16A34A' },
                status: 'active',
                keywords: ['compress', 'reduce', 'shrink', 'optimize', 'size'],
                offlineSupported: true,
                premium: false,
                priority: 90,
            },
            {
                id: 'rotate-pdf',
                name: 'Rotate PDF',
                description: 'Rotate pages in any direction.',
                icon: { lucide: 'RotateCw', material: 'rotate_right' },
                href: 'rotate-pdf',
                color: { text: 'text-pink-600', bg: 'bg-pink-50', hex: '#DB2777' },
                status: 'active',
                keywords: ['rotate', 'turn', 'orientation', 'landscape', 'portrait'],
                offlineSupported: true,
                premium: false,
                priority: 80,
            },
            {
                id: 'delete-pdf-pages',
                name: 'Delete Pages',
                description: 'Remove unwanted pages from PDF.',
                icon: { lucide: 'Trash2', material: 'delete' },
                href: 'delete-pdf-pages',
                color: { text: 'text-stone-600', bg: 'bg-stone-50', hex: '#57534E' },
                status: 'active',
                keywords: ['delete', 'remove', 'pages'],
                offlineSupported: true,
                premium: false,
                priority: 75,
            },
            {
                id: 'reorder-pdf',
                name: 'Reorder Pages',
                description: 'Rearrange page order in your PDF.',
                icon: { lucide: 'ArrowUpDown', material: 'swap_vert' },
                href: 'reorder-pdf',
                color: { text: 'text-amber-600', bg: 'bg-amber-50', hex: '#D97706' },
                status: 'active',
                keywords: ['reorder', 'rearrange', 'sort', 'pages'],
                offlineSupported: true,
                premium: false,
                priority: 70,
            },
            {
                id: 'ocr-pdf',
                name: 'OCR PDF',
                description: 'Extract text from scanned PDFs.',
                icon: { lucide: 'ScanLine', material: 'document_scanner' },
                href: 'ocr-pdf',
                color: { text: 'text-teal-600', bg: 'bg-teal-50', hex: '#0D9488' },
                status: 'active',
                keywords: ['ocr', 'scan', 'text recognition', 'extract text'],
                offlineSupported: false,
                premium: false,
                priority: 65,
            },
        ],
    },
    {
        id: 'convert-from-pdf',
        name: 'Convert from PDF',
        icon: 'transform',
        tools: [
            {
                id: 'pdf-to-word',
                name: 'PDF to Word',
                description: 'Convert PDF to editable DOCX documents.',
                icon: { lucide: 'FileText', material: 'description' },
                href: 'pdf-to-word',
                color: { text: 'text-blue-600', bg: 'bg-blue-50', hex: '#2563EB' },
                status: 'active',
                keywords: ['word', 'docx', 'document', 'editable'],
                offlineSupported: true,
                premium: false,
                priority: 85,
            },
            {
                id: 'pdf-to-jpg',
                name: 'PDF to JPG',
                description: 'Convert PDF pages to JPG images.',
                icon: { lucide: 'Image', material: 'image' },
                href: 'pdf-to-jpg',
                color: { text: 'text-purple-600', bg: 'bg-purple-50', hex: '#9333EA' },
                status: 'active',
                keywords: ['jpg', 'jpeg', 'image', 'picture', 'photo'],
                offlineSupported: true,
                premium: false,
                priority: 80,
            },
            {
                id: 'pdf-to-png',
                name: 'PDF to PNG',
                description: 'Convert PDF pages to PNG images.',
                icon: { lucide: 'Image', material: 'image' },
                href: 'pdf-to-png',
                color: { text: 'text-fuchsia-600', bg: 'bg-fuchsia-50', hex: '#C026D3' },
                status: 'active',
                keywords: ['png', 'image', 'transparent'],
                offlineSupported: true,
                premium: false,
                priority: 75,
            },
            {
                id: 'pdf-to-excel',
                name: 'PDF to Excel',
                description: 'Convert PDF tables to Excel spreadsheets.',
                icon: { lucide: 'Sheet', material: 'table_chart' },
                href: 'pdf-to-excel',
                color: { text: 'text-green-600', bg: 'bg-green-50', hex: '#16A34A' },
                status: 'active',
                keywords: ['excel', 'xlsx', 'spreadsheet', 'table'],
                offlineSupported: true,
                premium: false,
                priority: 70,
            },
            {
                id: 'pdf-to-powerpoint',
                name: 'PDF to PowerPoint',
                description: 'Convert PDF to PowerPoint presentations.',
                icon: { lucide: 'Presentation', material: 'slideshow' },
                href: 'pdf-to-powerpoint',
                color: { text: 'text-orange-600', bg: 'bg-orange-50', hex: '#EA580C' },
                status: 'active',
                keywords: ['powerpoint', 'ppt', 'pptx', 'presentation', 'slides'],
                offlineSupported: true,
                premium: false,
                priority: 65,
            },
            {
                id: 'pdf-to-text',
                name: 'PDF to Text',
                description: 'Extract text content from PDF.',
                icon: { lucide: 'FileText', material: 'text_snippet' },
                href: 'pdf-to-text',
                color: { text: 'text-gray-600', bg: 'bg-gray-50', hex: '#4B5563' },
                status: 'active',
                keywords: ['text', 'txt', 'extract', 'copy'],
                offlineSupported: true,
                premium: false,
                priority: 60,
            },
        ],
    },
{
        id: 'convert-to-pdf',
        name: 'Convert to PDF',
        icon: 'picture_as_pdf',
        tools: [
            {
                id: 'word-to-pdf',
                name: 'Word to PDF',
                description: 'Convert DOCX to PDF.',
                icon: { lucide: 'FileText', material: 'description' },
                href: 'word-to-pdf',
                color: { text: 'text-indigo-600', bg: 'bg-indigo-50', hex: '#4F46E5' },
                status: 'active',
                keywords: ['word', 'docx', 'document', 'convert'],
                offlineSupported: true,
                premium: false,
                priority: 85,
            },
            {
                id: 'jpg-to-pdf',
                name: 'JPG to PDF',
                description: 'Create PDF from JPG images.',
                icon: { lucide: 'Image', material: 'add_photo_alternate' },
                href: 'jpg-to-pdf',
                color: { text: 'text-rose-600', bg: 'bg-rose-50', hex: '#E11D48' },
                status: 'active',
                keywords: ['jpg', 'jpeg', 'image', 'photo', 'picture'],
                offlineSupported: true,
                premium: false,
                priority: 80,
            },
            {
                id: 'png-to-pdf',
                name: 'PNG to PDF',
                description: 'Create PDF from PNG images.',
                icon: { lucide: 'Image', material: 'add_photo_alternate' },
                href: 'png-to-pdf',
                color: { text: 'text-violet-600', bg: 'bg-violet-50', hex: '#7C3AED' },
                status: 'active',
                keywords: ['png', 'image', 'transparent'],
                offlineSupported: true,
                premium: false,
                priority: 75,
            },
            {
                id: 'excel-to-pdf',
                name: 'Excel to PDF',
                description: 'Convert Excel spreadsheets to PDF.',
                icon: { lucide: 'Sheet', material: 'table_chart' },
                href: 'excel-to-pdf',
                color: { text: 'text-emerald-600', bg: 'bg-emerald-50', hex: '#059669' },
                status: 'active',
                keywords: ['excel', 'xlsx', 'spreadsheet'],
                offlineSupported: true,
                premium: false,
                priority: 70,
            },
            {
                id: 'powerpoint-to-pdf',
                name: 'PowerPoint to PDF',
                description: 'Convert PowerPoint to PDF.',
                icon: { lucide: 'Presentation', material: 'slideshow' },
                href: 'powerpoint-to-pdf',
                color: { text: 'text-amber-600', bg: 'bg-amber-50', hex: '#D97706' },
                status: 'active',
                keywords: ['powerpoint', 'ppt', 'pptx', 'presentation'],
                offlineSupported: true,
                premium: false,
                priority: 65,
            },
            {
                id: 'html-to-pdf',
                name: 'HTML to PDF',
                description: 'Convert web pages and HTML to PDF.',
                icon: { lucide: 'Code', material: 'code' },
                href: 'html-to-pdf',
                color: { text: 'text-rose-600', bg: 'bg-rose-50', hex: '#E11D48' },
                status: 'active',
                keywords: ['html', 'web', 'webpage', 'website'],
                offlineSupported: false,
                premium: false,
                priority: 60,
            },
        ],
    },
    {
        id: 'image-convert',
        name: 'Image Converter',
        icon: 'image',
        tools: [
            {
                id: 'jpg-to-png',
                name: 'JPG to PNG',
                description: 'Convert JPG images to PNG with transparency.',
                icon: { lucide: 'Image', material: 'image' },
                href: 'jpg-to-png',
                color: { text: 'text-purple-600', bg: 'bg-purple-50', hex: '#9333EA' },
                status: 'active',
                keywords: ['jpg', 'jpeg', 'png', 'convert', 'transparent'],
                offlineSupported: true,
                premium: false,
                priority: 90,
            },
            {
                id: 'png-to-jpg',
                name: 'PNG to JPG',
                description: 'Convert PNG images to JPG format.',
                icon: { lucide: 'Image', material: 'image' },
                href: 'png-to-jpg',
                color: { text: 'text-yellow-600', bg: 'bg-yellow-50', hex: '#CA8A04' },
                status: 'active',
                keywords: ['png', 'jpg', 'jpeg', 'convert', 'compress'],
                offlineSupported: true,
                premium: false,
                priority: 85,
            },
            {
                id: 'heic-to-jpg',
                name: 'HEIC to JPG',
                description: 'Convert iPhone HEIC photos to JPG.',
                icon: { lucide: 'Smartphone', material: 'smartphone' },
                href: 'heic-to-jpg',
                color: { text: 'text-blue-600', bg: 'bg-blue-50', hex: '#2563EB' },
                status: 'active',
                keywords: ['heic', 'jpg', 'iphone', 'photo', 'apple'],
                offlineSupported: false,
                premium: false,
                priority: 95,
            },
            {
                id: 'webp-converter',
                name: 'WebP Converter',
                description: 'Convert images to and from WebP format.',
                icon: { lucide: 'Globe', material: 'public' },
                href: 'webp-converter',
                color: { text: 'text-teal-600', bg: 'bg-teal-50', hex: '#0D9488' },
                status: 'active',
                keywords: ['webp', 'convert', 'compress', 'web'],
                offlineSupported: true,
                premium: false,
                priority: 80,
            },
            {
                id: 'image-compressor',
                name: 'Image Compressor',
                description: 'Compress images without losing quality.',
                icon: { lucide: 'Minimize2', material: 'compress' },
                href: 'image-compressor',
                color: { text: 'text-green-600', bg: 'bg-green-50', hex: '#16A34A' },
                status: 'active',
                keywords: ['compress', 'reduce', 'optimize', 'image', 'size'],
                offlineSupported: true,
                premium: false,
                priority: 88,
            },
            {
                id: 'resize-image',
                name: 'Resize Image',
                description: 'Resize images to any dimension.',
                icon: { lucide: 'Scaling', material: 'aspect_ratio' },
                href: 'resize-image',
                color: { text: 'text-orange-600', bg: 'bg-orange-50', hex: '#EA580C' },
                status: 'active',
                keywords: ['resize', 'dimension', 'scale', 'image'],
                offlineSupported: true,
                premium: false,
                priority: 75,
            },
        ],
    },
    {
        id: 'edit-pdf',
        name: 'Edit PDF',
        icon: 'edit',
        tools: [
            {
                id: 'edit-pdf',
                name: 'Edit PDF',
                description: 'Add text, images and annotations to PDF.',
                icon: { lucide: 'FilePenLine', material: 'edit_document' },
                href: 'edit-pdf',
                color: { text: 'text-purple-600', bg: 'bg-purple-50', hex: '#9333EA' },
                status: 'active',
                keywords: ['edit', 'modify', 'annotate', 'text'],
                offlineSupported: true,
                premium: false,
                priority: 85,
            },
            {
                id: 'sign-pdf',
                name: 'Sign PDF',
                description: 'Add your signature to PDF documents.',
                icon: { lucide: 'Signature', material: 'draw' },
                href: 'sign-pdf',
                color: { text: 'text-cyan-600', bg: 'bg-cyan-50', hex: '#0891B2' },
                status: 'active',
                keywords: ['sign', 'signature', 'esign', 'autograph'],
                offlineSupported: true,
                premium: false,
                priority: 80,
            },
            {
                id: 'watermark-pdf',
                name: 'Watermark PDF',
                description: 'Add text or image watermarks to PDF.',
                icon: { lucide: 'Droplet', material: 'water_drop' },
                href: 'watermark-pdf',
                color: { text: 'text-blue-600', bg: 'bg-blue-50', hex: '#2563EB' },
                status: 'active',
                keywords: ['watermark', 'stamp', 'brand', 'logo'],
                offlineSupported: true,
                premium: false,
                priority: 75,
            },
            {
                id: 'protect-pdf',
                name: 'Protect PDF',
                description: 'Add password protection to PDF.',
                icon: { lucide: 'Lock', material: 'lock' },
                href: 'protect-pdf',
                color: { text: 'text-slate-600', bg: 'bg-slate-50', hex: '#475569' },
                status: 'active',
                keywords: ['protect', 'password', 'secure', 'encrypt'],
                offlineSupported: true,
                premium: false,
                priority: 70,
            },
            {
                id: 'unlock-pdf',
                name: 'Unlock PDF',
                description: 'Remove password from PDF files.',
                icon: { lucide: 'Unlock', material: 'lock_open' },
                href: 'unlock-pdf',
                color: { text: 'text-lime-600', bg: 'bg-lime-50', hex: '#65A30D' },
                status: 'active',
                keywords: ['unlock', 'remove password', 'decrypt'],
                offlineSupported: true,
                premium: false,
                priority: 65,
            },
            {
                id: 'add-page-numbers',
                name: 'Page Numbers',
                description: 'Add page numbers to PDF.',
                icon: { lucide: 'Hash', material: 'numbers' },
                href: 'add-page-numbers',
                color: { text: 'text-sky-600', bg: 'bg-sky-50', hex: '#0284C7' },
                status: 'active',
                keywords: ['page numbers', 'numbering', 'footer', 'header'],
                offlineSupported: true,
                premium: false,
                priority: 60,
            },
            {
                id: 'redact-pdf',
                name: 'Redact PDF',
                description: 'Remove sensitive information from PDF.',
                icon: { lucide: 'FileMinus2', material: 'remove_circle' },
                href: 'redact-pdf',
                color: { text: 'text-yellow-600', bg: 'bg-yellow-50', hex: '#CA8A04' },
                status: 'active',
                keywords: ['redact', 'censor', 'hide', 'remove', 'sensitive'],
                offlineSupported: true,
                premium: false,
                priority: 55,
            },
        ],
    },
    {
        id: 'advanced',
        name: 'Advanced Tools',
        icon: 'auto_awesome',
        tools: [
            {
                id: 'compare-pdf',
                name: 'Compare PDF',
                description: 'Find differences between two PDFs.',
                icon: { lucide: 'FileSearch', material: 'compare' },
                href: 'compare-pdf',
                color: { text: 'text-cyan-600', bg: 'bg-cyan-50', hex: '#0891B2' },
                status: 'active',
                keywords: ['compare', 'diff', 'difference', 'changes'],
                offlineSupported: true,
                premium: false,
                priority: 50,
            },
            {
                id: 'pdf-to-pdfa',
                name: 'PDF to PDF/A',
                description: 'Convert to archival PDF/A format.',
                icon: { lucide: 'FileCheck', material: 'verified' },
                href: 'pdf-to-pdfa',
                color: { text: 'text-emerald-600', bg: 'bg-emerald-50', hex: '#059669' },
                status: 'active',
                keywords: ['pdfa', 'archive', 'long-term', 'preservation'],
                offlineSupported: true,
                premium: false,
                priority: 45,
            },
        ],
    },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get all tools as a flat array (sorted by priority)
 */
export function getAllTools(): Tool[] {
    return TOOL_CATEGORIES
        .flatMap(category => category.tools)
        .sort((a, b) => b.priority - a.priority);
}

/**
 * Get all active tools (excluding coming-soon)
 */
export function getActiveTools(): Tool[] {
    return getAllTools().filter(tool => tool.status === 'active');
}

/**
 * Get tools by category ID
 */
export function getToolsByCategory(categoryId: string): Tool[] {
    const category = TOOL_CATEGORIES.find(c => c.id === categoryId);
    return category?.tools || [];
}

/**
 * Get a single tool by ID
 */
export function getToolById(toolId: string): Tool | undefined {
    return getAllTools().find(tool => tool.id === toolId);
}

/**
 * Get tools that support offline mode (for mobile caching)
 */
export function getOfflineTools(): Tool[] {
    return getActiveTools().filter(tool => tool.offlineSupported);
}

/**
 * Get premium-only tools
 */
export function getPremiumTools(): Tool[] {
    return getAllTools().filter(tool => tool.premium);
}

/**
 * Get free tools
 */
export function getFreeTools(): Tool[] {
    return getActiveTools().filter(tool => !tool.premium);
}

/**
 * Search tools by keyword
 */
export function searchTools(query: string): Tool[] {
    const lowerQuery = query.toLowerCase();
    return getActiveTools().filter(tool =>
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.keywords.some(k => k.toLowerCase().includes(lowerQuery))
    );
}

/**
 * Get total count of all tools
 */
export function getTotalToolCount(): number {
    return getAllTools().length;
}

/**
 * Get total count of active tools
 */
export function getActiveToolCount(): number {
    return getActiveTools().length;
}

/**
 * Get all category names
 */
export function getCategoryNames(): string[] {
    return TOOL_CATEGORIES.map(c => c.name);
}

/**
 * Export format for mobile app manifest
 * This is used when building the Capacitor app
 */
export function getToolsForMobile(): {
    categories: Array<{
        id: string;
        name: string;
        icon: string;
        tools: Array<{
            id: string;
            name: string;
            description: string;
            icon: string;
            href: string;
            color: string;
            offline: boolean;
            premium: boolean;
        }>;
    }>;
    totalCount: number;
    version: string;
} {
    return {
        categories: TOOL_CATEGORIES.map(category => ({
            id: category.id,
            name: category.name,
            icon: category.icon,
            tools: category.tools
                .filter(t => t.status === 'active')
                .sort((a, b) => b.priority - a.priority)
                .map(tool => ({
                    id: tool.id,
                    name: tool.name,
                    description: tool.description,
                    icon: tool.icon.material,
                    href: tool.href,
                    color: tool.color.hex,
                    offline: tool.offlineSupported,
                    premium: tool.premium,
                })),
        })),
        totalCount: getActiveToolCount(),
        version: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };
}

// Types are already exported above with their definitions

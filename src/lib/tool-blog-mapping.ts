// Mapping of tool pages to their related blog post slugs
// This helps with internal linking and SEO

export const toolToBlogMapping: Record<string, string[]> = {
    'merge-pdf': [
        'merge-pdf-windows-10-without-software',
        'merge-pdf-without-adobe-acrobat',
        'merge-pdf-android-phone-free',
        'combine-scanned-documents-into-one-pdf',
    ],
    'compress-pdf': [
        'compress-pdf-for-whatsapp',
        'compress-pdf-for-whatsapp-sharing',
        'reduce-pdf-size-without-losing-quality',
        'compress-pdf-for-email-attachment',
    ],
    'split-pdf': [
        'split-pdf-into-separate-pages',
    ],
    'jpg-to-pdf': [
        'convert-iphone-photos-to-pdf',
    ],
    'png-to-pdf': [
        'convert-iphone-photos-to-pdf',
    ],
    'word-to-pdf': [
        'convert-word-to-pdf-keep-formatting',
    ],
    'pdf-to-jpg': [],
    'pdf-to-png': [],
    'text-to-pdf': [],
    'pdf-to-text': [],
    'excel-to-pdf': [],
    'powerpoint-to-pdf': [],
}

// Helper function to get blog posts for a specific tool
export function getBlogPostsForTool(toolSlug: string): string[] {
    return toolToBlogMapping[toolSlug] || []
}

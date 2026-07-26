// Mapping of tool pages to their related blog post slugs
// This helps with internal linking and SEO
//
// Every slug here must exist — either as an entry in blogPosts or as a
// hand-written src/app/blog/<slug>/page.tsx listed in staticBlogPosts.
// Slugs that match nothing are silently dropped at render time, so a typo
// here shows up as a missing internal link rather than an error.

export const toolToBlogMapping: Record<string, string[]> = {
    'merge-pdf': [
        'merge-pdf-windows-10-without-software',
        'merge-pdf-without-adobe-acrobat',
        'merge-pdf-android-phone-free',
        'combine-scanned-documents-into-one-pdf',
    ],
    'compress-pdf': [
        'compress-pdf-under-100kb-government-forms',
        'best-free-pdf-compressor-online',
        'reduce-pdf-size-without-losing-quality',
        'compress-pdf-for-email-attachment',
        'compress-pdf-for-whatsapp',
    ],
    'split-pdf': [
        'split-pdf-into-separate-pages',
        'split-pdf-extract-pages-free',
    ],
    'jpg-to-pdf': [
        'convert-iphone-photos-to-pdf',
        'convert-jpg-to-pdf-online',
        'scan-documents-iphone-to-pdf',
    ],
    'png-to-pdf': [
        'combine-multiple-png-to-pdf',
        'convert-iphone-photos-to-pdf',
    ],
    'word-to-pdf': [
        'convert-word-to-pdf-keep-formatting',
        'resume-guide-word-to-pdf',
    ],
    'pdf-to-word': [
        'how-to-convert-pdf-to-word-without-software',
        'how-to-make-scanned-pdf-searchable-ocr',
    ],
    'pdf-to-jpg': [
        'pdf-to-jpg-convert-pages-images',
    ],
    'pdf-to-png': [
        'pdf-to-jpg-convert-pages-images',
    ],
    'text-to-pdf': [
        'pdf-tips-for-students',
    ],
    'pdf-to-text': [
        'how-to-make-scanned-pdf-searchable-ocr',
    ],
    'excel-to-pdf': [
        'xls-to-pdf-converter-free',
        'pdf-tools-for-small-business',
    ],
    'all-tools': [
        'pdf-tools-for-small-business',
        'best-free-pdf-tools-2025',
        'free-pdf-tools-vs-adobe-acrobat',
    ],
}

// Helper function to get blog posts for a specific tool
export function getBlogPostsForTool(toolSlug: string): string[] {
    return toolToBlogMapping[toolSlug] || []
}

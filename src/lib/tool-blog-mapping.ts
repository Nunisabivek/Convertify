// Mapping of tool pages to their related blog post slugs
// This helps with internal linking and SEO
//
// Every slug here must exist — either as an entry in blogPosts, in
// longTailPosts, or as a hand-written src/app/blog/<slug>/page.tsx listed in
// staticBlogPosts. Slugs that match nothing are silently dropped at render
// time, so a typo shows up as a missing internal link rather than an error.

export const toolToBlogMapping: Record<string, string[]> = {
    'merge-pdf': [
        'merge-pdf-on-chromebook',
        'merge-pdf-what-gets-lost',
        'merge-pdf-windows-10-without-software',
        'merge-pdf-without-adobe-acrobat',
        'combine-scanned-documents-into-one-pdf',
    ],
    'compress-pdf': [
        'compress-pdf-to-500kb',
        'compress-pdf-under-100kb-government-forms',
        'compress-pdf-for-visa-application',
        'compress-pdf-for-email-attachment',
        'best-free-pdf-compressor-online',
        'reduce-pdf-size-without-losing-quality',
    ],
    'split-pdf': [
        'extract-one-page-from-pdf',
        'split-pdf-bank-statement-by-month',
        'split-pdf-into-separate-pages',
    ],
    'jpg-to-pdf': [
        'combine-receipts-into-one-pdf',
        'convert-iphone-photos-to-pdf',
        'scan-documents-iphone-to-pdf',
    ],
    'png-to-pdf': [
        'combine-multiple-png-to-pdf',
        'convert-screenshots-to-pdf',
        'png-to-pdf-without-white-borders',
    ],
    'word-to-pdf': [
        'convert-word-to-pdf-keep-formatting',
        'resume-guide-word-to-pdf',
    ],
    'pdf-to-word': [
        'how-to-convert-pdf-to-word-without-software',
        'copy-text-from-pdf-that-wont-let-you',
    ],
    'pdf-to-jpg': [
        'pdf-to-jpg-convert-pages-images',
    ],
    'pdf-to-png': [
        'pdf-to-png-for-presentation-slides',
        'pdf-to-jpg-convert-pages-images',
    ],
    'pdf-to-text': [
        'copy-text-from-pdf-that-wont-let-you',
        'how-to-make-scanned-pdf-searchable-ocr',
    ],
    'text-to-pdf': [
        'text-to-pdf-for-printing',
        'pdf-tips-for-students',
    ],
    'rotate-pdf': [
        'rotate-scanned-pdf-sideways',
    ],
    'organize-pdf': [
        'organize-pdf-reorder-delete-pages',
        'extract-one-page-from-pdf',
    ],
    'add-page-numbers': [
        'add-page-numbers-thesis-dissertation',
    ],
    'watermark-pdf': [
        'watermark-pdf-before-sending-draft',
    ],
    'excel-to-pdf': [
        'xls-to-pdf-converter-free',
        'pdf-tools-for-small-business',
    ],
    'passport-photo': [
        'passport-photo-size-us-india-uk',
        'resize-image-for-passport-photo',
    ],
    'remove-background': [
        'passport-photo-size-us-india-uk',
        'resize-image-for-passport-photo',
    ],
    'fit-to-size': [
        'compress-pdf-under-100kb-government-forms',
        'compress-pdf-for-visa-application',
        'passport-photo-size-us-india-uk',
    ],
    'image-compressor': [
        'compress-image-for-website-speed',
        'resize-image-for-passport-photo',
    ],
    'resize-image': [
        'resize-image-for-passport-photo',
        'compress-image-for-website-speed',
    ],
    'heic-to-jpg': [
        'heic-to-jpg-on-windows',
        'convert-iphone-photos-to-pdf',
    ],
    'webp-converter': [
        'webp-to-jpg-windows',
        'compress-image-for-website-speed',
    ],
    'svg-to-png': [
        'svg-to-png-for-social-media',
    ],
    'csv-to-json': [
        'csv-to-json-without-uploading',
        'json-to-csv-for-excel',
    ],
    'json-to-csv': [
        'json-to-csv-for-excel',
        'csv-to-json-without-uploading',
    ],
    'base64': [
        'base64-encode-image-for-email-css',
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

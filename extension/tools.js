// Convertify extension: shared data and helpers.
// Loaded by popup.html (<script>) and by background.js (importScripts).
//
// The tool list mirrors the indexable tool pages in src/app/sitemap.ts.
// Descriptions follow public/llms.txt and each tool's own page copy; keep
// them honest (e.g. there is no OCR anywhere on the site). Noindexed or
// unfinished pages (pdf-to-pdfa, powerpoint-to-pdf) are left out on purpose.

const SITE_URL = 'https://convertify.work';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.convertify.work';
const CHROME_STORE_REVIEWS_URL = 'https://chromewebstore.google.com/detail/bccnoegccgifcibpnmhaaehlpoaojpkb/reviews';

const RECENT_TOOLS_MAX = 4;

// Shown in the popup before anything has been opened, and in the right-click menu.
const POPULAR_TOOLS = ['merge-pdf', 'compress-pdf', 'pdf-to-word', 'jpg-to-pdf'];

const CATEGORIES = [
    { id: 'organize', label: 'Organize PDF' },
    { id: 'edit', label: 'Edit & secure PDF' },
    { id: 'from-pdf', label: 'Convert from PDF' },
    { id: 'to-pdf', label: 'Convert to PDF' },
    { id: 'image', label: 'Image tools' },
    { id: 'data', label: 'Data tools' },
];

// keywords: extra search words for one tool. Synonyms that apply to many
// tools (combine -> merge, docx -> word, ...) live in SYNONYMS in popup.js.
const TOOLS = [
    // Organize PDF
    { slug: 'merge-pdf', name: 'Merge PDF', cat: 'organize', desc: 'Combine PDFs into one file; drag to set the order', keywords: 'join combine' },
    { slug: 'split-pdf', name: 'Split PDF', cat: 'organize', desc: 'Extract pages or page ranges into new PDFs', keywords: 'separate extract' },
    { slug: 'compress-pdf', name: 'Compress PDF', cat: 'organize', desc: 'Shrink a PDF toward a target size in KB or MB', keywords: 'reduce smaller size kb mb' },
    { slug: 'organize-pdf', name: 'Organize PDF', cat: 'organize', desc: 'Reorder, rotate and delete pages in a visual grid', keywords: 'arrange rearrange' },
    { slug: 'rotate-pdf', name: 'Rotate PDF', cat: 'organize', desc: 'Turn pages 90°, 180° or 270° to fix sideways scans', keywords: 'turn flip landscape portrait' },
    { slug: 'delete-pdf-pages', name: 'Delete PDF Pages', cat: 'organize', desc: 'Remove the pages you don’t need', keywords: 'remove' },
    { slug: 'reorder-pdf', name: 'Reorder PDF Pages', cat: 'organize', desc: 'Change the order of pages in a PDF', keywords: 'rearrange arrange sort move' },
    { slug: 'crop-pdf', name: 'Crop PDF', cat: 'organize', desc: 'Trim page margins with a live preview', keywords: 'trim margin whitespace' },
    { slug: 'fit-to-size', name: 'Fit to Size', cat: 'organize', desc: 'Fit a PDF or photo between a minimum and maximum KB', keywords: 'compress reduce kb mb portal form upload jpg' },
    { slug: 'repair-pdf', name: 'Repair PDF', cat: 'organize', desc: 'Rebuild a damaged PDF and recover readable pages', keywords: 'fix corrupt broken recover' },

    // Edit & secure PDF
    { slug: 'edit-pdf', name: 'Edit PDF', cat: 'edit', desc: 'Type text, draw and highlight on PDF pages', keywords: 'annotate write' },
    { slug: 'sign-pdf', name: 'Sign PDF', cat: 'edit', desc: 'Draw, type or upload a signature and place it', keywords: 'signature esign' },
    { slug: 'add-page-numbers', name: 'Add Page Numbers', cat: 'edit', desc: 'Number pages in one of six positions', keywords: 'numbering paginate' },
    { slug: 'watermark-pdf', name: 'Watermark PDF', cat: 'edit', desc: 'Stamp diagonal text across every page', keywords: 'stamp' },
    { slug: 'redact-pdf', name: 'Redact PDF', cat: 'edit', desc: 'Black out text; redacted pages become images', keywords: 'blackout censor hide' },
    { slug: 'protect-pdf', name: 'Protect PDF', cat: 'edit', desc: 'Add a password with AES-256 encryption', keywords: 'lock encrypt secure' },
    { slug: 'unlock-pdf', name: 'Unlock PDF', cat: 'edit', desc: 'Remove restrictions, or a password you know', keywords: 'decrypt remove password' },
    { slug: 'compare-pdf', name: 'Compare PDF', cat: 'edit', desc: 'See two PDFs side by side with text changes listed', keywords: 'diff difference' },
    { slug: 'autocad-pdf-editor', name: 'AutoCAD PDF Editor', cat: 'edit', desc: 'Edit text in PDFs exported from AutoCAD', keywords: 'cad dwg shx drawing' },

    // Convert from PDF
    { slug: 'pdf-to-word', name: 'PDF to Word', cat: 'from-pdf', desc: 'Text into an editable .docx; layout isn’t kept', keywords: 'docx doc' },
    { slug: 'pdf-to-jpg', name: 'PDF to JPG', cat: 'from-pdf', desc: 'Each page as a JPG at 150, 220 or 300 DPI', keywords: 'jpeg image' },
    { slug: 'pdf-to-png', name: 'PDF to PNG', cat: 'from-pdf', desc: 'Each page as a lossless PNG at up to 300 DPI', keywords: 'image' },
    { slug: 'pdf-to-excel', name: 'PDF to Excel', cat: 'from-pdf', desc: 'Each text line becomes a row; needs selectable text', keywords: 'xlsx spreadsheet' },
    { slug: 'pdf-to-powerpoint', name: 'PDF to PowerPoint', cat: 'from-pdf', desc: 'Each page as a full-slide image in a .pptx', keywords: 'pptx ppt slides' },
    { slug: 'pdf-to-text', name: 'PDF to Text', cat: 'from-pdf', desc: 'Copy out the text layer (not from scanned images)', keywords: 'txt extract' },

    // Convert to PDF
    { slug: 'jpg-to-pdf', name: 'JPG to PDF', cat: 'to-pdf', desc: 'Combine JPG photos into one PDF', keywords: 'jpeg image photo' },
    { slug: 'png-to-pdf', name: 'PNG to PDF', cat: 'to-pdf', desc: 'Combine PNGs into one PDF at full resolution', keywords: 'image screenshot' },
    { slug: 'word-to-pdf', name: 'Word to PDF', cat: 'to-pdf', desc: 'A .docx’s text as a PDF; images and styling aren’t kept', keywords: 'docx doc' },
    { slug: 'excel-to-pdf', name: 'Excel to PDF', cat: 'to-pdf', desc: 'Cell values as text; no colours, borders or charts', keywords: 'xlsx xls spreadsheet' },
    { slug: 'ocr-pdf', name: 'Scan to PDF', cat: 'to-pdf', desc: 'Camera scanner: straightens pages into one PDF', keywords: 'scanner camera webcam document paper receipt' },
    { slug: 'html-to-pdf', name: 'HTML to PDF', cat: 'to-pdf', desc: 'Paste HTML source; its text becomes a PDF', keywords: 'code web' },
    { slug: 'text-to-pdf', name: 'Text to PDF', cat: 'to-pdf', desc: 'Turn a .txt file into a paginated A4 PDF', keywords: 'txt' },
    { slug: 'markdown-to-pdf', name: 'Markdown to PDF', cat: 'to-pdf', desc: 'Turn Markdown into a styled PDF', keywords: 'md' },
    { slug: 'tiff-to-pdf', name: 'TIFF to PDF', cat: 'to-pdf', desc: 'Single or multi-page TIFF scans into one PDF', keywords: 'tif image' },

    // Image tools
    { slug: 'image-compressor', name: 'Image Compressor', cat: 'image', desc: 'Re-save images as smaller JPGs at a quality you pick', keywords: 'compress reduce shrink photo kb jpeg png webp' },
    { slug: 'resize-image', name: 'Resize Image', cat: 'image', desc: 'Set a new width and height in pixels', keywords: 'dimensions scale pixels photo' },
    { slug: 'passport-photo', name: 'Passport Photo', cat: 'image', desc: 'Crop to US 2×2, India 630×810 or visa sizes', keywords: 'id visa 2x2 630x810 35x45 photo' },
    { slug: 'remove-background', name: 'Remove Background', cat: 'image', desc: 'Fill a plain backdrop with white or light blue', keywords: 'bg photo id passport' },
    { slug: 'heic-to-jpg', name: 'HEIC to JPG', cat: 'image', desc: 'Convert iPhone photos to JPG in a batch', keywords: 'heif jpeg iphone photo' },
    { slug: 'jpg-to-png', name: 'JPG to PNG', cat: 'image', desc: 'Convert JPGs to lossless PNGs; batches as a ZIP', keywords: 'jpeg image' },
    { slug: 'png-to-jpg', name: 'PNG to JPG', cat: 'image', desc: 'Convert PNGs to JPG; transparent areas turn white', keywords: 'jpeg image' },
    { slug: 'webp-converter', name: 'WebP Converter', cat: 'image', desc: 'Convert images to or from WebP', keywords: 'jpg png image' },
    { slug: 'bmp-to-jpg', name: 'BMP to JPG', cat: 'image', desc: 'Convert bitmaps to compressed JPGs', keywords: 'bitmap jpeg image' },
    { slug: 'gif-to-png', name: 'GIF to PNG', cat: 'image', desc: 'Convert a GIF or pull frames from an animation', keywords: 'animated image' },
    { slug: 'svg-to-png', name: 'SVG to PNG', cat: 'image', desc: 'Rasterize SVG to PNG at up to 8192 px', keywords: 'vector image' },

    // Data tools
    { slug: 'qr-code-generator', name: 'QR Code Generator', cat: 'data', desc: 'Make a QR code for a link or text; download as PNG', keywords: 'qr barcode url' },
    { slug: 'csv-to-json', name: 'CSV to JSON', cat: 'data', desc: 'The first row becomes the keys', keywords: 'spreadsheet' },
    { slug: 'json-to-csv', name: 'JSON to CSV', cat: 'data', desc: 'Turn a JSON array into CSV for Excel or Sheets', keywords: 'spreadsheet' },
    { slug: 'xml-to-json', name: 'XML to JSON', cat: 'data', desc: 'Keeps the element structure and attributes', keywords: '' },
    { slug: 'base64', name: 'Base64', cat: 'data', desc: 'Encode text or files to Base64; decode it to text', keywords: 'encode decode b64' },
];

const TOOLS_BY_SLUG = new Map(TOOLS.map(tool => [tool.slug, tool]));

/**
 * URL on convertify.work tagged for Google Analytics.
 * @param {string} path  tool slug or page path, '' for the home page
 * @param {'popup'|'context_menu'} medium
 */
function siteUrl(path, medium) {
    const url = new URL('/' + path, SITE_URL);
    url.searchParams.set('utm_source', 'chrome_extension');
    url.searchParams.set('utm_medium', medium);
    return url.href;
}

/** Count a tool open and move it to the front of the recent list. */
async function recordToolOpen(slug) {
    const { toolOpenCount, recentTools } = await chrome.storage.local.get(['toolOpenCount', 'recentTools']);
    const recent = (Array.isArray(recentTools) ? recentTools : []).filter(s => s !== slug);
    recent.unshift(slug);
    await chrome.storage.local.set({
        toolOpenCount: (Number(toolOpenCount) || 0) + 1,
        recentTools: recent.slice(0, RECENT_TOOLS_MAX),
    });
}

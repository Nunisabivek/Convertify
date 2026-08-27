// Per-tool benefit cards. Replaces the generic 4-card template that was
// duplicated across 50+ tool pages — that template was a strong "thin
// content" signal to Google and is one of the suspected reasons many
// tool pages remained "Crawled - currently not indexed".
//
// Each entry must produce 4 cards. The icon strings map to a small set
// of lucide icons in tool-seo-content.tsx.

export type BenefitIconKey = "zap" | "shield" | "globe" | "fileCheck";

export interface Benefit {
    icon: BenefitIconKey;
    title: string;
    description: string;
}

export const toolBenefits: Record<string, Benefit[]> = {
    "merge-pdf": [
        { icon: "zap", title: "Drag-Drop Reorder", description: "Set the exact page sequence before merging" },
        { icon: "shield", title: "No Server Upload", description: "Files merged in-browser via PDF-Lib" },
        { icon: "fileCheck", title: "Zero-Bloat Output", description: "Avoids font duplication that inflates merged PDFs" },
        { icon: "globe", title: "Mix PDF + Images", description: "Combine PDFs with JPG and PNG into one file" },
    ],
    "split-pdf": [
        { icon: "zap", title: "Range Extract", description: "Pull pages 1-5, 8, 10-12 in one click" },
        { icon: "shield", title: "Stays On Device", description: "Sensitive pages never touch a server" },
        { icon: "fileCheck", title: "Per-Page Export", description: "Save each page as its own PDF if needed" },
        { icon: "globe", title: "Works on Mobile", description: "Split PDFs from iPhone, iPad, or Android" },
    ],
    "compress-pdf": [
        { icon: "fileCheck", title: "Hit Exact Size", description: "Target 100KB, 200KB or any custom limit" },
        { icon: "shield", title: "Local Compression", description: "PDF.js renders pages without uploading" },
        { icon: "zap", title: "Multi-Pass Engine", description: "Auto-tunes quality + DPI to your target" },
        { icon: "globe", title: "Forms-Ready", description: "Built for visa portals and gov.uk uploads" },
    ],
    "pdf-to-jpg": [
        { icon: "zap", title: "One JPG Per Page", description: "Every PDF page is rendered as its own image" },
        { icon: "fileCheck", title: "ZIP for Many Pages", description: "Two or more pages download together as a ZIP" },
        { icon: "shield", title: "No Server Round-Trip", description: "Pages render locally to JPG in your browser" },
        { icon: "globe", title: "No Watermark", description: "Plain page images, no stamp, no sign-up" },
    ],
    "jpg-to-pdf": [
        { icon: "zap", title: "Drag to Reorder", description: "Arrange photos before turning into PDF" },
        { icon: "fileCheck", title: "Page Fits the Photo", description: "Each page is sized to that photo, not a forced A4 box" },
        { icon: "shield", title: "Camera-Roll Safe", description: "Photos never leave your phone or laptop" },
        { icon: "globe", title: "Phone & Desktop", description: "Same flow on iPhone, Android, Mac, PC" },
    ],
    "png-to-pdf": [
        { icon: "zap", title: "Original Resolution", description: "Each PNG is embedded at its own pixel size" },
        { icon: "fileCheck", title: "Transparent PNGs OK", description: "Handles alpha-channel images cleanly" },
        { icon: "shield", title: "Browser-Only", description: "PNGs never touch our servers" },
        { icon: "globe", title: "Multi-Image Merge", description: "Drop dozens at once into one PDF" },
    ],
    "pdf-to-png": [
        { icon: "zap", title: "Lossless PNG", description: "No JPG artifacts on text or line art" },
        { icon: "fileCheck", title: "Per-Page Export", description: "Each PDF page becomes one PNG file" },
        { icon: "shield", title: "Local Rendering", description: "PDF.js converts pages right in your browser" },
        { icon: "globe", title: "Auto-ZIP", description: "Bundles many PNGs into one download" },
    ],
    "word-to-pdf": [
        { icon: "fileCheck", title: "Text Extraction", description: "Pulls your document's text onto clean PDF pages" },
        { icon: "shield", title: "Confidential-Safe", description: "Convert documents privately, nothing uploaded" },
        { icon: "zap", title: "No MS Office Needed", description: "Works without installing Word" },
        { icon: "globe", title: "DOCX Format", description: "Supports the modern .docx format" },
    ],
    "pdf-to-word": [
        { icon: "fileCheck", title: "Editable Output", description: "Edit the extracted text in Word after conversion" },
        { icon: "shield", title: "Confidential-Safe", description: "Contracts and reports stay on your device" },
        { icon: "zap", title: "Real Text Extraction", description: "Pulls actual page text, not a placeholder" },
        { icon: "globe", title: "All Major OS", description: "Works the same on Windows, Mac, Linux" },
    ],
    "excel-to-pdf": [
        { icon: "fileCheck", title: "Pick a Sheet", description: "Choose one worksheet per PDF, with a 10-row preview" },
        { icon: "shield", title: "Numbers Stay Private", description: "Spreadsheets never uploaded to a server" },
        { icon: "zap", title: "XLS + XLSX", description: "Legacy and modern Excel formats supported" },
        { icon: "globe", title: "Values as a Table", description: "Cell values laid out on paginated pages — not a styled clone" },
    ],
    "pdf-to-text": [
        { icon: "zap", title: "Instant Extraction", description: "Pulls every text run from a PDF in seconds" },
        { icon: "fileCheck", title: "Preserves Order", description: "Reading order matches the original PDF" },
        { icon: "shield", title: "No OCR Upload", description: "Embedded text extracted locally" },
        { icon: "globe", title: "Copy or Download", description: "Save as .txt or copy directly to clipboard" },
    ],
    "text-to-pdf": [
        { icon: "zap", title: ".txt to PDF", description: "Turn plain notes into shareable PDFs" },
        { icon: "fileCheck", title: "Auto Page-Break", description: "Long content paginates cleanly" },
        { icon: "shield", title: "Notes Stay Local", description: "Drafts never leave your browser" },
        { icon: "globe", title: "Cross-Platform", description: "Same output on every OS" },
    ],
    "powerpoint-to-pdf": [
        { icon: "fileCheck", title: "Slide Fidelity", description: "Each slide becomes one PDF page" },
        { icon: "shield", title: "Pitch-Deck Safe", description: "Confidential decks stay on your machine" },
        { icon: "zap", title: "PPT + PPTX", description: "Old and new PowerPoint formats" },
        { icon: "globe", title: "Email-Friendly", description: "Compact PDFs that send through Gmail/Outlook" },
    ],
    "rotate-pdf": [
        { icon: "zap", title: "All or Per-Page", description: "Rotate every page or pick specific ones" },
        { icon: "fileCheck", title: "90° / 180° / 270°", description: "Fix any sideways scan in seconds" },
        { icon: "shield", title: "Local Rotation", description: "No server upload needed for fixes" },
        { icon: "globe", title: "Mobile-Friendly", description: "Rotate scans straight from your phone" },
    ],
    "protect-pdf": [
        { icon: "shield", title: "Coming Soon", description: "Real client-side PDF encryption is in development" },
        { icon: "fileCheck", title: "No Upload, Ever", description: "Will run entirely in your browser when live" },
        { icon: "zap", title: "In the Meantime", description: "Explore our other working PDF tools" },
        { icon: "globe", title: "Check Back Soon", description: "This tool isn't ready yet" },
    ],
    "unlock-pdf": [
        { icon: "shield", title: "Coming Soon", description: "Real client-side PDF unlocking is in development" },
        { icon: "fileCheck", title: "No Upload, Ever", description: "Will run entirely in your browser when live" },
        { icon: "zap", title: "In the Meantime", description: "Explore our other working PDF tools" },
        { icon: "globe", title: "Check Back Soon", description: "This tool isn't ready yet" },
    ],
    "watermark-pdf": [
        { icon: "fileCheck", title: "Text or Image", description: "Stamp custom text or upload your logo" },
        { icon: "zap", title: "Position Control", description: "Tile, center, header or footer placement" },
        { icon: "shield", title: "Drafts Stay Private", description: "Watermarking happens on your device" },
        { icon: "globe", title: "Opacity Slider", description: "From subtle to bold with a single drag" },
    ],
    "add-page-numbers": [
        { icon: "fileCheck", title: "Position Control", description: "Top, bottom, left, center, right" },
        { icon: "zap", title: "Custom Format", description: "1, 2, 3 or Page X of Y styles" },
        { icon: "shield", title: "Browser-Side", description: "Numbers stamped without uploading" },
        { icon: "globe", title: "Range Skip", description: "Skip cover pages or appendix pages" },
    ],
    "delete-pdf-pages": [
        { icon: "fileCheck", title: "Visual Picker", description: "Click thumbnails to remove pages" },
        { icon: "shield", title: "Stays On Device", description: "Sensitive pages deleted locally" },
        { icon: "zap", title: "Bulk Delete", description: "Select multiple pages in one go" },
        { icon: "globe", title: "Preview Before Save", description: "Confirm the cut before downloading" },
    ],
    "reorder-pdf": [
        { icon: "fileCheck", title: "Drag Thumbnails", description: "Visually rearrange pages by drag-drop" },
        { icon: "zap", title: "Live Preview", description: "See the new page order before saving" },
        { icon: "shield", title: "100% Local", description: "Reordering happens in your browser" },
        { icon: "globe", title: "Any PDF Size", description: "Handles long PDFs with hundreds of pages" },
    ],
    "organize-pdf": [
        { icon: "fileCheck", title: "Reorder + Rotate", description: "Fix layout and order in one step" },
        { icon: "zap", title: "Delete Pages", description: "Strip cover sheets or duplicates" },
        { icon: "shield", title: "Browser-Only", description: "All organization happens locally" },
        { icon: "globe", title: "Keeps Form Fields", description: "Preserves fillable form data" },
    ],
    "image-compressor": [
        { icon: "fileCheck", title: "Target Size in KB", description: "Hit exact size for upload portals" },
        { icon: "zap", title: "JPG / PNG / WebP", description: "Compresses every common image format" },
        { icon: "shield", title: "Photos Stay Local", description: "Originals never leave your device" },
        { icon: "globe", title: "Phone-Friendly", description: "Drag in shots from your camera roll" },
    ],
    "resize-image": [
        { icon: "fileCheck", title: "Pixel or Percent", description: "Resize by exact dimensions or ratio" },
        { icon: "zap", title: "Aspect Lock", description: "Optional ratio lock to avoid stretching" },
        { icon: "shield", title: "On-Device", description: "Resizing handled in your browser" },
        { icon: "globe", title: "Common Presets", description: "Profile, banner and thumbnail sizes" },
    ],
    "heic-to-jpg": [
        { icon: "zap", title: "iPhone-Native", description: "Decodes Apple HEIC photos in any browser" },
        { icon: "fileCheck", title: "Quality Slider", description: "Pick file size vs visual quality" },
        { icon: "shield", title: "Photos Stay Private", description: "Camera-roll images never uploaded" },
        { icon: "globe", title: "Batch Convert", description: "Drop many HEICs and grab a ZIP" },
    ],
    "png-to-jpg": [
        { icon: "zap", title: "Smart Background", description: "Adds white where PNG was transparent" },
        { icon: "fileCheck", title: "Quality Control", description: "Choose JPG quality for size vs sharpness" },
        { icon: "shield", title: "Local Convert", description: "Browser-only — no upload" },
        { icon: "globe", title: "Batch Mode", description: "Convert dozens at once into a ZIP" },
    ],
    "jpg-to-png": [
        { icon: "zap", title: "Lossless PNG", description: "No JPG block artifacts after conversion" },
        { icon: "fileCheck", title: "Transparency Ready", description: "PNG output ready for design layering" },
        { icon: "shield", title: "Local Process", description: "Photos never reach a server" },
        { icon: "globe", title: "Batch Convert", description: "Bulk JPG → PNG with ZIP download" },
    ],
    "webp-converter": [
        { icon: "zap", title: "WebP To/From", description: "Convert WebP to JPG/PNG and back" },
        { icon: "fileCheck", title: "Quality Slider", description: "Tune compression for the web" },
        { icon: "shield", title: "Browser-Only", description: "Files processed entirely in your browser" },
        { icon: "globe", title: "Designer-Friendly", description: "Ideal prep for web image pipelines" },
    ],
    "qr-code-generator": [
        { icon: "zap", title: "Instant QR", description: "Type a link or text — get a QR in seconds" },
        { icon: "fileCheck", title: "PNG / SVG Export", description: "Vector or raster, your call" },
        { icon: "shield", title: "Nothing Logged", description: "No server saves your QR contents" },
        { icon: "globe", title: "WiFi + Vcard", description: "Generate QRs for WiFi, contacts, and URLs" },
    ],
    "html-to-pdf": [
        { icon: "fileCheck", title: "Paste HTML", description: "Paste raw HTML source code directly" },
        { icon: "zap", title: "Text Layout", description: "Text content laid out on paginated pages" },
        { icon: "shield", title: "Stays On Device", description: "HTML processed locally — no upload" },
        { icon: "globe", title: "A4 Pages", description: "Automatic pagination, no manual sizing" },
    ],
    "markdown-to-pdf": [
        { icon: "fileCheck", title: "Headings + Lists", description: "Markdown rendered as styled PDF" },
        { icon: "zap", title: "Live Preview", description: "See the PDF before downloading" },
        { icon: "shield", title: "Notes Stay Local", description: "Drafts and writeups never uploaded" },
        { icon: "globe", title: "Tables + Code", description: "Code blocks and tables render correctly" },
    ],
    "csv-to-json": [
        { icon: "zap", title: "Auto-Detect Headers", description: "First-row keys turn into JSON fields" },
        { icon: "fileCheck", title: "Pretty / Minified", description: "Choose readable or compact output" },
        { icon: "shield", title: "Local Parse", description: "Spreadsheet data stays on your device" },
        { icon: "globe", title: "Big-File Friendly", description: "Streams large CSVs without crashing" },
    ],
    "json-to-csv": [
        { icon: "zap", title: "Nested Flatten", description: "Flattens nested keys into columns" },
        { icon: "fileCheck", title: "Custom Delimiter", description: "Comma, tab, semicolon — your call" },
        { icon: "shield", title: "Stays On Device", description: "API payloads never re-uploaded" },
        { icon: "globe", title: "Excel-Ready", description: "Output opens cleanly in Excel and Sheets" },
    ],
    "xml-to-json": [
        { icon: "zap", title: "Element Mapping", description: "Tags become JSON keys with attributes preserved" },
        { icon: "fileCheck", title: "Pretty Output", description: "Indented JSON ready to read" },
        { icon: "shield", title: "Local Parse", description: "XML never uploaded to our servers" },
        { icon: "globe", title: "Schema-Friendly", description: "Handles deeply nested XML cleanly" },
    ],
    "base64": [
        { icon: "zap", title: "Encode + Decode", description: "Two-way conversion in one tool" },
        { icon: "fileCheck", title: "Files or Text", description: "Drag a file or paste a string" },
        { icon: "shield", title: "Browser-Only", description: "Nothing leaves your device" },
        { icon: "globe", title: "Big Inputs OK", description: "Handles long strings without lag" },
    ],
    "tiff-to-pdf": [
        { icon: "fileCheck", title: "Multi-Page TIFF", description: "Each TIFF page becomes a PDF page" },
        { icon: "zap", title: "Scan-Ready", description: "Built for archived scanner output" },
        { icon: "shield", title: "Local Convert", description: "Scans never leave your machine" },
        { icon: "globe", title: "Compression Aware", description: "Handles G4, LZW and other TIFF codecs" },
    ],
    "bmp-to-jpg": [
        { icon: "zap", title: "Big-File Friendly", description: "Shrinks heavy BMP scans efficiently" },
        { icon: "fileCheck", title: "Quality Slider", description: "Trade size vs sharpness" },
        { icon: "shield", title: "On-Device Encode", description: "BMP data converted in your browser" },
        { icon: "globe", title: "Batch Mode", description: "Convert many BMPs into a ZIP" },
    ],
    "gif-to-png": [
        { icon: "fileCheck", title: "First or All Frames", description: "Pick one frame or extract them all" },
        { icon: "zap", title: "Animated GIFs", description: "Splits each animation frame as PNG" },
        { icon: "shield", title: "Local Decode", description: "GIFs decoded right in your browser" },
        { icon: "globe", title: "ZIP Output", description: "Multi-frame extracts come bundled" },
    ],
    "svg-to-png": [
        { icon: "fileCheck", title: "Pick PNG Size", description: "Set custom width/height for raster output" },
        { icon: "zap", title: "Sharp at Any Scale", description: "Re-rasterizes SVG cleanly at high DPI" },
        { icon: "shield", title: "On-Device", description: "SVGs never uploaded" },
        { icon: "globe", title: "Designer-Friendly", description: "Ideal for prepping logo assets" },
    ],
};

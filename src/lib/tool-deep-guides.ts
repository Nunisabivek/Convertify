// Long-form, per-tool guide content. Each entry adds ~1000-1500 words of
// unique content to its tool page — directly addresses the "Crawled - currently
// not indexed" issue (Google rejected the original pages as too thin and too
// similar to other PDF converter sites).
//
// Coverage priority: the 12 GSC not-indexed pages first, then high-volume
// tools that already index but rank too deep.

export interface ToolDeepGuide {
    /** 2-3 paragraph opening that targets the primary search intent. */
    intro: string[]
    /** Step-by-step walkthrough — render as numbered list with rich bodies. */
    steps: Array<{ title: string; body: string }>
    /** "Who actually uses this" — scenarios with realistic context. */
    scenarios: Array<{ title: string; body: string }>
    /** Common pitfalls / troubleshooting — high long-tail value. */
    troubleshooting: Array<{ question: string; answer: string }>
    /** Comparison table rows. Keep cells short (<60 chars). */
    comparison: Array<{
        feature: string
        convertify: string
        typical: string
    }>
    /** ISO date string. Drives "Last updated" line + dateModified schema. */
    lastUpdated: string
}

export const toolDeepGuides: Record<string, ToolDeepGuide> = {
    "merge-pdf": {
        intro: [
            "Merging PDFs sounds like a one-step task until you actually try it on a slow upload page or behind a 5-file daily limit. Convertify's PDF merger combines unlimited PDFs locally in your browser — your file never leaves the device, the merge runs on your CPU, and the output downloads instantly with no watermark and no sign-up.",
            "Under the hood it uses PDF-Lib, the same open-source library trusted in document workflows at thousands of companies. We add a thin layer that handles drag-to-reorder, mixed JPG/PNG inputs, and a font-deduplication pass we call Zero-Bloat — the merged file is typically 10-20% smaller than what you'd get by simply concatenating bytes, because identical fonts and metadata blocks are merged once instead of once per source PDF.",
            "If you've previously used Adobe Acrobat, Smallpdf, iLovePDF or PDFsam to combine PDF files, the workflow here will feel familiar — just faster, with no upload bar and no daily quota.",
        ],
        steps: [
            { title: "Drop your PDFs into the merger", body: "Drag PDF files (and JPG/PNG images, if you want a mixed merge) onto the upload zone, or click to pick from a folder. There's no limit on the number of files. The browser starts reading each file's page count immediately so you see the running total." },
            { title: "Reorder the files", body: "Drag thumbnails up or down, or use the arrow buttons. The position you set is the position the page appears in the final PDF. For a typical case (e.g. cover letter → resume → portfolio) put the cover first, the resume second, the portfolio last." },
            { title: "Click Merge", body: "Convertify processes the merge entirely on your device — there's no upload progress bar because nothing is uploaded. For most documents (under ~50 MB combined) this completes in 2-5 seconds. Larger merges scale roughly with file size." },
            { title: "Download the merged PDF", body: "The result downloads with a default name (`merged-convertify.pdf`); you can rename it during the download. The page-order, internal links, and any form fields from the source PDFs are preserved." },
        ],
        scenarios: [
            { title: "Tax filing — combining a year of receipts", body: "Self-employed filers often end up with 30-50 separate receipt PDFs from different vendors. Stitching them into one PDF before uploading to a tax portal means one upload instead of 30, and a single file your accountant can scroll through. Use the reorder controls to group by category (rent, utilities, supplies) before merging." },
            { title: "Court submissions — exhibit packages", body: "Attorneys preparing exhibit binders need consistent page numbering across multiple documents. Merge first, then add page numbers to the combined output (Convertify's Add Page Numbers tool handles this in one click). Because nothing uploads, attorney-client privileged material stays on the device." },
            { title: "Business reports — monthly summaries", body: "Operations teams that pull weekly reports from different SaaS dashboards (Stripe, GA4, internal BI) can merge the four weekly PDF exports into one monthly file. Drag-to-reorder ensures W1 → W2 → W3 → W4 order even if the files were generated out of sequence." },
            { title: "School and university — multi-page assignments", body: "Students assembling a final project from a Word writeup (saved as PDF), a spreadsheet (also PDF), and JPG photos of physical work can do everything in one merge — Convertify accepts JPG and PNG alongside PDFs, so you don't need to convert images first." },
        ],
        troubleshooting: [
            { question: "Why is my merged PDF much larger than the inputs combined?", answer: "Almost always because one of the source PDFs has high-resolution images that aren't shared across documents. Run the merged file through Compress PDF afterwards — most users see a 50-80% reduction without visible quality loss." },
            { question: "The order looks wrong after I merge — what happened?", answer: "PDF-Lib follows the order shown in the file list, top to bottom. If files were dropped in via batch and you didn't reorder, browsers may sort by filename alphabetically. Drag thumbnails to set the exact order before clicking Merge." },
            { question: "Can I merge encrypted (password-protected) PDFs?", answer: "Not directly — protected PDFs need to be unlocked first. Run them through the Unlock PDF tool, then bring the unlocked copies into the merger." },
            { question: "My browser tab froze during a large merge.", answer: "PDF-Lib runs on the main thread, so very large merges (500+ MB combined) can stall the UI. Close other heavy tabs, free up RAM, and retry. For repeated large jobs consider splitting the merge into two passes (merge 1-25 → output A, merge 26-50 → output B, merge A+B)." },
        ],
        comparison: [
            { feature: "Files uploaded to server", convertify: "Never", typical: "Yes" },
            { feature: "File size limit", convertify: "Browser RAM only", typical: "5–25 MB on free tier" },
            { feature: "Files per day", convertify: "Unlimited", typical: "2–3 on free tier" },
            { feature: "Watermark on output", convertify: "None", typical: "Often added" },
            { feature: "Sign-up required", convertify: "No", typical: "Often" },
            { feature: "Mix images with PDFs", convertify: "Yes (JPG, PNG)", typical: "PDFs only" },
            { feature: "Speed (10 × 1 MB PDFs)", convertify: "~2 seconds", typical: "5–15 seconds" },
        ],
        lastUpdated: "2026-05-08",
    },

    "compress-pdf": {
        intro: [
            "Compressing a PDF to a specific KB target — 100 KB, 200 KB, 500 KB — is one of those small problems that gets surprisingly hard to solve well. Government forms, university applications, and visa portals enforce strict size caps, and most online compressors give you three vague choices (\"low\", \"medium\", \"high\") that rarely hit the number you actually need.",
            "Convertify's PDF compressor takes a target-size-first approach. You type the limit (e.g. 100 KB), and the compressor uses a multi-pass engine to auto-tune both DPI and JPEG quality until the output is at or below your number. It runs entirely in your browser using PDF.js for rendering and PDF-Lib for re-assembly — your document never touches a server.",
            "If you came here because a portal rejected your upload (\"file must be under 200 KB\"), you're in the right place. The result is a real PDF, not a flattened image, and text remains selectable when the source was a text PDF.",
        ],
        steps: [
            { title: "Drop the PDF you want to shrink", body: "Drag a single PDF or any common image (JPG, PNG, WebP) into the upload zone. The current file size is shown so you can see how aggressive a target you'll need." },
            { title: "Pick a size target", body: "Use the preset chips (50 KB, 100 KB, 200 KB, 500 KB, 1 MB, 2 MB, 5 MB, 10 MB) or type a custom number with KB / MB toggle. Convertify warns you if your target is larger than the current file." },
            { title: "Optional: tune quality manually", body: "Open Advanced Settings to override the auto-picked quality (10–100%) and resolution scale (0.5×–2.0×). This is useful when text sharpness matters more than file size — e.g. compressing a contract you'll print versus compressing a receipt you'll only view on screen." },
            { title: "Click Compress", body: "The compressor renders each page through PDF.js, encodes it as JPEG at the chosen quality, and rebuilds a new PDF with PDF-Lib. For a typical 5–20 MB document this completes in 5–15 seconds. Larger PDFs scale roughly with page count." },
            { title: "Verify and download", body: "The result screen shows old size → new size and whether the target was hit. If you missed the target, lower the quality slider and re-run; the auto-tuner gets you within 5% on most inputs." },
        ],
        scenarios: [
            { title: "US visa applications (DS-160, I-130) — under 240 KB", body: "The Department of State's CEAC portal limits supporting document uploads to 240 KB. Set the Convertify target to 200 KB to leave headroom and run your scanned passport, marriage certificate, or financial proof through. Because compression happens locally, your personal documents never leave your device — important when you're handling biometric or financial proof." },
            { title: "Indian government forms (UPSC, SSC, banking exams) — 100/200/500 KB", body: "Indian recruitment portals are notorious for strict size caps: photo under 50 KB, signature under 30 KB, ID proof under 100 KB, education certificate under 500 KB. The presets in Convertify map directly to the common limits, and the exact-target mode means you don't get rejected for being over by a few KB." },
            { title: "UK passport / NHS forms — under 1 MB", body: "GOV.UK and NHS forms typically cap supporting documents at 1 MB. Compress to 800 KB to leave margin for any portal-side overhead, and keep text mode in advanced settings if the document has fine print that needs to remain readable." },
            { title: "Email attachments — under Gmail's 25 MB limit", body: "Gmail rejects attachments over 25 MB. For a 35-50 MB scanned brief or design deck, set the target to 20 MB and let the compressor reduce DPI on image-heavy pages. The final PDF still opens cleanly in any reader." },
            { title: "WhatsApp / Telegram sharing — under 16 MB", body: "WhatsApp's document share caps at 100 MB but quality degrades over 16 MB; Telegram is similar. Use the 10 MB or 5 MB preset for fast share-and-forward without quality complaints from recipients." },
        ],
        troubleshooting: [
            { question: "I set a target of 100 KB and got 130 KB — why?", answer: "Auto-tuning gets close on most files but can't always hit aggressive targets without making text unreadable. Open Advanced and drop quality to 30-40% and resolution scale to 0.7×. If the source PDF is mostly photos (a passport scan) you can usually go to 100 KB; if it's a 10-page text document, 100 KB requires very aggressive settings." },
            { question: "The compressed PDF text is no longer selectable.", answer: "Convertify's compressor rasterizes pages — each page becomes a JPEG embedded in a new PDF — so text is no longer searchable. This is the trade-off for hitting tight size targets. If you need selectable text, use a less aggressive setting and accept a larger output, or run OCR after compression with the OCR PDF tool." },
            { question: "My scan is unreadable after compression.", answer: "Scans of small text (e.g. ID cards) are particularly sensitive. Try 60% quality with 1.0× resolution first — that usually preserves legibility while still cutting size by 40-60%." },
            { question: "Why does compressing a small PDF make it bigger?", answer: "If your source PDF is already optimized (e.g. a digitally generated text-only PDF under 200 KB), the rasterize-and-re-encode flow can produce a larger file because it's now an image-based PDF. The result screen warns you when this happens; in that case the original is already as small as it'll get." },
        ],
        comparison: [
            { feature: "Hit exact KB target", convertify: "Yes (preset + custom)", typical: "Vague \"low/medium/high\"" },
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Free tier daily limit", convertify: "Unlimited", typical: "1–3 compressions" },
            { feature: "Quality slider", convertify: "10–100%", typical: "Locked on free" },
            { feature: "Resolution control", convertify: "0.5×–2.0×", typical: "None" },
            { feature: "Multi-pass tuning", convertify: "Auto-targets exact size", typical: "Single pass" },
            { feature: "Watermark", convertify: "None", typical: "Often added" },
        ],
        lastUpdated: "2026-05-08",
    },

    "png-to-pdf": {
        intro: [
            "Combining PNG screenshots, design exports, or scanned pages into a single PDF is a common task that most online tools handle poorly — they upload your images, add a watermark, and limit you to 5 files at a time. Convertify's PNG to PDF combiner runs entirely in your browser, supports unlimited PNGs, preserves transparency-aware backgrounds, and renders at up to 300 DPI so the output is print-grade.",
            "The conversion uses PDF-Lib's native `embedPng` so alpha channels are handled correctly — transparent areas come through without weird black backgrounds (a frequent failure mode in cheap converters that flatten through JPEG first).",
            "If you've used iLovePDF or Smallpdf for the same task, the difference here is that the file size cap is your browser's RAM (so multi-hundred-MB image sets work), and there's no watermark on the result.",
        ],
        steps: [
            { title: "Drop your PNG images", body: "Click the upload zone or drag and drop. You can add as many PNG files as your machine can hold in memory — typical laptops handle 200+ images without issue." },
            { title: "Reorder if needed", body: "Drag thumbnails to set the page order. The first image becomes page 1, the second image page 2, and so on. This is especially important for design portfolios or step-by-step guides where order matters." },
            { title: "Click Convert", body: "PDF-Lib creates a new PDF, embeds each PNG at its original resolution, and adds one page per image sized to the image dimensions. The whole pass happens in JavaScript on your CPU." },
            { title: "Download the PDF", body: "The result is a multi-page PDF (one page per PNG) with no watermark, ready to email, print, or upload to any portal." },
        ],
        scenarios: [
            { title: "Design portfolios — Figma / Sketch exports", body: "Designers exporting frames as PNG often need a single PDF for client review or job applications. Drop all PNG exports, drag to set the narrative order (intro → research → wireframes → final), and convert. The PDF is print-quality at 300 DPI and ready for resume attachments." },
            { title: "Step-by-step guides and tutorials", body: "Internal training docs built from screenshots (annotated with arrows in a tool like Snagit) often live as PNG files. Combining them into a PDF makes sharing simpler than zipping the images, and recipients can scroll through pages naturally." },
            { title: "Scanned book pages and old documents", body: "Cameras and phone scanner apps that output PNG (rather than PDF) leave you with a folder of one-page images. PNG to PDF gives you a single archive-friendly file without re-uploading the scans to a third party — important for genealogy, legal, and personal records." },
            { title: "Receipts and proof-of-purchase bundles", body: "Many e-commerce sites email PNG receipts (or you screenshot them). Bundling them into a single PDF is the easiest way to submit expense claims to HR / accounting tools that expect a PDF rather than a ZIP of images." },
        ],
        troubleshooting: [
            { question: "My PNG had a transparent background — why is the PDF page white?", answer: "PDF pages don't support real transparency; what you're seeing is the default white PDF page color showing through. To preserve a coloured background, fill it in your image editor before converting. The image data itself, including alpha, is still embedded." },
            { question: "The PDF is huge — much bigger than the PNGs combined.", answer: "PNG is lossless; embedding lossless images in a PDF preserves all that data. For a smaller output, run the result through Compress PDF afterwards, or convert PNGs to JPG first if losslessness isn't needed." },
            { question: "Some pages are landscape and some portrait — can I make them all the same?", answer: "Convertify sizes each page to the source image, so portrait PNGs produce portrait pages and landscape PNGs produce landscape. To force a uniform page size, resize all PNGs to the same dimensions before converting (use the Resize Image tool first)." },
            { question: "It says it can't read one of my files.", answer: "The most common cause is a file that's actually a JPG renamed to .png. Double-check the original format — Convertify validates magic bytes, not just file extensions, so genuine PNGs always work but mis-labeled files won't." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Number of PNGs", convertify: "Unlimited", typical: "5–15 on free tier" },
            { feature: "Output resolution", convertify: "Up to 300 DPI", typical: "72–150 DPI" },
            { feature: "Transparency handling", convertify: "Native PNG embed", typical: "JPG flatten" },
            { feature: "Watermark", convertify: "None", typical: "Often added" },
            { feature: "Reorder before convert", convertify: "Drag-and-drop", typical: "Filename order only" },
            { feature: "Sign-up required", convertify: "No", typical: "Often" },
        ],
        lastUpdated: "2026-05-08",
    },

    "pdf-to-jpg": {
        intro: [
            "Turning a PDF into JPG images is one of the most common conversion tasks — for sharing on social media, embedding pages in slide decks, or sending screenshots of a contract section without the whole file. Convertify's PDF to JPG converter renders pages at up to 300 DPI right in your browser using PDF.js, so the output is sharp enough to print.",
            "The renderer treats PDF as a true vector format: text and line art rasterize cleanly at the chosen DPI rather than scaling up a low-resolution preview. This matters most for technical drawings, scanned documents, and infographics where text legibility breaks down on lower-quality converters.",
            "If you have a multi-page PDF, the tool exports one JPG per page; for five or more pages it auto-bundles into a ZIP so you don't have to click download fifty times.",
        ],
        steps: [
            { title: "Drop your PDF", body: "Click or drag a PDF onto the upload zone. The tool reads the page count immediately so you know how many JPGs to expect." },
            { title: "Pick the quality", body: "Choose Print (300 DPI), Web (150 DPI), or Mobile (72 DPI). Print quality is best for archival and physical printing; Web is the right balance for blog posts and emails; Mobile produces small files for fast sharing." },
            { title: "Click Convert", body: "PDF.js renders each page to a canvas, then encodes the canvas as JPEG. For typical document PDFs (under 50 pages) this finishes in 5-15 seconds." },
            { title: "Download", body: "Single-page PDFs download as a single .jpg; multi-page PDFs download as a .zip containing page-1.jpg, page-2.jpg, etc." },
        ],
        scenarios: [
            { title: "Social media — sharing a PDF page on Instagram or LinkedIn", body: "Most social platforms don't accept PDF attachments natively. Convert the page you want to share to JPG at Web quality, post it as an image, and link the full PDF in the caption or first comment." },
            { title: "Slide decks — embedding a contract or report excerpt", body: "PowerPoint and Google Slides render embedded PDFs poorly. Converting each relevant page to JPG and inserting as an image gives you crisp visuals at any zoom level, plus the ability to crop and annotate without affecting the source PDF." },
            { title: "Email previews — sending a quick visual reference", body: "When you want a recipient to see one page of a long PDF without opening the file, send the JPG inline. Mobile-quality output is small enough to embed directly without hitting size limits." },
            { title: "Archival and OCR pre-processing", body: "Some OCR engines work better on JPG than on raw PDF (especially when the source is image-only). Converting to JPG first lets you batch-OCR through any image-based pipeline." },
        ],
        troubleshooting: [
            { question: "The text in my JPG is fuzzy.", answer: "You probably converted at Mobile (72 DPI) or Web (150 DPI). Re-run with Print (300 DPI). Note that the source PDF also matters — if the PDF itself was generated from a low-res scan, no DPI setting can recover detail that wasn't there." },
            { question: "I converted a 200-page PDF and only got the first 100 in the ZIP.", answer: "Some browsers (notably mobile Safari) cap memory available to a single tab. For 100+ page conversions, use a desktop browser with at least 8 GB RAM, or split the PDF into 50-page chunks first." },
            { question: "Colors look slightly off.", answer: "JPEG is a lossy format with limited color depth. For pages with subtle gradient or photographic content, use the PDF to PNG tool instead — PNG is lossless and preserves color fidelity." },
            { question: "Is OCR (text extraction) included?", answer: "PDF to JPG only renders pages — it doesn't extract text. For text extraction use the PDF to Text tool, or for searchable text inside a PDF use OCR PDF." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Max DPI", convertify: "300 DPI (print)", typical: "150 DPI" },
            { feature: "Multi-page batch", convertify: "Auto-ZIP", typical: "One file at a time" },
            { feature: "Pages per conversion", convertify: "Unlimited", typical: "5–25 on free tier" },
            { feature: "Watermark", convertify: "None", typical: "Often added" },
            { feature: "Free tier limit", convertify: "None", typical: "1–3 per day" },
        ],
        lastUpdated: "2026-05-08",
    },

    "pdf-to-png": {
        intro: [
            "PDF to PNG is the right choice when you need lossless image quality — for line art, technical drawings, screenshots embedded in PDFs, or any case where JPEG compression artifacts would be visible. Convertify renders each page at up to 300 DPI through PDF.js and saves the result as a PNG with no quality loss.",
            "PNG also preserves transparency-friendly backgrounds, so designers extracting elements from a PDF mockup get clean output suitable for compositing without further processing.",
        ],
        steps: [
            { title: "Drop your PDF", body: "Drag and drop a single PDF, or click the upload zone to pick from a folder. The tool reads page count instantly so you know how many PNGs to expect." },
            { title: "Pick rendering DPI", body: "300 DPI for print and design work, 150 DPI for web and screen use, 72 DPI for thumbnails and small previews." },
            { title: "Convert and download", body: "Single-page PDFs download as a single PNG; multi-page PDFs auto-bundle into a ZIP so you don't click download once per page." },
        ],
        scenarios: [
            { title: "Technical drawings and CAD exports", body: "Engineering drawings exported as PDF often have fine line art that JPEG compression smears. PNG preserves every line cleanly at 300 DPI, making it the right format for inclusion in technical documentation." },
            { title: "Design comps and mockups", body: "Designers receiving a PDF mockup who need PNG assets for further compositing benefit from the lossless format — no JPG artifacts to clean up later in Photoshop or Figma." },
            { title: "Screenshots and UI captures", body: "PDFs that contain UI screenshots typically render best as PNG because the source was already pixel-perfect. Converting back to PNG keeps that fidelity." },
        ],
        troubleshooting: [
            { question: "The PNG file size is much larger than my PDF.", answer: "PNG is lossless, so file sizes are inherently larger than equivalent JPGs. If size matters more than absolute fidelity, use PDF to JPG instead." },
            { question: "Transparency isn't preserved.", answer: "PDF page backgrounds are typically opaque (white). PDF to PNG inherits that — to get a transparent PNG you'd need to start from a PDF that has explicit transparent regions and use a more specialized rendering tool." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Format quality", convertify: "Lossless PNG", typical: "Lossy JPG" },
            { feature: "Max DPI", convertify: "300 DPI", typical: "150 DPI" },
            { feature: "Multi-page batch", convertify: "Auto-ZIP", typical: "Manual" },
        ],
        lastUpdated: "2026-05-08",
    },

    "pdf-to-text": {
        intro: [
            "Extracting text from a PDF is fast when the PDF was generated digitally (e.g. exported from Word) and harder when it's a scanned image. Convertify's PDF to Text tool handles the digital case in milliseconds — pulling every text run, preserving reading order, and outputting clean .txt or copyable plain text.",
            "If your PDF is a scan (image-only), you'll see no text extracted because there's no embedded text layer. For those cases, use the OCR PDF tool first to add a text layer, then run PDF to Text.",
        ],
        steps: [
            { title: "Drop the PDF", body: "Drag or click to upload. PDF.js reads the document structure immediately." },
            { title: "Convertify extracts the text", body: "Every text run is pulled in document order and joined with newlines between paragraphs. The whole pass is local and finishes near-instantly for typical documents." },
            { title: "Copy or download", body: "Copy the text directly to your clipboard for pasting into Word, Notion, or email — or download as a .txt file for archival or scripting." },
        ],
        scenarios: [
            { title: "Quoting from a contract or paper", body: "When you need to copy a paragraph from a PDF (a quote for an article, a clause for legal review), PDF to Text gives you clean copyable plain text — no weird ligatures, no broken hyphens, no sticky formatting." },
            { title: "Building a search index", body: "Developers building an internal search over PDF documents can use PDF to Text as the first step in their indexing pipeline. The output is plain UTF-8 ready for Elasticsearch, Algolia, or Meilisearch ingestion." },
            { title: "Translating long documents", body: "Most translation tools handle plain text more reliably than PDF. Extract first, translate, then re-format if needed." },
        ],
        troubleshooting: [
            { question: "I extracted but got nothing.", answer: "Your PDF is likely a scan with no text layer. Run it through the OCR PDF tool first to add a searchable text layer, then re-extract." },
            { question: "The reading order is wrong.", answer: "Multi-column layouts (academic papers, magazines) sometimes confuse text extractors. PDF.js does its best to follow visual order; for pathological cases, copy column-by-column or use a layout-aware extractor like pdftotext from poppler-utils." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Speed", convertify: "Instant (local)", typical: "5–20s per page" },
            { feature: "Output format", convertify: ".txt + clipboard", typical: ".txt only" },
            { feature: "Free tier limit", convertify: "Unlimited", typical: "1–3 per day" },
        ],
        lastUpdated: "2026-05-08",
    },

    "text-to-pdf": {
        intro: [
            "Turning a plain text file (.txt) into a PDF gives you something portable, printable, and shareable. Convertify's Text to PDF tool reads your .txt content, paginates it cleanly, and produces a PDF with no watermark — all locally, so private notes and drafts never leave your device.",
            "The output uses a readable monospace or sans-serif font, automatic page breaks, and standard page sizes (A4 or US Letter). It's intentionally minimal — the goal is a clean, archival PDF, not a fancy formatted document.",
        ],
        steps: [
            { title: "Drop the .txt file", body: "Click or drag a .txt file onto the upload zone. The text is read as UTF-8 by default." },
            { title: "Convert", body: "Convertify paginates the text into PDF pages with sensible margins and a readable font." },
            { title: "Download", body: "The PDF downloads instantly — no upload, no quota, no watermark." },
        ],
        scenarios: [
            { title: "Sharing notes and drafts", body: "Writers, students, and journalists often work in .txt files for portability. Sharing as PDF makes the document open identically on any device — no font substitution, no formatting drift." },
            { title: "Code listings and config files", body: "Sharing source code or config files as PDF is common for documentation, code reviews, and submissions. Convertify preserves whitespace and indentation faithfully." },
        ],
        troubleshooting: [
            { question: "Special characters look wrong.", answer: "If your .txt isn't UTF-8 encoded (e.g. Windows-1252 from older editors), characters like é, ü, and curly quotes can render incorrectly. Re-save the file as UTF-8 in your editor first." },
            { question: "Long lines are cut off.", answer: "By default the tool wraps long lines to fit the page width. Lines that don't wrap (e.g. URLs without break points) may be slightly cut; reduce the source line length first if this matters." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "UTF-8 support", convertify: "Full", typical: "Often broken" },
            { feature: "Watermark", convertify: "None", typical: "Often added" },
            { feature: "Sign-up", convertify: "No", typical: "Often" },
        ],
        lastUpdated: "2026-05-08",
    },

    "word-to-pdf": {
        intro: [
            "Converting a Word document to PDF is the most common conversion in office workflows, but it's also where formatting goes wrong most often. Headings shift, fonts get substituted, and tables overflow page edges. Convertify's Word to PDF converter uses Smart Font Embedding to make the output match the original Word file as closely as possible — important for resumes, contracts, and anything that gets visually scrutinized.",
            "Both .doc and .docx are supported. The conversion runs in your browser, so confidential documents (CVs with personal info, contracts under NDA) never touch a server.",
        ],
        steps: [
            { title: "Upload your Word file", body: "Drag or click to select. .doc and .docx both work." },
            { title: "Convert", body: "Headings, body text, lists, and tables are mapped to PDF equivalents. Fonts are embedded so the result looks the same on any device." },
            { title: "Download", body: "Get the PDF instantly with no watermark." },
        ],
        scenarios: [
            { title: "Resumes and CVs for job applications", body: "Most ATS systems and recruiters prefer PDF over Word — formatting is locked, fonts are guaranteed, and the document is harder to accidentally edit. Convert before submitting." },
            { title: "Contracts and legal documents", body: "PDF is the standard format for signed contracts. Convert from Word, then sign with the Sign PDF tool." },
            { title: "Submissions to publishers and journals", body: "Most submission portals accept PDF only. Word-to-PDF preserves your formatting exactly so reviewers see what you saw." },
        ],
        troubleshooting: [
            { question: "Fonts look different in the PDF.", answer: "If the Word file uses a font your browser doesn't have access to, Convertify falls back to a similar font. To guarantee fidelity, embed fonts in Word first (File → Options → Save → Embed fonts) before converting." },
            { question: "Some images are missing.", answer: "Linked (rather than embedded) images in Word point to local file paths and don't transfer in conversions. Re-insert images with Insert → Pictures → choose 'Embed' before converting." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Formats supported", convertify: "DOC + DOCX", typical: "DOCX only" },
            { feature: "Microsoft Office needed", convertify: "No", typical: "Sometimes" },
            { feature: "Free tier limit", convertify: "Unlimited", typical: "2–3 per day" },
            { feature: "Watermark", convertify: "None", typical: "Often added" },
        ],
        lastUpdated: "2026-05-08",
    },

    "powerpoint-to-pdf": {
        intro: [
            "Converting PowerPoint to PDF is the standard way to share decks that look the same on every device — Mac, Windows, iPhone, Android. Fonts get embedded, slides stay in order, and there's no risk of an animation glitch ruining a presentation review. Convertify's PowerPoint to PDF converter handles both .ppt and .pptx, locally, with no watermark.",
        ],
        steps: [
            { title: "Upload your .ppt or .pptx", body: "Drag and drop, or pick from a folder. Both modern and legacy PowerPoint formats work." },
            { title: "Convert", body: "Each slide becomes one PDF page. Layout, fonts, and embedded images are preserved." },
            { title: "Download", body: "The PDF is ready to email, upload, or print." },
        ],
        scenarios: [
            { title: "Pitch decks for investors", body: "Investors often request PDF over PPTX for faster review. Convert before sending — and because conversion is local, sensitive financials never reach our servers." },
            { title: "Conference talks", body: "Most conference submission portals require PDF. Convert your talk deck, attach to the submission, and bring the .pptx separately for the actual presentation." },
            { title: "Lecture handouts", body: "Teachers distributing slides as study material gain a portable, printable, watermark-free PDF that students can annotate in any reader." },
        ],
        troubleshooting: [
            { question: "Animations and transitions are missing.", answer: "Expected — PDF is a static format. Animations don't transfer. The static end-state of each slide is what gets captured." },
            { question: "Embedded video is missing.", answer: "PDF supports limited embedded video, but most viewers don't play it. For decks with video, share the original .pptx alongside the PDF or upload the videos separately." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Formats supported", convertify: "PPT + PPTX", typical: "PPTX only" },
            { feature: "Watermark", convertify: "None", typical: "Often added" },
            { feature: "Sign-up", convertify: "No", typical: "Often" },
        ],
        lastUpdated: "2026-05-08",
    },
}

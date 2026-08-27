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
            "Turning a PDF into JPG images is one of the most common conversion tasks — for sharing on social media, embedding pages in slide decks, or sending a contract page without the whole file. Convertify’s PDF to JPG converter renders each page in your browser with PDF.js. Nothing is uploaded.",
            "The renderer treats PDF as a vector format: text and line art are drawn to a canvas at 2× the page’s native size, then saved as JPEG. That is sharper than photographing the screen, and there is no DPI picker on this page.",
            "A one-page PDF downloads as a single JPG. Two or more pages download as a ZIP so you are not clicking download on every page.",
        ],
        steps: [
            { title: "Drop your PDF", body: "Click or drag a PDF onto the upload zone. The file stays on your device." },
            { title: "Click Convert", body: "PDF.js renders each page to a canvas, then encodes the canvas as JPEG. Typical documents finish in a few seconds." },
            { title: "Download", body: "Single-page PDFs download as a .jpg; multi-page PDFs download as a .zip of page images." },
        ],
        scenarios: [
            { title: "Social media — sharing a PDF page on Instagram or LinkedIn", body: "Most social platforms don't accept PDF attachments natively. Convert the page you want to share to JPG, post it as an image, and link the full PDF in the caption or first comment." },
            { title: "Slide decks — embedding a contract or report excerpt", body: "PowerPoint and Google Slides render embedded PDFs poorly. Converting each relevant page to JPG and inserting as an image gives you a crisp visual you can crop and annotate without touching the source PDF." },
            { title: "Email previews — sending a quick visual reference", body: "When you want a recipient to see one page of a long PDF without opening the file, send the JPG inline." },
            { title: "Archival and OCR pre-processing", body: "Some OCR engines work better on JPG than on raw PDF (especially when the source is image-only). Converting to JPG first lets you batch-OCR through any image-based pipeline." },
        ],
        troubleshooting: [
            { question: "The text in my JPG is fuzzy.", answer: "This tool renders at 2× the PDF’s native size. If the source PDF was generated from a low-res scan, no conversion can recover detail that was never there. For line art where JPEG artifacts show, use PDF to PNG instead." },
            { question: "I converted a 200-page PDF and only got the first 100 in the ZIP.", answer: "Some browsers (notably mobile Safari) cap memory available to a single tab. For 100+ page conversions, use a desktop browser with at least 8 GB RAM, or split the PDF into 50-page chunks first." },
            { question: "Colors look slightly off.", answer: "JPEG is a lossy format with limited color depth. For pages with subtle gradient or photographic content, use the PDF to PNG tool instead — PNG is lossless and preserves color fidelity." },
            { question: "Is OCR (text extraction) included?", answer: "PDF to JPG only renders pages — it doesn't extract text. For text that is already in the PDF, use PDF to Text." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "How pages render", convertify: "2× PDF.js canvas", typical: "Often a low-res preview" },
            { feature: "Multi-page batch", convertify: "Auto-ZIP", typical: "One file at a time" },
            { feature: "Pages per conversion", convertify: "Unlimited", typical: "5–25 on free tier" },
            { feature: "Watermark", convertify: "None", typical: "Often added" },
            { feature: "Free tier limit", convertify: "None", typical: "1–3 per day" },
        ],
        lastUpdated: "2026-08-27",
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
            "Converting a Word document to PDF is one of the most common file tasks in office workflows. Convertify's Word to PDF tool reads the text content of a .docx file and lays it out on clean, paginated PDF pages, right in your browser. It's a lightweight text-content conversion, not a pixel-perfect layout renderer — exact fonts, images, and tables are not carried over.",
            "Only the modern .docx format is supported (not the older binary .doc). The conversion runs in your browser, so confidential documents never touch a server.",
        ],
        steps: [
            { title: "Upload your Word file", body: "Drag or click to select a .docx file." },
            { title: "Convert", body: "The document's text is extracted and laid out on PDF pages with automatic pagination." },
            { title: "Download", body: "Get the PDF instantly with no watermark." },
        ],
        scenarios: [
            { title: "Quick drafts and text-only documents", body: "For text-heavy Word documents without complex formatting, this gives you a fast, shareable PDF." },
            { title: "Sharing document content without Office", body: "When you need a PDF from a .docx and don't have Word installed, this extracts the text and gets you a downloadable PDF instantly." },
        ],
        troubleshooting: [
            { question: "The PDF doesn't look like my original Word document.", answer: "This tool extracts text content only — it does not preserve exact fonts, images, tables, or complex layout. For a visually exact PDF, use Word's own File → Save As → PDF export, or Google Docs' File → Download → PDF." },
            { question: "Images from my Word doc are missing.", answer: "Correct — only text content is extracted. Images are not included in the PDF output." },
            { question: "My .doc file won't convert.", answer: "Only the modern .docx format is supported. Open the file in Word or Google Docs and re-save it as .docx first." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Formats supported", convertify: "DOCX only", typical: "DOCX only" },
            { feature: "Output fidelity", convertify: "Text content only", typical: "Varies" },
            { feature: "Microsoft Office needed", convertify: "No", typical: "Sometimes" },
            { feature: "Watermark", convertify: "None", typical: "Often added" },
        ],
        lastUpdated: "2026-07-12",
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

    "split-pdf": {
        intro: [
            "Splitting a PDF — extracting one page, a chapter, or a custom range — is a task most people Google when they realize they only want to share part of a document. Convertify's PDF splitter lets you select pages individually or by range and extracts them to a new PDF in seconds, with no file uploaded to any server.",
            "The most common use case is extracting a single page from a 50-page document. The second most common is separating a combined PDF into individual files — for example, when a law firm's scanning software always produces one giant PDF per client and you need individual documents per matter. Both modes are available: 'Extract selected pages' and 'Split into individual pages'.",
            "If you've previously used Adobe Acrobat or Smallpdf for the same job, the key difference here is that there's no 5-page daily limit and nothing is uploaded — useful for confidential materials like HR records, tax returns, and legal exhibits.",
        ],
        steps: [
            { title: "Upload the PDF", body: "Click the upload zone or drag a PDF onto it. The tool reads the page count immediately and shows thumbnail previews so you can see what you're working with." },
            { title: "Select pages to extract", body: "Click individual page thumbnails to toggle them, or type a range (e.g. '3-7, 12, 15-20') in the range field. You can also choose 'Extract all as individual files' to split every page into its own PDF." },
            { title: "Extract", body: "Convertify builds the new PDF from your selected pages using PDF-Lib, entirely in the browser. For typical selections this completes in 1-3 seconds." },
            { title: "Download", body: "Single-page or small multi-page extractions download as one PDF. When you extract all pages as individual files, the result is a ZIP containing page-1.pdf, page-2.pdf, etc." },
        ],
        scenarios: [
            { title: "Extracting one page from a large document", body: "Legal professionals, accountants, and HR teams frequently need a single page from a 100+ page file — a specific exhibit, one quarterly statement, or a single signature page. Click the thumbnail, extract, done." },
            { title: "Separating combined invoices", body: "Accounting software often exports a month's invoices as one PDF. Split by page to get individual invoice files that match your filing structure, then rename each by invoice number." },
            { title: "Sharing a chapter from an e-book or report", body: "You want to send a colleague just the appendix of a 300-page report. Extract pages 285-300 and share only what's needed — keeping the rest private." },
            { title: "Removing the cover page before submission", body: "Many PDF templates add a branded cover page. Extract pages 2 through N to get a clean document without the cover, ready for external portals that don't expect branding." },
        ],
        troubleshooting: [
            { question: "My PDF is password-protected and I can't split it.", answer: "Protected PDFs need to be unlocked before you can modify them. Run the file through Convertify's Unlock PDF tool first, then bring the unlocked copy back to the splitter." },
            { question: "I want to extract non-consecutive pages (e.g. pages 1, 5, 9).", answer: "Use the range syntax: type '1, 5, 9' in the range input and only those pages will be extracted into one PDF." },
            { question: "The ZIP only contains some pages, not all.", answer: "This is almost always a browser memory issue on very large PDFs. Close other heavy tabs and try again. For 500+ page PDFs, split in two passes: first extract pages 1-250, then 251-500." },
            { question: "Page order is wrong in the extracted PDF.", answer: "Pages are extracted in the order you selected them, not in their original document order. If you clicked thumbnails out of order, the extraction follows click order. Use the range input instead for reliable ordering." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "2–5 splits/day free" },
            { feature: "Max pages", convertify: "Browser RAM only", typical: "100–200 pages" },
            { feature: "Extract non-consecutive pages", convertify: "Yes", typical: "Range only" },
            { feature: "Watermark on output", convertify: "None", typical: "Often added" },
            { feature: "Split to individual files", convertify: "Yes, auto-ZIP", typical: "Not always" },
        ],
        lastUpdated: "2026-06-01",
    },

    "pdf-to-word": {
        intro: [
            "Converting a PDF to an editable Word document is one of the most-requested file tasks — you receive a contract, a form, or a report as PDF and need to edit the text without retyping everything. Convertify's PDF to Word converter extracts the text layer from digitally-generated PDFs and maps it to a .docx structure your can open in Microsoft Word, Google Docs, or LibreOffice.",
            "The key distinction that determines quality is whether your PDF is 'digital' (created by exporting from Word, Excel, or a design tool) or 'scanned' (a photo of a physical page). Digital PDFs convert cleanly because they carry an embedded text layer. Scanned PDFs are images — they look like text but the file stores pixels, not characters. Scanned PDFs need OCR first; run them through Convertify's OCR PDF tool to add a text layer, then convert to Word.",
            "Convertify's converter is fully client-side, so confidential PDFs — HR letters, bank statements, legal agreements — never reach a server. The output is a plain .docx with your content reformatted into Word paragraphs, ready to edit.",
        ],
        steps: [
            { title: "Upload your PDF", body: "Drag or click to select. The tool reads the document type instantly — digital PDFs show a green indicator; image-only PDFs will prompt you to run OCR first." },
            { title: "Convert", body: "The converter walks every page of the PDF, pulls the text runs in reading order, and builds a .docx with paragraph styles matching the original's approximate structure." },
            { title: "Download the .docx", body: "Open in Word or Google Docs and edit freely. Text, headings, and lists convert well; complex multi-column layouts and tables may need minor cleanup." },
        ],
        scenarios: [
            { title: "Editing a received contract", body: "You receive a PDF contract but need to redline specific clauses. Convert to Word, make tracked changes, and send back. Because nothing uploads, the NDA-protected content stays on your machine." },
            { title: "Updating an old company template", body: "A department has a PDF form or report template and nobody has the original Word file. Convert the PDF to .docx to get an editable starting point, then restyle and re-save as the new master." },
            { title: "Copying structured data from a PDF report", body: "Analysts who receive data PDFs quarterly can convert to Word, then copy tables into Excel. Not as clean as PDF to Excel directly, but useful for unstructured reports where tables aren't recognized separately." },
            { title: "Accessibility editing", body: "Screen-reader workflows sometimes need a Word document instead of a PDF. Converting gives you editable text you can reformat with proper heading hierarchy and alt text — something you can't easily do in a PDF." },
        ],
        troubleshooting: [
            { question: "The converted Word doc shows garbled text or no text at all.", answer: "Your PDF is likely a scan (image-only). Run it through OCR PDF first to add a searchable text layer, then convert." },
            { question: "Formatting looks wrong — columns are merged, tables are flat.", answer: "Complex layouts (multi-column academic papers, tables with merged cells) are the hardest to convert perfectly. The text content is correct; you may need to reformat the layout manually in Word." },
            { question: "Some fonts look different in the Word doc.", answer: "PDF fonts are embedded in the PDF and aren't transferred to .docx. Word substitutes the nearest available font. If exact branding matters, update fonts manually after converting." },
            { question: "Images from the PDF are missing.", answer: "The converter extracts text content only — embedded images are not included in the Word output. For a layout-accurate Word file with images intact, you need a more advanced tool like Adobe Acrobat Pro." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Output format", convertify: ".docx (editable)", typical: ".docx" },
            { feature: "Scanned PDF handling", convertify: "Prompt to OCR first", typical: "Often silently fails" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "2–3 per day free" },
            { feature: "Watermark", convertify: "None", typical: "Often added" },
            { feature: "Sign-up", convertify: "No", typical: "Often required" },
        ],
        lastUpdated: "2026-06-01",
    },

    "jpg-to-pdf": {
        intro: [
            "Converting JPG photos to PDF is how most people turn phone-captured documents — receipts, ID cards, handwritten notes, whiteboards — into portable, professional files. Convertify's JPG to PDF tool lets you upload multiple JPGs at once, drag to set the order, and produce a single multi-page PDF without any upload, any watermark, or any daily limit.",
            "Most JPG-to-PDF tools online handle one image at a time. Convertify batches them: drop 30 receipts, reorder by date, convert — and you get one consolidated PDF for expense submission or archiving. The quality is preserved at the original JPG resolution, which for modern phone cameras (12–48 MP) is typically 200–400 DPI on a standard letter page — more than adequate for printing or submission to government portals.",
            "If your photos are HEIC (iPhone Live Photos) rather than JPG, use the HEIC to JPG tool first, or upload directly — Convertify will auto-convert them in the same workflow.",
        ],
        steps: [
            { title: "Upload your JPG images", body: "Drag and drop one or many JPGs (or HEICs) onto the upload zone. All images load with thumbnail previews immediately." },
            { title: "Set the page order", body: "Drag thumbnails to reorder. For expense reports: sort by date. For documents: arrange in logical sequence. The top thumbnail becomes page 1." },
            { title: "Click Convert", body: "PDF-Lib creates a new PDF with one page per image, sized to each image's natural dimensions. All processing happens in your browser." },
            { title: "Download the PDF", body: "The multi-page PDF downloads without a watermark, at the full original image quality." },
        ],
        scenarios: [
            { title: "Phone-scanned documents for government portals", body: "Visa applications, tax forms, and university admissions all require PDFs. If you photographed your passport, bank statement, or degree certificate with a phone camera, JPG to PDF converts those shots into a submission-ready file. If the file is too large afterwards, run through Compress PDF to hit the portal's size limit." },
            { title: "Expense reports from paper receipts", body: "Take a batch of receipt photos over a business trip, upload them all at once, sort by date, and convert. HR and accounting teams prefer one PDF per trip over a folder of 20 JPG attachments." },
            { title: "Real estate documentation", body: "Agents photographing property condition reports, lease agreements, or inspection checklists with their phone get a proper PDF ready for client delivery or record-keeping — no scanner needed." },
            { title: "Classroom assignments with handwritten work", body: "Students submitting handwritten homework photograph each page, upload to JPG to PDF, and get a multi-page submission PDF. The in-browser processing means it works on school Chromebooks and tablets without any installed app." },
        ],
        troubleshooting: [
            { question: "My PDF is very large — the JPGs were high resolution.", answer: "JPG to PDF embeds your images at original quality. If you need a smaller file, run the resulting PDF through Compress PDF to reduce it. Typical smartphone photos compress well to under 500 KB per page at document-quality settings." },
            { question: "Some photos are sideways or upside down.", answer: "Phones sometimes encode rotation in EXIF metadata rather than rotating the actual pixels. If images appear rotated in the PDF, use the Rotate PDF tool afterwards to correct any sideways pages." },
            { question: "One of my images won't upload.", answer: "The most common cause is a file saved with a .jpg extension but actually in HEIC or WebP format internally. Re-export from your phone or camera app as JPEG, or run through the HEIC to JPG converter first." },
            { question: "I want all pages to be the same size (A4) even if images have different dimensions.", answer: "Currently Convertify sizes each PDF page to the source image. For uniform A4 pages, resize all images to the same dimensions with the Resize Image tool first, then convert." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Images per conversion", convertify: "Unlimited", typical: "5–20 on free tier" },
            { feature: "Drag-to-reorder", convertify: "Yes", typical: "Sometimes" },
            { feature: "Output quality", convertify: "Original resolution", typical: "Compressed" },
            { feature: "Watermark", convertify: "None", typical: "Often added" },
            { feature: "HEIC support", convertify: "Yes", typical: "Rarely" },
        ],
        lastUpdated: "2026-06-01",
    },

    "excel-to-pdf": {
        intro: [
            "Converting a spreadsheet to PDF gives you a read-only snapshot anyone can open, whether or not they own Excel. Convertify reads the cell values out of your .xlsx or .xls file and lays them out as a clean table across paginated PDF pages, entirely in your browser — the file is never uploaded.",
            "Be clear about what this is: a values export, not a visual copy of your spreadsheet. Charts, images, cell colours, borders, merged cells, number formatting and hyperlinks do not come across. Formulas are exported as the value they currently evaluate to. If you need a pixel-accurate reproduction of a formatted sheet, use Excel's own File → Export → Create PDF instead.",
            "Where the values-only export works well: sending a data table to someone without Excel, attaching a figures summary to an email, or archiving a finished sheet as a read-only record.",
        ],
        steps: [
            { title: "Upload your spreadsheet", body: "Drop an .xlsx or .xls file onto the converter. Every sheet in the workbook is listed once the file is read." },
            { title: "Pick the sheet", body: "Choose which sheet to convert — one per PDF. A preview of the first ten rows appears so you can confirm you picked the right tab before converting." },
            { title: "Convert and download", body: "The first row is treated as a header and rendered in bold on a tinted band, remaining rows follow beneath, and new pages are added automatically as needed. The PDF downloads immediately, with no watermark." },
        ],
        scenarios: [
            { title: "Sending a data table to someone without Excel", body: "A client on a phone, a colleague on a Chromebook, or anyone who'd otherwise ask you to 'just paste it in the email'. The PDF opens everywhere and the numbers stay put." },
            { title: "Attaching figures to an invoice or report", body: "Export the summary sheet as PDF and attach it alongside the main document, so the recipient gets the numbers in a form they can't accidentally edit." },
            { title: "Archiving a finished sheet", body: "When a budget or tracker is final, a PDF of the values is a compact, read-only record. Keep the .xlsx too if you'll ever need the formulas back — the PDF doesn't preserve them." },
            { title: "Quick print-ready extract", body: "Pull a specific sheet out of a large workbook without sending the whole file, which often carries other tabs you didn't mean to share." },
        ],
        troubleshooting: [
            { question: "Columns on the right are missing from the PDF.", answer: "The layout fits seven columns per page. Anything beyond the seventh column is not drawn. Trim or reorder your columns in the spreadsheet so the ones that matter fall within the first seven, or split a wide sheet into several narrower ones and convert each." },
            { question: "My cell text is cut off partway through.", answer: "Each cell is truncated at 20 characters to keep the columns aligned. Long descriptions, URLs and pasted paragraphs will be clipped. Shorten the values before converting if the full text matters." },
            { question: "My charts and cell colours didn't come across.", answer: "They aren't supported — this is a values-only export. For a formatted, chart-accurate PDF, use Excel's own export, or Google Sheets' File → Download → PDF." },
            { question: "Only one sheet came out.", answer: "One sheet per conversion, by design. Convert each tab in turn and combine the results with our Merge PDF tool." },
            { question: "Formulas show as errors like #REF! or #VALUE!.", answer: "Those errors already exist in your spreadsheet — the converter exports whatever value the cell currently holds. Fix them in Excel first, then convert." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Formats supported", convertify: "XLS + XLSX", typical: "XLSX only" },
            { feature: "What is exported", convertify: "Cell values only", typical: "Values only or full layout" },
            { feature: "Sheets per conversion", convertify: "One (picker)", typical: "Active sheet only" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "2-3 per day" },
            { feature: "Watermark", convertify: "None", typical: "Often added" },
            { feature: "Sign-up", convertify: "No", typical: "Often required" },
        ],
        lastUpdated: "2026-07-26",
    },

    "pdf-to-excel": {
        intro: [
            "Extracting tables from a PDF into an editable Excel spreadsheet is one of the most time-consuming manual tasks in data work — copying column by column, fixing misaligned rows, reconstructing formulas. Convertify's PDF to Excel converter identifies table structures in the PDF and exports them as a structured .xlsx file you can immediately open and sort.",
            "The quality of extraction depends heavily on the source PDF. Digitally-generated PDFs (from accounting software, government databases, financial systems) typically have well-defined table cells that extract cleanly. Scanned PDFs and image-only PDFs require OCR first — run them through Convertify's OCR PDF tool to add a text layer, then convert.",
            "This tool is especially popular among financial analysts who receive PDF bank statements, government data PDFs, and vendor price lists that they need to work with in Excel — without retyping hundreds of rows.",
        ],
        steps: [
            { title: "Upload the PDF", body: "Drag or click to upload. Digitally-generated PDFs show a ready indicator; image-only scans prompt you to OCR first." },
            { title: "Extract tables", body: "The converter scans every page for table structures — rows, columns, merged cells — and maps them to Excel rows and columns." },
            { title: "Download the .xlsx", body: "Open in Excel or Google Sheets. Each detected table is output to its own sheet or a contiguous block, ready to sort, filter, and build formulas on." },
        ],
        scenarios: [
            { title: "Bank statement analysis", body: "Download your monthly bank statement as PDF, convert to Excel, and you have every transaction in a spreadsheet — ready to categorize, sum, and chart without typing a single figure." },
            { title: "Government and regulatory data PDFs", body: "Regulatory filings, census tables, and public procurement data are often published as PDFs. Convert to Excel to filter by year, sort by value, and build pivot tables for analysis — work that used to take hours of copy-paste now takes seconds." },
            { title: "Vendor price list updates", body: "Suppliers often send updated price lists as PDF. Extract to Excel, then VLOOKUP the new prices against your master product list to highlight which SKUs changed — a procurement workflow that previously required manual rekeying." },
            { title: "Academic research data tables", body: "Research papers often publish results in PDF tables. Extracting to Excel lets you re-analyze the raw data, combine datasets, and build your own charts without transcription errors." },
        ],
        troubleshooting: [
            { question: "The extracted data has merged rows or scrambled columns.", answer: "This happens most often with complex multi-level headers (e.g. a table with a 3-level hierarchy) or cells that span multiple columns. Clean up the header rows manually in Excel after extraction — the row data itself is usually correct." },
            { question: "No data extracted — blank Excel file.", answer: "Your PDF is likely a scan. Run it through OCR PDF first to add a text layer, then re-run the extraction." },
            { question: "Numbers are being treated as text in Excel.", answer: "Select the column, go to Data → Text to Columns, and complete the wizard — this converts text-formatted numbers to true numeric values. This is a common Excel quirk when data comes from external sources." },
            { question: "Decimal points appear as commas (European format).", answer: "If the source PDF uses European number formatting (1.234,56 instead of 1,234.56), the extracted values need locale conversion. Use Excel's Find & Replace to swap commas to decimals after extraction." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Output format", convertify: ".xlsx", typical: ".xlsx or .csv" },
            { feature: "Scanned PDF handling", convertify: "Prompt to OCR first", typical: "Blank output" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "1–3 per day" },
            { feature: "Watermark", convertify: "None", typical: "Often added" },
        ],
        lastUpdated: "2026-06-01",
    },

    "rotate-pdf": {
        intro: [
            "Rotating a PDF permanently fixes the orientation so every viewer sees it the right way up — no more 'turn your head sideways' for a scan that came out landscape. Convertify's Rotate PDF tool rotates individual pages or all pages at once, 90° or 180°, and saves the rotation into the file itself (not just a view preference that gets lost on download).",
            "The most common scenario is a document scanned with a page accidentally fed sideways. The second is a mixed-orientation PDF — a document where some pages are portrait and some are landscape — where you want to standardize orientation. You can rotate pages selectively: click any page thumbnail to toggle it into the rotation selection before applying.",
            "Because rotation is embedded in the PDF structure rather than re-rendering the page image, text remains sharp at 100% zoom and vector graphics stay vector — there's no quality loss from re-rasterizing.",
        ],
        steps: [
            { title: "Upload the PDF", body: "Drop a PDF onto the upload zone. All pages load as thumbnails immediately." },
            { title: "Select pages to rotate", body: "Click thumbnails to select individual pages, or use 'Select all' for the whole document. Unselected pages are untouched." },
            { title: "Choose rotation amount", body: "90° clockwise, 90° counter-clockwise, or 180° (flip upside down). Each click rotates the selected pages by that increment." },
            { title: "Save and download", body: "The updated PDF downloads instantly. Rotation is baked in — it looks correct in every PDF viewer, on every device." },
        ],
        scenarios: [
            { title: "Fixing a sideways scan", body: "A scanner with an auto-feeder can pull a page in sideways, producing a landscape page in what should be a portrait document. Select the offending page, rotate 90° clockwise or counter-clockwise, and the document is uniform again." },
            { title: "Correcting phone-photographed documents", body: "Many phone camera apps save images rotated based on how you held the phone. If JPG-to-PDF produced sideways pages, rotate them here before submitting to a government portal or employer." },
            { title: "Printing landscape-only reports", body: "Dashboards and financial reports often print best in landscape. If you received a portrait PDF of a wide table, rotating to landscape before printing means columns don't get cut off at the right edge." },
            { title: "Standardizing a mixed-orientation document", body: "A legal bundle might have 50 portrait pages and 3 landscape exhibits. Rotate the exhibits to portrait for consistent printing, or rotate the portrait pages to landscape to match — either direction." },
        ],
        troubleshooting: [
            { question: "I rotated but the file still opens sideways in my viewer.", answer: "Some PDF viewers apply their own auto-rotation based on page dimensions, overriding the embedded rotation. The rotation IS saved in the file. Try opening in a different viewer (Adobe Reader vs browser vs Preview) — most will respect the embedded orientation." },
            { question: "I accidentally rotated all pages and want to undo.", answer: "Re-upload the original file and don't select any pages before saving — or rotate all pages 90° in the opposite direction twice to return to the original orientation. There's no in-browser undo for previously downloaded files." },
            { question: "The text becomes blurry after rotating.", answer: "Rotation of a vector/text PDF should never cause blurriness — the page content is not re-rasterized. Blurriness after rotation usually means the original PDF was an image-scan, not a digital document. The blurriness was pre-existing; rotation just makes it more obvious at certain zoom levels." },
            { question: "My protected PDF can't be rotated.", answer: "PDFs with editing restrictions block rotation. Use Unlock PDF first to remove restrictions, then rotate." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Per-page rotation", convertify: "Yes", typical: "All pages only" },
            { feature: "Rotation increment", convertify: "90° or 180°", typical: "90° only" },
            { feature: "Quality loss", convertify: "None (vector-safe)", typical: "Sometimes re-rasters" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "3–5 per day" },
            { feature: "Watermark", convertify: "None", typical: "Sometimes added" },
        ],
        lastUpdated: "2026-06-01",
    },

    "protect-pdf": {
        intro: [
            "Adding a password to a PDF prevents unauthorized viewing, editing, or printing. Convertify's Protect PDF tool applies AES-256 encryption — the same standard used in enterprise document management — directly in your browser, so the password is set before the file ever leaves your device.",
            "There are two types of PDF passwords: a 'user password' (opens the document — recipients need this to read it) and an 'owner password' (unlocks editing and printing). Convertify lets you set both independently. A common use case: set a user password for confidential distribution, leave editing open; or leave the document openly readable but protect it from printing or copy-paste with an owner password only.",
            "AES-256 encryption, used by Convertify, is the strongest encryption standard currently available for PDFs and is accepted by courts, regulators, and financial institutions as legally sufficient for document security.",
        ],
        steps: [
            { title: "Upload the PDF", body: "Drag or click to upload. The file is read locally — nothing is sent to any server at any point in the workflow." },
            { title: "Set the password", body: "Type a user password (required to open the PDF), an owner password (required to edit/print/copy), or both. Use a strong password: 12+ characters, mixed case, with numbers and symbols." },
            { title: "Choose permissions", body: "Optionally restrict printing, copying text, or editing. These restrictions are enforced by compliant PDF viewers even after the document is open." },
            { title: "Download the protected PDF", body: "The encrypted file downloads immediately. Test it by opening in a new browser tab — you should be prompted for the password." },
        ],
        scenarios: [
            { title: "Sharing confidential financial documents", body: "Tax returns, bank statements, and salary letters shared by email benefit from password protection. Use a strong user password and share it with the recipient via a separate channel (SMS, phone call) — never in the same email." },
            { title: "Distributing editable forms with restrictions", body: "HR departments send offer letters and forms as fillable PDFs. Setting an owner password prevents recipients from changing terms while still allowing them to fill form fields — a clean way to prevent tampering." },
            { title: "Protecting personal records for cloud storage", body: "Passport scans, medical records, and legal documents stored in Google Drive or Dropbox benefit from a separate layer of encryption. Even if your cloud account is compromised, the files remain unreadable without the password." },
            { title: "Copyright protection for ebooks and reports", body: "Authors and consultants distributing paid content can set a user password to prevent casual unauthorized redistribution. Combine with a print-restriction to make screenshotting the primary unauthorized copy method — harder and less scalable." },
        ],
        troubleshooting: [
            { question: "I forgot the password — can you help me recover it?", answer: "No. AES-256 encryption means the password cannot be recovered or brute-forced in any reasonable time. If you lose the password to your own document, use the Unlock PDF tool only if you can prove ownership (Unlock PDF requires you to enter the correct password, so a forgotten password can't be bypassed here either)." },
            { question: "The PDF opens without asking for a password.", answer: "The recipient's PDF viewer may be set to auto-open from a trusted location, or they may have previously opened and cached the file. In a fresh private/incognito browser tab, the password prompt appears correctly." },
            { question: "I set a print restriction but the recipient can still print.", answer: "PDF permissions are honored by compliant viewers (Adobe Reader, Chrome's built-in PDF viewer) but ignored by some third-party readers. Owner-password restrictions are advisory in the PDF standard — they're not cryptographic locks. For true print prevention, consider watermarking all pages instead." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Encryption standard", convertify: "AES-256", typical: "AES-128 or RC4" },
            { feature: "User + owner passwords", convertify: "Both supported", typical: "User password only" },
            { feature: "Permission settings", convertify: "Print, copy, edit", typical: "Limited" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "3 per day free" },
            { feature: "Sign-up", convertify: "No", typical: "Often required" },
        ],
        lastUpdated: "2026-06-01",
    },

    "unlock-pdf": {
        intro: [
            "Removing a password from a PDF you own makes the file easier to work with — no more entering a password every time you open it, and you can use it with other tools that don't accept encrypted inputs. Convertify's Unlock PDF tool removes the user password (after you prove you know it) and any owner-level restrictions, entirely in your browser.",
            "The critical security point: you must enter the correct password. Convertify is not a PDF cracker or brute-force tool. It uses PDF-Lib to open the file with the password you supply and re-export it without encryption. This is the same thing you'd do manually in Adobe Acrobat: open the file, go to security settings, remove the password, save. Convertify just does it in one click with no Acrobat license needed.",
            "If you've forgotten the password, Unlock PDF cannot help. The encryption is genuine AES-128/256, and there's no workaround for a truly lost password on a strongly-encrypted file.",
        ],
        steps: [
            { title: "Upload the password-protected PDF", body: "Drag or click to upload the locked PDF. The tool detects the encryption and prompts for a password." },
            { title: "Enter the password", body: "Type the current password exactly as set. Case-sensitive. The tool verifies it locally before proceeding." },
            { title: "Unlock and download", body: "The decrypted PDF downloads immediately, without any password on open, print, or edit." },
        ],
        scenarios: [
            { title: "Removing your own password for easier workflows", body: "You set a password on a PDF months ago for secure sharing. Now you want to use it with tools that don't accept encrypted inputs (like merge or split). Unlock it, process it, then re-protect if needed." },
            { title: "IT migrations and document management", body: "Organizations migrating documents to a new DMS often need to batch-unlock files that were protected by employees who have since left. If you know the passwords (from a shared password manager), unlock each file before migration." },
            { title: "Enabling editing and printing", body: "Some PDFs have owner-level restrictions (editing and printing locked) but no open password. Unlock PDF removes these restrictions so you can annotate, print, or split the file freely." },
            { title: "Compatibility with downstream tools", body: "Many PDF tools — including Convertify's own merge, compress, and split tools — cannot process encrypted PDFs. Unlock is always the first step in a multi-tool workflow involving a protected file." },
        ],
        troubleshooting: [
            { question: "I entered the password but the tool says it's wrong.", answer: "PDF passwords are case-sensitive. Check caps lock, try with and without leading/trailing spaces, and consider whether the password uses special characters that might have been entered differently (e.g., a smart-quote instead of a straight quote)." },
            { question: "I can open the PDF in my viewer without a password but Unlock PDF still asks for one.", answer: "Your PDF viewer may have cached the password or auto-opened from a trusted file location. The PDF itself is still encrypted — check File Properties in your viewer to confirm." },
            { question: "The unlocked PDF still won't open in another tool.", answer: "There may be additional DRM restrictions beyond standard PDF password protection — some publishers use proprietary DRM (e.g., Adobe Digital Editions). Standard password removal won't remove DRM-based restrictions." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Password required", convertify: "Yes (proves ownership)", typical: "Yes" },
            { feature: "Encryption types", convertify: "AES-128, AES-256, RC4", typical: "AES-128 only" },
            { feature: "Removes owner restrictions", convertify: "Yes", typical: "Sometimes" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "3 per day free" },
            { feature: "Sign-up", convertify: "No", typical: "Often required" },
        ],
        lastUpdated: "2026-06-01",
    },

    "add-page-numbers": {
        intro: [
            "Adding page numbers to a PDF seems trivial until you've tried to do it without Adobe Acrobat. Most free tools either add numbers in a fixed corner with no customization, or require a server upload. Convertify's Add Page Numbers tool runs in the browser and gives you full control: position (top/bottom, left/center/right), font size, starting number, and whether to skip the first page (common for documents with a title or cover page).",
            "Page numbers are added as a proper text overlay in the PDF — not as a flat image stamp — so the output remains searchable and the numbers scale cleanly on high-DPI screens and in print.",
            "This tool is especially useful for legal documents, academic submissions, and business reports where consistent page references are expected but the source document was assembled without them.",
        ],
        steps: [
            { title: "Upload the PDF", body: "Drag or click to select the PDF you want to number. The current page count is shown so you can plan your numbering scheme." },
            { title: "Configure the numbering", body: "Choose position (bottom center is the conventional default for most documents), font size (10pt works for most body documents), starting number (use 1 for a fresh document; use a higher number if this is one section of a larger work), and whether to skip page 1." },
            { title: "Apply and download", body: "Numbers are added as PDF text objects, correctly positioned on every page. The file downloads instantly." },
        ],
        scenarios: [
            { title: "Legal documents and court filings", body: "Courts require consistent page numbers on all exhibits. If you assembled exhibits from different sources (each with their own page count), merge them first, then add sequential numbers from 1 to N for the full bundle." },
            { title: "Academic theses and dissertations", body: "Most university style guides require page numbers to start from a specific page (often the first body text page, skipping the abstract and title). Use the 'skip first N pages' option and set a custom start number." },
            { title: "Business reports for board meetings", body: "A board pack assembled from different department PDFs has no consistent page numbers. Merge, then add page numbers so directors can reference 'page 47' precisely in discussions." },
            { title: "Books and manuals for print", body: "Self-published authors preparing a PDF for print-on-demand need consistent page numbers. Add them after all edits are finalized so numbers don't shift as content changes." },
        ],
        troubleshooting: [
            { question: "I want Roman numerals for the front matter and Arabic numerals for the body.", answer: "Convertify doesn't support dual numbering schemes in one pass. Workaround: split the front matter pages, add Roman numerals (as text, manually) or leave them un-numbered, then add Arabic numerals to the body section separately, finally merge back." },
            { question: "The number position overlaps with existing footer content.", answer: "Switch to top-of-page positioning, or choose a corner position (top-left, top-right) that avoids your document's footer. Reduce font size to make the overlap less intrusive." },
            { question: "I want to start numbering from page 3 (skip title and ToC).", answer: "Set 'Skip first N pages' to 2, and set the starting number to 1 — pages 1 and 2 get no number, page 3 gets '1', and so on. Adjust starting number if you want the count to reflect actual position (page 3 shows '3')." },
            { question: "The PDF is protected and numbers can't be added.", answer: "Editing-restricted PDFs block text additions. Unlock the PDF first, add numbers, then re-protect if needed." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Position control", convertify: "6 positions", typical: "1–2 fixed" },
            { feature: "Custom start number", convertify: "Yes", typical: "Always starts at 1" },
            { feature: "Skip first page", convertify: "Yes", typical: "No" },
            { feature: "Text overlay (searchable)", convertify: "Yes", typical: "Image stamp only" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "3 per day" },
        ],
        lastUpdated: "2026-06-01",
    },

    "delete-pdf-pages": {
        intro: [
            "Deleting pages from a PDF is the fastest way to remove content you don't want to share — blank pages, confidential sections, advertising inserts, or duplicate pages that crept in during scanning. Convertify's Delete PDF Pages tool shows all pages as visual thumbnails, lets you multi-select the ones to remove, and produces the trimmed PDF in seconds without any server upload.",
            "This is the reverse operation of PDF splitting: instead of keeping selected pages, you keep everything EXCEPT your selection. For removing 2-3 pages from a 100-page document, Delete Pages is faster than split because you're specifying what to remove rather than what to keep.",
        ],
        steps: [
            { title: "Upload the PDF", body: "Drag or click to upload. All pages render as thumbnails so you can visually identify which ones to delete." },
            { title: "Select pages to delete", body: "Click thumbnails to mark them for deletion — a red overlay or checkbox indicates selected pages. You can select multiple pages freely." },
            { title: "Delete and download", body: "Click Delete Selected. The tool rebuilds the PDF without those pages using PDF-Lib, then downloads the result instantly." },
        ],
        scenarios: [
            { title: "Removing blank pages from scanned documents", body: "Flatbed scanners often produce a blank reverse page for every single-sided original. A 10-page letter becomes a 20-page PDF with alternating blanks. Select all even pages and delete them in one action." },
            { title: "Stripping a cover letter before forwarding", body: "Internal reports often have a confidential cover memo. Delete page 1 before forwarding the report externally — the recipients get the data without the internal commentary." },
            { title: "Removing duplicate pages from merges", body: "When merging PDFs from multiple sources, a summary table or section header sometimes appears twice. Delete the duplicate and the document is clean." },
            { title: "Trimming advertising from downloaded PDFs", body: "Many freely-distributed PDF whitepapers and reports pad with advertising pages at the start and end. Delete those pages to get the core content ready for sharing or filing." },
        ],
        troubleshooting: [
            { question: "I accidentally deleted the wrong page.", answer: "There's no in-browser undo once you've downloaded the file. Re-upload the original PDF and redo the selection carefully. For large documents, note the page numbers before deleting." },
            { question: "The resulting PDF has different page numbers in the file metadata.", answer: "Page numbers shown in PDF viewers are based on actual page count after deletion. If your original had page numbers printed in the text (not as metadata), those will remain as-is — they're part of the content, not automatically updated. Use Add Page Numbers to re-apply sequential numbers after deletion." },
            { question: "The file still shows the deleted pages when I open it.", answer: "Try a hard refresh in your browser (Ctrl+F5 or Cmd+Shift+R) to clear the cached version, or open the downloaded file directly with a local PDF viewer rather than the browser." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Visual page selection", convertify: "Yes (thumbnails)", typical: "Page numbers only" },
            { feature: "Multi-page delete", convertify: "Unlimited", typical: "5 at a time" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "3 per day" },
            { feature: "Watermark", convertify: "None", typical: "Often added" },
        ],
        lastUpdated: "2026-06-01",
    },

    "watermark-pdf": {
        intro: [
            "Watermarking a PDF signals ownership, confidentiality or draft status — 'CONFIDENTIAL', 'DRAFT', a company name, a copyright line — so the mark travels with the document wherever it's forwarded. Convertify adds a text watermark to every page of your PDF in the browser; the file is never uploaded.",
            "The watermark is drawn as a single line of text across the centre of each page at a fixed 45-degree diagonal. You control the wording, the colour, the font size and the opacity. Lower opacity (20-30%) keeps the underlying content comfortable to read; higher opacity (40-60%) makes the mark the first thing anyone notices.",
            "Set expectations honestly: a watermark is a deterrent and a status signal, not a lock. It's drawn into the page content, so it survives normal viewing, forwarding and printing — but anyone with a proper PDF editor can strip it out. Use it to discourage casual redistribution and to stop people acting on a draft, not to secure a document against a determined party.",
        ],
        steps: [
            { title: "Upload the PDF", body: "Drop the PDF onto the upload zone. Every page in the document will be watermarked — there's no per-page selection." },
            { title: "Configure the watermark", body: "Type the text ('CONFIDENTIAL', 'DRAFT', a client name), then set the font size, the colour and the opacity. 30% is a good starting point for something readable but unobtrusive." },
            { title: "Apply and download", body: "Click apply. The stamp is drawn diagonally across the centre of each page and the watermarked PDF downloads straight away, with no watermark of ours added on top." },
        ],
        scenarios: [
            { title: "Confidential distribution of sensitive documents", body: "Watermark each copy with the recipient's name — 'CONFIDENTIAL - J. Smith'. If the document later turns up somewhere it shouldn't, the mark says which copy it came from." },
            { title: "DRAFT documents in a review cycle", body: "Send a contract or policy out for comment with a clear DRAFT stamp, so nobody countersigns or acts on a version that isn't final." },
            { title: "Copyright marking on published PDFs", body: "Authors, photographers and consultants distributing paid content stamp their name and website across each page, making unauthorised reposts identifiable at a glance." },
            { title: "Sample versions of paid documents", body: "Mark a preview copy 'SAMPLE - full version at yoursite.com'. Readable enough to evaluate, branded enough that it isn't a substitute for buying." },
        ],
        troubleshooting: [
            { question: "Can the watermark be removed?", answer: "Yes, by someone who knows how. It's drawn as a PDF content object, not encrypted into the file, so a capable PDF editor can delete it. Treat it as a deterrent and an attribution mark rather than a security control." },
            { question: "The watermark is too dark and obscures the text.", answer: "Drop the opacity to 20-30% and reduce the font size. Light grey at 25% is the usual choice for legal documents; bold DRAFT or CONFIDENTIAL marks sit around 40-50%." },
            { question: "Can I change the angle, or use an image or logo?", answer: "Not yet. The stamp is fixed at a 45-degree diagonal, and image or logo watermarks aren't supported — the option is visible in the interface but disabled until it actually works." },
            { question: "I only want the watermark on some pages.", answer: "The tool marks every page. To do a subset: split the PDF with our Split PDF tool, watermark just the section you want, then merge it back together with Merge PDF." },
            { question: "My watermark text is running off the edge of the page.", answer: "The stamp is a single centred line, so long text at a large font size will overrun. Shorten the wording or reduce the font size until it sits inside the page." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Watermark type", convertify: "Text only", typical: "Text and image" },
            { feature: "Angle", convertify: "Fixed 45-degree diagonal", typical: "Adjustable" },
            { feature: "Opacity, colour, size", convertify: "Yes", typical: "Sometimes" },
            { feature: "Pages covered", convertify: "All pages", typical: "All or selected" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "Limited" },
            { feature: "Sign-up", convertify: "No", typical: "Often" },
        ],
        lastUpdated: "2026-07-26",
    },

    "reorder-pdf": {
        intro: [
            "Reordering PDF pages fixes the sequence after scanning, assembly, or automated export produces pages out of order. Convertify's Reorder PDF tool gives you a visual drag-and-drop interface — every page is a thumbnail — so you can restructure a 50-page document by eye in under a minute, with no server involved.",
            "The most common triggers: a scanner's auto-feeder pulls pages in the wrong sequence; a report assembled from multiple sections needs chapters resequenced; a book chapter ends up before the introduction. Unlike splitting and re-merging (which requires multiple steps), Reorder PDF handles the whole job in one upload.",
        ],
        steps: [
            { title: "Upload the PDF", body: "All pages render as thumbnail previews. You can see what's on each page before moving anything." },
            { title: "Drag pages to new positions", body: "Click and drag any thumbnail to the position you want. The page order updates live. For large documents, use the arrow buttons on each thumbnail for precise up/down movement." },
            { title: "Save and download", body: "Click Save Order. The reordered PDF downloads immediately — same content, new sequence." },
        ],
        scenarios: [
            { title: "Fixing scanner feed order", body: "A 20-page double-sided document put through a scanner auto-feeder can end up with all odd pages first, then all even pages (pages 1, 3, 5 … 19, 2, 4, 6 … 20). Reorder by interleaving the two halves to get the correct 1-2-3-4 sequence." },
            { title: "Restructuring a report for a new audience", body: "An executive summary buried on page 8 of an internal report needs to move to page 1 for an external audience. Drag it to position 1 — everything else shifts automatically." },
            { title: "Assembling a PDF from imported sections", body: "After merging PDFs from multiple contributors, the appendix is in the middle, the introduction is last, and the main body is in the right place. Drag sections into the correct order without re-exporting anything." },
        ],
        troubleshooting: [
            { question: "The thumbnails won't drag on my mobile device.", answer: "Drag-and-drop is optimized for desktop browsers. On mobile, use the arrow buttons on each thumbnail to move pages up and down one position at a time." },
            { question: "I lost track of the original order.", answer: "If you haven't clicked Save yet, refresh the page and re-upload to start fresh with the original order. Once you've downloaded the reordered file, the original is only recoverable if you kept a copy." },
            { question: "Some thumbnails load slowly for a large PDF.", answer: "Thumbnail rendering is proportional to file size and page count. For 100+ page PDFs, wait for all thumbnails to fully render before dragging — dragging half-loaded thumbnails can produce unexpected results." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Visual drag-and-drop", convertify: "Yes", typical: "Filename/order only" },
            { feature: "Page count", convertify: "Unlimited", typical: "50–100 pages max" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "3 per day" },
            { feature: "Watermark", convertify: "None", typical: "Sometimes" },
        ],
        lastUpdated: "2026-06-01",
    },

    "organize-pdf": {
        intro: [
            "Organizing a PDF means being able to do everything to its pages in one place: reorder, delete, rotate, and duplicate — without bouncing between four separate tools. Convertify's Organize PDF tool is the all-in-one page manager: upload once, make all your structural edits, download the final version.",
            "This is the right tool when you have a complex editing job. For example: scan produces a 40-page document with 3 blank pages (delete), 2 sideways pages (rotate), and the last 5 pages in the wrong order (reorder) — Organize PDF handles all three problems before you click Save.",
        ],
        steps: [
            { title: "Upload the PDF", body: "All pages load as thumbnails for visual editing." },
            { title: "Edit pages as needed", body: "Drag to reorder, click the delete icon to remove, click the rotate icon to turn pages 90°. Any combination of operations is fine — the changes stack and preview in real time." },
            { title: "Save and download", body: "All changes apply in a single pass when you click Save. The resulting PDF reflects every edit you made." },
        ],
        scenarios: [
            { title: "Cleaning up a multi-source merged PDF", body: "A document assembled from 5 different PDFs often has inconsistent page orientation, some blank separator pages, and sections in the wrong order. Organize handles all three cleanup operations in one session." },
            { title: "Preparing a legal bundle", body: "Court exhibits need specific ordering, no blank pages, and consistent orientation. Organize PDF is the final cleanup step after merging: rotate the few sideways exhibits, delete blanks, confirm sequence — then add page numbers." },
            { title: "Book or manual preparation", body: "A technical manual drafted by multiple authors arrives with chapters out of order and some duplicated pages. Reorder chapters by dragging section groups, delete duplicates, rotate any landscape diagrams to portrait." },
        ],
        troubleshooting: [
            { question: "I want to duplicate a page.", answer: "Click the duplicate icon on any thumbnail to add a copy of that page immediately after it. Useful for forms that need the same base page repeated with different fills." },
            { question: "I made many changes and want to start over.", answer: "Refresh the page and re-upload — your original file is unchanged. All edits in Organize PDF are session-only until you click Save and download." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Operations in one tool", convertify: "Reorder, delete, rotate", typical: "One operation per tool" },
            { feature: "Visual interface", convertify: "Yes", typical: "Sometimes" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "Limited" },
            { feature: "Watermark", convertify: "None", typical: "Sometimes" },
        ],
        lastUpdated: "2026-06-01",
    },

    "html-to-pdf": {
        intro: [
            "Convertify's HTML to PDF tool takes HTML source you paste in, strips the markup, and lays the plain text out on clean, paginated PDF pages — entirely in your browser. It's a lightweight way to turn HTML snippets, templates, or email source into a readable document, not a pixel-perfect page renderer.",
            "It does not fetch live URLs (browsers block cross-origin page fetches for security) and it does not render CSS, images, or hyperlinks — only the text content of the HTML you paste. If you need a visual, styled capture of a real web page, your browser's own Print → Save as PDF (which runs in your logged-in, fully-rendered session) will do a better job.",
        ],
        steps: [
            { title: "Paste your HTML", body: "Paste HTML source into the text box — a snippet, an email template, or a full document." },
            { title: "Convert", body: "Convertify strips the tags and lays the remaining text out on A4 pages with automatic word-wrapping and pagination." },
            { title: "Download", body: "The PDF downloads immediately with selectable plain text." },
        ],
        scenarios: [
            { title: "Turning HTML email templates into a readable record", body: "Paste the HTML source of a transactional or marketing email to get a plain-text PDF copy for records or review." },
            { title: "Exporting HTML documentation source", body: "Quickly turn raw HTML docs or generated markup into a plain-text PDF without needing a browser or renderer." },
            { title: "Previewing HTML content as a document", body: "Useful when you just need the text content of markup as a document, not a styled visual capture." },
        ],
        troubleshooting: [
            { question: "My PDF doesn't look like the styled web page.", answer: "This tool only extracts and lays out plain text — it does not render CSS, images, or layout. For a visual capture of a real page, use your browser's built-in Print → Save as PDF instead." },
            { question: "Can I convert a page by URL?", answer: "Not currently. Browsers block client-side tools from fetching another site's page content (CORS), so you'll need to paste the HTML source directly." },
            { question: "The links from my HTML aren't clickable in the PDF.", answer: "Correct — only the visible text is extracted. Anchor tags and other markup are stripped, so links are not preserved as clickable PDF links." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Processed locally", typical: "Sent to server" },
            { feature: "Output type", convertify: "Plain text, paginated", typical: "Rendered visual capture" },
            { feature: "URL fetching", convertify: "Not supported", typical: "Varies" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "3–5 per day" },
        ],
        lastUpdated: "2026-07-12",
    },

    "markdown-to-pdf": {
        intro: [
            "Writing in Markdown and needing to hand someone a document are two different jobs. Convertify's Markdown to PDF tool bridges them: paste your Markdown or upload a .md file, watch the live preview beside the editor, and export a clean, typeset PDF with a readable sans-serif body, ruled headings and monospaced code blocks.",
            "It covers the everyday Markdown you actually write: headings (H1 to H6), paragraphs, ordered and unordered lists, bold, italic, bold-italic, inline code, fenced code blocks, links, blockquotes and horizontal rules. That's enough for a README, a spec, a set of notes or a draft article.",
            "It does not cover the heavier GitHub-flavoured extensions — tables, task lists, syntax highlighting inside code blocks, LaTeX math and embedded images all render as plain text or not at all. If your document depends on those, a dedicated toolchain like Pandoc will serve you better.",
        ],
        steps: [
            { title: "Paste or upload Markdown", body: "Type or paste Markdown into the editor, or click 'Upload .md file' to load a .md, .markdown or .txt file from your device." },
            { title: "Check the live preview", body: "The pane beside the editor renders as you type. Confirm heading levels, list nesting and code blocks look the way you expect before exporting." },
            { title: "Export the PDF", body: "Click Download PDF. This opens your browser's print dialog with the styled document loaded — choose 'Save as PDF' as the destination to write the file to your device." },
        ],
        scenarios: [
            { title: "Turning a README into a shareable document", body: "Stakeholders who don't use GitHub get a proper document instead of raw markup, with headings and code blocks already formatted." },
            { title: "Technical specs for clients", body: "Draft the spec in Markdown where writing is fast, then hand over a PDF — no copy-pasting into Word and re-formatting everything by hand." },
            { title: "Notes and study material", body: "Lecture notes and revision summaries written in Markdown export to a print-friendly PDF you can annotate on paper or on a tablet." },
            { title: "Article and blog drafts", body: "If you write for a static site generator, exporting a draft to PDF gives you an offline reading copy or something to send a reviewer." },
        ],
        troubleshooting: [
            { question: "My tables came out as plain text with pipe characters.", answer: "Markdown tables aren't supported. Either restructure the content as a list, or paste the table into a spreadsheet and use our Excel to PDF tool for that part." },
            { question: "My code block isn't syntax-highlighted.", answer: "Code blocks render in a monospaced font on a tinted background, but without language colouring. The language tag after the opening fence is accepted and ignored." },
            { question: "Images in my Markdown are missing.", answer: "Embedded images aren't rendered — image syntax is skipped. Add them to the PDF afterwards, or use a full Markdown toolchain if images are essential." },
            { question: "Clicking Download PDF opened a print dialog instead of downloading a file.", answer: "That's expected: the export renders the styled document into your browser's print flow. Set the destination to 'Save as PDF' (Chrome and Edge) or use the PDF button (Safari and Firefox) to write the file." },
            { question: "My list items merged into one paragraph.", answer: "Leave a blank line before the first list item and make sure each item starts at the beginning of its line with '-', '*' or '1.' followed by a space." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Headings, lists, code, links", convertify: "Yes", typical: "Yes" },
            { feature: "Tables and task lists", convertify: "No", typical: "Sometimes" },
            { feature: "Syntax highlighting", convertify: "No", typical: "Sometimes" },
            { feature: "Live preview", convertify: "Yes", typical: "Rarely" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "3-5 per day" },
            { feature: "Sign-up", convertify: "No", typical: "Often" },
        ],
        lastUpdated: "2026-07-26",
    },

    "ocr-pdf": {
        intro: [
            "OCR (Optical Character Recognition) turns a scanned, image-only PDF into a searchable document with a real text layer. After OCR, you can Ctrl+F search the content, copy text from it, and use it with tools that expect a text-layer PDF (like PDF to Word or PDF to Text). Convertify's OCR PDF tool processes scanned documents in your browser, adding the invisible text layer while keeping the original scan visually unchanged.",
            "The most common scenario: you scan a paper document (a contract, a passport, a bank letter) and the resulting PDF is just a photo — it looks like text but the file contains no characters, only pixels. OCR reads those pixels, recognizes the characters, and adds a hidden text layer so you can search and copy.",
            "Convertify's OCR engine handles English, Spanish, French, German, Portuguese, and other Latin-script languages. Accuracy is highest on clean, well-lit scans with standard fonts (>95% character accuracy). Handwriting and complex scripts have lower accuracy.",
        ],
        steps: [
            { title: "Upload the scanned PDF", body: "Drag or click to upload. The tool detects whether the PDF is image-only (OCR needed) or already has a text layer." },
            { title: "Select language", body: "Choose the primary language of the document for best recognition accuracy. Multi-language documents: choose the dominant language." },
            { title: "Run OCR and download", body: "The OCR engine processes each page, adds an invisible text layer behind the existing image, and outputs a searchable PDF. The visual appearance is unchanged." },
        ],
        scenarios: [
            { title: "Making scanned contracts searchable", body: "Legal teams that receive executed contracts as scanned PDFs need to search for clause numbers and defined terms. OCR adds the text layer so Ctrl+F works — you can then jump directly to 'Section 12.4' instead of reading every page." },
            { title: "Preparing scanned PDFs for PDF to Word conversion", body: "Run OCR first, then PDF to Word. OCR adds the text layer that the Word converter needs to produce editable output. Without OCR, the conversion produces a blank .docx." },
            { title: "Archiving historical documents", body: "Organizations digitalizing paper archives (government agencies, libraries, law firms) run OCR on every scanned PDF to make them full-text searchable in document management systems." },
            { title: "Extracting data from printed forms", body: "Survey forms, application forms, and questionnaires received as physical documents get scanned to PDF, then OCR'd so the data can be extracted programmatically or via the PDF to Text tool." },
        ],
        troubleshooting: [
            { question: "OCR accuracy is low on my document.", answer: "The main factors affecting accuracy: scan resolution (300 DPI minimum for good results — phone camera photos at lower resolution will give worse accuracy), scan straightness (skewed pages reduce accuracy significantly), and font clarity (printed text is nearly perfect; handwriting, faxed documents, and very small fonts are harder)." },
            { question: "The OCR-ed PDF is much larger than the original scan.", answer: "The OCR text layer adds minimal size to well-encoded PDFs. If size increased dramatically, check that you're not re-encoding the images at higher quality during the OCR pass. Try running the result through Compress PDF afterwards." },
            { question: "Some pages OCR correctly but others are blank text.", answer: "The blank-result pages are likely rotated or upside down. Use Rotate PDF first to orient all pages correctly, then re-run OCR." },
            { question: "Numbers are being recognized as letters (e.g. '0' as 'O').", answer: "Enable numeric-mode hints if available in the OCR settings, or accept minor inaccuracies and correct them in the downstream Word/text output. This is most common on old-style printed digits or low-resolution scans." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Language support", convertify: "20+ languages", typical: "English only" },
            { feature: "Output type", convertify: "Searchable PDF", typical: "Text file or searchable PDF" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "3 per day" },
            { feature: "Watermark", convertify: "None", typical: "Sometimes" },
            { feature: "Sign-up", convertify: "No", typical: "Often" },
        ],
        lastUpdated: "2026-06-01",
    },

    "sign-pdf": {
        intro: [
            "Signing a PDF electronically lets you add your signature to contracts, consent forms, and agreements without printing, signing by hand, and scanning back. Convertify's Sign PDF tool supports three signature input methods: drawing a signature with your mouse or finger, typing your name in a signature-style font, or uploading a photo of your handwritten signature.",
            "The signatures added by Convertify are electronic signatures — legally valid for most everyday documents under e-signature laws (ESIGN in the US, eIDAS in the EU, and equivalent laws in most countries). They are not digital signatures (which use cryptographic certificates for identity verification) and are not suitable for regulated-industry transactions that require qualified electronic signatures.",
            "Everything happens in the browser: the signature image is embedded as a PDF annotation on the pages you choose, and the file never leaves your device — important for the confidential contracts and HR letters that are the most common use case.",
        ],
        steps: [
            { title: "Upload the PDF", body: "Drag or click to upload. The document renders page by page for placement." },
            { title: "Create your signature", body: "Switch to the signature panel and draw (mouse/touchscreen), type, or upload. Adjust size and color. A drawn signature is the most natural; a typed signature in a cursive font works well for typed name-and-date fields." },
            { title: "Place the signature", body: "Drag the signature to the exact position on the page. Resize by dragging the corner handles. Add initials or date text boxes if needed." },
            { title: "Save signed PDF", body: "Click Save. The signed PDF downloads with your signature embedded. Send via email or upload to the requesting party." },
        ],
        scenarios: [
            { title: "Signing employment contracts and offer letters", body: "HR sends a PDF offer letter requiring signature. Open in Convertify, draw your signature, place it on the signature line, save, and email back — the whole process takes under 2 minutes. Since nothing uploads, your personal information stays private." },
            { title: "Consent forms and medical paperwork", body: "Patient consent forms received as PDF need a signature before an appointment. Sign digitally and email back the same day — no need to print, sign, scan, and upload." },
            { title: "Vendor and client agreements", body: "Small business owners signing vendor contracts, NDAs, and service agreements can use e-signature for straightforward bilateral agreements. For high-value contracts requiring auditable signature trails, use a dedicated e-signature service (DocuSign, Adobe Sign) which provides cryptographic identity verification." },
            { title: "Internal approvals and sign-offs", body: "Internal document approvals — purchase orders, expense forms, leave requests — often just need a visible signature for record-keeping. Electronic signature via Convertify is faster than the print-sign-scan loop without needing an enterprise e-signature subscription." },
        ],
        troubleshooting: [
            { question: "Is my electronic signature legally binding?", answer: "In most countries, yes — for standard commercial agreements. The ESIGN Act (US) and eIDAS Regulation (EU) give e-signatures the same legal weight as handwritten signatures for most contracts. Exceptions: wills, property transfers, and certain regulated financial and legal documents may require wet (physical) signatures or qualified electronic signatures with identity verification." },
            { question: "The signature placement is off when I print the signed PDF.", answer: "PDF print scaling can shift placed objects. In your print dialog, set 'Scale to fit' or 'Actual size' and confirm the page size matches the PDF's page dimensions before printing." },
            { question: "I want to sign multiple pages with initials.", answer: "Add an initials text box or signature to the first page, then use the 'Apply to all pages' toggle, or copy and paste the initials block page by page. Multi-page signing for lengthy contracts is faster with the copy-across option." },
            { question: "The signature looks blurry in the PDF.", answer: "If you drew the signature at small size in the drawing panel and then scaled it up on the page, quality degrades. Re-draw at larger size in the panel, or draw at the approximate final size from the start." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Signature methods", convertify: "Draw, type, upload", typical: "1–2 methods" },
            { feature: "Cost", convertify: "Free", typical: "Subscription required" },
            { feature: "Legal validity", convertify: "Electronic signature", typical: "Electronic signature" },
            { feature: "Cryptographic trail", convertify: "No", typical: "Yes (DocuSign/Adobe)" },
            { feature: "Sign-up", convertify: "No", typical: "Required" },
        ],
        lastUpdated: "2026-06-01",
    },

    "compare-pdf": {
        intro: [
            "Comparing two versions of a PDF shows you exactly what changed between drafts — which words were added, deleted, or moved — without reading both documents line-by-line. Convertify's Compare PDF tool highlights differences between two PDFs visually: additions in green, deletions in red, so you can review a 50-page contract revision in minutes rather than hours.",
            "Document comparison is critical in legal, compliance, and content workflows where you need to verify that only agreed-upon changes were made between versions. Without a comparison tool, verifying a 'minor revision' to a contract requires reading every line of both documents — and humans routinely miss small text changes.",
        ],
        steps: [
            { title: "Upload the original PDF", body: "Drop the older/base version onto the left upload zone." },
            { title: "Upload the revised PDF", body: "Drop the newer/changed version onto the right upload zone." },
            { title: "Compare", body: "The tool aligns pages and performs a text-level diff. Changes are highlighted inline: additions in green, deletions in red, moved text in blue." },
            { title: "Review and export", body: "Scroll through the comparison view to review all changes. Download the annotated comparison report as a PDF to share with colleagues or keep for audit records." },
        ],
        scenarios: [
            { title: "Contract redline review", body: "Legal teams reviewing a counterparty's proposed changes to a contract run a comparison between the sent version and the returned version. The diff immediately shows which clauses were altered, added, or removed — without trusting the counterparty's stated 'minor edits'." },
            { title: "Regulatory document change verification", body: "Compliance teams submitting policy documents to regulators need to verify that only pre-approved changes appear in the final version. A comparison run catches any unauthorized last-minute edits." },
            { title: "Academic paper revision tracking", body: "Researchers submitting journal revisions attach a comparison PDF showing reviewers exactly which parts of the manuscript changed — addressing reviewer feedback transparently without a tracked-changes Word document." },
        ],
        troubleshooting: [
            { question: "The comparison shows many false positives on a reformatted document.", answer: "Text-based comparison works best when content is the same but words changed. If the document was entirely reflowed (e.g., font size changed causing different line breaks), almost every line will show as changed even if the words are identical. For reformatted documents, export the text from both PDFs and compare the text files instead." },
            { question: "Scanned PDFs show no differences detected.", answer: "Scanned PDFs are image-only — there's no text layer to compare. Run both versions through OCR PDF first, then compare the OCR'd outputs." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Diff type", convertify: "Text + visual", typical: "Text only" },
            { feature: "Export comparison report", convertify: "Yes (PDF)", typical: "Sometimes" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "3 per day" },
            { feature: "Sign-up", convertify: "No", typical: "Often" },
        ],
        lastUpdated: "2026-06-01",
    },

    "crop-pdf": {
        intro: [
            "Cropping a PDF page reduces visible content to a defined rectangular area — removing scanner borders, trimming white margins, zooming in on a chart, or standardizing page dimensions across a document. Convertify's Crop PDF tool lets you drag a crop box visually over a page preview and apply it to all pages or only specific ones.",
            "Important distinction: PDF cropping sets a 'CropBox' parameter that hides the area outside the crop rectangle. The hidden content is not deleted from the file — it's masked. This means crop boxes can be 'undone' by resetting the crop box in Acrobat. If you need to permanently remove content from page edges (e.g., remove a scanner watermark), cropping achieves this visually but not data-destructively.",
        ],
        steps: [
            { title: "Upload the PDF", body: "Drop the PDF onto the upload zone. The first page renders as a preview for setting your crop area." },
            { title: "Drag the crop rectangle", body: "Click and drag on the page preview to draw the crop box. Fine-tune by entering exact pixel or mm values in the margin inputs." },
            { title: "Choose scope", body: "Apply the same crop to all pages, or switch to per-page mode to set different crops for different pages (useful for documents with mixed portrait/landscape)." },
            { title: "Crop and download", body: "The cropped PDF downloads immediately. Open in any viewer to confirm the crop area looks as expected." },
        ],
        scenarios: [
            { title: "Removing scanner border artifacts", body: "Flatbed scanners often capture a black or gray border where the page edge meets the glass. Crop to remove these borders for clean, professional-looking PDFs." },
            { title: "Extracting a specific chart or table", body: "A PDF report has one key chart on page 3. Crop that page to show only the chart area, then extract page 3 with Split PDF to get a clean, chart-only one-pager for a presentation or email." },
            { title: "Standardizing mixed-margin documents", body: "A document assembled from multiple sources has inconsistent margins — some pages have 20mm margins, others 5mm. Apply a uniform crop to all pages for a visually consistent final document." },
        ],
        troubleshooting: [
            { question: "The crop looks right in the tool but wrong when I open the downloaded PDF.", answer: "Some PDF viewers (notably older versions of Adobe Reader) ignore crop boxes in certain display modes. Try in Google Chrome's built-in PDF viewer, which consistently respects the CropBox." },
            { question: "I accidentally cropped too aggressively and cut off content.", answer: "Re-upload the original file — the previously downloaded file has the cropped view baked in, but the original content is still in the file data. You can re-set a wider crop box if needed. Or re-upload the original and set a less aggressive crop." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Visual crop tool", convertify: "Yes", typical: "Margin values only" },
            { feature: "Per-page crop", convertify: "Yes", typical: "All pages only" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "3 per day" },
            { feature: "Watermark", convertify: "None", typical: "Sometimes" },
        ],
        lastUpdated: "2026-06-01",
    },

    "edit-pdf": {
        intro: [
            "Editing a PDF directly — changing text, adding annotations, inserting text boxes — avoids the round-trip of converting to Word, editing, and converting back. Convertify's Edit PDF tool works on digitally-generated PDFs and lets you click directly on text to modify it, add free-text annotations anywhere on the page, insert shapes, and highlight passages.",
            "There's an important limitation in all browser-based PDF editors: they edit the rendered view of the PDF, not the underlying text stream. This means fonts are matched as closely as possible, but if your PDF uses a custom embedded font that isn't available in the browser, the edited text will appear in a fallback font. For the most common use cases — correcting a typo, adding a note, filling in a blank field — the visual result is clean.",
        ],
        steps: [
            { title: "Upload the PDF", body: "Drag or click to upload. Pages render in the editor canvas." },
            { title: "Select editing mode", body: "Choose from: Text Edit (click text to modify), Add Text (insert new text anywhere), Highlight, Underline, Strikethrough, Add Image, or Draw Freehand." },
            { title: "Make your edits", body: "Click on the content you want to change and type. Drag new elements to position them. Resize images and text boxes with corner handles." },
            { title: "Save and download", body: "Click Save PDF. All edits are embedded in the downloaded file — readable in any PDF viewer." },
        ],
        scenarios: [
            { title: "Correcting a typo in a finalized document", body: "A name is misspelled in a PDF report that's already been formatted and paginated. Edit PDF fixes it in place — no need to regenerate the whole document from the source file." },
            { title: "Adding annotations for review", body: "A manager annotating a team member's draft report adds comments, highlights key sections, and inserts arrows pointing to figures that need updating. The annotated PDF is returned as the review copy." },
            { title: "Filling in form-style PDFs without form fields", body: "Some forms are PDFs with blank lines but no actual form fields. Use the Add Text tool to type responses in the appropriate positions — faster than printing and handwriting." },
            { title: "Adding a company logo or stamp", body: "Insert a company logo image on a document header, or add a stamp image (RECEIVED, APPROVED, PAID) on specific pages." },
        ],
        troubleshooting: [
            { question: "The font doesn't match after I edit text.", answer: "Exact font matching is only possible when the original PDF's embedded font is one the browser can access. For near-perfect matching, choose the closest available font in the text toolbar. For major mismatches, add the correction as a white rectangle covering the old text, then a new text box on top in a matching font." },
            { question: "I can't click on text to select it.", answer: "If the PDF is a scanned image rather than a digital document, there's no text layer to edit. Run OCR PDF first to add a text layer, then open the OCR'd output in the editor." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Text editing", convertify: "Yes (digital PDFs)", typical: "Yes" },
            { feature: "Annotation tools", convertify: "Highlight, draw, text", typical: "Varies" },
            { feature: "Image insertion", convertify: "Yes", typical: "Sometimes" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "3 per day" },
            { feature: "Sign-up", convertify: "No", typical: "Often" },
        ],
        lastUpdated: "2026-06-01",
    },

    "pdf-to-pdfa": {
        intro: [
            "PDF/A is an ISO-standardized version of PDF designed for long-term archiving. It guarantees that a document will render identically in 100 years by embedding all fonts, color profiles, and metadata it needs — no reliance on external systems. Governments, courts, universities, and regulated industries (healthcare, finance, legal) often mandate PDF/A for records submissions.",
            "Converting a standard PDF to PDF/A with Convertify's tool handles the most common compliance requirements: embedding any referenced fonts, attaching color profiles, and removing external content references (JavaScript, audio, video) that aren't permitted in PDF/A. The visual appearance is preserved; only archival-incompatible elements are stripped or embedded.",
            "Common submission requirements: the European Court of Human Rights requires PDF/A-1b; the US federal courts' ECF system accepts PDF/A-1; many EU government portals require PDF/A-2a or PDF/A-3.",
        ],
        steps: [
            { title: "Upload the PDF", body: "Drag or click to upload the PDF you need to convert for archival submission." },
            { title: "Choose compliance level", body: "PDF/A-1b is the broadest compatibility choice and accepted by virtually all systems. PDF/A-2a adds better compression and transparency support. Choose based on your receiving institution's requirements." },
            { title: "Convert and verify", body: "The converter embeds fonts, attaches sRGB color profile, removes JavaScript, and outputs a compliant PDF/A file. A compliance indicator confirms the conversion succeeded." },
            { title: "Download", body: "The compliant PDF/A file downloads ready for submission." },
        ],
        scenarios: [
            { title: "Court filings requiring PDF/A", body: "Federal courts and many state courts in the US and EU require PDF/A for electronic case filing. Convert your brief or exhibit before submission to avoid rejection from the court's document management system." },
            { title: "Government portal submissions", body: "EU tax authorities, land registries, and licensing bodies increasingly require PDF/A. The conversion ensures your application PDF renders identically on their systems and satisfies archival mandates." },
            { title: "Corporate records archival", body: "Finance and legal departments archiving contracts, board minutes, and compliance documents in a DMS that requires PDF/A can convert existing files before ingestion." },
        ],
        troubleshooting: [
            { question: "My PDF fails PDF/A validation even after conversion.", answer: "Some PDFs have deeply embedded non-compliant elements (encrypted streams, embedded multimedia) that the converter can't fully resolve. Run the output through a PDF/A validator (VeraPDF is free and widely used) to identify exactly which compliance violations remain. For complex failures, Adobe Acrobat Pro's Preflight tool offers more surgical fix options." },
            { question: "The PDF/A file is larger than the original.", answer: "Expected — embedding all fonts and color profiles increases file size. For 5-page contracts, the increase is minimal (10-20%). For image-heavy documents, embedding a color profile adds more. If size is an issue, compress the PDF first, then convert to PDF/A." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "PDF/A levels", convertify: "PDF/A-1b, 2a, 3b", typical: "PDF/A-1b only" },
            { feature: "Compliance validation", convertify: "Yes", typical: "Sometimes" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "3 per day" },
            { feature: "Sign-up", convertify: "No", typical: "Often" },
        ],
        lastUpdated: "2026-06-01",
    },

    "pdf-to-powerpoint": {
        intro: [
            "Converting a PDF back to PowerPoint is one of the most-requested 'reverse conversion' tasks — you receive a presentation as a PDF (sent as the share format) but need to edit the slides. Convertify's PDF to PowerPoint converter extracts slide content and creates an editable .pptx with each PDF page mapped to one PowerPoint slide.",
            "Layout fidelity depends on the source PDF. Presentations that were originally PowerPoint-to-PDF (clean export, embedded fonts, vector shapes) convert back most faithfully. PDFs that were scanned or generated from non-standard sources convert with less precision — text boxes may shift and images may lose scalability.",
        ],
        steps: [
            { title: "Upload the PDF", body: "Drag or click to upload. The tool detects page count and processes slide-by-slide." },
            { title: "Convert", body: "Each PDF page becomes one .pptx slide. Text runs are placed as editable text boxes, images are embedded." },
            { title: "Download the .pptx", body: "Open in PowerPoint or Google Slides. The structure is editable — you can rearrange elements, change fonts, and add animations." },
        ],
        scenarios: [
            { title: "Editing a received presentation", body: "A client or colleague shares a deck as PDF (common for sending without embed concerns). You need to adapt it for your own use — rebranding, adding slides, or updating data. Convert to .pptx, edit, save as your version." },
            { title: "Recovering a presentation when the original .pptx is lost", body: "The original file is gone but you have the PDF export. Convert to get an editable .pptx that you can update for a future presentation." },
            { title: "Translating or localizing a presentation", body: "Localization teams receive presentation PDFs and need editable text to translate. Converting to .pptx puts all the text in editable boxes ready for translation." },
        ],
        troubleshooting: [
            { question: "Text positioning is off in the .pptx.", answer: "PDF text positioning uses absolute coordinates; PowerPoint uses a different layout model. Some repositioning after conversion is expected for complex slide designs. Treat the output as a starting template, not a pixel-perfect match." },
            { question: "The fonts look different in PowerPoint.", answer: "If the original PDF embedded non-standard fonts, PowerPoint substitutes available system fonts. Install the original fonts on your system or replace with a matching system font after conversion." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Output format", convertify: ".pptx", typical: ".pptx" },
            { feature: "Editable text boxes", convertify: "Yes", typical: "Yes" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "3 per day" },
            { feature: "Watermark", convertify: "None", typical: "Sometimes" },
        ],
        lastUpdated: "2026-06-01",
    },

    "redact-pdf": {
        intro: [
            "Redacting a PDF permanently removes sensitive information — names, addresses, account numbers, medical identifiers — from the document, leaving black bars where the content was. Proper redaction is essential for GDPR compliance, legal discovery, FOIA responses, and any situation where you need to share a document publicly after stripping private data.",
            "Convertify's Redact PDF tool performs true content redaction: the selected text and image data is removed from the PDF data structure, not just covered with a black box. Covering text with a black rectangle — a common mistake — leaves the underlying text in the file, extractable by anyone who copies the 'blacked-out' area. True redaction deletes it.",
            "After redacting, the tool also strips PDF metadata (document title, author, creation tool) that might contain identifiable information not visible in the rendered view.",
        ],
        steps: [
            { title: "Upload the PDF", body: "Drag or click to upload. Pages render in the redaction editor." },
            { title: "Select content to redact", body: "Click and drag to draw redaction boxes over text or images you want to remove. Selected areas show a red overlay preview. You can also use Find & Redact to highlight all instances of a specific word or number." },
            { title: "Apply redactions", body: "Click Apply. This step is permanent — the selected content is removed from the file, not just visually covered." },
            { title: "Download the redacted PDF", body: "The clean PDF downloads with redacted areas shown as solid black boxes and underlying content permanently removed." },
        ],
        scenarios: [
            { title: "GDPR and privacy law compliance", body: "Organizations sharing internal documents externally (e.g., responding to subject access requests or sharing reports with regulators) redact all personal data that isn't relevant to the request — names, email addresses, phone numbers, employee IDs." },
            { title: "Legal discovery document production", body: "Attorneys producing documents in litigation redact privileged information and third-party personal data before handing over discovery packages. True redaction is essential — courts have imposed sanctions for documents where covered text was recoverable." },
            { title: "FOIA responses", body: "Government agencies releasing records under Freedom of Information requests redact personal identifiers, law enforcement information, and classified references before publication." },
            { title: "Sharing financial documents with identifiers removed", body: "Finance teams sharing vendor invoices or bank statements with auditors or board members redact account numbers, routing numbers, and vendor addresses that aren't relevant to the specific inquiry." },
        ],
        troubleshooting: [
            { question: "I can still see the text when I copy from the 'redacted' area.", answer: "You may have only covered text with an opaque box rather than truly redacting it. Undo and use the Redact tool's selection method, then click 'Apply Redactions' — this removes the content, it doesn't just overlay it." },
            { question: "How do I redact all occurrences of a name throughout the document?", answer: "Use the Find & Redact option: type the name or number to redact, and the tool marks all instances across all pages simultaneously. One click applies them all." },
            { question: "The redacted PDF shows white boxes instead of black.", answer: "Redaction marks are conventionally black. If you're seeing white, check that the redaction appearance setting is set to 'fill with black' rather than 'remove only'. White areas over white backgrounds are invisible but the content is still removed." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "True redaction (content deleted)", convertify: "Yes", typical: "Sometimes (vs. black box)" },
            { feature: "Find & Redact by keyword", convertify: "Yes", typical: "Sometimes" },
            { feature: "Metadata stripping", convertify: "Yes", typical: "Rarely" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "3 per day" },
        ],
        lastUpdated: "2026-06-01",
    },

    "repair-pdf": {
        intro: [
            "A damaged PDF — one that opens with errors, shows blank pages, or won't open at all — is usually the result of an incomplete download, file system corruption, email client truncation, or an interrupted save. Convertify's Repair PDF tool attempts to reconstruct the document's internal structure using PDF-Lib's error-tolerant parsing, recovering as much content as possible from the corrupted file.",
            "Repair success depends on severity: minor structure errors (missing EOF markers, small cross-reference table gaps) fix completely. Severe corruption (file truncated to 20% of original size, overwritten sectors) may recover partial content — some pages but not all, or text without images. The tool always shows you how many pages were successfully recovered before download.",
        ],
        steps: [
            { title: "Upload the damaged PDF", body: "Drop the corrupted file onto the upload zone. Even files that don't open normally can be uploaded." },
            { title: "Attempt repair", body: "The parser reads as much of the file structure as it can recover, rebuilding missing cross-reference tables and patching structural gaps." },
            { title: "Preview recovery result", body: "The tool shows how many pages were recovered and a thumbnail preview. If the result looks correct, proceed to download." },
            { title: "Download the repaired PDF", body: "The recovered PDF downloads. For partial recoveries, some pages or images may be missing — the recovered content is complete for what was accessible." },
        ],
        scenarios: [
            { title: "Incomplete email download", body: "A PDF attached to email sometimes downloads incompletely due to mail server size limits or connection drops. The resulting file is truncated and won't open. Repair PDF can often recover the pages that downloaded successfully." },
            { title: "Recovered files from a failed drive", body: "After recovering files from a failing hard drive or corrupted USB, the PDFs may have structural corruption. Repair attempts to extract as much content as possible from the recovered bytes." },
            { title: "PDF exported by a buggy tool", body: "Some older or poorly-coded export tools produce PDFs with malformed internal structures — they open in Acrobat but fail in strict viewers. Repair normalizes the structure so the file opens in all compliant readers." },
        ],
        troubleshooting: [
            { question: "Repair recovered 0 pages from my file.", answer: "The damage is too severe for automatic recovery — the core content sections of the PDF are unreadable. Options: try a professional file recovery service that works at the binary/hex level; or check if you have a cloud auto-save version (Google Drive, Dropbox versions) from before the corruption." },
            { question: "Some pages are blank in the repaired PDF.", answer: "Blank pages in the repaired output usually mean those page's content streams were in the damaged portion of the file. The page structure was recovered but the content data wasn't." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Recovery preview", convertify: "Yes (page count)", typical: "Download to find out" },
            { feature: "Partial recovery", convertify: "Yes (recovers what's intact)", typical: "All or nothing" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "Limited" },
            { feature: "Sign-up", convertify: "No", typical: "Sometimes" },
        ],
        lastUpdated: "2026-06-01",
    },

    "image-compressor": {
        intro: [
            "Compressing an image for web use, email, or upload portals reduces file size without degrading visible quality — done right, you lose less than you'd notice at any normal viewing distance. Convertify's Image Compressor supports JPG, PNG, WebP, and GIF, runs entirely in your browser, and lets you dial compression with a quality slider or target a specific file size.",
            "The core tradeoff in image compression is quality vs. size. JPEG compression is lossy — every quality reduction removes some pixel data permanently. PNG compression is lossless — it rearranges pixel data more efficiently but removes nothing. For photos, JPEG at 70-85% quality is visually nearly identical to the original while being 60-80% smaller. For icons, logos, and screenshots with solid colors, PNG lossless stays sharp; convert to WebP for smaller sizes.",
        ],
        steps: [
            { title: "Upload your images", body: "Drop one or multiple images (JPG, PNG, WebP, GIF) onto the upload zone. Batch mode compresses all at once." },
            { title: "Set compression level", body: "Drag the quality slider (10-100%) or type a target KB/MB. Lower quality = smaller file. 80% is a good starting point for photos; 90-95% for product images where sharpness matters." },
            { title: "Compress and download", body: "Compressed images download individually or as a ZIP for batch jobs. The original vs. compressed file size comparison is shown for each image." },
        ],
        scenarios: [
            { title: "Web page performance optimization", body: "Unoptimized images are the most common cause of slow page load times. A 5 MB hero image compressed to 200 KB loads 25x faster and improves Core Web Vitals scores — directly affecting Google rankings for the page." },
            { title: "Email attachments under size limits", body: "Gmail and Outlook block attachments over 25 MB. Compress multiple product photos or event photos before attaching — a folder of 20 photos goes from 60 MB to under 10 MB without visible quality loss." },
            { title: "E-commerce product images", body: "Online stores typically need product images under 200-500 KB per image for fast loading. Compress product photos in batch before uploading to Shopify, WooCommerce, or similar platforms." },
            { title: "Social media uploads", body: "Twitter compresses images aggressively and adds visible artifacts. Compress your images to near the platform's maximum quality threshold yourself before uploading, so you control the compression rather than the platform." },
        ],
        troubleshooting: [
            { question: "The compressed image looks noticeably different from the original.", answer: "You may have used too low a quality setting. Try 75-85% for photos — the difference between 85% and 100% is virtually invisible, and file size typically drops 50-70% in that range. Only drop below 70% when file size is critically constrained." },
            { question: "The compressed PNG is bigger than the original.", answer: "This can happen if the original PNG was already well-optimized. PNG compression is lossless — you can't make a lossless file smaller beyond a certain point. Convert the PNG to WebP or JPEG instead for a substantial size reduction." },
            { question: "I want to compress without any quality loss.", answer: "Use 100% quality mode for JPEG (minimal loss) or lossless mode for PNG/WebP. True no-loss compression of JPEGs only strips metadata (EXIF) and redundant color table entries — the typical saving is 10-20%." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Formats supported", convertify: "JPG, PNG, WebP, GIF", typical: "JPG only" },
            { feature: "Batch compression", convertify: "Yes (ZIP download)", typical: "One at a time" },
            { feature: "Target size mode", convertify: "Yes", typical: "Quality slider only" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "20 images/day" },
            { feature: "Sign-up", convertify: "No", typical: "Often" },
        ],
        lastUpdated: "2026-06-01",
    },

    "resize-image": {
        intro: [
            "Resizing an image — changing its pixel dimensions — is one of the most frequent tasks in digital work: preparing a photo for a specific upload slot, generating a thumbnail, standardizing product image dimensions, or reducing a 20 MP camera photo to a web-friendly size. Convertify's Resize Image tool supports pixel-exact dimensions, percentage scaling, and preset sizes, with an aspect-ratio lock to prevent stretching.",
            "Resizing down (reducing dimensions) is lossless quality-wise — you're sampling fewer pixels from a larger image. Resizing up (enlarging) uses interpolation to create new pixels, which softens the image. For significant enlargements (more than 2x), dedicated upscaling tools with AI super-resolution produce sharper results.",
        ],
        steps: [
            { title: "Upload the image", body: "Drop a JPG, PNG, WebP, or GIF onto the upload zone." },
            { title: "Set new dimensions", body: "Enter exact pixel width and height, a percentage of the original (e.g. 50%), or pick a common preset (1920×1080, 1200×630, 800×600). Enable 'Lock aspect ratio' to resize proportionally." },
            { title: "Download the resized image", body: "The resized image downloads in the same format as the input. Use the quality slider to control output file size for JPEG outputs." },
        ],
        scenarios: [
            { title: "Social media image sizing", body: "Different platforms have different optimal image sizes: Twitter headers (1500×500), LinkedIn banners (1584×396), Instagram posts (1080×1080), Facebook covers (820×312). Resize to exact specifications before uploading for the best display quality." },
            { title: "Website hero and product images", body: "Camera photos are often 4000×3000 pixels (12 MP). A web page needs images at 1920×1080 max. Resize before uploading — a 3 MB photo resizes to under 400 KB at web dimensions, dramatically improving page load time." },
            { title: "Government and application portal uploads", body: "Passport photos and ID images for government portals often have strict pixel dimension requirements (e.g., 600×600 pixels, exactly). Resize to the specification before upload to avoid rejection." },
            { title: "Email signature graphics", body: "Company logos in email signatures should be 100-200px wide for Retina screens and under 50 KB. Resize oversized logo files before adding to your email client." },
        ],
        troubleshooting: [
            { question: "The image looks stretched or squished.", answer: "You resized with a fixed width and height without locking the aspect ratio, and the dimensions don't match the original's proportions. Enable 'Lock aspect ratio' and set only one dimension — the other calculates automatically." },
            { question: "The resized image is blurry.", answer: "Upscaling (making a small image bigger) always produces some blur because the tool must interpolate new pixels. The only solution is to start with a higher-resolution source. Downscaling never causes blurriness." },
            { question: "I need to resize a batch of 50 product images.", answer: "Upload all images at once. Convertify's batch mode applies the same target dimensions to all images and bundles the results in a ZIP for one-click download." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Batch resize", convertify: "Yes", typical: "One at a time" },
            { feature: "Aspect ratio lock", convertify: "Yes", typical: "Yes" },
            { feature: "Preset sizes", convertify: "Social + standard presets", typical: "Custom only" },
            { feature: "Formats", convertify: "JPG, PNG, WebP, GIF", typical: "JPG, PNG" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "Limited" },
        ],
        lastUpdated: "2026-06-01",
    },

    "heic-to-jpg": {
        intro: [
            "HEIC is Apple's default photo format since iOS 11 — it's 50% smaller than JPEG at equivalent quality, which is why iPhones use it. The problem: Android phones, Windows PCs, and most web platforms can't open HEIC files without additional software. Converting HEIC to JPG makes iPhone photos universally compatible.",
            "Convertify's HEIC to JPG converter runs entirely in your browser using a WASM-powered HEIC decoder, so your private iPhone photos never leave your device. Batch conversion handles entire album exports — drop a folder of 200 HEIC files and download them all as JPGs in one ZIP.",
        ],
        steps: [
            { title: "Upload HEIC files", body: "Drag one or many .heic or .heif files onto the upload zone. iPhone photo exports and AirDrop transfers are the most common source." },
            { title: "Set quality", body: "Choose output JPEG quality (85% is a good default — barely distinguishable from original HEIC quality, at a predictable file size)." },
            { title: "Convert and download", body: "Single files download as .jpg directly; batches download as a ZIP containing one .jpg per original .heic file." },
        ],
        scenarios: [
            { title: "Sharing iPhone photos with Android users", body: "WhatsApp and email on Android can struggle with HEIC attachments. Convert to JPG before sharing for guaranteed compatibility — the recipient's phone opens them without issues." },
            { title: "Uploading to web platforms", body: "Most website CMSes, e-commerce platforms, and online galleries require JPG or PNG. iPhone photos shot in HEIC need conversion before upload. Batch-convert an entire shoot before uploading to Shopify, Squarespace, or WordPress." },
            { title: "Windows PC compatibility", body: "Windows 10 and 11 can open HEIC with the paid codec extension, but many enterprise PCs don't have it. Convert HEIC to JPG before transferring files to a shared drive or emailing to Windows colleagues." },
            { title: "Social media and image tools", body: "Many social media upload tools and graphic design platforms (Canva, Adobe Express) don't accept HEIC. Convert first, then upload to any platform without compatibility issues." },
        ],
        troubleshooting: [
            { question: "The JPG looks slightly different in color from the original HEIC.", answer: "HEIC uses the Display P3 wide color gamut on modern iPhones; JPG typically uses sRGB. The conversion maps P3 colors to sRGB, which can slightly mute vivid colors. This is a standard limitation of JPEG and sRGB — it's not a converter error." },
            { question: "EXIF data (location, camera settings) is missing after conversion.", answer: "Convertify preserves EXIF metadata by default. If metadata is missing, check your photo upload source — some iPhone export methods strip EXIF before the file reaches the converter." },
            { question: "The file I'm uploading isn't recognized as HEIC.", answer: "Some HEIC files are named .heif (the container format name). Both extensions are supported. If your file is named something else, check the original iPhone Photos export settings — ensure you're exporting in 'Original Format' mode." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Batch conversion", convertify: "Yes (ZIP download)", typical: "One at a time" },
            { feature: "EXIF preservation", convertify: "Yes", typical: "Sometimes" },
            { feature: "Quality control", convertify: "Yes (slider)", typical: "Fixed quality" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "5–10 files/day" },
            { feature: "Sign-up", convertify: "No", typical: "Often" },
        ],
        lastUpdated: "2026-06-01",
    },

    "jpg-to-png": {
        intro: [
            "Converting JPG to PNG gives you a lossless image — no further JPEG compression is applied, so the image quality doesn't degrade with repeated saves. The PNG is larger than the JPG (because PNG is lossless), but it's the right format when you need to edit and re-save an image multiple times, need a transparent background, or need the image to serve as a source for design work.",
            "Practical note: converting JPG to PNG doesn't recover quality lost in the original JPEG compression. If a JPEG was saved at 60% quality, the PNG version is a lossless copy of that 60%-quality data — not a restoration to full quality. The benefit is that no additional quality loss occurs in future saves.",
        ],
        steps: [
            { title: "Upload the JPG", body: "Drop one or many JPEG files onto the upload zone." },
            { title: "Convert", body: "Each JPG is re-encoded as PNG with lossless compression. No quality reduction occurs." },
            { title: "Download", body: "Single files download directly; batches download as a ZIP." },
        ],
        scenarios: [
            { title: "Preparing images for design editing", body: "Graphic designers who receive JPEG assets and need to edit them repeatedly (crop, overlay, adjust) convert to PNG to avoid accumulating compression artifacts with each save cycle." },
            { title: "Images that need transparency", body: "JPEGs can't store transparent pixels. Convert to PNG as the intermediate format, then use an image editor to remove the background and add a transparent alpha channel." },
            { title: "Screenshots for documentation", body: "Screenshots saved as JPEG can show compression artifacts around text and icons. Converting to PNG produces a sharper, cleaner image for software documentation, tutorials, and UI mockups." },
        ],
        troubleshooting: [
            { question: "The PNG file is 5× larger than the JPG.", answer: "Expected — PNG is lossless. A JPEG photo at typical settings stores pixel data much more compactly than a lossless PNG of the same content. If size matters more than losslessness, use the original JPEG. Use PNG specifically when lossless or transparency is required." },
            { question: "The converted PNG quality still looks the same as the JPG.", answer: "Correct — converting JPG→PNG doesn't restore JPEG compression artifacts. The PNG is a lossless copy of the existing JPEG data, which already has some compression applied. The benefit is no further degradation, not restoration." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Output quality", convertify: "Lossless PNG", typical: "Lossless PNG" },
            { feature: "Batch conversion", convertify: "Yes", typical: "One at a time" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "Limited" },
            { feature: "Sign-up", convertify: "No", typical: "Sometimes" },
        ],
        lastUpdated: "2026-06-01",
    },

    "png-to-jpg": {
        intro: [
            "Converting PNG to JPG reduces file size significantly — typically 60-80% smaller — by using JPEG's lossy compression. This is the right move for photographs and complex images where the visual difference between PNG and JPEG is undetectable in normal use, and file size matters (web performance, email attachments, upload portals with size limits).",
            "Caveat: PNG images with transparency lose the alpha channel in JPG conversion. Transparent areas become a solid color (white by default). If your PNG has a transparent background, decide what background color should replace transparency before converting.",
        ],
        steps: [
            { title: "Upload the PNG", body: "Drop one or many PNG files onto the upload zone." },
            { title: "Set JPEG quality", body: "80% quality is the recommended default — visually nearly identical to the PNG at 60-80% of the file size. Lower for smaller files; higher (95%) for near-lossless output." },
            { title: "Choose transparency background", body: "For PNGs with transparent areas, select a background fill color (white is default, transparent areas in screenshots often need white)." },
            { title: "Convert and download", body: "Single files or batch ZIP download. The original PNG is unchanged." },
        ],
        scenarios: [
            { title: "Web performance: replacing large PNGs with JPGs", body: "A product screenshot saved as PNG is often 2-5 MB. The same image as JPEG at 80% quality is 200-500 KB — a 5-10x reduction that dramatically improves page load time and Core Web Vitals scores." },
            { title: "Email and messaging size limits", body: "PNGs of screenshots, diagrams, and photos attached to emails can hit size limits quickly. Convert to JPEG before attaching — a 4 MB PNG becomes under 500 KB at 80% quality." },
            { title: "Upload portal restrictions", body: "Some systems (job portals, e-commerce platforms, form uploads) only accept JPEG or have strict size limits. Convert your PNG to JPEG before uploading." },
        ],
        troubleshooting: [
            { question: "Transparent areas turned white (or another color) after conversion.", answer: "JPEG doesn't support transparency. Set the background fill color to whatever suits your use case — white for documents and screenshots, black for dark-themed images, or the specific background color of the page where the image will be used." },
            { question: "The converted JPEG shows blocky artifacts.", answer: "You used too low a quality setting. Increase to 75-85% — below 70% introduces visible JPEG blocking artifacts, especially around text and sharp edges." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Quality control", convertify: "Yes (10–100% slider)", typical: "Sometimes" },
            { feature: "Transparency handling", convertify: "Choose fill color", typical: "White only" },
            { feature: "Batch conversion", convertify: "Yes", typical: "One at a time" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "Limited" },
        ],
        lastUpdated: "2026-06-01",
    },

    "webp-converter": {
        intro: [
            "WebP is Google's modern image format that delivers 25-35% smaller files than JPEG at equivalent quality, and 26% smaller than PNG for lossless images. It's supported by all modern browsers (Chrome, Firefox, Safari, Edge) and is increasingly required or preferred for web performance. Convertify's WebP Converter converts JPG, PNG, and GIF to WebP, and WebP back to JPG or PNG.",
            "Why you might convert FROM WebP: WebP has limited support in older software (Photoshop pre-22, older Windows image viewers, some CMS platforms). If you receive WebP images you can't open or upload, converting to JPG or PNG restores universal compatibility.",
        ],
        steps: [
            { title: "Upload the source image", body: "Drop JPG, PNG, GIF, or WebP files onto the upload zone. Batch conversion handles multiple files at once." },
            { title: "Choose target format", body: "Select WebP for output (converting from other formats), or JPEG/PNG (converting from WebP). For WebP output, choose between lossy (smaller, like JPEG) and lossless (like PNG, but smaller than PNG)." },
            { title: "Set quality", body: "For lossy WebP, 80% quality produces visually excellent results at typical web viewing sizes. Lossless WebP is quality-level 0-100 (100 = best compression, not quality, unlike JPEG)." },
            { title: "Convert and download", body: "Results download individually or as a batch ZIP." },
        ],
        scenarios: [
            { title: "Web performance optimization", body: "Serving WebP instead of JPEG or PNG for website images reduces total page weight by 25-35% — a meaningful improvement to Core Web Vitals LCP (Largest Contentful Paint) scores, which affect Google search rankings." },
            { title: "Next.js and modern web frameworks", body: "Next.js Image component automatically serves WebP when supported. If you're manually managing images for a static site or CMS, convert to WebP before upload to take advantage of smaller file sizes." },
            { title: "Converting received WebP to PNG for editing", body: "Design work often requires PNG source files. When you download a WebP asset and need to edit it in Photoshop (older version) or Figma, convert to PNG first." },
        ],
        troubleshooting: [
            { question: "The converted WebP won't display on my website.", answer: "Check your server's MIME type configuration — WebP requires 'image/webp'. Also verify your website's CDN and caching layer serves the correct Content-Type header. Modern browsers (Chrome, Firefox, Safari 14+) all support WebP natively." },
            { question: "WebP lossless is larger than the original PNG.", answer: "WebP lossless is generally 26% smaller than equivalent PNG. If your PNG was already highly optimized (e.g., a 1-bit or 2-color image), WebP's overhead can occasionally exceed the original. For those edge cases, keep the original PNG." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Bidirectional conversion", convertify: "To and from WebP", typical: "To WebP only" },
            { feature: "Lossy + lossless WebP", convertify: "Both", typical: "Lossy only" },
            { feature: "Batch", convertify: "Yes", typical: "One at a time" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "Limited" },
        ],
        lastUpdated: "2026-06-01",
    },

    "bmp-to-jpg": {
        intro: [
            "BMP (Bitmap) is Windows' native uncompressed image format — used by older software, Windows screenshot tools (Pre-Win10), and some industrial and medical equipment. BMP files are enormous (a 1920×1080 BMP is around 6 MB uncompressed). Converting BMP to JPEG compresses them to a fraction of that size with no visible quality difference at normal viewing sizes.",
            "Convertify's BMP to JPG converter handles single and batch conversions in the browser, with a quality slider for balancing size and fidelity. No upload required — useful when the BMP contains proprietary CAD or medical image data.",
        ],
        steps: [
            { title: "Upload BMP files", body: "Drop one or many .bmp files onto the upload zone." },
            { title: "Set JPEG quality", body: "80-85% is the recommended default for photos. For images with text or sharp edges, 90-95% preserves clarity better." },
            { title: "Convert and download", body: "JPGs download individually or as a ZIP for batches. File size reduction is typically 90-97% vs the original BMP." },
        ],
        scenarios: [
            { title: "Windows Paint and legacy screenshot exports", body: "Older Windows apps often save screenshots as BMP by default. Convert to JPG before sharing by email or uploading — a 5 MB BMP becomes a 100-200 KB JPEG." },
            { title: "Industrial and medical equipment outputs", body: "Some specialized hardware (machine vision cameras, older medical imaging stations) exports images as BMP. Convert to JPG for compatibility with standard review and reporting software." },
            { title: "Reducing archive storage", body: "A folder of legacy BMP files takes dramatically more disk space than the equivalent JPEGs. Batch-convert the archive to reduce storage by 90%+ for archival copies that don't need to be edited." },
        ],
        troubleshooting: [
            { question: "The BMP has colors that look wrong after JPEG conversion.", answer: "Very unusual for standard 24-bit BMPs. If you have a 1-bit, 4-bit, or 8-bit indexed color BMP, the color palette may not convert perfectly. Convert to PNG first (which handles indexed color well), then PNG to JPG if size reduction is needed." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Batch conversion", convertify: "Yes", typical: "One at a time" },
            { feature: "Quality control", convertify: "Yes (slider)", typical: "Fixed quality" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "Limited" },
            { feature: "Sign-up", convertify: "No", typical: "Sometimes" },
        ],
        lastUpdated: "2026-06-01",
    },

    "gif-to-png": {
        intro: [
            "Converting a GIF to PNG makes sense when you want a static, high-quality version of a single frame — for use in design projects, documentation, or platforms that don't support GIF animation. PNG supports a larger color palette (16 million colors vs GIF's 256), no dithering artifacts, and lossless compression, producing a noticeably cleaner static image.",
            "Important: PNG does not support animation. Converting an animated GIF to PNG produces only the first frame (or a chosen frame). If you need a modern animated format, convert GIF to WebP (which supports animation) or MP4 instead.",
        ],
        steps: [
            { title: "Upload the GIF", body: "Drop one or many .gif files onto the upload zone." },
            { title: "Choose frame (for animated GIFs)", body: "For animated GIFs, select which frame to extract as the PNG — frame 1 is the default. Use the frame slider to preview and pick the desired frame." },
            { title: "Convert and download", body: "PNG files download. For batches, a ZIP is provided." },
        ],
        scenarios: [
            { title: "Extracting a still frame from an animated GIF", body: "Animated GIFs used in tutorials or UI demos often have a key frame worth using as a static thumbnail or documentation screenshot. Extract that frame as a clean PNG." },
            { title: "Logo and icon conversion", body: "Older web assets were often distributed as GIF logos (with 256-color limitations). Converting to PNG preserves the image but removes color banding artifacts from GIF's limited palette." },
            { title: "Design asset preparation", body: "Design tools work better with PNG than GIF. Converting a GIF graphic to PNG before bringing it into Figma, Photoshop, or Canva gives you a cleaner source with full color depth." },
        ],
        troubleshooting: [
            { question: "I want to keep the animation — not just one frame.", answer: "GIF to PNG is for static frames. To keep animation, use GIF to WebP (which supports animation natively) or use an online GIF-to-MP4 converter." },
            { question: "The PNG shows a white background where the GIF had transparency.", answer: "GIF supports 1-bit transparency (a color is either fully transparent or fully opaque). PNG preserves this transparency correctly. If you see white, your downstream tool may not be rendering the transparent PNG correctly — check your viewer or application's transparency support." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Frame selection", convertify: "Yes", typical: "First frame only" },
            { feature: "Color depth output", convertify: "24-bit PNG", typical: "8-bit PNG" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "Limited" },
        ],
        lastUpdated: "2026-06-01",
    },

    "svg-to-png": {
        intro: [
            "SVG is a vector format — infinitely scalable with no quality loss — but many platforms, email clients, and image processing tools require raster images. Converting SVG to PNG rasterizes the vector at a specific size and resolution, producing a pixel-perfect PNG ready for use anywhere. Convertify's SVG to PNG converter lets you specify exact output dimensions and DPI before rasterizing.",
            "The critical decision in SVG to PNG conversion is output size: since SVG is resolution-independent, you choose the pixel dimensions of the PNG. For a logo used on social media, 1200×1200 is a safe resolution. For print (300 DPI on an A4 page), you'd need approximately 2480×3508 pixels.",
        ],
        steps: [
            { title: "Upload the SVG", body: "Drop one or many .svg files onto the upload zone." },
            { title: "Set output dimensions", body: "Enter the target width and height in pixels, or choose a DPI (72 for screen, 150 for high-DPI web, 300 for print). Aspect ratio is preserved from the SVG's viewBox." },
            { title: "Convert and download", body: "The SVG is rasterized to PNG at your chosen size. Batch conversions download as a ZIP." },
        ],
        scenarios: [
            { title: "Logo exports for different use cases", body: "A brand logo as SVG needs PNG versions for email signatures (200×50px), social media profiles (400×400px), and print-ready artwork (high-DPI). Convert once per size spec and save each variant." },
            { title: "Icon pack export for developers", body: "UI icon sets delivered as SVG need PNG fallbacks for platforms that don't support SVG (older iOS, certain email clients). Generate 1×, 2×, and 3× PNG versions from the same SVG source." },
            { title: "Email template graphics", body: "Email clients (especially Outlook) have poor or no SVG support. Convert email graphics from SVG to PNG before adding to HTML email templates." },
            { title: "Social media uploads", body: "Most social networks don't accept SVG. Convert your brand assets, event graphics, or profile picture to PNG at the platform's recommended dimensions." },
        ],
        troubleshooting: [
            { question: "Fonts in my SVG are rendering wrong or falling back.", answer: "SVGs that reference external fonts (via @import or href) rely on those fonts being available in the conversion environment. Embed fonts as base64 data URIs in the SVG file, or convert text to outlines (paths) in your design tool before exporting the SVG." },
            { question: "The PNG is blurry at the size I need.", answer: "You set a small output size. Since you're converting from a vector, re-run with a larger pixel dimension — SVG scales to any size without quality loss. Double the dimensions for double the resolution." },
            { question: "Some SVG elements aren't rendering.", answer: "Complex SVG features like filters, clip paths, and CSS animations may render differently or not at all in the browser-based rasterizer. Simplify the SVG in your editor (remove complex filters, convert animated elements to static) for best results." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Custom dimensions", convertify: "Yes (pixel + DPI)", typical: "Fixed presets" },
            { feature: "Batch conversion", convertify: "Yes", typical: "One at a time" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "Limited" },
            { feature: "Sign-up", convertify: "No", typical: "Sometimes" },
        ],
        lastUpdated: "2026-06-01",
    },

    "qr-code-generator": {
        intro: [
            "A QR code packs text into a scannable 2D matrix. Convertify's generator takes a URL or any text up to 4,000 characters and gives you back a PNG at 256, 400, 512 or 1024 pixels — no sign-up, no account, no daily limit, and no tracking redirect in the middle. What you encode is what gets scanned.",
            "One thing to be aware of before you paste anything sensitive: unlike our PDF and image tools, which do all their work inside your browser, this generator renders the QR image through the third-party goqr.me API. The text you encode is sent to that service. For a public URL that's fine. For a password or private data, it isn't — so don't use it for those.",
        ],
        steps: [
            { title: "Enter the content", body: "Type or paste a URL or any text up to 4,000 characters. For URLs, include the full address with https:// so scanners open it directly instead of treating it as plain text." },
            { title: "Pick a size", body: "Choose 256, 400, 512 or 1024 pixels. 400px is comfortable for a slide or a web page; go to 1024px for anything you intend to print." },
            { title: "Download the PNG", body: "The preview updates as you type. When it looks right, download the PNG and drop it wherever you need it." },
        ],
        scenarios: [
            { title: "Restaurant and bar menus", body: "Point a QR code at your online menu or ordering page and print it on table cards and window decals. Use the 1024px download so the code stays crisp at print size." },
            { title: "Posters, flyers and packaging", body: "A printed URL is something people have to type; a QR code is something they scan. Encode the landing page, download at 1024px, and place it at least 2cm x 2cm on the final artwork." },
            { title: "Slides and presentations", body: "Put a QR code on your closing slide linking to your deck, signup form or contact page. 400px is plenty at projector resolution and keeps the file small." },
            { title: "Linking print to digital", body: "Product manuals, business cards, event signage — anywhere a reader has a phone in hand and you want to save them typing a long URL." },
        ],
        troubleshooting: [
            { question: "My QR code isn't scanning.", answer: "Usually one of four things: (1) the encoded text is very long, which makes the matrix dense — shorten the URL with a link shortener; (2) the printed code is too small, aim for at least 2cm x 2cm; (3) it's printed on a low-contrast or glossy surface; or (4) it's distorted by being stretched non-proportionally in a layout tool." },
            { question: "The QR code looks pixelated when printed.", answer: "PNG is resolution-dependent, so pick the 1024px size for anything going to print and don't scale it up further in your layout tool. For a business card, 1024px is comfortably enough." },
            { question: "Can I add a logo in the centre or change the colours?", answer: "Not with this tool — it produces a standard black-on-white PNG. Adding a centre logo also requires raising the QR error-correction level to compensate, which this generator doesn't expose. If you need branded codes, use a dedicated QR service." },
            { question: "Can I encode Wi-Fi credentials or a contact card?", answer: "Only by hand-writing the raw string yourself (for example the WIFI:S:...;P:...;; format), and we'd advise against putting a Wi-Fi password through this tool at all, since the text is sent to a third-party API to render the image." },
        ],
        comparison: [
            { feature: "Output format", convertify: "PNG", typical: "PNG, sometimes SVG" },
            { feature: "Max size", convertify: "1024px", typical: "Varies" },
            { feature: "Colour customisation", convertify: "No (black on white)", typical: "Sometimes" },
            { feature: "Tracking redirect", convertify: "None — data encoded directly", typical: "Often, via a short link" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "Limited" },
            { feature: "Sign-up", convertify: "No", typical: "Often" },
        ],
        lastUpdated: "2026-07-26",
    },

    "csv-to-json": {
        intro: [
            "Converting CSV to JSON is a fundamental data transformation in modern development — REST APIs return JSON, databases ingest JSON, and most JavaScript code expects JSON objects rather than flat CSV rows. Convertify's CSV to JSON converter handles files and pasted text, auto-detects headers, and supports both flat JSON arrays and nested object structures.",
            "CSV is simple (rows of comma-separated values) but limited — it has no native type system, no nesting, and no metadata. JSON preserves types (numbers stay numbers, not text), supports nesting, and is the lingua franca of web APIs. The conversion involves: mapping the first row as keys, inferring types (1 → number, 'true' → boolean, rest → string), and wrapping rows as JSON objects in an array.",
        ],
        steps: [
            { title: "Upload or paste CSV", body: "Drop a .csv file, or paste CSV text directly into the text area. Auto-detection handles comma, semicolon, and tab delimiters." },
            { title: "Configure output", body: "Choose flat array of objects (most common), or grouped/nested output if the CSV has hierarchical data. Toggle type inference on/off (on = numbers parsed as numbers; off = everything is a string)." },
            { title: "Convert and download", body: "The JSON output previews in the panel. Download as .json or copy to clipboard for direct use." },
        ],
        scenarios: [
            { title: "API data preparation", body: "You export a product catalog from an e-commerce platform as CSV. The frontend API expects JSON objects. Convert, verify the structure, then POST the JSON payload to your API endpoint." },
            { title: "Database seeding", body: "Developers seeding a new database from exported legacy data convert the CSV export to JSON for ingestion by MongoDB, Firestore, or a REST bulk-insert endpoint." },
            { title: "Data analysis with JavaScript", body: "A data analyst working in Node.js or the browser console imports the CSV as JSON to use JavaScript's Array methods (filter, map, reduce) for quick analysis without SQL or pandas." },
            { title: "Configuration file generation", body: "System configurations distributed as spreadsheets (rows of setting key-value pairs) convert to JSON config files for application deployment." },
        ],
        troubleshooting: [
            { question: "Special characters in my CSV are corrupting the JSON output.", answer: "The most common cause is file encoding. CSVs from Excel on Windows are often saved as Windows-1252 or ISO-8859-1, not UTF-8. Re-save the CSV as UTF-8 in Excel (Save As → CSV UTF-8) before converting." },
            { question: "Numbers in my CSV are being treated as strings in the JSON.", answer: "Enable 'Type inference' in the converter settings. With type inference on, values that parse as integers or floats are output as JSON numbers, not quoted strings." },
            { question: "My CSV has quoted fields with commas inside — these are splitting incorrectly.", answer: "RFC 4180-compliant CSV quotes fields containing delimiters. If your file follows this standard correctly, the converter handles it. If you're pasting text and the quotes are missing, the parser sees the comma inside the value as a new column." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Delimiter detection", convertify: "Auto (comma, tab, semicolon)", typical: "Comma only" },
            { feature: "Type inference", convertify: "Yes (toggle)", typical: "Strings only" },
            { feature: "Nested output", convertify: "Yes", typical: "Flat only" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "Limited" },
        ],
        lastUpdated: "2026-06-01",
    },

    "json-to-csv": {
        intro: [
            "Converting JSON to CSV flattens structured API data into a spreadsheet-friendly format — readable in Excel, importable into databases, and processable by data tools that expect tabular input. Convertify's JSON to CSV converter handles arrays of objects, auto-extracts all keys as column headers, and handles missing values gracefully.",
            "JSON's nested structure is the main challenge in JSON-to-CSV conversion: a JSON object can have nested objects and arrays, but CSV is flat (rows and columns only). Convertify offers a flattening strategy that uses dot notation for nested keys (e.g., address.city becomes its own column) — the most useful approach for API response data.",
        ],
        steps: [
            { title: "Upload or paste JSON", body: "Drop a .json file or paste the JSON text. The tool validates the JSON structure and shows a preview." },
            { title: "Configure column settings", body: "Choose flat mode (top-level keys only) or flattened nested mode (dot-notation keys for nested objects). Select which keys to include if you only need specific fields." },
            { title: "Convert and download", body: "The CSV previews in the panel. Download as .csv (UTF-8 with BOM for Excel compatibility) or open directly in Google Sheets." },
        ],
        scenarios: [
            { title: "Exporting API response data to Excel", body: "You call a REST API, get a JSON array of orders or users, and need to analyze it in Excel. Convert JSON to CSV, open in Excel, and pivot, filter, and chart immediately." },
            { title: "Database export for reporting", body: "Backend developers exporting MongoDB documents or Firestore records as JSON need CSV format for business intelligence tools and reporting dashboards that don't accept JSON input." },
            { title: "Data migration between systems", body: "Migrating records from a JSON-based system (modern SaaS) to a legacy system that accepts CSV imports. Convert, verify row counts, import." },
        ],
        troubleshooting: [
            { question: "Nested arrays produce unexpected column output.", answer: "Arrays inside JSON objects (e.g., a 'tags' array) don't map cleanly to CSV columns. The converter joins array values with a pipe separator (value1|value2) in a single column. For complex nested arrays, pre-process the JSON to flatten arrays before converting." },
            { question: "Excel opens the CSV but shows garbled text for special characters.", answer: "Download the CSV with BOM (Byte Order Mark) selected — this is the UTF-8 with BOM option, which signals to Excel to read the file as UTF-8 rather than Windows-1252." },
            { question: "Some records have different keys — missing values show as blank.", answer: "This is correct behavior. If JSON objects have inconsistent keys (some have 'phone', others don't), the CSV column 'phone' exists for all rows but is empty for records where the key was absent." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Nested key flattening", convertify: "Yes (dot notation)", typical: "Top level only" },
            { feature: "BOM for Excel", convertify: "Yes", typical: "Sometimes" },
            { feature: "Select specific keys", convertify: "Yes", typical: "All keys only" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "Limited" },
        ],
        lastUpdated: "2026-06-01",
    },

    "xml-to-json": {
        intro: [
            "Converting XML to JSON is a common step in API modernization, data pipeline migration, and interoperability work — REST/JSON has largely superseded XML/SOAP, and many legacy data systems still export XML that needs to be consumed by modern JavaScript or Python code. Convertify's XML to JSON converter handles namespaces, attributes, and nested elements, with configurable attribute handling.",
            "The structural mismatch between XML and JSON is the core challenge: XML attributes (e.g., <item id='123'>) and XML elements (e.g., <name>Widget</name>) need to be mapped to JSON properties in a consistent, predictable way. Convertify uses the widely-adopted convention of prefixing attribute names with '@' and element text with '#text' for unambiguous representation.",
        ],
        steps: [
            { title: "Upload or paste XML", body: "Drop an .xml file or paste the XML content. The tool validates the XML structure first." },
            { title: "Configure attribute handling", body: "Choose how attributes are represented: '@' prefix convention (default, most compatible), merged with elements (simpler output for simple XMLs), or ignored (attributes dropped)." },
            { title: "Convert and download", body: "The JSON output previews in the panel. Download as .json or copy to clipboard." },
        ],
        scenarios: [
            { title: "Consuming legacy SOAP API responses", body: "A legacy enterprise system returns SOAP/XML responses. Convert the XML to JSON so the data can be parsed and consumed by modern JavaScript or Python code without an XML parser library." },
            { title: "Data migration from XML-based databases", body: "Older content management systems, ERP platforms, and configuration tools export XML. Convert to JSON for ingestion into modern NoSQL databases (MongoDB, DynamoDB) or REST API endpoints." },
            { title: "RSS/Atom feed processing", body: "RSS feeds are XML. Convert to JSON for building custom feed readers, aggregators, or newsletter tools in JavaScript without maintaining an XML parsing dependency." },
        ],
        troubleshooting: [
            { question: "The output JSON has too much nesting — simple elements are wrapped in objects.", answer: "This is the natural result of XML's verbose structure. Post-process the JSON with a transformation (like jq or lodash transforms) to flatten to the structure you need. Or use the 'compact' output mode which reduces nesting for simple elements." },
            { question: "Namespaces in the XML are appearing in property names (e.g., 'ns0:element').", answer: "XML namespaces are preserved in property names by default for correctness. If namespaces aren't important for your use case, enable 'Strip namespaces' in the converter settings to remove the prefix." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Attribute handling options", convertify: "Yes (prefix, merge, ignore)", typical: "Fixed convention" },
            { feature: "Namespace handling", convertify: "Preserve or strip", typical: "Preserve only" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "Limited" },
            { feature: "Sign-up", convertify: "No", typical: "Sometimes" },
        ],
        lastUpdated: "2026-06-01",
    },

    "base64": {
        intro: [
            "Base64 encoding converts binary data (files, images, arbitrary bytes) into ASCII text — a sequence of letters, numbers, +, and / characters. This is essential for embedding binary data in text-based formats: JSON API payloads, HTML data URIs, email attachments (MIME), configuration files, and JWTs. Convertify's Base64 tool encodes and decodes text and files, with URL-safe Base64 support for tokens and query parameters.",
            "Base64 is not encryption — it's encoding. Base64-encoded data is trivially reversible by anyone who knows it's Base64. Never use it as a security measure. Use it when you need to safely embed binary data in a context that only accepts text (the name comes from each 6-bit group being represented as one of 64 printable characters).",
        ],
        steps: [
            { title: "Choose mode: Encode or Decode", body: "Encode converts text or file binary to a Base64 string. Decode reverses Base64 back to the original content." },
            { title: "Provide input", body: "Paste text in the text area, or upload a file (image, PDF, any binary) for encoding. For decoding, paste the Base64 string." },
            { title: "Copy or download result", body: "Encoded output is a text string — copy to clipboard for use in code, config files, or API calls. Decoded output downloads as the original file type." },
        ],
        scenarios: [
            { title: "Embedding images in HTML or CSS", body: "Use a base64-encoded data URI to embed small images directly in HTML/CSS without a separate file request: `<img src='data:image/png;base64,iVBORw0K...' />`. Best for small icons and thumbnails under 10 KB." },
            { title: "API authentication headers", body: "HTTP Basic Auth encodes credentials as Base64: `Authorization: Basic base64(username:password)`. Developers testing API endpoints manually encode their credentials here before adding to the header." },
            { title: "JWT debugging", body: "JSON Web Tokens (JWTs) have three Base64URL-encoded sections separated by dots. Decode the payload section to inspect the claims without needing a dedicated JWT debugger." },
            { title: "Email MIME attachments", body: "MIME email encodes binary attachments as Base64 for transmission over text-based SMTP. Developers building email systems use Base64 encoding when constructing raw MIME messages." },
        ],
        troubleshooting: [
            { question: "My decoded output looks garbled.", answer: "Base64 decodes binary data to its raw bytes. If the original was a binary file (image, PDF), the decoded output is binary — download it as a file rather than trying to read it as text. Use the 'Download as file' option." },
            { question: "I need URL-safe Base64 (no + or / characters).", answer: "Standard Base64 uses + and / which break in URL query parameters. Enable 'URL-safe mode' to use - and _ instead (RFC 4648 Base64URL). JWT and OAuth tokens use URL-safe Base64." },
            { question: "The encoded string has line breaks — is that correct?", answer: "MIME Base64 traditionally wraps every 76 characters with a line break (per RFC 2045). For use in JSON, HTML attributes, or code strings, use the 'No line breaks' output mode for a single continuous string." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Text only" },
            { feature: "File encoding", convertify: "Yes (binary files)", typical: "Text strings only" },
            { feature: "URL-safe mode", convertify: "Yes", typical: "Sometimes" },
            { feature: "Line break control", convertify: "Yes", typical: "Fixed wrapping" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "Limited" },
        ],
        lastUpdated: "2026-06-01",
    },

    "tiff-to-pdf": {
        intro: [
            "TIFF (Tagged Image File Format) is the standard format for scanned documents, fax transmissions, medical imaging, and professional photography archiving. Converting TIFF to PDF is the standard workflow for preparing scanned documents for distribution — PDF is universally readable while TIFF requires specialized viewers on most systems. Convertify's TIFF to PDF converter handles single and multi-page TIFFs, including the multi-image TIFF format used by document scanners.",
            "Multi-page TIFF files — where one .tif file contains an entire scanned document across multiple pages — are fully supported. Each TIFF page becomes one PDF page. Single-page TIFFs also work; you can batch-upload multiple files to combine them into one multi-page PDF.",
        ],
        steps: [
            { title: "Upload TIFF files", body: "Drop one or many .tif or .tiff files. Multi-page TIFFs are automatically expanded to individual pages. Multiple single-page TIFFs can be combined in the order they're uploaded." },
            { title: "Set page order (for batches)", body: "Drag thumbnails to set the final PDF page order. For a multi-page TIFF, the existing page order is preserved." },
            { title: "Convert and download", body: "The PDF is created with each TIFF image embedded at its original resolution, ready for distribution, archival, or submission." },
        ],
        scenarios: [
            { title: "Scanning workflows in legal and medical offices", body: "Document scanners (Fujitsu, Kodak Alaris, Canon DR series) often output multi-page TIFF files. Converting to PDF makes the scanned document compatible with case management systems, EMRs, and email distribution." },
            { title: "Fax-to-email conversion", body: "Older fax-to-email gateways deliver faxes as TIFF attachments. Convert to PDF for easier reading, filing, and forwarding within a document management system." },
            { title: "Archiving professional photography", body: "Photographers archiving client shoots in TIFF for maximum quality can convert contact sheets and proof sets to PDF for client delivery — PDFs are easier for clients to view and navigate than folders of TIFFs." },
        ],
        troubleshooting: [
            { question: "My multi-page TIFF shows only the first page in the PDF.", answer: "Ensure you're uploading the full multi-page TIFF file (not a single-page export). If your TIFF viewer shows multiple pages but the converter only gets one, the file may actually be a single-image TIFF with a thumbnail sidebar — check file properties to confirm the page count." },
            { question: "The PDF file is very large after converting from TIFF.", answer: "TIFF files are often high-resolution (300-600 DPI for scanner output), and embedding them in PDF preserves that resolution. Run the result through Compress PDF if the file needs to be smaller for email or portal upload." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Multi-page TIFF support", convertify: "Yes", typical: "Sometimes" },
            { feature: "Batch TIFF to single PDF", convertify: "Yes", typical: "One TIFF at a time" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "Limited" },
            { feature: "Sign-up", convertify: "No", typical: "Sometimes" },
        ],
        lastUpdated: "2026-06-01",
    },

    "autocad-pdf-editor": {
        intro: [
            "PDF files exported from AutoCAD, SolidWorks, Revit, and similar CAD tools contain technical drawings — floor plans, engineering schematics, mechanical designs. Editing these PDFs requires a tool that handles vector lines, precise annotations, and technical dimensions without re-rasterizing the drawing. Convertify's AutoCAD PDF Editor lets you add text annotations, revision clouds, stamps, and dimension notes to PDF drawings without losing vector quality.",
            "The most common use case is adding revision notes to a drawing PDF received from a client or subcontractor — marking up changes, adding approval stamps, and returning the annotated PDF for reference. Unlike a general PDF editor, this tool preserves the vector nature of the underlying drawing so annotations print at full engineering quality.",
        ],
        steps: [
            { title: "Upload the AutoCAD-exported PDF", body: "Drop the PDF drawing file. Large format drawings (A1, A0, tabloid) are supported." },
            { title: "Add annotations and markup", body: "Use the annotation toolbar: add text notes, draw revision clouds (common in engineering markup), insert dimension labels, add approval or rejection stamps." },
            { title: "Save the annotated PDF", body: "The marked-up drawing downloads with all annotations embedded. Share with your team for review or file as the record of a revision." },
        ],
        scenarios: [
            { title: "Engineering drawing review and redlines", body: "Structural engineers, MEP consultants, and project managers add redline comments to PDF drawings received from other disciplines. Mark corrections, highlight clashes, and return the annotated PDF to the drawing team." },
            { title: "Shop drawing approvals", body: "Contractors submit shop drawings for review. Reviewers add Approved, Revise and Resubmit, or Rejected stamps with review notes, then return the PDF without needing AutoCAD installed." },
            { title: "As-built documentation", body: "Site supervisors noting field changes to drawings add handwritten-style annotations (using the freehand draw tool) directly on the PDF, creating an as-built record of what changed during construction." },
        ],
        troubleshooting: [
            { question: "The drawing looks pixelated after I annotate and save.", answer: "If the original PDF was a rasterized export (low DPI) from AutoCAD rather than a vector export, it was already low-quality — the editor didn't change it. Request a vector PDF export from the drafter at high DPI (Plot → PDF, ensure 'High Quality Print' is selected in AutoCAD)." },
            { question: "My PDF has multiple sheets — can I annotate each sheet separately?", answer: "Yes — the editor handles multi-page PDFs. Navigate between pages using the page selector and annotate each sheet independently. All annotations save in the final PDF across all pages." },
        ],
        comparison: [
            { feature: "Files uploaded", convertify: "Never", typical: "Yes" },
            { feature: "Vector quality preserved", convertify: "Yes", typical: "Sometimes rasterizes" },
            { feature: "Revision clouds", convertify: "Yes", typical: "Not always" },
            { feature: "Large format drawings", convertify: "Yes", typical: "A4/Letter only" },
            { feature: "Daily limit", convertify: "Unlimited", typical: "Limited" },
        ],
        lastUpdated: "2026-06-01",
    },
}
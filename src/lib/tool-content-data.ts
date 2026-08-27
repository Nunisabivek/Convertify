// Pre-defined SEO content for each tool - can be imported in both server and client components
// Keywords sourced from NotebookLM competitive analysis

export const toolContentData: Record<string, {
    description: string;
    features: string[];
    useCases: string[];
    keywords: string[];
}> = {
    "merge-pdf": {
        description: "Merge PDF files online for free. Combine multiple PDFs into one document with drag-and-drop reordering. No watermarks, no sign-up, no file size limits. Mix PDFs with JPG/PNG images. 100% private — files never leave your browser.",
        features: [
            "No file size limits on merged documents",
            "No watermarks added to your documents",
            "No sign-up or registration required",
            "Drag-and-drop to reorder pages precisely",
            "Zero-Bloat technology prevents file size explosion",
            "Mix PDFs with JPG/PNG images seamlessly",
            "100% private - files processed locally in browser"
        ],
        useCases: [
            "Consolidating monthly business reports into one file",
            "Assembling legal exhibits and affidavits for court",
            "Merging chapter PDFs into a full ebook or manual",
            "Combining invoices and receipts for tax submission",
            "Stitching design portfolios and scans into one document"
        ],
        keywords: ["convertify pdf merger", "merge pdf", "combine pdf files", "join pdfs", "pdf binder", "stitch pdfs", "secure pdf merger", "combine multiple pdfs", "concatenate pdf", "merge pdf online", "free pdf merger", "combine pdfs free"]
    },
    "split-pdf": {
        description: "Extract exactly the pages you need with our free Split PDF tool, optimized for Windows and Mac. Whether you're on Windows 10/11 or mobile, you can separate a single page, define specific ranges (e.g., 1-5, 10), or extract every page as a standalone file. Convertify offers precise control for removing sensitive info or isolating reports directly in your browser.",
        features: [
            "Optimized for Windows 10 & 11 (browser-based)",
            "Extract distinct pages or custom ID ranges (e.g., 2-5)",
            "Split entire PDF into individual pages instantly",
            "Remove unwanted or sensitive pages securely",
            "Preview pages before extracting",
            "100% private - files never leave your device"
        ],
        useCases: [
            "Splitting PDFs on Windows without Acrobat",
            "Removing sensitive pages from legal documents",
            "Extracting a single chapter or invoice",
            "Separating merged scanned files",
            "Isolating receipt pages from bank statements"
        ],
        keywords: ["split pdf", "extract pdf pages", "separate pdf pages", "how to split pdf on windows", "pdf splitter online", "pdf page separator"]
    },
    "compress-pdf": {
        description: "Compress a PDF to 50KB, 100KB or 200KB for India form uploads — UPSC documents, EPFO KYC, Passport Seva scans, bank proofs. You pick the target; a multi-pass engine in your browser tunes quality until the file is at or under that size. Nothing is uploaded.",
        features: [
            "Target 50 KB, 100 KB, 200 KB or any custom maximum",
            "Built for UPSC, EPFO, Passport Seva and bank document fields",
            "Multi-pass quality + DPI tuning instead of vague low/medium/high",
            "No watermark, no sign-up, no daily cap",
            "Runs on your device — ID scans never leave the browser",
            "Advanced sliders if a one-page scan still sits over the cap"
        ],
        useCases: [
            "UPSC / SSC document uploads that cap a PDF at 100 KB or 200 KB",
            "EPFO member KYC proofs that reject files over 100–200 KB",
            "Passport Seva supporting documents that must stay under a small cap",
            "Bank and job-portal ID scans labelled “PDF, max 200 KB”",
            "Emailing a scanned certificate that bounced the 1 MB attachment limit"
        ],
        keywords: ["compress pdf to 100kb", "compress pdf to 200kb", "compress pdf to 50kb", "pdf compressor 100kb", "epfo pdf size", "compress pdf for government forms"]
    },
    "fit-to-size": {
        description: "Fit a photo or PDF into a min–max KB band — 20–50, 50–200, 100–200, and other form ranges. Portals that reject “file too small” as well as “file too large” need this, not a compressor that only shrinks. Processing stays on your device.",
        features: [
            "Chips for 10–20, 20–50, 20–100, 20–200, 20–300, 50–200 and 100–200 KB",
            "Custom min and max if your notification prints a different band",
            "Accepts JPG, PNG, WebP and PDF",
            "Quality-first: pixels shrink only if the KB cap still fails",
            "Clear error when the file cannot land in range",
            "No upload, no account, no watermark"
        ],
        useCases: [
            "Bank KYC photos that must sit between 20 KB and 50 KB",
            "EPFO / UPSC attachments labelled 50–200 KB or 100–200 KB",
            "Signature or thumb files that reject anything under 10 KB",
            "A PDF that is 18 KB when the portal wants 50–200 KB",
            "Any form that prints both a minimum and a maximum in KB"
        ],
        keywords: ["compress photo to 50kb", "20kb to 50kb photo", "fit pdf to size", "50kb to 200kb", "kyc photo size"]
    },
    "passport-photo": {
        description: "Make the JPEG India forms actually ask for: Passport Seva 630×810 (10–250 KB, white), UPSC 3.5×4.5 cm / 413×531 (20–300 KB), bank 200×230 (20–50 KB), and signature 140×60 (10–20 KB). Crop on device, then hit the pixel and KB numbers in one pass.",
        features: [
            "Passport preset: 630×810 JPEG, 10–250 KB, white fill",
            "UPSC preset: 413×531 (3.5×4.5 cm at 300 DPI), 20–300 KB",
            "Bank photo 200×230, 20–50 KB; signature 140×60, 10–20 KB",
            "Thumb and custom pixel boxes when the notification differs",
            "Crop + zoom before export so the face is not stretched",
            "JPEG output — the format UPSC, Passport Seva and banks want",
            "Runs locally; not an official MEA or UPSC validator"
        ],
        useCases: [
            "Passport Seva online photo upload (630×810, 10–250 KB)",
            "UPSC CSE / recruitment photograph (3.5×4.5 cm, 20–300 KB)",
            "SBI / IBPS / bank KYC photo (200×230, 20–50 KB)",
            "Application signature scan (140×60, 10–20 KB)",
            "Thumb impression where the form prints 160×200 and 10–20 KB"
        ],
        keywords: ["passport photo 630x810", "upsc photo size", "upsc photo 413x531", "bank photo 200x230", "signature 140x60"]
    },
    "remove-background": {
        description: "Replace a plain backdrop with white or light blue so a Passport Seva, UPSC or bank KYC photo stops failing the background check. This is an on-device pass for form photos, not a cloud cut-out studio. Size the result in the passport photo maker next.",
        features: [
            "White fill for Passport Seva, UPSC and most KYC forms",
            "Light-blue fill when a bank or studio look is allowed",
            "Works best on a simple wall — honest about busy scenes",
            "JPEG download, which is what the portals accept",
            "No upload, no account, no watermark",
            "Pairs with the 630×810 / 413×531 photo maker for pixels and KB"
        ],
        useCases: [
            "Passport Seva photo taken against a cream or grey wall",
            "UPSC photograph rejected for a non-white background",
            "Bank KYC selfie with a cluttered room behind you",
            "Cleaning a signature scan on off-white paper before the 140×60 crop"
        ],
        keywords: ["remove background passport photo", "white background kyc", "passport photo white background", "upsc photo background"]
    },
    "jpg-to-pdf": {
        description: "Convert JPG to PDF free online with no limits and no watermarks. Combine unlimited photos into one multi-page PDF, adjust page sizes (A4, Letter, Legal), and arrange images in any order. Works perfectly on iPhone, Android, Windows, and Mac. All conversion happens in your browser - your photos are never uploaded to any server, making it 100% private and secure.",
        features: [
            "Combine unlimited JPG/PNG images into one PDF - no limits",
            "Works on iPhone, Android, Windows, Mac & tablets",
            "Choose page size: A4, Letter, Legal, or fit to image",
            "Drag and drop to reorder photos before converting",
            "High quality output - preserves original image resolution",
            "Compression options for smaller file sizes",
            "100% private - photos never leave your device",
            "No sign-up, no watermarks, completely free"
        ],
        useCases: [
            "Converting phone camera photos to PDF for homework submissions",
            "Scanning receipts and documents to PDF on iPhone/Android",
            "Creating photo albums from vacation pictures",
            "Combining product images into catalogs for ecommerce",
            "Converting screenshots into PDF documentation",
            "Creating portfolios from design work or artwork",
            "Batch converting multiple images for official applications"
        ],
        keywords: ["jpg to pdf", "convert jpg to pdf free", "combine photos to pdf", "multiple jpg to one pdf", "scan to pdf iphone", "scan to pdf android", "photo to pdf converter", "jpg to pdf no watermark", "image to pdf combiner", "jpg to pdf a4 size"]
    },
    "pdf-to-jpg": {
        description: "Convert PDFs to high-resolution JPG images with Convertify. Whether you need to save an entire document as a picture or extract specific images from a PDF, our HD rendering engine does it instantly at up to 300 DPI. Enjoy vector-to-pixel rendering for sharp text and vibrant graphics. Secure, browser-based processing ensures your files stay private.",
        features: [
            "Convert full pages to HD JPG (up to 300 DPI)",
            "Vector-to-Pixel rendering for razor-sharp text",
            "Extract distinct images embedded in any PDF",
            "Batch process multiple files or 100+ pages instantly",
            "Adjustable quality settings (Print, Web, or Mobile)",
            "100% private - no server uploads or storage"
        ],
        useCases: [
            "Converting presentation slides to images for sharing",
            "Extracting high-res photos from a PDF portfolio",
            "Saving document pages as pictures for Instagram/LinkedIn",
            "Archiving invoices as lightweight, searchable JPGs",
            "Turning design mockups into reviewable image sets"
        ],
        keywords: ["pdf to jpg", "pdf to jpeg", "convert pdf to image", "extract images from pdf", "save pdf as picture", "high quality pdf to jpg", "turn pdf into image", "batch pdf to jpg"]
    },
    "word-to-pdf": {
        description: "Convert a DOCX Word document's text content to PDF, free, without Microsoft Office, with zero watermarks. This extracts the document's text and lays it out on clean pages — it does not preserve exact fonts, images, or complex layout.",
        features: [
            "Convert Word (.docx) to PDF without Microsoft Office installed",
            "No sign-up required, no watermarks added",
            "Secure for confidential documents — processed locally, never uploaded",
            "Supports modern .docx format"
        ],
        useCases: [
            "Turning a Word draft into a shareable PDF",
            "Creating PDFs from Word without Microsoft Office",
            "Quick text-content conversion of reports and documents"
        ],
        keywords: ["convertify word to pdf", "word to pdf free", "word to pdf no office", "convert docx to pdf", "docx to pdf converter without watermark", "docx to pdf online free"]
    },
    "pdf-to-word": {
        description: "Convert a PDF's text content into an editable Word document (DOCX), free and instantly in your browser. Works on digitally-created PDFs with a text layer; scanned/image-only PDFs need OCR first.",
        features: [
            "Convert PDF text content to editable DOCX format",
            "Extracts real text from each page — not placeholders",
            "Works with Word, Google Docs, and Apple Pages",
            "100% secure - all processing happens in your browser"
        ],
        useCases: [
            "Editing contracts and agreements stored as static PDFs",
            "Updating old document archives into editable formats",
            "Modifying forms and templates for new project needs",
            "Converting academic papers for easy citing and editing"
        ],
        keywords: ["convertify pdf to word", "convert pdf to editable word free", "pdf to docx no email required", "turn pdf into text document"]
    },
    "rotate-pdf": {
        description: "Rotate PDF pages to the correct orientation. Fix sideways or upside-down scans, rotate specific pages, or change the entire document orientation. Save permanently without Adobe Acrobat or any software installation.",
        features: [
            "Rotate 90°, 180°, or 270° clockwise",
            "Rotate all pages or select specific ones",
            "Preview changes before saving",
            "Saves rotation permanently to the file",
            "Works with scanned documents",
            "No quality loss during rotation"
        ],
        useCases: [
            "Fixing scanned documents that came out sideways",
            "Correcting landscape pages in portrait documents",
            "Rotating single pages in multi-page documents",
            "Preparing documents for printing",
            "Fixing phone-scanned PDFs"
        ],
        keywords: ["rotate pdf pages save permanently", "fix sideways pdf free", "change pdf orientation online", "rotate pdf without acrobat"]
    },
    "protect-pdf": {
        description: "Secure your sensitive PDF files with military-grade AES-256 encryption using Convertify's private protector. Unlike cloud tools, our encryption happens 100% in your browser—your password never touches a server. Set 'Open Passwords' to lock the file or 'Permissions Passwords' to restrict printing, copying, and editing. Ideal for financial statements, legal contracts, and personal IDs.",
        features: [
            "Financial-Safe: 100% browser-based AES-256 encryption",
            "Set Open Passwords to prevent unauthorized viewing",
            "Define Restrictions: Disable printing, copying, or editing",
            "Military-grade security standard (AES-128 or AES-256)",
            "Password and data never leave your local device",
            "Compatible with all standard PDF readers and portals"
        ],
        useCases: [
            "Securing sensitive financial and tax documents",
            "Protecting legal contracts before email distribution",
            "locking company internal reports with viewing permissions",
            "Securing personal ID scans and passport copies",
            "Restricting document printing for draft versions"
        ],
        keywords: ["password protect pdf", "encrypt pdf", "secure pdf online", "lock pdf file free"]
    },
    "unlock-pdf": {
        description: "Regain full control of your PDF files by removing 'Owner' and 'Permission' restrictions instantly. If a document is locked for printing or copying, Convertify flips the security metadata in your browser without any quality loss. While we respect document integrity for 'Open Passwords' (requiring your input once), we make removing workflow restrictions fast and secure.",
        features: [
            "Remove printing and copying restrictions instantly",
            "Unlock 'Permission Passwords' to enable editing",
            "Metadata-only operation: 100% original quality preserved",
            "Works with AES-128 and AES-256 encryption levels",
            "Secure browser-based unlocking (no cloud upload)",
            "Enables text selection on restricted documents"
        ],
        useCases: [
            "Unlocking protected PDFs for printing locally",
            "Enabling text copy/paste from restricted files",
            "Removing old passwords from your own archived docs",
            "Regaining edit access for permission-locked reports",
            "Preparing locked documents for merging or splitting"
        ],
        keywords: ["unlock pdf", "remove pdf password", "unprotect pdf", "pdf restriction remover"]
    },
    "pdf-to-excel": {
        description: "Extract tables and data from PDF to Excel spreadsheets with 99.6% accuracy for financial documents. Convert bank statements, invoices, and data tables into structured XLSX format. Our AI-powered table detection preserves columns, rows, and cell formatting even in borderless tables. Secure, fast, and 100% private.",
        features: [
            "AI-powered table detection for 99.6% accuracy",
            "Optimized for bank statements and complex invoices",
            "Preserves columns, row structure, and cell formats",
            "High-speed OCR for scanned PDF tables and data",
            "Exports to clean, professional XLSX format",
            "Processes multi-page tables into one continuous sheet"
        ],
        useCases: [
            "Extracting financial data from bank statement PDFs",
            "Converting invoice tables to editable XLSX spreadsheets",
            "Digitizing paper audit forms into structured Excel data",
            "Analyzing PDF-based reports with spreadsheet formulas",
            "Importing data into QuickBooks or Xero accounting"
        ],
        keywords: ["pdf to excel converter free online", "extract tables from pdf to excel", "convert pdf to xlsx free", "pdf data to spreadsheet"]
    },
    "excel-to-pdf": {
        description: "Convert XLS and XLSX spreadsheets to PDF in your browser, with no Microsoft Excel needed. Convertify reads the cell values from your sheet and lays them out as a clean, readable table across paginated PDF pages. Your spreadsheet is processed locally and never uploaded to a server.",
        features: [
            "Convert XLS and XLSX to PDF without Microsoft Excel",
            "Cell values laid out as a clean, readable table",
            "Automatic pagination for long sheets",
            "No sign-up, no watermarks, completely free",
            "Works on Windows, Mac, and mobile browsers",
            "Secure: the file never leaves your device",
            "Note: This is a values-only export. Charts, images, cell formatting, borders, formulas and hyperlinks are not carried into the PDF — you get the data, not the styling.",
        ],
        useCases: [
            "Converting XLS financial reports to PDF",
            "Creating PDF invoices from Excel spreadsheets",
            "Converting XLSX data tables for presentations",
            "Archiving Excel budgets as uneditable PDFs",
            "Sharing spreadsheet data securely with clients"
        ],
        keywords: ["xls to pdf", "xlsx to pdf", "excel to pdf free", "convert xls to pdf online", "excel to pdf no sign up", "xls to pdf converter", "excel to pdf without excel", "excel to pdf converter", "convert excel to pdf", "convert excel to pdf free", "excel pdf converter"]
    },
    "png-to-pdf": {
        description: "Combine PNG to PDF in seconds — Convertify’s HD PNG combiner merges multiple PNG images into one crystal-clear, multi-page PDF at up to 300 DPI. Drag-and-drop ordering, transparency preserved, batch up to 100+ images, and zero watermarks. Whether you’re combining screenshots, design mockups, scanned receipts, or product photos, the result is a single professional PDF — created entirely in your browser, so your images never touch a server.",
        features: [
            "Combine multiple PNGs into one professional multi-page PDF",
            "HD quality output up to 300 DPI — print-ready",
            "Drag-and-drop to set the exact page order before converting",
            "Preserves PNG transparency and alpha channels",
            "Works on iPhone, Android, Windows & Mac browsers",
            "Batch process 100+ images in a single PDF",
            "100% private — files never uploaded to any server",
            "No sign-up, no watermarks, no daily limits"
        ],
        useCases: [
            "Combine multiple screenshots into one PDF for documentation or bug reports",
            "Merge design mockups (Figma exports, app screens) into a single client-ready PDF",
            "Combine scanned receipts saved as PNG into one tax-ready PDF",
            "Bundle product photos into a multi-page PDF catalog",
            "Stitch chapter pages or comic panels into a single readable PDF",
            "Combine assignment screenshots into one PDF for school upload portals"
        ],
        keywords: ["combine png to pdf", "merge png to pdf", "multiple png to pdf", "png to pdf hd", "png to pdf high quality", "combine pngs into pdf", "combine multiple png into one pdf", "save png as pdf", "convert png to pdf online free", "how to combine png files into one pdf"]
    },
    "pdf-to-png": {
        description: "Extract sharp, high-resolution PNG images from your PDF documents with Convertify. We support 'Alpha-Channel Preservation', allowing you to export pages with transparent backgrounds—perfect for logos, signatures, and design assets. Choose resolutions up to 300 DPI for professional social media and print-ready image extraction.",
        features: [
            "Alpha Support: Preserves transparent backgrounds for design",
            "High-Res Export: Up to 300 DPI for professional print quality",
            "Asset Extractor: Pull individual photos or logos from any page",
            "Batch ZIP: Convert 100+ pages into sharp PNG images instantly",
            "No Aliasing: Vector-to-pixel engine ensures smooth text edges",
            "Privacy First: All image extraction happens in your local browser"
        ],
        useCases: [
            "Extracting logos and graphics from PDF brand guides",
            "Converting PDF pages into sharp social media posts",
            "Saving document pages as transparent PNGs for overlays",
            "Creating high-quality image assets for web development",
            "Archiving design components as lossless PNG files"
        ],
        keywords: ["pdf to png converter free online", "convert pdf to high quality png", "extract pdf pages as images", "pdf to png no watermark"]
    },
    "watermark-pdf": {
        description: "Stamp a text watermark across every page of a PDF with Convertify. Set the wording, colour, font size and opacity, and the stamp is drawn diagonally across the centre of each page — useful for CONFIDENTIAL and DRAFT marks or light brand text. Everything runs in your browser, so the document is never uploaded.",
        features: [
            "Text watermark applied to every page in one pass",
            "Opacity control for subtle 'soft branding' or a bold stamp",
            "Pick any colour and font size",
            "Drawn diagonally across the page centre",
            "No sign-up, no watermark of ours added on top",
            "Secure and private: the file is processed locally, never uploaded",
            "Note: Image/logo watermarks are not supported yet. A PDF watermark is a deterrent, not a lock — someone with the right tools can remove it.",
        ],
        useCases: [
            "Adding 'CONFIDENTIAL' stamps to sensitive reports",
            "Branding architectural drawings with company logos",
            "Marking draft versions of manuscripts for review",
            "Adding copyright notices to creative portfolios",
            "Stamping archive documents with Bates numbering or dates"
        ],
        keywords: ["add watermark to pdf", "unremovable pdf watermark", "branding pdf online", "pdf stamp free"]
    },
    "sign-pdf": {
        description: "Sign contracts, NDAs, and agreements with legally valid e-signatures in seconds. Convertify allows you to draw, type, or upload your signature and 'Flatten' it into the PDF to prevent unauthorized moving or tampering. Our mobile-optimized signing engine lets you use your finger for a natural signature, all while keeping your documents 100% private.",
        features: [
            "Secure Flattening: Bakes your signature into the document",
            "Mobile-Optimized: Draw natural signatures with finger/stylus",
            "Legally Valid: Compatible with major e-signature standards",
            "Multi-Mode: Draw, type (with fonts), or upload signatures",
            "Privacy First: Your signature never touches a cloud server",
            "Add Dates & Initials: Complete legal forms in one session"
        ],
        useCases: [
            "Signing employment contracts and NDAs securely",
            "Executing real estate and rental agreements on mobile",
            "Signing child permission slips and waivers",
            "Approving professional invoices and work orders",
            "Completing bank forms and insurance documents"
        ],
        keywords: ["sign pdf online free", "e-sign pdf", "digital signature pdf", "sign document free"]
    },
    "edit-pdf": {
        description: "Annotate, fill, and markup your PDF documents with Convertify's high-performance editor. Add text, images, shapes, and arrows, then use our 'Flattening' feature to bake your edits into the document layer—making them permanent and professional. Perfect for filling forms or marking up blueprints without the lag of traditional cloud-based editors.",
        features: [
            "Flatten Edits: Make annotations unselectable and permanent",
            "High-Speed Engine: Edit large files and blueprints without lag",
            "Rich Annotations: Add text, shapes, arrows, and highlights",
            "Insert Images: Place logos or signatures anywhere on the page",
            "Form Filling: Easily fill out PDF forms and questionnaires",
            "100% Private: All editing happens locally on your device"
        ],
        useCases: [
            "Filling out PDF application forms and surveys",
            "Marking up architectural blueprints with notes and arrows",
            "Adding comments and peer-review notes to reports",
            "Annotating student assignments for feedback",
            "Adding branding images or stamps to design mockups"
        ],
        keywords: ["edit pdf online free", "annotate pdf", "pdf markup tool", "flatten pdf"]
    },
    "ocr-pdf": {
        description: "Transform static scans into searchable, editable documents with Convertify's high-accuracy OCR (Optical Character Recognition). Our engine achieves 99.8% precision and preserves complex formatting like tables, bold text, and column layouts. Whether it's an old archive or a blurry photo, our AI-powered recognition makes your content accessible in 100+ languages—all processed securely in your browser.",
        features: [
            "99.8% Accuracy: High-precision text recognition for all fonts",
            "Format Preservation: Maintains bold, italics, tables, and columns",
            "Multi-Language: Supports recognition for 100+ global languages",
            "Searchable Layer: Creates a Ctrl+F searchable layer over scans",
            "Denoising Filter: Improves extraction from low-quality/blurry scans",
            "100% Secure: Files are processed locally, never uploaded to a cloud"
        ],
        useCases: [
            "Digitizing old paper archives into searchable PDF libraries",
            "Extracting editable text from scanned legal contracts",
            "Making photographed textbook pages searchable for students",
            "Converting image-only PDF reports into structured data",
            "Translating scanned documents by first extracting the text"
        ],
        keywords: ["ocr pdf online free", "scanned pdf to searchable text", "high accuracy ocr", "extract text from image pdf"]
    },
    "add-page-numbers": {
        description: "Add professional pagination or Bates numbering to your PDF documents with Convertify. Our tool gives you 'Logical Sequencing' control—letting you skip cover pages, start numbering from any index, and even number multiple files as one continuous set. Perfect for legal professionals, students, and businesses who need precise document organization.",
        features: [
            "Logical Sequencing: Skip covers and start numbering anywhere",
            "Bates Stamping: Professional prefix and digit control for legal",
            "Continuous Numbering: Sync page counts across multiple PDF files",
            "Formatted Layouts: Choose 'Page X of N', 'X/N', or simple numbers",
            "Visual Positioning: Place numbers in 6 different zones per page",
            "Non-Destructive: Numbers are added via an annotation layer"
        ],
        useCases: [
            "Applying Bates numbering for multi-file legal discovery",
            "Adding page numbers to a thesis after the table of contents",
            "Ordering combined reports for professional business binds",
            "Creating sequential handouts for seminars and workshops",
            "Fixing missing page numbers on scanned document sets"
        ],
        keywords: ["add page numbers to pdf", "bates numbering tool", "pdf pagination free", "sequential page numbering"]
    },
    "redact-pdf": {
        description: "Permanently scrub sensitive information from your documents with Convertify's secure redaction tool. Unlike standard editors that only add a black overlay, our 'Data-Level Sanitization' strips the underlying text characters and metadata from the file's code. Once redacted, your SSNs, financial figures, and private names are physically unrecoverable by any PDF reader.",
        features: [
            "Permanent Sanitization: Strips text data, not just covering it",
            "Metadata Scrubbing: Removes hidden author and property info",
            "Search & Redact: Automatically find and blackout keywords",
            "Image Redaction: Excise specific areas of photos and diagrams",
            "PCI/HIPAA Compliant: Meets professional data privacy standards",
            "100% Private: All sanitization happens locally in your browser"
        ],
        useCases: [
            "Removing PII (Personally Identifiable Information) from legal files",
            "Blacking out financial account numbers before public sharing",
            "Sanitizing sensitive witness names in court documents",
            "Protecting trade secrets in company internal reports",
            "Removing social security numbers from application forms"
        ],
        keywords: ["redact pdf online free", "blackout text in pdf", "sanitize pdf document", "remove pii from pdf"]
    },
    "organize-pdf": {
        description: "Reorder, delete, and rotate PDF pages with Convertify's Visual Grid Manager. Our high-density layout allows you to view dozens of pages at once, making it the fastest way to organize 100+ page documents. We even 'Re-bind' your internal bookmarks and hyperlinks, ensuring your navigation stays functional after the reorder.",
        features: [
            "High-Density Grid: See and organize 100+ pages effortlessly",
            "Auto-Rebinding: Maintains bookmarks/links after reordering",
            "Dual Controls: Rotate or delete pages directly via thumbnails",
            "Multi-Select: Move or remove entire batches of pages at once",
            "Zero Lag: Optimized for large legal and academic files",
            "Privacy First: All organization happens in your browser memory"
        ],
        useCases: [
            "Rearranging chapters in a self-published ebook",
            "Organizing out-of-order scans into a logical document",
            "Removing blank or duplicate pages from high-volume sets",
            "Preparing academic journals for digital archiving",
            "Reordering presentation slides into a new narrative order"
        ],
        keywords: ["organize pdf pages online free", "reorder pdf pages", "visual pdf manager", "delete pages from pdf"]
    },
    "compare-pdf": {
        description: "Spot every change between versions with Convertify's side-by-side 'Semantic Diff' engine. We don't just find text changes; we detect shifts in layouts, images, and font styles. Our tool provides a clear change log and high-contrast visual overlays, ensuring you never miss a missing serial number or an extra comma in a high-stakes contract.",
        features: [
            "Semantic Diff: Detects meaning changes, not just pixel shifts",
            "Visual Overlay: Shows text, layout, and image changes in sync",
            "Change Log Summary: High-level overview of all modifications",
            "Side-by-Side Review: Locked scrolling for easy comparison",
            "Legal-Grade Precision: Spots even tiny punctuation differences",
            "Private Comparison: Files never leave your local browser"
        ],
        useCases: [
            "Comparing legal contract drafts to spot hidden changes",
            "Reviewing design revisions in architectural blueprints",
            "Verifying financial report updates between quarters",
            "Proofreading academic papers against earlier versions",
            "Checking for data shifts in complex PDF tables"
        ],
        keywords: ["compare pdf files online free", "pdf diff tool", "side by side pdf comparison", "highlight changes in pdf"]
    },
    "pdf-to-pdfa": {
        description: "Ensure your documents last for decades with Convertify's ISO-compliant PDF/A converter. We normalize your files for long-term archiving by embedding all fonts, defining color profiles, and validating metadata. This ensures your legal, government, or academic submissions look identical across any software or operating system, 50 years from now.",
        features: [
            "ISO-Compliant: Meets strict PDF/A-1b and PDF/A-2b standards",
            "Font Embedding: Ensures all characters are stored within the file",
            "Color Normalization: Sets device-independent color profiles",
            "Metadata Validation: Cleans and organizes tag structures",
            "Cross-Platform Safe: Guaranteed readability on all future OSs",
            "Archival Quality: Optimized for libraries and legal registries"
        ],
        useCases: [
            "Preparing research papers for university digital archives",
            "Converting legal filings for government XML/PDF/A portals",
            "Archiving company historical records for long-term storage",
            "Standardizing contracts for permanent digital binding",
            "Ensuring medical records stay accessible for the long term"
        ],
        keywords: ["pdf to pdf/a", "archive pdf format", "iso compliant pdf", "long term preservation"]
    },
    "crop-pdf": {
        description: "Trim margins and remove unwanted content securely with Convertify's Data-Level Cropper. Unlike basic tools that only mask edges, our 'True Hardware Crop' permanently removes the underlying data outside your selection, ensuring sensitive info hidden in the margins is gone forever. Perfect for fixing scanned alignments or resizing official documents.",
        features: [
            "Data-Level Crop: Permanently removes data outside the selection",
            "Auto-Margin Guide: Aligns the crop box to the text block automatically",
            "Manual Page Control: Set unique crops for different pages",
            "Secure Extraction: Ensures hidden metadata in margins is deleted",
            "High Fidelity: Keeps images and text at original high-res",
            "Fast & Private: Browser-based trimming with no cloud delay"
        ],
        useCases: [
            "Removing scanner artifacts and dark edges from old scans",
            "Securely trimming sensitive info from document margins",
            "Resizing PDFs to fit specific paper sizes (A4, Letter)",
            "Cropping out headers and footers for clean presentations",
            "Fixing misaligned pages in combined PDF sets"
        ],
        keywords: ["crop pdf online free", "secure pdf cropping", "remove pdf margins", "trim pdf permanent"]
    },
    "repair-pdf": {
        description: "Recover contents from broken or damaged files with Convertify's 'Deep-Scan' repair engine. We reconstruct corrupted headers and cross-reference tables (XRefs) that cause files to display 'Corrupt' or 'Invalid' errors. Even if a document was partially downloaded or crashed during saving, our rebuilder attempts to salvage every page and object.",
        features: [
            "Deep-Scan Reconstruction: Rebuilds broken file headers and tables",
            "XRef Recovery: Fixes errors that prevent PDFs from opening",
            "Stream Salvage: Attempts to recover images from partial files",
            "Validation Check: Ensures the repaired file meets PDF specs",
            "Zero Data Upload: Repair happens safely in your local browser",
            "Instant Recovery: No waiting for cloud queues or server processing"
        ],
        useCases: [
            "Fixing PDFs that won't open after an email attachment error",
            "Recovering data from PDFs crashed during a power failure",
            "Repairing files showing 'Unexpected cross-reference' errors",
            "Salvaging readable text from partially corrupted archives",
            "Restoring broken documents from old storage drives"
        ],
        keywords: ["repair pdf online free", "fix corrupt pdf", "recover damaged pdf", "pdf header repair"]
    },
    "html-to-pdf": {
        description: "Paste HTML source code and convert it to a clean, paginated PDF, right in your browser. Convertify extracts the text content and lays it out automatically — no CSS rendering, images, or external URLs.",
        features: [
            "Instant text-layout conversion from raw HTML",
            "Automatic word-wrap and pagination onto A4 pages",
            "No file size limits, no sign-up",
            "Secure & Private: HTML content is processed locally, never uploaded"
        ],
        useCases: [
            "Turning HTML email templates into a plain-text PDF record",
            "Exporting HTML documentation source as a readable PDF",
            "Quickly previewing raw HTML content as a document",
            "Archiving HTML snippets for offline reading"
        ],
        keywords: ["html to pdf online free", "html code to pdf", "paste html to pdf", "html snippet to pdf"]
    },
    "pdf-to-text": {
        description: "Extract the real text embedded in any digitally-created PDF, directly in your browser. Works instantly on PDFs with a text layer (exported from Word, Google Docs, etc.); scanned or image-only PDFs need to run through OCR first since they have no text layer to read.",
        features: [
            "Reads the PDF's real embedded text layer, not a placeholder",
            "Instant, local extraction with no upload",
            "Copy to clipboard or download as .txt",
            "No file size limits",
            "Privacy First: Files never leave your local browser session"
        ],
        useCases: [
            "Converting multi-column academic journals to plain text",
            "Extracting data from scanned receipts and invoices",
            "Repurposing legacy PDF content for new blog posts or books",
            "Preparing text for advanced AI analysis or sentiment tools",
            "Unlocking selectable text from 'image-only' legal archives"
        ],
        keywords: ["pdf to text", "extract text from pdf", "ocr pdf to text", "convert pdf to txt"]
    },
    "text-to-pdf": {
        description: "Transform raw text and logs into professional-grade PDF documents with Convertify. Our generator offers customizable fonts, margins, and paper sizes, allowing you to create polished manuscripts or clean developer documentation. Perfect for converting server logs, code snippets, or simple text files into an organized, readable PDF format.",
        features: [
            "Professional Layouts: Customizable margins, fonts, and sizes",
            "Developer Friendly: Monospaced font options for code and logs",
            "Smart Pagination: Automatically breaks long files into neat pages",
            "Batch Processing: Convert multiple .txt files simultaneously",
            "formatting Support: Preserves indentation and line breaks",
            "Local Security: Your text never leaves your device during conversion"
        ],
        useCases: [
            "Creating readable PDF reports from raw server logs",
            "Saving code snippets as organized PDF references",
            "Formatting simple text manuscripts for professional review",
            "Generating printable documentation from plain text files",
            "Converting legacy TXT files into a modern PDF archive"
        ],
        keywords: ["text to pdf converter free", "convert txt to pdf online", "make pdf from text file", "txt to pdf no watermark"]
    },
    "powerpoint-to-pdf": {
        description: "Convert PowerPoint presentations into flawless PDFs with 100% link and layout preservation. Convertify transforms PPT/PPTX slides into high-resolution documents designed for professional printing and presenting. Our engine preserves all embedded graphics, fonts, and internal hyperlinks—no server uploads required. Professional PPT to PDF conversion for free.",
        features: [
            "Preserves click-through links and internal slide navigation",
            "High-resolution slide export (Print & Presentation ready)",
            "Maintains 100% layout and font consistency",
            "Converts PPT and PPTX formats flawlessly",
            "Includes speaker notes and hidden slides (optional)",
            "Secure browser-based processing (no server storage)"
        ],
        useCases: [
            "Sharing pitch decks with external clients securely",
            "Creating high-res printable handouts for seminars",
            "Archiving presentations as professional PDF reports",
            "Converting slides for web publishing while keeping links",
            "Turning academic lectures into accessible PDF notes"
        ],
        keywords: ["powerpoint to pdf converter free", "convert ppt to pdf online", "pptx to pdf no sign up", "presentation to pdf free", "save powerpoint as pdf"]
    },
    "pdf-to-powerpoint": {
        description: "Convert PDF presentations back to fully editable PowerPoint slides with Convertify. Unlike tools that just export static images, our engine extracts text boxes, identifies font styles, and maps diagrams as editable slide objects. This allows you to update figures, fix typos, and repurpose old PDF content directly in PowerPoint or Google Slides.",
        features: [
            "Object Mapping: Extracts text and graphics as editable elements",
            "Font Recognition: Attempts to match and preserve font styles",
            "Slide Layout: Reconstructs the original slide structure",
            "Compatible: Works with MS PowerPoint, Google Slides, and Keynote",
            "High fidelity: Preserves charts, tables, and vector graphics",
            "Local conversion: Secure processing without server uploads"
        ],
        useCases: [
            "Editing presentation decks shared as 'static' PDFs",
            "Updating old speaker notes and slide content",
            "Repurposing academic lecture PDFs for new presentations",
            "extracting editable charts and diagrams for new reports",
            "Converting PDF marketing collateral back to editable PPTX"
        ],
        keywords: ["pdf to powerpoint converter free", "convert pdf to pptx online", "pdf to slides free", "turn pdf into presentation"]
    },
    "delete-pdf-pages": {
        description: "Securely trim your documents with Convertify's Visual Page Remover. Unlike basic tools that just 'hide' pages, our 'Object Purge' technology physically deletes the page stream and its data from the file's code. This permanently reduces file size and ensures sensitive content is 100% unrecoverable, all while keeping your remaining formatting perfectly intact.",
        features: [
            "Object Purge: Physically deletes data from the file stream",
            "Visual Grid: Easily identify pages by clear thumbnails",
            "Batch Delete: Remove ranges or non-sequential pages at once",
            "File Shrinking: Significant size reduction after page removal",
            "Formatting Safe: Re-indexes internal page trees automatically",
            "Zero Cloud: Safe, local browser-based page deletion"
        ],
        useCases: [
            "Removing blank pages from combined scanned sets",
            "Deleting confidential annexes before public distribution",
            "Splitting a long report by removing the parts you don't need",
            "Cleaning up PDF archives by removing redundant cover sheets",
            "Trimming large files to meet strict email attachment limits"
        ],
        keywords: ["delete pdf pages free", "remove pages from pdf online", "cut pages from pdf", "pdf page remover free"]
    },
    "reorder-pdf": {
        description: "Fix out-of-order documents and organize your PDF pages with our intuitive Drag-and-Drop Manager. Convertify uses 'Navigation-Safe' reordering, which means we automatically update your internal bookmarks and hyperlinks to point to their new page positions. Perfect for complex legal discovery sets, academic journals, and portfolios.",
        features: [
            "Drag-and-Drop: Intuitive visual sequencing of all pages",
            "Navigation-Safe: Updates internal links and bookmarks",
            "Multi-File Sort: Combine and reorder pages across many files",
            "Page Zoom: See more thumbnails for easier long-doc sorting",
            "Instant Preview: See your new page sequence immediately",
            "Local Memory: Sorting happens in your browser, no uploads"
        ],
        useCases: [
            "Organizing out-of-order scans into a logical sequence",
            "Rearranging portfolio entries for different job applications",
            "Sequencing combined reports for board presentations",
            "Reordering academic thesis chapters after final edits",
            "Fixing flipped or reversed scanned document sets"
        ],
        keywords: ["reorder pdf pages free", "rearrange pdf online", "organize pdf pages", "change pdf page order"]
    },
    "svg-to-png": {
        description: "Convert SVG vector graphics to high-resolution PNG images with Convertify. Our rendering engine preserves gradients, filters, and transparency while outputting crisp raster images at custom resolutions up to 4x scale. Perfect for designers who need pixel-perfect exports for web, social media, or print without installing desktop software.",
        features: [
            "High-Resolution Export: Render SVGs at 1x, 2x, 3x, or 4x scale",
            "Transparency Preserved: Maintains alpha channels in PNG output",
            "Gradient & Filter Support: Accurately renders complex SVG effects",
            "Custom Dimensions: Set exact width and height in pixels",
            "Batch Conversion: Process multiple SVG files simultaneously",
            "Background Options: Export with transparent or custom color backgrounds",
            "100% Private: All rendering happens locally in your browser"
        ],
        useCases: [
            "Exporting logo designs as high-res PNGs for social media profiles",
            "Converting SVG icons to PNG for platforms that lack SVG support",
            "Creating retina-ready images from vector illustrations",
            "Generating favicon and app icon sizes from a single SVG source",
            "Preparing vector artwork for print by converting to high-DPI PNG"
        ],
        keywords: ["svg to png", "convert svg to png", "svg to png converter", "svg to png high quality", "svg to png online free", "vector to raster", "svg to image", "svg to png transparent", "svg to png high resolution", "svg to bitmap"]
    },
    "bmp-to-jpg": {
        description: "Convert large BMP bitmap files to compact JPG images with Convertify. Reduce file sizes by up to 95% while maintaining excellent visual quality through adjustable compression settings. Ideal for modernizing legacy image archives and preparing bitmap screenshots for web or email sharing.",
        features: [
            "Massive Size Reduction: Compress BMP files by up to 95%",
            "Adjustable Quality: Fine-tune JPG compression from 1-100%",
            "Batch Processing: Convert hundreds of BMP files at once",
            "Color Fidelity: Preserves accurate color reproduction",
            "EXIF Data Handling: Option to strip or preserve metadata",
            "Instant Preview: Compare before and after quality visually",
            "Browser-Based: No software installation required"
        ],
        useCases: [
            "Converting legacy Windows BMP screenshots to shareable JPGs",
            "Reducing bitmap scan file sizes for email attachments",
            "Modernizing old image archives stored in BMP format",
            "Preparing bitmap graphics for website or blog uploads",
            "Converting medical or industrial BMP captures for reports",
            "Shrinking large BMP photos for cloud storage savings"
        ],
        keywords: ["bmp to jpg", "convert bmp to jpg", "bmp to jpeg", "bitmap to jpg converter", "bmp to jpg online free", "bmp to jpeg converter", "convert bitmap to jpeg", "bmp file converter", "bmp to jpg no watermark", "compress bmp to jpg"]
    },
    "gif-to-png": {
        description: "Convert GIF images to high-quality PNG format with Convertify. Upgrade your graphics from the limited 256-color GIF palette to full 24-bit PNG color depth with alpha transparency support. Perfect for extracting individual frames from animated GIFs or converting static GIF logos and icons to a modern lossless format.",
        features: [
            "Lossless Conversion: Zero quality degradation during format change",
            "Full Color Depth: Upgrade from 256 colors to 16.7 million colors",
            "Alpha Transparency: Convert GIF transparency to proper PNG alpha",
            "Frame Extraction: Pull individual frames from animated GIFs",
            "Batch Mode: Convert multiple GIF files to PNG simultaneously",
            "File Size Optimization: Smart compression for smaller PNG output"
        ],
        useCases: [
            "Upgrading legacy GIF logos to high-quality PNG for branding",
            "Extracting specific frames from animated GIFs as still images",
            "Converting GIF icons to PNG for modern web applications",
            "Improving image quality for GIF graphics used in presentations",
            "Replacing GIF website assets with optimized PNG versions"
        ],
        keywords: ["gif to png", "convert gif to png", "gif to png converter", "gif to png online free", "animated gif to png", "gif frame extractor", "gif to png transparent", "gif to png high quality", "convert gif to png free", "gif image converter"]
    },
    "tiff-to-pdf": {
        description: "Convert TIFF and multi-page TIFF files to professional PDF documents with Convertify. Our converter handles single and multi-page TIFF images seamlessly, preserving high resolution and color accuracy throughout the process. Ideal for digitizing scanned documents, architectural plans, and medical imaging files into universally accessible PDF format.",
        features: [
            "Multi-Page Support: Convert multi-page TIFF stacks into one PDF",
            "High Resolution: Preserves original DPI and image clarity",
            "Color Accuracy: Maintains CMYK, RGB, and grayscale color spaces",
            "Compression Options: Choose between quality and file size balance",
            "Page Size Control: Fit to A4, Letter, or original image dimensions",
            "Batch Conversion: Process multiple TIFF files into separate PDFs",
            "100% Private: Files are processed locally in your browser"
        ],
        useCases: [
            "Converting scanned multi-page TIFF documents to shareable PDFs",
            "Archiving high-resolution architectural blueprints as PDFs",
            "Preparing medical imaging TIFF files for digital patient records",
            "Converting fax TIFF files into readable PDF documents",
            "Digitizing legacy document archives stored in TIFF format",
            "Creating PDF submissions from TIFF scans for government portals"
        ],
        keywords: ["tiff to pdf", "convert tiff to pdf", "tiff to pdf converter", "multi page tiff to pdf", "tif to pdf", "tiff to pdf online free", "convert tif to pdf", "tiff to pdf free", "batch tiff to pdf", "multipage tiff to pdf", "tiff to pdf no watermark"]
    },
    "csv-to-json": {
        description: "Transform CSV spreadsheet data into structured JSON format with Convertify. Our intelligent parser handles complex CSV files with quoted fields, nested commas, and various delimiters while producing clean, properly formatted JSON output. Essential for developers and data analysts who need to convert tabular data into API-ready JSON structures.",
        features: [
            "Smart Parsing: Handles quoted fields, escaped characters, and edge cases",
            "Custom Delimiters: Support for commas, tabs, semicolons, and pipes",
            "Header Detection: Automatically uses first row as JSON keys",
            "Nested Output: Option to generate nested or flat JSON structures",
            "Array or Object: Choose between JSON array or keyed object output",
            "Pretty Print: Formatted JSON output with proper indentation",
            "Large File Support: Process CSV files with thousands of rows efficiently",
            "100% Private: Data conversion happens entirely in your browser"
        ],
        useCases: [
            "Converting exported spreadsheet data for REST API consumption",
            "Preparing CSV datasets for NoSQL database imports like MongoDB",
            "Transforming analytics CSV exports into JSON for dashboards",
            "Converting product catalog CSVs to JSON for ecommerce platforms",
            "Migrating legacy CSV data stores to modern JSON-based systems",
            "Creating JSON configuration files from CSV parameter sheets"
        ],
        keywords: ["csv to json", "convert csv to json", "csv to json converter", "csv to json online", "csv to json free", "csv to json parser", "spreadsheet to json", "tabular data to json", "csv to json array", "csv to json online free", "csv file to json"]
    },
    "json-to-csv": {
        description: "Convert JSON data into clean CSV spreadsheet format with Convertify. Our converter intelligently flattens nested JSON objects and arrays into organized rows and columns, making complex API responses and database exports easy to analyze in Excel or Google Sheets. Handles large JSON files efficiently with smart column mapping.",
        features: [
            "Auto-Flattening: Converts nested JSON objects into flat CSV columns",
            "Array Handling: Intelligently expands JSON arrays into separate rows",
            "Column Mapping: Automatically detects and organizes all JSON keys",
            "Custom Delimiters: Output as CSV, TSV, or custom-separated values",
            "Header Generation: Creates clean column headers from JSON paths",
            "Large File Support: Efficiently processes JSON files with thousands of records",
            "Excel Compatible: Output opens perfectly in Excel and Google Sheets"
        ],
        useCases: [
            "Exporting API response data to spreadsheets for business analysis",
            "Converting MongoDB or Firebase exports to CSV for reporting",
            "Creating Excel reports from JSON log files and analytics data",
            "Preparing JSON datasets for import into SQL databases",
            "Converting JSON product feeds to CSV for bulk editing",
            "Transforming JSON survey results into spreadsheet format for review",
            "Flattening complex nested data for non-technical stakeholders"
        ],
        keywords: ["json to csv", "convert json to csv", "json to csv converter", "json to csv online", "json to csv free", "json to spreadsheet", "json to excel", "flatten json to csv", "json to csv online free", "json array to csv", "json to csv converter free"]
    },
    "xml-to-json": {
        description: "Convert XML documents to clean JSON format with Convertify. Our parser handles complex XML structures including attributes, namespaces, CDATA sections, and deeply nested elements while producing readable, well-structured JSON output. Perfect for developers modernizing legacy XML APIs or migrating configuration files to JSON format.",
        features: [
            "Full XML Support: Handles attributes, namespaces, and CDATA sections",
            "Smart Attribute Mapping: Converts XML attributes to JSON properties",
            "Namespace Handling: Preserves or strips XML namespace prefixes",
            "Array Detection: Identifies repeating elements as JSON arrays",
            "Pretty Formatting: Outputs clean, indented JSON for readability",
            "Validation: Checks XML well-formedness before conversion",
            "Large File Support: Processes complex XML documents efficiently",
            "100% Browser-Based: Your data never leaves your device"
        ],
        useCases: [
            "Migrating legacy SOAP API responses to modern JSON format",
            "Converting XML configuration files to JSON for Node.js projects",
            "Transforming XML data feeds into JSON for frontend applications",
            "Parsing XML sitemaps into JSON for SEO analysis tools",
            "Converting XML-based RSS feeds to JSON for web dashboards",
            "Modernizing enterprise XML data stores to JSON databases"
        ],
        keywords: ["xml to json", "convert xml to json", "xml to json converter", "xml to json online", "xml to json free", "xml parser to json", "xml to json online free", "xml to json converter free", "xml data to json", "parse xml to json", "xml to json transformer"]
    },
    "markdown-to-pdf": {
        description: "Turn a Markdown file or pasted Markdown into a styled PDF. Convertify renders headings, lists, links, bold and italic text, blockquotes, horizontal rules and fenced code blocks with a clean document stylesheet, showing you a live preview as you type. Everything is processed in your browser.",
        features: [
            "Headings, paragraphs, ordered and unordered lists",
            "Bold, italic, inline code and fenced code blocks",
            "Links, blockquotes and horizontal rules",
            "Live preview beside the editor as you type",
            "Upload a .md file or paste Markdown directly",
            "100% private: nothing is uploaded",
            "Note: Tables, task lists, syntax highlighting, LaTeX math and embedded images are not supported. Export opens your browser's print dialog — choose 'Save as PDF' there.",
        ],
        useCases: [
            "Generating professional PDF documentation from README files",
            "Creating printable reports from Markdown project notes",
            "Converting technical blog posts to downloadable PDF articles",
            "Producing academic papers and manuscripts from Markdown source",
            "Building PDF user manuals from Markdown documentation repos",
            "Creating polished resumes and CVs written in Markdown"
        ],
        keywords: ["markdown to pdf", "convert markdown to pdf", "md to pdf", "markdown to pdf converter", "markdown to pdf online", "markdown to pdf free", "md to pdf converter", "github markdown to pdf", "markdown to pdf online free", "convert md to pdf free", "markdown pdf generator"]
    },
    "base64": {
        description: "Encode and decode Base64 strings instantly with Convertify. Convert text, files, and images to and from Base64 encoding for embedding data in HTML, CSS, JSON, and API payloads. Our tool supports standard Base64 and URL-safe Base64 variants, handling large inputs efficiently with real-time encoding and decoding preview.",
        features: [
            "Bidirectional: Encode to Base64 and decode from Base64 instantly",
            "File Support: Encode images, documents, and binary files to Base64",
            "URL-Safe Mode: Generate URL-safe Base64 strings for web applications",
            "Real-Time Preview: See encoded or decoded output as you type",
            "Large Input Handling: Process large files and strings efficiently",
            "Copy to Clipboard: One-click copy of encoded or decoded results",
            "Data URI Generation: Create ready-to-use data URIs for HTML and CSS"
        ],
        useCases: [
            "Embedding images as Base64 data URIs in HTML and CSS files",
            "Encoding API authentication tokens and credentials",
            "Decoding Base64 strings from API responses for debugging",
            "Converting binary file content for JSON payload transmission",
            "Generating Base64 encoded email attachments for MIME messages",
            "Encoding configuration data for environment variables",
            "Debugging encoded strings in JWT tokens and cookies"
        ],
        keywords: ["base64 encoder", "base64 decoder", "base64 encode", "base64 decode", "base64 converter", "base64 to text", "text to base64", "base64 online", "base64 encode online", "base64 decode online", "image to base64", "base64 to image"]
    },
    "qr-code-generator": {
        description: "Generate a scannable QR code for any URL or text and download it as a PNG. Pick the output size — 256, 400, 512 or 1024 pixels — and save it straight to your device. No sign-up, no account, and no limit on how many you make.",
        features: [
            "Encode any URL or text, up to 4000 characters",
            "Choose an output size from 256px up to 1024px",
            "Live preview before you download",
            "Download as PNG, ready for print or screen",
            "Free with no sign-up and no usage limit",
            "Note: QR images are rendered by the third-party goqr.me API, so unlike our PDF tools the text you encode does leave your device. Colour customisation, centre logos, error-correction control and SVG export are not supported.",
        ],
        useCases: [
            "Creating QR codes for business cards and marketing materials",
            "Generating WiFi login QR codes for offices and restaurants",
            "Adding QR codes to product packaging for quick URL access",
            "Creating event check-in QR codes for tickets and badges",
            "Generating vCard QR codes for easy contact sharing",
            "Adding scannable links to printed flyers and posters",
            "Creating QR codes for payment links and digital menus"
        ],
        keywords: ["qr code generator", "create qr code", "qr code maker", "generate qr code free", "qr code generator online", "custom qr code", "qr code with logo", "qr code creator free", "qr code png", "qr code svg", "free qr code generator", "wifi qr code generator"]
    },
    "autocad-pdf-editor": {
        description: "Edit text inside AutoCAD-exported PDFs — the one thing every other PDF editor on the internet fails at. AutoCAD draws SHX text as raw vector strokes with no underlying text layer, so Adobe, Smallpdf, and ILovePDF treat the page as uneditable. Convertify scans the vector geometry, groups strokes into editable text regions, and lets you replace them with a CAD-style font so your output looks identical to the original. Fix that forgotten dimension or label without re-opening AutoCAD.",
        features: [
            "Detects SHX Vector Text: Finds clickable text regions other editors can't see",
            "CAD-Style Replacement Font: Output matches AutoCAD's thin-stroke aesthetic",
            "Position & Size Match: Replacement text sits in the exact original location",
            "Multi-Page Support: Edit any page in a full drawing set",
            "Auto-Detect TTF vs SHX: Routes TrueType PDFs to the standard editor",
            "100% Browser-Based: Your drawings never leave your device",
            "No AutoCAD License Needed: Works on any device with a browser",
            "Free Forever: No watermarks, sign-up, or download required"
        ],
        useCases: [
            "Fixing a wrong dimension on a floor plan before sending to a client",
            "Updating a revision number on an as-built drawing",
            "Correcting a typo in a title block or room label",
            "Changing schedule of openings data without re-exporting from AutoCAD",
            "Updating project addresses on architectural drawings",
            "Editing engineering drawings when you don't have AutoCAD on this device",
            "Making last-minute label changes for site contractors and trades"
        ],
        keywords: ["edit autocad pdf", "edit autocad pdf text online", "autocad pdf editor", "edit shx pdf text", "modify autocad pdf", "edit cad drawing pdf", "edit dimension text in pdf", "blueprint text editor", "engineering pdf editor", "fix autocad pdf typo", "free autocad pdf text editor"]
    }
};

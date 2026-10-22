// Pre-defined SEO content for each tool - can be imported in both server and client components
// Keywords sourced from NotebookLM competitive analysis

export const toolContentData: Record<string, {
    description: string;
    features: string[];
    useCases: string[];
    keywords: string[];
}> = {
    "merge-pdf": {
        description: "Merge PDF files online for free. Combine multiple PDFs into one document with drag-and-drop reordering. No watermarks, no sign-up, no limit on the number of files. Mix PDFs with JPG/PNG images. 100% private — files never leave your browser.",
        features: [
            "No limit on the number of files (up to 200 MB each)",
            "No watermarks added to your documents",
            "No sign-up or registration required",
            "Drag files (or use the arrows) to set the exact order",
            "Pages are copied across as they are, not re-rendered",
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
            "Pick pages by number or type a range",
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
        description: "Compress a PDF to 50KB, 100KB or 200KB for government and visa uploads, or under 10MB / Gmail’s 25MB attachment cap. Multi-pass, no watermark, no sign-up. Files stay in your browser.",
        features: [
            "Target 50KB, 100KB, 200KB, 10MB, or a custom size",
            "Built for form uploads and email attachment limits",
            "No watermarks, no daily cap, no sign-up",
            "100% private — the PDF never leaves your device",
            "Multi-pass quality search until the file is at or under the cap",
            "Also accepts a photo if you need a one-file PDF under a KB limit"
        ],
        useCases: [
            "Compressing PDFs to 100KB or 200KB for government form uploads",
            "Getting a scan under Gmail’s 25MB limit or a 10MB office cap",
            "Reducing passport and visa supporting documents for portal uploads",
            "Making a job or university application PDF small enough to attach",
            "Shrinking a scan that was rejected as too large, without an account"
        ],
        keywords: ["convertify pdf compressor", "compress pdf to 100kb", "compress pdf to 200kb", "compress pdf for gmail", "compress pdf for email", "pdf compressor 100kb", "reduce pdf size", "shrink pdf online free", "compress pdf for government forms", "best pdf compressor free", "pdf size reducer no watermark"]
    },
    "jpg-to-pdf": {
        description: "Convert JPG photos to PDF free. Combine unlimited camera photos into one multi-page PDF and arrange them in any order. For PNG screenshots and design exports, use PNG to PDF instead so the two tools stay distinct.",
        features: [
            "Combine unlimited JPG photos into one PDF - no limits",
            "Works on iPhone, Android, Windows, Mac & tablets",
            "Each page is sized to the photo, not a forced A4 box",
            "Drag and drop to reorder photos before converting",
            "Original photo resolution is preserved",
            "100% private - photos never leave your device",
            "No sign-up, no watermarks, completely free"
        ],
        useCases: [
            "Converting phone camera photos to PDF for homework submissions",
            "Scanning receipts and documents to PDF on iPhone/Android",
            "Creating photo albums from vacation pictures",
            "Combining product photos into catalogs for ecommerce",
            "Bundling receipt photos for expense reports",
            "Creating portfolios from photographed artwork",
            "Batch converting camera photos for official applications"
        ],
        keywords: ["jpg to pdf", "convert jpg to pdf free", "combine photos to pdf", "multiple jpg to one pdf", "scan to pdf iphone", "scan to pdf android", "photo to pdf converter", "jpg to pdf no watermark", "image to pdf combiner"]
    },
    "pdf-to-jpg": {
        description: "Convert each PDF page to a JPG in your browser. A one-page file downloads as a single image; multi-page files come as a ZIP. Nothing is uploaded, and no watermark is added.",
        features: [
            "Each PDF page becomes one JPG",
            "Rendered locally with PDF.js — nothing uploaded",
            "Multi-page PDFs download as a ZIP of JPGs",
            "No watermark, no sign-up, no daily cap",
            "Works for sharing a page on social, slides, or email"
        ],
        useCases: [
            "Converting presentation slides to images for sharing",
            "Saving a contract page as a picture for chat or email",
            "Putting PDF pages into a slide deck as images",
            "Archiving invoices as lightweight JPGs",
            "Turning design mockups into reviewable image sets"
        ],
        keywords: ["pdf to jpg", "pdf to jpeg", "convert pdf to image", "pdf pages to jpg", "save pdf as picture", "turn pdf into image", "batch pdf to jpg"]
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
            "Pick pages by number or range, e.g. 1,3,5-7",
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
        description: "Secure your sensitive PDF files with AES-256 encryption using Convertify's private protector. Unlike cloud tools, the encryption happens 100% in your browser—your password never touches a server. Set an open password and nobody can read the file without it. Ideal for financial statements, legal contracts, and personal IDs.",
        features: [
            "Financial-Safe: 100% browser-based AES-256 encryption",
            "Set an open password to prevent unauthorized viewing",
            "Password strength meter as you type",
            "AES-256 (PDF 2.0 standard security handler)",
            "Password and data never leave your local device",
            "Opens in Acrobat, Chrome, Preview and other current PDF readers"
        ],
        useCases: [
            "Securing sensitive financial and tax documents",
            "Protecting legal contracts before email distribution",
            "Locking company internal reports before sharing them",
            "Securing personal ID scans and passport copies",
            "Encrypting PDFs before storing them in the cloud"
        ],
        keywords: ["password protect pdf", "encrypt pdf", "secure pdf online", "lock pdf file free"]
    },
    "unlock-pdf": {
        description: "Regain full control of your PDF files by removing 'Owner' and 'Permission' restrictions instantly. If a document is locked for printing or copying, Convertify flips the security metadata in your browser without any quality loss. While we respect document integrity for 'Open Passwords' (requiring your input once), we make removing workflow restrictions fast and secure.",
        features: [
            "Remove printing and copying restrictions instantly",
            "Unlock 'Permission Passwords' to enable editing",
            "Decrypts in place: text, fonts and images are kept",
            "Works with RC4 and AES-256; AES-128 files are unlocked as page images",
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
        description: "Combine PNG images into one PDF in your browser. Drag-and-drop ordering, transparency preserved, and zero watermarks. Built for screenshots, design exports, and scanned pages — not camera photos (those belong on JPG to PDF).",
        features: [
            "Combine multiple PNGs into one multi-page PDF",
            "Each image is embedded at its original resolution",
            "Drag-and-drop to set the exact page order before converting",
            "Preserves PNG transparency and alpha channels",
            "Works on iPhone, Android, Windows & Mac browsers",
            "No fixed image count; large batches are limited by device memory",
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
        description: "Convert every page of a PDF to a PNG image with Convertify. Pages are rendered at 150, 220 or 300 DPI (your choice) on a white background and saved losslessly, so text and line art have no JPG artifacts. Multi-page files download as a ZIP.",
        features: [
            "One PNG per page at 150, 220 or 300 DPI",
            "Lossless PNG: no JPG artifacts on text or line art",
            "Whole pages only: embedded images are not extracted separately",
            "Multi-page PDFs download as a ZIP",
            "No watermark, no sign-up",
            "Privacy First: All image extraction happens in your local browser"
        ],
        useCases: [
            "Saving a page of a PDF brand guide as an image",
            "Converting PDF pages into sharp social media posts",
            "Putting document pages into slides or web pages",
            "Creating page images for web development",
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
            "Marking architectural drawings with your company name",
            "Marking draft versions of manuscripts for review",
            "Adding copyright notices to creative portfolios",
            "Stamping archive copies with a fixed date or 'ARCHIVE' label"
        ],
        keywords: ["add watermark to pdf", "text watermark pdf", "branding pdf online", "pdf stamp free"]
    },
    "sign-pdf": {
        description: "Sign contracts, NDAs, and agreements with an electronic signature in seconds. Convertify lets you draw, type, or upload your signature and draws it into the page itself, so it can't be dragged around in a normal PDF viewer. You can draw with your finger on a phone, and your documents stay 100% private.",
        features: [
            "Flattened: Your signature is drawn into the page content",
            "Touch Drawing: Draw natural signatures with finger/stylus",
            "Electronic Signature: Fine for everyday agreements (not a certificate-based digital signature)",
            "Multi-Mode: Draw, type (with fonts), or upload signatures",
            "Privacy First: Your signature never touches a cloud server",
            "Multiple Placements: Sign several pages in one session"
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
        description: "Annotate and mark up your PDF documents with Convertify's in-browser editor. Type new text onto any page, draw freehand, and add highlight and outline boxes; your marks are drawn into the page itself when you save. Handy for typing answers onto forms that have no fillable fields. Existing text can't be edited, and a mouse is needed.",
        features: [
            "Flattened Output: Your marks are drawn into the page content",
            "Add Text: Four sizes and five colours, placed with a click",
            "Freehand Pen: Sketch or write notes with the mouse",
            "Highlights and Boxes: Fixed-size highlight and outline rectangles",
            "Undo and Clear: Remove the last mark or wipe a page",
            "100% Private: All editing happens locally on your device"
        ],
        useCases: [
            "Typing answers onto PDF forms that have no fillable fields",
            "Marking up architectural blueprints with notes and freehand marks",
            "Adding comments and peer-review notes to reports",
            "Annotating student assignments for feedback",
            "Boxing and highlighting areas of a design mockup that need changes"
        ],
        keywords: ["edit pdf online free", "annotate pdf", "pdf markup tool", "flatten pdf"]
    },
    "ocr-pdf": {
        description: "Scan paper documents to PDF with your phone or webcam. Convertify's scanner finds the page edges live, crops and straightens each capture, and applies a Xerox B&W, Magic Color, Grayscale or Original filter. Pages are saved as images in one PDF; there is no OCR, so the text is not searchable. Everything is processed in your browser.",
        features: [
            "Live Edge Detection: Outlines the page in the camera view",
            "Auto Crop & Straighten: Corrects the perspective of each capture",
            "Scan Filters: Xerox B&W, Magic Color, Grayscale or Original",
            "Multi-Page: Scan many pages and save them as one PDF",
            "Add Files: Import photos or PDF pages alongside camera scans",
            "100% Secure: Files are processed locally, never uploaded to a cloud"
        ],
        useCases: [
            "Scanning receipts into one PDF for an expense claim",
            "Sending a signed paper form back by email",
            "Capturing handwritten notes or handouts as a PDF",
            "Turning a phone photo of a letter into a clean B&W page",
            "Preparing paper documents for online application portals"
        ],
        keywords: ["document scanner online", "scan document to pdf", "camera to pdf", "photo to scanned pdf"]
    },
    "add-page-numbers": {
        description: "Add page numbers to every page of a PDF with Convertify. Pick one of six positions (top or bottom; left, centre or right) and the number to start from, so a document can continue the count from a previous section. Numbers are plain 12 pt black text, added in your browser.",
        features: [
            "Six Positions: Top or bottom, left, centre or right",
            "Any Start Number: Continue the count from an earlier section",
            "Every Page: Numbers run 1, 2, 3... across the whole document",
            "Plain and Readable: 12 pt black Helvetica digits",
            "Non-Destructive: Numbers are drawn on top; your content is untouched",
            "Private: The file is processed in your browser, never uploaded"
        ],
        useCases: [
            "Numbering a merged bundle of exhibits from 1 to N",
            "Numbering a thesis chapter that continues from the previous one",
            "Ordering combined reports for professional business binds",
            "Creating sequential handouts for seminars and workshops",
            "Fixing missing page numbers on scanned document sets"
        ],
        keywords: ["add page numbers to pdf", "number pdf pages", "pdf pagination free", "sequential page numbering"]
    },
    "redact-pdf": {
        description: "Permanently scrub sensitive information from your documents with Convertify's secure redaction tool. Unlike editors that only draw a black box on top, Convertify flattens every page you redact into an image with the boxes burned in, so the text underneath is removed from the file along with the document's metadata. SSNs, account numbers and names under a box can't be copied or recovered, and pages you don't touch stay exactly as they were.",
        features: [
            "Real Redaction: Redacted pages are flattened, so covered text is gone, not hidden",
            "Metadata Scrubbing: Removes hidden author and property info",
            "Blackout or Whiteout: Solid black bars, or white boxes that blend into the page",
            "Image Redaction: Excise specific areas of photos and diagrams",
            "Touch Friendly: Draw boxes with a mouse or a finger",
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
        description: "Reorder, delete, and rotate PDF pages with Convertify's page grid. Every page appears as a thumbnail with its own controls: arrows to move it left or right, a button to rotate it 90°, and one to delete it. When you save, the pages are copied into a new PDF in your order, with text and images unchanged.",
        features: [
            "Thumbnail Grid: See every page before you change anything",
            "Move Pages: Arrow buttons shift a page one place left or right",
            "Rotate or Delete: Controls on each thumbnail",
            "Pages Copied As-Is: Text and images are not re-rendered",
            "One Save: All changes are applied in a single pass",
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
        description: "Check what changed between two versions of a PDF with Convertify. The tool reads the text on each page, lists lines that were added or removed, and shows both versions side by side or overlaid so you can check layout and images by eye. A plain-text report of the changes is available to download.",
        features: [
            "Text Diff: Lists added and removed lines, page by page",
            "Overlay View: Both pages drawn on top of each other at half opacity",
            "Change Summary: Counts of additions and deletions",
            "Side-by-Side Review: Page through both versions together",
            "Text Report: Download the changes as a .txt file",
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
        description: "Trim margins from every page of a PDF with Convertify. Set the top, bottom, left and right margins (up to 25% each) with sliders or a preset, check them on a live page preview, and download. Cropping hides the area outside the box rather than deleting it, so use Redact PDF for anything sensitive.",
        features: [
            "Margin Sliders: Trim each side by 0-25% of the page",
            "Quick Presets: Light (5%), Medium (10%) and Wide (15%)",
            "Live Preview: See the trimmed area on any page before saving",
            "All Pages at Once: The same crop applies to the whole document",
            "High Fidelity: Text and images are not re-compressed",
            "Fast & Private: Browser-based trimming with no cloud delay"
        ],
        useCases: [
            "Removing scanner artifacts and dark edges from old scans",
            "Trimming wide print margins for easier reading on a phone",
            "Cropping out headers and footers for clean presentations",
            "Zooming in on the content area of slides or handouts"
        ],
        keywords: ["crop pdf online free", "trim pdf margins", "remove pdf margins", "crop all pdf pages"]
    },
    "repair-pdf": {
        description: "Recover contents from broken or damaged PDFs with Convertify. The repair strips junk before the PDF header, rebuilds a missing or damaged trailer, and copies every page that can still be read into a fresh file. If a document was partially downloaded or crashed during saving, the pages that survived are saved; as a last resort they are saved as images.",
        features: [
            "Header Fix: Skips junk bytes in front of the PDF header",
            "Trailer Rebuild: Fixes cut-off files that end mid-download",
            "Page Salvage: Copies every readable page into a fresh PDF",
            "Image Fallback: Saves drawable pages as images when nothing else works",
            "Zero Data Upload: Repair happens safely in your local browser",
            "Recovery Report: Shows how many pages were recovered"
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
            "No sign-up and no daily limit",
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
            "PDFs up to 200 MB",
            "Privacy First: Files never leave your local browser session"
        ],
        useCases: [
            "Converting multi-column academic journals to plain text",
            "Pulling the text out of digital invoices and statements",
            "Repurposing legacy PDF content for new blog posts or books",
            "Preparing text for advanced AI analysis or sentiment tools",
            "Copying clauses out of contracts exported as PDF"
        ],
        keywords: ["pdf to text", "extract text from pdf", "ocr pdf to text", "convert pdf to txt"]
    },
    "text-to-pdf": {
        description: "Turn a plain .txt file into a clean PDF with Convertify. Each line of the file becomes a line in the PDF, set in 12 pt Helvetica on A4 pages with automatic page breaks. Lines longer than 90 characters are cut off rather than wrapped, and only Western (Latin) characters are supported, so it suits notes, lists and short-line text.",
        features: [
            "Simple Layout: 12 pt Helvetica on A4 with 50-point margins",
            "Line for Line: Line breaks and leading spaces are kept",
            "Smart Pagination: Automatically breaks long files into neat pages",
            "Note: Lines over 90 characters are cut off, not wrapped",
            "Note: Western (Latin) characters only",
            "Local Security: Your text never leaves your device during conversion"
        ],
        useCases: [
            "Turning short notes and lists into a printable PDF",
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
        description: "Turn a PDF into a PowerPoint deck with Convertify. Each page is rendered as a high-resolution image and placed full-size on its own 16:9 slide, so it looks exactly like the PDF. The page content is a picture, not editable text, but you can present it, reorder slides, and add your own text, notes and animations on top.",
        features: [
            "One Slide per Page: Every PDF page becomes a slide",
            "High Resolution: Pages rendered about 1920 pixels wide",
            "16:9 Slides: Best for PDFs exported from slide decks",
            "Compatible: Opens in MS PowerPoint and Google Slides",
            "Looks Like the PDF: Charts, equations and fonts are kept as pictures",
            "Local conversion: Secure processing without server uploads"
        ],
        useCases: [
            "Presenting a deck you only received as a PDF",
            "Adding speaker notes to slides that came as a PDF",
            "Reusing academic lecture slides inside a new presentation",
            "Mixing PDF pages into an existing PowerPoint deck",
            "Adding animations or annotations on top of PDF slides"
        ],
        keywords: ["pdf to powerpoint converter free", "convert pdf to pptx online", "pdf to slides free", "turn pdf into presentation"]
    },
    "delete-pdf-pages": {
        description: "Remove unwanted pages with Convertify's visual page remover. Every page appears as a thumbnail; delete the ones you don't need and download. The new file is built only from the pages you keep, so the deleted pages are not in it, and the remaining pages keep their text, fonts and images unchanged.",
        features: [
            "Rebuilt File: Deleted pages are left out of the new PDF entirely",
            "Visual Grid: Easily identify pages by clear thumbnails",
            "Several at Once: Delete as many pages as you like before saving",
            "Smaller File: Content used only by deleted pages is dropped",
            "Formatting Safe: Kept pages are copied as they are",
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
        description: "Fix out-of-order documents with Convertify's page grid. Every page appears as a thumbnail with arrow buttons that move it one place left or right, so you can put a document back in sequence by eye. Pages are copied into a new file in your order; bookmarks are not carried over.",
        features: [
            "Arrow Controls: Move any page one place left or right",
            "Thumbnail Grid: See what's on each page before moving it",
            "Rotate or Delete: Fix sideways or unwanted pages at the same time",
            "Pages Copied As-Is: Text and images are not re-rendered",
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
        description: "Convert SVG vector graphics to high-resolution PNG images with Convertify. Your browser draws the SVG, gradients, filters and transparency included, at its own size or at a custom width and height up to 8192 pixels. Perfect for designers who need crisp exports for web, social media, or print without installing desktop software.",
        features: [
            "High-Resolution Export: Any custom size up to 8192 × 8192 px",
            "Transparency Preserved: Maintains alpha channels in PNG output",
            "Gradient & Filter Support: Accurately renders complex SVG effects",
            "Custom Dimensions: Set exact width and height in pixels",
            "Batch Conversion: Process multiple SVG files simultaneously",
            "Transparent Background: Areas the SVG leaves empty stay transparent",
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
            "Adjustable Quality: Set JPG quality from 70% to 100%",
            "Batch Processing: Convert many BMP files at once",
            "Same Dimensions: Pixel width and height stay unchanged",
            "ZIP Download: Several converted files download together",
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
        description: "Convert GIF images to lossless PNG format with Convertify. Every pixel and the GIF's transparency carry over exactly, in a format design tools and editors handle well. Perfect for extracting individual frames from animated GIFs or converting static GIF logos and icons to a modern lossless format.",
        features: [
            "Lossless Conversion: Zero quality degradation during format change",
            "Room to Edit: Later edits in PNG aren't limited to 256 colours",
            "Alpha Transparency: Convert GIF transparency to proper PNG alpha",
            "Frame Extraction: Export every frame of an animated GIF as a numbered PNG",
            "Batch Mode: Convert multiple GIF files to PNG simultaneously",
            "Full Frames: Each animation frame is composited the way a browser plays it"
        ],
        useCases: [
            "Upgrading legacy GIF logos to high-quality PNG for branding",
            "Extracting every frame of an animated GIF as still images",
            "Converting GIF icons to PNG for modern web applications",
            "Getting a still image from a GIF for slides and documents",
            "Replacing GIF website assets with optimized PNG versions"
        ],
        keywords: ["gif to png", "convert gif to png", "gif to png converter", "gif to png online free", "animated gif to png", "gif frame extractor", "gif to png transparent", "gif to png high quality", "convert gif to png free", "gif image converter"]
    },
    "tiff-to-pdf": {
        description: "Convert TIFF and multi-page TIFF files to professional PDF documents with Convertify. Our converter handles single and multi-page TIFF images seamlessly, preserving high resolution and color accuracy throughout the process. Ideal for digitizing scanned documents, architectural plans, and medical imaging files into universally accessible PDF format.",
        features: [
            "Multi-Page Support: Convert multi-page TIFF stacks into one PDF",
            "High Resolution: Preserves original DPI and image clarity",
            "Lossless: Pages are re-encoded as PNG, never as lossy JPEG",
            "Real Paper Size: Uses the scan's recorded DPI to size each PDF page",
            "Combine or Separate: One PDF for all files, or one PDF per file",
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
            "Delimiter Detection: Commas, tabs, semicolons and pipes are picked up automatically",
            "Header Row: The first row becomes the JSON keys",
            "Array of Objects: One JSON object per CSV row",
            "Values as Text: Every value is kept as a string, exactly as written",
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
        description: "Convert JSON data into clean CSV spreadsheet format with Convertify. Nested objects are flattened into dot-notation columns such as address.city, and every key found in any record becomes a column, making API responses and database exports easy to analyze in Excel or Google Sheets.",
        features: [
            "Auto-Flattening: Converts nested JSON objects into flat CSV columns",
            "Array Handling: Arrays inside a record are kept in one cell as JSON text",
            "Column Mapping: Automatically detects and organizes all JSON keys",
            "Separator Choice: Comma, semicolon, tab (TSV) or pipe",
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
            "Namespace Prefixes: Kept in property names, e.g. ns0:item",
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
            "Headings, paragraphs and bullet lists (numbered items print as bullets)",
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
            "Text Decoding: Turns Base64 back into readable UTF-8 text",
            "UTF-8 Safe: Accented letters and emoji encode correctly",
            "Large Input Handling: Process large files and strings efficiently",
            "Copy to Clipboard: One-click copy of encoded or decoded results",
            "Raw Output: Plain Base64, ready to prefix as a data URI"
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
        description: "Generate a scannable QR code for any URL or text and download it as a PNG. Pick the output size — 256, 400 or 512 pixels — and save it straight to your device. No sign-up, no account, and no limit on how many you make.",
        features: [
            "Encode any URL or text, up to 4000 characters",
            "Choose an output size of 256, 400 or 512px",
            "Live preview before you download",
            "Download as PNG, ready for print or screen",
            "Free with no sign-up and no usage limit",
            "Note: the QR code is generated in your browser, so what you type never leaves your device. Colour customisation, centre logos, error-correction control and SVG export are not supported.",
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
        description: "Edit text inside AutoCAD-exported PDFs, which most PDF editors can't do. AutoCAD draws SHX text as raw vector strokes with no underlying text layer, so ordinary editors treat the page as uneditable. Convertify scans the drawing, groups strokes into clickable text regions, and lets you replace or delete them; new text is written in Helvetica at the original position and size. Fix that forgotten dimension or label without re-opening AutoCAD.",
        features: [
            "Detects SHX Vector Text: Finds clickable text regions other editors can't see",
            "Replace or Delete: Change a label's wording or remove it",
            "Position & Size Match: Replacement text sits in the original location",
            "Multi-Page Support: Edit any page in a full drawing set",
            "TrueType Text Too: Real text is removed and rewritten in place",
            "AutoCAD-Friendly Mode: Skips the white cover box for clean PDFIMPORT",
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

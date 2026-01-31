// Pre-defined SEO content for each tool - can be imported in both server and client components
// Keywords sourced from NotebookLM competitive analysis

export const toolContentData: Record<string, {
    description: string;
    features: string[];
    useCases: string[];
    keywords: string[];
}> = {
    "merge-pdf": {
        description: "Combine multiple PDF files into a single document instantly. Our free online PDF merger allows you to join unlimited PDFs without any file size restrictions. Perfect for combining reports, contracts, or any documents - all processed securely in your browser.",
        features: [
            "Merge unlimited PDF files at once - no daily limits",
            "Drag and drop to reorder pages before merging",
            "Preserves original formatting and quality",
            "No account or registration required",
            "Works on Windows, Mac, Android, and iOS",
            "Combines files in seconds, not minutes"
        ],
        useCases: [
            "Combining monthly reports into a single annual document",
            "Merging contract pages with signature pages",
            "Creating portfolios from multiple design files",
            "Joining scanned document pages into one PDF",
            "Combining multiple invoices for accounting"
        ],
        keywords: ["merge pdf files online free no limit", "combine multiple pdfs into one", "join pdf files free no sign up", "pdf combiner no watermark"]
    },
    "split-pdf": {
        description: "Extract specific pages or split your PDF into multiple files instantly. Our free PDF splitter lets you divide large documents into smaller files, extract individual pages, or create custom page ranges - all without uploading to any server.",
        features: [
            "Split by page ranges (e.g., 1-5, 10-15)",
            "Extract individual pages as separate PDFs",
            "Split into single-page files automatically",
            "Preview pages before splitting",
            "No file size or page count limits",
            "Download multiple files as ZIP"
        ],
        useCases: [
            "Extracting specific chapters from e-books",
            "Separating individual tax forms from large bundles",
            "Pulling out specific pages for sharing",
            "Dividing large manuals into sections",
            "Extracting certificates or receipts from documents"
        ],
        keywords: ["split pdf into individual pages free", "extract pages from pdf no account", "divide large pdf into smaller files", "pdf splitter online free"]
    },
    "compress-pdf": {
        description: "Reduce PDF file size without losing quality. Our smart compression algorithm shrinks your PDFs for easier email attachments and faster uploads. Perfect for documents, scanned files, and image-heavy PDFs - all processed locally in your browser.",
        features: [
            "Multiple compression levels (light, medium, maximum)",
            "Maintains text quality and readability",
            "Optimizes scanned documents and images",
            "No file size limits - compress large PDFs",
            "Preview before and after file sizes",
            "Batch compress multiple files at once"
        ],
        useCases: [
            "Shrinking PDFs for email attachment limits",
            "Optimizing documents for web upload",
            "Reducing storage space for archived files",
            "Making scanned documents smaller for sharing",
            "Compressing portfolios for job applications"
        ],
        keywords: ["compress pdf to 100kb online free", "reduce pdf file size for email", "shrink pdf without losing quality", "pdf compressor no limit"]
    },
    "jpg-to-pdf": {
        description: "Convert JPG images to PDF documents instantly. Combine multiple photos into a single PDF or convert individual images. Perfect for creating photo albums, document scans, or portfolios - all processed in your browser with no uploads required.",
        features: [
            "Convert single or multiple JPG images",
            "Combine photos into one multi-page PDF",
            "Customize page size (A4, Letter, etc.)",
            "Maintain original image quality",
            "Reorder images before conversion",
            "Works with JPEG, JPG, and PNG formats"
        ],
        useCases: [
            "Creating PDF photo albums from vacation pictures",
            "Converting scanned receipts to organized PDFs",
            "Making presentations from image slides",
            "Combining product photos into catalogs",
            "Creating PDF portfolios from design work"
        ],
        keywords: ["convert multiple jpg to one pdf", "combine photos into pdf free", "jpg to pdf converter no limit", "images to pdf online free"]
    },
    "pdf-to-jpg": {
        description: "Convert PDF pages to high-quality JPG images. Extract each page as a separate image or select specific pages. Perfect for sharing on social media, creating presentations, or extracting graphics - all processed securely in your browser.",
        features: [
            "Convert all pages or select specific ones",
            "High-quality image output (up to 300 DPI)",
            "Each page becomes a separate JPG file",
            "Download all images as a ZIP file",
            "No watermarks on converted images",
            "Preserves colors and formatting"
        ],
        useCases: [
            "Extracting images from PDF presentations",
            "Creating social media graphics from PDFs",
            "Converting PDF slides to images for websites",
            "Sharing PDF content on platforms that don't support PDF",
            "Creating image thumbnails from documents"
        ],
        keywords: ["convert pdf to high quality jpg free", "extract images from pdf online", "save pdf pages as jpg", "pdf to image no watermark"]
    },
    "word-to-pdf": {
        description: "Convert Word documents to PDF format instantly. Preserve all formatting, fonts, images, and layouts perfectly. Ideal for sharing documents professionally, creating printable files, or ensuring compatibility across all devices.",
        features: [
            "Supports DOC and DOCX formats",
            "Preserves fonts, images, and layouts",
            "Maintains hyperlinks and bookmarks",
            "No Microsoft Office required",
            "Convert large documents instantly",
            "Perfect formatting every time"
        ],
        useCases: [
            "Converting resumes for job applications",
            "Creating printable contracts and agreements",
            "Sharing reports that look the same everywhere",
            "Archiving Word documents as PDFs",
            "Preparing documents for digital signatures"
        ],
        keywords: ["convert word to pdf keep formatting", "docx to pdf free unlimited", "word to pdf no sign up", "doc to pdf converter online secure"]
    },
    "pdf-to-word": {
        description: "Convert PDF to editable Word documents. Extract text and formatting from any PDF and edit it in Microsoft Word or Google Docs. Perfect for updating old documents, extracting content, or making PDFs editable again.",
        features: [
            "Converts to fully editable DOCX format",
            "Preserves text, images, and tables",
            "OCR for scanned PDFs (text recognition)",
            "Works with complex multi-column layouts",
            "No software installation required",
            "Compatible with Word and Google Docs"
        ],
        useCases: [
            "Editing contracts and agreements stored as PDFs",
            "Updating old document archives",
            "Extracting text from scanned documents",
            "Modifying forms and templates",
            "Converting academic papers for citations"
        ],
        keywords: ["convert pdf to editable word free", "pdf to docx no email required", "pdf to word keep layout", "turn pdf into text document"]
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
        description: "Add password protection to your PDF files. Encrypt documents to prevent unauthorized access, copying, or printing. Keep sensitive information secure with military-grade encryption - all processed locally on your device.",
        features: [
            "Set open password for viewing",
            "Set permissions password for editing",
            "Restrict printing, copying, and editing",
            "128-bit or 256-bit AES encryption",
            "Password never leaves your device",
            "Compatible with all PDF readers"
        ],
        useCases: [
            "Protecting confidential business documents",
            "Securing financial statements and tax returns",
            "Encrypting legal contracts before sharing",
            "Password-protecting personal documents",
            "Securing PDFs for email attachments"
        ],
        keywords: ["add password to pdf online free", "encrypt pdf document free", "secure pdf for email", "password protect pdf no sign up"]
    },
    "unlock-pdf": {
        description: "Remove passwords and restrictions from PDF files. If you know the password but want to remove it, or need to unlock printing and copying restrictions, our tool helps you regain full access to your documents.",
        features: [
            "Remove user passwords (requires password input)",
            "Remove owner/permissions restrictions",
            "Enable printing on restricted PDFs",
            "Enable copying text from locked PDFs",
            "Works with all encryption levels",
            "Instant processing, no waiting"
        ],
        useCases: [
            "Removing password from your own protected files",
            "Unlocking printing on restricted documents",
            "Enabling text copying from read-only PDFs",
            "Regaining full access to old encrypted files",
            "Preparing PDFs for editing after unlocking"
        ],
        keywords: ["remove password from pdf free", "unlock pdf for printing online", "remove pdf restrictions", "decrypt pdf no registration"]
    },
    "pdf-to-excel": {
        description: "Extract tables and data from PDF to Excel spreadsheets. Convert financial reports, invoices, and data tables into editable XLSX format. Our smart detection preserves columns, rows, and cell formatting for immediate use.",
        features: [
            "Intelligent table detection",
            "Preserves columns and row structure",
            "Handles multiple tables per page",
            "OCR for scanned PDF tables",
            "Exports to XLSX format",
            "Works with complex financial reports"
        ],
        useCases: [
            "Extracting financial data from PDF reports",
            "Converting PDF invoices to spreadsheets",
            "Digitizing paper forms into Excel",
            "Analyzing data from PDF charts",
            "Importing PDF tables into accounting software"
        ],
        keywords: ["pdf to excel converter free online", "extract tables from pdf to excel", "convert pdf to xlsx free", "pdf data to spreadsheet"]
    },
    "excel-to-pdf": {
        description: "Convert Excel spreadsheets to PDF documents. Preserve all charts, formatting, and cell layouts perfectly. Create printable and shareable spreadsheet snapshots that look exactly as they do in Excel.",
        features: [
            "Supports XLS and XLSX formats",
            "Preserves charts, colors, and formatting",
            "Converts all sheets or select specific ones",
            "Maintains column widths and row heights",
            "No Microsoft Office required",
            "Perfect for printing and sharing"
        ],
        useCases: [
            "Creating PDF reports from Excel data",
            "Sharing spreadsheets as read-only documents",
            "Printing formatted Excel worksheets",
            "Archiving financial spreadsheets as PDFs",
            "Preparing data for presentations"
        ],
        keywords: ["excel to pdf converter free online", "convert xls to pdf keep formatting", "xlsx to pdf no sign up", "spreadsheet to pdf free"]
    },
    "png-to-pdf": {
        description: "Convert PNG images to PDF documents. Combine multiple PNG files into a single PDF or convert individually. Perfect for transparent images, screenshots, and high-quality graphics that need to be shared as documents.",
        features: [
            "Preserves PNG transparency as white or custom color",
            "Combine multiple PNGs into one PDF",
            "Maintains image quality and resolution",
            "Customize page size and margins",
            "Reorder images before conversion",
            "Works with high-resolution images"
        ],
        useCases: [
            "Converting screenshots to PDF documentation",
            "Creating PDFs from design mockups",
            "Combining logos and graphics into brand books",
            "Making printable versions of PNG artwork",
            "Creating PDF presentations from images"
        ],
        keywords: ["convert png to pdf free online", "combine multiple png to pdf", "png to pdf no watermark", "image to pdf converter free"]
    },
    "pdf-to-png": {
        description: "Convert PDF pages to high-quality PNG images with transparency support. Extract pages as crystal-clear PNG files for use in websites, presentations, or graphic design projects.",
        features: [
            "High-resolution PNG output",
            "Converts all pages or selected ones",
            "Maintains image quality and clarity",
            "Each page becomes a separate PNG file",
            "Download all as ZIP file",
            "Perfect for web and print use"
        ],
        useCases: [
            "Extracting pages for website graphics",
            "Creating high-quality images from PDF designs",
            "Converting PDF slides for presentations",
            "Extracting illustrations from documents",
            "Creating social media graphics from PDFs"
        ],
        keywords: ["pdf to png converter free online", "convert pdf to high quality png", "extract pdf pages as images", "pdf to png no watermark"]
    },
    "watermark-pdf": {
        description: "Add text or image watermarks to your PDF documents. Protect your content with custom watermarks, branding, or draft notices. Position watermarks precisely and control opacity for the perfect look.",
        features: [
            "Add text or image watermarks",
            "Customize font, size, and color",
            "Adjust position and rotation",
            "Control opacity (transparency)",
            "Apply to all pages or select pages",
            "Preview before applying"
        ],
        useCases: [
            "Adding 'CONFIDENTIAL' labels to sensitive documents",
            "Branding documents with company logos",
            "Marking draft versions of documents",
            "Protecting intellectual property with copyright notices",
            "Adding page labeling for review copies"
        ],
        keywords: ["add watermark to pdf free", "pdf watermark online no sign up", "put logo on pdf pages", "stamp pdf with text free"]
    },
    "sign-pdf": {
        description: "Add your signature to PDF documents electronically. Draw, type, or upload your signature and place it anywhere on the document. Sign contracts, forms, and agreements without printing - legally valid for most purposes.",
        features: [
            "Draw signature with mouse or finger",
            "Type signature with custom fonts",
            "Upload image of your signature",
            "Resize and position anywhere",
            "Add date and initials",
            "Sign multiple pages at once"
        ],
        useCases: [
            "Signing contracts and agreements",
            "Completing job application forms",
            "Signing permission slips and waivers",
            "Adding signatures to invoices",
            "Signing rental agreements and leases"
        ],
        keywords: ["sign pdf online free", "e-sign pdf document free", "add signature to pdf no account", "electronic signature pdf free"]
    },
    "edit-pdf": {
        description: "Edit PDF documents online by adding text, images, shapes, and annotations. Fill out forms, add comments, or make corrections without needing expensive software. Everything processes in your browser for maximum privacy.",
        features: [
            "Add text anywhere on the page",
            "Insert images and graphics",
            "Draw shapes and arrows",
            "Highlight and underline text",
            "Add freehand annotations",
            "Fill out PDF forms"
        ],
        useCases: [
            "Filling out PDF forms and applications",
            "Adding notes and comments to documents",
            "Correcting errors in PDF text",
            "Adding stamps and annotations",
            "Creating marked-up review copies"
        ],
        keywords: ["edit pdf online free", "add text to pdf no sign up", "pdf editor free no watermark", "annotate pdf online free"]
    },
    "ocr-pdf": {
        description: "Convert scanned PDFs to searchable, editable text using OCR (Optical Character Recognition). Extract text from image-based documents, old scans, and photographed pages. Our AI-powered OCR supports multiple languages.",
        features: [
            "AI-powered text recognition",
            "Supports 100+ languages",
            "Creates searchable PDF output",
            "Export as plain text file",
            "Handles low-quality scans",
            "Preserves document layout"
        ],
        useCases: [
            "Digitizing old scanned documents",
            "Making scanned contracts searchable",
            "Extracting text from photographed pages",
            "Converting image PDFs to editable text",
            "Archiving paper documents digitally"
        ],
        keywords: ["ocr pdf free online", "scanned pdf to text converter", "extract text from scanned pdf", "make pdf searchable free"]
    },
    "add-page-numbers": {
        description: "Add page numbers to PDF documents in any position. Customize the number format, font, and starting page. Perfect for creating professional documents, reports, and manuscripts that need proper pagination.",
        features: [
            "Position at top or bottom of page",
            "Align left, center, or right",
            "Choose starting page number",
            "Skip specific pages (like cover)",
            "Customize font and size",
            "Multiple number formats (1, i, A)"
        ],
        useCases: [
            "Adding page numbers to manuscripts",
            "Numbering legal documents for reference",
            "Preparing reports with professional pagination",
            "Creating numbered handouts and guides",
            "Adding Bates numbering for legal discovery"
        ],
        keywords: ["add page numbers to pdf free", "pdf page numbering online", "insert page numbers in pdf", "number pdf pages free online"]
    },
    "redact-pdf": {
        description: "Permanently remove sensitive information from PDF documents. Blackout text, images, and areas that contain confidential data. Unlike highlighting, redaction completely removes the underlying content for true security.",
        features: [
            "Permanent content removal",
            "Blackout text and images",
            "Remove metadata and hidden data",
            "Search and redact specific terms",
            "Apply to multiple pages at once",
            "Preview before finalizing"
        ],
        useCases: [
            "Removing social security numbers from forms",
            "Redacting personal information for FOIA requests",
            "Protecting client data in shared documents",
            "Removing confidential figures from reports",
            "Sanitizing documents for public release"
        ],
        keywords: ["redact pdf online free", "blackout text in pdf free", "remove sensitive info from pdf", "pdf redaction tool free"]
    },
    "organize-pdf": {
        description: "Rearrange, delete, and organize PDF pages with drag-and-drop simplicity. Reorder pages, remove unwanted content, or rotate individual pages. Create the perfect document structure without any software installation.",
        features: [
            "Drag and drop to reorder pages",
            "Delete unwanted pages",
            "Rotate individual pages",
            "Preview all pages as thumbnails",
            "Undo and redo changes",
            "No page limit restrictions"
        ],
        useCases: [
            "Rearranging pages in scanned documents",
            "Removing blank or unwanted pages",
            "Organizing documents before filing",
            "Preparing documents for binding",
            "Creating custom document compilations"
        ],
        keywords: ["organize pdf pages online free", "reorder pdf pages free", "delete pages from pdf free", "rearrange pdf pages online"]
    },
    "compare-pdf": {
        description: "Compare two PDF documents side-by-side and highlight differences. Perfect for reviewing contract changes, document revisions, or version comparisons. Our tool shows exactly what text was added, removed, or modified.",
        features: [
            "Side-by-side comparison view",
            "Highlights added content in green",
            "Highlights removed content in red",
            "Text-level difference detection",
            "Synced scrolling between documents",
            "Summary of all changes found"
        ],
        useCases: [
            "Reviewing contract modifications",
            "Comparing document versions",
            "Checking proofreading changes",
            "Verifying legal document revisions",
            "Auditing policy updates"
        ],
        keywords: ["compare pdf files online free", "pdf diff tool free", "find differences in pdf documents", "compare two pdfs side by side"]
    },
    "pdf-to-pdfa": {
        description: "Convert PDF to PDF/A format for long-term archiving. PDF/A is an ISO-standardized format designed for preservation, ensuring your documents remain readable for decades. Required for many government and legal archives.",
        features: [
            "Converts to PDF/A-1b or PDF/A-2b",
            "ISO 19005 compliant output",
            "Embeds all fonts for preservation",
            "Removes unsupported features",
            "Validates compliance automatically",
            "Perfect for legal and government use"
        ],
        useCases: [
            "Archiving legal documents for court records",
            "Submitting to government agencies requiring PDF/A",
            "Long-term preservation of business records",
            "Creating compliant documents for legal discovery",
            "Archiving historical documents digitally"
        ],
        keywords: ["pdf to pdf/a converter free", "convert to archival pdf format", "pdf/a compliance online", "long-term document preservation"]
    },
    "crop-pdf": {
        description: "Crop PDF pages to remove unwanted margins, headers, or footers. Trim borders and resize pages to focus on the content that matters. Perfect for removing whitespace from scanned documents or preparing documents for printing.",
        features: [
            "Visual crop area selection",
            "Apply to all pages or specific ones",
            "Remove headers and footers",
            "Trim whitespace and margins",
            "Preview before applying",
            "No quality loss during cropping"
        ],
        useCases: [
            "Removing excess margins from scanned documents",
            "Trimming headers/footers from printed pages",
            "Cropping to focus on specific content areas",
            "Preparing documents for different paper sizes",
            "Removing watermarks from page edges"
        ],
        keywords: ["crop pdf online free", "remove margins from pdf", "trim pdf borders", "cut pdf page edges free"]
    },
    "repair-pdf": {
        description: "Fix corrupted or damaged PDF files. Recover content from PDFs that won't open, display errors, or appear broken. Our repair tool reconstructs the document structure to restore as much content as possible.",
        features: [
            "Fixes structure and header errors",
            "Recovers text and images",
            "Repairs corrupted fonts",
            "Handles partial downloads",
            "Works with severely damaged files",
            "Preview recovered content"
        ],
        useCases: [
            "Recovering PDFs damaged during email transfer",
            "Fixing files corrupted by disk errors",
            "Restoring incomplete downloads",
            "Repairing PDFs that crash readers",
            "Recovering old archived documents"
        ],
        keywords: ["repair corrupted pdf online free", "fix damaged pdf file", "recover pdf content free", "pdf repair tool online"]
    },
    "html-to-pdf": {
        description: "Convert web pages and HTML content to PDF documents. Capture entire web pages with images, formatting, and links preserved. Perfect for saving articles, creating offline copies, or archiving web content.",
        features: [
            "Enter URL or paste HTML code",
            "Captures images and styling",
            "Preserves links in PDF",
            "Handles complex web layouts",
            "Customizable page size",
            "Supports CSS and JavaScript"
        ],
        useCases: [
            "Saving news articles for offline reading",
            "Creating PDF copies of receipts from websites",
            "Archiving web pages before they change",
            "Converting HTML emails to PDF",
            "Creating documentation from web content"
        ],
        keywords: ["html to pdf converter online free", "save web page as pdf", "convert website to pdf free", "url to pdf no watermark"]
    },
    "pdf-to-text": {
        description: "Extract plain text content from PDF documents. Get just the text without formatting for use in other applications, text analysis, or simple content extraction. Works with both native PDFs and scanned documents (via OCR).",
        features: [
            "Extracts all text content",
            "Handles multi-column layouts",
            "OCR for scanned documents",
            "Preserves paragraph structure",
            "Copy-paste friendly output",
            "Downloads as TXT file"
        ],
        useCases: [
            "Extracting text for data analysis",
            "Getting content for translation",
            "Creating text summaries from PDFs",
            "Importing content into other tools",
            "Making PDFs accessible via screen readers"
        ],
        keywords: ["pdf to text converter free", "extract text from pdf online", "copy text from pdf free", "pdf to txt file converter"]
    },
    "text-to-pdf": {
        description: "Convert plain text files to PDF documents. Format your TXT files as professional PDF documents with customizable fonts, margins, and page sizes. Perfect for creating readable documents from raw text content.",
        features: [
            "Convert TXT files to PDF",
            "Choose from multiple fonts",
            "Customize margins and spacing",
            "Select page size (A4, Letter, etc.)",
            "Handles long documents",
            "Preserves line breaks"
        ],
        useCases: [
            "Creating PDF documentation from text files",
            "Formatting code or logs for sharing",
            "Converting ebooks from TXT format",
            "Creating printable versions of notes",
            "Generating PDF reports from text data"
        ],
        keywords: ["text to pdf converter free", "convert txt to pdf online", "make pdf from text file", "txt to pdf no watermark"]
    },
    "powerpoint-to-pdf": {
        description: "Convert PowerPoint presentations to PDF format. Preserve all slides, images, fonts, and transitions as a static PDF document. Perfect for sharing presentations that look exactly as designed, on any device.",
        features: [
            "Supports PPT and PPTX formats",
            "Preserves slide layouts and designs",
            "Maintains embedded images and charts",
            "Each slide becomes a PDF page",
            "No Microsoft Office required",
            "Perfect for email sharing"
        ],
        useCases: [
            "Sharing presentations with external clients",
            "Creating printable handouts from slides",
            "Archiving presentations as PDFs",
            "Submitting presentations for review",
            "Converting slides for web publishing"
        ],
        keywords: ["powerpoint to pdf converter free", "convert ppt to pdf online", "pptx to pdf no sign up", "presentation to pdf free"]
    },
    "pdf-to-powerpoint": {
        description: "Convert PDF documents back to editable PowerPoint presentations. Turn PDF slides into PPTX format for editing, updating, or repurposing. Extract content from PDF presentations to create new slideshows.",
        features: [
            "Converts to editable PPTX format",
            "Each PDF page becomes a slide",
            "Preserves text and images",
            "Handles complex layouts",
            "Compatible with PowerPoint and Google Slides",
            "No software installation required"
        ],
        useCases: [
            "Editing presentations shared as PDF",
            "Repurposing old PDF presentations",
            "Creating slideshows from PDF content",
            "Updating archived presentations",
            "Converting instructor PDFs to editable slides"
        ],
        keywords: ["pdf to powerpoint converter free", "convert pdf to pptx online", "pdf to slides free", "turn pdf into presentation"]
    },
    "delete-pdf-pages": {
        description: "Remove unwanted pages from your PDF documents online. Select specific pages to delete and save a cleaner, smaller PDF file. No sign-up required.",
        features: [
            "Delete single or multiple pages",
            "Visual page selection",
            "Preview before deleting",
            "Reduce file size by removing pages",
            "Secure browser-based processing",
            "No page limits"
        ],
        useCases: [
            "Removing blank pages from scans",
            "Deleting sensitive information pages",
            "Removing cover sheets or appendices",
            "Cleaning up merged documents",
            "Shortening long reports"
        ],
        keywords: ["delete pdf pages free", "remove pages from pdf online", "cut pages from pdf", "pdf page remover free"]
    },
    "reorder-pdf": {
        description: "Rearrange PDF pages in any order you need. Drag and drop pages to organize your document exactly how you want it. Fast, free, and easy.",
        features: [
            "Drag and drop reordering",
            "Visual grid view of all pages",
            "Move single or multiple pages",
            "Reverse page order option",
            "Instant preview",
            "Maintain original quality"
        ],
        useCases: [
            "Fixing out-of-order scans",
            "Organizing portfolio pages",
            "Rearranging presentation slides",
            "Preparing documents for printing",
            "Sorting merged PDF files"
        ],
        keywords: ["reorder pdf pages free", "rearrange pdf online", "organize pdf pages", "change pdf page order"]
    }
};

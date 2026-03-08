
export interface UseCase {
    slug: string;
    title: string;
    description: string;
    toolHref: string;
    toolName: string;
    keywords: string[];
    faqs: {
        question: string;
        answer: string;
    }[];
}

export const useCases: UseCase[] = [
    {
        slug: 'merge-pdf-for-bank-statements',
        title: 'Securely Merge PDF Bank Statements Online (No Upload)',
        description: 'Combine multiple bank statement PDFs into one file securely in your browser. Private, fast, and free. No files are uploaded to any server.',
        toolHref: '/merge-pdf',
        toolName: 'Merge PDF',
        keywords: ['merge bank statements', 'combine pdf bank statements', 'secure pdf merger', 'merge pdf offline'],
        faqs: [
            {
                question: 'Is it safe to merge bank statements here?',
                answer: 'Yes, absolutely. Convertify processes all files locally in your browser. Your bank statements are never uploaded to our servers, ensuring 100% privacy.'
            },
            {
                question: 'Can I merge statements from different banks?',
                answer: 'Yes, you can upload PDFs from Chase, Bank of America, Wells Fargo, or any other bank and combine them into a single organized document.'
            }
        ]
    },
    {
        slug: 'compress-pdf-for-email-attachment',
        title: 'Compress PDF for Email Attachment (Under 25MB)',
        description: 'Reduce PDF file size specifically for email attachments (Gmail, Outlook, Yahoo). Get your file under 25MB or 10MB instantly.',
        toolHref: '/compress-pdf',
        toolName: 'Compress PDF',
        keywords: ['compress pdf for email', 'reduce pdf size for gmail', 'shrink pdf for outlook', 'pdf compressor email'],
        faqs: [
            {
                question: 'How small can I make my PDF?',
                answer: 'Convertify allows you to choose compression levels. "Extreme" compression can reduce file size by up to 90% while maintaining readability.'
            },
            {
                question: 'Will the quality be good enough for printing?',
                answer: 'For email attachments, we recommend "Balanced" compression. If you need it strictly for screen viewing, "Extreme" is best.'
            }
        ]
    },
    {
        slug: 'convert-jpg-to-pdf-for-job-application',
        title: 'Convert ID & Documents (JPG) to PDF for Job Applications',
        description: 'Quickly convert photos of your ID, resume, or certificates from JPG/PNG to a professional PDF format for job applications.',
        toolHref: '/jpg-to-pdf',
        toolName: 'JPG to PDF',
        keywords: ['jpg to pdf for job', 'convert photo to pdf for application', 'resume photo to pdf'],
        faqs: [
            {
                question: 'Can I combine multiple photos into one PDF?',
                answer: 'Yes! Select multiple JPG or PNG images, and Convertify will merge them into a single, professional PDF document in seconds.'
            }
        ]
    },
    {
        slug: 'split-pdf-for-court-evidence',
        title: 'Split PDF for Court Evidence & Legal Submission',
        description: 'Extract specific pages from large PDF documents for legal exhibits and court submissions. Precise, secure, and maintains formatting.',
        toolHref: '/split-pdf',
        toolName: 'Split PDF',
        keywords: ['split pdf for court', 'extract pages for legal evidence', 'legal pdf splitter'],
        faqs: [
            {
                question: 'Does this remove metadata?',
                answer: 'The splitting process creates a new file with the selected pages. While it cleans up the structure, we recommend checking specific metadata if strict redaction is required.'
            }
        ]
    },
    {
        slug: 'merge-pdf-chromebook-offline',
        title: 'Merge PDF on Chromebook (Offline & Free)',
        description: 'The best free PDF merger for Chromebook users. Works without internet once loaded. No lag, no subscription required.',
        toolHref: '/merge-pdf',
        toolName: 'Merge PDF',
        keywords: ['merge pdf chromebook', 'combine pdf on chrome os', 'free pdf merger chromebook'],
        faqs: [
            {
                question: 'Do I need to install an app?',
                answer: 'No installation required. Convertify works directly in your Chrome browser on your Chromebook.'
            }
        ]
    },
    {
        slug: 'compress-pdf-to-100kb-online',
        title: 'Compress PDF to 100KB Online (Free & Fast)',
        description: 'Reduce PDF file size to under 100KB without losing quality. Perfect for government forms, job applications, and upload limits.',
        toolHref: '/compress-pdf',
        toolName: 'Compress PDF',
        keywords: ['compress pdf to 100kb', 'reduce pdf size below 100kb', 'resize pdf to 100kb', 'pdf compressor 100kb'],
        faqs: [
            {
                question: 'How do I compress a PDF to 100KB?',
                answer: 'Upload your file and select "Extreme" compression. This optimizes images and fonts to get the smallest possible file size.'
            }
        ]
    },
    {
        slug: 'merge-pdf-mac-free-no-preview',
        title: 'Merge PDF on Mac (Free Alternative to Preview)',
        description: 'Combine PDF files on macOS without using Preview or purchasing Adobe Acrobat. Works on MacBook Air, Pro, and iMac directly in Safari or Chrome.',
        toolHref: '/merge-pdf',
        toolName: 'Merge PDF',
        keywords: ['merge pdf mac', 'combine pdf macbook', 'join pdf files mac os', 'free pdf merger for mac'],
        faqs: [
            {
                question: 'Is this better than Mac Preview?',
                answer: 'Convertify works on any device and allows you to reorder, rotate, and manage pages more intuitively than Preview.'
            }
        ]
    },
    {
        slug: 'pdf-to-word-editable-text-free',
        title: 'Convert PDF to Editable Word Doc (Free OCR)',
        description: 'Turn scanned PDFs into editable Microsoft Word documents (.docx). Preserves formatting, tables, and text layout accurately.',
        toolHref: '/pdf-to-word',
        toolName: 'PDF to Word',
        keywords: ['pdf to word editable', 'convert pdf to docx free', 'scanned pdf to word', 'pdf to word ocr'],
        faqs: [
            {
                question: 'Does it work with scanned documents?',
                answer: 'Yes, Convertify attempts to extract text from scanned images so you can edit it in Word.'
            }
        ]
    },
    {
        slug: 'remove-pages-from-pdf-online',
        title: 'Delete Pages from PDF Online (Remove Specific Pages)',
        description: 'Select and remove unwanted pages from any PDF document. Create a new cleaner PDF with only the pages you need.',
        toolHref: '/organize-pdf',
        toolName: 'Organize PDF',
        keywords: ['remove pages from pdf', 'delete pdf pages', 'extract pdf pages', 'cut pages from pdf'],
        faqs: [
            {
                question: 'Can I delete multiple pages at once?',
                answer: 'Yes, simply click the trash icon on any page you want to remove, then click "Export" to save the new PDF.'
            }
        ]
    },
    {
        slug: 'make-pdf-searchable-ocr-online',
        title: 'Make PDF Searchable Online (Free OCR)',
        description: 'Convert scanned images and non-selectable text PDFs into searchable, selectable text documents using free OCR technology.',
        toolHref: '/ocr-pdf',
        toolName: 'OCR PDF',
        keywords: ['ocr pdf online', 'make pdf searchable', 'recognize text in pdf', 'convert scanned pdf to text'],
        faqs: [
            {
                question: 'What languages are supported?',
                answer: 'We support English and major European languages for optical character recognition.'
            }
        ]
    },
    {
        slug: 'convert-heic-to-pdf-iphone',
        title: 'Convert HEIC/iPhone Photos to PDF',
        description: 'Easily convert iPhone photos (.HEIC) to PDF format. No need to convert to JPG first. Direct secure conversion in your browser.',
        toolHref: '/jpg-to-pdf',
        toolName: 'JPG to PDF',
        keywords: ['heic to pdf', 'iphone photo to pdf', 'convert ios photos to pdf', 'apple image to pdf'],
        faqs: [
            {
                question: 'Do I need to convert HEIC to JPG first?',
                answer: 'Most modern browsers can handle the conversion directly. If not, your iPhone usually converts to JPG when uploading.'
            }
        ]
    },
    {
        slug: 'combine-pdf-windows-11-free',
        title: 'Combine PDF Files on Windows 11 (No App Needed)',
        description: 'Merge PDFs on Windows 10/11 without installing any software. Faster and safer than desktop alternatives.',
        toolHref: '/merge-pdf',
        toolName: 'Merge PDF',
        keywords: ['merge pdf windows 11', 'combine pdf windows 10', 'join pdf files windows', 'pdf merger for pc'],
        faqs: [
            {
                question: 'Does this work on Microsoft Edge?',
                answer: 'Yes, Convertify is fully optimized for Microsoft Edge, Chrome, and Firefox on Windows.'
            }
        ]
    },
    {
        slug: 'compress-pdf-200kb-quality',
        title: 'Compress PDF to 200KB (High Quality)',
        description: 'Reduce PDF size to under 200KB while keeping text sharp and images clear. Balanced compression for professional use.',
        toolHref: '/compress-pdf',
        toolName: 'Compress PDF',
        keywords: ['compress pdf 200kb', 'reduce pdf size 200kb', 'optimize pdf size', 'shrink pdf file'],
        faqs: [
            {
                question: 'Will my text become blurry?',
                answer: 'No, our "Balanced" compression targets redundant data rather than image resolution, keeping text crisp.'
            }
        ]
    },
    {
        slug: 'convert-excel-to-pdf-one-page',
        title: 'Convert Excel to PDF (Fit to One Page)',
        description: 'Turn your Excel spreadsheets (.xlsx, .xls) into professional PDF documents. formatting is preserved and sheets are optimized.',
        toolHref: '/excel-to-pdf',
        toolName: 'Excel to PDF',
        keywords: ['excel to pdf', 'xlsx to pdf', 'convert spreadsheet to pdf', 'excel to pdf converter free'],
        faqs: [
            {
                question: 'Does it handle multiple sheets?',
                answer: 'Yes, all sheets in your Excel workbook will be converted into pages in the PDF.'
            }
        ]
    },
    {
        slug: 'rotate-pdf-save-permanently',
        title: 'Rotate PDF and Save Permanently',
        description: 'Fix upside-down or sideways PDF pages. Rotate specific pages or the entire document and save the changes permanently.',
        toolHref: '/rotate-pdf',
        toolName: 'Rotate PDF',
        keywords: ['rotate pdf permanent', 'turn pdf pages', 'fix pdf orientation', 'rotate pdf 90 degrees'],
        faqs: [
            {
                question: 'Can I rotate just one page?',
                answer: 'Yes, you can select individual pages to rotate left or right, leaving the rest of the document as is.'
            }
        ]
    },
    {
        slug: 'unlock-pdf-forgot-password-online',
        title: 'Unlock PDF - Remove Password Online',
        description: 'Remove owner passwords and restrictions from PDF files. Unlock printing, copying, and editing instantly.',
        toolHref: '/unlock-pdf',
        toolName: 'Unlock PDF',
        keywords: ['unlock pdf online', 'remove pdf password', 'decrypt pdf', 'remove pdf restrictions'],
        faqs: [
            {
                question: 'Can you open any password protected PDF?',
                answer: 'We can remove "Owner" passwords (permissions). If the file requires a password to OPEN (User password), you must know it to unlock it.'
            }
        ]
    },
    // ============ EXPANDED USE CASES FOR PROGRAMMATIC SEO ============
    {
        slug: 'merge-pdf-windows-10',
        title: 'Merge PDF Files on Windows 10 Free',
        description: 'Combine multiple PDF files on Windows 10. Free, fast, no software download needed.',
        toolHref: '/merge-pdf',
        toolName: 'Merge PDF',
        keywords: ['merge pdf windows 10', 'combine pdf windows', 'join pdf files windows 10'],
        faqs: []
    },
    {
        slug: 'merge-pdf-mac-preview',
        title: 'Merge PDF Files on Mac Using Preview',
        description: 'Combine PDFs on Mac without additional software. Use built-in Preview app.',
        toolHref: '/merge-pdf',
        toolName: 'Merge PDF',
        keywords: ['merge pdf mac', 'combine pdf mac preview', 'join pdf mac free'],
        faqs: []
    },
    {
        slug: 'merge-pdf-online-free-no-limit',
        title: 'Merge PDF Online Free No File Limit',
        description: 'Merge unlimited PDF files online. No file size limit, no registration.',
        toolHref: '/merge-pdf',
        toolName: 'Merge PDF',
        keywords: ['merge pdf online free no limit', 'combine pdf no limit', 'unlimited pdf merger'],
        faqs: []
    },
    {
        slug: 'merge-pdf-iphone',
        title: 'Merge PDF Files on iPhone',
        description: 'Combine PDF files directly on your iPhone. Works in Safari browser.',
        toolHref: '/merge-pdf',
        toolName: 'Merge PDF',
        keywords: ['merge pdf iphone', 'combine pdf iphone', 'merge pdf on phone'],
        faqs: []
    },
    {
        slug: 'merge-pdf-android',
        title: 'Merge PDF Files on Android Phone',
        description: 'Combine PDF files on Android. No app needed, works in Chrome.',
        toolHref: '/merge-pdf',
        toolName: 'Merge PDF',
        keywords: ['merge pdf android', 'combine pdf android', 'merge pdf mobile'],
        faqs: []
    },
    {
        slug: 'compress-pdf-gmail',
        title: 'Compress PDF for Gmail Attachment',
        description: 'Reduce PDF size to send via Gmail. Get under 25MB instantly.',
        toolHref: '/compress-pdf',
        toolName: 'Compress PDF',
        keywords: ['compress pdf for gmail', 'reduce pdf size gmail', 'pdf too large for email'],
        faqs: []
    },
    {
        slug: 'compress-pdf-outlook',
        title: 'Compress PDF for Outlook',
        description: 'Shrink PDF file size for Outlook attachments. Send large files easily.',
        toolHref: '/compress-pdf',
        toolName: 'Compress PDF',
        keywords: ['compress pdf outlook', 'reduce pdf size outlook', 'shrink pdf email attachment'],
        faqs: []
    },
    {
        slug: 'compress-pdf-whatsapp',
        title: 'Compress PDF for WhatsApp',
        description: 'Reduce PDF to send on WhatsApp. Maximum 16MB for free sharing.',
        toolHref: '/compress-pdf',
        toolName: 'Compress PDF',
        keywords: ['compress pdf whatsapp', 'reduce pdf for whatsapp', 'small pdf for sharing'],
        faqs: []
    },
    {
        slug: 'compress-pdf-500kb',
        title: 'Compress PDF to 500KB Online',
        description: 'Get your PDF under 500KB. Perfect for form submissions.',
        toolHref: '/compress-pdf',
        toolName: 'Compress PDF',
        keywords: ['compress pdf to 500kb', 'reduce pdf to 500kb', 'pdf under 500kb'],
        faqs: []
    },
    {
        slug: 'compress-pdf-1mb',
        title: 'Compress PDF to 1MB Online',
        description: 'Shrink PDF to under 1MB. Fast and free compression.',
        toolHref: '/compress-pdf',
        toolName: 'Compress PDF',
        keywords: ['compress pdf to 1mb', 'reduce pdf to 1mb', 'pdf under 1mb'],
        faqs: []
    },
    {
        slug: 'split-pdf-every-page',
        title: 'Split PDF into Separate Pages',
        description: 'Extract every page as individual PDF files. Batch split instantly.',
        toolHref: '/split-pdf',
        toolName: 'Split PDF',
        keywords: ['split pdf every page', 'extract all pages pdf', 'pdf to individual pages'],
        faqs: []
    },
    {
        slug: 'split-pdf-range',
        title: 'Split PDF by Page Range',
        description: 'Extract specific page ranges from PDF. Enter 1-5, 10-15 etc.',
        toolHref: '/split-pdf',
        toolName: 'Split PDF',
        keywords: ['split pdf by range', 'extract page range pdf', 'split pdf pages 1-5'],
        faqs: []
    },
    {
        slug: 'pdf-to-word-resume',
        title: 'Convert PDF Resume to Word',
        description: 'Edit PDF resume in Word. Make changes and update easily.',
        toolHref: '/pdf-to-word',
        toolName: 'PDF to Word',
        keywords: ['pdf to word resume', 'convert resume pdf to word', 'edit resume pdf'],
        faqs: []
    },
    {
        slug: 'pdf-to-word-contract',
        title: 'Convert PDF Contract to Editable Word',
        description: 'Turn PDF contracts into editable Word documents. Modify agreements.',
        toolHref: '/pdf-to-word',
        toolName: 'PDF to Word',
        keywords: ['pdf to word contract', 'convert legal pdf to word', 'edit contract pdf'],
        faqs: []
    },
    {
        slug: 'jpg-to-pdf-merge',
        title: 'Combine Multiple JPG to One PDF',
        description: 'Merge several JPG images into a single PDF document.',
        toolHref: '/jpg-to-pdf',
        toolName: 'JPG to PDF',
        keywords: ['combine jpg to pdf', 'merge multiple jpg to pdf', 'join images to pdf'],
        faqs: []
    },
    {
        slug: 'jpg-to-pdf-a4',
        title: 'Convert JPG to PDF A4 Size',
        description: 'Create A4 sized PDF from JPG. Standard document size.',
        toolHref: '/jpg-to-pdf',
        toolName: 'JPG to PDF',
        keywords: ['jpg to pdf a4', 'convert image to a4 pdf', 'a4 pdf from jpg'],
        faqs: []
    },
    {
        slug: 'png-to-pdf-transparent',
        title: 'PNG to PDF Transparent Background',
        description: 'Convert PNG with transparency to PDF. Keep alpha channel.',
        toolHref: '/png-to-pdf',
        toolName: 'PNG to PDF',
        keywords: ['png to pdf transparent', 'convert png transparency to pdf', 'png with alpha to pdf'],
        faqs: []
    },
    {
        slug: 'word-to-pdf-resume',
        title: 'Convert Word Resume to PDF',
        description: 'Turn Word resume into PDF. Professional output for job applications.',
        toolHref: '/word-to-pdf',
        toolName: 'Word to PDF',
        keywords: ['word to pdf resume', 'convert resume to pdf', 'docx to pdf resume'],
        faqs: []
    },
    {
        slug: 'excel-to-pdf-one-sheet',
        title: 'Convert Excel to PDF One Page Per Sheet',
        description: 'Export each Excel sheet as separate PDF page.',
        toolHref: '/excel-to-pdf',
        toolName: 'Excel to PDF',
        keywords: ['excel to pdf one page per sheet', 'convert each sheet to pdf', 'excel sheet to pdf'],
        faqs: []
    },
    {
        slug: 'rotate-pdf-90-degrees',
        title: 'Rotate PDF 90 Degrees Clockwise',
        description: 'Fix orientation by rotating PDF pages 90 degrees.',
        toolHref: '/rotate-pdf',
        toolName: 'Rotate PDF',
        keywords: ['rotate pdf 90 degrees', 'rotate pdf clockwise', 'fix pdf orientation'],
        faqs: []
    },
    {
        slug: 'protect-pdf-password',
        title: 'Protect PDF with Password',
        description: 'Add password protection to PDF. Encrypt with AES-256.',
        toolHref: '/protect-pdf',
        toolName: 'Protect PDF',
        keywords: ['protect pdf with password', 'encrypt pdf', 'password protect pdf'],
        faqs: []
    },
    {
        slug: 'unlock-pdf-printing',
        title: 'Unlock PDF to Enable Printing',
        description: 'Remove PDF printing restrictions. Print locked files.',
        toolHref: '/unlock-pdf',
        toolName: 'Unlock PDF',
        keywords: ['unlock pdf printing', 'enable pdf printing', 'remove pdf print restriction'],
        faqs: []
    },
    {
        slug: 'edit-pdf-text',
        title: 'Edit Text in PDF Online',
        description: 'Modify text in PDF documents. Change content easily.',
        toolHref: '/edit-pdf',
        toolName: 'Edit PDF',
        keywords: ['edit pdf text', 'modify pdf text', 'change text in pdf'],
        faqs: []
    },
    {
        slug: 'sign-pdf-digital',
        title: 'Sign PDF with Digital Signature',
        description: 'Add legally binding digital signature to PDF documents.',
        toolHref: '/sign-pdf',
        toolName: 'Sign PDF',
        keywords: ['sign pdf digital signature', 'add signature to pdf', 'e-sign pdf'],
        faqs: []
    },
    {
        slug: 'watermark-pdf-remove',
        title: 'Add Watermark to PDF',
        description: 'Add text or image watermark to PDF. Batch watermark.',
        toolHref: '/watermark-pdf',
        toolName: 'Watermark PDF',
        keywords: ['watermark pdf', 'add watermark to pdf', 'batch watermark pdf'],
        faqs: []
    },
    {
        slug: 'pdf-to-jpg-high-resolution',
        title: 'Convert PDF to High Resolution JPG',
        description: 'Extract PDF pages as high quality 300 DPI images.',
        toolHref: '/pdf-to-jpg',
        toolName: 'PDF to JPG',
        keywords: ['pdf to jpg high resolution', 'pdf to 300dpi jpg', 'extract hd images from pdf'],
        faqs: []
    },
    {
        slug: 'pdf-to-png-transparent',
        title: 'Convert PDF to PNG with Transparency',
        description: 'Extract PDF as transparent PNG images.',
        toolHref: '/pdf-to-png',
        toolName: 'PDF to PNG',
        keywords: ['pdf to png transparent', 'extract png from pdf', 'pdf to alpha png'],
        faqs: []
    },
    {
        slug: 'reorder-pdf-pages',
        title: 'Reorder PDF Pages Online',
        description: 'Drag and drop to rearrange PDF page order.',
        toolHref: '/reorder-pdf',
        toolName: 'Reorder PDF',
        keywords: ['reorder pdf pages', 'arrange pdf pages', 'change pdf page order'],
        faqs: []
    },
    {
        slug: 'delete-pdf-pages',
        title: 'Delete Pages from PDF',
        description: 'Remove unwanted pages from PDF. Extract clean document.',
        toolHref: '/delete-pdf-pages',
        toolName: 'Delete Pages',
        keywords: ['delete pages from pdf', 'remove pdf pages', 'delete pages pdf'],
        faqs: []
    },
    {
        slug: 'add-page-numbers-pdf',
        title: 'Add Page Numbers to PDF',
        description: 'Insert page numbers into PDF. Custom placement.',
        toolHref: '/add-page-numbers',
        toolName: 'Add Page Numbers',
        keywords: ['add page numbers to pdf', 'number pdf pages', 'insert page numbers'],
        faqs: []
    },
    {
        slug: 'ocr-pdf-searchable',
        title: 'Make PDF Searchable with OCR',
        description: 'Convert scanned PDF to searchable text. Extract content.',
        toolHref: '/ocr-pdf',
        toolName: 'OCR PDF',
        keywords: ['ocr pdf searchable', 'make pdf searchable', 'extract text from scanned pdf'],
        faqs: []
    },
    {
        slug: 'repair-pdf-corrupted',
        title: 'Repair Corrupted PDF File',
        description: 'Fix damaged PDF files. Recover unreadable documents.',
        toolHref: '/repair-pdf',
        toolName: 'Repair PDF',
        keywords: ['repair corrupted pdf', 'fix damaged pdf', 'recover pdf file'],
        faqs: []
    },
    {
        slug: 'compare-pdf-differences',
        title: 'Compare Two PDF Files',
        description: 'Find differences between two PDF documents.',
        toolHref: '/compare-pdf',
        toolName: 'Compare PDF',
        keywords: ['compare pdf files', 'diff pdf', 'find pdf differences'],
        faqs: []
    },
    {
        slug: 'pdf-to-word-free-online',
        title: 'PDF to Word Free Online No Download',
        description: 'Convert PDF to Word without software. 100% free.',
        toolHref: '/pdf-to-word',
        toolName: 'PDF to Word',
        keywords: ['pdf to word free online', 'convert pdf to docx free', 'pdf to word no download'],
        faqs: []
    },
    {
        slug: 'pdf-to-excel-extract',
        title: 'Extract PDF Tables to Excel',
        description: 'Pull table data from PDF into Excel spreadsheets.',
        toolHref: '/pdf-to-excel',
        toolName: 'PDF to Excel',
        keywords: ['pdf to excel extract', 'pull tables from pdf', 'convert pdf table to excel'],
        faqs: []
    },
    {
        slug: 'heic-to-pdf-iphone',
        title: 'Convert HEIC iPhone Photo to PDF',
        description: 'Turn iPhone HEIC photos into PDF documents.',
        toolHref: '/heic-to-jpg',
        toolName: 'HEIC to JPG',
        keywords: ['heic to pdf iphone', 'convert iphone photo to pdf', 'heic to pdf'],
        faqs: []
    },
    {
        slug: 'compress-pdf-mac',
        title: 'Compress PDF on Mac',
        description: 'Reduce PDF file size on Mac. Works in Safari browser.',
        toolHref: '/compress-pdf',
        toolName: 'Compress PDF',
        keywords: ['compress pdf mac', 'reduce pdf size mac', 'shrink pdf mac'],
        faqs: []
    },
    {
        slug: 'compress-pdf-iphone',
        title: 'Compress PDF on iPhone',
        description: 'Shrink PDF file size on iPhone. Send smaller files.',
        toolHref: '/compress-pdf',
        toolName: 'Compress PDF',
        keywords: ['compress pdf iphone', 'reduce pdf size iphone', 'shrink pdf mobile'],
        faqs: []
    },
    {
        slug: 'merge-pdf-two-files',
        title: 'Merge Two PDF Files',
        description: 'Combine exactly 2 PDF files into one.',
        toolHref: '/merge-pdf',
        toolName: 'Merge PDF',
        keywords: ['merge two pdf files', 'combine 2 pdfs', 'join two pdf'],
        faqs: []
    },
    {
        slug: 'split-pdf-single-page',
        title: 'Extract Single Page from PDF',
        description: 'Get one specific page from PDF as separate file.',
        toolHref: '/split-pdf',
        toolName: 'Split PDF',
        keywords: ['extract single page pdf', 'get one page from pdf', 'pull page from pdf'],
        faqs: []
    },
    {
        slug: 'pdf-to-text-extract',
        title: 'Extract Text from PDF',
        description: 'Pull all text content from PDF document.',
        toolHref: '/pdf-to-text',
        toolName: 'PDF to Text',
        keywords: ['extract text from pdf', 'pdf to text converter', 'copy pdf text'],
        faqs: []
    },
    {
        slug: 'powerpoint-to-pdf',
        title: 'Convert PowerPoint PPTX to PDF',
        description: 'Turn PowerPoint presentations into PDF format.',
        toolHref: '/powerpoint-to-pdf',
        toolName: 'PowerPoint to PDF',
        keywords: ['powerpoint to pdf', 'convert pptx to pdf', 'ppt to pdf'],
        faqs: []
    },
    {
        slug: 'html-to-pdf-online',
        title: 'Convert HTML to PDF Online',
        description: 'Save web pages as PDF documents.',
        toolHref: '/html-to-pdf',
        toolName: 'HTML to PDF',
        keywords: ['html to pdf', 'webpage to pdf', 'save web page as pdf'],
        faqs: []
    },
    {
        slug: 'text-to-pdf-txt',
        title: 'Convert Text File to PDF',
        description: 'Turn TXT files into PDF documents.',
        toolHref: '/text-to-pdf',
        toolName: 'Text to PDF',
        keywords: ['text to pdf', 'txt to pdf', 'convert text file to pdf'],
        faqs: []
    },
    {
        slug: 'crop-pdf-page',
        title: 'Crop PDF Page Margins',
        description: 'Trim whitespace from PDF pages. Clean output.',
        toolHref: '/crop-pdf',
        toolName: 'Crop PDF',
        keywords: ['crop pdf', 'trim pdf margins', 'remove pdf whitespace'],
        faqs: []
    },
    {
        slug: 'redact-pdf-sensitive',
        title: 'Redact Sensitive Info from PDF',
        description: 'Permanently remove confidential data from PDF.',
        toolHref: '/redact-pdf',
        toolName: 'Redact PDF',
        keywords: ['redact pdf', 'remove sensitive information', 'censor pdf'],
        faqs: []
    },
    {
        slug: 'pdf-to-powerpoint-slides',
        title: 'Convert PDF to PowerPoint Slides',
        description: 'Turn PDF into editable PowerPoint presentations.',
        toolHref: '/pdf-to-powerpoint',
        toolName: 'PDF to PowerPoint',
        keywords: ['pdf to powerpoint', 'convert pdf to ppt', 'pdf to pptx'],
        faqs: []
    },
    {
        slug: 'pdf-to-pdfa-archive',
        title: 'Convert PDF to PDF/A for Archive',
        description: 'Create archival PDF/A for long-term storage.',
        toolHref: '/pdf-to-pdfa',
        toolName: 'PDF to PDF/A',
        keywords: ['pdf to pdfa', 'convert to pdf/a', 'archival pdf'],
        faqs: []
    },
    {
        slug: 'jpg-to-pdf-multiple',
        title: 'Merge Multiple JPG to One PDF',
        description: 'Combine many JPG images into single PDF.',
        toolHref: '/jpg-to-pdf',
        toolName: 'JPG to PDF',
        keywords: ['multiple jpg to pdf', 'combine jpg images to pdf', 'merge photos to pdf'],
        faqs: []
    },
    {
        slug: 'image-compressor-whatsapp',
        title: 'Compress Images for WhatsApp',
        description: 'Reduce image size for WhatsApp sharing. Stay under 16MB.',
        toolHref: '/image-compressor',
        toolName: 'Image Compressor',
        keywords: ['compress image for whatsapp', 'reduce image size whatsapp', 'small image for sharing'],
        faqs: []
    },
    {
        slug: 'resize-image-instagram',
        title: 'Resize Image for Instagram',
        description: 'Crop and resize images for Instagram. Perfect dimensions.',
        toolHref: '/resize-image',
        toolName: 'Resize Image',
        keywords: ['resize image instagram', 'instagram image size', 'crop for instagram'],
        faqs: []
    },
    {
        slug: 'webp-to-jpg',
        title: 'Convert WebP to JPG',
        description: 'Turn WebP images to standard JPEG format.',
        toolHref: '/webp-converter',
        toolName: 'WebP Converter',
        keywords: ['webp to jpg', 'convert webp to jpeg', 'webp to jpg converter'],
        faqs: []
    },
    {
        slug: 'jpg-to-webp',
        title: 'Convert JPG to WebP',
        description: 'Compress JPG to WebP for smaller file size.',
        toolHref: '/webp-converter',
        toolName: 'WebP Converter',
        keywords: ['jpg to webp', 'convert jpg to webp', 'compress to webp'],
        faqs: []
    },
    // === New Tools Use Cases ===
    {
        slug: 'svg-to-png-for-social-media',
        title: 'Convert SVG Logo to PNG for Social Media Upload',
        description: 'Convert your SVG vector logo to PNG format for uploading to social media platforms that don\'t support SVG. Choose custom dimensions for each platform.',
        toolHref: '/svg-to-png',
        toolName: 'SVG to PNG',
        keywords: ['svg to png social media', 'convert logo to png', 'svg for instagram', 'svg for facebook'],
        faqs: [
            { question: 'Why can\'t I upload SVG to social media?', answer: 'Most social media platforms (Instagram, Facebook, Twitter) don\'t support SVG format. Converting to PNG preserves quality while ensuring compatibility.' },
            { question: 'What size should I use?', answer: 'For profile pictures use 512x512px. For post images, 1080x1080px for Instagram, 1200x630px for Facebook.' }
        ]
    },
    {
        slug: 'svg-to-png-for-email-signature',
        title: 'Convert SVG to PNG for Email Signature',
        description: 'Convert your SVG logo to PNG for use in email signatures. Email clients don\'t support SVG, so PNG is the best format for sharp logos in emails.',
        toolHref: '/svg-to-png',
        toolName: 'SVG to PNG',
        keywords: ['svg to png email', 'email signature logo', 'convert svg for outlook', 'svg to png gmail'],
        faqs: []
    },
    {
        slug: 'csv-to-json-for-api-development',
        title: 'Convert CSV Data to JSON for REST API Development',
        description: 'Transform CSV datasets into JSON format for API endpoints, database seeding, and web application development. Auto-detects headers and data types.',
        toolHref: '/csv-to-json',
        toolName: 'CSV to JSON',
        keywords: ['csv to json api', 'csv to json developer', 'convert spreadsheet to api', 'csv to json for database'],
        faqs: [
            { question: 'Can I convert large CSV files?', answer: 'Yes, since everything is processed in your browser, there are no file size limits. Large files may take a moment to parse.' },
            { question: 'Are data types preserved?', answer: 'The converter detects numbers and booleans automatically, converting them from string format to proper JSON data types.' }
        ]
    },
    {
        slug: 'csv-to-json-for-data-migration',
        title: 'Convert CSV to JSON for Database Migration',
        description: 'Transform CSV exports from databases into JSON format for importing into MongoDB, Firebase, or other NoSQL databases.',
        toolHref: '/csv-to-json',
        toolName: 'CSV to JSON',
        keywords: ['csv to json mongodb', 'csv to json firebase', 'data migration csv', 'database import json'],
        faqs: []
    },
    {
        slug: 'json-to-csv-for-excel-analysis',
        title: 'Convert JSON API Data to CSV for Excel Analysis',
        description: 'Export JSON data from APIs and convert to CSV format for analysis in Excel or Google Sheets. Flattens nested objects automatically.',
        toolHref: '/json-to-csv',
        toolName: 'JSON to CSV',
        keywords: ['json to csv excel', 'api data to spreadsheet', 'json export to csv', 'json to google sheets'],
        faqs: [
            { question: 'How are nested JSON objects handled?', answer: 'Nested objects are flattened using dot notation. For example, {"address":{"city":"NYC"}} becomes a column named "address.city".' }
        ]
    },
    {
        slug: 'json-to-csv-for-reporting',
        title: 'Convert JSON Data to CSV for Business Reports',
        description: 'Transform JSON data exports into CSV format for creating business reports and dashboards in spreadsheet applications.',
        toolHref: '/json-to-csv',
        toolName: 'JSON to CSV',
        keywords: ['json to csv report', 'json to spreadsheet report', 'data export csv', 'business data csv'],
        faqs: []
    },
    {
        slug: 'qr-code-for-business-card',
        title: 'Generate QR Code for Business Card',
        description: 'Create a QR code linking to your website, LinkedIn, or contact info to add to your business card design.',
        toolHref: '/qr-code-generator',
        toolName: 'QR Code Generator',
        keywords: ['qr code business card', 'qr code contact info', 'business card qr', 'vcard qr code'],
        faqs: [
            { question: 'What should I put in a business card QR code?', answer: 'Common options include your website URL, LinkedIn profile, vCard contact data, or a landing page with all your contact information.' },
            { question: 'What size QR code for business cards?', answer: 'A 256x256 pixel QR code works well for standard business cards. Make sure there is sufficient contrast and quiet zone (white space) around the code.' }
        ]
    },
    {
        slug: 'qr-code-for-restaurant-menu',
        title: 'Generate QR Code for Restaurant Menu',
        description: 'Create a QR code that links to your digital restaurant menu. Customers scan with their phone to view the menu without touching a physical copy.',
        toolHref: '/qr-code-generator',
        toolName: 'QR Code Generator',
        keywords: ['restaurant menu qr code', 'digital menu qr', 'contactless menu', 'cafe qr code'],
        faqs: []
    },
    {
        slug: 'qr-code-for-wifi-sharing',
        title: 'Generate QR Code for WiFi Network Sharing',
        description: 'Create a QR code that guests can scan to automatically connect to your WiFi network. No need to share passwords manually.',
        toolHref: '/qr-code-generator',
        toolName: 'QR Code Generator',
        keywords: ['wifi qr code', 'share wifi qr', 'wifi password qr code', 'guest wifi qr'],
        faqs: []
    },
    {
        slug: 'markdown-to-pdf-for-documentation',
        title: 'Convert Markdown Documentation to PDF',
        description: 'Convert README files, API docs, and technical documentation from Markdown to professional PDF format for sharing with clients or teams.',
        toolHref: '/markdown-to-pdf',
        toolName: 'Markdown to PDF',
        keywords: ['markdown to pdf documentation', 'readme to pdf', 'github markdown pdf', 'technical docs pdf'],
        faqs: [
            { question: 'Does it support GitHub-flavored Markdown?', answer: 'Yes, the converter supports headings, bold, italic, links, lists, code blocks, blockquotes, and horizontal rules.' }
        ]
    },
    {
        slug: 'base64-encode-image-for-html',
        title: 'Encode Image to Base64 for HTML Embedding',
        description: 'Convert images to Base64 data URIs for embedding directly in HTML and CSS files without external image requests.',
        toolHref: '/base64',
        toolName: 'Base64 Encoder/Decoder',
        keywords: ['base64 image html', 'encode image base64', 'data uri image', 'inline image base64'],
        faqs: [
            { question: 'Why embed images as Base64?', answer: 'Base64 embedding reduces HTTP requests, is useful for email templates (which can\'t load external images), and bundles small icons directly into CSS.' }
        ]
    },
    {
        slug: 'bmp-to-jpg-for-web-upload',
        title: 'Convert BMP Images to JPG for Web Upload',
        description: 'Convert large BMP bitmap files to compressed JPG format for web use. Dramatically reduce file size while maintaining quality.',
        toolHref: '/bmp-to-jpg',
        toolName: 'BMP to JPG',
        keywords: ['bmp to jpg web', 'convert bitmap to jpeg', 'bmp to jpg compress', 'reduce bmp file size'],
        faqs: []
    },
    {
        slug: 'xml-to-json-for-api-migration',
        title: 'Convert XML API Response to JSON Format',
        description: 'Transform XML API responses into JSON for modern web applications and REST API migrations. Preserves data structure and attributes.',
        toolHref: '/xml-to-json',
        toolName: 'XML to JSON',
        keywords: ['xml to json api', 'soap to rest conversion', 'xml response to json', 'migrate xml to json'],
        faqs: []
    },
    {
        slug: 'tiff-to-pdf-for-scanned-documents',
        title: 'Convert Scanned TIFF Documents to PDF',
        description: 'Convert TIFF scans from office scanners and copiers to universally compatible PDF format for sharing and archiving.',
        toolHref: '/tiff-to-pdf',
        toolName: 'TIFF to PDF',
        keywords: ['tiff scan to pdf', 'scanner tiff to pdf', 'convert scanned tiff', 'tiff to pdf document'],
        faqs: []
    }
];

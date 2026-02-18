
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
    }
];

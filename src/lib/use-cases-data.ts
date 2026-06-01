
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
            },
            {
                question: 'Do password-protected bank statements work?',
                answer: 'If your statement is locked with an open password, unlock it first using our Unlock PDF tool, then merge. Statements with only printing/copy restrictions usually merge without issues.'
            },
            {
                question: 'Will merging affect the document quality?',
                answer: 'No. Merging copies pages exactly as they are, so text stays selectable and images keep their original resolution. Nothing is re-compressed.'
            },
            {
                question: 'How do I order the statements correctly?',
                answer: 'After uploading, drag the file thumbnails into the order you want — for example January through December — before clicking merge. The final PDF follows that exact order.'
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
            },
            {
                question: 'What is the attachment limit for Gmail and Outlook?',
                answer: 'Gmail allows attachments up to 25MB, while Outlook.com caps at 20MB and many corporate Outlook servers limit to 10MB. Compress to comfortably below your provider\'s limit.'
            },
            {
                question: 'Why is my scanned PDF so large?',
                answer: 'Scanned PDFs store each page as a high-resolution image. Compression re-encodes those images at a smaller size, which is why scans often shrink the most — frequently by 80% or more.'
            },
            {
                question: 'Is compressing my PDF for email secure?',
                answer: 'Yes. The entire compression happens inside your browser, so your document is never uploaded. This is ideal for invoices, contracts, and other sensitive attachments.'
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
            },
            {
                question: 'Will the PDF look professional enough for recruiters?',
                answer: 'Yes. Each image is placed on a clean page, and you can choose A4 or Letter sizing so the result looks like a properly scanned document rather than a phone snapshot.'
            },
            {
                question: 'How do I make a phone photo of my certificate look like a scan?',
                answer: 'Crop the photo tightly around the document and ensure good lighting before converting. The JPG to PDF tool then frames it on a white page for a scan-like appearance.'
            },
            {
                question: 'Is uploading my ID photo here safe?',
                answer: 'Yes. Conversion runs entirely in your browser, so your ID and personal documents never leave your device or reach any server.'
            },
            {
                question: 'What order will my images appear in the PDF?',
                answer: 'Images are added in the order you arrange them. Drag the thumbnails to put your resume first, then certificates and ID, before exporting.'
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
            },
            {
                question: 'Can I extract a non-continuous set of pages as exhibits?',
                answer: 'Yes. You can select individual pages or ranges (for example pages 3, 7, and 12-15) and export each exhibit as its own PDF.'
            },
            {
                question: 'Will splitting change the page numbering or formatting?',
                answer: 'No. Each extracted page keeps its exact original layout, fonts, and content. Only the pages you select are carried into the new file.'
            },
            {
                question: 'Is it confidential enough for sensitive legal files?',
                answer: 'Yes. All processing happens locally in your browser, so privileged or confidential case documents are never uploaded to a server.'
            },
            {
                question: 'How do I label exhibits after splitting?',
                answer: 'After exporting, rename each resulting file (for example "Exhibit-A.pdf") on your device. For sequential exhibit numbers across pages, use our Add Page Numbers tool.'
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
            },
            {
                question: 'Does it really work offline on a Chromebook?',
                answer: 'Once the page is loaded, merging runs entirely on your device, so a brief internet drop won\'t interrupt the process. The tool never needs to upload your files.'
            },
            {
                question: 'Will it slow down a low-spec school Chromebook?',
                answer: 'No. Because there are no uploads or server round-trips, merging is fast even on entry-level Chromebooks with limited RAM.'
            },
            {
                question: 'Where do the merged files get saved on Chrome OS?',
                answer: 'The combined PDF downloads to your Chromebook\'s Downloads folder, where you can move it to Google Drive or a USB drive.'
            },
            {
                question: 'Is it safe for student or school documents?',
                answer: 'Yes. Files stay on the Chromebook and are never sent to a server, which keeps student records and assignments private.'
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
            },
            {
                question: 'Why do government portals require PDFs under 100KB?',
                answer: 'Many government and exam application portals set tight upload limits to manage storage and bandwidth. A 100KB cap is common for forms, signatures, and supporting documents.'
            },
            {
                question: 'Can every PDF reach 100KB?',
                answer: 'Text-only and lightly scanned PDFs usually can. Documents with many high-resolution photos may need fewer pages or lower image quality to hit a strict 100KB target.'
            },
            {
                question: 'Will the text still be readable at 100KB?',
                answer: 'Yes, in most cases. Compression reduces image weight first; text remains legible. For forms with photos, check the preview before submitting.'
            },
            {
                question: 'Is compressing official documents here private?',
                answer: 'Yes. The whole process is browser-based, so your application forms and IDs are never uploaded to any server.'
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
            },
            {
                question: 'Does it work in Safari on a MacBook?',
                answer: 'Yes. Convertify is fully compatible with Safari, Chrome, and Firefox on macOS, including MacBook Air, MacBook Pro, and iMac.'
            },
            {
                question: 'Do I need Adobe Acrobat to merge PDFs on Mac?',
                answer: 'No. There is no need to buy Acrobat or any paid software. Merging happens free in your browser with no watermarks or page limits.'
            },
            {
                question: 'Why does Preview sometimes fail to merge PDFs?',
                answer: 'Preview can silently drop pages when drag-and-drop is done incorrectly. Convertify shows clear page thumbnails so you can confirm the order before exporting.'
            },
            {
                question: 'Are my files uploaded anywhere?',
                answer: 'No. Everything runs locally on your Mac, so your documents never leave the device.'
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
            },
            {
                question: 'Will my formatting and tables be preserved?',
                answer: 'The converter keeps paragraphs, headings, and most table structures. Very complex layouts may need light cleanup in Word after conversion.'
            },
            {
                question: 'Is the converted file a real editable .docx?',
                answer: 'Yes. You get a standard .docx that opens in Microsoft Word, Google Docs, or LibreOffice with fully editable, selectable text.'
            },
            {
                question: 'Why is some text not editable after conversion?',
                answer: 'If the original PDF is a photo-based scan, accuracy depends on scan quality. Clear, high-contrast scans produce the most editable results.'
            },
            {
                question: 'Is converting my PDF to Word free and private?',
                answer: 'Yes. There are no fees or sign-ups, and the conversion runs in your browser so your document stays on your device.'
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
            },
            {
                question: 'Will deleting pages reduce the file size?',
                answer: 'Usually yes. Removing image-heavy pages can noticeably shrink the file, since their content no longer needs to be stored.'
            },
            {
                question: 'Can I preview pages before removing them?',
                answer: 'Yes. Each page appears as a thumbnail so you can confirm exactly which pages to delete before exporting the cleaned-up PDF.'
            },
            {
                question: 'Does removing pages affect the remaining pages?',
                answer: 'No. The pages you keep retain their original formatting, text, and quality. Only the selected pages are dropped.'
            },
            {
                question: 'Is deleting pages from a confidential PDF safe?',
                answer: 'Yes. The tool runs entirely in your browser, so your document is never uploaded while you remove pages.'
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
            },
            {
                question: 'What does "make a PDF searchable" actually mean?',
                answer: 'OCR reads the text inside scanned images and adds an invisible text layer, so you can search, select, and copy words that were previously just pixels.'
            },
            {
                question: 'How accurate is the OCR?',
                answer: 'Accuracy is highest with clear, straight, high-resolution scans. Faint, skewed, or handwritten pages produce lower accuracy and may need manual correction.'
            },
            {
                question: 'Can I copy text from the PDF after OCR?',
                answer: 'Yes. Once processed, the recognized text becomes selectable, so you can copy and paste it into Word, email, or any other application.'
            },
            {
                question: 'Is my scanned document uploaded for OCR?',
                answer: 'No. The recognition runs in your browser, keeping sensitive scans private on your own device.'
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
            },
            {
                question: 'Why does my iPhone save photos as HEIC?',
                answer: 'HEIC is Apple\'s high-efficiency format that stores high quality in a smaller file. Converting to PDF makes the photo easy to share with anyone, regardless of device.'
            },
            {
                question: 'Can I combine several iPhone photos into one PDF?',
                answer: 'Yes. Select multiple HEIC images and they will be placed into a single PDF in the order you arrange them.'
            },
            {
                question: 'Will the photo quality stay sharp in the PDF?',
                answer: 'Yes. The original resolution is preserved, so documents, receipts, and notes captured on your iPhone remain clear.'
            },
            {
                question: 'Does this work directly on my iPhone?',
                answer: 'Yes. Open Convertify in Safari on your iPhone, select your photos, and export the PDF — no app install required.'
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
            },
            {
                question: 'Why doesn\'t Windows 11 have a built-in PDF merger?',
                answer: 'Windows can view and print PDFs but has no native merge feature. Convertify fills that gap without needing Adobe Acrobat or third-party software.'
            },
            {
                question: 'Do I need to install anything on my PC?',
                answer: 'No. The tool runs in your browser, so there\'s nothing to download or install and nothing to update.'
            },
            {
                question: 'Is it safe to merge work documents on a company laptop?',
                answer: 'Yes. Because files are processed locally and never uploaded, it works within most corporate security policies.'
            },
            {
                question: 'Can I reorder pages before merging on Windows?',
                answer: 'Yes. Drag the file thumbnails into the order you want, then merge — the combined PDF follows that exact sequence.'
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
            },
            {
                question: 'How do I hit a 200KB target specifically?',
                answer: 'Start with "Balanced" compression and check the resulting size. If it\'s still above 200KB, switch to "Extreme" and re-check the preview.'
            },
            {
                question: 'Is 200KB enough quality for a printed document?',
                answer: 'For text-based documents, yes — the text stays sharp. For photo-heavy pages intended for high-quality printing, a slightly larger size may look better.'
            },
            {
                question: 'Why is 200KB a common upload requirement?',
                answer: 'Many job portals and government forms set a 200KB limit to keep uploads fast and storage manageable, especially for resumes and ID documents.'
            },
            {
                question: 'Is this compression private?',
                answer: 'Yes. Your PDF is compressed in your browser and never uploaded, so confidential files stay on your device.'
            }
        ]
    },
    {
        slug: 'convert-excel-to-pdf-one-page',
        title: 'Convert Excel to PDF (Fit to One Page)',
        description: 'Turn your Excel spreadsheets (.xlsx, .xls) into professional PDF documents. Formatting is preserved and sheets are optimized.',
        toolHref: '/excel-to-pdf',
        toolName: 'Excel to PDF',
        keywords: ['excel to pdf', 'xlsx to pdf', 'convert spreadsheet to pdf', 'excel to pdf converter free'],
        faqs: [
            {
                question: 'Does it handle multiple sheets?',
                answer: 'Yes, all sheets in your Excel workbook will be converted into pages in the PDF.'
            },
            {
                question: 'How do I fit a wide spreadsheet onto one page?',
                answer: 'Before converting, set your Excel print area and use "Fit to one page" in print settings, or reduce columns. The PDF then captures that exact layout.'
            },
            {
                question: 'Will my formulas and formatting be preserved?',
                answer: 'Formulas are converted to their calculated values, and cell formatting such as borders, colors, and fonts is preserved in the PDF.'
            },
            {
                question: 'Can I convert .xls and .xlsx files?',
                answer: 'Yes. Both the older .xls and modern .xlsx formats are supported, along with files exported from Google Sheets.'
            },
            {
                question: 'Is converting financial spreadsheets here secure?',
                answer: 'Yes. Conversion runs in your browser, so sensitive budgets and financial data never leave your computer.'
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
            },
            {
                question: 'Why does my PDF reset rotation when I reopen it?',
                answer: 'Viewers like Chrome only rotate the on-screen view temporarily. Convertify writes the rotation into the file itself, so it stays fixed everywhere you open it.'
            },
            {
                question: 'How do I rotate every page at once?',
                answer: 'Use the "rotate all" option to turn the entire document 90, 180, or 270 degrees in a single click, then export the saved result.'
            },
            {
                question: 'Will rotating reduce quality?',
                answer: 'No. Rotation only changes page orientation; text and images keep their original quality.'
            },
            {
                question: 'Is the rotated PDF saved without uploading?',
                answer: 'Yes. Rotation happens locally in your browser, and the corrected file downloads directly to your device.'
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
            },
            {
                question: 'What\'s the difference between owner and user passwords?',
                answer: 'A user (open) password is needed just to view the file, while an owner (permissions) password only restricts printing, copying, or editing. Convertify removes the latter.'
            },
            {
                question: 'Is it legal to unlock a PDF?',
                answer: 'You should only unlock PDFs you own or have permission to modify. The tool is intended for removing restrictions on your own documents.'
            },
            {
                question: 'Will unlocking change the document content?',
                answer: 'No. Only the security restrictions are removed; the text, images, and layout remain exactly the same.'
            },
            {
                question: 'Is unlocking done privately?',
                answer: 'Yes. The process runs in your browser, so your protected document is never uploaded to a server.'
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
        faqs: [
            { question: 'How do I merge PDFs on Windows 10 for free?', answer: 'Open Convertify in Edge or Chrome, drag your PDF files in, arrange the order, and click merge. The combined file downloads instantly with no software to install.' },
            { question: 'Does Windows 10 have a built-in PDF merge tool?', answer: 'No. Windows 10 can open and print PDFs but cannot combine them natively, which is why a browser tool like Convertify is the simplest free option.' },
            { question: 'Is there a file size or page limit?', answer: 'No. You can merge large documents and many files at once because processing happens on your own PC rather than a server.' },
            { question: 'Will merging add watermarks?', answer: 'No. Convertify never adds watermarks, so your merged PDF looks clean and professional.' },
            { question: 'Are my files safe on Windows 10?', answer: 'Yes. Files are processed locally in the browser and never uploaded, so your documents stay private.' }
        ]
    },
    {
        slug: 'merge-pdf-mac-preview',
        title: 'Merge PDF Files on Mac (Preview Alternative)',
        description: 'Combine PDFs on Mac without additional software. A simpler alternative to the built-in Preview app.',
        toolHref: '/merge-pdf',
        toolName: 'Merge PDF',
        keywords: ['merge pdf mac', 'combine pdf mac preview', 'join pdf mac free'],
        faqs: [
            { question: 'How do I merge PDFs on a Mac?', answer: 'Open Convertify in Safari or Chrome, drop your PDFs in, order them with drag-and-drop, and click merge. The file saves to your Downloads folder.' },
            { question: 'Why use this instead of Preview?', answer: 'Preview can drop pages or merge in the wrong order during drag-and-drop. Convertify shows clear thumbnails so you confirm the exact order before exporting.' },
            { question: 'Does it work on all Macs?', answer: 'Yes — MacBook Air, MacBook Pro, iMac, and Mac mini on any recent macOS version, in Safari, Chrome, or Firefox.' },
            { question: 'Do I need to pay for Adobe Acrobat?', answer: 'No. Merging is completely free with no subscription, sign-up, or watermark.' },
            { question: 'Are my files uploaded to a server?', answer: 'No. Everything happens locally on your Mac, keeping your documents private.' }
        ]
    },
    {
        slug: 'merge-pdf-online-free-no-limit',
        title: 'Merge PDF Online Free No File Limit',
        description: 'Merge unlimited PDF files online. No file size limit, no registration.',
        toolHref: '/merge-pdf',
        toolName: 'Merge PDF',
        keywords: ['merge pdf online free no limit', 'combine pdf no limit', 'unlimited pdf merger'],
        faqs: [
            { question: 'Is there really no file size limit?', answer: 'Correct. Because merging runs in your browser instead of on a server, there is no upload cap — large files and many pages are handled on your own device.' },
            { question: 'How many PDFs can I merge at once?', answer: 'There is no fixed limit. You can add dozens of files in one session; the only practical constraint is your device\'s available memory.' },
            { question: 'Do I need to register or pay?', answer: 'No. There is no sign-up, no email required, and no payment — merging is free and unlimited.' },
            { question: 'Why do other free mergers limit file size?', answer: 'Most upload your files to a server, which costs them bandwidth, so they cap size or add daily limits. Convertify avoids this by processing locally.' },
            { question: 'Will big merged files keep their quality?', answer: 'Yes. Pages are copied exactly, so text stays selectable and images keep full resolution regardless of the total size.' }
        ]
    },
    {
        slug: 'merge-pdf-iphone',
        title: 'Merge PDF Files on iPhone (No App)',
        description: 'Combine PDF files directly on your iPhone. Works in the Safari browser with no app to install.',
        toolHref: '/merge-pdf',
        toolName: 'Merge PDF',
        keywords: ['merge pdf iphone', 'combine pdf iphone', 'merge pdf on phone'],
        faqs: [
            { question: 'How do I merge PDFs on an iPhone?', answer: 'Open Convertify in Safari, tap to add your PDF files from Files or iCloud, arrange them, and tap merge. The combined PDF saves back to your device.' },
            { question: 'Do I need to download an app?', answer: 'No. The tool runs entirely in Safari, so there\'s no App Store download, account, or subscription needed.' },
            { question: 'Where can I pull the PDFs from?', answer: 'You can select files stored in the iOS Files app, iCloud Drive, or other connected storage like Google Drive.' },
            { question: 'Where does the merged file go?', answer: 'After merging, save the file to your Files app or iCloud Drive, from which you can share it via email or messaging.' },
            { question: 'Is it private on my iPhone?', answer: 'Yes. Files are processed locally in the browser and never uploaded to a server.' }
        ]
    },
    {
        slug: 'merge-pdf-android',
        title: 'Merge PDF Files on Android Phone',
        description: 'Combine PDF files on Android. No app needed, works in the Chrome browser.',
        toolHref: '/merge-pdf',
        toolName: 'Merge PDF',
        keywords: ['merge pdf android', 'combine pdf android', 'merge pdf mobile'],
        faqs: [
            { question: 'How do I merge PDFs on Android?', answer: 'Open Convertify in Chrome, tap to add PDFs from your storage or Google Drive, arrange the order, and merge. The combined file downloads to your phone.' },
            { question: 'Do I need to install an app from Google Play?', answer: 'No. Everything works in the Chrome browser, so there\'s no app, account, or in-app purchase required.' },
            { question: 'Can I select files from Google Drive?', answer: 'Yes. The file picker lets you choose PDFs from local storage, Google Drive, or other connected cloud accounts.' },
            { question: 'Will it work on a budget Android phone?', answer: 'Yes. Since there are no uploads, merging is fast and works well even on phones with limited RAM.' },
            { question: 'Is my data safe?', answer: 'Yes. PDFs are processed locally on your phone and never sent to a server.' }
        ]
    },
    {
        slug: 'compress-pdf-gmail',
        title: 'Compress PDF for Gmail Attachment',
        description: 'Reduce PDF size to send via Gmail. Get under 25MB instantly.',
        toolHref: '/compress-pdf',
        toolName: 'Compress PDF',
        keywords: ['compress pdf for gmail', 'reduce pdf size gmail', 'pdf too large for email'],
        faqs: [
            { question: 'What is Gmail\'s attachment size limit?', answer: 'Gmail allows attachments up to 25MB. Files larger than that are automatically sent as a Google Drive link instead of an attachment.' },
            { question: 'How do I get my PDF under 25MB for Gmail?', answer: 'Upload the file, choose "Balanced" or "Extreme" compression, and download the smaller version. Most PDFs drop well under 25MB in one pass.' },
            { question: 'Why is my PDF too large to attach?', answer: 'Large PDFs usually contain high-resolution scans or images. Compression re-encodes those images to a smaller size, dramatically reducing the total.' },
            { question: 'Will compressing hurt readability for the recipient?', answer: 'No. "Balanced" compression keeps text sharp and images clear, which is ideal for most email attachments.' },
            { question: 'Is it safe to compress sensitive emails attachments?', answer: 'Yes. Compression runs in your browser, so invoices, contracts, and statements never get uploaded.' }
        ]
    },
    {
        slug: 'compress-pdf-outlook',
        title: 'Compress PDF for Outlook',
        description: 'Shrink PDF file size for Outlook attachments. Send large files easily.',
        toolHref: '/compress-pdf',
        toolName: 'Compress PDF',
        keywords: ['compress pdf outlook', 'reduce pdf size outlook', 'shrink pdf email attachment'],
        faqs: [
            { question: 'What is Outlook\'s attachment limit?', answer: 'Outlook.com caps attachments at 20MB, while many corporate Exchange/Outlook servers limit to 10MB. Compress below your specific limit to avoid bounce-backs.' },
            { question: 'Why does Outlook block my large attachment?', answer: 'When a file exceeds the server limit, Outlook either refuses to send or converts it to a OneDrive link. Compressing keeps it as a true attachment.' },
            { question: 'How much can I shrink my PDF?', answer: 'Scanned PDFs often shrink by 70-90%. Text-based PDFs compress less but still drop enough to fit strict 10MB corporate limits.' },
            { question: 'Will the recipient notice a quality drop?', answer: 'With "Balanced" compression, text stays sharp and images remain clear, so most recipients won\'t notice any difference.' },
            { question: 'Is compressing business documents private?', answer: 'Yes. Everything is processed locally in your browser, so confidential work files are never uploaded.' }
        ]
    },
    {
        slug: 'compress-pdf-whatsapp',
        title: 'Compress PDF for WhatsApp',
        description: 'Reduce PDF size to send on WhatsApp. Stay under the sharing limit.',
        toolHref: '/compress-pdf',
        toolName: 'Compress PDF',
        keywords: ['compress pdf whatsapp', 'reduce pdf for whatsapp', 'small pdf for sharing'],
        faqs: [
            { question: 'What is WhatsApp\'s document size limit?', answer: 'WhatsApp lets you send documents up to 2GB on current versions, but smaller files send faster and use less of the recipient\'s data — compression helps both.' },
            { question: 'How do I compress a PDF for WhatsApp?', answer: 'Upload your PDF, pick a compression level, and download the smaller file. Then attach it as a document in any WhatsApp chat.' },
            { question: 'Why should I compress before sending on WhatsApp?', answer: 'Smaller files upload and download faster, especially on mobile data, and avoid failed sends on slow connections.' },
            { question: 'Can I compress on my phone?', answer: 'Yes. Open Convertify in your phone\'s browser, compress the file, then share it through WhatsApp — no app needed.' },
            { question: 'Is it private?', answer: 'Yes. Compression happens on your device, so your document is never uploaded to a server.' }
        ]
    },
    {
        slug: 'compress-pdf-500kb',
        title: 'Compress PDF to 500KB Online',
        description: 'Get your PDF under 500KB. Perfect for form submissions.',
        toolHref: '/compress-pdf',
        toolName: 'Compress PDF',
        keywords: ['compress pdf to 500kb', 'reduce pdf to 500kb', 'pdf under 500kb'],
        faqs: [
            { question: 'How do I compress a PDF to under 500KB?', answer: 'Upload the file and choose "Balanced" compression first. If it\'s still above 500KB, switch to "Extreme" and re-check the size before downloading.' },
            { question: 'Why do upload forms require 500KB?', answer: 'Many application and registration portals set a 500KB cap to keep storage manageable and uploads quick, especially for multi-document submissions.' },
            { question: 'Can a multi-page PDF reach 500KB?', answer: 'Yes, in most cases. Text-heavy and lightly scanned documents compress well under 500KB; very image-heavy files may need fewer pages.' },
            { question: 'Will quality suffer at 500KB?', answer: 'Text remains readable, and 500KB is roomy enough that most documents look clean. Check the preview if your file has detailed photos.' },
            { question: 'Is my document uploaded?', answer: 'No. Compression runs in your browser, so your files stay private.' }
        ]
    },
    {
        slug: 'compress-pdf-1mb',
        title: 'Compress PDF to 1MB Online',
        description: 'Shrink PDF to under 1MB. Fast and free compression.',
        toolHref: '/compress-pdf',
        toolName: 'Compress PDF',
        keywords: ['compress pdf to 1mb', 'reduce pdf to 1mb', 'pdf under 1mb'],
        faqs: [
            { question: 'How do I get a PDF under 1MB?', answer: 'Upload your file and select a compression level. 1MB is an easy target for most documents — "Balanced" usually gets you there while keeping quality high.' },
            { question: 'Is 1MB good quality for a PDF?', answer: 'Yes. 1MB allows sharp text and clear images for most multi-page documents, making it a good balance between size and clarity.' },
            { question: 'Why do portals ask for under 1MB?', answer: 'A 1MB limit keeps uploads fast and storage efficient while still allowing reasonable document quality, so it\'s common for resumes and forms.' },
            { question: 'Can I compress a scanned PDF to 1MB?', answer: 'Usually yes. Scans compress significantly because their images carry most of the weight, often dropping below 1MB easily.' },
            { question: 'Is the compression private?', answer: 'Yes. Your PDF is compressed locally in your browser and never uploaded.' }
        ]
    },
    {
        slug: 'split-pdf-every-page',
        title: 'Split PDF into Separate Pages',
        description: 'Extract every page as individual PDF files. Batch split instantly.',
        toolHref: '/split-pdf',
        toolName: 'Split PDF',
        keywords: ['split pdf every page', 'extract all pages pdf', 'pdf to individual pages'],
        faqs: [
            { question: 'How do I split a PDF into single pages?', answer: 'Upload your PDF and choose the "split every page" option. Each page becomes its own file, typically delivered together so you can save them all at once.' },
            { question: 'Will I get one file per page?', answer: 'Yes. A 20-page PDF produces 20 separate single-page PDF files, each retaining its original formatting.' },
            { question: 'Is there a page limit?', answer: 'No. Because splitting happens in your browser, you can break apart large documents with hundreds of pages.' },
            { question: 'Does splitting reduce quality?', answer: 'No. Each page is copied exactly, so text stays selectable and images keep full resolution.' },
            { question: 'Are my files uploaded when splitting?', answer: 'No. The process runs locally, so your document never leaves your device.' }
        ]
    },
    {
        slug: 'split-pdf-range',
        title: 'Split PDF by Page Range',
        description: 'Extract specific page ranges from a PDF. Enter ranges like 1-5 or 10-15.',
        toolHref: '/split-pdf',
        toolName: 'Split PDF',
        keywords: ['split pdf by range', 'extract page range pdf', 'split pdf pages 1-5'],
        faqs: [
            { question: 'How do I extract a page range from a PDF?', answer: 'Upload your file and enter the range you need, such as 1-5 or 10-15. The tool creates a new PDF containing only those pages.' },
            { question: 'Can I extract multiple ranges at once?', answer: 'Yes. You can specify several ranges (for example 1-3 and 8-10) to pull out separate sections of the document.' },
            { question: 'Will the extracted pages keep their formatting?', answer: 'Yes. The selected pages retain their exact layout, fonts, and images from the original.' },
            { question: 'What if I only need one page?', answer: 'Enter a single number as the range (for example just "7") to extract that one page on its own.' },
            { question: 'Is range splitting private?', answer: 'Yes. Everything runs in your browser, so the source document is never uploaded.' }
        ]
    },
    {
        slug: 'pdf-to-word-resume',
        title: 'Convert PDF Resume to Editable Word',
        description: 'Edit a PDF resume in Word. Make changes and update it easily.',
        toolHref: '/pdf-to-word',
        toolName: 'PDF to Word',
        keywords: ['pdf to word resume', 'convert resume pdf to word', 'edit resume pdf'],
        faqs: [
            { question: 'How do I edit a resume that\'s stuck as a PDF?', answer: 'Convert the PDF to Word with Convertify, then open the .docx in Microsoft Word or Google Docs to update your experience, dates, and contact details.' },
            { question: 'Will my resume layout survive the conversion?', answer: 'Headings, bullet points, and most spacing are preserved. Highly designed templates may need minor alignment tweaks afterward.' },
            { question: 'Can I convert a resume I downloaded from a builder?', answer: 'Yes. Resumes exported from builders like Canva or LinkedIn convert to editable Word files so you can customize them freely.' },
            { question: 'Is the converted resume really editable?', answer: 'Yes. You get a true .docx with selectable, editable text rather than an image, so every line can be changed.' },
            { question: 'Is my personal information safe?', answer: 'Yes. Conversion runs in your browser, so your resume and contact details are never uploaded.' }
        ]
    },
    {
        slug: 'pdf-to-word-contract',
        title: 'Convert PDF Contract to Editable Word',
        description: 'Turn PDF contracts into editable Word documents so you can modify agreements.',
        toolHref: '/pdf-to-word',
        toolName: 'PDF to Word',
        keywords: ['pdf to word contract', 'convert legal pdf to word', 'edit contract pdf'],
        faqs: [
            { question: 'How do I edit clauses in a PDF contract?', answer: 'Convert the PDF to Word, then open the .docx to revise clauses, names, dates, and terms with full track-changes support in Word.' },
            { question: 'Will tables and numbered clauses convert correctly?', answer: 'Most numbered lists and table structures are preserved. Complex legal formatting may need light cleanup after conversion.' },
            { question: 'Is it safe to convert a confidential contract?', answer: 'Yes. The conversion runs entirely in your browser, so privileged or confidential agreements are never uploaded to a server.' },
            { question: 'Can I keep the original signatures?', answer: 'Visible signature images are carried over, but for legally executed documents you should re-sign the edited version as needed.' },
            { question: 'Does it work with scanned contracts?', answer: 'Yes, though accuracy depends on scan quality. Clear, high-contrast scans produce the most editable text.' }
        ]
    },
    {
        slug: 'jpg-to-pdf-merge',
        title: 'Combine Multiple JPG into One PDF',
        description: 'Merge several JPG images into a single PDF document.',
        toolHref: '/jpg-to-pdf',
        toolName: 'JPG to PDF',
        keywords: ['combine jpg to pdf', 'merge multiple jpg to pdf', 'join images to pdf'],
        faqs: [
            { question: 'How do I combine several JPGs into one PDF?', answer: 'Select all your JPG images at once, arrange them in the order you want, and export. They\'re combined into a single multi-page PDF.' },
            { question: 'Can I control the page order?', answer: 'Yes. Drag the image thumbnails to set the exact sequence before creating the PDF.' },
            { question: 'Will image quality be preserved?', answer: 'Yes. Each JPG keeps its original resolution, so photos and scanned pages stay sharp in the PDF.' },
            { question: 'Can I mix JPG and PNG images?', answer: 'Yes. You can combine JPG and PNG files together into the same PDF in one step.' },
            { question: 'Is it private?', answer: 'Yes. Images are converted in your browser and never uploaded to a server.' }
        ]
    },
    {
        slug: 'jpg-to-pdf-a4',
        title: 'Convert JPG to PDF in A4 Size',
        description: 'Create an A4-sized PDF from JPG images. Standard document dimensions.',
        toolHref: '/jpg-to-pdf',
        toolName: 'JPG to PDF',
        keywords: ['jpg to pdf a4', 'convert image to a4 pdf', 'a4 pdf from jpg'],
        faqs: [
            { question: 'How do I make an A4 PDF from a JPG?', answer: 'Upload your image and select A4 as the page size. The image is fitted onto a standard A4 page for clean printing and sharing.' },
            { question: 'Why use A4 instead of fitting to the image?', answer: 'A4 is the global standard for documents and printers, so an A4 PDF prints correctly and looks professional for applications and submissions.' },
            { question: 'Will my image be stretched to fill A4?', answer: 'No. The image is scaled to fit within the A4 page while keeping its aspect ratio, with margins around it as needed.' },
            { question: 'Can I add several images as A4 pages?', answer: 'Yes. Each image becomes its own A4 page in the order you arrange them.' },
            { question: 'Is the conversion private?', answer: 'Yes. It runs in your browser, so your images are never uploaded.' }
        ]
    },
    {
        slug: 'png-to-pdf-transparent',
        title: 'PNG to PDF with Transparent Background',
        description: 'Convert PNG images with transparency to PDF while handling the alpha channel cleanly.',
        toolHref: '/png-to-pdf',
        toolName: 'PNG to PDF',
        keywords: ['png to pdf transparent', 'convert png transparency to pdf', 'png with alpha to pdf'],
        faqs: [
            { question: 'What happens to transparency when converting PNG to PDF?', answer: 'PDFs use a white page background, so transparent areas of a PNG typically appear white in the resulting PDF, keeping the visible artwork intact.' },
            { question: 'Will my logo or graphic stay sharp?', answer: 'Yes. The PNG\'s full resolution is preserved, so logos and graphics remain crisp in the PDF.' },
            { question: 'Can I convert multiple PNGs into one PDF?', answer: 'Yes. Add several PNG files and they\'ll be placed onto separate pages in the order you choose.' },
            { question: 'Why convert PNG to PDF at all?', answer: 'PDF is easier to share, print, and open consistently across devices than individual image files, which is useful for documents and portfolios.' },
            { question: 'Is it private?', answer: 'Yes. Conversion happens locally in your browser and nothing is uploaded.' }
        ]
    },
    {
        slug: 'word-to-pdf-resume',
        title: 'Convert Word Resume to PDF',
        description: 'Turn a Word resume into PDF for professional, consistent job applications.',
        toolHref: '/word-to-pdf',
        toolName: 'Word to PDF',
        keywords: ['word to pdf resume', 'convert resume to pdf', 'docx to pdf resume'],
        faqs: [
            { question: 'Why should I send my resume as a PDF?', answer: 'PDF locks your formatting so it looks identical on every device and applicant tracking system, unlike a Word file that can shift fonts and spacing.' },
            { question: 'How do I convert my Word resume to PDF?', answer: 'Upload your .docx file and Convertify produces a clean PDF that preserves your fonts, layout, and bullet points.' },
            { question: 'Will my fonts and design be preserved?', answer: 'Yes. Standard fonts, spacing, and layout are kept so your resume looks exactly as designed.' },
            { question: 'Does it add a watermark?', answer: 'No. The exported PDF is clean and watermark-free, ready to submit to recruiters.' },
            { question: 'Is my resume kept private?', answer: 'Yes. Conversion runs in your browser, so your resume is never uploaded to a server.' }
        ]
    },
    {
        slug: 'excel-to-pdf-one-sheet',
        title: 'Convert Excel to PDF (One Page Per Sheet)',
        description: 'Export each Excel sheet as a separate PDF page.',
        toolHref: '/excel-to-pdf',
        toolName: 'Excel to PDF',
        keywords: ['excel to pdf one page per sheet', 'convert each sheet to pdf', 'excel sheet to pdf'],
        faqs: [
            { question: 'How do I get one PDF page per Excel sheet?', answer: 'Upload your workbook and convert. Each worksheet is rendered onto its own page so a three-sheet workbook becomes a clean three-page PDF.' },
            { question: 'Will my formatting carry over?', answer: 'Yes. Cell borders, colors, fonts, and column widths are preserved in the PDF output.' },
            { question: 'What if a sheet is very wide?', answer: 'Set the print area or "fit to page" in Excel before converting so wide sheets scale neatly onto a single page.' },
            { question: 'Are formulas included?', answer: 'Formulas are shown as their calculated values, exactly as they appear in the spreadsheet.' },
            { question: 'Is converting financial data secure?', answer: 'Yes. The conversion runs in your browser, so sensitive spreadsheets never leave your device.' }
        ]
    },
    {
        slug: 'rotate-pdf-90-degrees',
        title: 'Rotate PDF 90 Degrees Clockwise',
        description: 'Fix orientation by rotating PDF pages 90 degrees and saving permanently.',
        toolHref: '/rotate-pdf',
        toolName: 'Rotate PDF',
        keywords: ['rotate pdf 90 degrees', 'rotate pdf clockwise', 'fix pdf orientation'],
        faqs: [
            { question: 'How do I rotate a PDF 90 degrees?', answer: 'Upload your file, choose to rotate 90 degrees clockwise (or counter-clockwise), and export. The new orientation is saved into the file permanently.' },
            { question: 'Can I rotate only certain pages?', answer: 'Yes. Select individual pages to rotate while leaving the rest of the document untouched.' },
            { question: 'Why does my viewer rotation not stick?', answer: 'On-screen rotation in viewers is temporary. Convertify writes the 90-degree rotation into the file so it stays fixed everywhere.' },
            { question: 'Does rotating reduce quality?', answer: 'No. Only orientation changes; text and images keep their original quality.' },
            { question: 'Is it private?', answer: 'Yes. Rotation happens locally in your browser with no upload.' }
        ]
    },
    {
        slug: 'protect-pdf-password',
        title: 'Protect PDF with a Password',
        description: 'Add password protection to a PDF with strong encryption.',
        toolHref: '/protect-pdf',
        toolName: 'Protect PDF',
        keywords: ['protect pdf with password', 'encrypt pdf', 'password protect pdf'],
        faqs: [
            { question: 'How do I password protect a PDF?', answer: 'Upload your file, set a password, and download the encrypted PDF. Anyone opening it will need that password to view the contents.' },
            { question: 'How strong is the encryption?', answer: 'The tool applies strong PDF encryption so the document cannot be opened without the correct password.' },
            { question: 'What happens if I forget the password?', answer: 'There is no recovery — store the password somewhere safe. Without it, the protected file cannot be opened.' },
            { question: 'Can I protect sensitive documents like tax forms?', answer: 'Yes. Password protection is ideal for financial statements, contracts, and tax forms before emailing them.' },
            { question: 'Is the protection applied privately?', answer: 'Yes. Encryption runs in your browser, so the document and password never reach a server.' }
        ]
    },
    {
        slug: 'unlock-pdf-printing',
        title: 'Unlock a PDF to Enable Printing',
        description: 'Remove PDF printing restrictions so you can print locked files.',
        toolHref: '/unlock-pdf',
        toolName: 'Unlock PDF',
        keywords: ['unlock pdf printing', 'enable pdf printing', 'remove pdf print restriction'],
        faqs: [
            { question: 'Why can\'t I print my PDF?', answer: 'The PDF likely has an owner password that restricts printing. Removing that permission re-enables the print function.' },
            { question: 'How do I enable printing on a locked PDF?', answer: 'Upload the file to the Unlock PDF tool, which removes the printing restriction, then download and print normally.' },
            { question: 'Do I need the password to remove print restrictions?', answer: 'If the file opens without prompting for a password, the printing restriction can be removed. Files needing a password just to open require that password.' },
            { question: 'Will unlocking change the content?', answer: 'No. Only the restriction is removed; the document\'s text and layout stay exactly the same.' },
            { question: 'Is it private?', answer: 'Yes. Unlocking runs in your browser, so the document is never uploaded.' }
        ]
    },
    {
        slug: 'edit-pdf-text',
        title: 'Edit Text in a PDF Online',
        description: 'Modify text in PDF documents and change content easily.',
        toolHref: '/edit-pdf',
        toolName: 'Edit PDF',
        keywords: ['edit pdf text', 'modify pdf text', 'change text in pdf'],
        faqs: [
            { question: 'How do I edit text in a PDF?', answer: 'Open your PDF in the editor, click the text or add a text box, make your changes, and export the updated file.' },
            { question: 'Can I add new text and images too?', answer: 'Yes. Besides editing existing content, you can insert new text boxes, notes, and images anywhere on the page.' },
            { question: 'Will edits match the original font?', answer: 'The editor matches common fonts closely. For unusual fonts, choose the nearest available match for a consistent look.' },
            { question: 'Can I fix a typo without redoing the whole document?', answer: 'Yes. You can overlay corrected text precisely where needed without rebuilding the PDF from scratch.' },
            { question: 'Is editing private?', answer: 'Yes. The editing happens in your browser, so your document is never uploaded.' }
        ]
    },
    {
        slug: 'sign-pdf-digital',
        title: 'Sign a PDF with a Digital Signature',
        description: 'Add a signature to PDF documents quickly and securely.',
        toolHref: '/sign-pdf',
        toolName: 'Sign PDF',
        keywords: ['sign pdf digital signature', 'add signature to pdf', 'e-sign pdf'],
        faqs: [
            { question: 'How do I sign a PDF online?', answer: 'Upload your document, draw or type your signature, place it where needed, and export the signed PDF.' },
            { question: 'Can I draw my signature with a mouse or finger?', answer: 'Yes. You can draw a signature with a mouse or touchscreen, type one, or upload an image of your handwritten signature.' },
            { question: 'Is an electronic signature legally valid?', answer: 'In many countries electronic signatures are legally recognized for most agreements. Check your local regulations for documents with special requirements.' },
            { question: 'Can I sign in multiple places?', answer: 'Yes. Place your signature, initials, or the date on as many pages as the document requires.' },
            { question: 'Is signing private?', answer: 'Yes. Your document and signature stay in your browser and are never uploaded.' }
        ]
    },
    {
        slug: 'watermark-pdf-remove',
        title: 'Add a Watermark to a PDF',
        description: 'Add a text or image watermark to PDF documents, with batch support.',
        toolHref: '/watermark-pdf',
        toolName: 'Watermark PDF',
        keywords: ['watermark pdf', 'add watermark to pdf', 'batch watermark pdf'],
        faqs: [
            { question: 'How do I add a watermark to a PDF?', answer: 'Upload your file, enter watermark text (like "Confidential" or "Draft") or upload a logo, set the position and opacity, then export.' },
            { question: 'Can I watermark every page at once?', answer: 'Yes. The watermark is applied across all pages in one step, which is ideal for branding or marking drafts.' },
            { question: 'Can I control transparency and angle?', answer: 'Yes. You can adjust opacity, size, rotation, and placement so the watermark is visible without obscuring the content.' },
            { question: 'Can I use my company logo as a watermark?', answer: 'Yes. Upload a PNG or JPG logo to overlay it as an image watermark on the document.' },
            { question: 'Is watermarking private?', answer: 'Yes. The process runs in your browser, so your document is never uploaded.' }
        ]
    },
    {
        slug: 'pdf-to-jpg-high-resolution',
        title: 'Convert PDF to High Resolution JPG',
        description: 'Extract PDF pages as high-quality JPG images.',
        toolHref: '/pdf-to-jpg',
        toolName: 'PDF to JPG',
        keywords: ['pdf to jpg high resolution', 'pdf to 300dpi jpg', 'extract hd images from pdf'],
        faqs: [
            { question: 'How do I convert a PDF to high-resolution JPG?', answer: 'Upload your PDF and convert. Each page is rendered as a sharp JPG image suitable for printing or detailed viewing.' },
            { question: 'Will each page become a separate image?', answer: 'Yes. Every page is exported as its own JPG file so you can use individual pages as needed.' },
            { question: 'Is the resolution good enough for printing?', answer: 'Yes. Pages are rendered at high resolution so text and graphics stay crisp when printed or zoomed.' },
            { question: 'Why convert PDF pages to JPG?', answer: 'JPGs are easy to embed in presentations, websites, and social posts, or to share where PDFs aren\'t supported.' },
            { question: 'Is it private?', answer: 'Yes. Conversion runs in your browser with no upload.' }
        ]
    },
    {
        slug: 'pdf-to-png-transparent',
        title: 'Convert PDF to PNG (High Quality)',
        description: 'Extract PDF pages as high-quality PNG images.',
        toolHref: '/pdf-to-png',
        toolName: 'PDF to PNG',
        keywords: ['pdf to png transparent', 'extract png from pdf', 'pdf to high quality png'],
        faqs: [
            { question: 'How do I convert a PDF to PNG?', answer: 'Upload your PDF and convert each page into a high-quality PNG image, which you can download individually.' },
            { question: 'Why choose PNG over JPG?', answer: 'PNG uses lossless compression, so it\'s sharper for text, line art, diagrams, and screenshots compared to JPG.' },
            { question: 'Is each page a separate PNG?', answer: 'Yes. Every page is exported as its own PNG file.' },
            { question: 'Will diagrams and text stay crisp?', answer: 'Yes. PNG\'s lossless format keeps edges and small text sharp, ideal for technical documents.' },
            { question: 'Is it private?', answer: 'Yes. The conversion happens in your browser, so the PDF is never uploaded.' }
        ]
    },
    {
        slug: 'reorder-pdf-pages',
        title: 'Reorder PDF Pages Online',
        description: 'Drag and drop to rearrange the page order in a PDF.',
        toolHref: '/reorder-pdf',
        toolName: 'Reorder PDF',
        keywords: ['reorder pdf pages', 'arrange pdf pages', 'change pdf page order'],
        faqs: [
            { question: 'How do I reorder pages in a PDF?', answer: 'Upload your file to see page thumbnails, drag them into the order you want, and export the rearranged PDF.' },
            { question: 'Can I move a page from the end to the front?', answer: 'Yes. You can drag any page to any position, including moving the last page to the very beginning.' },
            { question: 'Will reordering change quality?', answer: 'No. Pages are simply rearranged; their content, text, and images are unchanged.' },
            { question: 'Can I reorder and delete pages together?', answer: 'Yes. While reordering, you can also remove unwanted pages before exporting the final document.' },
            { question: 'Is it private?', answer: 'Yes. Reordering runs in your browser, so your document is never uploaded.' }
        ]
    },
    {
        slug: 'delete-pdf-pages',
        title: 'Delete Pages from a PDF',
        description: 'Remove unwanted pages from a PDF to extract a clean document.',
        toolHref: '/delete-pdf-pages',
        toolName: 'Delete Pages',
        keywords: ['delete pages from pdf', 'remove pdf pages', 'delete pages pdf'],
        faqs: [
            { question: 'How do I delete specific pages from a PDF?', answer: 'Upload your file, select the pages you want to remove from the thumbnail view, and export the cleaned-up PDF.' },
            { question: 'Can I delete several pages at once?', answer: 'Yes. Mark multiple pages for removal and delete them all in a single export.' },
            { question: 'Does deleting pages shrink the file?', answer: 'Often yes, especially when you remove image-heavy pages whose content no longer needs to be stored.' },
            { question: 'Will the remaining pages keep their formatting?', answer: 'Yes. Kept pages retain their original layout, text, and quality.' },
            { question: 'Is it private?', answer: 'Yes. The process runs locally in your browser with no upload.' }
        ]
    },
    {
        slug: 'add-page-numbers-pdf',
        title: 'Add Page Numbers to a PDF',
        description: 'Insert page numbers into a PDF with custom placement.',
        toolHref: '/add-page-numbers',
        toolName: 'Add Page Numbers',
        keywords: ['add page numbers to pdf', 'number pdf pages', 'insert page numbers'],
        faqs: [
            { question: 'How do I add page numbers to a PDF?', answer: 'Upload your file, choose the position (such as bottom-center or bottom-right) and starting number, then export the numbered PDF.' },
            { question: 'Can I start numbering from a specific page?', answer: 'Yes. You can set the starting number and choose which page numbering begins on, useful when there\'s a cover page.' },
            { question: 'Can I choose the position and style?', answer: 'Yes. Page numbers can be placed in headers or footers at left, center, or right, with size options.' },
            { question: 'Is this useful for legal documents?', answer: 'Yes. Sequential page numbers help with court filings, contracts, and reports where pagination matters.' },
            { question: 'Is it private?', answer: 'Yes. Numbers are added in your browser, so your document is never uploaded.' }
        ]
    },
    {
        slug: 'ocr-pdf-searchable',
        title: 'Make a PDF Searchable with OCR',
        description: 'Convert a scanned PDF into searchable, selectable text.',
        toolHref: '/ocr-pdf',
        toolName: 'OCR PDF',
        keywords: ['ocr pdf searchable', 'make pdf searchable', 'extract text from scanned pdf'],
        faqs: [
            { question: 'What is OCR and why do I need it?', answer: 'OCR (optical character recognition) reads text inside scanned images and adds a searchable text layer, so you can find, select, and copy words that were previously just pixels.' },
            { question: 'How do I make a scanned PDF searchable?', answer: 'Upload the scanned PDF, run OCR, and download the result, which now lets you search and copy text.' },
            { question: 'How accurate is the text recognition?', answer: 'Accuracy is highest with clear, straight, high-resolution scans. Faint or skewed pages reduce accuracy.' },
            { question: 'What languages are supported?', answer: 'English and major European languages are supported for recognition.' },
            { question: 'Is my scanned document private?', answer: 'Yes. OCR runs in your browser, so sensitive scans never get uploaded.' }
        ]
    },
    {
        slug: 'repair-pdf-corrupted',
        title: 'Repair a Corrupted PDF File',
        description: 'Fix damaged PDF files and recover unreadable documents.',
        toolHref: '/repair-pdf',
        toolName: 'Repair PDF',
        keywords: ['repair corrupted pdf', 'fix damaged pdf', 'recover pdf file'],
        faqs: [
            { question: 'Why won\'t my PDF open?', answer: 'PDFs can become corrupted from interrupted downloads, failed transfers, or storage errors. Repair attempts to rebuild the file structure so it opens again.' },
            { question: 'How do I repair a corrupted PDF?', answer: 'Upload the damaged file and the tool tries to reconstruct its internal structure, then provides a recovered version to download.' },
            { question: 'Can every corrupted PDF be recovered?', answer: 'Not always. Lightly damaged files often recover fully, but severely corrupted or truncated files may only recover partially.' },
            { question: 'Will repair recover all my content?', answer: 'It recovers as much intact content as possible. Pages that were destroyed in the corruption may not be retrievable.' },
            { question: 'Is repair private?', answer: 'Yes. The process runs in your browser, so your file is never uploaded.' }
        ]
    },
    {
        slug: 'compare-pdf-differences',
        title: 'Compare Two PDF Files',
        description: 'Find the differences between two PDF documents.',
        toolHref: '/compare-pdf',
        toolName: 'Compare PDF',
        keywords: ['compare pdf files', 'diff pdf', 'find pdf differences'],
        faqs: [
            { question: 'How do I compare two PDFs?', answer: 'Upload both files and the tool highlights where they differ, making it easy to spot changes between versions.' },
            { question: 'Can it detect text changes between contract versions?', answer: 'Yes. Comparing two contract drafts helps you quickly find added, removed, or altered clauses.' },
            { question: 'Does it compare page by page?', answer: 'Yes. The comparison aligns the documents so you can review differences page by page.' },
            { question: 'Is it useful for proofreading?', answer: 'Yes. Writers and editors use it to confirm exactly what changed between revisions before publishing.' },
            { question: 'Is comparison private?', answer: 'Yes. Both files are processed in your browser and never uploaded.' }
        ]
    },
    {
        slug: 'pdf-to-word-free-online',
        title: 'PDF to Word Free Online (No Download)',
        description: 'Convert PDF to Word without software. 100% free, no registration.',
        toolHref: '/pdf-to-word',
        toolName: 'PDF to Word',
        keywords: ['pdf to word free online', 'convert pdf to docx free', 'pdf to word no download'],
        faqs: [
            { question: 'Is PDF to Word conversion really free?', answer: 'Yes. There are no fees, sign-ups, or watermarks — convert as many PDFs to editable Word documents as you need.' },
            { question: 'Do I need to install any software?', answer: 'No. The conversion runs entirely in your browser, so there\'s nothing to download or install.' },
            { question: 'Will my formatting be preserved?', answer: 'Paragraphs, headings, and most tables carry over. Complex layouts may need minor cleanup in Word.' },
            { question: 'Does it work on phones and tablets?', answer: 'Yes. The tool works in any modern browser on desktop, tablet, or mobile.' },
            { question: 'Is my file private?', answer: 'Yes. Conversion happens locally, so your document is never uploaded to a server.' }
        ]
    },
    {
        slug: 'pdf-to-excel-extract',
        title: 'Extract PDF Tables to Excel',
        description: 'Pull table data from a PDF into Excel spreadsheets.',
        toolHref: '/pdf-to-excel',
        toolName: 'PDF to Excel',
        keywords: ['pdf to excel extract', 'pull tables from pdf', 'convert pdf table to excel'],
        faqs: [
            { question: 'How do I extract a table from a PDF into Excel?', answer: 'Upload the PDF and convert it; the tool detects tabular data and produces a spreadsheet you can open and edit in Excel.' },
            { question: 'Will the columns and rows line up correctly?', answer: 'Well-structured tables map cleanly into rows and columns. Irregular or merged-cell layouts may need light adjustment afterward.' },
            { question: 'Can I extract financial statements or invoices?', answer: 'Yes. Bank statements, invoices, and reports with clear tables convert into editable spreadsheet data.' },
            { question: 'Does it work with scanned PDFs?', answer: 'Scanned tables depend on image clarity. Digitally generated PDFs produce the most accurate extraction.' },
            { question: 'Is it private?', answer: 'Yes. The conversion runs in your browser, so your data is never uploaded.' }
        ]
    },
    {
        slug: 'heic-to-pdf-iphone',
        title: 'Convert HEIC iPhone Photos to JPG',
        description: 'Turn iPhone HEIC photos into widely compatible JPG images.',
        toolHref: '/heic-to-jpg',
        toolName: 'HEIC to JPG',
        keywords: ['heic to jpg iphone', 'convert iphone photo', 'heic to jpg'],
        faqs: [
            { question: 'Why are my iPhone photos in HEIC format?', answer: 'Apple uses HEIC to save high quality in a smaller file, but many apps and Windows PCs can\'t open it, so converting to JPG ensures compatibility.' },
            { question: 'How do I convert HEIC to JPG?', answer: 'Upload your HEIC photos and the tool converts them to standard JPG images you can open anywhere.' },
            { question: 'Can I convert many photos at once?', answer: 'Yes. Select multiple HEIC files to batch-convert them to JPG in one step.' },
            { question: 'Will image quality be preserved?', answer: 'Yes. The JPGs retain high visual quality suitable for sharing, printing, and uploading.' },
            { question: 'Is conversion private?', answer: 'Yes. Photos are converted in your browser and never uploaded.' }
        ]
    },
    {
        slug: 'compress-pdf-mac',
        title: 'Compress PDF on Mac',
        description: 'Reduce PDF file size on Mac directly in the Safari browser.',
        toolHref: '/compress-pdf',
        toolName: 'Compress PDF',
        keywords: ['compress pdf mac', 'reduce pdf size mac', 'shrink pdf mac'],
        faqs: [
            { question: 'How do I compress a PDF on a Mac?', answer: 'Open Convertify in Safari or Chrome, upload your PDF, pick a compression level, and download the smaller file — no software required.' },
            { question: 'Is this better than Preview\'s "Reduce File Size"?', answer: 'Often yes. Preview\'s built-in filter can over-compress and blur images, while Convertify lets you choose the balance between size and quality.' },
            { question: 'Does it work on all Macs?', answer: 'Yes — MacBook Air, MacBook Pro, iMac, and Mac mini on any recent macOS version.' },
            { question: 'How much smaller will my PDF get?', answer: 'Scanned and image-heavy PDFs often shrink 70-90%; text-based files compress less but still drop noticeably.' },
            { question: 'Is it private?', answer: 'Yes. Compression runs locally on your Mac with no upload.' }
        ]
    },
    {
        slug: 'compress-pdf-iphone',
        title: 'Compress PDF on iPhone',
        description: 'Shrink PDF file size on iPhone so you can send smaller files.',
        toolHref: '/compress-pdf',
        toolName: 'Compress PDF',
        keywords: ['compress pdf iphone', 'reduce pdf size iphone', 'shrink pdf mobile'],
        faqs: [
            { question: 'How do I compress a PDF on my iPhone?', answer: 'Open Convertify in Safari, select the PDF from Files or iCloud, choose a compression level, and save the smaller file back to your phone.' },
            { question: 'Do I need an app?', answer: 'No. Everything works in the Safari browser, so there\'s no App Store download needed.' },
            { question: 'Why compress on a phone?', answer: 'Smaller PDFs upload faster on mobile data and fit within email and messaging size limits.' },
            { question: 'Will it keep my document readable?', answer: 'Yes. "Balanced" compression keeps text sharp while reducing the file size significantly.' },
            { question: 'Is it private?', answer: 'Yes. Compression happens on your iPhone, so your document is never uploaded.' }
        ]
    },
    {
        slug: 'merge-pdf-two-files',
        title: 'Merge Two PDF Files into One',
        description: 'Combine exactly two PDF files into a single document.',
        toolHref: '/merge-pdf',
        toolName: 'Merge PDF',
        keywords: ['merge two pdf files', 'combine 2 pdfs', 'join two pdf'],
        faqs: [
            { question: 'How do I combine two PDFs into one?', answer: 'Upload both files, set which one comes first, and click merge. The two documents join into a single PDF instantly.' },
            { question: 'Can I choose which file goes first?', answer: 'Yes. Drag the thumbnails to control the order before merging.' },
            { question: 'Will the merge keep both files\' formatting?', answer: 'Yes. Pages from each PDF are copied exactly, so formatting and quality are preserved.' },
            { question: 'Is there a size limit for two files?', answer: 'No. Even large two-file merges work because processing happens on your device.' },
            { question: 'Is it private?', answer: 'Yes. The merge runs in your browser with no upload.' }
        ]
    },
    {
        slug: 'split-pdf-single-page',
        title: 'Extract a Single Page from a PDF',
        description: 'Get one specific page from a PDF as a separate file.',
        toolHref: '/split-pdf',
        toolName: 'Split PDF',
        keywords: ['extract single page pdf', 'get one page from pdf', 'pull page from pdf'],
        faqs: [
            { question: 'How do I extract just one page from a PDF?', answer: 'Upload the file, select the single page you need, and export it as its own standalone PDF.' },
            { question: 'Will the extracted page keep its formatting?', answer: 'Yes. The page retains its exact layout, text, and images from the original document.' },
            { question: 'Can I extract a page from a large document?', answer: 'Yes. There\'s no page-count limit, so you can pull one page from a document with hundreds of pages.' },
            { question: 'Can I extract several individual pages?', answer: 'Yes. Select multiple specific pages and export them, either separately or as one combined file.' },
            { question: 'Is it private?', answer: 'Yes. Extraction runs in your browser, so the source file is never uploaded.' }
        ]
    },
    {
        slug: 'pdf-to-text-extract',
        title: 'Extract Text from a PDF',
        description: 'Pull all text content from a PDF document into plain text.',
        toolHref: '/pdf-to-text',
        toolName: 'PDF to Text',
        keywords: ['extract text from pdf', 'pdf to text converter', 'copy pdf text'],
        faqs: [
            { question: 'How do I extract text from a PDF?', answer: 'Upload your PDF and the tool pulls out the text content into plain, copyable text you can paste anywhere.' },
            { question: 'Does it work on scanned PDFs?', answer: 'For image-based scans, use the OCR PDF tool first to recognize the text, then extract it. Digital PDFs extract directly.' },
            { question: 'Will formatting be kept?', answer: 'Plain text extraction focuses on the words themselves, so complex layout and styling are not preserved — just the readable content.' },
            { question: 'Why extract text instead of converting to Word?', answer: 'Plain text is ideal when you just need the content for notes, data processing, or pasting into another app without formatting.' },
            { question: 'Is it private?', answer: 'Yes. Extraction runs in your browser, so your document is never uploaded.' }
        ]
    },
    {
        slug: 'powerpoint-to-pdf',
        title: 'Convert PowerPoint (PPTX) to PDF',
        description: 'Turn PowerPoint presentations into PDF format.',
        toolHref: '/powerpoint-to-pdf',
        toolName: 'PowerPoint to PDF',
        keywords: ['powerpoint to pdf', 'convert pptx to pdf', 'ppt to pdf'],
        faqs: [
            { question: 'How do I convert PowerPoint to PDF?', answer: 'Upload your .pptx or .ppt file and convert it to a PDF where each slide becomes a page.' },
            { question: 'Why convert a presentation to PDF?', answer: 'PDFs open on any device without PowerPoint, keep your layout fixed, and are easy to email or print as handouts.' },
            { question: 'Will fonts and images be preserved?', answer: 'Yes. Slide layouts, fonts, and images are kept so the PDF looks like your presentation.' },
            { question: 'Does each slide become one page?', answer: 'Yes. Every slide is rendered as its own PDF page in order.' },
            { question: 'Is it private?', answer: 'Yes. Conversion runs in your browser, so your presentation is never uploaded.' }
        ]
    },
    {
        slug: 'html-to-pdf-online',
        title: 'Convert HTML to PDF Online',
        description: 'Save web pages and HTML content as PDF documents.',
        toolHref: '/html-to-pdf',
        toolName: 'HTML to PDF',
        keywords: ['html to pdf', 'webpage to pdf', 'save web page as pdf'],
        faqs: [
            { question: 'How do I convert HTML to a PDF?', answer: 'Paste your HTML or provide the content, and the tool renders it into a clean, shareable PDF document.' },
            { question: 'Why save a web page as PDF?', answer: 'A PDF preserves the page exactly for archiving, offline reading, sharing receipts, or keeping records that won\'t change over time.' },
            { question: 'Will CSS styling be applied?', answer: 'Yes. Standard CSS styling such as fonts, colors, and layout is rendered into the PDF output.' },
            { question: 'Can I convert invoices or receipts built in HTML?', answer: 'Yes. HTML invoices and receipts convert into professional PDFs ready to email or print.' },
            { question: 'Is it private?', answer: 'Yes. The conversion runs in your browser with no upload.' }
        ]
    },
    {
        slug: 'text-to-pdf-txt',
        title: 'Convert a Text File to PDF',
        description: 'Turn TXT files into clean PDF documents.',
        toolHref: '/text-to-pdf',
        toolName: 'Text to PDF',
        keywords: ['text to pdf', 'txt to pdf', 'convert text file to pdf'],
        faqs: [
            { question: 'How do I convert a TXT file to PDF?', answer: 'Upload or paste your text and the tool formats it onto clean PDF pages you can download and share.' },
            { question: 'Why convert text to PDF?', answer: 'PDF is more professional and portable than a raw .txt file, and it preserves formatting consistently across devices.' },
            { question: 'Will line breaks and spacing be kept?', answer: 'Yes. Your line breaks and paragraph spacing are preserved in the PDF layout.' },
            { question: 'Can I convert long text files?', answer: 'Yes. Long documents automatically flow across multiple pages.' },
            { question: 'Is it private?', answer: 'Yes. Conversion runs in your browser, so your text is never uploaded.' }
        ]
    },
    {
        slug: 'crop-pdf-page',
        title: 'Crop PDF Page Margins',
        description: 'Trim whitespace and margins from PDF pages for a cleaner result.',
        toolHref: '/crop-pdf',
        toolName: 'Crop PDF',
        keywords: ['crop pdf', 'trim pdf margins', 'remove pdf whitespace'],
        faqs: [
            { question: 'How do I crop margins from a PDF?', answer: 'Upload your file, set the crop area to remove unwanted whitespace, and export the trimmed PDF.' },
            { question: 'Why crop a PDF?', answer: 'Cropping removes excess margins for better on-screen reading, cleaner printing, and improved display on small screens.' },
            { question: 'Can I crop all pages the same way?', answer: 'Yes. Apply one crop area across the whole document for consistent margins.' },
            { question: 'Does cropping delete content?', answer: 'Cropping hides the area outside the crop box; set the box carefully so you only remove whitespace, not text.' },
            { question: 'Is it private?', answer: 'Yes. Cropping runs in your browser, so the file is never uploaded.' }
        ]
    },
    {
        slug: 'redact-pdf-sensitive',
        title: 'Redact Sensitive Info from a PDF',
        description: 'Permanently remove confidential data from a PDF document.',
        toolHref: '/redact-pdf',
        toolName: 'Redact PDF',
        keywords: ['redact pdf', 'remove sensitive information', 'censor pdf'],
        faqs: [
            { question: 'How do I redact text in a PDF?', answer: 'Upload your file, draw redaction boxes over the sensitive content such as names or account numbers, and export the redacted version.' },
            { question: 'Is the redacted text truly removed?', answer: 'Redaction is designed to cover and remove the marked content rather than just hide it visually. Always verify the result before sharing sensitive files.' },
            { question: 'What should I redact?', answer: 'Common items include Social Security numbers, account numbers, addresses, signatures, and any personally identifiable information.' },
            { question: 'Can I redact multiple areas at once?', answer: 'Yes. Mark as many areas across as many pages as needed before exporting.' },
            { question: 'Is redaction private?', answer: 'Yes. The process runs in your browser, so confidential documents are never uploaded.' }
        ]
    },
    {
        slug: 'pdf-to-powerpoint-slides',
        title: 'Convert PDF to PowerPoint Slides',
        description: 'Turn a PDF into editable PowerPoint slides.',
        toolHref: '/pdf-to-powerpoint',
        toolName: 'PDF to PowerPoint',
        keywords: ['pdf to powerpoint', 'convert pdf to ppt', 'pdf to pptx'],
        faqs: [
            { question: 'How do I convert a PDF to PowerPoint?', answer: 'Upload your PDF and convert it into a .pptx where each page becomes a slide you can edit in PowerPoint.' },
            { question: 'Will the slides be editable?', answer: 'Yes. The output opens in PowerPoint so you can adjust content, though complex layouts may need minor fixes.' },
            { question: 'Why convert a PDF back to slides?', answer: 'It\'s useful when you received a presentation as a PDF but need to update or repurpose the slides.' },
            { question: 'Does each PDF page become a slide?', answer: 'Yes. Every page maps to its own slide in order.' },
            { question: 'Is it private?', answer: 'Yes. Conversion runs in your browser with no upload.' }
        ]
    },
    {
        slug: 'pdf-to-pdfa-archive',
        title: 'Convert PDF to PDF/A for Archiving',
        description: 'Create an archival PDF/A file for long-term storage.',
        toolHref: '/pdf-to-pdfa',
        toolName: 'PDF to PDF/A',
        keywords: ['pdf to pdfa', 'convert to pdf/a', 'archival pdf'],
        faqs: [
            { question: 'What is PDF/A and why use it?', answer: 'PDF/A is an ISO-standardized version of PDF designed for long-term archiving. It embeds all fonts and data so the document looks identical years later.' },
            { question: 'How do I convert a PDF to PDF/A?', answer: 'Upload your standard PDF and convert it to the PDF/A archival format, then download the compliant file.' },
            { question: 'Who needs PDF/A?', answer: 'Governments, courts, libraries, and businesses use PDF/A for records that must remain readable and unchanged for years.' },
            { question: 'Will the appearance change?', answer: 'No. The visible document looks the same; PDF/A just embeds everything needed for reliable future viewing.' },
            { question: 'Is it private?', answer: 'Yes. Conversion runs in your browser, so your document is never uploaded.' }
        ]
    },
    {
        slug: 'jpg-to-pdf-multiple',
        title: 'Merge Multiple JPGs into One PDF',
        description: 'Combine many JPG images into a single PDF document.',
        toolHref: '/jpg-to-pdf',
        toolName: 'JPG to PDF',
        keywords: ['multiple jpg to pdf', 'combine jpg images to pdf', 'merge photos to pdf'],
        faqs: [
            { question: 'How do I combine many JPGs into one PDF?', answer: 'Select all your JPG images at once, arrange them in order, and export them as a single multi-page PDF.' },
            { question: 'Is there a limit on how many images I can add?', answer: 'No fixed limit. Because processing is local, you can combine dozens of photos into one PDF.' },
            { question: 'Can I reorder the images first?', answer: 'Yes. Drag the thumbnails to set the page order before creating the PDF.' },
            { question: 'Will photo quality be preserved?', answer: 'Yes. Each image keeps its original resolution in the PDF.' },
            { question: 'Is it private?', answer: 'Yes. Conversion runs in your browser, so your photos are never uploaded.' }
        ]
    },
    {
        slug: 'image-compressor-whatsapp',
        title: 'Compress Images for WhatsApp',
        description: 'Reduce image file size for WhatsApp sharing without losing visible quality.',
        toolHref: '/image-compressor',
        toolName: 'Image Compressor',
        keywords: ['compress image for whatsapp', 'reduce image size whatsapp', 'small image for sharing'],
        faqs: [
            { question: 'How do I compress an image for WhatsApp?', answer: 'Upload your photo, choose a compression level, and download the smaller image to share — it uploads faster and uses less data.' },
            { question: 'Why does WhatsApp lower my image quality?', answer: 'WhatsApp re-compresses images when sending. Pre-compressing to a sensible size gives you more control over the final quality.' },
            { question: 'Will the photo still look good?', answer: 'Yes. The compressor reduces file size while keeping the image visually clear for messaging.' },
            { question: 'Can I compress on my phone?', answer: 'Yes. Open the tool in your phone\'s browser, compress, then share through WhatsApp.' },
            { question: 'Is it private?', answer: 'Yes. Compression happens on your device, so photos are never uploaded.' }
        ]
    },
    {
        slug: 'resize-image-instagram',
        title: 'Resize an Image for Instagram',
        description: 'Crop and resize images to Instagram\'s recommended dimensions.',
        toolHref: '/resize-image',
        toolName: 'Resize Image',
        keywords: ['resize image instagram', 'instagram image size', 'crop for instagram'],
        faqs: [
            { question: 'What image size does Instagram use?', answer: 'Square posts are 1080x1080px, portrait posts 1080x1350px, stories and reels 1080x1920px, and profile pictures around 320x320px.' },
            { question: 'How do I resize an image for Instagram?', answer: 'Upload your photo, set the target dimensions for the post type, and download the correctly sized image.' },
            { question: 'Why does Instagram crop my photos?', answer: 'Instagram auto-crops images that don\'t match its aspect ratios. Resizing first ensures your whole image is shown as intended.' },
            { question: 'Will resizing reduce quality?', answer: 'Resizing to Instagram\'s recommended sizes keeps photos sharp. Avoid enlarging small images, which can look soft.' },
            { question: 'Is it private?', answer: 'Yes. Resizing runs in your browser, so your photos are never uploaded.' }
        ]
    },
    {
        slug: 'webp-to-jpg',
        title: 'Convert WebP to JPG',
        description: 'Turn WebP images into the standard JPEG format.',
        toolHref: '/webp-converter',
        toolName: 'WebP Converter',
        keywords: ['webp to jpg', 'convert webp to jpeg', 'webp to jpg converter'],
        faqs: [
            { question: 'Why won\'t my WebP image open in some apps?', answer: 'WebP is a modern web format that older apps, some editors, and certain devices don\'t support. Converting to JPG ensures it opens everywhere.' },
            { question: 'How do I convert WebP to JPG?', answer: 'Upload your WebP file and the tool converts it to a standard JPG you can open and edit anywhere.' },
            { question: 'Can I convert several WebP files at once?', answer: 'Yes. Batch-convert multiple WebP images to JPG in one step.' },
            { question: 'Will quality be preserved?', answer: 'Yes. The JPG output retains strong visual quality suitable for sharing and editing.' },
            { question: 'Is it private?', answer: 'Yes. Conversion runs in your browser, so images are never uploaded.' }
        ]
    },
    {
        slug: 'jpg-to-webp',
        title: 'Convert JPG to WebP',
        description: 'Compress JPG images into the smaller WebP format for the web.',
        toolHref: '/webp-converter',
        toolName: 'WebP Converter',
        keywords: ['jpg to webp', 'convert jpg to webp', 'compress to webp'],
        faqs: [
            { question: 'Why convert JPG to WebP?', answer: 'WebP files are typically 25-35% smaller than JPG at similar quality, which speeds up websites and improves page load scores.' },
            { question: 'How do I convert JPG to WebP?', answer: 'Upload your JPG and the tool converts it to an optimized WebP file ready for the web.' },
            { question: 'Do all browsers support WebP?', answer: 'Yes. All modern browsers including Chrome, Firefox, Edge, and Safari support WebP.' },
            { question: 'Will WebP look as good as my JPG?', answer: 'Yes. WebP keeps comparable visual quality while using less file size.' },
            { question: 'Is it private?', answer: 'Yes. Conversion runs in your browser, so your images are never uploaded.' }
        ]
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
            { question: 'What size should I use?', answer: 'For profile pictures use 512x512px. For post images, 1080x1080px for Instagram, 1200x630px for Facebook.' },
            { question: 'Will my logo stay sharp at large sizes?', answer: 'Yes. Because SVG is vector-based, you can export PNG at any resolution you need without blurriness.' },
            { question: 'Can I keep a transparent background?', answer: 'Yes. PNG supports transparency, so your logo can be exported without a solid background for overlaying on any color.' },
            { question: 'Is the conversion private?', answer: 'Yes. Your SVG is rendered to PNG in your browser and is never uploaded to a server.' }
        ]
    },
    {
        slug: 'svg-to-png-for-email-signature',
        title: 'Convert SVG to PNG for Email Signature',
        description: 'Convert your SVG logo to PNG for use in email signatures. Email clients don\'t support SVG, so PNG is the best format for sharp logos in emails.',
        toolHref: '/svg-to-png',
        toolName: 'SVG to PNG',
        keywords: ['svg to png email', 'email signature logo', 'convert svg for outlook', 'svg to png gmail'],
        faqs: [
            { question: 'Why won\'t my SVG logo show in email signatures?', answer: 'Email clients like Outlook and Gmail don\'t render SVG. Converting to PNG ensures your logo displays correctly for every recipient.' },
            { question: 'What size should an email signature logo be?', answer: 'A width of 150-300px usually works well, keeping the logo crisp without making the email heavy.' },
            { question: 'Should I use a transparent background?', answer: 'Yes. A transparent PNG blends cleanly into both light and dark email themes.' },
            { question: 'Will the logo look sharp on retina screens?', answer: 'Export at 2x your display size (for example 600px for a 300px logo) so it stays sharp on high-resolution displays.' },
            { question: 'Is it private?', answer: 'Yes. The conversion runs in your browser, so your branding files are never uploaded.' }
        ]
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
            { question: 'Are data types preserved?', answer: 'The converter detects numbers and booleans automatically, converting them from string format to proper JSON data types.' },
            { question: 'Does it use the header row as keys?', answer: 'Yes. The first CSV row becomes the JSON object keys, producing an array of objects ready for API responses.' },
            { question: 'Can I use the output for database seeding?', answer: 'Yes. The JSON array works directly for seeding MongoDB, Firebase, or for mocking REST endpoints during development.' },
            { question: 'Is my data private?', answer: 'Yes. Conversion runs entirely in your browser, so your datasets are never uploaded to a server.' }
        ]
    },
    {
        slug: 'csv-to-json-for-data-migration',
        title: 'Convert CSV to JSON for Database Migration',
        description: 'Transform CSV exports from databases into JSON format for importing into MongoDB, Firebase, or other NoSQL databases.',
        toolHref: '/csv-to-json',
        toolName: 'CSV to JSON',
        keywords: ['csv to json mongodb', 'csv to json firebase', 'data migration csv', 'database import json'],
        faqs: [
            { question: 'How do I import CSV data into MongoDB?', answer: 'Convert the CSV to a JSON array here, then use mongoimport or your driver to load the documents into a collection.' },
            { question: 'Will it work for Firebase import?', answer: 'Yes. The JSON output can be shaped for Firestore or Realtime Database imports after conversion.' },
            { question: 'Are numbers and booleans typed correctly?', answer: 'Yes. The converter detects numeric and boolean values so your migrated documents use proper data types, not strings.' },
            { question: 'Can it handle large export files?', answer: 'Yes. Browser-based processing means there\'s no upload limit, so large database exports convert locally.' },
            { question: 'Is my exported data secure?', answer: 'Yes. Everything stays in your browser, so sensitive database exports are never uploaded.' }
        ]
    },
    {
        slug: 'json-to-csv-for-excel-analysis',
        title: 'Convert JSON API Data to CSV for Excel Analysis',
        description: 'Export JSON data from APIs and convert to CSV format for analysis in Excel or Google Sheets. Flattens nested objects automatically.',
        toolHref: '/json-to-csv',
        toolName: 'JSON to CSV',
        keywords: ['json to csv excel', 'api data to spreadsheet', 'json export to csv', 'json to google sheets'],
        faqs: [
            { question: 'How are nested JSON objects handled?', answer: 'Nested objects are flattened using dot notation. For example, {"address":{"city":"NYC"}} becomes a column named "address.city".' },
            { question: 'How do I open the result in Excel?', answer: 'Download the CSV and open it directly in Excel or import it into Google Sheets — columns map automatically from the JSON keys.' },
            { question: 'What happens with arrays in the JSON?', answer: 'Arrays of objects become rows, while arrays of values are serialized into a single cell so no data is lost.' },
            { question: 'Can I convert a large API response?', answer: 'Yes. There\'s no size limit since conversion happens in your browser.' },
            { question: 'Is my API data private?', answer: 'Yes. The conversion is local, so your API responses are never uploaded to a server.' }
        ]
    },
    {
        slug: 'json-to-csv-for-reporting',
        title: 'Convert JSON Data to CSV for Business Reports',
        description: 'Transform JSON data exports into CSV format for creating business reports and dashboards in spreadsheet applications.',
        toolHref: '/json-to-csv',
        toolName: 'JSON to CSV',
        keywords: ['json to csv report', 'json to spreadsheet report', 'data export csv', 'business data csv'],
        faqs: [
            { question: 'How do I turn JSON into a report-ready spreadsheet?', answer: 'Paste your JSON, convert to CSV, and open it in Excel or Sheets where you can build charts, pivot tables, and dashboards.' },
            { question: 'Will the column headers be clear?', answer: 'Yes. JSON keys become column headers, and nested fields are flattened with dot notation for readable columns.' },
            { question: 'Can analysts without coding skills use this?', answer: 'Yes. It bridges developer JSON exports and analyst spreadsheets without any scripting required.' },
            { question: 'Does it handle records with different fields?', answer: 'Yes. The converter collects all keys across records so every field appears as a column, leaving blanks where data is missing.' },
            { question: 'Is it private?', answer: 'Yes. Conversion runs in your browser, so business data is never uploaded.' }
        ]
    },
    {
        slug: 'qr-code-for-business-card',
        title: 'Generate a QR Code for a Business Card',
        description: 'Create a QR code linking to your website, LinkedIn, or contact info to add to your business card design.',
        toolHref: '/qr-code-generator',
        toolName: 'QR Code Generator',
        keywords: ['qr code business card', 'qr code contact info', 'business card qr', 'vcard qr code'],
        faqs: [
            { question: 'What should I put in a business card QR code?', answer: 'Common options include your website URL, LinkedIn profile, vCard contact data, or a landing page with all your contact information.' },
            { question: 'What size QR code for business cards?', answer: 'A 256x256 pixel QR code works well for standard business cards. Make sure there is sufficient contrast and quiet zone (white space) around the code.' },
            { question: 'Will the QR code still scan after printing?', answer: 'Yes, as long as you print it at least 2x2 cm with good contrast and don\'t crop the white border around it.' },
            { question: 'Can I download it in high resolution for print?', answer: 'Yes. Generate a high-resolution PNG so the code stays crisp when printed on cards.' },
            { question: 'Is creating the QR code private?', answer: 'Yes. The code is generated in your browser, so your contact details are never uploaded.' }
        ]
    },
    {
        slug: 'qr-code-for-restaurant-menu',
        title: 'Generate a QR Code for a Restaurant Menu',
        description: 'Create a QR code that links to your digital restaurant menu. Customers scan with their phone to view the menu without touching a physical copy.',
        toolHref: '/qr-code-generator',
        toolName: 'QR Code Generator',
        keywords: ['restaurant menu qr code', 'digital menu qr', 'contactless menu', 'cafe qr code'],
        faqs: [
            { question: 'How do I make a QR code for my menu?', answer: 'Upload your menu online (as a PDF or web page), then generate a QR code pointing to that link and print it for your tables.' },
            { question: 'Can I update the menu without reprinting the code?', answer: 'Yes, if the QR points to a URL you control — just update the page or PDF at that link and the same code shows the new menu.' },
            { question: 'What size should a table-tent QR code be?', answer: 'Around 3x3 cm or larger scans reliably from a comfortable distance at a table.' },
            { question: 'Do customers need an app to scan it?', answer: 'No. Modern iPhone and Android cameras scan QR codes natively without any app.' },
            { question: 'Is it private?', answer: 'Yes. The QR code is generated locally in your browser.' }
        ]
    },
    {
        slug: 'qr-code-for-wifi-sharing',
        title: 'Generate a QR Code for WiFi Network Sharing',
        description: 'Create a QR code that guests can scan to automatically connect to your WiFi network. No need to share passwords manually.',
        toolHref: '/qr-code-generator',
        toolName: 'QR Code Generator',
        keywords: ['wifi qr code', 'share wifi qr', 'wifi password qr code', 'guest wifi qr'],
        faqs: [
            { question: 'How does a WiFi QR code work?', answer: 'The QR code encodes your network name, password, and security type. Scanning it prompts the phone to join the network automatically.' },
            { question: 'Do guests need an app to connect?', answer: 'No. Both iPhone and Android cameras can read WiFi QR codes and offer to connect with one tap.' },
            { question: 'Is it safe to display a WiFi QR code?', answer: 'It\'s convenient for guest networks. For sensitive networks, use a separate guest WiFi so your main credentials aren\'t exposed.' },
            { question: 'Where should I place the WiFi QR code?', answer: 'Common spots include a framed card at reception, a café counter, or a guest room — anywhere visitors can easily scan it.' },
            { question: 'Is my WiFi password kept private?', answer: 'Yes. The code is generated in your browser, so your network details are never uploaded to a server.' }
        ]
    },
    {
        slug: 'markdown-to-pdf-for-documentation',
        title: 'Convert Markdown Documentation to PDF',
        description: 'Convert README files, API docs, and technical documentation from Markdown to professional PDF format for sharing with clients or teams.',
        toolHref: '/markdown-to-pdf',
        toolName: 'Markdown to PDF',
        keywords: ['markdown to pdf documentation', 'readme to pdf', 'github markdown pdf', 'technical docs pdf'],
        faqs: [
            { question: 'Does it support GitHub-flavored Markdown?', answer: 'Yes, the converter supports headings, bold, italic, links, lists, code blocks, blockquotes, and horizontal rules.' },
            { question: 'How do I convert a README to PDF?', answer: 'Paste your Markdown or upload the .md file, and the tool renders a clean, formatted PDF ready to share.' },
            { question: 'Will code blocks stay formatted?', answer: 'Yes. Code blocks are rendered in monospace with clear formatting so technical docs remain readable.' },
            { question: 'Why convert docs to PDF?', answer: 'A PDF is easy to email to clients, attach to proposals, or archive, and it looks consistent without needing a Markdown viewer.' },
            { question: 'Is it private?', answer: 'Yes. Conversion runs in your browser, so your documentation is never uploaded.' }
        ]
    },
    {
        slug: 'base64-encode-image-for-html',
        title: 'Encode an Image to Base64 for HTML Embedding',
        description: 'Convert images to Base64 data URIs for embedding directly in HTML and CSS files without external image requests.',
        toolHref: '/base64',
        toolName: 'Base64 Encoder/Decoder',
        keywords: ['base64 image html', 'encode image base64', 'data uri image', 'inline image base64'],
        faqs: [
            { question: 'Why embed images as Base64?', answer: 'Base64 embedding reduces HTTP requests, is useful for email templates (which can\'t load external images), and bundles small icons directly into CSS.' },
            { question: 'How do I use the Base64 string in HTML?', answer: 'Paste it into an img tag as src="data:image/png;base64,..." or into CSS as a background-image data URI.' },
            { question: 'Should I Base64-encode large images?', answer: 'No. Base64 increases size by about 33%, so it\'s best for small icons and logos; large images are better served as normal files.' },
            { question: 'Which image formats can I encode?', answer: 'PNG, JPG, GIF, SVG, and WebP can all be encoded to Base64 data URIs.' },
            { question: 'Is it private?', answer: 'Yes. Encoding happens in your browser, so your images are never uploaded.' }
        ]
    },
    {
        slug: 'bmp-to-jpg-for-web-upload',
        title: 'Convert BMP Images to JPG for Web Upload',
        description: 'Convert large BMP bitmap files to compressed JPG format for web use. Dramatically reduce file size while maintaining quality.',
        toolHref: '/bmp-to-jpg',
        toolName: 'BMP to JPG',
        keywords: ['bmp to jpg web', 'convert bitmap to jpeg', 'bmp to jpg compress', 'reduce bmp file size'],
        faqs: [
            { question: 'Why are BMP files so large?', answer: 'BMP stores every pixel uncompressed, so files are huge. Converting to JPG applies compression and can shrink the size by 90% or more.' },
            { question: 'How do I convert BMP to JPG?', answer: 'Upload your BMP file and the tool converts it to a compressed, web-friendly JPG you can download instantly.' },
            { question: 'Will quality drop noticeably?', answer: 'For typical web use, no. JPG compression keeps photos and graphics looking clear while massively reducing file size.' },
            { question: 'Can I convert several BMP files at once?', answer: 'Yes. Batch-convert multiple bitmaps to JPG in one step.' },
            { question: 'Is it private?', answer: 'Yes. Conversion runs in your browser, so your images are never uploaded.' }
        ]
    },
    {
        slug: 'xml-to-json-for-api-migration',
        title: 'Convert XML API Response to JSON Format',
        description: 'Transform XML API responses into JSON for modern web applications and REST API migrations. Preserves data structure and attributes.',
        toolHref: '/xml-to-json',
        toolName: 'XML to JSON',
        keywords: ['xml to json api', 'soap to rest conversion', 'xml response to json', 'migrate xml to json'],
        faqs: [
            { question: 'How do I convert an XML API response to JSON?', answer: 'Paste your XML and the tool parses it into structured JSON, preserving nested elements and attributes.' },
            { question: 'Are XML attributes kept?', answer: 'Yes. Element attributes are converted into JSON properties so no data is lost during the migration.' },
            { question: 'Is this useful for SOAP to REST migration?', answer: 'Yes. Converting legacy SOAP/XML payloads to JSON helps modernize services for REST and JavaScript clients.' },
            { question: 'How are nested elements handled?', answer: 'Nested XML elements become nested JSON objects, and repeated elements become arrays.' },
            { question: 'Is my data private?', answer: 'Yes. Conversion runs in your browser, so API payloads are never uploaded.' }
        ]
    },
    {
        slug: 'tiff-to-pdf-for-scanned-documents',
        title: 'Convert Scanned TIFF Documents to PDF',
        description: 'Convert TIFF scans from office scanners and copiers to universally compatible PDF format for sharing and archiving.',
        toolHref: '/tiff-to-pdf',
        toolName: 'TIFF to PDF',
        keywords: ['tiff scan to pdf', 'scanner tiff to pdf', 'convert scanned tiff', 'tiff to pdf document'],
        faqs: [
            { question: 'Why convert TIFF scans to PDF?', answer: 'TIFF files are large and don\'t open in many apps or browsers. PDF is universally compatible, smaller, and easier to email and archive.' },
            { question: 'Can I combine multi-page TIFF scans into one PDF?', answer: 'Yes. Multi-page TIFFs and multiple TIFF files can be merged into a single, ordered PDF document.' },
            { question: 'Will scan quality be preserved?', answer: 'Yes. The scanned image quality is retained so text and details stay legible in the PDF.' },
            { question: 'Is this good for archiving documents?', answer: 'Yes. PDF is a stable, long-lived format that\'s ideal for storing scanned records and contracts.' },
            { question: 'Is it private?', answer: 'Yes. Conversion runs in your browser, so your scanned documents are never uploaded.' }
        ]
    }
];

import { applyMobileSeoTitles } from './document-title.ts'

// Centralized SEO data for all tools
// This helps maintain consistent, keyword-rich content across all pages

export const toolSeoData = {
    "merge-pdf": {
        title: "Merge PDF Free — Combine PDF Files, No Limit or Watermark",
        description: "Combine multiple PDFs into one file in seconds. Drag to reorder, unlimited files, no watermark, no sign-up. Files never leave your browser.",
        keywords: [
            "convertify pdf merger", "merge pdf", "combine pdf files", "merge pdf free", "merge pdf online",
            "combine pdf files online free", "pdf merger", "join pdf files", "merge pdf no watermark",
            "combine pdf no limit", "merge multiple pdfs", "pdf combiner free online",
            "merge pdf without sign up", "combine pdf documents", "stitch pdf pages",
            "pdf binder free", "concatenate pdfs", "batch pdf merge", "merge pdf files together"
        ],
        h1: "Convertify PDF Merger - Merge PDF Free Online",
        faqs: [
            {
                question: "Is this PDF merger really free with no limits?",
                answer: "Yes. There is no limit on the number of files, no watermark, and no sign-up. Each file can be up to 200 MB; very large merges are limited by your device's memory."
            },
            {
                question: "Can I reorder the files after uploading?",
                answer: "Absolutely! Our visual merger lets you drag and drop your PDFs to set the exact order before combining them into a single document."
            },
            {
                question: "Can I merge PDF files with images (JPG/PNG)?",
                answer: "Yes! Convertify supports merging mixed file types. Upload PDFs alongside JPG or PNG images and combine them into one sequential PDF."
            },
            {
                question: "Will the merged file be too large to email?",
                answer: "Pages are copied across as they are, without re-compressing, so the merged PDF is roughly the size of your files combined. If it is too big to email, run it through Compress PDF."
            },
            {
                question: "Is it safe for confidential documents?",
                answer: "100% safe. All merging happens locally in your browser. Your files are never uploaded to any server, ensuring complete privacy."
            }
        ],
        howToSteps: [
            { name: "Upload PDFs", text: "Select or drag & drop the PDF files you want to combine." },
            { name: "Arrange Order", text: "Drag and drop to set the perfect page order." },
            { name: "Download Free", text: "Click merge and get your combined PDF instantly – no watermarks!" }
        ]
    },
    "split-pdf": {
        title: "Split PDF Free Online — Extract & Separate Pages",
        description: "Split a PDF and extract the exact pages you need. Pick single pages or a range, get a new PDF instantly. Free, no sign-up, runs in your browser.",
        keywords: [
            "convertify pdf splitter", "split pdf", "extract pages from pdf", "separate pdf pages", "cut pdf pages", "pdf splitter online",
            "how to split pdf on windows", "split pdf windows 10 11", "extract pages pdf windows",
            "select pages extract", "remove pdf pages", "separate pdf files", "split by page range", "isolate pdf sections",
            "cut out pdf pages", "divide pdf chapters", "pull single pages", "break pdf into parts", "delete pdf pages online",
            "save specific pdf pages", "extract pdf range", "split large pdf free", "convertify split pdf"
        ],
        h1: "Convertify PDF Splitter - Extract Pages Free Online",
        faqs: [
            {
                question: "How to split PDF on Windows without downloading software?",
                answer: "Convertify allows you to split PDF files directly in your web browser (Edge, Chrome, or Firefox) on Windows 10/11. No need to install heavy software like Acrobat—everything stays private on your machine."
            },
            {
                question: "Can I extract just pages 1-3 from a PDF?",
                answer: "Yes, easily select specific pages or enter a custom range (e.g., 1-3) to extract exactly what you need into a new PDF file."
            },
            {
                question: "What splitting modes are available?",
                answer: "You can extract all pages as separate files, select specific pages to extract, or split by custom page ranges."
            },
            {
                question: "Is splitting secure for confidential files?",
                answer: "Absolutely. We use 100% client-side processing. Your documents are split inside your browser and never uploaded to any server, guaranteeing absolute privacy."
            },
            {
                question: "Does it work on password-protected PDFs?",
                answer: "Yes. A PDF with only permission restrictions opens straight away; if it needs a password to open, you're asked for it once, and the split files are saved without it. PDFs using older AES-128 encryption can't be opened here; run them through Unlock PDF first."
            }
        ],
        howToSteps: [
            { name: "Upload PDF", text: "Select the PDF file you want to split." },
            { name: "Select Pages", text: "Click the pages you want to extract or set a range." },
            { name: "Split", text: "Download your extracted pages as a new PDF instantly." }
        ]
    },
    "compress-pdf": {
        title: "Compress PDF for Email, 100KB & 200KB Forms — Free",
        description: "Shrink a PDF to 50KB, 100KB or 200KB for form uploads, or under 10MB / Gmail’s 25MB attachment cap. Multi-pass, free, no upload.",
        keywords: [
            "compress pdf", "compress pdf free", "pdf compressor", "reduce pdf size",
            "compress pdf to 100kb", "compress pdf to 200kb", "compress pdf online",
            "compress pdf to 100kb free online", "free pdf compressor",
            "pdf compressor 100kb", "pdf compressor 200kb", "compress pdf online free", "reduce pdf size online",
            "compress pdf for government forms", "passport scan compression 100kb", "visa application pdf compressor",
            "shrink pdf file online 200kb free", "pdf size reducer",
            "make pdf smaller", "smaller pdf file", "compress pdf for email", "compress pdf for gmail",
            "gmail 25mb attachment", "compress pdf under 10mb", "reduce pdf for email attachment",
            "pdf compressor no watermark", "best pdf compressor free", "reduce pdf file size without losing quality",
            "compress pdf without sign up", "free pdf compressor no limit", "online pdf size reducer",
            "best free pdf compressor online", "shrink pdf", "tools to compress pdf",
            "reduce pdf size to 100kb", "compress pdf up to 240 kb"
        ],
        h1: "Compress a PDF to 100KB, 200KB, or email size",
        faqs: [
            {
                question: "How do I compress a PDF to 100KB or 200KB for a government or visa form?",
                answer: "Upload the PDF, tap the 100 KB or 200 KB preset, and download. Convertify runs several quality/resolution passes until the file is at or under that cap. 50 KB is there for stricter photo scans. This is a real PDF, processed in your browser — nothing is uploaded."
            },
            {
                question: "How do I compress a PDF for Gmail or an email attachment under 10MB?",
                answer: "Gmail rejects attachments over 25 MB; many offices still ask for under 10 MB. Choose the 10 MB preset (or 20 MB if you only need Gmail headroom). For a 2 MB job-portal cap, use 2 MB. If the file is already a tight 100–200 KB form upload, you do not need the email presets."
            },
            {
                question: "The file is still too large after compression. What now?",
                answer: "Pick a smaller target, or clear the target box and lower quality yourself under Advanced settings. Image-heavy scans shrink more than text PDFs. If you also have a minimum size (too small as well as too large), use Fit to size instead of a single ceiling."
            },
            {
                question: "Will the text stay selectable?",
                answer: "Not after this compressor. Pages are rasterized to JPEG so we can hit a hard KB target. The result still opens as a PDF and stays readable at sensible targets; it is no longer a text layer. Do not use this pass if you must keep selectable text or a digital signature."
            },
            {
                question: "Does compressing a PDF upload my file?",
                answer: "No. Compression runs in your browser. Close the tab and the working copy is gone. Only the file you choose to download stays on your device — including passport scans and visa packets."
            },
            {
                question: "JPEG vs a “real” PDF — will the portal accept it?",
                answer: "Yes. The download is a standard PDF with each page as an embedded JPEG. Government, visa, university, and email systems check type and size, not whether the pages were re-encoded. Photos that also need exact pixels belong on Passport photo; a min–max KB band belongs on Fit to size."
            }
        ],
        howToSteps: [
            { name: "Upload PDF", text: "Drop a PDF (or a photo). The current size is shown so you can pick a realistic target." },
            { name: "Choose a target", text: "Use 100 KB / 200 KB for forms, 10 MB for email, or type a custom KB or MB value." },
            { name: "Download", text: "Get the smaller PDF on your device — no watermark, no sign-up, no upload." }
        ]
    },
    "jpg-to-pdf": {
        title: "JPG to PDF — Combine Photos into One PDF, No Upload",
        description: "Combine JPG photos into one PDF. Drag to set the order, no watermark, nothing uploaded. For PNG screenshots, use PNG to PDF.",
        keywords: [
            "convertify jpg to pdf", "jpg to pdf", "convert jpg to pdf", "image to pdf", "photos to pdf", "jpeg to pdf",
            "jpg to pdf converter free", "combine jpg to pdf", "multiple jpg to one pdf",
            "combine photos into pdf", "merge images to pdf", "convert multiple images to pdf",
            "jpg to pdf no sign up", "jpg to pdf no watermark", "jpg to pdf online free",
            "scan to pdf iphone", "scan to pdf android", "photo to pdf converter",
            "batch jpg to pdf", "photo to pdf no upload",
            "high quality jpg to pdf", "jpg to pdf keep quality", "image to pdf combiner"
        ],
        h1: "JPG to PDF — Combine Photos into One PDF",
        faqs: [
            {
                question: "How do I combine multiple JPG photos into one PDF?",
                answer: "Drop all your JPG photos at once, drag the thumbnails to set the page order, then convert. You get a single multi-page PDF. No sign-up, no watermark, and the photos stay on your device."
            },
            {
                question: "Can I convert photos from my phone camera to PDF?",
                answer: "Yes. Open the page in Safari or Chrome on iPhone or Android, pick photos from your gallery, and convert. It is built for receipts, homework scans, and document photos."
            },
            {
                question: "Will my photos lose quality when converted to PDF?",
                answer: "Each photo is embedded at its original resolution. There is no extra compression step on this page. If the PDF is too large to email, run it through Compress PDF afterwards."
            },
            {
                question: "Can I set the page size to A4 or Letter?",
                answer: "Not on this tool. Each PDF page is sized to that photo, so a tall receipt stays tall and a landscape shot stays landscape. For PNG screenshots, use PNG to PDF instead — that combiner is separate so photo and screenshot searches stay distinct."
            },
            {
                question: "Is there a limit on how many photos I can convert?",
                answer: "No hard limit. Convert one photo or a large batch. Because it runs in your browser, very large sets depend on your device memory."
            },
            {
                question: "Is it safe to convert personal photos?",
                answer: "Yes. Conversion happens in your browser. Photos are never uploaded to a server, so it is suitable for IDs, receipts, and private pictures."
            }
        ],
        howToSteps: [
            { name: "Add your JPG photos", text: "Drag and drop JPG or JPEG photos from your computer or phone gallery." },
            { name: "Arrange the order", text: "Drag thumbnails to set the page order. The first photo becomes page 1." },
            { name: "Download the PDF", text: "Convert and download one combined PDF — no watermark, nothing uploaded." }
        ]
    },
    "word-to-pdf": {
        title: "Word to PDF Free Online — DOCX to PDF, No Watermark",
        description: "Convert a .docx file's text to PDF free, no Microsoft Office needed. Extracts your text and lays it out on clean pages. Images and styling are not carried over.",
        keywords: [
            "word to pdf", "docx to pdf", "convert word to pdf", "word to pdf converter",
            "word to pdf free", "word to pdf online", "word to pdf converter free online",
            "convert word to pdf free", "docx to pdf free", "docx to pdf converter without watermark",
            "word to pdf without microsoft office", "word to pdf no office",
            "convert docx to pdf online free",
            "word to pdf no sign up", "word to pdf no watermark",
            "convertify word to pdf",
        ],
        h1: "Word to PDF Free - No Microsoft Office",
        faqs: [
            {
                question: "Can I convert Word to PDF without Microsoft Office?",
                answer: "Yes. Convertify works entirely independently of Microsoft Office, right in your browser, on Windows, Mac, or mobile."
            },
            {
                question: "Will my document's exact formatting be preserved?",
                answer: "No — this tool extracts your document's text content and lays it out on clean PDF pages. Exact fonts, images, tables, and complex layout are not preserved. For a visually exact PDF, use Word's own \"Save as PDF\" export."
            },
            {
                question: "Is this Word to PDF converter really free?",
                answer: "Yes! Convert unlimited Word documents to PDF completely free. No sign-up required, no watermarks added, and no hidden limits."
            },
            {
                question: "Is it secure for confidential documents?",
                answer: "Yes. Everything is processed locally in your browser. Your document never touches a server."
            },
            {
                question: "Does it support the older .doc format?",
                answer: "No — only the modern .docx format is supported. If you have an old .doc file, open and re-save it as .docx in Word or Google Docs first."
            }
        ],
        howToSteps: [
            { name: "Upload Word File", text: "Drag & drop your .docx file - works without Microsoft Office." },
            { name: "Convert", text: "We extract the document's text and lay it out on PDF pages." },
            { name: "Download Free", text: "Get your PDF instantly - no sign-up, no watermarks." }
        ]
    },
    "pdf-to-jpg": {
        title: "PDF to JPG — High Quality up to 300 DPI, No Upload",
        description: "Turn each PDF page into a JPG at 150, 220 or 300 DPI on your device. Multi-page files download as a ZIP. Free, no watermark, nothing uploaded.",
        keywords: [
            "pdf to jpg", "pdf to jpg converter", "convert pdf to jpg", "pdf to jpeg",
            "pdf to jpg free", "pdf to jpg online", "pdf to image", "pdf to jpg converter free",
            "convert pdf to image", "save pdf as picture", "pdf pages to jpg",
            "pdf to jpg converter online free", "pdf to jpg free online",
            "turn pdf into image", "batch pdf to jpg", "pdf to jpg download",
            "pdf to jpg no sign up", "pdf to jpg no watermark",
            "convertify pdf to jpg",
            "pdf to images free", "convert pdf pages to images",
            "free pdf to jpg converter", "pdf to photo", "pdf to picture"
        ],
        h1: "PDF to JPG — Convert PDF Pages to Images",
        faqs: [
            {
                question: "How do I convert a PDF to JPG?",
                answer: "Drop your PDF, then convert. Each page is rendered as a JPG in your browser. A one-page PDF downloads as a single JPG; a multi-page PDF downloads as a ZIP of JPGs."
            },
            {
                question: "Can I extract just one photo or logo from inside a page?",
                answer: "No. This tool renders each full PDF page as a JPG. It does not pull individual embedded images out of a page. Crop the JPG afterwards if you only need part of the page."
            },
            {
                question: "What resolution are the JPGs?",
                answer: "Pick Standard (150 DPI), High (220 DPI, the default) or Maximum (300 DPI, print quality) before converting. Text and line art are drawn from the PDF itself, so they stay sharper than a screenshot of the file. Very large pages are capped at 8,000 pixels on the long side."
            },
            {
                question: "Are my files uploaded to convert them?",
                answer: "No. PDF.js renders pages locally in your browser. The file never leaves your device, which is why this works for IDs, contracts, and other private pages."
            },
            {
                question: "Does it add a watermark?",
                answer: "No. The JPGs are plain page images — no Convertify stamp, no sign-up, no daily cap."
            }
        ],
        howToSteps: [
            { name: "Select your PDF", text: "Drop a PDF or click to browse. The file stays on your device." },
            { name: "Convert the pages", text: "Each page is drawn to a canvas in your browser and saved as a JPG." },
            { name: "Download JPG or ZIP", text: "One page downloads as a JPG. Two or more pages download together as a ZIP." }
        ]
    },
    "png-to-pdf": {
        title: "PNG to PDF Converter — Combine Multiple, No Upload",
        description: "Combine multiple PNG images into one PDF. Drag to set the page order, no watermark, nothing uploaded. Free PNG to PDF converter for screenshots and exports.",
        keywords: [
            "png to pdf", "png to pdf converter", "convert png to pdf", "png to pdf free",
            "combine png to pdf", "merge png to pdf", "multiple png to pdf", "png to pdf hd",
            "combine multiple png into one pdf", "combine pngs into pdf", "merge multiple png to pdf",
            "png to pdf online", "png to pdf converter free", "combine png into one pdf",
            "png merge to pdf", "turn multiple pngs into pdf", "how to combine png files into one pdf",
            "how to merge png to pdf", "combine images to pdf without losing quality",
            "merge png files into single pdf", "batch png to pdf converter",
            "join pngs as pdf pages", "high quality merge pngs pdf",
            "convert png to pdf bulk", "convert png to pdf online free", "png to pdf no watermark",
            "png to pdf high resolution", "save png as pdf", "png to pdf free online",
            "merge png", "combine png", "png to pdf merge", "pngs to pdf"
        ],
        h1: "PNG to PDF — Combine Multiple PNG Images into One PDF",
        faqs: [
            {
                question: "How do I combine multiple PNG files into one PDF?",
                answer: "Drop or select all of your PNG files at once, drag the thumbnails to set the page order, then click Convert. You get a single multi-page PDF with every PNG, in order. No software install and no sign-up."
            },
            {
                question: "Can I put every PNG on an A4 or Letter page?",
                answer: "Yes. Set Page size to A4 or US Letter and each image is fitted onto a page of that size without stretching, centred, with an optional white margin. Wide screenshots get a landscape page. The default keeps each page the exact size of its PNG, with no borders."
            },
            {
                question: "How do I merge PNG to PDF for free without a watermark?",
                answer: "This combiner is free and never adds a watermark. Drop your PNGs, arrange the order, and download the merged PDF. There is no daily limit, no locked “pro” mode, and no email required."
            },
            {
                question: "Is the merged PNG to PDF output high resolution?",
                answer: "Each PNG is embedded at its original pixel size, so screenshots and design exports stay as sharp as the source file. There is no extra 300 DPI upscale — what you drop is what goes into the PDF."
            },
            {
                question: "Does it preserve PNG transparency in the PDF?",
                answer: "Yes. Alpha channels (transparent backgrounds) are preserved when the page background is transparent, so logos, signatures, and design assets keep their look."
            },
            {
                question: "Can I combine 50 or 100 PNGs into a single PDF?",
                answer: "Yes — there’s no hard file count limit. Because everything runs in your browser, performance depends on your device’s memory; for very large batches we recommend Chrome or Edge on a desktop."
            },
            {
                question: "Does combining PNG to PDF work on iPhone and Android?",
                answer: "Yes. The combiner runs entirely in the mobile browser — no app to install. On iPhone, open the page in Safari; on Android, use Chrome. Your photos never leave the phone."
            },
            {
                question: "Will the combined PDF be small enough to email?",
                answer: "It depends on your PNGs. Each image is embedded without recompression, so the PDF is roughly the size of the PNGs combined. If it is too big to email, run the result through our PDF compressor."
            },
            {
                question: "Is it safe to upload sensitive PNGs (IDs, scans, screenshots)?",
                answer: "Your files never leave your device. Convertify processes everything client-side in your browser — nothing is uploaded to a server. That makes it safe for IDs, medical scans, financial screenshots, and confidential documents."
            }
        ],
        howToSteps: [
            { name: "Upload your PNG images", text: "Drag and drop, or tap to select, all the PNG files you want to combine in one go." },
            { name: "Reorder the pages", text: "Drag the thumbnails to set the exact page order in the final PDF." },
            { name: "Click Convert and download", text: "Hit Convert. Your single multi-page PDF downloads instantly — no watermark, no sign-up, nothing uploaded." }
        ]
    },
    "pdf-to-png": {
        title: "PDF to PNG Free — Convert Each Page to PNG",
        description: "Convert every PDF page to a lossless PNG at 150, 220 or 300 DPI. Multi-page files download as a ZIP. Free, and nothing is uploaded.",
        keywords: [
            "pdf to png", "convert pdf to transparent png", "extract pdf as hq png", "pdf page to png 300 dpi",
            "high resolution pdf to png online", "save pdf as transparent image", "pdf to png for design",
            "batch convert pdf to png zip", "extract graphics from pdf as png"
        ],
        h1: "PDF to PNG — Convert PDF Pages to PNG Images",
        faqs: [
            {
                question: "Does it support transparent backgrounds (Alpha Channel)?",
                answer: "No. Pages are rendered onto a white background, so the PNGs are opaque. If you need a transparent logo or signature, cut it out afterwards in an image editor."
            },
            {
                question: "Can I batch convert multiple documents at once?",
                answer: "No — one PDF at a time. Every page of that PDF is converted, and two or more pages download together as a single ZIP."
            },
            {
                question: "Will the text be sharp enough for websites?",
                answer: "Choose 150, 220 (default) or 300 DPI. PNG adds no compression artifacts, so text and line art stay crisp; 300 DPI is print quality. Very large pages are capped at 8,000 pixels on the long side."
            }
        ],
        howToSteps: [
            { name: "Upload", text: "Select your PDF document." },
            { name: "Convert", text: "Each page is rendered in your browser and saved as a PNG." },
            { name: "Download", text: "One page downloads as a PNG; two or more pages download as a ZIP." }
        ]
    },
    "text-to-pdf": {
        title: "Text to PDF Free Online — Convert TXT Files to PDF",
        description: "Turn a .txt file into a clean, paginated A4 PDF, one line of text per line of the file. Free, private, no sign-up, nothing uploaded.",
        keywords: [
            "text to pdf", "convert txt to pdf", "make pdf from text", "professional text to pdf online free",
            "txt to pdf formatting", "save code as pdf", "convert logs to pdf",
            "clean document from text file"
        ],
        h1: "Text to PDF - Clean & Professional Generation",
        faqs: [
            {
                question: "Can I customize the font and formatting?",
                answer: "No. Text is set in 12 pt Helvetica on A4 pages with 50-point margins, one PDF line for each line of your file. There are no font, spacing or margin settings."
            },
            {
                question: "Is it suitable for saving code or server logs?",
                answer: "For short lines, yes. Each line is cut off after 90 characters rather than wrapped, and the font is proportional, so column alignment isn't kept. Leading spaces are kept."
            },
            {
                question: "Does it handle very large text files?",
                answer: "Yes. Long files run onto as many A4 pages as needed. One limit: the font covers Western (Latin) characters only, so text containing Chinese, Cyrillic, emoji and similar characters can't be converted."
            }
        ],
        howToSteps: [
            { name: "Upload", text: "Choose a .txt file from your device." },
            { name: "Convert", text: "Click Convert to PDF; the text is laid out line by line on A4 pages." },
            { name: "Download", text: "Save your clean, paginated PDF document." }
        ]
    },
    "pdf-to-text": {
        title: "PDF to Text — Extract Text From PDF Free",
        description: "Pull the real text out of any PDF that has a text layer, instantly, in your browser. Scanned image-only PDFs need OCR first and will come out empty.",
        keywords: [
            "pdf to text", "extract text from pdf", "convert pdf to txt", "pdf text extractor",
            "copy paste text from pdf", "pdf text extraction online", "unlock copyable text pdf",
            "pdf to plain text", "extract text no garble"
        ],
        h1: "PDF to Text - Extract Text From PDF",
        faqs: [
            {
                question: "Will the text come out in the correct order for multi-column layouts?",
                answer: "Usually, but not guaranteed. The extractor follows the PDF's internal text order, which lines up with visual reading order for most documents but can get confused by complex multi-column layouts."
            },
            {
                question: "Does it work with scanned receipts and faded documents?",
                answer: "No — this tool reads the text layer already embedded in a PDF. Scanned or image-only PDFs have no text layer, so nothing will be extracted. Convertify has no OCR, so a scan needs a separate OCR tool first."
            },
            {
                question: "Can I extract data from tables into a text format?",
                answer: "The tool pulls the raw text runs from the PDF, so simple tables often come out reasonably readable, but column alignment isn't specially preserved."
            },
            {
                question: "Is my data private during extraction?",
                answer: "100% private. Text extraction happens entirely in your browser. Your files are never uploaded to our servers."
            }
        ],
        howToSteps: [
            { name: "Upload", text: "Select your PDF file." },
            { name: "Extract", text: "Convertify reads the embedded text layer directly in your browser." },
            { name: "Download", text: "Copy the text or save it as a .txt file instantly." }
        ]
    },
    "powerpoint-to-pdf": {
        title: "PowerPoint to PDF Free — Convert PPTX Slides to PDF",
        description: "Convert PPT and PPTX presentation slides to high-quality PDF in your browser. Preserve layouts and slide graphics with zero uploads.",
        keywords: [
            "powerpoint to pdf", "ppt to pdf", "pptx to pdf", "convert powerpoint to pdf", "save ppt as pdf",
            "ppt to pdf high resolution", "powerpoint to pdf converter free", "ppt to pdf preserve layout",
            "slides to pdf online", "convert pptx to pdf for printing"
        ],
        h1: "Convert PowerPoint to PDF Free Online",
        faqs: [
            {
                question: "Will my slide layout and fonts stay the same?",
                answer: "Yes, our engine ensures 100% fidelity. Your fonts, background graphics, and element placement are locked in exactly as they appeared in PowerPoint."
            },
            {
                question: "Is the output PDF high resolution for printing?",
                answer: "Absolutely. We preserve the original resolution of your slide images, making the resulting PDF suitable for professional printing and large-scale projection."
            },
            {
                question: "Are clickable links in my slides preserved?",
                answer: "Yes, any hyperlinks or internal slide links in your PowerPoint file remain fully functional in the final PDF document."
            }
        ],
        howToSteps: [
            { name: "Upload PowerPoint", text: "Select your PPT or PPTX file." },
            { name: "Convert", text: "We turn your slides into PDF pages." },
            { name: "Download", text: "Save your presentation as a PDF." }
        ]
    },

    "pdf-to-word": {
        title: "PDF to Word Free — Editable DOCX, No Sign-Up",
        description: "Convert a PDF's text into an editable Word (.docx) file free. Works on digitally-created PDFs; layout, images and fonts are not reproduced.",
        keywords: [
            "convertify pdf to word", "pdf to word", "pdf to docx", "convert pdf to word", "editable pdf to word", "pdf to word converter free",
            "convert pdf to editable docx", "pdf to word converter no sign up", "make pdf editable in word",
            "convertify free pdf to word", "pdf to word online free no download"
        ],
        h1: "Convertify PDF to Word - Free & Private",
        faqs: [
            {
                question: "Will the Word document look like my original PDF?",
                answer: "The text content converts accurately, but this tool extracts text only — images, exact fonts, and complex multi-column layouts are not preserved. Treat the output as an editable starting point, not a pixel-perfect copy."
            },
            {
                question: "Can I edit the text in the converted Word file?",
                answer: "Yes. The output is a standard .docx, ready to edit in Word, Google Docs, or LibreOffice. Each line of the PDF becomes its own paragraph, with a page break between PDF pages, so you may want to join lines back into full paragraphs."
            },
            {
                question: "Does it work on scanned PDFs?",
                answer: "No — this tool reads the text layer already embedded in a PDF. Scanned or image-only PDFs have no text layer, so nothing will be extracted. Convertify has no OCR, so a scan needs a separate OCR tool first."
            }
        ],
        howToSteps: [
            { name: "Upload PDF", text: "Drag and drop your PDF (must have a text layer, not a scanned image)." },
            { name: "Convert to DOCX", text: "We extract the text from every page and build an editable Word document." },
            { name: "Download", text: "Get your Word file instantly." }
        ]
    },


    "add-page-numbers": {
        title: "Add Page Numbers to PDF — Free Online",
        description: "Insert sequential page numbers into a PDF. Choose one of six positions and the starting number. Free, no sign-up, no watermark, nothing uploaded.",
        keywords: [
            "add page numbers to pdf", "page numbering pdf", "number pdf pages", "pdf page numbers free online",
            "add page numbers to pdf online free", "insert page numbers in pdf", "pdf numbering tool",
            "footer page numbers pdf", "header page numbers pdf", "custom start page number pdf"
        ],
        h1: "Add Page Numbers to PDF - Six Positions, Any Start Number",
        faqs: [
            {
                question: "Can I skip the cover page and start numbering from page 2?",
                answer: "Not in one step: every page gets a number. Split off the cover with Split PDF, number the rest (starting at 2 if you like), then merge the cover back with Merge PDF."
            },
            {
                question: "Can I add numbers to multiple PDFs as one continuous set?",
                answer: "Merge them into one PDF first and number that, or number each file separately and set the starting number of the second file to continue from the first (for example, start at 11)."
            },
            {
                question: "Is this suitable for legal Bates numbering?",
                answer: "No. The tool adds plain numbers (1, 2, 3...) with no prefix or zero-padding, so it doesn't meet Bates numbering requirements."
            },
            {
                question: "Will adding numbers mess up my document's text?",
                answer: "No. Each number is drawn as a small piece of text on top of the page, 20 points in from the edge. Your original layout, images and text are untouched."
            }
        ],
        howToSteps: [
            { name: "Upload", text: "Select your PDF file." },
            { name: "Configure", text: "Pick one of six positions and the number to start from." },
            { name: "Apply", text: "Download your numbered document." }
        ]
    },
    "compare-pdf": {
        title: "Compare PDF Free Online — Find Differences Between Two PDFs",
        description: "Compare two PDFs page by page: view them side by side or overlaid, and get a list of added and removed text. 100% private, in your browser.",
        keywords: [
            "compare pdf", "pdf diff", "compare two pdfs", "find changes in pdf", "pdf comparison tool online",
            "side by side pdf comparison", "highlight differences pdf", "compare document versions",
            "legal document comparison free", "pdf text diff"
        ],
        h1: "Compare PDF Documents Free Online",
        faqs: [
            {
                question: "Does it detect more than just text changes?",
                answer: "Only text is compared automatically. Layout, image and font changes aren't detected, but the side-by-side and overlay views let you check those by eye, page by page."
            },
            {
                question: "Can I see a summary of all modifications?",
                answer: "Yes. After comparison you get counts of additions and deletions, a list of the changed text by page, and a downloadable .txt report."
            },
            {
                question: "Is it suitable for comparing legal contracts?",
                answer: "As a first pass, yes. A changed word or figure flags the whole line of text it sits in. Pages are compared 1 to 1, 2 to 2 and so on, so text that moved to another page shows as removed and added, and reordering within a page isn't flagged. Read the flagged lines yourself before signing."
            },
            {
                question: "Will my confidential documents be uploaded?",
                answer: "No. Comparison happens locally in your browser session. Your documents are never sent to a server, ensuring absolute privacy for your sensitive contract data."
            }
        ],
        howToSteps: [
            { name: "Upload Docs", text: "Select the original and the revised PDF files." },
            { name: "Analyze", text: "Convertify reads the text on each page and lists the lines that differ." },
            { name: "Review & Export", text: "Step through the pages side by side and download the text report." }
        ]
    },
    "crop-pdf": {
        title: "Crop PDF Free Online — Trim Margins and Page Borders",
        description: "Trim margins, remove white space, and crop PDF pages with visual live preview. No watermark, free, and runs entirely in your browser.",
        keywords: [
            "crop pdf", "trim pdf", "cut pdf pages", "crop pdf online free", "remove pdf margins", "trim pdf borders",
            "pdf cropper online", "resize pdf pages", "cut pdf margins free", "crop pdf pages online",
            "private margin trimmer", "crop scanned document"
        ],
        h1: "Crop PDF Pages Free Online",
        faqs: [
            {
                question: "Is the content outside the crop box actually trimmed?",
                answer: "No, it's hidden rather than deleted. Convertify sets each page's CropBox, so viewers show only your chosen area, but the content outside it stays in the file and can be brought back with a PDF editor. To remove sensitive information for good, use Redact PDF."
            },
            {
                question: "Can I crop all pages at once?",
                answer: "Yes. You can adjust the margin sliders to apply consistent padding or trims across every page of your PDF in one click."
            },
            {
                question: "Does it work well for scanned documents?",
                answer: "Yes. The preview shows your margins on the page so you can line them up with the text block. The same margins apply to every page, so scans where the text sits in different places may need a looser crop."
            },
            {
                question: "Will this reduce the file's visual quality?",
                answer: "No. Cropping adjusts the display boundary without re-compressing your images or fonts, keeping your document at maximum original fidelity."
            }
        ],
        howToSteps: [
            { name: "Upload", text: "Select the PDF file you wish to trim." },
            { name: "Adjust Margins", text: "Use the sliders or presets to trim top, bottom, left, and right borders." },
            { name: "Download", text: "Save your cropped PDF instantly with zero watermarks." }
        ]
    },
    "edit-pdf": {
        title: "Edit PDF Free Online — Add Text, Annotate & Draw on PDFs",
        description: "Free in-browser PDF annotator. Type text onto pages, draw freehand, and add highlight and outline boxes. No watermark, no install, no upload.",
        keywords: [
            "convertify pdf editor", "edit pdf", "pdf editor online", "add text to pdf", "annotate pdf", "edit pdf online free", "pdf editor free no sign up",
            "write on pdf online", "pdf annotation tool", "free pdf editor no watermark",
            "flatten pdf edits", "type on pdf", "markup pdf online", "add comments to blueprint pdf", "free pdf markup tool",
            "convertify edit pdf", "edit pdf free no download"
        ],
        h1: "Free Online PDF Editor — Add Text & Annotate in Your Browser",
        faqs: [
            {
                question: "What editing features are supported?",
                answer: "You can place new text (four sizes, five colours), draw freehand, and drop fixed-size highlight and outline boxes onto your pages. Text already in the PDF can't be changed, and the editor needs a mouse; touch screens aren't supported yet."
            },
            {
                question: "What does 'Flatten PDF' mean?",
                answer: "Flattening embeds your added text and drawings directly into the PDF's vector layer, ensuring they render identically across all PDF readers."
            },
            {
                question: "Is there a watermark after I export my edits?",
                answer: "Never. Convertify is 100% free and does not add watermarks or branding to your edited documents."
            },
            {
                question: "Do I need to sign up to save my work?",
                answer: "No. Just upload, edit, and download. We don't require an account or email, keeping your editing workflow fast and private."
            }
        ],
        howToSteps: [
            { name: "Upload PDF", text: "Open your PDF in our browser-based editor." },
            { name: "Add Content", text: "Add text, freehand drawings, highlights, or boxes to any page." },
            { name: "Export & Save", text: "Download your completed, edited PDF document instantly." }
        ]
    },
    "ocr-pdf": {
        title: "Scan Documents to PDF Online — Free Camera Scanner",
        description: "Scan paper with your phone or webcam. The page edges are found and straightened, a B&W or color filter applied, and every page saved as one PDF.",
        keywords: [
            "document scanner online", "scan document to pdf", "camera to pdf", "phone scanner pdf", "scan paper to pdf free",
            "webcam document scanner", "photo to scanned pdf", "black and white scan filter", "multi page scan to pdf",
            "camscanner alternative", "scan receipts to pdf", "scan without app"
        ],
        h1: "Document Scanner — Scan Paper to PDF with Your Camera",
        faqs: [
            {
                question: "How does the document scanner work?",
                answer: "Point your phone or webcam at a page. The scanner outlines the page edges live; when you tap the shutter it crops and straightens the page, applies the filter you picked, and adds it to your document. Repeat for each page, then save them all as one PDF."
            },
            {
                question: "Does it recognize the text (OCR)?",
                answer: "No. Scanned pages are saved as images, so the text in the PDF is not searchable or copyable. If you add a PDF that already has a text layer, Copy text returns that existing text."
            },
            {
                question: "Can I scan photos I already took?",
                answer: "Yes. Add images or PDF pages from your files, then apply the Xerox B&W, Magic Color, Grayscale or Original filter and rotate pages. Automatic edge cropping only runs on live camera captures."
            },
            {
                question: "Is my scanned document uploaded to any cloud server?",
                answer: "No. The camera feed and your pages are processed in your browser. Confidential receipts, medical forms, and contracts stay on your device."
            }
        ],
        howToSteps: [
            { name: "Open the camera", text: "Allow camera access, or add photos or PDF pages from your files." },
            { name: "Capture pages", text: "Hold the page in view until the edge outline locks on, then tap the shutter. Repeat for each page." },
            { name: "Save as PDF", text: "Pick a filter, rotate or delete pages, then save every page as one PDF." }
        ]
    },
    "organize-pdf": {
        title: "Organize PDF Pages Free — Reorder & Delete",
        description: "Rearrange, rotate and delete PDF pages in a visual grid. Handles long documents easily. Free, no sign-up, and nothing is uploaded.",
        keywords: [
            "organize pdf", "reorder pdf pages", "delete pdf pages", "move pdf pages", "remove pages from pdf",
            "rearrange pdf pages online free", "pdf page organizer", "reorder pages in pdf", "delete pages from pdf free",
            "pdf page manager", "visual pdf sorter", "organize large pdf documents"
        ],
        h1: "Organize PDF - Visual Grid & Page Management",
        faqs: [
            {
                question: "How do I manage a very large PDF with 100+ pages?",
                answer: "Every page appears as a thumbnail in a grid. Pages move one position at a time with the arrow buttons, so for big moves across a long document it is quicker to split it into parts and merge them back in the order you need."
            },
            {
                question: "Can I rotate individual pages while organizing?",
                answer: "Yes. Each page thumbnail has its own controls to rotate it 90° or delete it, so you can fix orientations while you sort the document."
            },
            {
                question: "Is there a limit on how many pages I can reorder?",
                answer: "There is no page limit; each file can be up to 200 MB. Every page is drawn as a thumbnail when the file opens, so documents with hundreds of pages take a little longer to load."
            },
            {
                question: "What happens to the page links when I reorder?",
                answer: "The pages are copied into a new file in your chosen order, so bookmarks are not carried over and internal links may stop working. The content of each page is unchanged."
            }
        ],
        howToSteps: [
            { name: "Upload", text: "Open your document in the visual organizer." },
            { name: "Sort & Fix", text: "Use the arrows to reorder, click to rotate, or delete pages." },
            { name: "Download", text: "Save your perfectly structured PDF." }
        ]
    },
    "pdf-to-excel": {
        title: "PDF to Excel Free — Convert PDF Tables to XLSX Spreadsheet",
        description: "Pull the text of a PDF into an Excel (.xlsx) file: each line becomes a row, one sheet per page. Needs selectable text (no OCR). Nothing uploaded.",
        keywords: [
            "convertify pdf to excel", "pdf to excel", "pdf to xlsx", "convert pdf to excel", "extract table from pdf", "pdf to excel converter free",
            "bank statement to excel", "invoice to excel converter", "pdf to excel accurate layout",
            "scanned pdf to excel ocr", "convert pdf table to spreadsheet", "pdf to excel no sign up",
            "pdf to excel free online", "convert pdf to excel free"
        ],
        h1: "Convert PDF to Excel Free Online (XLSX)",
        faqs: [
            {
                question: "How well does it handle bank statements?",
                answer: "It reads the PDF's text line by line: each line becomes a row and each separate piece of text on that line becomes a cell. Simple, well-spaced tables usually come out usable, but empty cells aren't detected, so columns can shift and may need tidying in Excel."
            },
            {
                question: "Does it work on scanned PDF invoices?",
                answer: "No. There is no OCR, so scanned or image-only PDFs have no text to read and give an empty result."
            },
            {
                question: "Will it merge all pages into one sheet?",
                answer: "No. Each PDF page becomes its own sheet (Page 1, Page 2, …). Copy the sheets together in Excel if you need one continuous table."
            }
        ],
        howToSteps: [
            { name: "Upload PDF", text: "Select or drag your PDF file. It needs selectable text; scans won't work." },
            { name: "Extract", text: "Each line of text becomes a row and each piece of text on that line becomes a cell." },
            { name: "Download", text: "Get your XLSX file." }
        ]
    },
    "excel-to-pdf": {
        title: "Excel to PDF — Convert XLS & XLSX Free, No Upload",
        description: "Convert Excel (XLS or XLSX) to PDF in your browser. Every column kept, long text wrapped. No Microsoft Excel, no watermark, nothing uploaded.",
        keywords: [
            "excel to pdf", "xlsx to pdf", "xls to pdf", "convert excel to pdf",
            "excel to pdf converter", "excel to pdf free", "convert xlsx to pdf",
            "xls to pdf converter", "xlsx to pdf converter", "xls to pdf online", "xlsx to pdf online",
            "xls to pdf free", "xlsx to pdf free", "convert xls to pdf online free",
            "excel to pdf converter free online", "xls to pdf no sign up",
            "excel file convert to pdf", "xls convert to pdf", "convert excel spreadsheet to pdf",
            "spreadsheet to pdf", "convert workbook to pdf", "excel to pdf without excel",
            "excel to pdf no microsoft office", "financial report to pdf", "invoice excel to pdf",
            "convert excel to pdf free", "convert excel to pdf online", "excel to pdf convert",
            "excel to pdf convertor", "excel pdf converter",
            "best excel to pdf converter", "best excel to pdf converter free"
        ],
        h1: "Excel to PDF — Convert XLS & XLSX Spreadsheets Online",
        faqs: [
            {
                question: "How do I convert Excel or XLSX to PDF for free?",
                answer: "Drop an .xlsx or .xls file, pick the sheet if the workbook has more than one, then convert. Cell values are laid out as a clean table in the PDF. No Microsoft Excel, no sign-up, nothing uploaded."
            },
            {
                question: "Do I need Microsoft Excel installed to convert?",
                answer: "No. Conversion runs in your browser on Windows, Mac, or a phone. You do not need Excel or Microsoft Office installed."
            },
            {
                question: "Will my charts and formatting be preserved?",
                answer: "No. This is a values-only export: you get the numbers and text from the sheet, not charts, colors, borders, or formulas. For a pixel-accurate copy of a formatted spreadsheet, use Excel’s own File → Export → Create PDF."
            },
            {
                question: "What's the difference between XLS and XLSX?",
                answer: "XLS is the older Excel format (pre-2007) and XLSX is the modern one. Both are accepted. Every column is included: wide sheets get a smaller font, and columns that still don't fit continue on the next page. Long cell text wraps instead of being cut off."
            },
            {
                question: "Is it safe for financial spreadsheets?",
                answer: "Yes. The file is read in your browser and never uploaded. That makes it suitable for invoices, budgets, and other numbers you would not send to a random converter."
            }
        ],
        howToSteps: [
            { name: "Drop your spreadsheet", text: "Select an XLS or XLSX file. It is read in your browser — nothing is uploaded." },
            { name: "Pick the sheet", text: "If the workbook has several tabs, choose one. A preview of the first ten rows appears first." },
            { name: "Download the PDF", text: "Cell values are drawn as a table. No watermark, no Microsoft Excel needed." }
        ]
    },

    "pdf-to-pdfa": {
        title: "PDF to PDF/A Free — Convert to Archival Format (ISO 19005)",
        description: "Convert documents to ISO 19005-compliant PDF/A format for long-term archiving, court submissions, and official legal filings.",
        keywords: [
            "pdf to pdf/a", "pdf archive format", "convert to pdfa", "iso 19005 compliant pdf", "long term pdf preservation",
            "archive legal documents pdf/a", "pdf/a-1b converter", "pdf/a-2b compliant online", "archival quality pdf export",
            "preservation format pdf", "research paper archiving", "government compliant pdf/a"
        ],
        h1: "Convert PDF to PDF/A for Long-Term Archiving",
        faqs: [
            {
                question: "Why should I use PDF/A instead of standard PDF?",
                answer: "PDF/A is an ISO-standardized version of the PDF format specifically designed for long-term archiving. It ensures your document will look identical decades from now, regardless of the software or OS used."
            },
            {
                question: "Does it embed all fonts and metadata?",
                answer: "Yes. Our converter automatically embeds all fonts, identifies color profiles, and validates metadata to ensure full compliance with PDF/A-1b or PDF/A-2b standards."
            },
            {
                question: "Is this required for legal and academic submissions?",
                answer: "Many courts, libraries, and government agencies (like the USPTO) require PDF/A format for official filings to ensure the documents remain accessible in perpetuity."
            }
        ],
        howToSteps: [
            { name: "Upload", text: "Select the PDF file you wish to archive." },
            { name: "Validate", text: "Our engine checks compliance and optimizes the file for long-term storage." },
            { name: "Download", text: "Save your ISO-compliant PDF/A file." }
        ]
    },
    "pdf-to-powerpoint": {
        title: "PDF to PowerPoint Free — Convert PDF Pages to PPTX Slides",
        description: "Turn each PDF page into a full-slide, high-resolution image in a 16:9 PowerPoint (.pptx) file. Opens in PowerPoint and Google Slides. No upload.",
        keywords: [
            "pdf to powerpoint", "convert pdf to pptx", "pdf to slides", "pdf to ppt converter online free",
            "turn pdf into presentation", "extract slides from pdf", "pdf to powerpoint for teachers",
            "present pdf in powerpoint"
        ],
        h1: "Convert PDF to PowerPoint Free Online (PPTX)",
        faqs: [
            {
                question: "Are the text boxes actually editable after conversion?",
                answer: "No. Each PDF page becomes one picture filling the slide, so the text can't be edited in PowerPoint. You can add new text boxes, notes and animations on top, or reorder and delete slides."
            },
            {
                question: "Will equations, charts and images look right?",
                answer: "Yes, as pictures: each page is rendered at about 1920 pixels wide, so equations and charts look the same as in the PDF. Slides are 16:9, and pages of another shape (such as A4 portrait) are stretched to fill the slide."
            },
            {
                question: "Can I open the resulting file in Google Slides?",
                answer: "Yes. The .pptx opens in Microsoft PowerPoint and Google Slides, and in other apps that read PowerPoint files."
            }
        ],
        howToSteps: [
            { name: "Upload", text: "Select the PDF presentation you want to convert." },
            { name: "Convert", text: "Each page is rendered as a high-resolution image and placed on its own slide." },
            { name: "Download", text: "Save the PPTX file and open it in PowerPoint or Google Slides." }
        ]
    },
    "redact-pdf": {
        title: "Redact PDF Free Online — Permanently Blackout Sensitive Text",
        description: "Permanently blackout sensitive information, SSNs, and personal data from PDF documents. True data-level redaction with zero file uploads.",
        keywords: [
            "redact pdf", "blackout text pdf", "hide pdf info", "secure pdf redaction online", "permanently remove text from pdf",
            "sanitize pdf metadata", "remove pii from document", "legal redaction tool free", "unrecoverable pdf blackout",
            "clean sensitive data pdf", "protect privacy in pdf", "redact ssn from forms", "pci compliance redaction"
        ],
        h1: "Redact PDF - Permanently Blackout Sensitive Data Online",
        faqs: [
            {
                question: "Is the black box removable by others later?",
                answer: "No. Every page you redact is rebuilt as an image with the boxes burned in, so the text underneath is removed from the file. It can't be selected, copied, or recovered. Pages without boxes are left exactly as they were."
            },
            {
                question: "Can I choose between blackout or whiteout redaction?",
                answer: "Yes! You can choose solid black boxes for traditional legal redaction, or whiteout boxes to seamlessly mask out unwanted elements."
            },
            {
                question: "Is this suitable for legal or government filings?",
                answer: "Absolutely. Redactions are irreversible once downloaded, protecting sensitive social security numbers, medical records, and financial figures."
            },
            {
                question: "Are my files uploaded to any server?",
                answer: "No. All redaction processing is 100% client-side in your browser. Your sensitive files never leave your computer."
            }
        ],
        howToSteps: [
            { name: "Upload Document", text: "Open your PDF document in our browser-based tool." },
            { name: "Draw Redaction Boxes", text: "Click and drag over any sensitive text or images you want to blackout." },
            { name: "Download Redacted PDF", text: "Permanently apply the redactions and save your sanitized PDF." }
        ]
    },
    "repair-pdf": {
        title: "Repair PDF Free Online — Fix Damaged or Corrupted PDF Files",
        description: "Fix corrupt, cut-off or broken PDF documents. Rebuilds a damaged file structure and recovers every readable page, right in your browser.",
        keywords: [
            "repair pdf", "fix corrupt pdf", "recover pdf", "repair corrupted pdf file online free", "fix damaged pdf",
            "pdf repair tool", "recover data from pdf", "broken pdf fix", "pdf won't open fix", "corrupted pdf recovery",
            "fix pdf header error", "reconstruct damaged pdf", "restore broken pdf pages"
        ],
        h1: "Repair Corrupted PDF Files Free Online",
        faqs: [
            {
                question: "Can it fix 'File is not a valid PDF' errors?",
                answer: "Often. Many of these errors come from a file that was cut off or has a damaged trailer or cross-reference section. Convertify scans for the objects that are still intact, writes a fresh trailer and copies the readable pages into a new PDF. If that fails, it saves each page that can still be drawn as an image."
            },
            {
                question: "Will it recover my pages and text?",
                answer: "It recovers every page it can still read, and tells you how many that was. Usually text, fonts and images come back intact; if the file is too damaged for that, readable pages are saved as images, so their text is no longer selectable. Pages whose data is lost are left out."
            },
            {
                question: "Is it safe to repair confidential files?",
                answer: "100% safe. The repair algorithm executes locally in your browser memory. Your corrupted files are never uploaded to any remote server."
            }
        ],
        howToSteps: [
            { name: "Upload Damaged PDF", text: "Select the corrupted PDF file that cannot be opened." },
            { name: "Rebuild Structure", text: "Convertify rebuilds the damaged structure and copies every readable page into a fresh PDF." },
            { name: "Download Repaired File", text: "Save your recovered, readable PDF document." }
        ]
    },
    "sign-pdf": {
        title: "Sign PDF Free Online — Draw, Type or Stamp Your Signature",
        description: "Electronically sign PDF documents online for free. Draw your signature, type cursive signatures, or stamp image signatures on any page.",
        keywords: [
            "convertify sign pdf", "sign pdf", "e-sign pdf", "digital signature", "sign pdf online free", "electronic signature pdf", "add signature to pdf",
            "pdf signature tool", "sign documents online free", "e-signature free", "draw signature on pdf",
            "sign real estate contract pdf", "flatten signed pdf",
            "sign on mobile finish on pc", "private electronic signatures", "sign pdf free no download"
        ],
        h1: "Sign PDF Free Online - Electronic Signature Tool",
        faqs: [
            {
                question: "What signing options are supported?",
                answer: "You can draw your signature with a mouse, touch, or stylus, type your name in a handwriting-style font, or upload a PNG image of your signature."
            },
            {
                question: "Can I place the signature on any page?",
                answer: "Yes. Pick the page, place the signature, and drag it into position with a mouse. The signature box has a fixed size, and you can place as many signatures as you need across different pages."
            },
            {
                question: "Is my signature saved on your servers?",
                answer: "Never. Your signature is rendered strictly in your browser session. Convertify stores zero signatures and zero files on servers."
            }
        ],
        howToSteps: [
            { name: "Upload PDF", text: "Select the document you need to sign." },
            { name: "Create Signature", text: "Draw, type, or upload your signature." },
            { name: "Place & Download", text: "Position your signature on the page and download your signed document." }
        ]
    },
    "rotate-pdf": {
        title: "Rotate PDF Free — Fix Page Orientation & Save",
        description: "Rotate PDF pages 90, 180 or 270 degrees to fix sideways or upside-down scans. Free, no watermark, no download, nothing uploaded.",
        keywords: ["convertify rotate pdf", "rotate pdf", "turn pdf pages", "rotate pdf 90 degrees", "flip pdf", "rotate scanned document", "pdf page orientation", "rotate pdf online free", "rotate pdf free no download"],
        h1: "Convertify Rotate PDF - Fix Page Orientation Free",
        faqs: [
            { question: "Can I rotate specific pages only?", answer: "Yes. Untick 'Apply to all pages' and type the pages to rotate, such as 1,3,5-7, or rotate every page at once. Perfect for fixing scanned documents where some pages are sideways." },
            { question: "What rotation angles are supported?", answer: "90°, 180° or 270° clockwise. 270° is the same as 90° counter-clockwise, and 180° flips a page upside down." },
            { question: "Will rotating affect the PDF quality?", answer: "No, rotation is a lossless operation. Your text, images, and formatting remain exactly the same, just oriented differently." },
            { question: "Can I rotate a scanned document?", answer: "Absolutely! Scanned documents often come out sideways. Our tool fixes this instantly without any quality loss." }
        ],
        howToSteps: [
            { name: "Upload Your PDF", text: "Select or drag and drop the PDF file you need to rotate. Works with any PDF, including scanned documents." },
            { name: "Select Pages & Rotation", text: "Pick the angle (90°, 180° or 270° clockwise), then rotate all pages or type the page numbers to change." },
            { name: "Download Rotated PDF", text: "Click 'Rotate' and download your correctly oriented PDF instantly. No watermarks!" }
        ]
    },
    "protect-pdf": {
        title: "Protect PDF Free Online — Add Password Encryption to PDF",
        description: "Protect PDF files with AES-256 password encryption. Anyone opening the file must enter your password. 100% private, in your browser.",
        keywords: [
            "convertify protect pdf", "password protect pdf", "encrypt pdf", "secure pdf", "lock pdf", "pdf password", "protect pdf online free",
            "add password to pdf", "pdf encryption", "aes-256 pdf protection", "secure pdf for email",
            "bank grade pdf security",
            "private pdf protector", "client side pdf encryption", "secure financial documents", "protect legal pdfs"
        ],
        h1: "Password Protect PDF Free Online",
        faqs: [
            {
                question: "What encryption standard is used?",
                answer: "Convertify uses standard AES-256 encryption (PDF 2.0 / ISO 32000 compliant), the same high-security standard used by Adobe Acrobat, banking institutions, and government agencies."
            },
            {
                question: "Is it safe to type my password on this page?",
                answer: "Yes, 100% safe. Encryption happens entirely within your web browser using WebCrypto. Neither your password nor your document is ever transmitted across the internet."
            },
            {
                question: "Will the password be required to open the document?",
                answer: "Yes. Once encrypted, any PDF reader (Adobe Acrobat, Chrome, Apple Preview, Foxit) will prompt the viewer to enter the password before displaying the content."
            }
        ],
        howToSteps: [
            { name: "Upload PDF", text: "Choose or drag the PDF you want to protect." },
            { name: "Set Password", text: "Enter a strong password and check password strength." },
            { name: "Encrypt & Download", text: "Click protect and download your secure AES-256 encrypted PDF." }
        ]
    },
    "unlock-pdf": {
        title: "Unlock PDF Free Online — Remove Password & Restrictions",
        description: "Unlock password-protected PDFs and remove printing, copying, and editing restrictions. Fast, free, and processed entirely on your device.",
        keywords: [
            "convertify unlock pdf", "unlock pdf", "remove pdf password", "pdf password remover", "unprotect pdf",
            "decrypt pdf", "unlock pdf online free", "remove pdf security", "unlock pdf free no download"
        ],
        h1: "Unlock PDF - Remove Password Security Online",
        faqs: [
            {
                question: "How does the PDF unlocker work?",
                answer: "Our tool decrypts the document using standard security handlers and removes owner restrictions on printing, copying, and modifying, re-saving a clean unlocked PDF."
            },
            {
                question: "Do I need to know the password?",
                answer: "If the PDF is protected by an open/user password, you will be prompted to enter it once so our client engine can decrypt the stream and produce an unrestricted copy. If it only has permissions restrictions, it unlocks automatically."
            },
            {
                question: "Are my unlocked documents stored anywhere?",
                answer: "No. All decryption runs locally in your browser memory. Your documents and passwords are never uploaded or recorded anywhere."
            }
        ],
        howToSteps: [
            { name: "Upload Protected PDF", text: "Select your password-protected or restricted PDF." },
            { name: "Unlock Document", text: "Enter password if required, or let Convertify strip permission restrictions." },
            { name: "Download Free", text: "Save your fully unlocked PDF with unrestricted access." }
        ]
    },
    "watermark-pdf": {
        title: "Watermark PDF Free — Add a Text Watermark to Every Page",
        description: "Stamp text diagonally across every page of a PDF. Choose the wording, size, color and opacity. Free, no sign-up, and your file never leaves your browser.",
        keywords: [
            "watermark pdf", "add watermark to pdf", "pdf watermark online", "stamp pdf", "pdf branding",
            "confidential stamp pdf", "draft watermark pdf", "opacity control pdf watermark", "text watermark pdf",
            "diagonal watermark pdf", "soft branding pdf"
        ],
        h1: "Watermark PDF - Add a Text Stamp to Every Page",
        faqs: [
            {
                question: "Can these watermarks be easily deleted by others?",
                answer: "Yes, by someone with a capable PDF editor. The text is drawn into each page's content, so it survives viewing, forwarding and printing, but it is not locked or encrypted. Treat it as a deterrent and a status mark, not a security control."
            },
            {
                question: "Can I adjust the transparency (opacity) of the watermark?",
                answer: "Yes. You can use our 'Opacity Slider' to create subtle 'Soft Branding' or keep it fully opaque for high-security labels like 'CONFIDENTIAL'."
            },
            {
                question: "Can I upload my own company logo as a watermark?",
                answer: "Not yet. Only text watermarks are supported. You can type your company name as the watermark text instead."
            },
            {
                question: "Is there a limit on file size for watermarking?",
                answer: "Each file can be up to 200 MB. Because the PDF is processed locally there is no upload wait; very large files are limited by your device's memory."
            }
        ],
        howToSteps: [
            { name: "Upload", text: "Select the PDF you want to watermark." },
            { name: "Design", text: "Type your text, then set the font size, colour and opacity." },
            { name: "Apply", text: "Click Add Watermark and download the stamped PDF." }
        ]
    },
    "html-to-pdf": {
        title: "HTML to PDF — Paste Your Code, Get a PDF",
        description: "Paste HTML source and download it as a PDF. Text content is extracted and paginated on clean pages; CSS layout and images are not rendered.",
        keywords: [
            "html to pdf", "convert html to pdf", "html code to pdf", "html to pdf online free",
            "paste html to pdf", "html snippet to pdf", "html to pdf converter free"
        ],
        h1: "HTML to PDF Converter",
        faqs: [
            {
                question: "Does it preserve clickable links from the original HTML?",
                answer: "No. This tool extracts the plain text from your HTML and lays it out on the page — links, images, and CSS styling are not carried over to the PDF."
            },
            {
                question: "Can it handle complex CSS and modern layouts?",
                answer: "No — this is a text-only converter. It strips HTML tags and lays out the remaining text on paginated pages. For a pixel-perfect visual capture of a real page, use your browser's built-in Print → Save as PDF."
            },
            {
                question: "Can I convert a live web page by URL?",
                answer: "Not currently. Browsers block client-side tools from fetching another site's content (CORS), so paste the HTML source directly instead."
            }
        ],
        howToSteps: [
            { name: "Paste HTML", text: "Paste your HTML source code into the text box." },
            { name: "Convert", text: "Convertify strips the markup and lays the text out on paginated pages." },
            { name: "Download", text: "Save your PDF document." }
        ]
    },
    "delete-pdf-pages": {
        title: "Delete PDF Pages Online Free — Remove Pages, No Upload",
        description: "Remove unwanted pages from a PDF in your browser. See every page as a thumbnail, delete the ones you don't need, download the new file. Free, no upload.",
        keywords: [
            "delete pdf pages", "remove pages from pdf", "pdf page remover", "cut pdf pages online free",
            "remove unwanted pdf pages", "delete blank pages from pdf", "secure pdf page deletion",
            "reduce pdf size by deleting pages", "remove confidential pages from pdf online"
        ],
        h1: "Delete Pages from a PDF",
        faqs: [
            {
                question: "Is the content of deleted pages permanently gone?",
                answer: "Yes. The new file is built only from the pages you keep, so deleted pages and their content are not in the downloaded PDF."
            },
            {
                question: "Will deleting pages mess up the remaining document's formatting?",
                answer: "No. The pages you keep are copied as they are, with their text, fonts and images unchanged."
            },
            {
                question: "Can I delete multiple pages at once?",
                answer: "Yes. Click Delete on every page you want gone in the thumbnail grid, then download once."
            }
        ],
        howToSteps: [
            { name: "Upload", text: "Select the PDF file you wish to clean up." },
            { name: "Select", text: "Identify the pages you want to remove using our visual thumbnails." },
            { name: "Purge & Download", text: "Delete the selected pages and save your new, smaller PDF." }
        ]
    },
    "reorder-pdf": {
        title: "Reorder PDF Pages Online Free — Rearrange Pages, No Upload",
        description: "Change the page order of a PDF in your browser. Move pages left or right, rotate or delete them, then download the rearranged file. Free, no upload.",
        keywords: [
            "reorder pdf pages", "rearrange pdf pages", "change pdf page order", "pdf page sorter online free",
            "move pdf pages around", "organize pdf pages online", "fix out of order pdf scans",
            "visual pdf page organizer"
        ],
        h1: "Reorder PDF Pages",
        faqs: [
            {
                question: "Will my document's Table of Contents still work after reordering?",
                answer: "Not always. Pages are copied into a new file in your chosen order, so bookmarks and internal links from the original may not carry over. Page content itself is unchanged."
            },
            {
                question: "How do I move a page across a large 200-page document?",
                answer: "Use the arrow buttons under each thumbnail to move a page one step at a time. For big moves, split the PDF into parts and merge them back in the order you need."
            }
        ],
        howToSteps: [
            { name: "Upload", text: "Select your PDF file and view all pages as thumbnails." },
            { name: "Rearrange", text: "Use the arrow buttons under each thumbnail to move pages into sequence." },
            { name: "Download", text: "Save your perfectly ordered PDF document." }
        ]
    },
    "svg-to-png": {
        title: "SVG to PNG Free — High-Quality Vector Export",
        description: "Rasterize SVG files to PNG at their own size or a custom size up to 8192 px. Transparency is preserved. Free, private, nothing uploaded.",
        keywords: [
            "svg to png", "convert svg to png", "svg to png converter", "svg to png online free",
            "svg to png high resolution", "svg to png transparent background", "convert svg to png 1080p",
            "vector to raster converter", "svg to png with transparency", "batch svg to png",
            "svg to png custom size", "convert svg file to png image", "svg to png no upload",
            "svg export png quality", "scalable vector to png converter"
        ],
        h1: "SVG to PNG Converter - High Resolution Export Free Online",
        faqs: [
            {
                question: "Can I set a custom resolution when converting SVG to PNG?",
                answer: "Yes. Tick 'Custom output dimensions' and enter a width and height in pixels (up to 8192 each). For a 2x or 3x export, multiply the SVG's size yourself; keep the two numbers in proportion so the drawing isn't squeezed."
            },
            {
                question: "Will my SVG transparency be preserved in the PNG?",
                answer: "Absolutely. Convertify preserves full alpha-channel transparency from your SVG, so you get a clean PNG with a transparent background ready for use in designs or presentations."
            },
            {
                question: "Is there a file size or complexity limit for SVGs?",
                answer: "Each file can be up to 200 MB. Gradients and filters render as your browser draws them. An SVG drawn as an image can't load external files, so fonts or images linked by URL fall back or go missing; embed them in the SVG first."
            }
        ],
        howToSteps: [
            { name: "Upload SVG", text: "Select or drag and drop your SVG file into the converter." },
            { name: "Set Size", text: "Keep the SVG's own size, or set a custom width and height in pixels." },
            { name: "Download PNG", text: "Click convert and save your high-quality PNG image instantly." }
        ]
    },
    "bmp-to-jpg": {
        title: "BMP to JPG Free — Convert & Shrink Bitmaps",
        description: "Convert BMP bitmaps to compressed JPG images. Adjustable quality cuts file size dramatically. Free, no sign-up, runs entirely in your browser.",
        keywords: [
            "bmp to jpg", "convert bmp to jpg", "bmp to jpeg converter", "bmp to jpg online free",
            "bitmap to jpeg", "bmp to jpg reduce file size", "convert bitmap to jpg online",
            "bmp to jpg quality settings", "batch bmp to jpg converter", "bmp to jpeg compression",
            "large bmp to small jpg", "windows bitmap to jpeg", "bmp file to jpg free",
            "convert bmp screenshot to jpg", "bmp to jpg no watermark"
        ],
        h1: "BMP to JPG Converter - Shrink Bitmaps Free Online",
        faqs: [
            {
                question: "How much smaller will my JPG be compared to the original BMP?",
                answer: "BMP files are uncompressed, so converting to JPG typically reduces file size by 90-95%. A 10 MB BMP often becomes a 300-500 KB JPG with minimal visible quality loss."
            },
            {
                question: "Can I control the JPG compression quality?",
                answer: "Yes. The quality slider runs from 70% to 100%. Higher settings (90-100%) keep more detail; the lower end produces noticeably smaller files."
            },
            {
                question: "Will the image dimensions change during conversion?",
                answer: "No. The pixel dimensions stay exactly the same — only the file format and compression change. Your image will look the same at the same resolution."
            },
            {
                question: "Can I convert multiple BMP files at once?",
                answer: "Yes, Convertify supports batch conversion. Drop all your BMP files at once; one file downloads as a JPG, several download together as a ZIP archive."
            }
        ],
        howToSteps: [
            { name: "Upload BMP", text: "Select your BMP bitmap file or drag it into the converter." },
            { name: "Adjust Quality", text: "Set your preferred JPG compression level using the quality slider." },
            { name: "Download JPG", text: "Click convert and save your compressed JPG image." }
        ]
    },
    "gif-to-png": {
        title: "GIF to PNG Free — Convert & Extract Frames",
        description: "Convert GIFs to PNG or pull individual frames out of an animated GIF. Transparency preserved, lossless output. Free and fully private.",
        keywords: [
            "gif to png", "convert gif to png", "gif to png converter online", "gif to png free",
            "extract gif frames to png", "animated gif to png frames", "gif to png transparent",
            "gif frame extractor", "gif to png lossless", "convert gif to png high quality",
            "gif to png no background", "save gif as png", "gif to png batch converter",
            "extract single frame from gif", "gif to png keep transparency"
        ],
        h1: "GIF to PNG Converter - Extract Frames Free Online",
        faqs: [
            {
                question: "Can I extract individual frames from an animated GIF?",
                answer: "Yes. Upload your animated GIF and choose \"Every frame\": each frame (up to 500) is exported as its own numbered PNG and the set downloads as a ZIP. Leave it on \"First frame only\" to get a single PNG."
            },
            {
                question: "Is the PNG output lossless compared to the GIF?",
                answer: "Yes. PNG is a lossless format, so converting from GIF preserves every pixel exactly. The colours stay the same as in the GIF; conversion doesn't add detail the GIF's 256-colour palette never had."
            },
            {
                question: "Will transparency be preserved when converting GIF to PNG?",
                answer: "Absolutely. GIF transparency is fully carried over to the PNG alpha channel. Unlike GIF, PNG supports partial transparency (semi-transparent pixels), giving you even more flexibility."
            }
        ],
        howToSteps: [
            { name: "Upload GIF", text: "Select your GIF file — static or animated." },
            { name: "Choose Frames", text: "For animated GIFs, pick First frame only or Every frame." },
            { name: "Download PNG", text: "Save your lossless PNG files instantly." }
        ]
    },
    "tiff-to-pdf": {
        title: "TIFF to PDF Free — Multi-Page Scans to PDF",
        description: "Turn single or multi-page TIFF scans into a PDF. Combine several TIFFs into one document at original quality. Free, no software to install.",
        keywords: [
            "tiff to pdf", "convert tiff to pdf", "tiff to pdf converter", "tiff to pdf online free",
            "multi page tiff to pdf", "tif to pdf converter", "tiff to pdf merge",
            "convert tiff scan to pdf", "tiff to pdf high quality", "batch tiff to pdf",
            "combine tiff files into pdf", "tiff to pdf no watermark", "multipage tiff to pdf online",
            "scanned tiff to pdf free", "tiff to pdf preserve quality"
        ],
        h1: "TIFF to PDF Converter - Multi-Page Support Free Online",
        faqs: [
            {
                question: "Can I convert a multi-page TIFF into a single PDF?",
                answer: "Yes! Convertify automatically detects all pages in a multi-page TIFF file and places each one on its own PDF page, preserving the original order and quality."
            },
            {
                question: "Can I combine multiple separate TIFF files into one PDF?",
                answer: "Yes. Upload several TIFF files and leave \"Combine all files into one PDF\" ticked. They are joined in the order shown. Untick it to get a separate PDF for each file."
            },
            {
                question: "Will the image quality be reduced during conversion?",
                answer: "No. Each TIFF page is embedded at its original pixel size and re-encoded losslessly as PNG, so nothing is downsampled. CMYK and 16-bit TIFFs are converted to standard 8-bit RGB along the way."
            },
            {
                question: "Is this suitable for converting scanned documents?",
                answer: "Yes, this tool is ideal for scanned documents stored as TIFF. It preserves the scan quality and produces a standard PDF that's easy to share, email, or archive."
            }
        ],
        howToSteps: [
            { name: "Upload TIFF", text: "Select one or more TIFF files from your device." },
            { name: "Check the List", text: "Files are combined in the order shown; remove any you don't need, or untick Combine for one PDF per file." },
            { name: "Download PDF", text: "Click convert and save your multi-page PDF document." }
        ]
    },
    "csv-to-json": {
        title: "CSV to JSON Free Online — Instant Converter",
        description: "Convert CSV rows to clean JSON in your browser. Uses the first row as keys, detects the delimiter and handles quoted fields. Free, nothing uploaded.",
        keywords: [
            "csv to json", "convert csv to json", "csv to json converter", "csv to json online free",
            "csv to json array", "csv to json with headers", "csv file to json format",
            "spreadsheet to json", "csv to json api ready", "bulk csv to json converter",
            "csv to json no upload", "convert csv data to json object",
            "csv to json formatter", "csv export to json free"
        ],
        h1: "CSV to JSON Converter - Clean Data Transformation Free Online",
        faqs: [
            {
                question: "How are CSV headers handled in the JSON output?",
                answer: "Convertify uses the first row of your CSV as JSON property names. Each subsequent row becomes a JSON object with those keys, producing a clean array of objects. Values are kept as strings, exactly as they appear in the CSV."
            },
            {
                question: "Can I convert CSV without headers?",
                answer: "Not directly: the first row is always used as the property names. Add a header row to the top of your data (for example name,email,phone) before converting."
            },
            {
                question: "Does it handle special characters and commas inside fields?",
                answer: "Absolutely. The parser correctly handles quoted fields containing commas, newlines, and special characters according to the RFC 4180 CSV standard, so your data converts accurately."
            },
            {
                question: "Is there a row or file size limit?",
                answer: "Uploaded files can be up to 200 MB, and there is no row limit. Since processing happens in your browser, very large files depend on your device's memory."
            }
        ],
        howToSteps: [
            { name: "Upload CSV", text: "Paste your CSV data or upload a .csv file." },
            { name: "Convert", text: "Click Convert to JSON; the delimiter (comma, semicolon, tab or pipe) is detected automatically." },
            { name: "Download JSON", text: "Copy the JSON output or download it as a .json file." }
        ]
    },
    "json-to-csv": {
        title: "JSON to CSV Free — Export to Excel & Sheets",
        description: "Turn a JSON array into CSV you can open in Excel or Google Sheets. Columns are derived from the object keys. Free, private, no sign-up.",
        keywords: [
            "json to csv", "convert json to csv", "json to csv converter", "json to csv online free",
            "json to csv export", "json array to csv", "json to spreadsheet",
            "flatten json to csv", "nested json to csv converter", "json to csv download",
            "api json to csv", "json to csv no upload", "json data to csv table",
            "convert json file to csv free", "json to csv formatter online"
        ],
        h1: "JSON to CSV Converter - Export Clean Spreadsheets Free Online",
        faqs: [
            {
                question: "How does Convertify handle nested JSON objects?",
                answer: "Nested objects are flattened using dot notation (e.g., address.city becomes a column header). This gives you a clean, flat CSV that's easy to work with in Excel or Google Sheets."
            },
            {
                question: "What JSON structures are supported?",
                answer: "An array of objects (one row per object) or a single object (one row). Nested objects are flattened into dot-notation columns, and an array inside a record is written into one cell as JSON text."
            },
            {
                question: "Can I choose which fields to include in the CSV?",
                answer: "No. Every key found in any record becomes a column. Delete the columns you don't need in Excel or Google Sheets afterwards."
            }
        ],
        howToSteps: [
            { name: "Upload JSON", text: "Paste your JSON data or upload a .json file." },
            { name: "Choose Separator", text: "Pick comma, semicolon, tab (TSV) or pipe as the separator." },
            { name: "Download CSV", text: "Export your clean CSV file for use in any spreadsheet app." }
        ]
    },
    "xml-to-json": {
        title: "XML to JSON Free Online — API Data Converter",
        description: "Convert XML documents to JSON with the element structure preserved. Handles attributes and nested elements. Free, browser-based, nothing uploaded.",
        keywords: [
            "xml to json", "convert xml to json", "xml to json converter", "xml to json online free",
            "xml to json parser", "xml to json with attributes", "xml file to json format",
            "xml to json transformer", "xml to json preserve structure", "bulk xml to json",
            "xml to json namespace support", "xml to json no upload", "convert xml data to json object",
            "xml to json api", "xml to json free converter online"
        ],
        h1: "XML to JSON Converter - Accurate Structure Mapping Free Online",
        faqs: [
            {
                question: "How are XML attributes represented in the JSON output?",
                answer: "XML attributes become JSON properties prefixed with '@' (e.g., @id, @class), and an element's text sits under '#text' when it also has attributes or children. The convention is fixed."
            },
            {
                question: "Does it handle XML namespaces correctly?",
                answer: "Namespace prefixes are kept as part of the property names (e.g., 'ns0:item'). There is no option to strip them; remove them afterwards if you don't need them."
            },
            {
                question: "Can I convert large XML files?",
                answer: "Yes. All processing happens in your browser with no server upload. The converter handles large XML documents efficiently, though very large files (100MB+) may depend on your device's available memory."
            },
            {
                question: "How are repeated XML elements handled?",
                answer: "Repeated sibling elements with the same tag name are automatically grouped into JSON arrays, which is the natural and expected behavior for most XML-to-JSON use cases."
            }
        ],
        howToSteps: [
            { name: "Upload XML", text: "Paste your XML content or upload an .xml file." },
            { name: "Convert", text: "Click convert; invalid XML is reported instead of converted." },
            { name: "Download JSON", text: "Copy or download the converted JSON output." }
        ]
    },
    "markdown-to-pdf": {
        title: "Markdown to PDF Free — README & Docs to PDF",
        description: "Turn Markdown into a styled PDF. Supports headings, lists, links, bold, italic, quotes and code blocks. Free, private, no sign-up needed.",
        keywords: [
            "markdown to pdf", "convert markdown to pdf", "markdown to pdf converter", "md to pdf online free",
            "markdown to pdf styled", "github markdown to pdf", "readme to pdf",
            "md to pdf converter online", "markdown to pdf free",
            "convert md file to pdf", "markdown export pdf",
            "markdown to pdf no install"
        ],
        h1: "Markdown to PDF Converter - Beautiful Documents Free Online",
        faqs: [
            {
                question: "Does it support GitHub-Flavored Markdown (GFM)?",
                answer: "Only the everyday parts: headings, bold, italic, links, lists, blockquotes, horizontal rules, inline code and fenced code blocks. Tables, task lists, strikethrough and syntax highlighting are not supported, and numbered lists print as bullets."
            },
            {
                question: "Can I customize the PDF styling?",
                answer: "No. There is one clean built-in style. Page size and margins come from your browser's print dialog, which is where the PDF is saved."
            },
            {
                question: "Are images and diagrams included in the PDF?",
                answer: "No. Image syntax comes out as a link to the image, and Mermaid diagrams appear as plain code blocks. Add images to the PDF afterwards if you need them."
            },
            {
                question: "How do I save the file as a PDF?",
                answer: "Click Download PDF. Your browser's print window opens with the styled document; choose 'Save as PDF' as the destination."
            }
        ],
        howToSteps: [
            { name: "Upload Markdown", text: "Paste your Markdown text or upload a .md file." },
            { name: "Check Preview", text: "Check the live preview beside the editor." },
            { name: "Save as PDF", text: "Click Download PDF, then choose 'Save as PDF' in the print window." }
        ]
    },
    "base64": {
        title: "Base64 Encode & Decode Free Online",
        description: "Encode text or any file (images, PDFs, binaries) to Base64, and decode Base64 back to readable text. Free, instant and fully private.",
        keywords: [
            "base64 encoder", "base64 decoder", "base64 encode online", "base64 decode online",
            "base64 converter", "encode to base64", "decode base64 string", "base64 image encoder",
            "base64 file encoder", "text to base64", "base64 to text", "base64 encode decode free",
            "base64 online tool", "base64 encode file free", "base64 string converter"
        ],
        h1: "Base64 Encoder & Decoder - Instant Conversion Free Online",
        faqs: [
            {
                question: "What is Base64 encoding used for?",
                answer: "Base64 converts binary data into ASCII text, making it safe to embed in JSON, HTML, CSS, emails, and URLs. It's commonly used for embedding small images in web pages or transmitting binary data through text-only channels."
            },
            {
                question: "Can I encode files like images or PDFs to Base64?",
                answer: "Yes! Drop any file into the encoder and get its Base64 representation. This is useful for embedding images as data URIs in HTML/CSS or sending files through text-based APIs."
            },
            {
                question: "Does Base64 encoding increase file size?",
                answer: "Yes, Base64 encoding increases the data size by approximately 33%. This is a trade-off for the ability to represent binary data as safe ASCII text."
            },
            {
                question: "Is my data sent to a server?",
                answer: "No. All encoding and decoding happens entirely in your browser using JavaScript. Your data never leaves your device, making it safe for sensitive content."
            }
        ],
        howToSteps: [
            { name: "Input Data", text: "Paste text or upload a file you want to encode or decode." },
            { name: "Choose Mode", text: "Select Encode (to Base64) or Decode (from Base64)." },
            { name: "Get Result", text: "Copy the output with one click." }
        ]
    },
    "qr-code-generator": {
        title: "QR Code Generator Free — PNG Download",
        description: "Generate a QR code for any URL or text and download it as a PNG at up to 512px. Free, instant, no sign-up and no account needed.",
        keywords: [
            "qr code generator", "create qr code", "qr code maker free", "qr code generator online",
            "qr code generator free no sign up", "url qr code", "qr code png download",
            "qr code generator high resolution", "free qr code maker online", "text to qr code",
            "qr code generator no watermark", "make a qr code for a link"
        ],
        h1: "QR Code Generator — Free PNG Download",
        faqs: [
            {
                question: "What can I encode in the QR code?",
                answer: "Any URL or plain text, up to 4000 characters. Paste a link, a note, or anything else that fits in text form. Wi-Fi and contact codes only work if you type them in the standard WIFI: or vCard text format yourself."
            },
            {
                question: "What size can I download?",
                answer: "Pick 256, 400 or 512 pixels. 400px is plenty for a screen or a slide; use 512px for print."
            },
            {
                question: "Can I add a logo or change the colours?",
                answer: "Not yet — the generator produces a standard black-on-white PNG. Colour customisation, centre logos and SVG export aren't supported."
            },
            {
                question: "Do the generated QR codes expire?",
                answer: "No. The code encodes your data directly, with no redirect service and no tracking, so it keeps working for as long as the destination does."
            },
            {
                question: "Is this one processed in my browser like your PDF tools?",
                answer: "Yes. The QR code is generated in your browser, so the text you encode is not sent to any server. Keep in mind that anyone who scans the code can read what is inside it, so don't encode anything you wouldn't want them to see."
            }
        ],
        howToSteps: [
            { name: "Enter your data", text: "Paste the URL or type the text you want the QR code to point to." },
            { name: "Pick a size", text: "Choose 256, 400 or 512 pixels depending on where you'll use it." },
            { name: "Download the PNG", text: "Check the live preview, then download the QR code as a PNG." }
        ]
    },
    "autocad-pdf-editor": {
        title: "Edit AutoCAD PDF Text Free — SHX Text Editor",
        description: "Edit text inside AutoCAD-exported PDFs, where normal editors fail because AutoCAD draws SHX text as vector strokes. Free, no AutoCAD needed.",
        keywords: [
            "edit autocad pdf", "edit autocad pdf text", "autocad pdf editor", "edit shx text in pdf",
            "edit vector text pdf", "autocad exported pdf editor", "edit cad pdf online",
            "modify autocad pdf", "change text in autocad pdf", "autocad pdf text not editable",
            "edit dwg pdf online", "fix text in autocad pdf", "autocad pdf no selectable text",
            "edit drawing pdf online free", "blueprint pdf text editor", "architectural pdf editor",
            "engineering pdf text edit", "edit dimension text pdf", "autocad pdf editor no download",
            "free autocad pdf text changer", "convertify autocad pdf editor"
        ],
        h1: "Edit Text in AutoCAD-Exported PDFs",
        faqs: [
            {
                question: "Why can't I edit AutoCAD PDF text in normal editors like Adobe or Smallpdf?",
                answer: "AutoCAD exports text using SHX (stroke) fonts by default. SHX has no PDF equivalent, so each letter is drawn as individual vector line/arc strokes — not real text. Standard PDF editors look for a text layer and find none, so they treat the page as 'image-only' and refuse to edit. Convertify's AutoCAD PDF Editor scans the actual vector strokes, groups them into editable text regions, and lets you replace them."
            },
            {
                question: "Will the edited PDF still open correctly when I send it to my boss or client?",
                answer: "Yes. The output is a standard PDF that opens in Adobe Acrobat, Foxit and browser viewers. Everything outside the edited text is left as it was. Stroke (SHX) text is hidden under a small white box before the new text is written, so a line passing through that box is covered too. If you plan to re-import into AutoCAD with PDFIMPORT, tick AutoCAD-friendly mode, which skips the white box (old and new text then overlap in normal viewers)."
            },
            {
                question: "Will the replacement text look exactly like the original SHX strokes?",
                answer: "Not exactly. Position and size are matched to the original text, but the replacement is set in black Helvetica, not a thin single-stroke CAD font. At normal viewing size a changed dimension or label reads naturally; zoomed in, the different font is visible."
            },
            {
                question: "What if my PDF was exported using TrueType fonts instead of SHX?",
                answer: "That works too. TrueType text (Arial, Calibri, etc.) is stored as real text, which the editor finds directly. When you replace it, the original text is removed from the page where that can be done safely and the new text is written at the same baseline and size."
            },
            {
                question: "Does this work for multi-page architectural drawing sets?",
                answer: "Yes. You can navigate page by page, edit text on any page, and download the full multi-page PDF with all changes applied."
            },
            {
                question: "Is my drawing safe? Do you upload my files?",
                answer: "Your files never leave your browser. All parsing, editing, and exporting happens locally on your device — there's no server-side processing. Perfect for confidential architectural, engineering, or proprietary CAD work."
            }
        ],
        howToSteps: [
            { name: "Upload AutoCAD PDF", text: "Drag and drop your AutoCAD-exported PDF file. We'll automatically detect SHX vector text." },
            { name: "Click to Edit Text", text: "We highlight every editable text region. Click any region to type a replacement." },
            { name: "Download Updated PDF", text: "Export your edited PDF instantly. Tick AutoCAD-friendly mode first if you'll re-import it into AutoCAD." }
        ]
    }
}

applyMobileSeoTitles(toolSeoData)

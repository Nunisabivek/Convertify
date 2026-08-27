// ===========================================
// LONG-TAIL BLOG POSTS
// ===========================================
// Kept in their own file so blog-data.ts stays navigable. These target
// specific, low-competition queries rather than head terms like "merge pdf",
// which are owned by DR-90 domains and unreachable from a young site.
//
// Rules for anything added here:
//   1. Answer one specific question a real person typed into Google.
//   2. Be honest about what our tools cannot do — a bounce back to the SERP
//      hurts more than an admitted limitation.
//   3. 600+ words of actual substance. Posts under 350 words are auto-
//      noindexed by isBlogPostIndexable() and excluded from the sitemap.
import type { BlogPost } from './blog-data'

export const longTailPosts: BlogPost[] = [
  {
    slug: "compress-pdf-to-500kb",
    title: "How to Compress a PDF to Under 500KB (Without It Turning to Mush)",
    excerpt: "500KB is the most common upload cap on job portals and application forms. Here's how to hit it reliably, and what to do when a file refuses to go below it.",
    date: "2026-05-04",
    category: "how-to",
    readingTime: 6,
    relatedTool: "/compress-pdf",
    keywords: ["compress pdf to 500kb", "reduce pdf size to 500kb", "pdf under 500kb", "compress pdf 500kb online free", "make pdf smaller than 500kb"],
    content: `
500KB is a strangely popular number. Job portals use it, university application forms use it, and a surprising number of internal HR systems use it. If you have landed here, something has just rejected your file and told you to make it smaller.

## The direct route

1. Open the [PDF compressor](/compress-pdf).
2. Drop your PDF in.
3. Set the target size to 500KB.
4. Download the result.

The tool compresses in multiple passes, checking the output size after each one and going again if it is still over target. That matters, because most compressors apply one fixed quality setting and hand you whatever comes out — which is how you end up at 640KB with no obvious next move.

Your file never leaves your browser, which is worth knowing if the PDF is a signed contract, a bank statement or a passport scan.

## Why some PDFs refuse to shrink

Not every PDF has the same amount of slack in it. What is inside decides how far it can go.

**A PDF made of scanned images** is mostly photo data. This compresses well — often by 80% or more — because photographic data tolerates quality reduction before your eye notices. A 3MB scan reaching 400KB is routine.

**A PDF exported from Word or Google Docs** is mostly text and font data. There is very little to throw away. A 600KB text PDF might reach 500KB, or it might not move at all. If your file is already small and still over the limit, this is usually why.

**A PDF containing high-resolution photographs** sits in between. You can get large reductions, but past a point the images visibly degrade.

## When it will not go below 500KB

Three things actually work, in the order you should try them:

**Split it.** If the form only needs pages 3 to 7, send pages 3 to 7. Use [Split PDF](/split-pdf) to pull out the range. This is by far the most effective move and the one people try last.

**Check for an oversized embedded image.** One 12-megapixel photo dropped into an otherwise light document can dominate the file size. If you have the source, resize the image to roughly its display size before rebuilding the PDF.

**Re-scan at a lower DPI.** If you scanned the document yourself, 600 DPI is overkill for anything you are uploading to a web form. 200 DPI is plenty for readable text and produces a file a fraction of the size. Re-scanning takes two minutes and beats fighting a compressor.

## Do not compress twice

Running an already-compressed PDF through a compressor a second time is a common instinct and a bad one. The image data has already been through a lossy pass; a second pass discards more detail for a much smaller size saving. Text goes soft, scans get blotchy, and you often gain only a few kilobytes.

If one pass at your target size did not get you there, the answer is fewer pages or better source material — not more compression.

## Check it before you upload

Two things worth doing before you submit:

Open the compressed file and actually read it. Compression protects text legibility, but if your document contains fine print, a signature, or a stamp with small text, confirm those are still clear.

Check the size in your file manager. Some portals measure in different units (500KB vs 0.5MB vs 512,000 bytes), and a file that is 501KB will be rejected by a strict validator just as firmly as one that is 5MB. If you are close to the line, target 450KB and give yourself room.
`,
    faqs: [
      { question: "Will compressing to 500KB make my text blurry?", answer: "Text itself is stored as vector data in most PDFs, so it stays sharp. What degrades is image content — scans, photos and screenshots. If your PDF is a scanned document, check the result at 100% zoom before uploading, especially any fine print or signatures." },
      { question: "My PDF is only 600KB and won't compress below 550KB. Why?", answer: "It is almost certainly a text-based PDF exported from Word or Docs. Those are mostly font and text data, which has very little redundancy to squeeze out. Removing pages you don't need is the only reliable way down from there." },
      { question: "Is it safe to compress a PDF with personal documents in it?", answer: "With our compressor, yes — it runs entirely in your browser and the file is never uploaded to a server. You can confirm that in your browser's developer tools under the Network tab. Be more careful with tools that require an upload." },
      { question: "Can I compress several PDFs to 500KB at once?", answer: "Compress them one at a time. If you need them as a single submission, compress each first and then join them with our Merge PDF tool — but check the combined size afterwards, since merging adds them together." },
    ],
  },

  {
    slug: "compress-pdf-for-visa-application",
    title: "Compressing PDFs for a Visa Application: Size Limits and What Not to Break",
    excerpt: "Visa portals have some of the strictest upload limits on the internet, and the worst error messages. Here's how to hit the size without damaging the documents an officer has to read.",
    date: "2026-05-11",
    category: "how-to",
    readingTime: 7,
    relatedTool: "/compress-pdf",
    keywords: ["compress pdf for visa application", "visa application pdf size limit", "reduce pdf size for visa", "compress passport scan pdf", "visa document upload size"],
    content: `
Visa portals are unforgiving. The limits are low, the error messages are vague, and the documents involved — passports, bank statements, sponsor letters — are exactly the sort of thing you want to be legible when a human being finally opens them.

## Typical limits

They vary by country and by portal, but the common bands are:

* **300KB** — the tightest tier, often for individual scanned pages
* **500KB** — very common for supporting documents
* **1MB to 2MB** — usually for multi-page bundles like bank statements
* **5MB** — the generous end, often the total-application cap

Read the instructions carefully, because some portals cap each file *and* the total. Getting eight documents under 500KB each is no help if the combined submission has to fit in 2MB.

## How to do it

1. Open the [PDF compressor](/compress-pdf).
2. Drop the document in.
3. Set the target size to whatever the portal demands, minus a small margin.
4. Download and check the result before uploading.

The compressor runs in your browser. Your passport scan and your bank statements are never sent anywhere — which for this category of document should be the first thing you check about any tool you use.

## Aim below the limit, not at it

If the cap is 500KB, target 450KB. Portals differ on whether "500KB" means 500,000 bytes or 512,000, and some count a few bytes of metadata you cannot see. A file at 499KB that gets rejected on a technicality at 2am the night before a deadline is a bad experience. Leave yourself room.

## What the officer has to be able to read

This is where people go wrong. Compression that hits the size limit but renders your document unreadable does not save you time — it gets your application queried or returned.

Check these specifically after compressing:

* **Passport number and machine-readable zone.** The two lines of characters at the bottom of the photo page must be crisply legible.
* **Dates and amounts on bank statements.** A blurry 3 that could be an 8 is a problem.
* **Official stamps and seals.** These often contain small text around the edge.
* **Signatures.** Both yours and any sponsor's.

Open the compressed file, zoom to 100%, and look at those specific areas. If any of them have gone soft, you compressed too far.

## When compression is the wrong answer

**Scan at a lower DPI instead.** If you are scanning the documents yourself, do not scan at 600 DPI and then compress hard. Scan at 200 to 300 DPI in the first place. The result is a smaller file that is *more* readable than a heavily compressed high-DPI scan, because you never introduced the compression artefacts.

**Scan in greyscale, not colour.** Unless the portal specifically asks for colour, a greyscale scan of a text document is roughly a third of the size for no loss of legibility. Most scanner apps have this setting one tap away.

**Split multi-page bundles.** If the portal takes documents individually and your bank statement bundle is over the cap, [split it](/split-pdf) and upload the pages separately where allowed.

## Photographing documents with a phone

Many people photograph rather than scan. If you do:

Use your phone's built-in document scanner (Notes on iOS, Google Drive on Android) rather than the plain camera. It flattens perspective, crops to the page edge and applies contrast correction, all of which produce a smaller and more readable file than a raw photo.

Then convert the images with [JPG to PDF](/jpg-to-pdf) and compress if needed. A raw 12-megapixel camera photo of a document is typically 4MB and full of information about your desk; a scanner-app capture of the same page is a few hundred kilobytes of just the document.
`,
    faqs: [
      { question: "What size should I compress visa documents to?", answer: "Whatever the portal specifies, minus about 10%. If the limit is 500KB, target 450KB. Portals disagree about whether a kilobyte is 1000 or 1024 bytes, and some add metadata, so a file sitting exactly at the limit sometimes gets rejected." },
      { question: "Is it safe to upload my passport scan to an online compressor?", answer: "It depends entirely on the tool. Ours processes the file in your browser and never uploads it, which you can verify in the Network tab of your browser's developer tools. Many compressors do send your file to a server — for passport and bank documents, check before you use one." },
      { question: "My scanned passport is unreadable after compressing. What now?", answer: "Start again from the original and re-scan at 200-300 DPI in greyscale rather than compressing a 600 DPI colour scan. You'll get a smaller file that's easier to read, because you avoid stacking compression artefacts on top of unnecessary detail." },
      { question: "Can I combine all my visa documents into one PDF?", answer: "Only if the portal asks for that — many require each document separately and will reject a combined file. If a bundle is allowed, use Merge PDF, then compress the merged file and check the total against the cap." },
    ],
  },

  {
    slug: "convert-screenshots-to-pdf",
    title: "How to Turn a Pile of Screenshots into One PDF",
    excerpt: "Screenshots are how most of us document things now — receipts, chat threads, error messages. Here's how to get them into a single, ordered PDF that other people can actually open.",
    date: "2026-05-18",
    category: "how-to",
    readingTime: 6,
    relatedTool: "/png-to-pdf",
    keywords: ["screenshot to pdf", "convert screenshots to pdf", "multiple screenshots into one pdf", "combine screenshots pdf free", "screenshot to pdf without app"],
    content: `
Screenshots have quietly become the default way people keep records: a payment confirmation, a conversation with support, an error message, a booking reference. The problem arrives when you need to *send* twelve of them to someone. Twelve separate image attachments is a mess. One PDF is a document.

## The straightforward way

Screenshots are PNG files on most systems — Windows Snipping Tool, macOS Shift-Cmd-4, iPhone and Android all default to PNG.

1. Open [PNG to PDF](/png-to-pdf).
2. Select all your screenshots at once, or drag them in together.
3. Drag the thumbnails until the order is right.
4. Convert, and download the single PDF.

If your screenshots are JPGs — some Android phones and screenshot apps default to JPG — use [JPG to PDF](/jpg-to-pdf) instead. Everything else works the same.

Both run in your browser, so screenshots of your bank app or a private conversation are not uploaded anywhere.

## Get the order right before you convert

This is the part people redo. Screenshots are usually named by timestamp — "Screenshot 2026-05-18 at 14.23.11" — so they *often* sort correctly by default, but not always. Two traps:

**Screenshots taken on different devices** interleave badly, because the naming schemes differ.

**Files renamed by a messaging app** lose their timestamps entirely. Anything that arrived via WhatsApp or Telegram will have a name like "IMG-20260518-WA0007", which sorts by arrival, not by when it was taken.

Drag the thumbnails into the order that tells the story, then convert. Fixing the order afterwards means starting again.

## Getting screenshots off your phone first

If the screenshots are on your phone and you want to do this on a laptop, the fastest routes are:

* **iPhone to Mac** — AirDrop the whole selection at once.
* **iPhone to Windows** — iCloud Photos in a browser, or email them to yourself.
* **Android to anything** — Google Photos in a browser, or a USB cable.

Or skip the transfer entirely. The converter works in mobile browsers, so you can select screenshots straight from your phone's photo picker in Safari or Chrome and get the PDF back into your Downloads folder. There is no app to install.

## A note on iPhone screenshots and HEIC

Screenshots on iPhone are PNG, so they convert directly. But *photos* on iPhone are usually HEIC, and if your bundle mixes screenshots with camera photos, the HEIC files will not convert directly. Run those through [HEIC to JPG](/heic-to-jpg) first, then combine everything.

## Long screenshots and readability

Two practical things that make the resulting PDF more useful:

**Scrolling screenshots get scaled down.** A tall scrolling capture of a whole chat thread has an extreme aspect ratio, so fitting it to a page shrinks the text considerably. If legibility matters, take several normal screenshots instead of one enormous scrolling one.

**Crop before you convert.** Your status bar, battery percentage and notification shade are not part of the evidence. Cropping tightly to the relevant area means the content fills more of the page and is easier to read.

## If the PDF is too big to email

Screenshots are lossless PNGs, so twenty of them can easily produce a 15MB PDF. Run it through the [compressor](/compress-pdf) with a target of 2MB or so — screenshots tolerate compression well, since they are mostly flat colour and text on plain backgrounds.
`,
    faqs: [
      { question: "Can I convert screenshots to PDF on my phone without an app?", answer: "Yes. Open the converter in Safari or Chrome on your phone, tap the upload area, and pick the screenshots straight from your photo picker. The finished PDF downloads to your phone's Files or Downloads folder. Nothing to install." },
      { question: "My screenshots came out in the wrong order.", answer: "Reorder the thumbnails by dragging them before you hit convert. Files that arrived through a messaging app are the usual culprit — apps rename them on arrival, so they sort by when you received them rather than when they were taken." },
      { question: "Should I use PNG to PDF or JPG to PDF?", answer: "Match the tool to your files. Windows, macOS and iPhone screenshots are PNG; some Android phones and third-party screenshot apps produce JPG. Check the file extension and use the matching converter." },
      { question: "Will the screenshots lose quality in the PDF?", answer: "No. The images are embedded at their original resolution. What can reduce legibility is very tall scrolling screenshots, which get scaled down to fit a page — take several normal captures instead if the text needs to stay readable." },
    ],
  },

  {
    slug: "heic-to-jpg-on-windows",
    title: "HEIC Files Won't Open on Windows — Here's the Fix",
    excerpt: "Someone sent you photos from an iPhone and Windows refuses to open them. What HEIC actually is, why this happens, and three ways to get usable JPGs.",
    date: "2026-05-25",
    category: "how-to",
    readingTime: 6,
    relatedTool: "/heic-to-jpg",
    keywords: ["heic to jpg windows", "open heic file windows", "convert heic to jpg free", "heic won't open", "iphone photos won't open on pc"],
    content: `
You have been sent a folder of photos from an iPhone. Windows shows them as blank icons, or Photos throws an error, or you get prompted to buy something from the Microsoft Store. The files end in ".heic" and nothing you own will open them.

## What HEIC actually is

HEIC is Apple's default photo format since iOS 11. It stores an image at roughly half the file size of an equivalent JPG with no visible quality difference — genuinely good engineering, and the reason iPhones can hold so many photos.

The catch is licensing. HEIC uses the HEVC codec, which is patent-encumbered, so Windows does not ship decoders for it by default. Microsoft sells the extension in the Store rather than bundling it. That is the whole reason for your problem: not a corrupt file, not a broken download, just a codec Windows will not include for free.

## Option one: convert them

The fastest fix if you just need the photos usable:

1. Open [HEIC to JPG](/heic-to-jpg).
2. Drop in the HEIC files — several at once is fine.
3. Download the JPGs.

This runs in your browser, so family photos are not uploaded to anyone's server. JPG opens on everything, which is usually the actual goal.

## Option two: stop the iPhone producing them

If the photos keep arriving from the same person, have them change the setting once and the problem stops permanently:

On the iPhone, **Settings → Camera → Formats → Most Compatible**. The phone then shoots JPG instead of HEIC. Photos get bigger, but they open everywhere.

There is also **Settings → Photos → Transfer to Mac or PC → Automatic**, which converts on transfer when connecting by cable. Worth knowing, though it only helps for cable transfers and not for photos sent by message or email.

## Option three: buy the Microsoft extension

The **HEIF Image Extensions** package in the Microsoft Store makes Windows open HEIC natively. It costs a small amount and is a reasonable purchase if you receive HEIC constantly. Note that you may also need the **HEVC Video Extensions** package for the associated video format, which is a separate purchase — a detail that annoys people.

## What you lose in the conversion

Being straight about this: JPG is a lossy format and HEIC is more efficient, so a converted JPG is a larger file that is technically slightly lower quality than the HEIC it came from. In practice you will not see the difference on a photo, and it is not a consideration for sharing, printing or uploading.

What does change:

* **File size roughly doubles.** A 2MB HEIC becomes a 3-4MB JPG. If you are converting hundreds of photos, watch your disk space.
* **Live Photo motion is dropped.** The still frame converts; the short video attached to it does not.
* **Depth and portrait data is dropped.** The image looks the same, but the depth map used for background blur adjustments is gone, so you can no longer re-edit the blur.
* **Location and camera EXIF data is generally preserved**, which matters if you organise photos by where they were taken.

## If you are converting a lot

For a whole holiday's worth of photos, convert in batches rather than dropping 800 files in at once — browser-based conversion uses your own machine's memory, and very large batches on an older laptop can get sluggish. A hundred at a time is comfortable.

And if the end goal is a document rather than loose images — a set of receipts, say — convert to JPG and then run them through [JPG to PDF](/jpg-to-pdf) to get one file you can send.
`,
    faqs: [
      { question: "Why won't Windows open HEIC files?", answer: "HEIC uses the HEVC codec, which is patent-licensed, so Microsoft doesn't bundle a decoder with Windows for free. It's sold separately as the HEIF Image Extensions package in the Store. The file isn't corrupt — Windows just can't read the format out of the box." },
      { question: "Does converting HEIC to JPG lose quality?", answer: "Slightly, in the technical sense — JPG is lossy and less efficient than HEIC — but it isn't visible on a normal photo. The bigger practical change is that the file roughly doubles in size, and Live Photo motion and portrait depth data are dropped." },
      { question: "How do I stop my iPhone from making HEIC files?", answer: "On the iPhone, go to Settings → Camera → Formats and choose 'Most Compatible'. The camera then shoots JPG. Photos take more space but open on any device without conversion." },
      { question: "Can I convert HEIC files without uploading them?", answer: "Yes — our converter decodes them in your browser, so the photos never leave your machine. That's worth checking with any converter you use for personal photos, since many process files server-side." },
    ],
  },

  {
    slug: "merge-pdf-on-chromebook",
    title: "How to Merge PDFs on a Chromebook (No Extensions Needed)",
    excerpt: "ChromeOS has no built-in PDF merger and most desktop PDF software doesn't run on it. The browser can do the job — here's the reliable way.",
    date: "2026-06-01",
    category: "how-to",
    readingTime: 5,
    relatedTool: "/merge-pdf",
    keywords: ["merge pdf chromebook", "combine pdf chromebook", "chromebook pdf merge free", "how to merge pdf files on chromebook", "chromebook pdf tools"],
    content: `
Chromebooks are excellent at most things and awkward at exactly this one. There is no Preview, no Acrobat, and the built-in Gallery app will show you a PDF but will not combine two of them. Search for a solution and you get a wall of Chrome extensions asking for permission to read everything you do.

## The straightforward way

You do not need an extension. A browser-based merger works natively on ChromeOS because the work happens in the browser itself:

1. Open [Merge PDF](/merge-pdf).
2. Drag your PDFs in from the Files app, or click to select them.
3. Drag the thumbnails into the order you want.
4. Click merge and download the combined file.

It lands in your Downloads folder like any other download. No extension, no install, no account.

## Why this works when desktop software does not

ChromeOS runs web applications, so a tool that does its processing in JavaScript inside the browser is effectively native there — it does not need to be "ported". Merging PDFs is a structural operation: it copies page objects from several documents into one. That runs perfectly well in a browser tab.

It also means your files stay on your Chromebook. Nothing is uploaded, which matters more than usual on a school or work-managed device where you may not know what the network logs.

## Reordering, and the file-picker trap

The one thing to watch: selecting several files at once in the ChromeOS file picker does not guarantee the order you expect. The picker returns files in its own order, which is often alphabetical rather than the order you clicked them.

Check the thumbnails after adding, and drag them into place before merging. This takes five seconds and saves redoing the whole thing.

If your files are named "Page1.pdf" through "Page12.pdf", be aware that alphabetical sorting puts "Page10" immediately after "Page1". Renaming to "Page01", "Page02" and so on fixes this permanently, and is worth doing if you handle these regularly.

## Merging files from Google Drive

Files in Drive are not on your Chromebook until you open them. Two approaches:

**Download first.** Right-click in the Files app and choose Download, or make the file available offline. Then merge from Downloads.

**Or drag directly.** The ChromeOS Files app exposes Drive as a folder, and dragging from there into the browser generally works — ChromeOS fetches the file as part of the drag. If it fails, fall back to downloading first.

## What merging keeps and what it drops

Straight answer, because most guides skip it:

**Kept:** all page content, text, images, page sizes and orientation. Pages that were landscape stay landscape. Text stays selectable and searchable.

**Dropped:** bookmarks and outline structure, form fields, and in most cases annotations and internal links between pages. If you are merging filled-in forms and you need the entered values, print each to a flattened PDF first — otherwise the field data may not survive.

For the common cases — combining scanned pages, assembling a set of receipts, joining chapters of a report — none of that matters.

## Working entirely offline

If your Chromebook is offline, browser-based tools cannot load. Two fallbacks:

The **Linux (Crostini)** environment, if enabled, gives you "pdfunite" from the poppler-utils package — a single command that merges files and works with no network at all.

Or **Android apps** via the Play Store, if your Chromebook supports them. They install locally and run offline, though the quality varies wildly and many are aggressively ad-supported.
`,
    faqs: [
      { question: "Do I need to install anything to merge PDFs on a Chromebook?", answer: "No. A browser-based merger does the work inside the tab itself, so there's nothing to install and no extension to grant permissions to. Your files stay on the device." },
      { question: "Can I merge PDFs stored in Google Drive?", answer: "Yes. Either make the file available offline or download it through the Files app first, then merge from Downloads. Dragging directly from the Drive folder in Files usually works too, since ChromeOS fetches the file as part of the drag." },
      { question: "My merged PDF came out in the wrong page order.", answer: "The ChromeOS file picker often returns files alphabetically rather than in click order. Drag the thumbnails into the right sequence before merging. If your files are numbered, rename them with leading zeros (Page01, Page02) so alphabetical order matches numeric order." },
      { question: "Will merging work if my Chromebook is offline?", answer: "No — the page has to load first. If you're offline regularly, enable the Linux environment and use pdfunite from poppler-utils, which runs locally with no network at all." },
    ],
  },

  {
    slug: "extract-one-page-from-pdf",
    title: "How to Extract a Single Page From a PDF",
    excerpt: "You need page 4 and nothing else. Three ways to pull one page out of a PDF, and why the print-to-PDF trick quietly costs you the text layer.",
    date: "2026-06-08",
    category: "how-to",
    readingTime: 5,
    relatedTool: "/split-pdf",
    keywords: ["extract page from pdf", "save one page of a pdf", "extract single page pdf free", "pull one page out of pdf", "separate one page from pdf"],
    content: `
A 60-page document arrives and you need page 4. Perhaps it is the invoice inside a statement bundle, or the one form in a pack of twelve, or the single diagram from a report you want to send to a colleague.

## The direct way

1. Open [Split PDF](/split-pdf).
2. Drop the document in.
3. Select the page you want, or type its number as a range like "4-4".
4. Download the extracted page as its own PDF.

The tool runs in your browser, so the original never gets uploaded — useful when the surrounding 59 pages contain things you would rather not hand to a website.

## Extracting several pages, or a range

The same tool covers the variations:

* **A continuous range** — enter "4-9" to get pages 4 through 9 as one PDF.
* **Scattered pages** — select pages 2, 7 and 15 individually to pull them into a single document.
* **Every page separately** — split the whole file so each page becomes its own PDF.

The distinction that trips people up: extracting pages 2, 7 and 15 gives you *one* PDF containing three pages, not three separate files. If you want them separate, extract each one individually.

## Why not just print to PDF?

Nearly every PDF viewer lets you print page 4 with "Save as PDF" as the destination, and it works. But it has a real cost that is easy to miss.

Printing to PDF **re-renders** the page rather than copying it. Depending on the viewer and the source document, that can mean:

* **The text layer is flattened.** In the worst case you end up with a picture of a page. It looks identical but you can no longer select, copy or search the text — and neither can anything that processes it later.
* **Hyperlinks stop working.**
* **Quality drops**, particularly if the print pipeline rasterises at a fixed DPI.
* **File size can go up**, sometimes dramatically, if a page of text becomes a page-sized image.

Proper extraction copies the page object as it is. Text stays text, vectors stay vectors, size stays proportionate.

If you only need to eyeball or print the page, print-to-PDF is fine. If the page will be uploaded somewhere, searched, or read by anything automated, extract it properly.

## The reverse problem: removing a page

Sometimes you want the document *minus* one page. Two routes:

Split out the pages you want to keep as a range either side of the unwanted one, then [merge](/merge-pdf) the two parts back together.

Or use [Organize PDF](/organize-pdf), which shows every page as a thumbnail and lets you delete the ones you do not want in place. That is usually faster when you are removing several scattered pages.

## Page numbers and the off-by-one problem

Worth checking before you extract: the page number printed on the page and the page number in the PDF are frequently different. A report with a cover page and a contents page will have "page 1" of the body sitting at PDF page 3.

Always go by the position in the viewer's page counter, not the number printed on the paper. If you are unsure, extract the range either side and check.

## Extracted pages keep their original size

One small thing that surprises people: an extracted page retains the page size and orientation it had in the source. Pull a landscape chart out of a portrait report and you get a landscape PDF. That is correct behaviour, not a bug — the page is being copied, not redrawn.
`,
    faqs: [
      { question: "How do I extract just one page from a PDF for free?", answer: "Open Split PDF, add your document, select the page you want or enter it as a range like 4-4, and download. It runs in your browser, so the rest of the document is never uploaded anywhere." },
      { question: "Is printing to PDF the same as extracting a page?", answer: "No. Printing re-renders the page, which can flatten the text layer into an image, break hyperlinks and change the file size. Proper extraction copies the page object as-is, so text stays selectable and searchable." },
      { question: "Can I extract several pages that aren't next to each other?", answer: "Yes — select pages 2, 7 and 15 individually and you'll get one PDF containing those three pages. If you want them as three separate files, extract each one on its own." },
      { question: "The page number in the document doesn't match the PDF page number.", answer: "That's normal — cover pages and contents pages shift everything. Go by the position shown in your viewer's page counter rather than the number printed on the page itself." },
    ],
  },

  {
    slug: "copy-text-from-pdf-that-wont-let-you",
    title: "When a PDF Won't Let You Copy Text: What's Actually Going On",
    excerpt: "Selection does nothing, or you paste gibberish. There are three different causes with three different fixes — and knowing which one you have saves a lot of time.",
    date: "2026-06-15",
    category: "how-to",
    readingTime: 6,
    relatedTool: "/pdf-to-text",
    keywords: ["can't copy text from pdf", "copy text from protected pdf", "extract text from pdf free", "pdf text not selectable", "pdf copy paste gibberish"],
    content: `
You try to select a paragraph and the cursor draws a box instead of highlighting words. Or the text highlights, you copy it, and what lands in your document is "&#xF041;&#xF07A;&#xF06E;" or similar nonsense. These look like the same problem and are not.

There are three distinct causes. Work out which one you have before trying fixes, because the fix for one does nothing for the others.

## Cause one: the page is an image

**Symptom:** dragging across the text draws a selection rectangle, like selecting on a photo. Nothing highlights.

**Why:** the PDF contains no text at all. Someone scanned a document or photographed it, and what you are looking at is a picture of words. There is nothing to select because, as far as the file is concerned, there are no words.

**Fix:** OCR — optical character recognition — which examines the image and works out what the letters are. That is genuinely a different technology from text extraction, and our tools do not do it yet. Free options that do include Google Drive (upload the PDF, right-click, Open with Google Docs, which runs OCR automatically) and most modern scanner apps, which offer a "searchable PDF" option.

Once OCR has produced a text layer, extraction works normally.

## Cause two: the text is there but copying is restricted

**Symptom:** text highlights normally when you drag across it, but Copy is greyed out, or pasting produces nothing.

**Why:** the PDF has owner restrictions — permission flags set by whoever produced it, saying content should not be extracted. Important detail: this is a *request*, not encryption. The text sits in the file unencrypted; viewers voluntarily honour the flag.

**Fix:** [PDF to Text](/pdf-to-text) reads the text layer directly rather than going through a viewer's copy function, so it is not affected by the permission flag. Same for [PDF to Word](/pdf-to-word) if you want it as an editable document.

Worth saying plainly: those flags are usually there for a reason. Extracting text from a document you have a right to read, to quote or reference it, is ordinary. Republishing someone's paid content is not, and the flag being trivial to bypass does not change that.

## Cause three: the font encoding is broken

**Symptom:** text selects and copies fine, but what you paste is garbage — random symbols, boxes, or letters in the wrong order.

**Why:** this is the subtle one. A PDF font maps character codes to glyph shapes. If the producing software embedded a subset font without a proper "ToUnicode" map, the file knows how to *draw* each character but not what character it *is*. The page looks perfect and the underlying data is meaningless.

This is common with PDFs exported from older versions of LaTeX, some CAD packages, and certain corporate report generators.

**Fix:** there is no clean one, because the information genuinely is not in the file. Options in order of preference:

* Try [PDF to Text](/pdf-to-text) — different extractors handle broken encodings differently and it sometimes recovers more than a viewer's copy function.
* Find the source document. Broken-encoding PDFs almost always have an original somewhere that will export correctly.
* Fall back to OCR. Since the page *renders* correctly, running OCR on the rendered image sidesteps the encoding problem entirely. Ironic but effective.

## How to tell which one you have in five seconds

Press **Ctrl+F** (Cmd+F on Mac) in your PDF viewer and search for a word you can plainly see on the page.

* **No results** — the page is an image. You need OCR.
* **It finds it, but you can't copy** — permission restrictions. Use a text extractor.
* **It finds it and copying gives gibberish** — broken font encoding. Try an extractor, then OCR.

That single test tells you which of the three problems you have and saves trying fixes that were never going to work.
`,
    faqs: [
      { question: "Why can't I select text in my PDF at all?", answer: "The page is almost certainly a scanned image rather than text. Press Ctrl+F and search for a word you can see — if it finds nothing, there's no text layer in the file and you need OCR to create one." },
      { question: "Is it legal to extract text from a restricted PDF?", answer: "The permission flag is a request that viewers honour voluntarily, not encryption — the text sits unencrypted in the file. Extracting from a document you have a right to read, in order to quote or reference it, is ordinary use. Republishing someone's paid content isn't, regardless of how easy the flag is to bypass." },
      { question: "I copied text and got random symbols. What happened?", answer: "The PDF's fonts are missing their ToUnicode mapping, so the file knows how to draw each character but not what character it represents. Try a dedicated text extractor first, then look for the source document — and if neither works, OCR on the rendered page sidesteps the problem entirely." },
      { question: "Does your PDF to Text tool do OCR?", answer: "No. It reads the text layer that's already in the file, which is fast and accurate on digitally-created PDFs but returns nothing for scanned pages. For scans, run the file through Google Drive's OCR or a scanner app's 'searchable PDF' option first." },
    ],
  },

  {
    slug: "png-to-pdf-without-white-borders",
    title: "Why Your PNG-to-PDF Conversion Has White Borders (And How to Stop It)",
    excerpt: "You converted an image to PDF and got a thick white margin around it. Here's why that happens, and how to get a PDF page that matches your image exactly.",
    date: "2026-06-22",
    category: "how-to",
    readingTime: 5,
    relatedTool: "/png-to-pdf",
    keywords: ["png to pdf white border", "remove white margin pdf image", "png to pdf no border", "image to pdf full page", "pdf image fit page"],
    content: `
You convert a PNG and open the PDF expecting your image. What you get is your image floating in the middle of a page with a white border around it, like a badly matted photograph. This is not a bug — it is a consequence of how PDF pages work, and it is fixable once you understand what is happening.

## Where the border comes from

A PNG has one property that matters here: its pixel dimensions. A PDF page has a different one: a physical size, measured in points, inches or millimetres.

When a converter places your image on a page, it has to pick a page size. Most default to A4 or US Letter, because most PDFs are documents meant for printing. Your image is then scaled to fit inside that page while keeping its aspect ratio.

If your image's proportions do not match the page's proportions, the leftover space becomes margin. A square screenshot on a tall A4 page leaves white bands top and bottom. A wide banner leaves them either side.

The white is not added to your image. It is simply the page showing through.

## Getting a page that matches your image

The clean fix is to make the PDF page the same shape as the image, rather than fitting the image into a document-shaped page. Our [PNG to PDF](/png-to-pdf) converter sizes pages to the images by default, so a 1200x800 screenshot becomes a 1200x800-proportioned page with no margin at all.

If a converter offers a page-size setting, look for an option named something like "fit to image", "match image size", or "original". If it only offers A4, Letter and Legal, you are going to get borders no matter what you do.

## When you actually want A4

Do not reflexively remove the margin. It exists for a reason in some cases:

**If the PDF will be printed**, a page sized to your image will confuse the printer, which expects standard paper. It will scale your borderless page onto A4 and add its own margins — often unevenly. Choose A4 deliberately in that case.

**If it is going into a document bundle**, mixed page sizes look untidy and can break other people's printing. Match the rest of the bundle.

**If it is being uploaded to a form**, some validators expect standard page sizes and reject anything unusual.

The rule of thumb: image-sized pages for screens, A4 for paper.

## The other kind of white border

There is a second cause worth ruling out, because the fix is completely different: the white might be *in your PNG*.

Screenshots often include the window chrome or the page background. Exports from design tools frequently include the artboard background. If your image genuinely has white pixels around the content, no PDF setting will remove them, because from the converter's point of view that white is part of the picture.

Quick test: open the PNG on its own, on a dark background — drag it onto a dark desktop, or open it in a viewer with a dark theme. If you can see white around the content there, the border is in the image. Crop it before converting.

## Transparent PNGs turn white

A related surprise. PNG supports transparency; PDF handles it inconsistently, and most converters composite transparent areas onto white when placing the image.

So a logo with a transparent background becomes a logo on a white rectangle. If it lands on a white page you will not notice. If it lands on anything else, you will.

If transparency matters, keep the asset as PNG and place it in a proper layout tool rather than converting it directly to PDF.

## Multiple images, consistent look

When you are combining several images into one PDF — receipts, a set of screenshots, scanned pages — consistency reads better than tightness. If the images are different shapes, sizing every page to its image gives you a document whose pages change size as you scroll, which feels broken even when it is technically correct.

For mixed-shape bundles, pick a standard page size and accept the margins. For a set of images that are all the same shape, size to the image and enjoy the clean result.
`,
    faqs: [
      { question: "How do I convert a PNG to PDF without a white border?", answer: "Use a converter that sizes the PDF page to the image rather than forcing A4. Ours does that by default, so a 1200x800 image produces a page with the same proportions and no margin." },
      { question: "Why is my transparent PNG showing a white background in the PDF?", answer: "Most converters composite transparency onto white when placing an image in a PDF, because PDF handles alpha inconsistently across viewers. If transparency matters for your use, keep the file as PNG rather than converting it." },
      { question: "Should I use A4 or match the image size?", answer: "Match the image for anything that will be viewed on a screen. Choose A4 if the PDF will be printed, joined into a document bundle, or uploaded somewhere that expects standard page sizes — a borderless custom page confuses printers." },
      { question: "I removed the setting and there's still a white edge.", answer: "The white is probably in the PNG itself — window chrome from a screenshot, or an artboard background from a design tool. Open the image on a dark background to check, and crop it before converting if so." },
    ],
  },

  {
    slug: "rotate-scanned-pdf-sideways",
    title: "Your Scanned PDF Is Sideways: Rotating It So It Stays Rotated",
    excerpt: "Rotating in a PDF viewer often doesn't stick — reopen the file and it's sideways again. Here's the difference between a view rotation and a real one.",
    date: "2026-06-29",
    category: "how-to",
    readingTime: 5,
    relatedTool: "/rotate-pdf",
    keywords: ["rotate pdf permanently", "scanned pdf sideways", "rotate pdf and save", "pdf rotation not saving", "fix upside down pdf"],
    content: `
You scan a stack of documents, open the PDF, and half the pages are on their side. You rotate them in your viewer, close the file, send it — and the recipient tells you it is still sideways.

This is one of the most common PDF annoyances, and it comes down to a distinction almost nothing in the interface explains.

## View rotation versus stored rotation

Every PDF page carries a **rotation attribute** stored in the file itself: 0, 90, 180 or 270 degrees. Every viewer honours it when displaying the page.

Separately, most viewers offer a **view rotation** — a temporary display change that affects only your window. Adobe Reader, Chrome's built-in viewer, Preview's rotate button in some modes, and nearly every browser PDF viewer default to this behaviour.

Rotate the view and the page looks right on your screen. Nothing in the file changes. Send it, and the recipient sees the original orientation.

The tell: if the rotation vanishes when you close and reopen the file, it was a view rotation.

## Making it permanent

To change the stored attribute:

1. Open [Rotate PDF](/rotate-pdf).
2. Add the sideways document.
3. Rotate the pages that need it — 90 degrees clockwise or anti-clockwise, or 180 for upside down.
4. Download.

The downloaded file has the rotation written into the page objects. Every viewer, on every device, now shows it correctly, because there is nothing left to interpret.

It runs in your browser, so scanned personal documents are not uploaded anywhere.

## Why scanners produce this in the first place

Two causes, and knowing which you have prevents a recurrence:

**Automatic document feeders** pull pages in whatever orientation you loaded them. Load a landscape page into a portrait-oriented feeder and it is captured rotated. The scanner is doing exactly what it was told.

**Auto-rotate detection** in scanner software tries to work out orientation from the text, and it fails on documents with little text, on forms, on tables, and on anything with mixed orientations. It is right most of the time, which is precisely why the failures are irritating.

If you scan regularly and always get sideways output, turn auto-rotate off in your scanner software and control orientation yourself. Predictably wrong beats unpredictably wrong.

## When only some pages are wrong

Common with a mixed stack — a report where the appendix charts are landscape, say. Rotate the affected pages individually rather than everything at once; rotating the whole document just moves the problem to the pages that were fine.

If the pattern is regular — every third page, all the even pages — it usually means the feeder was loaded inconsistently, which is worth fixing at the scanner rather than page by page afterwards.

## 180 degrees is a different problem

Upside-down pages, rather than sideways ones, almost always mean the paper stack was loaded reversed. Rotating 180 fixes it, but check whether the *page order* is also reversed — if the scanner took the stack from the wrong end, you may need [Organize PDF](/organize-pdf) to reverse the sequence as well as the orientation. Fixing the rotation and missing the order produces a document that reads correctly page by page and makes no sense overall.

## Rotation and OCR

If you are planning to run OCR on a scanned document, rotate it properly first. OCR engines read horizontally; a sideways page produces either nothing or nonsense. Some engines auto-detect orientation, but not reliably, and it costs nothing to hand them a correctly oriented file.

The same applies to text extraction and to anything automated that will consume the document later.
`,
    faqs: [
      { question: "Why does my PDF rotation not save?", answer: "Most viewers apply a temporary view rotation that affects only your screen and never touches the file. The giveaway is that it disappears when you close and reopen the document. You need a tool that writes the rotation into the page objects themselves." },
      { question: "Can I rotate just some pages of a PDF?", answer: "Yes — rotate the affected pages individually. Rotating the whole document only shifts the problem onto the pages that were already correct, which is a common way to make things worse." },
      { question: "How do I stop my scanner producing sideways PDFs?", answer: "Turn off auto-rotate detection in your scanner software and set the orientation yourself. Auto-rotate infers orientation from text and fails on forms, tables and image-heavy pages — being predictably wrong is easier to work around than being intermittently wrong." },
      { question: "Should I rotate before or after running OCR?", answer: "Before, always. OCR engines read horizontally and a sideways page yields nothing useful. Some claim to auto-detect orientation but it isn't reliable, and handing them a correctly oriented file costs nothing." },
    ],
  },

  {
    slug: "add-page-numbers-thesis-dissertation",
    title: "Adding Page Numbers to a Thesis PDF After It's Already Exported",
    excerpt: "University submission portals are strict about pagination, and re-exporting from Word to fix it often breaks something else. Here's how to number the PDF directly.",
    date: "2026-07-06",
    category: "how-to",
    readingTime: 6,
    relatedTool: "/add-page-numbers",
    keywords: ["add page numbers to pdf", "thesis pdf page numbers", "number pdf pages after export", "dissertation pdf pagination", "add page numbers pdf free"],
    content: `
Your thesis is exported, formatted, and the figures finally sit where you put them. Then you notice the pagination is wrong — the numbering restarts at the appendix, or the front matter is numbered when it should not be, or the submission guidelines want numbers bottom-centre and yours are top-right.

Going back to Word and re-exporting is the obvious move and frequently the wrong one, because in a long document with embedded figures and equations, re-exporting is how the layout shifts and something that was fine last week suddenly is not.

## Numbering the PDF directly

1. Open [Add Page Numbers](/add-page-numbers).
2. Add your PDF.
3. Set the position, the font size, and which page numbering starts on.
4. Download.

The numbers are drawn into the pages, so they behave like any other page content — they print, they survive being merged into another document, and they display identically everywhere.

The file is processed in your browser, which matters for unpublished research.

## Skipping the front matter

Almost every university requires that the title page is not numbered, and often that the abstract and acknowledgements are not either. Set the tool to start numbering after those pages.

The question that follows is whether the first numbered page should read "1" or continue the count including the skipped pages. Check your institution's guidelines — both conventions exist:

* **Restart at 1** on the first body page, with front matter unnumbered. Most common in the sciences.
* **Continue the count**, so if there are four front pages the first body page reads "5". Common where front matter uses roman numerals.

If your guidelines specify roman numerals for front matter and arabic for the body, that is a two-pass job: [split](/split-pdf) the document, number each part appropriately, then [merge](/merge-pdf) it back together.

## Position and margins

Standard placements, and when each is expected:

* **Bottom centre** — the default for most thesis guidelines and the safest choice if yours is silent on the matter.
* **Bottom right** — common in engineering and computer science departments.
* **Top right** — usual for journal-style submissions.

Watch the margin. If your document is bound, the inside margin is wider than the outside one, and a number placed at a fixed distance from the edge sits visually off-centre once bound. If your guidelines specify a binding margin, allow for it.

Also check the number does not land on existing content. Long tables and full-page figures often run close to the bottom of the page, and a page number dropped on top of a table row is worse than no page number.

## Check these pages specifically

After numbering, open the file and inspect:

**The first numbered page.** Confirm it is the page your guidelines say it should be, with the number they specify.

**Every landscape page.** Rotated pages are where numbering goes wrong most often — the number may end up rotated with the page, or in a position that reads oddly.

**Full-page figures and tables.** Look for collisions with existing content.

**The last page.** Confirm the count ends where you expect. An off-by-one here usually means front matter was miscounted.

## If you have to renumber

Numbers drawn into a PDF cannot be edited afterwards — they are page content now, not a field. If you get the settings wrong, go back to the un-numbered original and do it again. Keep that original until the submission is accepted.

That is a genuine argument for getting pagination right in Word before exporting, where it stays editable. The PDF route is the pragmatic answer when re-exporting risks disturbing a layout you have already fought with.
`,
    faqs: [
      { question: "Can I add page numbers to a PDF without the original Word file?", answer: "Yes. The numbers are drawn directly into the PDF pages, so you don't need the source document — useful when re-exporting from Word risks shifting a layout you've already settled." },
      { question: "How do I skip the title page and abstract?", answer: "Set the numbering to start after them. Then check your institution's guidelines on whether the first numbered page should read '1' or continue a count that includes the skipped pages — both conventions are in use." },
      { question: "My thesis needs roman numerals for front matter and arabic for the body.", answer: "That's a two-pass job: split the document at the boundary, number each part with its own scheme, then merge the two back together." },
      { question: "Can I remove or change page numbers after adding them?", answer: "No — once drawn, they're page content rather than an editable field. Keep your un-numbered original until the submission is accepted, so you can redo it if the settings turn out to be wrong." },
    ],
  },

  {
    slug: "csv-to-json-without-uploading",
    title: "Converting CSV to JSON Without Uploading Your Data Anywhere",
    excerpt: "Most CSV-to-JSON converters send your file to a server. When the CSV contains customer records, that's a problem. Here's the browser-based alternative and its limits.",
    date: "2026-07-13",
    category: "how-to",
    readingTime: 5,
    relatedTool: "/csv-to-json",
    keywords: ["csv to json", "convert csv to json online", "csv to json without upload", "csv to json free converter", "csv to json private"],
    content: `
You have a CSV of customer records, or transactions, or survey responses, and you need it as JSON to feed an API or a test fixture. The first three results on Google all want you to upload the file to their server.

For a list of countries, fine. For anything with real people's data in it, that is a data transfer to a third party you know nothing about — and depending on where you work, one you may not be permitted to make.

## The browser-based route

1. Open [CSV to JSON](/csv-to-json).
2. Paste your CSV or load the file.
3. Copy the JSON out, or download it.

The parsing runs in your browser as JavaScript. Nothing is transmitted. You can verify that by opening your browser's developer tools, switching to the Network tab, and watching that no request fires when you convert.

That verifiability is the point. "We delete your files after an hour" is a promise. An empty Network tab is evidence.

## What the conversion produces

Given a CSV like this:

name,email,signups
Ada,ada@example.com,3
Grace,grace@example.com,7

you get an array of objects, one per row, with the header row supplying the keys:

[{"name":"Ada","email":"ada@example.com","signups":"3"}, ...]

Note that "3" comes out as a string, not a number. That is deliberate and correct: CSV has no type information, so a converter that guessed types would eventually turn a product code like 00123 into the number 123, or a version string like 1.10 into 1.1. Both are real bugs that have shipped in real systems.

If you need numbers, cast them on the way in. It is one line in whatever language you are using, and it puts the decision where it belongs — with the person who knows what the column means.

## Quoted fields and embedded commas

The classic CSV trap: a field containing a comma.

id,address,city
1,"221B Baker Street, Marylebone",London

A naive split on commas breaks this into four fields instead of three. Proper CSV parsing respects double quotes and treats a doubled quote inside a quoted field as a literal quote character. Our parser handles both.

If your output has fields shifted one column across, an unquoted comma in the source is nearly always why. Check the row that first goes wrong.

## Where this tool stops

Being clear about the limits so you do not discover them halfway through:

**Flat structure only.** You get one JSON object per CSV row, with keys from the header. It will not infer nesting from column names like "address.city" — you get a key literally called "address.city". Reshaping nested structures is a job for a script.

**The first row must be the header.** A CSV that starts with a title line or blank rows will use that as the keys. Trim the file first.

**Very large files depend on your machine.** Everything runs in your browser, so memory is your laptop's memory. A few tens of thousands of rows is comfortable. For a multi-gigabyte export, use a command-line tool.

**Encoding matters.** UTF-8 works properly. A CSV exported from an older Windows application in Windows-1252 may show mangled accented characters. Re-export as UTF-8 if you see that.

## For repeated work, script it

If this is a one-off, a browser tool is the fastest path. If you are doing it weekly, write the five lines — Python's csv and json modules, or jq, or Node's csv-parse. It is quicker after the second time and it fits into a pipeline. Browser tools are best for the ad-hoc case where opening an editor is the slow part.
`,
    faqs: [
      { question: "Is it safe to convert a CSV with personal data online?", answer: "Only if the conversion happens in your browser rather than on a server. Ours parses locally — open your developer tools, watch the Network tab, and confirm nothing is sent. With any other converter, check first." },
      { question: "Why are my numbers coming out as strings in the JSON?", answer: "Deliberately. CSV carries no type information, so guessing would eventually turn a product code like 00123 into 123 or a version string like 1.10 into 1.1. Cast the columns you know are numeric on your side, where you know what each one means." },
      { question: "Can it handle commas inside quoted fields?", answer: "Yes. The parser respects double-quoted fields and treats a doubled quote inside one as a literal quote. If your output columns are shifted, look for an unquoted comma in the first row that goes wrong." },
      { question: "How large a CSV can I convert?", answer: "It runs in your browser, so your machine's memory is the limit. A few tens of thousands of rows is comfortable on a normal laptop. For very large exports, use a command-line tool instead." },
    ],
  },

  {
    slug: "resize-image-for-passport-photo",
    title: "Resizing a Photo to Passport or Visa Photo Specifications",
    excerpt: "Application portals reject photos for dimensions, file size and aspect ratio, usually without saying which. Here's how to hit the spec without starting over.",
    date: "2026-07-20",
    category: "how-to",
    readingTime: 6,
    relatedTool: "/resize-image",
    keywords: ["resize photo for passport", "passport photo size online", "visa photo dimensions", "resize image to 35x45mm", "passport photo file size"],
    content: `
Passport and visa portals reject photos for three separate reasons and usually tell you about only one. Getting through generally means satisfying all three at once: pixel dimensions, file size, and aspect ratio.

## The three requirements

**Pixel dimensions.** Often given in millimetres (35x45mm is the common European and Indian standard) which you have to convert. At 300 DPI, 35x45mm is roughly 413x531 pixels. US passport photos are 2x2 inches, which is 600x600 at 300 DPI.

**File size.** Frequently capped between 20KB and 240KB depending on the portal. Some also specify a *minimum*, which catches people who compress too hard.

**Aspect ratio.** This is the one that causes silent failures. If the spec is 35x45mm and your photo is square, resizing it to 413x531 will stretch the face. You need to crop to the right proportions first, then resize.

## The order that works

Crop first, then resize, then compress. Doing it in any other order means redoing steps.

If the form is an India government or bank upload, you often need pixels **and** a KB band in one file (Passport Seva 630×810 at 10–250 KB, UPSC 413×531 at 20–300 KB, bank 200×230 at 20–50 KB). The dedicated [passport photo maker](/passport-photo) does that crop + JPEG + KB pass in one step. Use Resize Image when you only need dimensions.

1. **Crop to the aspect ratio** in your phone's photo editor or any image editor. For 35x45mm that is a 7:9 ratio; for a 2x2 inch US photo it is square. Get the head position right at this stage — most specs want the head to occupy 70-80% of the frame height with a small gap above.
2. **Resize to the pixel dimensions** with [Resize Image](/resize-image). Since the crop already matches the aspect ratio, this scales cleanly with no distortion.
3. **Compress if needed** with [Image Compressor](/image-compressor) to bring the file under the size cap.

## Why not just resize?

Because resizing changes dimensions, not proportions. Force a square photo into a 413x531 box and either the face is stretched vertically, or the tool pads it with bars, or it crops arbitrarily — usually taking the top of the head off.

The rejection message will say "photo does not meet specifications" and you will have no idea which of the three requirements failed. Cropping deliberately, before you resize, removes the guesswork.

## Hitting a small file size without ruining the face

Some portals cap at 20KB, which is genuinely tight for a colour photograph. In order:

**Resize down first.** File size follows pixel count. A 413x531 image is already small; if you are compressing a 3000x4000 photo to 20KB, resize before compressing rather than crushing the quality of an oversized image.

**Then compress.** Reducing JPEG quality to 70-80% typically cuts file size substantially with no visible change on a photo this small.

**Check the face after.** Compression artefacts show up first around high-contrast edges — glasses frames, hairlines, the boundary between face and background. If those look blocky, you have gone too far.

If you cannot make the cap without visible damage, the source photo is probably the problem. A photo taken in poor light has more noise, and noise compresses badly. Retaking it in even daylight against a plain wall genuinely helps.

## Requirements that resizing cannot fix

Worth knowing before you spend an hour on the wrong problem. Most specs also require:

* A plain, light, uniform background
* Neutral expression, mouth closed, eyes open and visible
* No glasses in many countries now, and no glare or heavy frames where they are allowed
* No head covering except for religious reasons, with the full face visible
* Even lighting with no shadows on the face or behind the head

No amount of resizing addresses any of those. If your photo has a patterned background or a shadow behind the head, retake it. Ten minutes with a phone against a white wall in daylight beats an hour of editing and a rejection three weeks later.

## Keep the original

Save the full-resolution original before you start. Portals differ, and if this application wants 413x531 at 20KB while the next wants 600x600 at 240KB, you want to re-derive both from the original rather than upscaling an already-compressed small file. Upscaling a 20KB image never ends well.
`,
    faqs: [
      { question: "What pixel size is a 35x45mm passport photo?", answer: "About 413x531 pixels at 300 DPI. US 2x2 inch photos are 600x600 at the same DPI. Check your specific portal, since some ask for a different DPI and the pixel count changes with it." },
      { question: "Why does my face look stretched after resizing?", answer: "Your photo's aspect ratio didn't match the target. Crop to the right proportions first — 7:9 for 35x45mm, square for 2x2 inch — then resize. Resizing alone changes dimensions, not proportions." },
      { question: "How do I get a passport photo under 20KB?", answer: "Resize to the target pixel dimensions first, then compress. Crushing a 3000x4000 photo down to 20KB destroys quality, whereas a 413x531 image reaches that size easily. Check the eyes, glasses and hairline afterwards for compression artefacts." },
      { question: "Can resizing fix a photo with the wrong background?", answer: "No. Background, expression, lighting and head covering rules are all content requirements that no amount of editing addresses properly. Retaking the photo against a plain wall in daylight is faster than fighting it." },
    ],
  },

  {
    slug: "split-pdf-bank-statement-by-month",
    title: "Splitting a Bank Statement PDF Into Separate Months",
    excerpt: "Annual statement bundles arrive as one long PDF, but forms usually want three specific months. Here's how to pull them out without uploading your finances anywhere.",
    date: "2026-07-24",
    category: "how-to",
    readingTime: 5,
    relatedTool: "/split-pdf",
    keywords: ["split bank statement pdf", "separate pdf by month", "extract months from statement pdf", "split pdf pages free", "bank statement pdf pages"],
    content: `
Banks hand you a year in one download. Mortgage applications, visa applications and rental checks want three specific months. So you need pages 34 to 51 out of a 200-page file that contains your entire financial year.

## Do it locally

The first consideration here is not convenience, it is that this document lists every transaction you made for a year. Uploading it to an unknown web service to save two minutes is a poor trade.

[Split PDF](/split-pdf) runs in your browser. The file is read by JavaScript on your own machine and never transmitted. You can confirm this in your browser's Network tab — no request fires when you split.

## Finding the boundaries

Statement bundles rarely have neat one-page-per-month structure, so before splitting, find where each month starts:

Open the PDF and use **Ctrl+F** to search for a month name — "March", or your bank's period format like "01/03/2026". This jumps you to the first page of that month and gives you the starting page number.

Do the same for the following month; the page before that is your end page.

Note both numbers, then repeat for each month you need. Two minutes of this beats splitting three times and discovering the boundaries were wrong.

## Splitting

Once you have the ranges:

1. Open [Split PDF](/split-pdf) and add the bundle.
2. Enter the range for the first month, for example 34-51.
3. Download.
4. Repeat for each month you need.

Each download is a self-contained PDF that opens anywhere.

## The page-number trap

Statement PDFs often print their own page numbers — "Page 3 of 12" — that restart with each statement period. The PDF's internal page numbering runs straight through from 1 to 200.

Always use the position shown in your viewer's page counter, not the number printed on the page. Mixing these up is the single most common reason a split comes out wrong.

## Whether to combine the months afterwards

Depends what you were asked for:

**"Last three months of statements"** — usually means three separate documents. Send three files.

**"Statements covering the last three months"** — often accepts one combined PDF. If the months are consecutive, split them as a single range rather than splitting three times and merging. Fewer steps, no chance of ordering mistakes.

If you do need to combine non-consecutive months, split each and then use [Merge PDF](/merge-pdf), checking the order afterwards.

## Size limits

Statement PDFs are usually text-based and light, but banks sometimes issue them as scanned images, which makes them large. If the portal has an upload cap, run the split file through the [compressor](/compress-pdf).

Check the numbers after compressing. Statement figures are the entire point of the document, and a blurry decimal point in a balance is exactly the kind of thing that gets an application queried. Compress only as far as you need to and check the result at 100% zoom.

## What about password-protected statements?

Many banks issue statements encrypted with your date of birth or part of your account number. Those cannot be split until the password is removed, and our tools do not currently remove PDF passwords.

The reliable route: open the statement in a PDF viewer, enter the password, then print to PDF. That produces an unprotected copy you can split. Note that printing re-renders the pages, so the text layer may be flattened — fine for an upload that a human will read, less good if anything needs to search the text afterwards.
`,
    faqs: [
      { question: "Is it safe to split a bank statement PDF online?", answer: "Only with a tool that works in your browser. Ours reads the file locally and never uploads it, which you can verify in the Network tab of your developer tools. Given the document lists a year of transactions, this is worth checking before using any tool." },
      { question: "How do I find where each month starts in the PDF?", answer: "Use Ctrl+F to search for the month name or your bank's date format. That jumps you to the first page of that period. Search the following month too — the page before it is your end page." },
      { question: "The page numbers on the statement don't match the PDF page numbers.", answer: "Statement bundles usually print their own 'Page 3 of 12' numbering that restarts each period, while the PDF counts straight through. Always go by your viewer's page counter." },
      { question: "My bank statement is password protected and won't split.", answer: "It has to be decrypted first, and we don't currently offer password removal. Open it in a viewer with the password, then print to PDF to get an unprotected copy — bearing in mind that printing can flatten the text layer." },
    ],
  },

  {
    slug: "compress-image-for-website-speed",
    title: "How Much Should You Compress Images for a Website? A Practical Answer",
    excerpt: "Images are usually the largest thing on a page and the easiest to fix. Here are the target sizes that actually matter, and where compression stops helping.",
    date: "2026-05-07",
    category: "tips",
    readingTime: 6,
    relatedTool: "/image-compressor",
    keywords: ["compress image for website", "optimize images for web", "reduce image file size website", "image compression for page speed", "best image size for web"],
    content: `
Images are almost always the heaviest thing on a web page and almost always the easiest thing to fix. A page carrying 6MB of photographs will fail a Core Web Vitals assessment no matter how clean the code is.

## Targets worth aiming for

Rough numbers that hold up in practice:

* **Hero and banner images** — under 200KB. These load first and directly determine your Largest Contentful Paint.
* **In-content photographs** — 80 to 150KB each.
* **Thumbnails and avatars** — under 30KB.
* **Logos and icons** — under 15KB, or use SVG, where a logo is often under 5KB and scales perfectly.
* **Whole page** — under 1MB total for a content page is a reasonable goal, and under 500KB is genuinely fast.

These are guidelines, not rules. A photography portfolio has different constraints from a documentation site. But if a single image on your page is over 500KB, that is worth a look regardless of what kind of site you run.

## Resize before you compress

This is the step people skip, and it matters more than the compression setting.

If your image is displayed at 800 pixels wide but the file is 4000 pixels wide, you are sending five times the pixel data the browser will use. No compression setting fixes that — you are compressing four thousand pixels of width to deliver eight hundred.

Work out the largest size the image is actually displayed at, double it for high-DPI screens, and [resize](/resize-image) to that. An 800px-wide slot means a 1600px image. Then [compress](/image-compressor).

Doing it in this order routinely produces files a fraction of the size for no visible difference, because you removed data that was never going to be seen.

## How far to compress

For JPEG, quality 75 to 85 is the useful band. Below 70 artefacts start showing on detailed images; above 85 you are adding file size for quality nobody perceives on a screen.

The right number depends on content:

* **Photographs with lots of texture** — foliage, crowds, fabric — tolerate lower quality well, because artefacts hide in the detail.
* **Images with large flat areas** — a product on a white background, a gradient sky — show banding and blocking earlier. Keep these higher.
* **Screenshots and images containing text** — compress badly. Text edges are exactly what JPEG handles worst. Use PNG for these, or keep JPEG quality high.

Look at the result at 100% zoom before shipping it. Compression damage is easy to miss in a thumbnail and obvious on a large screen.

## Format matters more than quality settings

Picking the right format often beats fine-tuning compression:

**JPEG** for photographs. Decades of universal support, good compression on continuous-tone images.

**PNG** for screenshots, images with text, and anything needing transparency. Lossless, so no artefacts, but much larger for photographic content.

**WebP** for both, if you can. Roughly 25-35% smaller than JPEG at equivalent quality, with transparency support. Supported in every current browser. Our [WebP converter](/webp-converter) handles conversion in both directions.

**SVG** for logos, icons and simple illustrations. Tiny, infinitely scalable, and often smaller than a PNG of the same graphic at a single size.

## Where compression stops helping

Diminishing returns arrive quickly. Going from 2MB to 200KB transforms your page load. Going from 200KB to 180KB changes nothing a user will notice, and if you got there by dropping quality to 60, you made the page worse for no measurable gain.

Once the largest image on the page is comfortably under a couple of hundred kilobytes, your bottleneck has moved elsewhere — render-blocking scripts, web fonts, third-party embeds. Chasing further image savings at that point is effort spent on the wrong problem.

## Do not forget lazy loading

Compression reduces how much each image weighs. Lazy loading reduces how many get downloaded at all. Adding a loading attribute of "lazy" to images below the fold is a one-word change that often does more for perceived speed than another round of compression.

Keep it off your hero image, though — lazy-loading the thing that defines your LCP makes the metric worse, not better.
`,
    faqs: [
      { question: "What file size should images on a website be?", answer: "Under 200KB for hero images, 80-150KB for in-content photos, under 30KB for thumbnails. If any single image on a page is over 500KB, that's the first thing to look at." },
      { question: "Should I resize or compress first?", answer: "Resize first, always. Compressing a 4000px image that displays at 800px means compressing data the browser will throw away. Resize to twice the display width for high-DPI screens, then compress." },
      { question: "What JPEG quality should I use?", answer: "75-85 for most photographs. Go higher for images with large flat areas, which show banding earlier, and avoid JPEG entirely for screenshots or anything containing text — use PNG there." },
      { question: "Is WebP worth switching to?", answer: "Generally yes. It's roughly 25-35% smaller than JPEG at the same visual quality, supports transparency, and every current browser handles it. The main reason not to is if you need compatibility with very old clients." },
    ],
  },

  {
    slug: "combine-receipts-into-one-pdf",
    title: "Combining Receipts Into One PDF for an Expense Claim",
    excerpt: "Finance teams want one file, not fourteen photos. Here's how to turn a folder of receipt photos into a single tidy PDF that gets approved first time.",
    date: "2026-05-14",
    category: "how-to",
    readingTime: 5,
    relatedTool: "/jpg-to-pdf",
    keywords: ["combine receipts into pdf", "receipts to pdf expense claim", "multiple receipts one pdf", "expense report pdf receipts", "photo receipts to pdf"],
    content: `
Every expense system wants the same thing and almost never says it clearly: one PDF, receipts in a sensible order, each one legible. What people submit instead is fourteen phone photos attached individually, which is why claims come back.

## The quick version

1. Open [JPG to PDF](/jpg-to-pdf) — phone photos are almost always JPG.
2. Select all your receipt photos at once.
3. Drag the thumbnails into the order that matches your expense form.
4. Convert and download the single PDF.

If your photos are PNG, or you screenshotted email receipts, use [PNG to PDF](/png-to-pdf) instead. iPhone photos saved as HEIC need a pass through [HEIC to JPG](/heic-to-jpg) first.

Everything runs in your browser, which matters here — receipts carry card details, addresses and sometimes partial account numbers.

## Order them to match the claim form

This is the difference between a claim approved in one pass and one that comes back with questions.

Whoever reviews your claim is reading a spreadsheet with line items and a PDF with receipts, and trying to match them up. If your receipts are in the order the photos happened to sort, that matching is their problem to solve, and they will push it back to you.

Order the receipts to match your expense lines. If the form lists them by date, order by date. If by category, group by category. Thirty seconds of dragging thumbnails saves a round trip.

## Photograph them properly

Most rejected receipts are rejected for legibility, not for content.

**Use your phone's document scanner**, not the plain camera. Notes on iOS and Google Drive on Android both have one. It flattens perspective, crops to the receipt edge and boosts contrast — the result is smaller and far more readable than a raw photo.

**Flatten the receipt first.** Thermal receipts curl. A curled receipt photographs with a blur band across the middle, usually right where the total is.

**Get even light.** Photograph on a plain surface near a window. Overhead light directly behind you casts your own shadow onto the receipt.

**Include the whole thing.** Merchant name, date, itemised lines, total, and payment method. Cropping tightly to the total is the single most common reason a receipt gets queried.

## What reviewers actually check

Worth knowing, because it tells you what must be legible:

* The merchant name and the date
* The total amount and the currency
* The tax or VAT line, if you are claiming it
* The last four digits of the card, where the policy requires matching to a statement

If those five things are crisp, the rest can be imperfect.

## Keeping the file size sensible

Fourteen phone photos at full resolution makes a PDF of 30MB or more, and plenty of expense systems cap uploads at 10MB.

Run the finished PDF through the [compressor](/compress-pdf) targeting 5MB or so. Receipt photos compress well — they are high-contrast text on plain backgrounds. Then check the five things listed above are still readable.

Better still, use a document scanner app at capture time. A scanned receipt is a few hundred kilobytes to begin with, so fourteen of them make a PDF that needs no compression at all.

## One PDF per claim, not per month

A practical convention that avoids trouble: build one PDF per expense claim, matching the claim you are submitting. Bundling three months of receipts into one file means that when finance queries a single line, you are both hunting through forty pages to find it.

If you have already built a large bundle and need one receipt out of it, [Split PDF](/split-pdf) extracts individual pages.
`,
    faqs: [
      { question: "What order should receipts be in?", answer: "The same order as the lines on your expense form. Whoever reviews the claim is matching a spreadsheet against your PDF — if the order matches, it's approved in one pass; if it doesn't, the matching becomes their problem and it comes back to you." },
      { question: "My receipt photos make a PDF that's too large to upload.", answer: "Run it through the compressor targeting around 5MB, then check that merchant name, date, total, tax line and card digits are still crisp. Better still, capture receipts with a document scanner app, which produces small files from the start." },
      { question: "Should I photograph receipts or scan them?", answer: "Use your phone's document scanner — Notes on iOS, Google Drive on Android. It flattens perspective, crops to the receipt edge and boosts contrast, giving a smaller and more legible file than a raw camera photo." },
      { question: "My iPhone receipt photos won't convert.", answer: "They're probably HEIC rather than JPG. Run them through HEIC to JPG first, then combine. Or set Settings → Camera → Formats to 'Most Compatible' so the phone shoots JPG in future." },
    ],
  },

  {
    slug: "webp-to-jpg-windows",
    title: "WebP Images Won't Open? Converting Them to JPG",
    excerpt: "You saved an image from a website and got a .webp file that half your software refuses to open. What it is, and how to get a usable JPG.",
    date: "2026-05-21",
    category: "how-to",
    readingTime: 5,
    relatedTool: "/webp-converter",
    keywords: ["webp to jpg", "convert webp to jpg free", "open webp file", "webp won't open windows", "save webp as jpg"],
    content: `
You right-clicked an image on a website, saved it, and got a file ending in .webp. Now Photoshop will not open it, the print shop rejected it, and the form you are uploading to says the format is unsupported.

## What WebP is

WebP is an image format Google introduced in 2010 to replace both JPEG and PNG. It genuinely is better: roughly 25-35% smaller than JPEG at the same visual quality, with support for transparency and animation. Which is why it has spread — most websites now serve WebP to browsers that accept it, which is all of them.

The problem is everything that is not a browser. Older versions of Photoshop, many print workflows, a lot of upload validators and plenty of desktop software still do not accept it. So you end up with a file that displays perfectly in Chrome and is useless everywhere else.

## Converting it

1. Open the [WebP converter](/webp-converter).
2. Drop the .webp file in.
3. Download it as JPG or PNG.

It runs in your browser, so nothing is uploaded.

## JPG or PNG?

Pick based on what the image contains, not on habit:

**JPG** if it is a photograph. Smaller files, universal support, and the lossy compression is invisible on photographic content.

**PNG** if the image has transparency, or contains text, or is a logo, screenshot or illustration with flat colour areas. PNG is lossless, so no artefacts, at the cost of a larger file.

The transparency point matters. WebP supports transparency; JPG does not. Convert a transparent WebP to JPG and the transparent areas become white. If your logo needs to sit on a coloured background, convert to PNG.

## Avoiding the conversion entirely

If you keep hitting this, the download step is usually where it starts.

**Right-click and "Open image in new tab" first**, then save. Sometimes the site serves a JPG at the direct URL and only converts to WebP for the page.

**Try removing WebP parameters from the URL.** Many CDNs use a query string like "?format=webp" or a path segment like "/webp/". Loading the URL without it often returns the original.

**Take a screenshot instead** for anything you only need visually. Lower quality, but instant and always in a usable format.

**Check whether you can just install support.** Windows 11 handles WebP natively in Photos. Recent Photoshop opens it. If your software is a few versions behind, updating may remove the problem permanently.

## Quality when converting

A WebP is already lossily compressed. Converting to JPG re-encodes it, which is a second lossy pass, so there is some quality loss stacked on top.

In practice this is not visible for normal use. Where it does show:

**Text and sharp edges** pick up visible artefacts fastest. Convert those to PNG instead.

**Images destined for print** should keep as much quality as possible — convert to PNG, which is lossless and avoids the second lossy pass entirely.

**Repeated round trips** — WebP to JPG to WebP to JPG — degrade noticeably. Keep an original in one format and convert from it each time rather than converting a converted file.

## Going the other way

If you are building a website, the conversion you want is usually the reverse: JPG and PNG into WebP, for the file-size savings. The same converter handles that direction. Cutting your image weight by a third is one of the cheapest page-speed improvements available, and every browser in current use supports it.
`,
    faqs: [
      { question: "Why won't my WebP file open?", answer: "WebP is designed for browsers, and plenty of desktop software, print workflows and upload validators still don't accept it. Windows 11 and recent Photoshop handle it natively — if yours don't, updating may fix it permanently." },
      { question: "Should I convert WebP to JPG or PNG?", answer: "JPG for photographs. PNG if the image has transparency, contains text, or is a logo or screenshot with flat colour areas. Converting a transparent WebP to JPG turns the transparent parts white." },
      { question: "Does converting WebP to JPG lose quality?", answer: "Slightly — the WebP is already compressed, so JPG adds a second lossy pass. It's not visible for normal use, but for print or images with text, convert to PNG instead to avoid it entirely." },
      { question: "How do I avoid downloading WebP in the first place?", answer: "Try 'Open image in new tab' and save from there, or strip WebP parameters from the URL — many CDNs use a ?format=webp query string, and loading the URL without it returns the original." },
    ],
  },

  {
    slug: "merge-pdf-what-gets-lost",
    title: "What Actually Gets Lost When You Merge PDFs",
    excerpt: "Merging looks lossless and mostly is — but bookmarks, form data and links behave in ways that surprise people. Here's what survives and what doesn't.",
    date: "2026-05-28",
    category: "tips",
    readingTime: 6,
    relatedTool: "/merge-pdf",
    keywords: ["merge pdf lose bookmarks", "does merging pdf lose quality", "pdf merge form fields", "combine pdf keep links", "merge pdf quality loss"],
    content: `
Merging PDFs is a structural operation: page objects are copied from several documents into one. Nothing is re-rendered, so the visual content comes through exactly as it was. But a PDF contains more than pages, and some of that other material does not survive the trip.

Here is an honest inventory, so you find out now rather than after sending the file.

## What survives, reliably

**Page content.** Text, images, vector graphics, all at original quality. No re-compression, no re-rendering. A merged page is byte-for-byte the same drawing instructions as the source page.

**Text selectability and searchability.** Text stays text. Ctrl+F works across the merged document.

**Page size and orientation.** Each page keeps its own. Merge a landscape report into a portrait one and the landscape pages stay landscape — correct behaviour, though it surprises people who expect uniformity.

**Embedded fonts.** Carried across, so the document renders identically on machines that do not have the fonts installed.

**Image resolution.** Untouched. A 300 DPI scan is still 300 DPI after merging.

## What is usually lost

**Bookmarks and the outline tree.** This is the big one for long documents. If you merge three reports that each had a navigation sidebar, the merged file typically has none. The pages are all there; the way of jumping between them is gone. Most merge tools, ours included, do not rebuild the outline.

**Form fields and entered data.** Interactive forms are the riskiest case. Field definitions may survive, may be dropped, or may collide — two source documents each with a field named "name" cannot both keep it. Any values already entered frequently disappear.

If you are merging filled-in forms, flatten each one first: open it, print to PDF, and the entered values become permanent page content that merges safely. You lose interactivity, which is usually the point.

**Internal links.** A link that pointed to page 12 of its original document either breaks or points to page 12 of the merged file, which is now some unrelated page. External links to websites usually survive; internal navigation usually does not.

**Document metadata.** Title, author, subject and keywords come from one source document or get reset. If metadata matters — for a library submission, say — set it after merging.

**Attachments and embedded files.** Files attached to a PDF are commonly dropped.

**Digital signatures.** Always invalidated, without exception. A signature certifies the document it was applied to; merging creates a different document, so the signature is no longer valid — that is the entire point of a signature. If you need signed documents combined, get the combined document signed.

## What this means in practice

For the ordinary cases — combining scanned pages, assembling receipts, joining chapters, putting a cover page on a report — none of this matters. The pages are what you wanted and the pages are what you get.

Be careful when:

* **The documents are interactive forms.** Flatten first.
* **The documents rely on internal navigation.** A 200-page manual whose usability depends on its bookmark tree loses that.
* **Anything is digitally signed.** Merge and the signature is void.
* **The output must be archival.** Metadata and structure requirements for PDF/A are not preserved by a plain merge.

## Merging does not compress

A common misconception: people expect a merged file to be smaller than the sum of its parts. It generally is not. If three 2MB PDFs merge to roughly 6MB, that is correct — the page content still has to be stored.

Some overlap is deduplicated in good implementations, mainly fonts used by several source documents. That saves a little. It is not compression.

If the merged file is too large, [compress](/compress-pdf) it afterwards as a separate step.

## Order it before, not after

Set the page order by dragging thumbnails before you merge. Fixing the order afterwards means either starting again or reorganising the merged file with [Organize PDF](/organize-pdf) — both slower than getting it right the first time.
`,
    faqs: [
      { question: "Does merging PDFs reduce quality?", answer: "No. Merging copies page objects rather than re-rendering them, so text, images and vector graphics come through at original quality with no re-compression." },
      { question: "Why did my bookmarks disappear after merging?", answer: "Most merge tools don't rebuild the outline tree, so bookmarks from the source documents are dropped. The pages are all present — only the navigation structure is gone. For long manuals that depend on it, this is worth knowing before you merge." },
      { question: "Will my filled-in form data survive a merge?", answer: "Often not. Form field definitions can be dropped or collide when two documents use the same field names, and entered values frequently vanish. Flatten each form first by printing it to PDF, which turns the values into permanent page content." },
      { question: "Is the merged file smaller than the originals combined?", answer: "No — expect roughly the sum of the parts. Good implementations deduplicate shared fonts, which saves a little, but merging isn't compression. Compress the result separately if size matters." },
    ],
  },

  {
    slug: "text-to-pdf-for-printing",
    title: "Turning a Plain Text File Into a Printable PDF",
    excerpt: "Log files, exported notes and code listings print badly straight from a text editor. Converting to PDF first gives you predictable pagination and margins.",
    date: "2026-06-04",
    category: "how-to",
    readingTime: 5,
    relatedTool: "/text-to-pdf",
    keywords: ["text to pdf", "convert txt to pdf free", "print text file as pdf", "txt to pdf converter", "notepad to pdf"],
    content: `
Printing a .txt file straight from Notepad or TextEdit is unpredictable. Margins vary by application, long lines get chopped at the page edge instead of wrapping, and page breaks land wherever they land. For a shopping list that is fine. For a log file you need to annotate, or a code listing for a review, or exported notes you want to read on paper, it is not.

Converting to PDF first fixes the layout once, and it then prints the same way everywhere.

## Converting

1. Open [Text to PDF](/text-to-pdf).
2. Paste your text, or load the .txt file.
3. Set the font size and page size.
4. Download.

The text is laid out with proper margins, wrapped to the page width and paginated automatically. It runs in your browser, so log files and notes containing anything sensitive stay on your machine.

## Choosing a font size

More consequential than it sounds, because it determines how much fits per line before wrapping.

* **11-12pt** for prose you will read continuously. Comfortable, roughly 90 characters per line on A4.
* **9-10pt** for reference material and logs, where you want more on the page and will be scanning rather than reading.
* **8pt** for dense listings. Legible on paper, tiring on screen.

If your content has long lines — log entries, stack traces, wide tables — a smaller size means fewer of them wrap, which makes the output far easier to follow. A wrapped log line splits a single event across two visual rows and makes scanning genuinely harder.

## The line-wrapping problem

Plain text has no concept of page width. A log line can be 300 characters long. When it hits the page edge it wraps, and now one entry occupies three rows with no visual indication that they belong together.

Three ways to handle it:

**Reduce the font size** so more fits per line. Simplest, and often enough.

**Use landscape orientation** if your page size options include it. A landscape A4 page fits roughly 40% more characters per line.

**Pre-process the text** to truncate or reformat the long lines before converting. For logs, stripping timestamps or thread IDs you do not need often brings lines under the wrap threshold.

## Code listings

Text to PDF handles code, with two caveats worth knowing.

**Indentation is preserved** as spaces, so structure survives. Tabs may render at a different width than your editor shows — if precise indentation matters, convert tabs to spaces before pasting.

**There is no syntax highlighting.** The output is monospaced black text. For a code review on paper that is generally fine. If you want colour, print from your editor or IDE, which will apply its own theme.

## Encoding and special characters

If your text contains accented characters, currency symbols, or non-Latin scripts, make sure the source file is UTF-8. A file saved in an older encoding — Windows-1252 is the usual culprit — shows mangled characters after conversion.

Most editors let you check and change this. In Notepad it is in the Save As dialog; in VS Code it is in the status bar at the bottom right.

Emoji and less common symbols may not render at all, depending on what the PDF's embedded font covers. If a character matters and it comes out as a blank box, replace it with text before converting.

## For structured documents

If your text is actually Markdown — with headings, lists and emphasis — use [Markdown to PDF](/markdown-to-pdf) instead. It renders the structure rather than printing the markup characters literally, which is usually what you want.

For plain unstructured text, Text to PDF is the right tool and the simpler one.
`,
    faqs: [
      { question: "What font size should I use converting text to PDF?", answer: "11-12pt for prose you'll read continuously, 9-10pt for logs and reference material where you want more per page. Go smaller if your content has long lines — fewer wrapped lines makes the output much easier to scan." },
      { question: "Why are my long lines wrapping awkwardly?", answer: "Plain text has no page width, so lines longer than the page wrap wherever they hit the edge. Reduce the font size, switch to landscape if available, or trim unnecessary content from long lines before converting." },
      { question: "Does it preserve code indentation?", answer: "Yes, indentation is preserved as spaces. Tabs may render at a different width than your editor shows, so convert tabs to spaces first if exact indentation matters. There's no syntax highlighting — the output is plain monospaced text." },
      { question: "My accented characters came out wrong.", answer: "Your source file probably isn't UTF-8 — Windows-1252 is the usual culprit. Re-save it as UTF-8 in your editor and convert again. Emoji and rarer symbols may still not render if the embedded font doesn't cover them." },
    ],
  },

  {
    slug: "organize-pdf-reorder-delete-pages",
    title: "Reordering and Deleting PDF Pages Without Starting Over",
    excerpt: "Scanned out of order, a duplicate page in the middle, an appendix that belongs at the front. Fixing page order in place beats splitting and re-merging.",
    date: "2026-06-11",
    category: "how-to",
    readingTime: 5,
    relatedTool: "/organize-pdf",
    keywords: ["reorder pdf pages", "delete pages from pdf", "rearrange pdf pages free", "remove page from pdf", "organize pdf pages online"],
    content: `
Documents arrive out of order more often than they should. A feeder pulled two sheets at once, so page 7 is missing and there is a duplicate of page 6. The appendix ended up before the conclusion. Someone scanned the stack from the bottom.

The instinct is to split the file, discard what you do not want and merge the rest back. That works, and it is three tools and a lot of clicking for something that should be one operation.

## Doing it in place

1. Open [Organize PDF](/organize-pdf).
2. Add the document.
3. Every page appears as a thumbnail. Drag them into order, and delete the ones you do not want.
4. Download.

The whole document stays in view, so you can see what you are doing rather than reasoning about page ranges in your head. It runs in your browser, so nothing is uploaded.

## Where this beats split-and-merge

**Deleting scattered pages.** Removing pages 3, 11 and 24 from a 30-page document by splitting means extracting four separate ranges and merging them in order. In a thumbnail view it is three clicks.

**Reordering.** Moving the appendix from the end to the front is a drag. With split-and-merge it means extracting two ranges and merging them in the reverse order.

**Anything you need to see to decide.** If the problem is "some of these pages are duplicates and I need to work out which", thumbnails answer that question directly. Page ranges do not.

Split and merge still win for one case: extracting a large continuous range from a very long document. Pulling pages 200-350 out of a 900-page file is a single range entry, whereas scrolling a thumbnail grid of 900 pages is tedious.

## Working out what is wrong first

Before reorganising, diagnose the pattern. Scanner faults are usually systematic, and recognising the pattern is faster than fixing pages one by one.

**Whole document reversed** — the stack was fed from the wrong end. Reverse the entire order rather than dragging pages individually.

**Every second page blank** — duplex scanning of single-sided originals. Delete all the blanks, which alternate predictably.

**Pairs swapped throughout** — a duplex feeder scanning back-then-front. Systematic, so fix it as a pattern.

**One or two pages out of place** — a genuine misfeed. Drag those individually.

If the pattern is systematic, it is also worth fixing the scanner setting so it does not recur.

## Check before you download

Two things people miss:

**Page count.** If you deleted three pages from a 40-page document, confirm the result has 37. An accidental extra deletion is easy to miss in a thumbnail grid and hard to notice later.

**Landscape pages.** Rotated pages render as landscape thumbnails and are easy to mistake for pages that need reordering. Check the content rather than the shape.

## What organising drops

Same caveats as merging, since the underlying operation is similar: bookmarks, internal links and form field data may not survive. Page content, text and images come through unchanged.

For scanned documents — which is most of what needs reorganising — none of that applies, because a scan has no bookmarks or form fields to lose.

## Deleting pages does not always shrink the file

Removing pages removes their content, so the file usually gets smaller. But not always proportionally: shared resources like embedded fonts and reused images stay if any remaining page still references them.

Deleting half the pages of a text document typically saves less than half the size. If you need a specific size, [compress](/compress-pdf) afterwards rather than expecting deletion alone to get you there.
`,
    faqs: [
      { question: "How do I delete a page from a PDF?", answer: "Open Organize PDF, add the document, and every page appears as a thumbnail — click to delete the ones you don't want, then download. Much faster than splitting into ranges and merging back, especially for scattered pages." },
      { question: "My whole scanned document is in reverse order.", answer: "That means the stack was fed from the wrong end. Reverse the entire order rather than dragging pages individually, and check your scanner's feed direction so it doesn't happen again." },
      { question: "Every other page in my scan is blank.", answer: "The scanner was in duplex mode on single-sided originals. Delete the blanks — they alternate predictably — and switch the scanner to single-sided for the next batch." },
      { question: "Why didn't deleting half the pages halve the file size?", answer: "Shared resources like embedded fonts and reused images stay in the file if any remaining page references them. Deletion removes page content but not necessarily the shared parts. Compress afterwards if you need a specific size." },
    ],
  },

  {
    slug: "watermark-pdf-before-sending-draft",
    title: "Watermarking a Draft Before You Send It (And What a Watermark Really Does)",
    excerpt: "A DRAFT stamp stops people acting on a document that isn't final. Here's how to add one, and an honest account of how much protection it actually provides.",
    date: "2026-06-18",
    category: "how-to",
    readingTime: 5,
    relatedTool: "/watermark-pdf",
    keywords: ["watermark pdf draft", "add draft watermark to pdf", "confidential watermark pdf", "pdf watermark free", "stamp pdf document"],
    content: `
Sending a document for review without marking it as a draft is how a preliminary version ends up signed, forwarded to a client, or quoted back at you six months later. A watermark across every page is cheap insurance.

## Adding one

1. Open [Watermark PDF](/watermark-pdf).
2. Add your document.
3. Type the text — DRAFT, CONFIDENTIAL, a client name, whatever fits.
4. Set the colour, size and opacity.
5. Download.

The stamp is drawn diagonally across the centre of every page. The file is processed in your browser and never uploaded.

## Choosing the opacity

This is the setting that decides whether the watermark works.

* **20-25%** — light grey, present but easy to read past. Right for a long document someone has to actually read.
* **30-40%** — clearly visible without impeding reading. The default choice for most drafts.
* **50-60%** — unmistakable. For documents where the risk of someone treating a draft as final is real.

Too light and people miss it, which defeats the purpose. Too heavy and reviewers struggle with the content, which also defeats the purpose. Start at 30% and look at the result on a page with dense text before committing.

Colour matters too: mid-grey reads as deliberate, red reads as urgent, and both work. Very light yellow or pale blue often disappears entirely once printed in black and white.

## What a watermark actually protects against

Being straight about this, because a lot of tools are not.

**It does protect against confusion.** Someone opening a document marked DRAFT knows not to countersign it. Someone forwarding a page marked CONFIDENTIAL — YOUR NAME knows it is traceable. This is real and it is the main reason to use one.

**It does not protect against a determined person.** The watermark is drawn into the page content, not encrypted. Anyone with a proper PDF editor can select and delete it, and there is no way to make that harder in a PDF that also has to be readable.

So: a watermark is a signal and a deterrent, not a lock. If your document genuinely must not be redistributed, the answer is access control — send it through a system that tracks who opened it — not a graphic on the page.

## Personalised watermarks for tracking

A technique worth knowing: when circulating a confidential document to several people, watermark each copy with the recipient's name.

If a copy later appears somewhere it should not, the watermark identifies which recipient it came from. That knowledge alone changes behaviour — people are more careful with a document that has their name across it.

It means producing one file per recipient, which is a few minutes for a distribution list of ten. For sensitive material it is usually worth it.

## What to watch after applying

**Check a dense page.** Somewhere with a full page of text or a detailed table. If the watermark makes those hard to read, reduce the opacity.

**Check any page with a signature block.** A DRAFT stamp across a signature line is exactly right for a draft, and exactly wrong if you later reuse the file as the final version.

**Keep the un-watermarked original.** The watermark becomes page content and cannot be removed cleanly afterwards. When the draft becomes final, you want to generate the final from the clean source, not try to strip the stamp.

## Watermark last

If your workflow also involves merging, splitting or compressing, watermark at the end. Watermarking first and then merging means the stamp may be inconsistent across sections, and re-compressing a watermarked file can make the stamp blotchy where it overlaps images.
`,
    faqs: [
      { question: "What opacity should a DRAFT watermark be?", answer: "30-40% for most documents — clearly visible without impeding reading. Go to 20-25% for long documents people have to read carefully, or 50-60% where there's a real risk of someone treating the draft as final." },
      { question: "Can someone remove the watermark?", answer: "Yes, with a proper PDF editor. It's drawn into the page content rather than encrypted, and there's no way to make it harder to remove in a document that also has to be readable. Treat it as a deterrent and an attribution mark, not a lock." },
      { question: "How do I track who leaked a confidential document?", answer: "Watermark each copy with the recipient's name before sending. If a copy surfaces later, the watermark identifies the source — and knowing their name is on it makes people noticeably more careful in the first place." },
      { question: "Should I watermark before or after merging?", answer: "After. Watermarking first then merging can leave the stamp inconsistent across sections, and re-compressing a watermarked file can make it blotchy where it overlaps images." },
    ],
  },

  {
    slug: "pdf-to-png-for-presentation-slides",
    title: "Getting PDF Pages Into a Presentation as Images",
    excerpt: "You need a page from a PDF on a slide. Screenshotting gives you a blurry crop. Converting the page to PNG gives you something that holds up on a projector.",
    date: "2026-06-25",
    category: "how-to",
    readingTime: 5,
    relatedTool: "/pdf-to-png",
    keywords: ["pdf page to image", "pdf to png high quality", "insert pdf page into powerpoint", "pdf page as picture", "convert pdf page to image free"],
    content: `
You want a chart from a report on slide 6. The obvious move is a screenshot, and the obvious result is a slightly blurry rectangle that looked fine on your laptop and looks terrible on the projector.

The reason is resolution. A screenshot captures what is on your screen — maybe 150 pixels across for that chart. A projector or a large monitor wants considerably more.

## Converting the page properly

1. Open [PDF to PNG](/pdf-to-png).
2. Add the PDF.
3. Convert — pages are rendered at 300 DPI.
4. Download the page you need and drop it onto your slide.

At 300 DPI an A4 page renders at roughly 2480x3508 pixels. Scale that down to fit a slide and it stays sharp, because you are shrinking a large image rather than stretching a small one.

## PNG or JPG?

For anything from a document, use PNG.

PNG is lossless, so text edges and thin chart lines stay crisp. JPEG compression is built for photographs and produces visible artefacts around high-contrast edges — exactly what text and line art are made of. A JPEG of a chart gets a faint halo around every line.

Use [PDF to JPG](/pdf-to-jpg) only if the page is a full-page photograph, or if file size is a genuine constraint and the page has no fine detail.

## Cropping to just the chart

The conversion gives you the whole page. You usually want one figure from it.

Two approaches:

**Crop in your presentation software.** PowerPoint, Keynote and Google Slides all have a crop tool. Insert the full page, crop to the figure, and the original stays intact underneath so you can adjust later. This is usually the better option.

**Crop the image first** in any image editor if you want a clean asset to reuse.

Either way, crop from the 300 DPI render rather than screenshotting the region — you keep the resolution.

## Keep it as a picture, not as text

A tempting alternative is extracting the text and rebuilding the figure natively on the slide. Sometimes right, often not.

**Rebuild it natively** if it is a simple table of a few rows, or a short quote. It will match your deck's styling and stay editable.

**Keep it as an image** if it is a chart, a diagram, a form, or anything where layout carries meaning. Rebuilding a complex figure by hand takes an hour and usually looks worse.

An image also guarantees it renders identically everywhere, which matters when you are presenting from someone else's machine.

## Attribution

If the figure came from a published report, put the source on the slide. A small line under the figure — publication, year, page — is standard practice and takes five seconds. It also saves the awkward question from the audience about where the number came from.

## Batch converting a whole document

If you need many pages — turning a full report into a slide deck, or extracting every figure — convert the whole PDF at once and download the pages as a set, then pick what you need. That is faster than converting one page at a time and means you have the rest available when the deck changes.

For a very long document, convert the range you need with [Split PDF](/split-pdf) first, then convert the extract to images. Rendering 400 pages at 300 DPI when you need six is a lot of waiting for nothing.
`,
    faqs: [
      { question: "Why does my screenshot of a PDF look blurry on a projector?", answer: "A screenshot captures screen resolution — often only a couple of hundred pixels for the region you want. Converting the page at 300 DPI gives you roughly 2480x3508 pixels for an A4 page, which stays sharp when scaled down onto a slide." },
      { question: "Should I use PNG or JPG for PDF pages?", answer: "PNG for anything containing text or line art. It's lossless, so edges stay crisp. JPEG produces visible halos around high-contrast edges, which is exactly what text and chart lines are. Use JPG only for full-page photographs." },
      { question: "How do I get just one chart rather than the whole page?", answer: "Insert the full-page image into your slide and use your presentation software's crop tool. The original stays intact underneath so you can readjust, and you keep the full 300 DPI resolution rather than screenshotting a region." },
      { question: "Should I rebuild the table on the slide instead?", answer: "Rebuild simple tables of a few rows — they'll match your deck's styling and stay editable. Keep charts, diagrams and forms as images, where layout carries meaning and rebuilding by hand takes an hour and looks worse." },
    ],
  },

  {
    slug: "json-to-csv-for-excel",
    title: "Getting JSON Data Into Excel via CSV",
    excerpt: "An API returned JSON and someone wants it in a spreadsheet. Here's the conversion, plus the nested-data problem that catches everyone out.",
    date: "2026-07-02",
    category: "how-to",
    readingTime: 5,
    relatedTool: "/json-to-csv",
    keywords: ["json to csv", "json to excel", "convert json to spreadsheet", "json to csv free online", "open json in excel"],
    content: `
An API gave you JSON. A colleague wants it in Excel. Excel does have a JSON importer buried in Power Query, but it is fiddly and produces a nested structure that then has to be expanded column by column. CSV is the shorter path.

## Converting

1. Open [JSON to CSV](/json-to-csv).
2. Paste your JSON or load the file.
3. Download the CSV and open it in Excel or Sheets.

It runs in your browser, so API responses containing customer or user data are not sent to a third party.

## What the input needs to look like

The conversion expects an **array of objects** — the shape most APIs return for a list:

[
  {"id": 1, "name": "Ada", "signups": 3},
  {"id": 2, "name": "Grace", "signups": 7}
]

Each object becomes a row, and the object keys become the column headers. That maps cleanly onto a spreadsheet.

If your JSON is a single object rather than an array, wrap it in square brackets to make it an array of one.

If your data is nested inside a wrapper — which is very common, since APIs like to return metadata alongside results:

{"status": "ok", "count": 2, "data": [ ... ]}

then extract the inner array first. Copy just the part inside "data" and convert that. Feeding the whole response gives you one row with a column containing the entire array as text, which is not what anyone wants.

## The nested-object problem

This is where JSON and CSV genuinely do not agree, and no converter can fully solve it.

CSV is flat: rows and columns, one value per cell. JSON is a tree. When an object contains another object or an array, there is no single correct way to flatten it.

For example, a record where each user has a list of orders cannot become one row without either losing the orders or duplicating the user across several rows. Both are valid choices and both lose something.

Practical approaches:

**Flatten before converting.** Reshape the JSON into a flat array of objects, one per output row, using whatever language you have to hand. This gives you full control over the shape.

**Convert nested parts separately.** Export users as one CSV and orders as another, with a shared ID column. This is how the data would be stored relationally anyway, and it is often the right answer.

**Accept the text.** For a quick look, having a nested object land in a cell as JSON text is sometimes good enough — you can read it, even if you cannot sort by it.

## Excel and CSV: three things that go wrong

**Long numbers become scientific notation.** A 16-digit order ID displays as 1.23457E+15 and, worse, Excel may round it. Import the CSV via Data → From Text/CSV and set that column to Text rather than double-clicking the file.

**Leading zeros vanish.** Postcodes, product codes and phone numbers lose them. Same fix: set the column type to Text on import.

**Dates get reinterpreted.** Excel is aggressive about recognising dates and will happily turn 03/04 into a date in whatever regional format it assumes. Import as Text if the values are not really dates.

All three come from double-clicking the file and letting Excel guess. Using the import dialog and setting column types takes an extra thirty seconds and avoids all of them.

## Character encoding

If your data contains accented characters or non-Latin scripts, save the CSV as UTF-8 and open it via the import dialog, selecting UTF-8 as the encoding. Double-clicking a UTF-8 CSV in Excel on Windows often shows mangled characters, because Excel assumes the regional encoding rather than UTF-8. Google Sheets handles this correctly without intervention.
`,
    faqs: [
      { question: "What JSON structure does the converter need?", answer: "An array of objects — the shape most APIs return for a list. Each object becomes a row and its keys become the column headers. A single object works if you wrap it in square brackets." },
      { question: "My JSON is wrapped in a response object with status and data fields.", answer: "Extract the inner array first and convert just that. Feeding the whole response produces one row with the entire array crammed into a single cell." },
      { question: "How do nested objects and arrays get handled?", answer: "They can't be flattened cleanly — CSV is flat and JSON is a tree, so there's no single correct answer. Either reshape the JSON before converting, or export the nested parts as a separate CSV with a shared ID column, which is how the data would be stored relationally anyway." },
      { question: "Excel turned my long IDs into scientific notation.", answer: "That's Excel guessing column types when you double-click a CSV. Use Data → From Text/CSV instead and set those columns to Text. The same fix prevents leading zeros disappearing and values being reinterpreted as dates." },
    ],
  },

  {
    slug: "svg-to-png-for-social-media",
    title: "Exporting an SVG Logo as PNG at the Right Size",
    excerpt: "Social platforms and most upload forms won't take SVG. Here's how to rasterise a vector logo at the size each platform actually wants.",
    date: "2026-07-09",
    category: "how-to",
    readingTime: 5,
    relatedTool: "/svg-to-png",
    keywords: ["svg to png", "convert svg to png free", "svg logo to png", "export svg high resolution", "svg to png online"],
    content: `
Your logo is an SVG, which is the right way to store a logo — it is tiny, it scales to any size perfectly, and one file covers every use. Then you try to upload it as a profile picture and the platform rejects it.

Almost no social platform accepts SVG. Neither do most upload forms, email clients, or presentation tools. Rasterising to PNG is a routine part of using a vector logo.

## Converting

1. Open [SVG to PNG](/svg-to-png).
2. Add the SVG.
3. Set the output size in pixels.
4. Download.

Transparency is preserved, so a logo with a transparent background stays transparent — which matters when it will sit on a coloured header.

It runs in your browser, so brand assets are not uploaded anywhere.

## Sizes worth having

Export once at each size you actually need rather than exporting one and resizing:

* **Favicon** — 32x32 and 180x180 for the Apple touch icon
* **Social profile pictures** — 400x400 covers most platforms; they downscale from there
* **Open Graph / preview images** — 1200x630
* **Email signature** — 200-400px wide, since email clients handle large images badly
* **Presentation and print** — 2000px or more on the long edge

The reason to re-export from the SVG rather than resizing a PNG is that each export is rendered fresh from the vector at full sharpness. Scaling a 400px PNG up to 2000px gives you a blurry 2000px PNG.

## Small sizes need attention

A logo designed to work on a billboard often does not work at 32 pixels. At favicon size, thin strokes disappear, fine detail turns to mush, and text becomes unreadable.

Check the result at actual size, not zoomed in. If it does not hold up:

**Use a simplified mark.** Most brands have a full logo and a compact symbol version. The symbol is what belongs in a favicon.

**Drop the wordmark.** A logo with the company name beside a symbol should usually become symbol-only below about 64 pixels.

**Thicken strokes.** If you have the source file, a version with heavier strokes specifically for small sizes is worth making once.

## Transparency and where it backfires

Transparent PNGs are usually what you want, with one exception worth knowing.

A logo designed for light backgrounds — dark text, dark strokes — becomes invisible when a platform displays it on a dark background. Dark mode has made this a common failure.

Either export a version with a solid background for those contexts, or maintain a light-on-dark variant of the logo. Checking your profile picture in dark mode takes ten seconds and catches this.

## When the SVG does not render correctly

A few things break in SVG-to-PNG conversion, and they are worth knowing because the fix is at the source:

**Text elements.** If the SVG references a font by name rather than converting text to paths, the renderer substitutes whatever font it has. Convert text to outlines in your design tool before exporting the SVG — this is good practice for logos anyway.

**External references.** An SVG linking to an external image or stylesheet will not render those. Everything must be embedded.

**Filters and blend modes.** Complex SVG filters render inconsistently. If your logo uses drop shadows or blend effects, check the output carefully.

If the PNG looks wrong, open the SVG in a browser first. Browsers are strict renderers, and whatever you see there is close to what you will get.
`,
    faqs: [
      { question: "What size should I export my logo PNG at?", answer: "Export separately at each size you need: 32x32 and 180x180 for icons, 400x400 for social profiles, 1200x630 for preview images, 2000px+ for print. Re-export from the SVG each time rather than scaling a PNG up." },
      { question: "Does converting SVG to PNG keep transparency?", answer: "Yes, transparent areas stay transparent. Watch out for the reverse problem though — a logo with dark strokes becomes invisible on a dark background, so check how it looks in dark mode." },
      { question: "My logo is unreadable at favicon size.", answer: "Most logos aren't designed for 32 pixels. Use your brand's compact symbol rather than the full logo, drop the wordmark below about 64 pixels, and thicken strokes in a dedicated small-size variant if you have the source." },
      { question: "The text in my SVG rendered in the wrong font.", answer: "The SVG references the font by name rather than embedding it, so the renderer substituted what it had. Convert text to outlines in your design tool before exporting — good practice for logos regardless." },
    ],
  },

  {
    slug: "base64-encode-image-for-email-css",
    title: "When to Base64-Encode an Image (And When Not To)",
    excerpt: "Base64 embeds an image directly in your HTML or CSS with no separate request. It's genuinely useful in three situations and a mistake in most others.",
    date: "2026-07-16",
    category: "tips",
    readingTime: 5,
    relatedTool: "/base64",
    keywords: ["base64 encode image", "base64 image css", "data uri image", "convert image to base64", "base64 encoder online"],
    content: `
Base64 encoding turns binary data into text, which lets you embed an image directly inside HTML, CSS, JSON or an email rather than linking to a separate file. It is a genuinely useful technique that is also frequently misapplied.

## Encoding something

1. Open the [Base64 tool](/base64).
2. Paste text or load a file.
3. Copy the encoded string, or decode one in the other direction.

Encoding and decoding both happen in your browser, so API keys, certificates and private assets are not sent anywhere.

## The cost, up front

Base64 makes data about **33% larger**. Three bytes of binary become four characters of text. That is inherent to the encoding and no tool avoids it.

So a 30KB PNG becomes roughly 40KB of text in your stylesheet. Whether that trade is worth it depends entirely on what you gain.

## Where it genuinely helps

**Tiny assets in CSS.** An icon, a small texture, a 1px gradient. Under about 2KB, the encoding overhead is smaller than the cost of a separate HTTP request — the round trip, the headers, the connection setup. Embedding is faster.

**Images in HTML email.** This is the strongest case. Email clients block external images by default, so a linked image shows as a broken placeholder until the recipient clicks "show images". A base64 data URI renders immediately. For a logo in a signature or a transactional email, this is the difference between your email looking right and looking broken.

Note that Gmail historically stripped data URIs in some contexts, and support varies. Test in the clients you care about.

**Self-contained files.** A single HTML file that must work with no network — an offline report, a document sent as an attachment, a page inside a restricted environment. Embedding everything means it works anywhere with no missing assets.

## Where it hurts

**Large images.** Encoding a 500KB photograph produces 670KB of text that has to be parsed as part of your HTML or CSS. Worse, it cannot be cached separately — every page load re-downloads it as part of the document, whereas a linked image is cached once and reused.

**Anything used on multiple pages.** A linked logo is downloaded once and cached for the whole site. A base64 logo is embedded in every page's HTML and re-downloaded every time.

**Content that changes.** Updating an embedded image means editing and redeploying the file that contains it.

**Anything you want a CDN to serve.** Embedded images cannot be served from an edge cache, resized on the fly, or converted to WebP by an image service.

## The rough rule

Embed if the asset is **small, used in one place, and must load without a separate request**. Link everything else.

In numbers: under 2KB is usually worth embedding, 2-10KB is a judgement call, over 10KB should almost always be a linked file. Email is the exception where larger embeds are justified because the alternative is a blocked image.

## Data URI syntax

The encoded string needs a prefix to be usable:

data:image/png;base64,iVBORw0KGgo...

The MIME type must match the file — image/png, image/jpeg, image/svg+xml, font/woff2. Getting it wrong is the most common reason an embed silently fails to render.

For SVG specifically, consider URL-encoding rather than base64. SVG is text already, so base64 adds 33% for nothing; a URL-encoded SVG data URI is smaller and works the same way.

## Base64 is not encryption

Worth stating plainly because it is a recurring misunderstanding. Base64 is an encoding, not a cipher. Anyone can decode it instantly — including with the tool above. It provides zero confidentiality.

It appears in authentication headers because HTTP headers need text-safe values, not because it protects anything. An API key in a base64 string in your frontend JavaScript is exactly as exposed as one in plain text.
`,
    faqs: [
      { question: "How much bigger does base64 make a file?", answer: "About 33% — three bytes of binary become four characters of text. That's inherent to the encoding, so the question is always whether what you gain is worth the size increase." },
      { question: "When should I base64-encode an image?", answer: "When it's small, used in one place, and must load without a separate request. Under 2KB is usually worth it; over 10KB almost never is. HTML email is the main exception, since clients block linked images by default." },
      { question: "Why is my base64 image not displaying?", answer: "The MIME type in the data URI prefix probably doesn't match the file. It must be data:image/png;base64,... for a PNG, image/jpeg for a JPG, image/svg+xml for SVG. A mismatch fails silently." },
      { question: "Is base64 a form of encryption?", answer: "No. It's an encoding, and anyone can decode it instantly. It provides no confidentiality at all — a key in a base64 string is exactly as exposed as one in plain text. It appears in auth headers only because headers need text-safe values." },
    ],
  },
]

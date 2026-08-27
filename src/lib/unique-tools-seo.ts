// SEO copy for the three unique form tools. Compress PDF still lives in
// seo-data.ts because that page already imports from there.

export const uniqueToolSeo = {
    "fit-to-size": {
        howToSteps: [
            { name: "Upload a PDF or photo", text: "Drop a PDF, JPG, PNG, or WebP. Nothing is uploaded — the file stays in this browser tab." },
            { name: "Set the min and max", text: "Pick a form preset (20–50 KB, 50–200 KB, 100–200 KB) or type any window, including 1–2 MB for job and university portals." },
            { name: "Fit and download", text: "Convertify compresses until the file is at least the minimum and at most the maximum, then you save it locally." },
        ],
        faqs: [
            {
                question: "Why do some forms reject a file that is too small, not just too large?",
                answer: "Many KYC, UPSC, EPFO, and bank portals publish a band such as 20–50 KB or 100–200 KB. A normal compressor only has a ceiling, so it can overshoot the floor. Fit to size keeps iterating until the output is inside both limits.",
            },
            {
                question: "Can I fit a photo to 20–50 KB, 50–200 KB, or 100–200 KB?",
                answer: "Yes. Those ranges are presets on this page. They cover common India form-upload rules and similar job-portal photo caps. You can also type any custom min and max in KB.",
            },
            {
                question: "Does this work for job portals, visa sites, and university applications?",
                answer: "Yes, when the portal states an exact KB or MB cap rather than a pixel crop. Use a 0.5–1 MB, 1–2 MB, or 2–5 MB window for many English-language job and university uploads. If the form also demands a passport crop (US 2×2 or 630×810), use the Passport photo tool first, then come back here only if the kilobytes are still wrong.",
            },
            {
                question: "Should I use Fit to size or Compress PDF?",
                answer: "Use Compress PDF when you only need a file under a target (100 KB, 200 KB, 10 MB, Gmail’s 25 MB). Use Fit to size when the form also enforces a minimum, or when you are sizing a photo into a tight KB band. Both run in your browser.",
            },
            {
                question: "JPEG or PNG — what comes out?",
                answer: "Photos are saved as JPEG, which is what most upload portals expect and the format that can actually hit a 20–50 KB band. PDFs stay PDFs. If a portal insists on PNG, it usually will not also demand a 50 KB ceiling — PNG is the larger format.",
            },
            {
                question: "Does my file leave this device?",
                answer: "No. Fitting happens in your browser. There is no upload, account, or watermark. Close the tab and the working copy is gone; only the file you chose to download stays on your device.",
            },
        ],
    },
    "passport-photo": {
        howToSteps: [
            { name: "Pick the preset the form names", text: "Choose US 2×2 (600×600), India passport 630×810, UK/visa 35×45 at 600×750, UPSC 3.5×4.5 cm, bank 200×230, signature, or thumb." },
            { name: "Crop the face, then make the JPEG", text: "Drag and zoom so the head sits in the guide. The tool fills a white (or light) background and compresses into the preset’s KB window." },
            { name: "Download the JPEG", text: "Output is always a JPEG on your device. If the wall behind you is busy, run Remove background first, then crop here." },
        ],
        faqs: [
            {
                question: "Can I make a US passport photo at 2×2 inches (600×600)?",
                answer: "Yes. The US 2×2 preset crops to 600×600 pixels — the usual digital size for a 2-inch square at 300 DPI — and aims for about 50–240 KB as a JPEG with a white background. Always check the form you are filing; some USCIS/CEAC uploads cap supporting images at 240 KB.",
            },
            {
                question: "What size is the India digital passport photo?",
                answer: "The Passport preset on this page is 630×810 JPEG, 10–250 KB, white background — the common Passport Seva / ICAO-style digital upload. It is not an official MEA check of pose, glasses, or lighting.",
            },
            {
                question: "Does UPSC 3.5×4.5 cm, bank 200×230, and signature 140×60 work here?",
                answer: "Yes. UPSC photo is 413×531 (3.5×4.5 cm at 300 DPI), 20–300 KB. Bank KYC photo is 200×230, 20–50 KB. Signature is 140×60, 10–20 KB. Thumb impression is 160×200, 10–20 KB. Wrong pixels are almost always a crop problem, not a compress problem — pick the matching preset instead of stretching a square selfie.",
            },
            {
                question: "What about UK or Schengen visa photos?",
                answer: "The Visa 35×45 preset outputs 600×750 pixels (the common digital size for a 35×45 mm / 3.5×4.5 cm frame) as a JPEG in a 50–240 KB window with a white fill. Many Schengen and visa portals accept that. UK online passport photos officially want a cream or light-grey backdrop, not pure white — retake against a cream wall if that portal rejects a white background. We do not invent a cream fill we cannot match.",
            },
            {
                question: "JPEG or PNG? The portal rejected my file.",
                answer: "This tool always downloads a JPEG. That is what almost every passport, visa, and KYC portal asks for. PNG files are larger and often fail a 20–50 KB or 10–250 KB cap even when the pixels are right.",
            },
            {
                question: "The file is too large or too small after I crop.",
                answer: "Each preset has a min and max KB. Raise or lower the size slider if the form’s cap differs. If you only have a kilobyte rule and no pixel crop, use Fit to size instead. If the photo is already the right pixels but the wall is busy, use Remove background, then crop again.",
            },
            {
                question: "Does the photo leave my phone or computer?",
                answer: "No. Cropping and JPEG encoding run in your browser. Convertify does not upload the image. This is a sizing tool, not an official passport studio.",
            },
        ],
    },
    "remove-background": {
        howToSteps: [
            { name: "Upload a photo taken against a plain wall", text: "JPG, PNG, or WebP. A busy street or patterned curtain will not cut cleanly — this is not a studio hair-mask editor." },
            { name: "Choose white or light blue", text: "White is the usual passport, KYC, and LinkedIn ID-headshot fill. Light blue is a soft studio alternative." },
            { name: "Download, then crop if the form needs pixels", text: "The file stays on your device. Next, open Passport photo for US 2×2 / 630×810, or Fit to size if the portal only cares about kilobytes." },
        ],
        faqs: [
            {
                question: "Can I get a white background for a passport, KYC, or LinkedIn photo?",
                answer: "Yes, if the original was taken against a reasonably even wall. The tool samples that backdrop and fills it with solid white (or light blue). It is meant for ID headshots, not for cutting a person out of a crowded photo.",
            },
            {
                question: "Is this the same as a professional background remover?",
                answer: "No. It flood-fills a plain backdrop from the edges. Hair, glasses glare, and shadows on a busy wall will not look studio-perfect. If the portal is strict, retake the photo in daylight against a blank wall, then run this only to even out the colour.",
            },
            {
                question: "JPEG or PNG?",
                answer: "Output is a JPEG, which is what passport, visa, KYC, and most LinkedIn-style uploads expect. PNG would keep transparency, but these forms want a solid white (or light) background and a small file, not an alpha channel.",
            },
            {
                question: "The pixels or kilobytes are still wrong after I change the background.",
                answer: "This page only replaces the backdrop. Crop to US 2×2 (600×600), India 630×810, visa 35×45, or a signature size on the Passport photo tool. If the form only publishes a KB band such as 20–50 KB, use Fit to size.",
            },
            {
                question: "Does my photo get uploaded?",
                answer: "No. Replacement runs in your browser. Close the tab and the working copy is gone. Only the JPEG you download stays on your device.",
            },
        ],
    },
} as const

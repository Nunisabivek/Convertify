import { Metadata } from "next"
import { FAQSchema } from "@/components/seo/faq-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"

export const metadata: Metadata = {
    title: "How to Compress PDF to Under 100KB for Government Forms (2026)",
    description: "Step-by-step guide to compress PDF files under 100KB for government form uploads, visa applications, and job portals. Free methods that actually work.",
    keywords: [
        "compress pdf to 100kb",
        "compress pdf for government form",
        "reduce pdf size to 100kb",
        "pdf under 100kb",
        "compress pdf for visa application",
        "compress pdf for job application",
        "government pdf size limit",
        "reduce pdf file size for upload",
        "compress scanned pdf",
        "pdf compressor 100kb free"
    ],
    alternates: {
        canonical: "https://convertify.work/blog/compress-pdf-under-100kb-government-forms",
    },
    openGraph: {
        title: "How to Compress PDF to Under 100KB for Government Forms",
        description: "Stop getting 'file too large' errors on government portals. Here's how to shrink any PDF under 100KB without ruining readability.",
        url: "https://convertify.work/blog/compress-pdf-under-100kb-government-forms",
        type: "article",
        publishedTime: "2026-04-04T00:00:00.000Z",
        authors: ["Convertify Team"],
    },
}

const faqs = [
    {
        question: "Can I compress a scanned PDF to under 100KB?",
        answer: "Yes, but scanned PDFs are essentially images, so they're harder to compress. For best results, scan at 150 DPI instead of 300, use grayscale instead of color, and compress with high settings. If the scan is a single page, you can usually hit 100KB. Multi-page scans may need to be split first."
    },
    {
        question: "Will the government portal reject a compressed PDF?",
        answer: "No. Compression doesn't change the PDF format—it's still a valid PDF file. Government portals check file type and size, not compression level. As long as the text is readable and any required signatures or stamps are visible, compressed PDFs are accepted."
    },
    {
        question: "Why do government websites have such small file size limits?",
        answer: "Most government portals were built years ago with limited server infrastructure. A 100KB or 200KB limit prevents their servers from being overwhelmed by millions of uploads. Some newer portals allow up to 2MB, but many older systems still enforce strict limits."
    },
    {
        question: "How do I compress a PDF with a digital signature without breaking it?",
        answer: "Compressing a digitally signed PDF will invalidate the signature because compression modifies the file's byte structure. Always compress your PDF first, then apply the digital signature. If you've already signed it, you'll need to re-sign after compression."
    },
    {
        question: "What's the smallest I can compress a PDF without losing readability?",
        answer: "For a single-page text document, you can typically compress down to 30-50KB and still have perfectly readable text. For documents with images or scans, 80-150KB is realistic while keeping content legible. Below these thresholds, text may become blurry."
    },
    {
        question: "Can I compress a PDF on my phone for a government upload?",
        answer: "Yes. Browser-based compressors like Convertify work on any phone with a web browser. Upload your PDF, choose high compression, and download the smaller file—all without installing an app."
    }
]

export default function BlogPost() {
    return (
        <div className="min-h-screen bg-slate-50">
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "https://convertify.work" },
                    { name: "Blog", url: "https://convertify.work/blog" },
                    { name: "Compress PDF Under 100KB for Government Forms", url: "https://convertify.work/blog/compress-pdf-under-100kb-government-forms" }
                ]}
            />

            <article className="max-w-4xl mx-auto px-4 py-12">
                {/* Article Header */}
                <header className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                        How to Compress PDF to Under 100KB for Government Forms
                    </h1>
                    <p className="text-xl text-slate-600 mb-6">
                        You filled out the entire application, scanned your documents, merged everything into a single PDF—and the upload portal says &quot;file exceeds maximum size.&quot; Here&apos;s how to fix that in under two minutes.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>Published: April 4, 2026</span>
                        <span>•</span>
                        <span>8 min read</span>
                        <span>•</span>
                        <span>PDF Tools</span>
                    </div>
                </header>

                {/* Table of Contents */}
                <nav className="bg-white rounded-xl p-6 mb-10 shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
                    <ul className="space-y-2 text-slate-600">
                        <li><a href="#the-problem" className="hover:text-indigo-600">Why Government Portals Have Tiny Size Limits</a></li>
                        <li><a href="#quick-method" className="hover:text-indigo-600">The Quick Method: Compress Online in 30 Seconds</a></li>
                        <li><a href="#what-if-still-too-large" className="hover:text-indigo-600">What If It&apos;s Still Too Large?</a></li>
                        <li><a href="#scanned-documents" className="hover:text-indigo-600">Special Case: Scanned Documents and Photos</a></li>
                        <li><a href="#common-portals" className="hover:text-indigo-600">Size Limits for Popular Government Portals</a></li>
                        <li><a href="#before-you-scan" className="hover:text-indigo-600">Prevent the Problem: Tips Before You Scan</a></li>
                        <li><a href="#mistakes" className="hover:text-indigo-600">Common Mistakes That Bloat PDF Size</a></li>
                        <li><a href="#faq" className="hover:text-indigo-600">Frequently Asked Questions</a></li>
                    </ul>
                </nav>

                {/* Content */}
                <div className="prose prose-lg prose-slate max-w-none">

                    <h2 id="the-problem" className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                        Why Government Portals Have Tiny Size Limits
                    </h2>
                    <p>
                        If you&apos;ve ever tried uploading documents to a government job portal, visa application site,
                        or university admission form, you&apos;ve probably hit the dreaded &quot;file size exceeds limit&quot; error.
                        Most of these portals cap uploads at 100KB, 200KB, or 500KB per file.
                    </p>
                    <p>
                        The reason is practical: these systems handle millions of applications. A passport office processing
                        50,000 uploads per day can&apos;t afford to store 5MB files from each applicant. That&apos;s 250GB of new data
                        <em> every single day</em>. So they enforce strict limits, and your perfectly scanned
                        certificate that&apos;s 2.3MB gets rejected without mercy.
                    </p>
                    <p>
                        The good news? You don&apos;t need to re-scan anything or buy software. A single-page PDF with text
                        can realistically be compressed to 30-50KB. Even a scanned document with photos can usually
                        be brought under 100KB with the right approach.
                    </p>

                    <h2 id="quick-method" className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                        The Quick Method: Compress Online in 30 Seconds
                    </h2>
                    <p>
                        For most people, this is the only section you need. Here&apos;s the fastest way to get your PDF under 100KB:
                    </p>

                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 my-6">
                        <h3 className="text-lg font-semibold text-indigo-900 mb-3">Three Steps:</h3>
                        <ol className="space-y-3 text-slate-700">
                            <li><strong>1. Open <a href="/compress-pdf" className="text-indigo-600 hover:underline">Convertify&apos;s PDF compressor</a></strong> — no sign-up needed, works on any device.</li>
                            <li><strong>2. Upload your PDF</strong> and select <strong>High compression</strong>. This targets the maximum size reduction while keeping text readable.</li>
                            <li><strong>3. Download and check the file size.</strong> Right-click the file → Properties (Windows) or Get Info (Mac) to verify it&apos;s under your portal&apos;s limit.</li>
                        </ol>
                    </div>

                    <p>
                        That&apos;s it for most documents. A typical 1-2 page government form PDF goes from 500KB–2MB
                        down to 60-120KB with high compression. The text stays sharp because compression algorithms
                        are extremely efficient with text data—it&apos;s the embedded images that take up space.
                    </p>

                    <h2 id="what-if-still-too-large" className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                        What If It&apos;s Still Too Large After Compressing?
                    </h2>
                    <p>
                        Sometimes one round of compression isn&apos;t enough, especially for scanned documents or PDFs
                        with high-resolution photos. Here&apos;s what to try next, in order:
                    </p>

                    <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">1. Split the PDF into individual pages</h3>
                    <p>
                        If your PDF has multiple pages, the portal might accept individual page uploads.
                        Use a <a href="/split-pdf" className="text-indigo-600 hover:underline">PDF splitter</a> to
                        separate your document into single pages, then compress each one individually.
                        A single page almost always fits under 100KB.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2. Convert to grayscale</h3>
                    <p>
                        Color information roughly triples file size compared to grayscale. If your document
                        doesn&apos;t need color (and most government forms don&apos;t), converting to grayscale before
                        compressing can cut size dramatically. A color-scanned certificate at 300KB might drop
                        to 80KB in grayscale.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3. Reduce image resolution</h3>
                    <p>
                        Scanned at 300 DPI? For government uploads, 150 DPI is more than enough. The portal
                        is going to display your document on a screen, not print a billboard. Halving the DPI
                        reduces image data by about 75%.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">4. Convert images separately</h3>
                    <p>
                        If your PDF contains a photo (like a passport photo embedded in a form), extract it,
                        compress the photo using an <a href="/image-compressor" className="text-indigo-600 hover:underline">image compressor</a>,
                        then rebuild the PDF. Photos often make up 90% of a PDF&apos;s file size.
                    </p>

                    <h2 id="scanned-documents" className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                        Special Case: Scanned Documents and Photos
                    </h2>
                    <p>
                        Scanned PDFs are the hardest to compress because they&apos;re essentially just images wrapped
                        in a PDF container. A scanner captures your document as a full-page photograph, so a
                        single scanned page can easily be 1-3MB.
                    </p>
                    <p>
                        Here&apos;s the approach that works best for scanned documents:
                    </p>
                    <ul>
                        <li><strong>Scan in grayscale, not color</strong> — unless the document has a colored seal or stamp that must be visible</li>
                        <li><strong>Use 150 DPI instead of 300</strong> — still perfectly legible for text and signatures</li>
                        <li><strong>Crop to just the document</strong> — remove the white/dark border around the scan</li>
                        <li><strong>Use JPEG compression in your scanner settings</strong> — most scanners default to uncompressed TIFF, which is huge</li>
                    </ul>
                    <p>
                        If you&apos;re working with an existing scan you can&apos;t re-do, compress it with high settings.
                        For a single-page grayscale scan, expect to reach 80-120KB. For color scans,
                        you might need to convert to grayscale first.
                    </p>

                    <h2 id="common-portals" className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                        Size Limits for Popular Government and Job Portals
                    </h2>
                    <p>
                        Different portals have different limits. Here are the ones people run into most often:
                    </p>

                    <div className="overflow-x-auto my-6">
                        <table className="min-w-full bg-white border border-slate-200 rounded-lg">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Portal / Use Case</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Typical Size Limit</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Recommended Compression</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <tr>
                                    <td className="px-4 py-3 text-sm text-slate-700">Government job applications</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">100KB – 200KB</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">High</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-slate-700">Visa / passport applications</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">100KB – 500KB</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">High</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-slate-700">University admissions</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">200KB – 1MB</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">Medium to High</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-slate-700">Tax filing portals</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">1MB – 5MB</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">Medium</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-slate-700">Insurance claims</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">500KB – 2MB</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">Medium</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-slate-700">Scholarship applications</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">100KB – 300KB</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">High</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p>
                        When in doubt, compress to the smallest size you can while keeping text readable.
                        There&apos;s no penalty for uploading a 50KB file when the limit is 100KB—smaller is always fine.
                    </p>

                    <h2 id="before-you-scan" className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                        Prevent the Problem: Tips Before You Scan
                    </h2>
                    <p>
                        The easiest way to hit a size target is to start small. If you haven&apos;t scanned your
                        documents yet, these settings will save you a lot of compression headaches:
                    </p>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 my-6">
                        <h3 className="text-lg font-semibold text-emerald-900 mb-3">Optimal Scanner Settings for Government Uploads:</h3>
                        <ul className="space-y-2 text-slate-700">
                            <li><strong>Resolution:</strong> 150 DPI (not 300 or 600)</li>
                            <li><strong>Color mode:</strong> Grayscale (unless color is specifically required)</li>
                            <li><strong>Format:</strong> PDF with JPEG compression (not TIFF or PNG)</li>
                            <li><strong>Page size:</strong> Match the actual document size—don&apos;t scan a passport-sized photo as A4</li>
                        </ul>
                    </div>

                    <p>
                        Using a phone camera instead of a scanner? Most phone scanning apps (like the built-in
                        ones on iPhone and Android) automatically crop and optimize. Just make sure to select
                        &quot;grayscale&quot; or &quot;black and white&quot; mode, and choose a smaller file size option
                        if available.
                    </p>

                    <h2 id="mistakes" className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                        Common Mistakes That Bloat PDF Size
                    </h2>
                    <p>
                        These are the most common reasons your PDF is bigger than it needs to be:
                    </p>

                    <h3 className="text-lg font-semibold text-slate-800 mt-4 mb-2">Scanning at 600 DPI &quot;just to be safe&quot;</h3>
                    <p>
                        Higher DPI doesn&apos;t mean better for screen viewing. 600 DPI is for professional print
                        production. For a document that someone will view on a computer screen, 150 DPI captures
                        every detail. The difference between 150 and 600 DPI on screen? Almost invisible.
                        The difference in file size? 16x larger.
                    </p>

                    <h3 className="text-lg font-semibold text-slate-800 mt-4 mb-2">Embedding passport photos at full resolution</h3>
                    <p>
                        A 4000x3000 pixel photo from your phone is about 3-5MB. For a passport-sized photo
                        on a form, you need maybe 600x600 pixels. Resize the photo before adding it to
                        your PDF, and the file size drops by 95%.
                    </p>

                    <h3 className="text-lg font-semibold text-slate-800 mt-4 mb-2">Merging multiple documents into one huge file</h3>
                    <p>
                        Some people merge 10 documents into a single PDF and then try to compress it under 100KB.
                        That&apos;s almost impossible. Instead, check if the portal allows separate uploads for each document.
                        If it only accepts one file, use <a href="/merge-pdf" className="text-indigo-600 hover:underline">PDF merge</a> after
                        compressing each document individually—the result will be much smaller than merging first.
                    </p>

                    <h3 className="text-lg font-semibold text-slate-800 mt-4 mb-2">Saving from Word with embedded fonts</h3>
                    <p>
                        When you export a Word document to PDF, it embeds the fonts you used. Each font adds
                        100-500KB. Stick to standard system fonts (Arial, Times New Roman, Calibri) and check
                        &quot;Minimum size&quot; in the PDF export settings. Or, use our <a href="/word-to-pdf" className="text-indigo-600 hover:underline">Word to PDF converter</a> which
                        handles this automatically.
                    </p>

                    <h2 id="faq" className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                        Frequently Asked Questions
                    </h2>

                    <FAQSchema
                        toolName="PDF Compression for Government Forms"
                        faqs={faqs}
                    />
                </div>

                {/* CTA Section */}
                <div className="mt-12 p-8 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Need to Compress a PDF Right Now?</h3>
                    <p className="text-lg mb-6 text-indigo-100">
                        Drop your file in and get it under 100KB in seconds. Free, no sign-up, works on any device.
                    </p>
                    <a
                        href="/compress-pdf"
                        className="inline-block px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                        Compress PDF Now →
                    </a>
                </div>

                {/* Related Articles */}
                <div className="mt-12 pt-8 border-t border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Related Articles</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <a
                            href="/blog/best-free-pdf-compressor-online"
                            className="p-4 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all"
                        >
                            <h4 className="font-semibold text-slate-800 mb-2">Best Free PDF Compressor Online</h4>
                            <p className="text-sm text-slate-600">Compare the top free PDF compressors and find the best one for your needs.</p>
                        </a>
                        <a
                            href="/blog/how-to-convert-pdf-to-word-without-software"
                            className="p-4 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all"
                        >
                            <h4 className="font-semibold text-slate-800 mb-2">How to Convert PDF to Word Without Software</h4>
                            <p className="text-sm text-slate-600">Edit government forms by converting PDF to Word, then back to PDF.</p>
                        </a>
                    </div>
                </div>
            </article>
        </div>
    )
}

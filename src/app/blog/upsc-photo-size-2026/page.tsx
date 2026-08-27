import { Metadata } from "next"
import Link from "next/link"
import { FAQSchema } from "@/components/seo/faq-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { AuthorByline } from "@/components/seo/author-byline"
import { AnswerBlock } from "@/components/seo/answer-block"

export const metadata: Metadata = {
    title: "UPSC Photo Size 2026: 3.5×4.5 cm, 413×531, 20–300 KB",
    description: "UPSC photograph is usually 3.5×4.5 cm (413×531 px at 300 DPI), JPEG, 20–300 KB, white background. Signature is often 140×60, 10–20 KB. How to hit it on your phone.",
    keywords: [
        "upsc photo size 2026",
        "upsc photo size 3.5 x 4.5 cm",
        "upsc photo 413x531",
        "upsc photo 20kb to 300kb",
        "upsc signature size",
        "upsc photograph jpeg",
        "upsc photo white background",
    ],
    robots: { index: true, follow: true },
    alternates: {
        canonical: "https://convertify.work/blog/upsc-photo-size-2026",
    },
    openGraph: {
        title: "UPSC Photo Size 2026: 3.5×4.5 cm, 413×531, 20–300 KB",
        description: "The pixel, KB and JPEG rules UPSC applications actually reject — and how to hit them without uploading your photo to a random site.",
        url: "https://convertify.work/blog/upsc-photo-size-2026",
        type: "article",
        publishedTime: "2026-08-27T00:00:00.000Z",
        authors: ["Convertify Team"],
    },
}

const faqs = [
    {
        question: "What is the UPSC photo size in 2026?",
        answer: "Most UPSC notifications still ask for a 3.5 cm × 4.5 cm colour photograph as a JPEG between 20 KB and 300 KB on a light/white background. At 300 DPI that is 413×531 pixels. Always re-read the PDF notification for the exam you are applying to — CSE, NDA, CDS, CAPF and EPFO recruitment can differ by a few KB.",
    },
    {
        question: "Is 413×531 the same as 3.5×4.5 cm?",
        answer: "Yes, at 300 DPI. 3.5 cm is 1.378 inches × 300 ≈ 413 pixels. 4.5 cm is 1.772 inches × 300 ≈ 531 pixels. If you only resize a square selfie into 413×531 without cropping, the face stretches and the portal can still reject it.",
    },
    {
        question: "Why was my UPSC photo rejected if it is under 300 KB?",
        answer: "Under 300 KB is only the ceiling. The floor is usually 20 KB, so an over-compressed 12 KB file fails. Other common rejects: PNG instead of JPEG, 630×810 (that is Passport Seva, not UPSC), a cream or patterned wall, or a crop that cuts the head or leaves too much empty sky.",
    },
    {
        question: "What size is the UPSC signature?",
        answer: "Many notifications want a JPEG signature around 140×60 pixels and 10–20 KB (some years print 20–50 KB). Sign in dark ink on white paper, photograph in even light, then use the Signature preset. Do not upload a PNG.",
    },
    {
        question: "Can I use a Passport Seva 630×810 photo for UPSC?",
        answer: "No. 630×810 is the Passport Seva digital box. UPSC wants 3.5×4.5 cm / 413×531. Recrop from the original; do not squash 630×810 down or the face distorts.",
    },
    {
        question: "Does Convertify upload my UPSC photo?",
        answer: "No. The passport photo maker, background tool and fit-to-size tool all run in the browser. Convertify is not UPSC and does not certify a photograph.",
    },
]

export default function BlogPost() {
    return (
        <div className="min-h-screen bg-slate-50">
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "https://convertify.work" },
                    { name: "Blog", url: "https://convertify.work/blog" },
                    { name: "UPSC Photo Size 2026", url: "https://convertify.work/blog/upsc-photo-size-2026" },
                ]}
            />

            <article className="max-w-4xl mx-auto px-4 py-12">
                <header className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                        UPSC Photo Size 2026: 3.5×4.5 cm, 413×531 pixels, 20–300 KB
                    </h1>
                    <p className="text-xl text-slate-600 mb-6">
                        The application does not fail because you “didn’t compress enough.” It fails because the photograph missed one of four independent checks: centimetres, pixels, kilobytes, or background. Here is how those numbers fit together for the 2026 cycle.
                    </p>
                </header>

                <AuthorByline
                    published="2026-08-27"
                    lastReviewed="2026-08-27"
                    readingTime={8}
                />

                <AnswerBlock
                    question="What photo size does UPSC want in 2026?"
                    answer="A colour JPEG, 3.5×4.5 cm, which is 413×531 pixels at 300 DPI, usually 20–300 KB, on a white or very light background. Signatures are a different file — often 140×60 and 10–20 KB. Confirm the PDF notification for your exam; this page is not UPSC."
                />

                <nav className="bg-white rounded-xl p-6 mb-10 shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold mb-4">On this page</h2>
                    <ul className="space-y-2 text-slate-600">
                        <li><a href="#the-four-checks" className="hover:text-indigo-600">The four checks the form actually runs</a></li>
                        <li><a href="#photo-numbers" className="hover:text-indigo-600">Photo: 3.5×4.5 cm → 413×531 → 20–300 KB</a></li>
                        <li><a href="#signature" className="hover:text-indigo-600">Signature and thumb</a></li>
                        <li><a href="#not-passport" className="hover:text-indigo-600">Do not reuse a 630×810 passport file</a></li>
                        <li><a href="#how-to" className="hover:text-indigo-600">How to make it on a phone</a></li>
                        <li><a href="#documents" className="hover:text-indigo-600">Documents vs photographs</a></li>
                        <li><a href="#faq" className="hover:text-indigo-600">FAQ</a></li>
                    </ul>
                </nav>

                <div className="prose prose-lg prose-slate max-w-none">
                    <h2 id="the-four-checks" className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                        The four checks the form actually runs
                    </h2>
                    <p>
                        UPSC’s online form (and the recruitment portals that copy its language) does not “look at your photo” the way a human does. The upload script checks file type, pixel box, file size, and — after a human opens it — whether the background is plain. Those are four different failures with the same angry red text.
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 text-slate-700">
                        <li><strong>JPEG, not PNG.</strong> A PNG that is the right size still bounces. Convert on the way out.</li>
                        <li><strong>The pixel box.</strong> 3.5×4.5 cm at 300 DPI is 413×531. A 1080×1080 Instagram export is the wrong shape.</li>
                        <li><strong>The KB band, including the floor.</strong> 20–300 KB means 18 KB fails the same as 320 KB.</li>
                        <li><strong>White / light background.</strong> A kitchen, curtain, or hard shadow behind the head is a content fail. Resizing cannot fix it.</li>
                    </ol>
                    <p>
                        Read the notification PDF for <em>your</em> exam. Civil Services, NDA, CDS, CAPF and UPSC EPFO recruitment have used the same 3.5×4.5 cm photograph language for years, but a given advertisement can tighten the KB band or ask for a slightly different signature box. The numbers below are the ones candidates hit in 2025–2026 applications — not a substitute for the PDF.
                    </p>

                    <h2 id="photo-numbers" className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                        Photo: 3.5×4.5 cm → 413×531 → 20–300 KB
                    </h2>
                    <p>
                        Centimetres on paper and pixels on a form are the same ratio, not the same unit. 3.5 cm × 4.5 cm is a 7:9 portrait. At 300 DPI:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        <li>3.5 cm ÷ 2.54 × 300 ≈ <strong>413 pixels</strong> wide</li>
                        <li>4.5 cm ÷ 2.54 × 300 ≈ <strong>531 pixels</strong> tall</li>
                    </ul>
                    <p>
                        If you take a square selfie and “resize to 413×531” without cropping, the face stretches. Crop to 7:9 first (head with a little space above the hair, both ears visible if the notification says so), then scale. That is what the UPSC preset on the{' '}
                        <Link href="/passport-photo" className="text-indigo-600 font-medium hover:underline">passport photo maker</Link>
                        {' '}does: 413×531, JPEG, 20–300 KB, white fill in the empty crop.
                    </p>
                    <p>
                        The 20 KB floor is the one people miss. Crushing a 12-megapixel phone photo with a generic “compress image” slider often lands at 8–15 KB. The portal then says the file is invalid. If you only have a KB range and the pixels are already right,{' '}
                        <Link href="/fit-to-size" className="text-indigo-600 font-medium hover:underline">Fit to size</Link>
                        {' '}will raise quality enough to stay above 20 KB and still under 300 KB. If you still need the crop, stay on the photo maker — it does both.
                    </p>

                    <h2 id="signature" className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                        Signature and thumb
                    </h2>
                    <p>
                        The photograph and the signature are separate uploads. A signed JPEG of your whole A4 application is not a signature file. Typical boxes:
                    </p>
                    <div className="overflow-x-auto my-6 not-prose">
                        <table className="min-w-full bg-white border border-slate-200 rounded-lg text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">File</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Usual pixels</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Usual KB</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Preset</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-slate-700">
                                <tr>
                                    <td className="px-4 py-3">Photograph</td>
                                    <td className="px-4 py-3">413×531 (3.5×4.5 cm)</td>
                                    <td className="px-4 py-3">20–300 KB</td>
                                    <td className="px-4 py-3">UPSC photo</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3">Signature</td>
                                    <td className="px-4 py-3">140×60</td>
                                    <td className="px-4 py-3">10–20 KB (some forms 20–50)</td>
                                    <td className="px-4 py-3">Signature</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3">Thumb impression</td>
                                    <td className="px-4 py-3">160×200</td>
                                    <td className="px-4 py-3">10–20 KB</td>
                                    <td className="px-4 py-3">Thumb</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>
                        Sign with a dark pen on unlined white paper. Photograph from above, no flash hot-spot. Crop tightly — a signature floating in a huge white JPEG will either blow past the max KB or sit under the minimum once you crush it. The Signature preset is a wide 140×60 box on purpose.
                    </p>

                    <h2 id="not-passport" className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                        Do not reuse a 630×810 Passport Seva file
                    </h2>
                    <p>
                        Passport Seva’s digital upload is a different product: <strong>630×810 pixels, 10–250 KB, white JPEG</strong>. That ratio is not 7:9. If you scale 630×810 down to 413×531 you squash the face. If you upload 630×810 to UPSC, the pixel check fails even when the KB is legal.
                    </p>
                    <p>
                        Keep the original phone photo. Derive the UPSC JPEG and the Passport Seva JPEG from that original, each with its own preset on the{' '}
                        <Link href="/passport-photo" className="text-indigo-600 font-medium hover:underline">same photo tool</Link>.
                        Bank KYC is a third box again: 200×230, 20–50 KB.
                    </p>

                    <h2 id="how-to" className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                        How to make it on a phone, without handing the selfie to a website
                    </h2>
                    <p>
                        Convertify’s tools run in the browser. The photo is not uploaded to Convertify. That is the entire privacy model — useful when the file is a passport-style headshot tied to an exam application.
                    </p>
                    <ol className="list-decimal pl-5 space-y-3 text-slate-700">
                        <li>
                            <strong>Shoot against a plain wall</strong> in window light. If the wall is cream or busy, run{' '}
                            <Link href="/remove-background" className="text-indigo-600 font-medium hover:underline">Remove background</Link>
                            {' '}and pick white. It is built for KYC walls, not for cutting you out of a wedding crowd. Retake if the hair edge looks chewed.
                        </li>
                        <li>
                            Open the{' '}
                            <Link href="/passport-photo" className="text-indigo-600 font-medium hover:underline">passport photo maker</Link>,
                            tap <strong>UPSC photo</strong>, crop so the head sits in the guide, and export. You should get a <code className="text-sm bg-slate-100 px-1 rounded">.jpg</code> around 413×531 that sits inside 20–300 KB.
                        </li>
                        <li>
                            For the signature, switch to the <strong>Signature</strong> chip (140×60, 10–20 KB). For a bank form the same week, use <strong>Bank photo</strong> (200×230, 20–50 KB) from the original, not from the UPSC JPEG.
                        </li>
                    </ol>
                    <p>
                        Neutral expression, both eyes visible, no heavy filters. Those rules are in the notification; no crop tool can invent them after the fact.
                    </p>

                    <h2 id="documents" className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                        Documents vs photographs
                    </h2>
                    <p>
                        Marksheets, ID proof and category certificates are PDFs with a <em>maximum</em> (often 100 KB or 200 KB). They do not use the 413×531 box. Compress those with{' '}
                        <Link href="/compress-pdf" className="text-indigo-600 font-medium hover:underline">Compress PDF</Link>
                        {' '}and tap 100 KB or 200 KB. If a document field also prints a minimum — “50 KB to 200 KB” — use{' '}
                        <Link href="/fit-to-size" className="text-indigo-600 font-medium hover:underline">Fit to size</Link>
                        {' '}instead of a compressor that only shrinks. A 30 KB PDF can fail a 50–200 KB field the same way an 8 KB signature fails 10–20 KB.
                    </p>
                    <p>
                        Mixing the two is the other classic reject: a photograph saved as PDF, or a certificate saved as JPEG. Follow the field label.
                    </p>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-8 not-prose">
                        <p className="text-slate-800 m-0">
                            <strong>Not official.</strong> UPSC publishes the binding spec in each examination notice. Convertify only matches the pixel and KB numbers those notices have used. If 2026’s PDF says something different, follow the PDF.
                        </p>
                    </div>
                </div>

                <div id="faq">
                    <FAQSchema toolName="UPSC photo size 2026" faqs={faqs} />
                </div>

                <div className="mt-8 p-6 bg-indigo-600 rounded-2xl text-white text-center">
                    <p className="text-lg font-semibold mb-3">Make the 413×531 JPEG on this device</p>
                    <p className="text-indigo-100 mb-4">UPSC preset is already on the photo tool. No upload, no account.</p>
                    <Link
                        href="/passport-photo"
                        className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50"
                    >
                        Open passport / UPSC photo maker →
                    </Link>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Related</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link
                            href="/blog/compress-pdf-under-100kb-government-forms"
                            className="p-4 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all"
                        >
                            <h4 className="font-semibold text-slate-800 mb-2">Compress a PDF under 100 KB for government forms</h4>
                            <p className="text-sm text-slate-600">For marksheets and ID proofs — not the photograph field.</p>
                        </Link>
                        <Link
                            href="/passport-photo"
                            className="p-4 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all"
                        >
                            <h4 className="font-semibold text-slate-800 mb-2">Passport Seva 630×810 and bank 200×230</h4>
                            <p className="text-sm text-slate-600">Same tool, different presets. Do not reuse one JPEG for every portal.</p>
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    )
}

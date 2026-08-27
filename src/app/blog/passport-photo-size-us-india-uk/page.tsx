import { Metadata } from "next"
import Link from "next/link"
import { FAQSchema } from "@/components/seo/faq-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { AuthorByline } from "@/components/seo/author-byline"
import { AnswerBlock } from "@/components/seo/answer-block"

export const metadata: Metadata = {
    title: "Passport Photo Size: US 2×2 vs India 630×810 vs Visa 35×45",
    description:
        "Pixel sizes, KB caps, and JPEG vs PNG for US 2×2 inch, India 630×810, UPSC 3.5×4.5 cm, and visa 35×45 photos. Crop on your device — no upload.",
    keywords: [
        "us passport photo 2x2",
        "600x600 passport photo",
        "india passport photo 630x810",
        "upsc photo size 3.5x4.5 cm",
        "schengen visa photo 35x45",
        "passport photo kb size",
        "white background passport photo",
        "bank kyc photo 200x230",
    ],
    alternates: {
        canonical: "https://convertify.work/blog/passport-photo-size-us-india-uk",
    },
    openGraph: {
        title: "Passport Photo Size: US 2×2 vs India 630×810 vs Visa 35×45",
        description:
            "The pixel sizes and KB caps that actually reject passport and visa uploads — and which Convertify preset outputs each one.",
        url: "https://convertify.work/blog/passport-photo-size-us-india-uk",
        type: "article",
        publishedTime: "2026-08-27T00:00:00.000Z",
        authors: ["Convertify Team"],
    },
}

const faqs = [
    {
        question: "What pixel size is a US 2×2 inch passport photo?",
        answer: "600×600 pixels at 300 DPI. That is a square, not the 7:9 rectangle used for India 630×810 or European 35×45 mm photos. Convertify’s US 2×2 preset crops to 600×600 and aims for about 50–240 KB as a JPEG with a white background.",
    },
    {
        question: "What is 630×810 used for?",
        answer: "It is the common India digital passport / ICAO-style upload: 630×810 JPEG, usually 10–250 KB, white background. Stretching a US square selfie into 630×810 distorts the face. Crop to 7:9 first.",
    },
    {
        question: "Is 35×45 mm the same as UPSC 3.5×4.5 cm?",
        answer: "Yes — 35×45 mm is 3.5×4.5 cm. At 300 DPI that is about 413×531 pixels (the UPSC preset). Many visa portals instead want a larger 600×750 digital file of the same shape. Pick the preset that matches the pixels on the form, not just the millimetres.",
    },
    {
        question: "Why does the portal reject a PNG that looks fine?",
        answer: "Almost every passport, visa, and KYC form wants JPEG. PNG is larger and often includes transparency, which fails a white-background rule and a 20–50 KB or 10–250 KB cap. Convertify’s passport tool always downloads JPEG.",
    },
    {
        question: "Does Convertify upload my passport photo?",
        answer: "No. Cropping, background fill, and JPEG encoding run in your browser. Close the tab and the working copy is gone. Only the file you download stays on your device.",
    },
]

export default function BlogPost() {
    return (
        <div className="min-h-screen bg-slate-50">
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "https://convertify.work" },
                    { name: "Blog", url: "https://convertify.work/blog" },
                    {
                        name: "Passport Photo Size: US 2×2 vs India 630×810",
                        url: "https://convertify.work/blog/passport-photo-size-us-india-uk",
                    },
                ]}
            />

            <article className="max-w-4xl mx-auto px-4 py-12">
                <header className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                        Passport Photo Size: US 2×2 vs India 630×810 vs Visa 35×45
                    </h1>
                    <p className="text-xl text-slate-600 mb-6">
                        The rejection is almost never “your face.” It is the wrong shape, the wrong
                        kilobytes, or a PNG. Here are the sizes Convertify can actually output —
                        and the ones we will not fake.
                    </p>
                    <AuthorByline published="2026-08-27" readingTime={8} />
                </header>

                <AnswerBlock
                    question="What size should my passport photo be?"
                    answer="US digital photos are a 2-inch square, usually 600×600 pixels. India digital uploads are commonly 630×810, 10–250 KB. Visa 35×45 mm is the same shape as UPSC 3.5×4.5 cm — 600×750 or 413×531 depending on the portal. Crop on /passport-photo; do not stretch a selfie."
                />

                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
                    <p>
                        Passport and visa portals check three things and usually tell you about
                        one: pixel dimensions, file size, and file type. Get any of them wrong and
                        you see “photo does not meet specifications” with no hint which rule
                        failed. The{" "}
                        <Link href="/passport-photo" className="text-indigo-600 hover:underline">
                            Passport photo
                        </Link>{" "}
                        tool on Convertify is built around the sizes the live cropper can produce —
                        not a brochure list of every country’s millimetre chart.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-3">
                        The sizes that actually differ
                    </h2>
                    <p>
                        A US passport photo is a square. An India digital passport photo and a
                        Schengen visa photo are rectangles about 7:9. If you take a phone selfie
                        and “resize” it, you either squash the face or pad it with bars. Crop to
                        the shape first, then let JPEG compression hit the KB window.
                    </p>

                    <div className="overflow-x-auto my-6">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-100 text-left">
                                    <th className="p-3 border border-slate-200">Preset on Convertify</th>
                                    <th className="p-3 border border-slate-200">Pixels</th>
                                    <th className="p-3 border border-slate-200">Typical KB</th>
                                    <th className="p-3 border border-slate-200">Shape</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-3 border border-slate-200">US 2×2</td>
                                    <td className="p-3 border border-slate-200">600×600</td>
                                    <td className="p-3 border border-slate-200">50–240 KB</td>
                                    <td className="p-3 border border-slate-200">Square (2×2 in at 300 DPI)</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border border-slate-200">India 630×810</td>
                                    <td className="p-3 border border-slate-200">630×810</td>
                                    <td className="p-3 border border-slate-200">10–250 KB</td>
                                    <td className="p-3 border border-slate-200">7:9 digital / ICAO-style</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border border-slate-200">Visa 35×45</td>
                                    <td className="p-3 border border-slate-200">600×750</td>
                                    <td className="p-3 border border-slate-200">50–240 KB</td>
                                    <td className="p-3 border border-slate-200">35×45 mm digital</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border border-slate-200">UPSC photo</td>
                                    <td className="p-3 border border-slate-200">413×531</td>
                                    <td className="p-3 border border-slate-200">20–300 KB</td>
                                    <td className="p-3 border border-slate-200">3.5×4.5 cm at 300 DPI</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border border-slate-200">Bank KYC photo</td>
                                    <td className="p-3 border border-slate-200">200×230</td>
                                    <td className="p-3 border border-slate-200">20–50 KB</td>
                                    <td className="p-3 border border-slate-200">Small ID tile</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border border-slate-200">Signature</td>
                                    <td className="p-3 border border-slate-200">140×60</td>
                                    <td className="p-3 border border-slate-200">10–20 KB</td>
                                    <td className="p-3 border border-slate-200">Wide scan</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p>
                        Those kilobyte windows are defaults you can raise or lower on the page if
                        your portal prints a different cap. They are not a substitute for reading
                        the form. Convertify is not the US State Department, MEA, or GOV.UK, and
                        the cropper does not judge pose, glasses, or whether your ears are visible.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-3">
                        US 2×2 inch — the high-value English search
                    </h2>
                    <p>
                        A 2×2 inch print at 300 DPI is 600×600 pixels. That is the size most
                        digital US passport and visa photo uploads expect. Some CEAC / DS-160
                        supporting images also cap at 240 KB. A 12-megapixel phone photo is
                        already thousands of pixels on a side; shrinking it without cropping
                        leaves a huge JPEG that fails the cap, or a tiny stretched face if you
                        force the square.
                    </p>
                    <p>
                        Use the <strong>US 2×2</strong> chip on{" "}
                        <Link href="/passport-photo" className="text-indigo-600 hover:underline">
                            Passport photo
                        </Link>
                        . Fill is white, which matches the usual US white or off-white backdrop
                        rule. If the wall behind you is a bookshelf, run{" "}
                        <Link href="/remove-background" className="text-indigo-600 hover:underline">
                            Remove background
                        </Link>{" "}
                        first — it only works on a reasonably plain wall, and it is honest about
                        that.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-3">
                        India 630×810, UPSC, bank photo, signature
                    </h2>
                    <p>
                        Passport Seva-style digital photos are commonly 630×810 JPEG, 10–250 KB,
                        white background. UPSC recruitment photos are 3.5×4.5 cm — 413×531 at
                        300 DPI — often 20–300 KB. Bank KYC tiles are frequently 200×230 and a
                        brutal 20–50 KB. Signatures land around 140×60 and 10–20 KB. Thumb
                        impressions are 160×200, 10–20 KB.
                    </p>
                    <p>
                        Those last three fail constantly when someone compresses a full-page scan
                        instead of cropping. A 630×810 passport JPEG crushed to 15 KB is a
                        different problem from a 200×230 bank tile that is still 180 KB because
                        it was never resized. Pick the preset named on the form.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-3">
                        Visa 35×45 mm — and what we will not claim
                    </h2>
                    <p>
                        35×45 mm is the Schengen / UK-style visa frame. Digitally, portals ask
                        for either ~413×531 (300 DPI print size) or 600×750 (the common online
                        minimum). Convertify’s <strong>Visa 35×45</strong> preset outputs 600×750
                        JPEG in a 50–240 KB window with a white fill. That is a size the cropper
                        can make.
                    </p>
                    <p>
                        UK <em>online passport</em> photos are a special case: GOV.UK wants a
                        cream or light-grey background, not pure white. We do not invent a cream
                        fill we cannot match. If you are filing a UK passport, retake against a
                        cream wall. For many visa and Schengen uploads, white is accepted. Read
                        the page you are filing, not a generic “passport photo” blog.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-3">
                        Too large, too small, wrong pixels, JPEG vs PNG
                    </h2>
                    <p>
                        <strong>Too large.</strong> You cropped to the right pixels but the JPEG
                        quality is still high. Lower the KB slider on Passport photo, or if the
                        form has no crop — only a cap — use{" "}
                        <Link href="/fit-to-size" className="text-indigo-600 hover:underline">
                            Fit to size
                        </Link>{" "}
                        or{" "}
                        <Link href="/compress-pdf" className="text-indigo-600 hover:underline">
                            Compress PDF
                        </Link>{" "}
                        for a supporting document.
                    </p>
                    <p>
                        <strong>Too small.</strong> India and bank forms often publish a
                        <em> minimum</em> (10 KB, 20 KB). A compressor that only has a ceiling
                        can undershoot. Fit to size is the tool that holds both ends of a
                        20–50 KB or 100–200 KB band.
                    </p>
                    <p>
                        <strong>Wrong pixels.</strong> A 600×600 US photo uploaded to a 630×810
                        field will be rejected or stretched. The fix is a different crop, not
                        another compression pass.
                    </p>
                    <p>
                        <strong>JPEG vs PNG.</strong> PNG keeps sharp edges and optional
                        transparency. Passport portals want a solid background and a small file.
                        Transparency looks like a checkerboard or a black box on some uploaders.
                        Always JPEG for these forms.
                    </p>
                    <p>
                        <strong>White background.</strong>{" "}
                        <Link href="/remove-background" className="text-indigo-600 hover:underline">
                            Remove background
                        </Link>{" "}
                        flood-fills a plain wall. It is not a studio hair-mask. LinkedIn and ID
                        headshots with a blank wall work; a busy café does not. Files stay in
                        the browser on every one of these tools.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-3">
                        A working order
                    </h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Take the photo in daylight against a plain wall, shoulders to camera.</li>
                        <li>
                            If the wall is almost white but not quite, run{" "}
                            <Link href="/remove-background" className="text-indigo-600 hover:underline">
                                Remove background
                            </Link>
                            .
                        </li>
                        <li>
                            Open{" "}
                            <Link href="/passport-photo" className="text-indigo-600 hover:underline">
                                Passport photo
                            </Link>{" "}
                            and tap the preset printed on the form (US 2×2, India 630×810, Visa
                            35×45, UPSC, bank, signature).
                        </li>
                        <li>Download the JPEG. Do not convert it back to PNG “to be safe.”</li>
                        <li>
                            If a later page in the same application wants a PDF under 100 KB or
                            200 KB, that is{" "}
                            <Link href="/compress-pdf" className="text-indigo-600 hover:underline">
                                Compress PDF
                            </Link>
                            , not another photo crop.
                        </li>
                    </ol>

                    <p>
                        Keep the original phone photo. US 2×2 at 600×600 and India 630×810 are
                        different crops from the same file. Upscaling a 20 KB bank tile into a
                        US passport square will never look acceptable.
                    </p>
                </div>

                <div className="mt-12 p-8 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Make the photo the form asked for</h3>
                    <p className="text-lg mb-6 text-indigo-100">
                        US 2×2, India 630×810, visa 35×45, UPSC, bank, and signature — JPEG,
                        on your device.
                    </p>
                    <Link
                        href="/passport-photo"
                        className="inline-block px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                        Open Passport photo →
                    </Link>
                </div>

                <div className="mt-12" id="faq">
                    <FAQSchema toolName="Passport Photo Sizes" faqs={faqs} />
                </div>
            </article>
        </div>
    )
}

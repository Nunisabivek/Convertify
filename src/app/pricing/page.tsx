import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, X } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Pricing — Free PDF Tools, No Sign-Up, No Limits | Convertify',
    description: 'Convertify is free forever. No credit card, no daily caps, no file size limits, no watermarks. Compare to Smallpdf, iLovePDF, Adobe — and see why everything stays free.',
    alternates: {
        canonical: 'https://convertify.work/pricing',
    },
}

const pricingFaq = [
    {
        question: "Why is Convertify free when iLovePDF, Smallpdf and Adobe charge?",
        answer: "Most PDF services run conversions on rented cloud servers, so they pass the bandwidth and CPU bill on to you as a subscription. Convertify runs every conversion inside your browser using PDF-Lib and PDF.js. There are no server costs to recoup, so the tools stay free forever. Display ads cover the website hosting cost.",
    },
    {
        question: "Are there hidden file size limits?",
        answer: "No. There is no daily cap, no per-file size limit, and no monthly quota. The only practical ceiling is your device's RAM — if you can open the file on your computer, Convertify can process it.",
    },
    {
        question: "Will my files be saved on a server?",
        answer: "No file ever leaves your device. Conversion runs entirely in JavaScript on your local browser tab. We do not run a backend that stores or processes your documents — confirm by opening DevTools → Network while you convert and watch for upload requests (there are none).",
    },
    {
        question: "Is Convertify safe for sensitive documents like tax returns or contracts?",
        answer: "Yes. Because nothing is uploaded, sensitive documents like W-2s, IRS 1040s, NHS forms, UK passport scans, contracts and CVs stay on your machine end-to-end. There is no server log, no temporary storage, no GDPR data export to worry about.",
    },
    {
        question: "Do you add a watermark to converted files?",
        answer: "No. Output PDFs and images are clean — no Convertify branding, no watermark, no metadata stamp added to your file.",
    },
    {
        question: "Will Convertify ever introduce a Pro tier?",
        answer: "If we ever do, the current free toolset stays free. Any Pro tier would only add new features (e.g. cloud OCR, eSignature workflows) — never gate the existing tools.",
    },
]

const pricingFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pricingFaq.map(f => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
}

export default function PricingPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                    Simple, Transparent Pricing
                </h1>
                <p className="mt-5 max-w-xl mx-auto text-xl text-slate-500">
                    We believe essential PDF tools should be accessible to everyone.
                </p>
            </div>

            <div className="relative max-w-lg mx-auto lg:max-w-4xl lg:flex lg:gap-8 justify-center">
                {/* Competitor Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex-1 opacity-70 scale-95 origin-right lg:origin-right">
                    <h3 className="text-lg font-medium text-slate-900">Other PDF Tools</h3>
                    <p className="mt-4 text-slate-500 text-sm">Typical subscriptions</p>
                    <p className="mt-8">
                        <span className="text-4xl font-extrabold text-slate-900">$15</span>
                        <span className="text-base font-medium text-slate-500">/mo</span>
                    </p>
                    <ul role="list" className="mt-8 space-y-4">
                        <li className="flex items-center text-slate-500">
                            <Check className="flex-shrink-0 w-5 h-5 text-green-500 mr-3" />
                            File conversion
                        </li>
                        <li className="flex items-center text-slate-500">
                            <X className="flex-shrink-0 w-5 h-5 text-red-500 mr-3" />
                            Uploads files to server
                        </li>
                        <li className="flex items-center text-slate-500">
                            <X className="flex-shrink-0 w-5 h-5 text-red-500 mr-3" />
                            Daily limits on free tier
                        </li>
                        <li className="flex items-center text-slate-500">
                            <X className="flex-shrink-0 w-5 h-5 text-red-500 mr-3" />
                            Requires signup
                        </li>
                    </ul>
                </div>

                {/* Convertify Card */}
                <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-600 p-8 flex-1 relative transform scale-105 z-10">
                    <div className="absolute top-0 right-0 -mt-4 mr-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        Your Choice
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">Convertify</h3>
                    <p className="mt-4 text-slate-500 text-sm">Forever Free</p>
                    <p className="mt-8">
                        <span className="text-4xl font-extrabold text-slate-900">$0</span>
                        <span className="text-base font-medium text-slate-500">/forever</span>
                    </p>
                    <ul role="list" className="mt-8 space-y-4">
                        <li className="flex items-center text-slate-900 font-medium">
                            <Check className="flex-shrink-0 w-5 h-5 text-blue-600 mr-3" />
                            Unlimited conversions
                        </li>
                        <li className="flex items-center text-slate-900 font-medium">
                            <Check className="flex-shrink-0 w-5 h-5 text-blue-600 mr-3" />
                            100% Client-side (No Uploads)
                        </li>
                        <li className="flex items-center text-slate-900 font-medium">
                            <Check className="flex-shrink-0 w-5 h-5 text-blue-600 mr-3" />
                            No Daily Limits
                        </li>
                        <li className="flex items-center text-slate-900 font-medium">
                            <Check className="flex-shrink-0 w-5 h-5 text-blue-600 mr-3" />
                            No Signup Required
                        </li>
                    </ul>
                    <div className="mt-8">
                        <Link
                            href="/all-tools"
                            className="block w-full py-3 px-6 border border-transparent rounded-xl shadow-lg text-center font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all hover:scale-105"
                        >
                            Start Converting
                        </Link>
                    </div>
                </div>
            </div>

            {/* How Convertify can stay free — the key narrative for E-E-A-T */}
            <div className="mt-24 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">How can every tool be free?</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                    <p>
                        Most PDF services rent expensive cloud servers and pass the cost on through a $9–$15/month subscription. Convertify takes a different path: <strong>every conversion runs locally in your browser</strong> using open-source libraries like PDF-Lib and PDF.js. We never see your file, so we don&apos;t pay to process it — which means you don&apos;t either.
                    </p>
                    <p>
                        That has two side benefits worth a sentence each. First, <strong>nothing uploads</strong>: your tax returns, passport scans, NDAs, and resumes never leave your device, which makes the tool genuinely safe for confidential work. Second, <strong>there&apos;s no daily quota</strong>: the &quot;3 free conversions per day&quot; pattern only exists on services that are paying for your CPU time.
                    </p>
                    <p>
                        The website itself is supported by display advertising. That covers the cost of hosting the static site and the domain — nothing more — and lets us keep the tools free indefinitely.
                    </p>
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mt-16 mb-6">Pricing &amp; usage FAQ</h2>
                <div className="space-y-6">
                    {pricingFaq.map((f, i) => (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-900 mb-2">{f.question}</h3>
                            <p className="text-slate-600 leading-relaxed">{f.answer}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link
                        href="/all-tools"
                        className="inline-block py-3 px-8 rounded-xl shadow-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all hover:scale-105"
                    >
                        Browse all 40+ free tools
                    </Link>
                </div>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingFaqSchema) }}
            />
        </div>
    )
}

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useCases } from '@/lib/use-cases-data';
import { toolSeoData } from '@/lib/seo-data';
import { toolContentData } from '@/lib/tool-content-data';
import { ArrowRight, Lock, Zap, Shield, FileCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const useCase = useCases.find((uc) => uc.slug === slug);

    if (!useCase) {
        return {};
    }

    return {
        title: useCase.title,
        description: useCase.description,
        keywords: useCase.keywords,
        // All 83 use case pages now have comprehensive, tool-specific FAQs,
        // HowTo schemas, and links to fully active client-side tools.
        // Index by default to resolve the GSC "Excluded by 'noindex' tag" warning.
        robots: useCase.indexable !== false
            ? { index: true, follow: true, googleBot: { index: true, follow: true } }
            : { index: false, follow: true, googleBot: { index: false, follow: true } },
        alternates: {
            canonical: `https://convertify.work/use-cases/${useCase.slug}`,
        },
        openGraph: {
            title: useCase.title,
            description: useCase.description,
            url: `https://convertify.work/use-cases/${useCase.slug}`,
            type: 'article',
        },
    };
}

export function generateStaticParams() {
    return useCases.map((useCase) => ({
        slug: useCase.slug,
    }));
}

export default async function UseCasePage({ params }: Props) {
    const { slug } = await params;
    const useCase = useCases.find((uc) => uc.slug === slug);

    if (!useCase) {
        notFound();
    }

    // Pull steps + tool-specific data from the parent tool registry.
    // toolHref is "/png-to-pdf" → toolKey is "png-to-pdf".
    const toolKey = useCase.toolHref.replace(/^\//, '');
    const toolSeo = (toolSeoData as Record<string, typeof toolSeoData['merge-pdf'] | undefined>)[toolKey];
    const toolContent = (toolContentData as Record<string, typeof toolContentData['merge-pdf'] | undefined>)[toolKey];

    // Sibling use cases for the same tool — gives Google a clear topical
    // cluster and gives users useful next-step links. Limit to 6 to keep
    // the page focused.
    const siblings = useCases
        .filter((uc) => uc.toolHref === useCase.toolHref && uc.slug !== useCase.slug)
        .sort((a, b) => (b.indexable ? 1 : 0) - (a.indexable ? 1 : 0))
        .slice(0, 6);

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://convertify.work' },
            { '@type': 'ListItem', position: 2, name: 'All Tools', item: 'https://convertify.work/all-tools' },
            { '@type': 'ListItem', position: 3, name: useCase.toolName, item: `https://convertify.work${useCase.toolHref}` },
            { '@type': 'ListItem', position: 4, name: useCase.title, item: `https://convertify.work/use-cases/${useCase.slug}` },
        ],
    };

    const faqSchema = useCase.faqs.length > 0
        ? {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: useCase.faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer,
                },
            })),
        }
        : null;

    const howToSchema = toolSeo?.howToSteps
        ? {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: useCase.title,
            description: useCase.description,
            step: toolSeo.howToSteps.map((s, i) => ({
                '@type': 'HowToStep',
                position: i + 1,
                name: s.name,
                text: s.text,
            })),
        }
        : null;

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: useCase.title,
        description: useCase.description,
        author: { '@type': 'Organization', name: 'Convertify' },
        publisher: {
            '@type': 'Organization',
            name: 'Convertify',
            logo: { '@type': 'ImageObject', url: 'https://convertify.work/images/Convertify.png' },
        },
        datePublished: '2026-01-01',
        dateModified: '2026-09-18',
        isAccessibleForFree: true,
        inLanguage: 'en',
        mainEntityOfPage: `https://convertify.work/use-cases/${useCase.slug}`,
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            {howToSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
                />
            )}

            <div className="max-w-3xl mx-auto">
                <nav className="mb-6 text-sm text-slate-500 flex items-center flex-wrap gap-1">
                    <Link href="/" className="hover:text-blue-600">Home</Link>
                    <span className="mx-1">/</span>
                    <Link href="/all-tools" className="hover:text-blue-600">All Tools</Link>
                    <span className="mx-1">/</span>
                    <Link href={useCase.toolHref} className="hover:text-blue-600">{useCase.toolName}</Link>
                    <span className="mx-1">/</span>
                    <span className="text-slate-900 truncate">Use Case</span>
                </nav>

                <main className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-12">
                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200/60 rounded-full text-xs font-semibold text-indigo-700 shadow-sm">
                            <Shield className="w-3.5 h-3.5 text-indigo-600" />
                            Zero-Upload Privacy
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full text-xs font-semibold text-emerald-700 shadow-sm">
                            <Zap className="w-3.5 h-3.5 text-emerald-600" />
                            Instant Processing
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200/60 rounded-full text-xs font-semibold text-purple-700 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                            100% Free & No Limits
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        {useCase.title}
                    </h1>

                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                        {useCase.description}
                    </p>

                    {/* Primary CTA */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 rounded-2xl p-8 sm:p-10 text-white text-center shadow-lg shadow-blue-500/10 mb-12">
                        <div className="relative z-10 max-w-xl mx-auto">
                            <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs font-semibold text-blue-100 mb-3 uppercase tracking-wider">
                                Browser-Based Tool
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                                Try {useCase.toolName} Now
                            </h2>
                            <p className="text-blue-100 text-sm sm:text-base mb-6 leading-relaxed">
                                Free, no sign-up, and zero server uploads — your files stay safely on your device.
                            </p>
                            <Link
                                href={useCase.toolHref}
                                className="inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-bold text-indigo-700 bg-white rounded-xl hover:bg-blue-50 hover:shadow-xl transition-all duration-200 group transform hover:-translate-y-0.5"
                            >
                                Open {useCase.toolName} Tool
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Step-by-step — pulled from parent tool's howToSteps */}
                    {toolSeo?.howToSteps && (
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                How it works (3 quick steps)
                            </h2>
                            <ol className="space-y-4">
                                {toolSeo.howToSteps.map((step, i) => (
                                    <li key={i} className="flex gap-4 p-5 bg-slate-50/80 hover:bg-slate-50 rounded-xl border border-slate-200/80 transition-colors">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 mb-1">{step.name}</h3>
                                            <p className="text-slate-600 text-sm leading-relaxed">{step.text}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    )}

                    {/* Why-Convertify quad — varied content per use case via the toolName */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            Why pick Convertify for this?
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200/80 hover:border-indigo-200 hover:shadow-sm transition-all">
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-3">
                                    <Lock className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-2">Files stay on device</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Convertify processes everything in your browser using JavaScript. Your file is never uploaded — confirm with DevTools → Network. That makes this safe for sensitive material like contracts, IDs, and financial documents.
                                </p>
                            </div>
                            <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200/80 hover:border-emerald-200 hover:shadow-sm transition-all">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
                                    <Zap className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-2">No upload wait</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Because nothing uploads, processing starts the instant you click. For typical files (under 50 MB) the whole job finishes in seconds — no progress bar, no queueing behind other users.
                                </p>
                            </div>
                            <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200/80 hover:border-blue-200 hover:shadow-sm transition-all">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-2">No daily quota</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Free without limits, including no &quot;3 conversions per day&quot; cap that competing services impose. Run as many {useCase.toolName.toLowerCase()} jobs as you need.
                                </p>
                            </div>
                            <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200/80 hover:border-purple-200 hover:shadow-sm transition-all">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
                                    <FileCheck className="w-5 h-5 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-2">No watermark</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Your output is clean — no Convertify branding, no metadata stamp. Same as if you&apos;d run a paid desktop app.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Use cases section — pulled from parent tool's data so each
                        page gets specific scenarios for that tool family. */}
                    {toolContent?.useCases && (
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                Other ways people use {useCase.toolName}
                            </h2>
                            <ul className="space-y-2 text-slate-700">
                                {toolContent.useCases.slice(0, 5).map((u, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-blue-500 mt-1">•</span>
                                        <span className="leading-relaxed">{u}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Sibling use cases — strong internal linking that builds
                        the topic cluster Google rewards. */}
                    {siblings.length > 0 && (
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                Related {useCase.toolName} guides
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {siblings.map((s) => (
                                    <Link
                                        key={s.slug}
                                        href={`/use-cases/${s.slug}`}
                                        className="block p-4 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors"
                                    >
                                        <span className="text-sm font-medium text-slate-900 leading-snug block">{s.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* FAQs — only render if we have any */}
                    {useCase.faqs.length > 0 && (
                        <section className="mb-4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                Frequently asked questions
                            </h2>
                            <div className="space-y-3">
                                {useCase.faqs.map((faq, index) => (
                                    <details key={index} className="bg-slate-50/80 hover:bg-slate-50 rounded-xl border border-slate-200/80 px-5 py-4 group transition-colors">
                                        <summary className="font-semibold text-slate-900 cursor-pointer list-none flex items-center justify-between gap-4">
                                            <span>{faq.question}</span>
                                            <span className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0 text-xs">▼</span>
                                        </summary>
                                        <p className="text-slate-600 text-sm leading-relaxed mt-3 pt-3 border-t border-slate-200/60">{faq.answer}</p>
                                    </details>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Bottom CTA Banner */}
                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Ready to use {useCase.toolName}?
                            </h3>
                            <p className="text-sm text-slate-600">
                                100% free, runs locally in your browser. No files are uploaded.
                            </p>
                        </div>
                        <Link
                            href={useCase.toolHref}
                            className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all flex-shrink-0"
                        >
                            Open {useCase.toolName}
                            <ArrowRight className="ml-1.5 w-4 h-4" />
                        </Link>
                    </div>
                </main>

                {/* Footer CTA — drives back to the canonical tool page */}
                <div className="mt-8 text-center">
                    <Link
                        href={useCase.toolHref}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        Back to {useCase.toolName}
                        <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

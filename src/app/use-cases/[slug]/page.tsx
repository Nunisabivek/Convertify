import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useCases } from '@/lib/use-cases-data';
import { toolSeoData } from '@/lib/seo-data';
import { toolContentData } from '@/lib/tool-content-data';
import { ArrowRight, Lock, Zap, Shield, FileCheck } from 'lucide-react';

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
        // Use-case pages now carry substantial unique content (steps, FAQs,
        // related links, scenario context) so we let them be indexed.
        // Each one targets a specific long-tail query the parent tool can't.
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
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
        .slice(0, 6);

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://convertify.work' },
            { '@type': 'ListItem', position: 2, name: 'Use Cases', item: 'https://convertify.work/use-cases' },
            { '@type': 'ListItem', position: 3, name: useCase.title, item: `https://convertify.work/use-cases/${useCase.slug}` },
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
        dateModified: '2026-05-08',
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
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        {useCase.title}
                    </h1>

                    <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                        {useCase.description}
                    </p>

                    {/* Primary CTA */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 sm:p-8 text-center mb-12">
                        <h2 className="text-xl font-semibold text-blue-900 mb-2">
                            Try {useCase.toolName} now
                        </h2>
                        <p className="text-sm text-blue-700 mb-5">
                            Free, no sign-up, files never leave your device.
                        </p>
                        <Link
                            href={useCase.toolHref}
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Open {useCase.toolName} Tool
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>

                    {/* Step-by-step — pulled from parent tool's howToSteps */}
                    {toolSeo?.howToSteps && (
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                How it works (3 quick steps)
                            </h2>
                            <ol className="space-y-4">
                                {toolSeo.howToSteps.map((step, i) => (
                                    <li key={i} className="flex gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
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
                            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                <Lock className="w-6 h-6 text-indigo-600 mb-2" />
                                <h3 className="font-semibold text-slate-900 mb-2">Files stay on device</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Convertify processes everything in your browser using JavaScript. Your file is never uploaded — confirm with DevTools → Network. That makes this safe for sensitive material like contracts, IDs, and financial documents.
                                </p>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                <Zap className="w-6 h-6 text-indigo-600 mb-2" />
                                <h3 className="font-semibold text-slate-900 mb-2">No upload wait</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Because nothing uploads, processing starts the instant you click. For typical files (under 50 MB) the whole job finishes in seconds — no progress bar, no queueing behind other users.
                                </p>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                <Shield className="w-6 h-6 text-indigo-600 mb-2" />
                                <h3 className="font-semibold text-slate-900 mb-2">No daily quota</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Free without limits, including no &quot;3 conversions per day&quot; cap that competing services impose. Run as many {useCase.toolName.toLowerCase()} jobs as you need.
                                </p>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                <FileCheck className="w-6 h-6 text-indigo-600 mb-2" />
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
                            <div className="space-y-4">
                                {useCase.faqs.map((faq, index) => (
                                    <details key={index} className="bg-slate-50 rounded-xl border border-slate-200 px-5 py-4 group">
                                        <summary className="font-semibold text-slate-900 cursor-pointer list-none flex items-center justify-between">
                                            {faq.question}
                                            <span className="text-slate-400 group-open:rotate-180 transition-transform">⌄</span>
                                        </summary>
                                        <p className="text-slate-600 leading-relaxed mt-3">{faq.answer}</p>
                                    </details>
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* Footer CTA — drives back to the canonical tool page */}
                <div className="mt-8 text-center">
                    <Link
                        href={useCase.toolHref}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Back to {useCase.toolName}
                        <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

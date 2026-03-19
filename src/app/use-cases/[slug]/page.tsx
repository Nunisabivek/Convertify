import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useCases } from '@/lib/use-cases-data';

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
        // NOINDEX use-case pages until domain authority grows
        // These are thin programmatic pages that hurt overall indexing
        robots: {
            index: false,
            follow: true,
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

    const faqSchema = {
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
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="max-w-3xl mx-auto">
                <nav className="mb-8 text-sm text-slate-500">
                    <Link href="/" className="hover:text-blue-600">Home</Link>
                    <span className="mx-2">/</span>
                    <span className="text-slate-900">Use Cases</span>
                </nav>

                <main className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                        {useCase.title}
                    </h1>

                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                        {useCase.description}
                    </p>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 text-center mb-12">
                        <h2 className="text-xl font-semibold text-blue-900 mb-4">
                            Ready to {useCase.keywords[0]}?
                        </h2>
                        <Link
                            href={useCase.toolHref}
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Open {useCase.toolName} Tool
                        </Link>
                        <p className="mt-4 text-sm text-blue-600">
                            No upload required &bull; 100% Free &bull; Secure
                        </p>
                    </div>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            Why use Convertify for this?
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="p-6 bg-slate-50 rounded-xl">
                                <h3 className="font-semibold text-slate-900 mb-2">Privacy First</h3>
                                <p className="text-slate-600 text-sm">
                                    Files are processed completely within your browser. They never touch our servers.
                                </p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-xl">
                                <h3 className="font-semibold text-slate-900 mb-2">Lightning Fast</h3>
                                <p className="text-slate-600 text-sm">
                                    Since there&apos;s no upload or download time, conversions happen instantly.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-6">
                            {useCase.faqs.map((faq, index) => (
                                <div key={index} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                        {faq.question}
                                    </h3>
                                    <p className="text-slate-600">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

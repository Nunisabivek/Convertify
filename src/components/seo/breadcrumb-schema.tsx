import React from 'react'

interface BreadcrumbItem {
    name: string
    url: string
}

interface BreadcrumbSchemaProps {
    items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": `https://convertify.work${item.url}`
        }))
    }

    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* Visual Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto px-4 py-3">
                <ol className="flex items-center space-x-2 text-sm text-slate-600">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center">
                            {index > 0 && (
                                <svg
                                    className="w-4 h-4 mx-2 text-slate-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                            {index === items.length - 1 ? (
                                <span className="font-medium text-slate-900">{item.name}</span>
                            ) : (
                                <a
                                    href={item.url}
                                    className="hover:text-indigo-600 transition-colors"
                                >
                                    {item.name}
                                </a>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    )
}

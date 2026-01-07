"use client"

import { BlogPost } from "@/lib/blog-data"

interface BlogPostSchemaProps {
    post: BlogPost
    url: string
}

export function BlogPostSchema({ post, url }: BlogPostSchemaProps) {
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "image": "https://convertify.work/images/og-banner.png",
        "datePublished": post.date,
        "dateModified": post.date,
        "author": {
            "@type": "Organization",
            "name": "Convertify",
            "url": "https://convertify.work"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Convertify",
            "logo": {
                "@type": "ImageObject",
                "url": "https://convertify.work/images/Convertify.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
        },
        "keywords": post.keywords.join(", "),
        "articleSection": post.category,
        "wordCount": post.content.split(/\s+/).length
    }

    // FAQ Schema if FAQs exist
    const faqSchema = post.faqs ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": post.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    } : null

    // BreadcrumbList Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://convertify.work"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://convertify.work/blog"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": url
            }
        ]
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
        </>
    )
}

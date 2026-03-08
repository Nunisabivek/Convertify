interface SoftwareApplicationSchemaProps {
    toolName: string
    toolSlug: string
    description: string
    category?: string
}

export function SoftwareApplicationSchema({
    toolName,
    toolSlug,
    description,
    category = "UtilitiesApplication",
}: SoftwareApplicationSchemaProps) {
    const softwareSchema = {
        "@context": "https://schema.org",
        "@type": ["SoftwareApplication", "WebApplication"],
        "name": `Convertify ${toolName}`,
        "applicationCategory": category,
        "applicationSubCategory": "PDF Tools",
        "operatingSystem": "Windows, macOS, Linux, iOS, Android",
        "description": description,
        "url": `https://convertify.work/${toolSlug}`,
        "screenshot": "https://convertify.work/images/og-banner.png",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2030-12-31"
        },
        "softwareVersion": "2.0",
        "datePublished": "2024-01-01",
        "dateModified": "2026-03-01",
        "author": {
            "@type": "Organization",
            "name": "Convertify",
            "url": "https://convertify.work"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Convertify",
            "url": "https://convertify.work",
            "logo": {
                "@type": "ImageObject",
                "url": "https://convertify.work/images/Convertify.png",
                "width": 512,
                "height": 512
            }
        },
        "featureList": [
            "100% Free - No sign-up required",
            "No file size limits",
            "No watermarks added",
            "100% client-side processing",
            "Works on all devices",
            "Secure and private - files never leave your browser"
        ],
        "browserRequirements": "Requires JavaScript. Works with Chrome, Firefox, Safari, Edge",
        "softwareRequirements": "Modern web browser with JavaScript enabled",
        "permissions": "No special permissions required"
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
    )
}

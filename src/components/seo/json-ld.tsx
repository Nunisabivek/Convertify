
export function JsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'SoftwareApplication',
                name: 'Convertify',
                applicationCategory: 'ProductivityApplication',
                operatingSystem: 'Any',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                },
                description: 'Free online PDF tools to merge, split, compress, and convert PDF files.',
                softwareVersion: '1.0.0',
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.8',
                    ratingCount: '1250',
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'Convertify',
                    logo: {
                        '@type': 'ImageObject',
                        url: 'https://convertify.vercel.app/images/Convertify.png',
                    },
                },
            },
            {
                '@type': 'Organization',
                '@id': 'https://convertify.vercel.app/#organization',
                name: 'Convertify',
                url: 'https://convertify.vercel.app',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://convertify.vercel.app/images/Convertify.png',
                    width: 512,
                    height: 512,
                    caption: 'Convertify Logo'
                },
                sameAs: [
                    'https://twitter.com/convertify',
                ],
                contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'customer support',
                    email: 'support@convertify.vercel.app',
                },
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

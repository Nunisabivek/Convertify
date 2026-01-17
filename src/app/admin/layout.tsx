import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'IndexNow Admin - Convertify',
    description: 'Submit URLs to IndexNow for instant search engine indexing',
    robots: 'noindex, nofollow',
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

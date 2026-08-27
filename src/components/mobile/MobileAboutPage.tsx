'use client'

import Link from 'next/link'

export default function MobileAboutPage() {
    return (
        <div className="mobile-about">
            <h1 className="mobile-about-title">Convertify</h1>
            <p className="mobile-about-lead">
                Free PDF and photo tools that run on this phone. No account. No watermark.
            </p>

            <section className="mobile-about-card">
                <h2>Your files</h2>
                <p>
                    Files are processed on this device. They are not uploaded to Convertify servers.
                    After you convert, use Save / Share to keep a copy in Files, Drive, or WhatsApp.
                </p>
            </section>

            <section className="mobile-about-card">
                <h2>Works without internet</h2>
                <p>
                    Once the app is open, the PDF and photo tools work offline. The QR tool also
                    works without a network connection.
                </p>
            </section>

            <section className="mobile-about-card">
                <h2>Privacy</h2>
                <p>
                    This Android version does not include website ads. Read the full privacy notes
                    for how the Convertify website and this app handle data.
                </p>
                <Link href="/privacy" className="mobile-about-link">
                    Privacy
                </Link>
            </section>
        </div>
    )
}

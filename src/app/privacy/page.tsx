
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy | Convertify",
    description: "Privacy Policy for Convertify. Learn how we handle your data and protect your privacy when using our online PDF tools.",
}

export default function PrivacyPage() {
    return (
        <div className="container px-4 py-12 md:px-6 md:py-24 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Privacy Policy</h1>
            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-muted-foreground mb-6">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                    <p>
                        At Convertify, we prioritize your privacy. We minimize the amount of data we collect.
                        When you use our tools to process files, those files are processed temporarily on our servers
                        and aren't stored permanently.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. File Usage and Retention</h2>
                    <p>
                        Files you upload for conversion or modification are:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Uploaded via a secure SSL connection.</li>
                        <li>Processed automatically by our software without human intervention.</li>
                        <li>Deleted from our servers automatically after 1 hour or immediately after you download the result.</li>
                    </ul>
                    <p>
                        We do not look at, copy, or sell your files. They belong to you.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. Log Data</h2>
                    <p>
                        Like most websites, we collect standard server logs that may include your IP address, browser type,
                        referring pages, and timestamp. This data is used for debugging, security, and usage analytics
                        to improve our service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Cookies and Advertising</h2>
                    <p>
                        We use cookies to improve your experience and to show personalized advertisements.
                        Our advertising partners may use cookies to serve ads based on your prior visits to our website
                        or other websites.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">5. Chrome Extension Privacy</h2>
                    <p>
                        Our Chrome Extension ("Convertify") is designed with privacy in mind.
                        It processes files locally within your browser whenever possible.
                        For tools requiring server-side processing, files are transmitted securely via HTTPS
                        and are deleted immediately after processing.
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 mt-2">
                        <li><strong>Permissions:</strong> We use "activeTab" to convert current pages to PDF, "contextMenus" for quick actions, and "storage" to save your preferences and license key.</li>
                        <li><strong>Data Collection:</strong> We do not track your browsing history. We only collect anonymous usage statistics (e.g., number of conversions) to improve the tool and verify Pro license keys.</li>
                        <li><strong>License Keys:</strong> If you upgrade to Pro, your license key is verified securely with our payment provider (LemonSqueezy) and stored locally on your device.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at support@convertify.work.
                    </p>
                </section>
            </div>
        </div>
    )
}

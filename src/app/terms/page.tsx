
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Terms of Service | Convertify",
    description: "Terms of Service for Convertify. Please read these terms carefully before using our PDF tools and services.",
}

export default function TermsPage() {
    return (
        <div className="container px-4 py-12 md:px-6 md:py-24 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Terms of Service</h1>
            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-muted-foreground mb-6">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using Convertify, you agree to be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use our services.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                    <p>
                        Convertify provides online tools for manipulating PDF files and other document formats.
                        These services are provided "as is" and "as available". We reserve the right to modify or
                        discontinue any part of the service at any time.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. User Conduct</h2>
                    <p>
                        You agree not to use Convertify to:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Upload any content that contains viruses, malware, or illegal material.</li>
                        <li>Attempt to gain unauthorized access to our systems.</li>
                        <li>Use the service for any illegal purpose or in violation of any local laws.</li>
                        <li>Overload or stress-test our infrastructure.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Limitation of Liability</h2>
                    <p>
                        Convertify shall not be liable for any direct, indirect, incidental, special, or consequential
                        damages resulting from the use or inability to use the service, including but not limited to
                        loss of data, files, or profits.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">5. Disclaimer</h2>
                    <p>
                        We do not guarantee that our service will be uninterrupted, secure, or error-free.
                        While we strive for high accuracy, we cannot guarantee perfectly accurate conversion results for every file.
                    </p>
                </section>
            </div>
        </div>
    )
}

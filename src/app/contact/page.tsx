
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Contact Us | Convertify",
    description: "Get in touch with the Convertify team. We are here to help with your PDF conversion needs and questions.",
}

export default function ContactPage() {
    return (
        <div className="container px-4 py-12 md:px-6 md:py-24 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Contact Us</h1>
            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-muted-foreground mb-8">
                    Have questions, suggestions, or need help with a file? We'd love to hear from you.
                </p>

                <div className="grid gap-8 md:grid-cols-2">
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                        <h2 className="text-xl font-bold mb-4">General Inquiries</h2>
                        <p className="text-slate-600 mb-4">
                            For general questions about our tools, features, or partnership opportunities.
                        </p>
                        <a href="mailto:contact@convertify.work" className="text-indigo-600 font-medium hover:underline">
                            contact@convertify.work
                        </a>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                        <h2 className="text-xl font-bold mb-4">Support</h2>
                        <p className="text-slate-600 mb-4">
                            If you're experiencing issues with a specific file or tool, please reach out to our support team.
                        </p>
                        <a href="mailto:support@convertify.work" className="text-indigo-600 font-medium hover:underline">
                            support@convertify.work
                        </a>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Are my files safe?</h3>
                            <p className="text-slate-600">
                                Yes. Your files are transferred via SSL and deleted automatically from our servers after 1 hour.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Is Convertify really free?</h3>
                            <p className="text-slate-600">
                                Yes, all our tools are currently free to use without any hidden costs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

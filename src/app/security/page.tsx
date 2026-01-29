import { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, Server, Eye, Trash2, Globe, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Security & Privacy | Convertify",
    description: "Your files are secure with Convertify. All PDF processing happens in your browser - files never leave your device. No account required, no data stored. Learn about our security practices.",
    keywords: ["convertify security", "pdf converter privacy", "secure pdf tools", "safe file converter", "no data storage pdf", "browser-based pdf tools", "gdpr compliant pdf converter"],
};

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Security & Privacy
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Your files never leave your device. Convertify processes everything in your browser for maximum privacy and security.
                    </p>
                </div>
            </section>

            {/* Security Features Grid */}
            <section className="py-12 px-4">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Feature 1 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                            <Server className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Browser-Based Processing</h3>
                        <p className="text-slate-600">
                            All file conversions happen locally in your browser. Your PDFs and documents are never uploaded to our servers.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                            <Lock className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Account Required</h3>
                        <p className="text-slate-600">
                            Use all our PDF tools without signing up. We don't collect your email, name, or any personal information.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                            <Eye className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Zero Data Logging</h3>
                        <p className="text-slate-600">
                            We don't log, track, or store any of your file contents. What you convert stays between you and your browser.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Auto-Delete Files</h3>
                        <p className="text-slate-600">
                            Since files never leave your device, there's nothing to delete on our end. Close your tab and your data is gone.
                        </p>
                    </div>

                    {/* Feature 5 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                            <Globe className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">HTTPS Encryption</h3>
                        <p className="text-slate-600">
                            Our entire website uses HTTPS/TLS encryption. All connections are secure and protected from eavesdropping.
                        </p>
                    </div>

                    {/* Feature 6 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">GDPR Compliant</h3>
                        <p className="text-slate-600">
                            We follow GDPR and global privacy standards. Since we don't collect personal data, compliance is built-in.
                        </p>
                    </div>
                </div>
            </section>

            {/* Detailed Explanation */}
            <section className="py-16 px-4 bg-slate-50">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">How Convertify Protects Your Files</h2>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-slate-900 mb-2">🔒 100% Client-Side Processing</h3>
                            <p className="text-slate-600">
                                Unlike other PDF tools that upload your files to their servers, Convertify uses WebAssembly (Wasm) and modern browser APIs to process files entirely on your device. This means:
                            </p>
                            <ul className="mt-3 space-y-2 text-slate-600">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    Your files never leave your computer or phone
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    No upload delays - processing is instant
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    Works offline after the page loads
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-slate-900 mb-2">📧 No Email or Account Required</h3>
                            <p className="text-slate-600">
                                Many competitors require you to create an account or enter your email before downloading files. Convertify never asks for this. Your identity remains completely anonymous.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-slate-900 mb-2">🏢 Enterprise & Business Safe</h3>
                            <p className="text-slate-600">
                                Convertify is safe for handling confidential business documents, contracts, and sensitive files. Since nothing is uploaded, there's no risk of data breaches from our side.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4">
                <div className="max-w-xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to Convert Securely?</h2>
                    <p className="text-slate-600 mb-6">
                        Try our free PDF tools with complete peace of mind. No sign up, no data collection.
                    </p>
                    <Link
                        href="/all-tools"
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        Explore All Tools
                    </Link>
                </div>
            </section>
        </div>
    );
}

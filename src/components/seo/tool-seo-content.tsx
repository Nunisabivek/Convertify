'use client';

import { CheckCircle, Shield, Zap, Globe, FileCheck } from 'lucide-react';

interface ToolContentProps {
    toolName: string;
    toolSlug: string;
    description: string;
    features: string[];
    useCases: string[];
    keywords?: string[];
}

// Generic feature icons based on common PDF tool benefits
const benefitIcons = [
    { icon: Zap, title: "Lightning Fast", description: "Process files instantly in your browser" },
    { icon: Shield, title: "100% Secure", description: "Files never leave your device" },
    { icon: Globe, title: "Works Everywhere", description: "Desktop, tablet, and mobile compatible" },
    { icon: FileCheck, title: "No Watermarks", description: "Clean, professional output every time" },
];

export function ToolSeoContent({
    toolName,
    toolSlug,
    description,
    features,
    useCases,
    keywords
}: ToolContentProps) {
    return (
        <section className="w-full bg-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Rich Description Section */}
                <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        About {toolName}
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-6">
                        {description}
                    </p>

                    {/* Feature List */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-700">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                        Why Use Convertify&apos;s {toolName}?
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {benefitIcons.map((benefit, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <benefit.icon className="w-7 h-7 text-indigo-600 mb-2" />
                                <h3 className="font-semibold text-slate-900 mb-1 text-sm">{benefit.title}</h3>
                                <p className="text-xs text-slate-600">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Use Cases Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                        Common Use Cases
                    </h2>
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                        <ul className="space-y-3">
                            {useCases.map((useCase, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                        {idx + 1}
                                    </span>
                                    <span className="text-slate-700">{useCase}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Trust Signal */}
                <div className="text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-6">
                    <p>
                        Convertify processes all files directly in your browser — nothing is uploaded to any server.
                        Your documents stay private and secure on your device at all times.
                    </p>
                </div>
            </div>
        </section>
    );
}

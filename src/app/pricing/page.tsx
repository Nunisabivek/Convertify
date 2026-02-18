import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, X } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Pricing - Convertify is Free Forever',
    description: 'Convertify is completely free to use. No hidden fees, no credit card required, and no limits on file conversions.',
    alternates: {
        canonical: '/pricing',
    },
}

export default function PricingPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                    Simple, Transparent Pricing
                </h1>
                <p className="mt-5 max-w-xl mx-auto text-xl text-slate-500">
                    We believe essential PDF tools should be accessible to everyone.
                </p>
            </div>

            <div className="relative max-w-lg mx-auto lg:max-w-4xl lg:flex lg:gap-8 justify-center">
                {/* Competitor Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex-1 opacity-70 scale-95 origin-right lg:origin-right">
                    <h3 className="text-lg font-medium text-slate-900">Other PDF Tools</h3>
                    <p className="mt-4 text-slate-500 text-sm">Typical subscriptions</p>
                    <p className="mt-8">
                        <span className="text-4xl font-extrabold text-slate-900">$15</span>
                        <span className="text-base font-medium text-slate-500">/mo</span>
                    </p>
                    <ul role="list" className="mt-8 space-y-4">
                        <li className="flex items-center text-slate-500">
                            <Check className="flex-shrink-0 w-5 h-5 text-green-500 mr-3" />
                            File conversion
                        </li>
                        <li className="flex items-center text-slate-500">
                            <X className="flex-shrink-0 w-5 h-5 text-red-500 mr-3" />
                            Uploads files to server
                        </li>
                        <li className="flex items-center text-slate-500">
                            <X className="flex-shrink-0 w-5 h-5 text-red-500 mr-3" />
                            Daily limits on free tier
                        </li>
                        <li className="flex items-center text-slate-500">
                            <X className="flex-shrink-0 w-5 h-5 text-red-500 mr-3" />
                            Requires signup
                        </li>
                    </ul>
                </div>

                {/* Convertify Card */}
                <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-600 p-8 flex-1 relative transform scale-105 z-10">
                    <div className="absolute top-0 right-0 -mt-4 mr-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        Your Choice
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">Convertify</h3>
                    <p className="mt-4 text-slate-500 text-sm">Forever Free</p>
                    <p className="mt-8">
                        <span className="text-4xl font-extrabold text-slate-900">$0</span>
                        <span className="text-base font-medium text-slate-500">/forever</span>
                    </p>
                    <ul role="list" className="mt-8 space-y-4">
                        <li className="flex items-center text-slate-900 font-medium">
                            <Check className="flex-shrink-0 w-5 h-5 text-blue-600 mr-3" />
                            Unlimited conversions
                        </li>
                        <li className="flex items-center text-slate-900 font-medium">
                            <Check className="flex-shrink-0 w-5 h-5 text-blue-600 mr-3" />
                            100% Client-side (No Uploads)
                        </li>
                        <li className="flex items-center text-slate-900 font-medium">
                            <Check className="flex-shrink-0 w-5 h-5 text-blue-600 mr-3" />
                            No Daily Limits
                        </li>
                        <li className="flex items-center text-slate-900 font-medium">
                            <Check className="flex-shrink-0 w-5 h-5 text-blue-600 mr-3" />
                            No Signup Required
                        </li>
                    </ul>
                    <div className="mt-8">
                        <Link
                            href="/all-tools"
                            className="block w-full py-3 px-6 border border-transparent rounded-xl shadow-lg text-center font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all hover:scale-105"
                        >
                            Start Converting
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

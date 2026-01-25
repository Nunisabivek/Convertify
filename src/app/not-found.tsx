import Link from 'next/link'
import { FileQuestion, Home, Search } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="bg-slate-100 p-6 rounded-full mb-6 animate-bounce">
                <FileQuestion className="w-16 h-16 text-blue-600" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
                404
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
                Page Not Found
            </h2>

            <p className="text-lg text-slate-600 max-w-lg mb-10">
                Oops! The page you're looking for seems to have vanished into thin air.
                It might have been moved, deleted, or never existed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-600/20"
                >
                    <Home className="w-5 h-5 mr-2" />
                    Back to Home
                </Link>
                <Link
                    href="/all-tools"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-slate-700 font-medium border border-slate-200 hover:bg-slate-50 transition-all hover:scale-105"
                >
                    <Search className="w-5 h-5 mr-2" />
                    Browse Tools
                </Link>
            </div>
        </div>
    )
}

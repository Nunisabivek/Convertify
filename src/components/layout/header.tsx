"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Grid3x3, BookOpen, Shield } from "lucide-react"

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container px-4 md:px-6 flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/images/Convertify.png"
                        alt="Convertify Logo"
                        width={32}
                        height={32}
                        className="object-contain"
                    />
                    <span className="text-xl font-bold tracking-tight text-indigo-950">Convertify</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/all-tools"
                        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-indigo-600 transition-colors"
                    >
                        <Grid3x3 className="w-4 h-4" />
                        All Tools
                    </Link>
                    <Link
                        href="/blog"
                        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-indigo-600 transition-colors"
                    >
                        <BookOpen className="w-4 h-4" />
                        Blog
                    </Link>
                    <Link
                        href="/security"
                        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-indigo-600 transition-colors"
                    >
                        <Shield className="w-4 h-4" />
                        Security
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? (
                        <X className="w-6 h-6 text-slate-700" />
                    ) : (
                        <Menu className="w-6 h-6 text-slate-700" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg z-50">
                    <nav className="container px-4 py-4 flex flex-col gap-2">
                        <Link
                            href="/all-tools"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <Grid3x3 className="w-5 h-5 text-indigo-600" />
                            <div>
                                <span className="font-medium text-slate-900">All Tools</span>
                                <p className="text-xs text-slate-500">Browse all 29 PDF tools</p>
                            </div>
                        </Link>
                        <Link
                            href="/blog"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                            <div>
                                <span className="font-medium text-slate-900">Blog & Guides</span>
                                <p className="text-xs text-slate-500">PDF tips and tutorials</p>
                            </div>
                        </Link>
                        <Link
                            href="/security"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <Shield className="w-5 h-5 text-indigo-600" />
                            <div>
                                <span className="font-medium text-slate-900">Security</span>
                                <p className="text-xs text-slate-500">How we protect your files</p>
                            </div>
                        </Link>
                        <div className="border-t mt-2 pt-4">
                            <p className="text-xs text-slate-500 px-3">Popular Tools</p>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <Link
                                    href="/merge-pdf"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-sm text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded"
                                >
                                    Merge PDF
                                </Link>
                                <Link
                                    href="/compress-pdf"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-sm text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded"
                                >
                                    Compress PDF
                                </Link>
                                <Link
                                    href="/jpg-to-pdf"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-sm text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded"
                                >
                                    JPG to PDF
                                </Link>
                                <Link
                                    href="/pdf-to-word"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-sm text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded"
                                >
                                    PDF to Word
                                </Link>
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}

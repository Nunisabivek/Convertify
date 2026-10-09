'use client'

import Link from 'next/link'
import { ShieldCheck, WifiOff, Lock, ChevronRight, Star } from 'lucide-react'

export default function MobileAboutPage() {
    return (
        <div className="mobile-about">
            <h1 className="mobile-about-title">About Convertify</h1>
            <p className="mobile-about-lead">
                Private, high-performance document & media tools that run 100% on this device.
            </p>

            <section className="mobile-about-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(var(--md-primary-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--md-primary)' }}>
                        <ShieldCheck size={18} strokeWidth={2.4} />
                    </div>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Your Files Stay Private</h2>
                </div>
                <p>
                    All processing happens in device memory. Documents and photos are never uploaded to any remote server.
                </p>
            </section>

            <section className="mobile-about-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(52, 199, 89, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34C759' }}>
                        <WifiOff size={18} strokeWidth={2.4} />
                    </div>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Works Completely Offline</h2>
                </div>
                <p>
                    Once loaded, all core tools (PDF compressor, merger, image converters, QR generator) function smoothly without an internet connection.
                </p>
            </section>

            <section className="mobile-about-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255, 149, 0, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF9500' }}>
                        <Lock size={18} strokeWidth={2.4} />
                    </div>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Privacy & Data Handling</h2>
                </div>
                <p>
                    We respect your privacy. No account required, no sign-up, and zero tracking of your document contents.
                </p>
                <Link href="/privacy" className="mobile-about-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 12, color: 'var(--md-primary)', fontWeight: 600, fontSize: 14 }}>
                    <span>Read Privacy Policy</span>
                    <ChevronRight size={16} />
                </Link>
            </section>

            <section className="mobile-about-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(2, 110, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--md-primary)' }}>
                        <Star size={18} strokeWidth={2.4} />
                    </div>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Google Play Store</h2>
                </div>
                <p>
                    Enjoying Convertify? Rate us on Google Play or share the app with friends.
                </p>
                <a
                    href="https://play.google.com/store/apps/details?id=com.convertify.work"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mobile-about-link"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 12, color: 'var(--md-primary)', fontWeight: 600, fontSize: 14 }}
                >
                    <span>View on Google Play</span>
                    <ChevronRight size={16} />
                </a>
            </section>
        </div>
    )
}

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface MobileLayoutProps {
    children: ReactNode;
}

const navItems = [
    { href: '/', icon: 'home', label: 'Home' },
    { href: '/all-tools', icon: 'grid_view', label: 'Tools' },
    { href: '/blog', icon: 'menu_book', label: 'Guides' },
    { href: '/about', icon: 'info', label: 'About' },
];

export default function MobileLayout({ children }: MobileLayoutProps) {
    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState(false);
    const [isCapacitor, setIsCapacitor] = useState(false);

    useEffect(() => {
        // Check if running in Capacitor
        const checkCapacitor = async () => {
            try {
                const { Capacitor } = await import('@capacitor/core');
                setIsCapacitor(Capacitor.isNativePlatform());
            } catch {
                setIsCapacitor(false);
            }
        };

        checkCapacitor();

        // Check screen size
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Only show mobile layout in Capacitor or on mobile devices
    if (!isCapacitor && !isMobile) {
        return <>{children}</>;
    }

    return (
        <div className="mobile-app">
            {/* Top App Bar */}
            <header className="mobile-top-bar">
                <div className="mobile-top-bar-title">
                    <Image
                        src="/images/Convertify.png"
                        alt="Convertify"
                        width={32}
                        height={32}
                        className="mobile-top-bar-logo"
                    />
                    <span className="mobile-top-bar-text">Convertify</span>
                </div>

                <div className="mobile-top-bar-actions">
                    <Link href="/all-tools" className="mobile-icon-btn" aria-label="Search tools">
                        <span className="material-icons">search</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="mobile-content">
                {children}
            </main>

            {/* Floating Action Button */}
            <div className="mobile-fab">
                <Link href="/all-tools" className="mobile-fab-button">
                    <span className="material-icons mobile-fab-icon">add</span>
                    Quick Convert
                </Link>
            </div>

            {/* Bottom Navigation */}
            <nav className="mobile-bottom-nav">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`mobile-nav-item ${pathname === item.href ? 'active' : ''}`}
                    >
                        <span className="material-icons mobile-nav-icon">{item.icon}</span>
                        <span className="mobile-nav-label">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}

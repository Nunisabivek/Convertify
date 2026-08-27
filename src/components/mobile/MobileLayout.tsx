'use client'

import { ReactNode, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { AppIcon } from '@/components/mobile/AppIcon'
import NativeResultSheet from '@/components/mobile/NativeResultSheet'
import { getToolById } from '@/lib/tools-registry'
import { ANDROID_SHORT_NAMES } from '@/lib/mobile-tools'

interface MobileLayoutProps {
    children: ReactNode
}

const navItems = [
    { href: '/', icon: 'Home', label: 'Home' },
    { href: '/all-tools', icon: 'LayoutGrid', label: 'Tools' },
    { href: '/about', icon: 'Info', label: 'About' },
]

function toolTitleFromPath(pathname: string): string | null {
    const slug = pathname.replace(/^\//, '').replace(/\/$/, '')
    if (!slug || slug === 'all-tools' || slug === 'about' || slug === 'privacy') return null
    const tool = getToolById(slug)
    if (tool) return ANDROID_SHORT_NAMES[tool.id] ?? tool.name
    return null
}

export default function MobileLayout({ children }: MobileLayoutProps) {
    const pathname = usePathname() || '/'

    useEffect(() => {
        let cancelled = false
        const applySafeArea = async () => {
            try {
                const ConvertifyFiles = (await import('@/lib/convertify-files')).default
                const insets = await ConvertifyFiles.getSafeAreaInsets()
                if (cancelled) return
                const root = document.documentElement
                root.style.setProperty('--safe-area-inset-top', `${insets.top}px`)
                root.style.setProperty('--safe-area-inset-right', `${insets.right}px`)
                root.style.setProperty('--safe-area-inset-bottom', `${insets.bottom}px`)
                root.style.setProperty('--safe-area-inset-left', `${insets.left}px`)
            } catch {
                // Web preview has no native plugin
            }
        }
        ;(async () => {
            try {
                const { Capacitor } = await import('@capacitor/core')
                if (!Capacitor.isNativePlatform() || cancelled) return
                const { StatusBar, Style } = await import('@capacitor/status-bar')
                await StatusBar.setOverlaysWebView({ overlay: false })
                await StatusBar.setBackgroundColor({ color: '#F3F0EA' })
                await StatusBar.setStyle({ style: Style.Light })
                await applySafeArea()
            } catch {
                // StatusBar plugin may be missing in web preview
            }
        })()
        window.addEventListener('resize', applySafeArea)
        window.addEventListener('orientationchange', applySafeArea)
        return () => {
            cancelled = true
            window.removeEventListener('resize', applySafeArea)
            window.removeEventListener('orientationchange', applySafeArea)
        }
    }, [])

    const isTab = navItems.some((item) => item.href === pathname)
    const toolTitle = toolTitleFromPath(pathname)
    const showBack = !isTab
    const heading =
        toolTitle ||
        (pathname === '/all-tools'
            ? 'All tools'
            : pathname === '/about' || pathname === '/privacy'
                ? 'About'
                : 'Convertify')

    return (
        <div className="mobile-app is-native">
            <NativeResultSheet />
            <header className="mobile-top-bar">
                {showBack ? (
                    <Link href="/" className="mobile-icon-btn" aria-label="Back">
                        <AppIcon name="ChevronLeft" size={24} />
                    </Link>
                ) : (
                    <div className="mobile-top-bar-brand" aria-hidden>
                        <span className="mobile-mark">C</span>
                    </div>
                )}
                <div className="mobile-top-bar-title">
                    <span className="mobile-top-bar-text">{heading}</span>
                </div>
                <span className="mobile-icon-btn" aria-hidden />
            </header>

            <main className="mobile-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.14, ease: 'easeOut' }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            <nav className="mobile-bottom-nav" aria-label="Main">
                {navItems.map((item) => {
                    const active = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`mobile-nav-item${active ? ' active' : ''}`}
                        >
                            <AppIcon name={item.icon} className="mobile-nav-icon" size={22} />
                            <span className="mobile-nav-label">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}

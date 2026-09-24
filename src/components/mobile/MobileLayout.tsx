'use client'

import { ReactNode, useEffect, useState, useSyncExternalStore } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppIcon } from '@/components/mobile/AppIcon'
import NativeResultSheet from '@/components/mobile/NativeResultSheet'
import { getToolById } from '@/lib/tools-registry'
import { ANDROID_SHORT_NAMES, ANDROID_V1_TOOL_IDS } from '@/lib/mobile-tools'
import { tapHaptic } from '@/lib/haptics'
import { abortConvertWorker } from '@/lib/jobs/media'
import { isConverting, subscribeConverting } from '@/lib/jobs/session'
import { closeResultSheet, isResultSheetOpen } from '@/lib/result-sheet'
import { mobileRouteTitle } from '@/lib/document-title'
import MobileToolSheet from '@/components/mobile/MobileToolSheet'
import { ToolSheetProvider, useToolSheet } from '@/components/mobile/ToolSheetContext'

interface MobileLayoutProps {
    children: ReactNode
}

const navItems = [
    { href: '/', icon: 'Home', label: 'Home' },
    { href: '/all-tools', icon: 'LayoutGrid', label: 'Tools' },
    { href: '/about', icon: 'Info', label: 'About' },
]

const LAST_TAB_KEY = 'convertify-last-tab'

function toolTitleFromPath(pathname: string): string | null {
    const slug = pathname.replace(/^\//, '').replace(/\/$/, '')
    if (!slug || slug === 'all-tools' || slug === 'about' || slug === 'privacy') return null
    const tool = getToolById(slug)
    if (tool) return ANDROID_SHORT_NAMES[tool.id] ?? tool.name
    return null
}

function normalizePath(pathname: string): string {
    if (!pathname || pathname === '') return '/'
    return pathname.replace(/\/$/, '') || '/'
}

function isNavActive(href: string, pathname: string): boolean {
    const path = normalizePath(pathname)
    if (href === '/') return path === '/'
    if (href === '/all-tools') return path === '/all-tools'
    if (href === '/about') return path === '/about' || path === '/privacy'
    return false
}

function rememberTab(pathname: string): void {
    const path = normalizePath(pathname)
    if (path === '/' || path === '/all-tools') {
        try {
            sessionStorage.setItem(LAST_TAB_KEY, path)
        } catch {
            // ignore
        }
    }
}

function lastTab(): string {
    try {
        const stored = sessionStorage.getItem(LAST_TAB_KEY)
        if (stored === '/' || stored === '/all-tools') return stored
    } catch {
        // ignore
    }
    return '/'
}

function isRootTab(pathname: string): boolean {
    const path = normalizePath(pathname)
    return path === '/' || path === '/all-tools'
}

export default function MobileLayout({ children }: MobileLayoutProps) {
    return (
        <ToolSheetProvider>
            <MobileLayoutInner>{children}</MobileLayoutInner>
        </ToolSheetProvider>
    )
}

function MobileLayoutInner({ children }: MobileLayoutProps) {
    const pathname = usePathname() || '/'
    const router = useRouter()
    const { isOpen: isSheetOpen, closeTool: closeSheet, openTool } = useToolSheet()
    const converting = useSyncExternalStore(subscribeConverting, isConverting, () => false)
    const [isDesktop, setIsDesktop] = useState(false)
    const [showFrame, setShowFrame] = useState(true)

    useEffect(() => {
        const checkDesktop = async () => {
            try {
                const { Capacitor } = await import('@capacitor/core')
                if (!Capacitor.isNativePlatform() && window.innerWidth >= 860) {
                    setIsDesktop(true)
                }
            } catch {
                if (window.innerWidth >= 860) setIsDesktop(true)
            }
        }
        void checkDesktop()
        const onResize = () => {
            setIsDesktop(window.innerWidth >= 860)
        }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    useEffect(() => {
        rememberTab(pathname)
        document.title = mobileRouteTitle(pathname)
    }, [pathname])

    useEffect(() => {
        ANDROID_V1_TOOL_IDS.forEach((id) => {
            void router.prefetch(`/${id}`)
        })
        void router.prefetch('/all-tools')
        void router.prefetch('/about')
    }, [router])

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
                await StatusBar.setBackgroundColor({ color: '#FFFFFF' })
                await StatusBar.setStyle({ style: Style.Light })
                await applySafeArea()
            } catch {
                // StatusBar plugin may be missing in web preview
            }
        })()
        window.addEventListener('resize', applySafeArea)
        window.addEventListener('orientationchange', applySafeArea)
        // Banner from the first Android screen only. Website never mounts this layout.
        void import('@/lib/native-ads').then((m) => m.startNativeAds()).catch(() => {})
        return () => {
            cancelled = true
            window.removeEventListener('resize', applySafeArea)
            window.removeEventListener('orientationchange', applySafeArea)
        }
    }, [])

    useEffect(() => {
        return () => {
            abortConvertWorker()
        }
    }, [pathname])

    useEffect(() => {
        let handle: { remove: () => Promise<void> } | null = null
        let cancelled = false
        ;(async () => {
            try {
                const { Capacitor } = await import('@capacitor/core')
                if (!Capacitor.isNativePlatform() || cancelled) return
                const { App } = await import('@capacitor/app')
                handle = await App.addListener('backButton', ({ canGoBack }) => {
                    if (closeResultSheet()) return
                    if (isSheetOpen) {
                        closeSheet()
                        return
                    }
                    const path = normalizePath(window.location.pathname)
                    if (path === '/about' || path === '/privacy') {
                        router.push(lastTab())
                        return
                    }
                    if (!isRootTab(path)) {
                        if (canGoBack) router.back()
                        else router.push(lastTab())
                        return
                    }
                    if (path === '/all-tools') {
                        router.push('/')
                        return
                    }
                    void App.exitApp()
                })
            } catch {
                // plugin missing in web preview
            }
        })()
        return () => {
            cancelled = true
            void handle?.remove()
        }
    }, [router, isSheetOpen, closeSheet])

    const path = normalizePath(pathname)
    const isTab = isRootTab(path) || path === '/about' || path === '/privacy'
    const toolTitle = toolTitleFromPath(path)
    const showBack = !isTab
    const heading =
        toolTitle ||
        (path === '/all-tools'
            ? 'All tools'
            : path === '/about' || path === '/privacy'
                ? 'About'
                : 'Convertify')

    const goBack = () => {
        void tapHaptic()
        if (closeResultSheet()) return
        if (isSheetOpen) {
            closeSheet()
            return
        }
        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back()
            return
        }
        router.push(lastTab())
    }

    const appContent = (
        <div className="mobile-app is-native">
            <NativeResultSheet />
            <MobileToolSheet />
            <header className="mobile-top-bar">
                {showBack ? (
                    <button type="button" className="mobile-icon-btn" aria-label="Back" onClick={goBack}>
                        <AppIcon name="ChevronLeft" size={22} />
                    </button>
                ) : (
                    <div className="mobile-top-bar-brand" aria-hidden>
                        <span className="mobile-mark">C</span>
                    </div>
                )}
                <div className="mobile-top-bar-title">
                    <span className="mobile-top-bar-text">{heading}</span>
                </div>
                <span className="mobile-icon-btn" style={{ opacity: 0, pointerEvents: 'none' }} aria-hidden />
            </header>

            <main className="mobile-content">
                <div key={path} className={converting ? 'mobile-route-page' : 'mobile-route-page is-enter'}>
                    {children}
                </div>
            </main>

            <nav className="mobile-bottom-nav" aria-label="Main">
                {navItems.map((item) => {
                    const active = isNavActive(item.href, path)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            prefetch
                            aria-current={active ? 'page' : undefined}
                            className={`mobile-nav-item${active ? ' active' : ''}`}
                            onClick={() => {
                                void tapHaptic()
                                if (isResultSheetOpen()) closeResultSheet()
                            }}
                        >
                            <AppIcon name={item.icon} className="mobile-nav-icon" size={22} />
                            <span className="mobile-nav-label">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )

    if (isDesktop && showFrame) {
        return (
            <div className="mobile-simulator-wrapper">
                <div className="mobile-simulator-container">
                    {/* Modern Android Flagship Frame */}
                    <div className="mobile-android-frame">
                        <div className="mobile-android-punchhole" />
                        <div className="mobile-android-screen">
                            <div className="mobile-simulator-statusbar">
                                <span className="mobile-statusbar-time">10:30</span>
                                <div className="mobile-statusbar-icons">
                                    <span>5G</span>
                                    <span>98%</span>
                                </div>
                            </div>
                            {appContent}
                            <div className="mobile-home-indicator" />
                        </div>
                    </div>

                    {/* Side-by-Side Inspector Dock */}
                    <aside className="mobile-preview-dock">
                        <div className="mobile-dock-header">
                            <div className="mobile-dock-logo">C</div>
                            <div>
                                <div className="mobile-dock-title">Convertify Android</div>
                                <div className="mobile-dock-subtitle">App Preview (Clean UX)</div>
                            </div>
                        </div>

                        <div className="mobile-dock-section">
                            <span className="mobile-dock-section-title">Quick Screens</span>
                            <Link href="/" className={`mobile-dock-btn${path === '/' ? ' is-active' : ''}`}>
                                <span>Home Screen</span>
                                <span className="mobile-dock-badge">Home</span>
                            </Link>
                            <Link href="/all-tools" className={`mobile-dock-btn${path === '/all-tools' ? ' is-active' : ''}`}>
                                <span>Tools Dashboard</span>
                                <span className="mobile-dock-badge">40+ Tools</span>
                            </Link>
                            <button
                                type="button"
                                className="mobile-dock-btn"
                                onClick={() => openTool('compress-pdf')}
                            >
                                <span>Compress PDF Sheet</span>
                                <span className="mobile-dock-badge">UPI Sheet</span>
                            </button>
                            <Link href="/about" className={`mobile-dock-btn${path === '/about' ? ' is-active' : ''}`}>
                                <span>About & Privacy</span>
                                <span className="mobile-dock-badge">Info</span>
                            </Link>
                        </div>

                        <div className="mobile-dock-section">
                            <span className="mobile-dock-section-title">Preview Mode</span>
                            <button
                                type="button"
                                className="mobile-dock-btn"
                                onClick={() => setShowFrame(false)}
                            >
                                <span>Switch to Full Window</span>
                                <span className="mobile-dock-badge">View</span>
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        )
    }

    return appContent
}

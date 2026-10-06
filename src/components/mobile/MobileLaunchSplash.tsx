'use client'

import React, { useEffect, useState } from 'react'
import { Zap, ShieldCheck } from 'lucide-react'

const SPLASH_STORAGE_KEY = 'convertify_splash_shown'

export default function MobileLaunchSplash() {
    const [mounted, setMounted] = useState(false)
    const [isExiting, setIsExiting] = useState(false)

    useEffect(() => {
        // Only run once per session so navigating tabs doesn't replay the intro
        try {
            if (sessionStorage.getItem(SPLASH_STORAGE_KEY)) {
                return
            }
        } catch {
            // ignore storage access errors
        }

        setMounted(true)

        // Begin smooth exit at 620ms
        const exitTimer = window.setTimeout(() => {
            setIsExiting(true)
        }, 620)

        // Fully unmount from DOM at 900ms
        const unmountTimer = window.setTimeout(() => {
            try {
                sessionStorage.setItem(SPLASH_STORAGE_KEY, 'true')
            } catch {
                // ignore
            }
            setMounted(false)
        }, 900)

        return () => {
            window.clearTimeout(exitTimer)
            window.clearTimeout(unmountTimer)
        }
    }, [])

    if (!mounted) return null

    const handleSkip = () => {
        setIsExiting(true)
        window.setTimeout(() => {
            try {
                sessionStorage.setItem(SPLASH_STORAGE_KEY, 'true')
            } catch {
                // ignore
            }
            setMounted(false)
        }, 150)
    }

    return (
        <div
            className={`mobile-launch-splash${isExiting ? ' is-leaving' : ''}`}
            onClick={handleSkip}
            role="presentation"
            aria-hidden="true"
        >
            <div className="mobile-launch-content">
                <div className="mobile-launch-mascot-wrapper">
                    <div className="mobile-launch-mascot">
                        <span className="mobile-launch-letter">C</span>
                        <div className="mobile-launch-spark">
                            <Zap size={14} strokeWidth={2.6} />
                        </div>
                    </div>
                    <div className="mobile-launch-shadow" />
                </div>

                <div className="mobile-launch-text">
                    <h1 className="mobile-launch-title">Convertify</h1>
                    <div className="mobile-launch-badge">
                        <ShieldCheck size={13} strokeWidth={2.4} />
                        <span>Fast • 100% Private • Offline</span>
                    </div>
                </div>

                <div className="mobile-launch-loader">
                    <div className="mobile-launch-progress" />
                </div>
            </div>
        </div>
    )
}

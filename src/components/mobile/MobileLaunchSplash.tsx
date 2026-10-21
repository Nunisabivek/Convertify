'use client'

import { useEffect, useRef, useState } from 'react'
import ConvertifyFiles from '@/lib/convertify-files'

const SPLASH_STORAGE_KEY = 'convertify_splash_shown'
const WORD = 'Convertify'
const CHIPS = ['PDF', 'JPG', 'DOC'] as const

/** Intro length from the moment it starts playing. Matches the CSS timeline. */
const HOLD_MS = 1620
const HOLD_REDUCED_MS = 450
const EXIT_MS = 440
/** Never let a slow font hold the intro back for longer than this. */
const FONT_WAIT_MS = 300

type Phase = 'idle' | 'play' | 'leave' | 'done'

/** Drop the Android system splash. No-op (rejects, caught) outside the app shell. */
const releaseNativeSplash = () => ConvertifyFiles.splashReady().catch(() => {})

/**
 * First frame is the Android system splash (blue circle, white C, centred).
 * The system splash stays up until this has painted and is ready to play, then
 * cuts away on the frame the animation starts, so the logo moves straight into
 * the hop instead of fading out and popping back. Then: the circle squashes
 * into the app tile, hops, lands, file chips pop out and get swallowed, the
 * wordmark bounces in, and the tile flies into the top-bar logo.
 * Rendered in the static HTML; `data-launched` (set before paint in layout)
 * hides it on same-session reloads.
 */
export default function MobileLaunchSplash() {
    const [phase, setPhase] = useState<Phase>('idle')
    const rootRef = useRef<HTMLDivElement>(null)
    const flyRef = useRef<HTMLDivElement>(null)
    const timers = useRef<number[]>([])

    const later = (fn: () => void, ms: number) => {
        timers.current.push(window.setTimeout(fn, ms))
    }

    const leave = () => {
        timers.current.forEach(window.clearTimeout)
        timers.current = []
        try {
            sessionStorage.setItem(SPLASH_STORAGE_KEY, 'true')
        } catch {
            // ignore
        }
        const root = rootRef.current
        const fly = flyRef.current
        const mark = document.querySelector('.mobile-top-bar .mobile-mark')
        if (root && fly && mark) {
            const a = fly.getBoundingClientRect()
            const b = mark.getBoundingClientRect()
            root.style.setProperty('--fly-x', `${b.left + b.width / 2 - (a.left + a.width / 2)}px`)
            root.style.setProperty('--fly-y', `${b.top + b.height / 2 - (a.top + a.height / 2)}px`)
            root.style.setProperty('--fly-s', `${b.width / a.width}`)
        }
        setPhase('leave')
        later(() => setPhase('done'), EXIT_MS)
    }

    useEffect(() => {
        let seen = document.documentElement.hasAttribute('data-launched')
        try {
            seen ||= Boolean(sessionStorage.getItem(SPLASH_STORAGE_KEY))
        } catch {
            // ignore
        }
        if (seen) {
            void releaseNativeSplash()
            setPhase('done')
            return
        }

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        let started = false
        let cancelled = false
        const start = () => {
            if (started || cancelled) return
            started = true
            void releaseNativeSplash().then(() => {
                if (cancelled) return
                setPhase('play')
                later(leave, reduced ? HOLD_REDUCED_MS : HOLD_MS)
            })
        }
        // Wordmark letters bounce in; a font swap mid-bounce would jitter them.
        const family = getComputedStyle(document.body).getPropertyValue('--font-app').trim()
        if (family && document.fonts) {
            document.fonts.load(`800 38px ${family}`).then(start, start)
        } else {
            start()
        }
        later(start, FONT_WAIT_MS)

        return () => {
            cancelled = true
            timers.current.forEach(window.clearTimeout)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (phase === 'done') return null

    return (
        <div
            ref={rootRef}
            className={`mobile-launch-splash${phase === 'idle' ? '' : ' is-playing'}${phase === 'leave' ? ' is-leaving' : ''}`}
            onClick={() => phase === 'play' && leave()}
            role="presentation"
            aria-hidden="true"
        >
            <div className="launch-bg" />
            <div className="launch-scene">
                <div className="launch-shadow" />
                <div className="launch-chips">
                    {CHIPS.map((label) => (
                        <span key={label} className={`launch-chip is-${label.toLowerCase()}`}>
                            <span className="launch-chip-tag">{label}</span>
                        </span>
                    ))}
                </div>
                <div className="launch-word">
                    {WORD.split('').map((ch, i) => (
                        <span key={i} style={{ ['--i' as string]: i }}>
                            {ch}
                        </span>
                    ))}
                </div>
                <p className="launch-tagline">Your files never leave this phone</p>
            </div>
            <div ref={flyRef} className="launch-fly">
                <div className="launch-tile">
                    <div className="launch-face">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="launch-c" src="/brand-c.webp" alt="" draggable={false} />
                    </div>
                </div>
            </div>
        </div>
    )
}

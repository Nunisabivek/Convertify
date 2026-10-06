'use client'

import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { X, ShieldCheck, ArrowLeftRight } from 'lucide-react'
import { useToolSheet } from './ToolSheetContext'
import { ToolGlyph } from './ToolGlyph'
import { TOOL_LOADERS } from './tool-loaders'
import { getToolById } from '@/lib/tools-registry'
import { ANDROID_SHORT_NAMES, isAndroidV1Tool } from '@/lib/mobile-tools'
import { getSwapInfo, parseConvertDirection } from '@/lib/tool-swap'
import { tapHaptic } from '@/lib/haptics'
import { toolAccent } from '@/lib/tool-accent'

/** Static placeholder shown while the slide-up runs. No animation, no layout work. */
function ToolSkeleton() {
    return (
        <div className="mobile-sheet-skeleton" aria-hidden>
            <div className="mobile-sheet-skeleton-card" />
            <div className="mobile-sheet-skeleton-bar" />
        </div>
    )
}

// lazy() wraps the same loader that preloadTool() warms, so a preloaded tool
// resolves on the next tick instead of downloading mid-animation.
const TOOL_COMPONENTS = Object.fromEntries(
    Object.entries(TOOL_LOADERS).map(([id, load]) => [id, lazy(load)]),
) as Record<string, React.LazyExoticComponent<React.ComponentType<any>>>

const SLIDE_FALLBACK_MS = 340
const DRAG_CLOSE_PX = 90
const DRAG_CLOSE_VELOCITY = 0.6 // px per ms

export default function MobileToolSheet() {
    const { isOpen, activeToolId, openTool, closeTool } = useToolSheet()

    const slideRef = useRef<HTMLDivElement>(null)
    const slideDoneRef = useRef(false)
    const drag = useRef({ active: false, startY: 0, lastY: 0, lastT: 0, velocity: 0 })

    // The tool body mounts only after the sheet has finished sliding. Mounting a
    // big client (and evaluating its chunk) mid-slide steals frames on low-end
    // phones; a static skeleton keeps the sheet stable until then.
    const [readyId, setReadyId] = useState<string | null>(null)

    const markSlideDone = useCallback(() => {
        slideDoneRef.current = true
        setReadyId(activeToolId)
    }, [activeToolId])

    useEffect(() => {
        if (!activeToolId) {
            slideDoneRef.current = false
            setReadyId(null)
            return
        }
        // Closing: keep the body as-is so it doesn't flicker during the exit.
        if (!isOpen) {
            slideDoneRef.current = false
            return
        }
        // Swapping tools inside an open sheet: no slide to wait for.
        if (slideDoneRef.current) {
            setReadyId(activeToolId)
            return
        }
        // Fallback for reduced motion or an animationend that never fires.
        const timer = window.setTimeout(() => {
            slideDoneRef.current = true
            setReadyId(activeToolId)
        }, SLIDE_FALLBACK_MS)
        return () => window.clearTimeout(timer)
    }, [isOpen, activeToolId])

    const onGrabDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isOpen || (e.target as Element).closest('button')) return
        const now = performance.now()
        drag.current = { active: true, startY: e.clientY, lastY: e.clientY, lastT: now, velocity: 0 }
        e.currentTarget.setPointerCapture(e.pointerId)
        const el = slideRef.current
        if (el) el.style.transition = 'none'
    }

    const onGrabMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const d = drag.current
        if (!d.active) return
        const now = performance.now()
        const dy = Math.max(0, e.clientY - d.startY)
        const dt = Math.max(1, now - d.lastT)
        d.velocity = (e.clientY - d.lastY) / dt
        d.lastY = e.clientY
        d.lastT = now
        const el = slideRef.current
        // Direct style write: no React state, no re-render per pointer move.
        if (el) el.style.transform = `translate3d(0, ${dy}px, 0)`
    }

    const onGrabUp = (e: React.PointerEvent<HTMLDivElement>) => {
        const d = drag.current
        if (!d.active) return
        d.active = false
        const el = slideRef.current
        const dy = Math.max(0, e.clientY - d.startY)
        if (!el) return
        if (dy > DRAG_CLOSE_PX || d.velocity > DRAG_CLOSE_VELOCITY) {
            el.style.setProperty('--drag-y', `${dy}px`)
            el.style.transition = ''
            el.style.transform = ''
            void tapHaptic()
            closeTool()
        } else {
            el.style.transition = 'transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)'
            el.style.transform = ''
            window.setTimeout(() => {
                if (el) el.style.transition = ''
            }, 220)
        }
    }

    const tool = activeToolId ? getToolById(activeToolId) : null
    const title = activeToolId ? (ANDROID_SHORT_NAMES[activeToolId] ?? tool?.name ?? 'Tool') : 'Tool'
    const ActiveComponent = readyId && readyId === activeToolId ? TOOL_COMPONENTS[readyId] : null
    const direction = activeToolId ? parseConvertDirection(activeToolId) : null
    const swap = activeToolId ? getSwapInfo(activeToolId) : null
    const showSwap = Boolean(swap && isAndroidV1Tool(swap.target))

    const body = useMemo(
        () =>
            ActiveComponent ? (
                <Suspense fallback={<ToolSkeleton />}>
                    <ActiveComponent />
                </Suspense>
            ) : (
                <ToolSkeleton />
            ),
        [ActiveComponent],
    )

    // Stay mounted through the exit animation; the context clears activeToolId
    // once it has played.
    if (!activeToolId) return null

    return (
        <div className={`mobile-sheet-overlay-root${isOpen ? '' : ' is-closing'}`}>
            <div
                className="mobile-sheet-backdrop"
                onClick={() => {
                    void tapHaptic()
                    closeTool()
                }}
            />

            <div
                ref={slideRef}
                className={`mobile-tool-sheet-slide accent-${toolAccent(activeToolId)}`}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onAnimationEnd={(e) => {
                    if (e.target === e.currentTarget && isOpen) markSlideDone()
                }}
            >
                <div className="mobile-tool-sheet">
                    <div
                        className="mobile-sheet-grab"
                        onPointerDown={onGrabDown}
                        onPointerMove={onGrabMove}
                        onPointerUp={onGrabUp}
                        onPointerCancel={onGrabUp}
                    >
                        <div className="mobile-sheet-handle-bar">
                            <div className="mobile-sheet-handle-pill" />
                        </div>

                        <div className="mobile-sheet-header">
                            <div className="mobile-sheet-header-left">
                                <div className={`mobile-sheet-tool-icon accent-${toolAccent(activeToolId)}`}>
                                    <ToolGlyph toolId={activeToolId} size={24} />
                                </div>
                                <div>
                                    <h3 className="mobile-sheet-title">{title}</h3>
                                    <div className="mobile-sheet-badge">
                                        <ShieldCheck size={12} aria-hidden />
                                        <span>On-Device • 100% Private</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="mobile-sheet-close-btn"
                                aria-label="Close"
                                onClick={() => {
                                    void tapHaptic()
                                    closeTool()
                                }}
                            >
                                <X size={18} strokeWidth={2.2} />
                            </button>
                        </div>
                    </div>

                    {showSwap && swap && (
                        <div className="mobile-sheet-swap-bar">
                            {direction ? (
                                <div className="mobile-dir-chips" aria-hidden>
                                    <span className="mobile-dir-chip">{direction.from}</span>
                                    <span className="mobile-dir-arrow" aria-hidden>→</span>
                                    <span className="mobile-dir-chip is-out">{direction.to}</span>
                                </div>
                            ) : (
                                <div />
                            )}
                            <button
                                type="button"
                                className="mobile-sheet-swap-btn"
                                onClick={() => {
                                    void tapHaptic()
                                    openTool(swap.target)
                                }}
                            >
                                <ArrowLeftRight size={14} strokeWidth={2.2} aria-hidden />
                                <span>Swap to {swap.targetDirection}</span>
                            </button>
                        </div>
                    )}

                    <div className="mobile-sheet-body">{body}</div>
                </div>
            </div>
        </div>
    )
}

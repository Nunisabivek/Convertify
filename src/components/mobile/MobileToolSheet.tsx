'use client'

import React, { ComponentType } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldCheck, ArrowLeftRight } from 'lucide-react'
import { useToolSheet } from './ToolSheetContext'
import { ToolGlyph } from './ToolGlyph'
import { getToolById } from '@/lib/tools-registry'
import { ANDROID_SHORT_NAMES, isAndroidV1Tool } from '@/lib/mobile-tools'
import { getSwapInfo, parseConvertDirection } from '@/lib/tool-swap'
import { tapHaptic } from '@/lib/haptics'

const ToolLoading = () => (
    <div className="p-6 space-y-4 animate-pulse">
        <div className="h-32 bg-slate-100 rounded-2xl" />
        <div className="h-10 bg-slate-100 rounded-xl w-3/4 mx-auto" />
        <div className="h-12 bg-blue-50/50 rounded-xl" />
    </div>
)

const TOOL_COMPONENTS: Record<string, ComponentType<any>> = {
    'compress-pdf': dynamic(() => import('@/app/compress-pdf/mobile-client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'fit-to-size': dynamic(() => import('@/app/fit-to-size/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'passport-photo': dynamic(() => import('@/app/passport-photo/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'remove-background': dynamic(() => import('@/app/remove-background/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'merge-pdf': dynamic(() => import('@/app/merge-pdf/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'split-pdf': dynamic(() => import('@/app/split-pdf/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'rotate-pdf': dynamic(() => import('@/app/rotate-pdf/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'jpg-to-pdf': dynamic(() => import('@/app/jpg-to-pdf/mobile-client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'png-to-pdf': dynamic(() => import('@/app/png-to-pdf/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'pdf-to-jpg': dynamic(() => import('@/app/pdf-to-jpg/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'pdf-to-png': dynamic(() => import('@/app/pdf-to-png/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'word-to-pdf': dynamic(() => import('@/app/word-to-pdf/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'pdf-to-word': dynamic(() => import('@/app/pdf-to-word/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'excel-to-pdf': dynamic(() => import('@/app/excel-to-pdf/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'image-compressor': dynamic(() => import('@/app/image-compressor/mobile-client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'resize-image': dynamic(() => import('@/app/resize-image/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'heic-to-jpg': dynamic(() => import('@/app/heic-to-jpg/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'webp-converter': dynamic(() => import('@/app/webp-converter/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'watermark-pdf': dynamic(() => import('@/app/watermark-pdf/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'add-page-numbers': dynamic(() => import('@/app/add-page-numbers/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'qr-code-generator': dynamic(() => import('@/app/qr-code-generator/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
    'autocad-pdf-editor': dynamic(() => import('@/app/autocad-pdf-editor/client'), {
        loading: ToolLoading,
        ssr: false,
    }),
}

export default function MobileToolSheet() {
    const { isOpen, activeToolId, openTool, closeTool } = useToolSheet()

    if (!isOpen && !activeToolId) return null

    const tool = activeToolId ? getToolById(activeToolId) : null
    const title = activeToolId ? (ANDROID_SHORT_NAMES[activeToolId] ?? tool?.name ?? 'Tool') : 'Tool'
    const ActiveComponent = activeToolId ? TOOL_COMPONENTS[activeToolId] : null
    const direction = activeToolId ? parseConvertDirection(activeToolId) : null
    const swap = activeToolId ? getSwapInfo(activeToolId) : null
    const showSwap = Boolean(swap && isAndroidV1Tool(swap.target))

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="mobile-sheet-overlay-root">
                    {/* Backdrop Scrim */}
                    <motion.div
                        className="mobile-sheet-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => {
                            void tapHaptic()
                            closeTool()
                        }}
                    />

                    {/* Half-screen to 80% Bottom Sheet */}
                    <motion.div
                        className="mobile-tool-sheet"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{
                            type: 'spring',
                            damping: 30,
                            stiffness: 350,
                            mass: 0.8,
                        }}
                        drag="y"
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, { offset, velocity }) => {
                            if (offset.y > 80 || velocity.y > 400) {
                                void tapHaptic()
                                closeTool()
                            }
                        }}
                    >
                        {/* Drag Pill Handle */}
                        <div className="mobile-sheet-handle-bar">
                            <div className="mobile-sheet-handle-pill" />
                        </div>

                        {/* Sheet Header */}
                        <div className="mobile-sheet-header">
                            <div className="mobile-sheet-header-left">
                                {activeToolId && (
                                    <div className="mobile-sheet-tool-icon">
                                        <ToolGlyph toolId={activeToolId} size={24} />
                                    </div>
                                )}
                                <div>
                                    <h3 className="mobile-sheet-title">{title}</h3>
                                    <div className="mobile-sheet-badge">
                                        <ShieldCheck size={12} className="text-[#026EFF]" />
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

                        {/* Direction & Tool Swap Affordance */}
                        {showSwap && swap && (
                            <div className="mobile-sheet-swap-bar">
                                {direction ? (
                                    <div className="mobile-dir-chips" aria-hidden>
                                        <span className="mobile-dir-chip">{direction.from}</span>
                                        <span className="mobile-dir-arrow" aria-hidden>→</span>
                                        <span className="mobile-dir-chip is-out">{direction.to}</span>
                                    </div>
                                ) : <div />}
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

                        {/* Sheet Body (Tool Workspace) */}
                        <div className="mobile-sheet-body">
                            {ActiveComponent ? (
                                <ActiveComponent />
                            ) : (
                                <div className="p-8 text-center text-slate-500">
                                    <p>Loading tool options...</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

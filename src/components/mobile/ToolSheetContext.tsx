'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { tapHaptic } from '@/lib/haptics'

interface ToolSheetContextType {
    isOpen: boolean
    activeToolId: string | null
    openTool: (toolId: string) => void
    closeTool: () => void
}

const ToolSheetContext = createContext<ToolSheetContextType>({
    isOpen: false,
    activeToolId: null,
    openTool: () => {},
    closeTool: () => {},
})

export function ToolSheetProvider({ children }: { children: ReactNode }) {
    const [activeToolId, setActiveToolId] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const closeTool = useCallback(() => {
        setIsOpen(false)
        if (typeof window !== 'undefined' && window.location.hash.startsWith('#tool-')) {
            window.history.replaceState(null, '', window.location.pathname)
        }
        setTimeout(() => {
            setActiveToolId(null)
        }, 280)
    }, [])

    const openTool = useCallback((toolId: string) => {
        void tapHaptic()
        setActiveToolId(toolId)
        setIsOpen(true)
        if (typeof window !== 'undefined') {
            if (window.location.hash.startsWith('#tool-')) {
                window.history.replaceState({ toolSheet: toolId }, '', `#tool-${toolId}`)
            } else {
                window.history.pushState({ toolSheet: toolId }, '', `#tool-${toolId}`)
            }
        }
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.hash.startsWith('#tool-')) {
            const match = window.location.hash.match(/^#tool-(.+)$/)
            if (match && match[1]) {
                setActiveToolId(match[1])
                setIsOpen(true)
            }
        }
    }, [])

    useEffect(() => {
        const handlePopState = () => {
            if (typeof window !== 'undefined') {
                if (!window.location.hash.startsWith('#tool-')) {
                    setIsOpen(false)
                    setTimeout(() => setActiveToolId(null), 280)
                } else {
                    const match = window.location.hash.match(/^#tool-(.+)$/)
                    if (match && match[1]) {
                        setActiveToolId(match[1])
                        setIsOpen(true)
                    }
                }
            }
        }
        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [])

    useEffect(() => {
        const handleCloseSheet = () => {
            closeTool()
        }
        window.addEventListener('convertify:close-tool-sheet', handleCloseSheet)
        return () => window.removeEventListener('convertify:close-tool-sheet', handleCloseSheet)
    }, [closeTool])

    return (
        <ToolSheetContext.Provider value={{ isOpen, activeToolId, openTool, closeTool }}>
            {children}
        </ToolSheetContext.Provider>
    )
}

export function useToolSheet() {
    return useContext(ToolSheetContext)
}

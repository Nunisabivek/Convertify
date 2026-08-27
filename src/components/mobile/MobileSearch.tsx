'use client'

import { useState } from 'react'
import { AppIcon } from '@/components/mobile/AppIcon'

interface MobileSearchProps {
    onSearch?: (query: string) => void
    placeholder?: string
}

export default function MobileSearch({
    onSearch,
    placeholder = 'Search tools...',
}: MobileSearchProps) {
    const [query, setQuery] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setQuery(value)
        onSearch?.(value)
    }

    return (
        <div className="mobile-search-bar">
            <AppIcon name="Search" className="mobile-search-icon" size={20} />
            <input
                type="search"
                className="mobile-search-input"
                placeholder={placeholder}
                value={query}
                onChange={handleChange}
                enterKeyHint="search"
                autoComplete="off"
                autoCorrect="off"
                aria-label="Search tools"
            />
        </div>
    )
}

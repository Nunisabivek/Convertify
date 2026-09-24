'use client'

import { useState } from 'react'
import { AppIcon } from '@/components/mobile/AppIcon'
import { XCircle } from 'lucide-react'

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

    const handleClear = () => {
        setQuery('')
        onSearch?.('')
    }

    return (
        <div className="mobile-search-bar">
            <AppIcon name="Search" className="mobile-search-icon" size={18} />
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
            {query.length > 0 && (
                <button
                    type="button"
                    onClick={handleClear}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer',
                        color: '#8e8e93',
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}
                    aria-label="Clear search"
                >
                    <XCircle size={18} fill="#8e8e93" color="#ffffff" />
                </button>
            )}
        </div>
    )
}

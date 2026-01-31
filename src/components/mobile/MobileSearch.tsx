'use client';

import { useState } from 'react';

interface MobileSearchProps {
    onSearch?: (query: string) => void;
    placeholder?: string;
}

export default function MobileSearch({
    onSearch,
    placeholder = 'Search tools...'
}: MobileSearchProps) {
    const [query, setQuery] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch?.(value);
    };

    return (
        <div className="mobile-search-bar">
            <span className="material-icons mobile-search-icon">search</span>
            <input
                type="text"
                className="mobile-search-input"
                placeholder={placeholder}
                value={query}
                onChange={handleChange}
                aria-label="Search"
            />
        </div>
    );
}

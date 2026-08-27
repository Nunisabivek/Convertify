'use client'

import { useState } from 'react'
import { tapHaptic } from '@/lib/haptics'

type Unit = 'KB' | 'MB'

export default function MobileSizeControl({
    valueKb,
    onChangeKb,
    fileBytes,
    minKb = 5,
}: {
    valueKb: number
    onChangeKb: (kb: number) => void
    fileBytes?: number
    minKb?: number
}) {
    const [unit, setUnit] = useState<Unit>('KB')
    const sliderMax = Math.min(5000, Math.max(400, Math.ceil((fileBytes ?? 200 * 1024) / 1024)))
    const display = unit === 'MB' ? roundNice(valueKb / 1024) : String(valueKb)

    const switchUnit = (next: Unit) => {
        void tapHaptic()
        setUnit(next)
        if (next === 'MB' && valueKb < 1024) onChangeKb(1024)
    }

    const onNumber = (raw: string) => {
        const n = parseFloat(raw)
        if (!Number.isFinite(n) || n <= 0) return
        const kb = unit === 'MB' ? Math.round(n * 1024) : Math.round(n)
        onChangeKb(Math.max(minKb, kb))
    }

    return (
        <div className="mobile-size-control">
            <div className="mobile-size-row">
                <label className="mobile-size-field">
                    Exact size
                    <input
                        type="number"
                        min={unit === 'MB' ? 0.1 : minKb}
                        step={unit === 'MB' ? 0.1 : 1}
                        value={display}
                        onChange={(e) => onNumber(e.target.value)}
                    />
                </label>
                <div className="mobile-unit-toggle" role="group" aria-label="KB or MB">
                    <button
                        type="button"
                        className={unit === 'KB' ? 'is-on' : ''}
                        onClick={() => switchUnit('KB')}
                    >
                        KB
                    </button>
                    <button
                        type="button"
                        className={unit === 'MB' ? 'is-on' : ''}
                        onClick={() => switchUnit('MB')}
                    >
                        MB
                    </button>
                </div>
            </div>
            <input
                type="range"
                className="mobile-size-slider"
                min={minKb}
                max={sliderMax}
                step={1}
                value={Math.min(sliderMax, Math.max(minKb, valueKb))}
                onChange={(e) => onChangeKb(parseInt(e.target.value, 10))}
            />
        </div>
    )
}

function roundNice(mb: number) {
    if (mb >= 10) return String(Math.round(mb))
    return (Math.round(mb * 10) / 10).toString()
}

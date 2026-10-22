"use client"

import { RENDER_QUALITIES, type RenderQuality } from "@/lib/render-quality"

export function RenderQualityPicker({ value, onChange, disabled }: { value: RenderQuality; onChange: (q: RenderQuality) => void; disabled?: boolean }) {
    return (
        <div className="w-full max-w-md" role="radiogroup" aria-label="Image quality">
            <p className="text-sm font-medium text-slate-700 mb-2 text-center">Image quality</p>
            <div className="grid grid-cols-3 gap-2">
                {RENDER_QUALITIES.map((q) => (
                    <button
                        key={q.id}
                        type="button"
                        role="radio"
                        aria-checked={q.id === value.id}
                        disabled={disabled}
                        onClick={() => onChange(q)}
                        className={`rounded-lg border px-2 py-2 text-sm transition-colors ${
                            q.id === value.id ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold" : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                    >
                        {q.label}
                        <span className="block text-xs font-normal text-slate-500">{q.dpi} DPI</span>
                    </button>
                ))}
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">{value.hint}</p>
        </div>
    )
}

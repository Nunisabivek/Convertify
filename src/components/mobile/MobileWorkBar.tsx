'use client'

export default function MobileWorkBar({
    note,
    sizeLabel,
    onCancel,
}: {
    note: string
    sizeLabel?: string
    onCancel: () => void
}) {
    return (
        <div className="mobile-work-bar" role="status" aria-live="polite">
            <div className="mobile-work-card">
                <div className="mobile-work-pulse" aria-hidden>
                    <span />
                    <span />
                    <span />
                </div>
                <p className="mobile-work-note">{note}</p>
                {sizeLabel ? <p className="mobile-work-size">{sizeLabel}</p> : null}
                <div className="mobile-work-track" aria-hidden>
                    <div className="mobile-work-track-bar" />
                </div>
                <button type="button" className="mobile-work-cancel" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

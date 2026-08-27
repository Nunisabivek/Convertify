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
        <div className="mobile-work-bar" role="status">
            <div className="mobile-work-card">
                <p className="mobile-work-note">{note}</p>
                {sizeLabel ? <p className="mobile-work-size">{sizeLabel}</p> : null}
                <button type="button" className="mobile-work-cancel" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

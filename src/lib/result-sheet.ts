/** Lets the hardware back button and tab bar close the Android result sheet. */

type CloseFn = () => void

let closeFn: CloseFn | null = null
let open = false

export function bindResultSheet(close: CloseFn): () => void {
    closeFn = close
    return () => {
        if (closeFn === close) closeFn = null
    }
}

export function setResultSheetOpen(value: boolean): void {
    open = value
}

export function isResultSheetOpen(): boolean {
    return open
}

/** @returns true if a sheet was open and is now closed */
export function closeResultSheet(): boolean {
    if (!open) return false
    closeFn?.()
    return true
}

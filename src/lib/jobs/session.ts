import { abortConvertWorker } from '@/lib/jobs/media'

/** One convert at a time. Animations freeze while work is running. */

type Listener = () => void

let converting = false
const listeners = new Set<Listener>()
let active: AbortController | null = null

export function isConverting() {
    return converting
}

export function subscribeConverting(listener: Listener) {
    listeners.add(listener)
    return () => {
        listeners.delete(listener)
    }
}

function setConverting(value: boolean) {
    converting = value
    if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('is-converting', value)
    }
    listeners.forEach((fn) => fn())
}

/** Abort any in-flight job and start a new one. */
export function takeJob(): AbortController {
    active?.abort()
    abortConvertWorker()
    active = new AbortController()
    setConverting(true)
    return active
}

export function releaseJob(controller: AbortController) {
    if (active === controller) {
        active = null
        setConverting(false)
    }
}

export function qualityNote(shrunk: boolean) {
    return shrunk ? 'Had to shrink a little' : 'Kept full size'
}

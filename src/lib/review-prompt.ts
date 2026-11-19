/**
 * When to ask for a Google Play review. Google decides whether its dialog
 * actually appears (a few times a year per person), so each ask is spent
 * carefully: only after someone has finished a few jobs, never right after a
 * full-screen ad, never mid-task (the result sheet has just been closed), and
 * at most every 30 days. Play policy forbids asking "Do you like the app?"
 * first or rewarding a review, so there is no pre-question.
 */

export interface ReviewState {
    /** Successful jobs finished (result sheet shown with an OK result). */
    wins: number
    lastAsk: number
    asks: number
}

export const REVIEW_MIN_WINS = 3
export const REVIEW_GAP_MS = 30 * 24 * 60 * 60 * 1000
export const REVIEW_MAX_ASKS = 4

const KEY = 'convertify-review'

export function shouldAskReview(s: ReviewState, now: number, adJustShown: boolean): boolean {
    if (adJustShown) return false
    if (s.wins < REVIEW_MIN_WINS) return false
    if (s.asks >= REVIEW_MAX_ASKS) return false
    if (s.lastAsk && now - s.lastAsk < REVIEW_GAP_MS) return false
    return true
}

export function readReviewState(): ReviewState {
    try {
        const raw = localStorage.getItem(KEY)
        const v = raw ? (JSON.parse(raw) as Partial<ReviewState>) : {}
        return { wins: Number(v.wins) || 0, lastAsk: Number(v.lastAsk) || 0, asks: Number(v.asks) || 0 }
    } catch {
        return { wins: 0, lastAsk: 0, asks: 0 }
    }
}

function writeReviewState(s: ReviewState) {
    try {
        localStorage.setItem(KEY, JSON.stringify(s))
    } catch {
        // private mode
    }
}

export function recordWin(): void {
    const s = readReviewState()
    writeReviewState({ ...s, wins: s.wins + 1 })
}

/** Call after the user closes a successful result. Silent on the website. */
export async function maybeAskForReview(adJustShown: boolean): Promise<void> {
    const s = readReviewState()
    const now = Date.now()
    if (!shouldAskReview(s, now, adJustShown)) return
    try {
        const { Capacitor } = await import('@capacitor/core')
        if (!Capacitor.isNativePlatform()) return
        const ConvertifyFiles = (await import('@/lib/convertify-files')).default
        writeReviewState({ ...s, lastAsk: now, asks: s.asks + 1 })
        await ConvertifyFiles.requestReview()
    } catch {
        // Play Store missing (sideloaded) or quota: nothing to show
    }
}

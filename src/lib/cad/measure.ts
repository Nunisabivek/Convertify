import { dist, type Pt } from './geometry.ts'

/**
 * Drawing-scale calibration and measuring. Points are in display space (PDF
 * points on the page as shown). A calibration maps paper points to real-world
 * millimetres; it's per sheet because sheets in one set are often at different scales.
 */
export type Unit = 'mm' | 'cm' | 'm' | 'in' | 'ft'

export const UNIT_MM: Record<Unit, number> = { mm: 1, cm: 10, m: 1000, in: 25.4, ft: 304.8 }
export const UNITS: Unit[] = ['mm', 'cm', 'm', 'in', 'ft']

export type Calibration = { mmPerPt: number; unit: Unit }

/** Paper millimetres per PDF point. */
export const PAPER_MM_PER_PT = 25.4 / 72

/** Calibrate from two picked points and the length they really span. */
export function calibrate(a: Pt, b: Pt, realLength: number, unit: Unit): Calibration | null {
    const d = dist(a, b)
    if (!(d > 0) || !(realLength > 0) || !Number.isFinite(realLength)) return null
    return { mmPerPt: (realLength * UNIT_MM[unit]) / d, unit }
}

/** Length between two points in the calibration's unit, or paper mm when uncalibrated. */
export function measure(a: Pt, b: Pt, cal: Calibration | null | undefined): { value: number; unit: Unit; paper: boolean } {
    const d = dist(a, b)
    if (!cal) return { value: d * PAPER_MM_PER_PT, unit: 'mm', paper: true }
    return { value: (d * cal.mmPerPt) / UNIT_MM[cal.unit], unit: cal.unit, paper: false }
}

/** "1:50" style ratio of a calibration (real mm per paper mm), when it is a round number. */
export function scaleRatio(cal: Calibration): string | null {
    const r = cal.mmPerPt / PAPER_MM_PER_PT
    if (!(r > 0)) return null
    if (r >= 1) {
        const n = Math.round(r)
        return Math.abs(r - n) / r < 0.02 ? `1:${n}` : null
    }
    const n = Math.round(1 / r)
    return Math.abs(1 / r - n) * r < 0.02 ? `${n}:1` : null
}

/** Human-readable length, e.g. "3,600 mm", "3.60 m", "12'-6 1/2\"". */
export function formatLength(value: number, unit: Unit): string {
    if (!Number.isFinite(value)) return '—'
    switch (unit) {
        case 'mm':
            return `${value >= 100 ? Math.round(value).toLocaleString('en-US') : value.toFixed(1)} mm`
        case 'cm':
            return `${value.toFixed(value >= 100 ? 0 : 1)} cm`
        case 'm':
            return `${value.toFixed(value >= 100 ? 1 : 2)} m`
        case 'in':
            return `${fracInches(value)}"`
        case 'ft': {
            const totalIn = value * 12
            let ft = Math.floor(totalIn / 12 + 1e-9)
            let inch = totalIn - ft * 12
            if (Math.round(inch * 8) / 8 >= 12) {
                ft += 1
                inch = 0
            }
            return `${ft}'-${fracInches(inch)}"`
        }
    }
}

function fracInches(v: number): string {
    const eighths = Math.round(v * 8)
    const whole = Math.floor(eighths / 8)
    let num = eighths % 8
    let den = 8
    while (num && num % 2 === 0) {
        num /= 2
        den /= 2
    }
    return num ? `${whole ? whole + ' ' : ''}${num}/${den}` : `${whole}`
}

/** Parses "3600", "3,600", "3.6" or "12.5" into a positive number. */
export function parseLength(s: string): number | null {
    const v = Number(s.replace(/,/g, '').trim())
    return Number.isFinite(v) && v > 0 ? v : null
}

/** Constrain b to horizontal/vertical from a (Shift while drawing). */
export function ortho(a: Pt, b: Pt): Pt {
    return Math.abs(b.x - a.x) >= Math.abs(b.y - a.y) ? { x: b.x, y: a.y } : { x: a.x, y: b.y }
}

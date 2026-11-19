/** Crop-editor geometry: the four corner handles plus a handle in the middle of each edge. */

import type { Corners, Pt } from './homography.ts'

export type Corner = 'tl' | 'tr' | 'br' | 'bl'
export type Edge = 'top' | 'right' | 'bottom' | 'left'

export const EDGE_ENDS: Record<Edge, [Corner, Corner]> = {
    top: ['tl', 'tr'],
    right: ['tr', 'br'],
    bottom: ['br', 'bl'],
    left: ['bl', 'tl'],
}

export const EDGES: Edge[] = ['top', 'right', 'bottom', 'left']

export function edgeMid(q: Corners, edge: Edge): Pt {
    const [a, b] = EDGE_ENDS[edge]
    return { x: (q[a].x + q[b].x) / 2, y: (q[a].y + q[b].y) / 2 }
}

/**
 * Dragging an edge's middle handle slides the whole edge in or out along its
 * normal, keeping its angle (only the part of the drag across the edge counts,
 * so a sloppy diagonal drag doesn't skew the page). Both ends stay inside the
 * photo. `start` is the quad when the drag began; dx/dy the drag so far.
 */
export function slideEdge(start: Corners, edge: Edge, dx: number, dy: number, w: number, h: number): Corners {
    const [a, b] = EDGE_ENDS[edge]
    const A = start[a]
    const B = start[b]
    const len = Math.hypot(B.x - A.x, B.y - A.y) || 1
    const nx = -(B.y - A.y) / len
    const ny = (B.x - A.x) / len
    const d = dx * nx + dy * ny
    const shift = (p: Pt): Pt => ({
        x: Math.min(w, Math.max(0, p.x + nx * d)),
        y: Math.min(h, Math.max(0, p.y + ny * d)),
    })
    return { ...start, [a]: shift(A), [b]: shift(B) }
}

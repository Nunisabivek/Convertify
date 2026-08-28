/** Pixel helpers shared by the convert worker and the main-thread fallback. */

export function colorDist(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) {
    return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2)
}

export type BackgroundStats = {
    ratio: number
    cornerSpread: number
    centerEaten: number
    busyBackdrop: boolean
    likelyBad: boolean
}

function cornerSpreadOf(data: Uint8ClampedArray, width: number, height: number): number {
    const n = width * height
    const corners = [0, width - 1, (height - 1) * width, n - 1]
    let maxd = 0
    for (let i = 0; i < 4; i++) {
        for (let j = i + 1; j < 4; j++) {
            const a = corners[i] * 4
            const b = corners[j] * 4
            maxd = Math.max(
                maxd,
                colorDist(data[a], data[a + 1], data[a + 2], data[b], data[b + 1], data[b + 2])
            )
        }
    }
    return maxd
}

function inFace(x: number, y: number, width: number, height: number): boolean {
    const nx = (x - width * 0.5) / (width * 0.28)
    const ny = (y - height * 0.42) / (height * 0.34)
    return nx * nx + ny * ny < 1
}

/**
 * Flood-fill from the edges: replace a plain backdrop (wall / studio) with fill.
 * Protects the upper-center (face) with a tighter threshold so hair/skin is less likely
 * to be eaten on a busy Unsplash-style backdrop.
 */
export function removeBackgroundPixels(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    fill: [number, number, number],
    threshold = 52
): BackgroundStats {
    const n = width * height
    const visited = new Uint8Array(n)
    const queue = new Int32Array(n)
    let qh = 0
    let qt = 0
    const [fr, fg, fb] = fill
    const spread = cornerSpreadOf(data, width, height)
    const edgeThreshold = spread > 70 ? Math.min(threshold, 36) : threshold
    const faceThreshold = Math.max(16, Math.round(edgeThreshold * 0.42))

    const corners = [0, width - 1, (height - 1) * width, n - 1]
    let sr = 0
    let sg = 0
    let sb = 0
    for (const c of corners) {
        sr += data[c * 4]
        sg += data[c * 4 + 1]
        sb += data[c * 4 + 2]
    }
    sr = (sr / 4) | 0
    sg = (sg / 4) | 0
    sb = (sb / 4) | 0

    const tryPush = (x: number, y: number) => {
        if (x < 0 || y < 0 || x >= width || y >= height) return
        const i = y * width + x
        if (visited[i]) return
        const p = i * 4
        const limit = inFace(x, y, width, height) ? faceThreshold : edgeThreshold
        if (colorDist(data[p], data[p + 1], data[p + 2], sr, sg, sb) > limit) return
        visited[i] = 1
        queue[qt++] = i
    }

    for (let x = 0; x < width; x++) {
        tryPush(x, 0)
        tryPush(x, height - 1)
    }
    for (let y = 0; y < height; y++) {
        tryPush(0, y)
        tryPush(width - 1, y)
    }

    let replaced = 0
    while (qh < qt) {
        const i = queue[qh++]
        const p = i * 4
        data[p] = fr
        data[p + 1] = fg
        data[p + 2] = fb
        data[p + 3] = 255
        replaced++
        const x = i % width
        const y = (i - x) / width
        tryPush(x + 1, y)
        tryPush(x - 1, y)
        tryPush(x, y + 1)
        tryPush(x, y - 1)
    }

    let faceTotal = 0
    let faceEaten = 0
    for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x += 2) {
            if (!inFace(x, y, width, height)) continue
            faceTotal++
            const p = (y * width + x) * 4
            if (data[p] === fr && data[p + 1] === fg && data[p + 2] === fb) faceEaten++
        }
    }

    const ratio = replaced / n
    const centerEaten = faceTotal ? faceEaten / faceTotal : 0
    const busyBackdrop = spread > 70
    const likelyBad = busyBackdrop || ratio < 0.1 || ratio > 0.7 || centerEaten > 0.12
    return { ratio, cornerSpread: spread, centerEaten, busyBackdrop, likelyBad }
}

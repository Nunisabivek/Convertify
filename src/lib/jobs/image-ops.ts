/** Pixel helpers shared by the convert worker and the main-thread fallback. */

export function colorDist(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) {
    return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2)
}

/**
 * Flood-fill from the edges: replace a plain backdrop (wall / studio) with fill.
 * Returns the fraction of pixels replaced.
 */
export function removeBackgroundPixels(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    fill: [number, number, number],
    threshold = 74
): number {
    const n = width * height
    const visited = new Uint8Array(n)
    const queue = new Int32Array(n)
    let qh = 0
    let qt = 0
    const [fr, fg, fb] = fill

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
        if (colorDist(data[p], data[p + 1], data[p + 2], sr, sg, sb) > threshold) return
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

    return replaced / n
}

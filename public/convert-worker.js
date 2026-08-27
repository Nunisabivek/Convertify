/**
 * Convert worker — no pdf.js, no React. Loaded only when a photo tool starts.
 */

function colorDist(r1, g1, b1, r2, g2, b2) {
    return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2)
}

function removeBackgroundPixels(data, width, height, fill, threshold) {
    const n = width * height
    const visited = new Uint8Array(n)
    const queue = new Int32Array(n)
    let qh = 0
    let qt = 0
    const fr = fill[0]
    const fg = fill[1]
    const fb = fill[2]
    const corners = [0, width - 1, (height - 1) * width, n - 1]
    let sr = 0
    let sg = 0
    let sb = 0
    for (let k = 0; k < 4; k++) {
        const c = corners[k]
        sr += data[c * 4]
        sg += data[c * 4 + 1]
        sb += data[c * 4 + 2]
    }
    sr = (sr / 4) | 0
    sg = (sg / 4) | 0
    sb = (sb / 4) | 0

    function tryPush(x, y) {
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

async function encodeJpeg(bitmap, width, height, quality) {
    const canvas = new OffscreenCanvas(width, height)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(bitmap, 0, 0, width, height)
    return canvas.convertToBlob({ type: 'image/jpeg', quality })
}

async function fitImage(bitmap, minBytes, maxBytes, onProgress) {
    let width = bitmap.width
    let height = bitmap.height
    const maxEdge = 2048
    const scale0 = Math.min(1, maxEdge / Math.max(width, height))
    width = Math.max(1, Math.round(width * scale0))
    height = Math.max(1, Math.round(height * scale0))

    const tryEncode = async (w, h, q) => {
        const blob = await encodeJpeg(bitmap, w, h, q)
        onProgress(blob.size)
        return blob
    }

    let w = width
    let h = height
    let q = 0.85
    let best = await tryEncode(w, h, q)

    let guard = 0
    while (guard++ < 14) {
        if (best.size >= minBytes && best.size <= maxBytes) return { blob: best, size: best.size }
        if (best.size > maxBytes) {
            if (q > 0.28) {
                q = Math.max(0.22, q - 0.12)
            } else {
                w = Math.max(320, Math.round(w * 0.82))
                h = Math.max(320, Math.round(h * 0.82))
                q = 0.55
            }
            best = await tryEncode(w, h, q)
            continue
        }
        // too small — raise quality, then upscale a little
        if (q < 0.95) {
            q = Math.min(0.95, q + 0.1)
            best = await tryEncode(w, h, q)
            continue
        }
        const nextW = Math.round(w * 1.15)
        const nextH = Math.round(h * 1.15)
        if (nextW * nextH > 8_000_000) break
        w = nextW
        h = nextH
        q = 0.92
        best = await tryEncode(w, h, q)
    }

    return { blob: best, size: best.size }
}

self.onmessage = async (event) => {
    const { id, type } = event.data
    try {
        if (type === 'remove-bg') {
            const { width, height, buffer, fill } = event.data
            const data = new Uint8ClampedArray(buffer)
            const ratio = removeBackgroundPixels(data, width, height, fill, 74)
            self.postMessage({ id, ok: true, ratio, buffer: data.buffer }, [data.buffer])
            return
        }
        if (type === 'fit-image') {
            const { bitmap, minBytes, maxBytes } = event.data
            try {
                const result = await fitImage(bitmap, minBytes, maxBytes, (size) => {
                    self.postMessage({ id, ok: true, progress: true, size })
                })
                self.postMessage({ id, ok: true, blob: result.blob, size: result.size })
            } finally {
                try {
                    bitmap.close()
                } catch {
                    // already closed
                }
            }
            return
        }
        throw new Error('Unknown job')
    } catch (err) {
        self.postMessage({
            id,
            ok: false,
            error: err && err.message ? err.message : 'Could not finish that file.',
        })
    }
}

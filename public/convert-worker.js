/**
 * Convert worker — no pdf.js, no React. Decode and encode happen here,
 * never on the UI thread. Quality first; downscale only if still too big.
 */

const TOO_BIG = 'This file is too big for this phone. Try a smaller one.'
const MAX_EDGE = 2048
const MAX_PIXELS = 8_000_000
const MAX_LOOPS = 14

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

async function decodeBitmap(buffer) {
    let bitmap
    try {
        bitmap = await createImageBitmap(new Blob([buffer]))
    } catch {
        throw new Error(TOO_BIG)
    }
    const origW = bitmap.width
    const origH = bitmap.height
    const edge = Math.max(origW, origH)
    const pixels = origW * origH
    let capped = false
    if (edge > MAX_EDGE || pixels > MAX_PIXELS) {
        const scale = Math.min(MAX_EDGE / edge, Math.sqrt(MAX_PIXELS / pixels))
        const w = Math.max(1, Math.round(origW * scale))
        const h = Math.max(1, Math.round(origH * scale))
        const smaller = await createImageBitmap(bitmap, { resizeWidth: w, resizeHeight: h })
        bitmap.close()
        bitmap = smaller
        capped = true
    }
    return { bitmap, origW, origH, capped }
}

async function encodeJpegFrom(source, width, height, quality, fill) {
    const canvas = new OffscreenCanvas(width, height)
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error(TOO_BIG)
    ctx.fillStyle = fill || '#FFFFFF'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(source, 0, 0, width, height)
    return canvas.convertToBlob({ type: 'image/jpeg', quality })
}

/**
 * Lower JPEG quality first. Downscale only after quality is already low.
 * If the file is too small, raise quality (and optionally upscale).
 */
async function qualityFirstLoop(source, startW, startH, minBytes, maxBytes, allowUpscale, lockSize, fill, onProgress) {
    let w = startW
    let h = startH
    let q = 0.88
    let shrunk = false
    let best = await encodeJpegFrom(source, w, h, q, fill)
    onProgress(best.size)

    let guard = 0
    while (guard++ < MAX_LOOPS) {
        if (best.size >= minBytes && best.size <= maxBytes) {
            return { blob: best, size: best.size, shrunk, width: w, height: h }
        }
        if (best.size > maxBytes) {
            if (q > 0.22) {
                q = Math.max(0.12, q - 0.12)
            } else if (!lockSize) {
                const nextW = Math.max(48, Math.round(w * 0.84))
                const nextH = Math.max(48, Math.round(h * 0.84))
                if (nextW === w && nextH === h) break
                w = nextW
                h = nextH
                shrunk = true
                q = 0.55
            } else {
                break
            }
            best = await encodeJpegFrom(source, w, h, q, fill)
            onProgress(best.size)
            continue
        }
        if (q < 0.95) {
            q = Math.min(0.95, q + 0.1)
            best = await encodeJpegFrom(source, w, h, q, fill)
            onProgress(best.size)
            continue
        }
        if (!allowUpscale) break
        const nextW = Math.round(w * 1.12)
        const nextH = Math.round(h * 1.12)
        if (nextW * nextH > MAX_PIXELS) break
        w = nextW
        h = nextH
        q = 0.92
        best = await encodeJpegFrom(source, w, h, q, fill)
        onProgress(best.size)
    }
    return { blob: best, size: best.size, shrunk, width: w, height: h }
}

self.onmessage = async (event) => {
    const { id, type } = event.data
    try {
        if (type === 'remove-bg') {
            const { buffer, fill } = event.data
            const { bitmap } = await decodeBitmap(buffer)
            try {
                const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
                const ctx = canvas.getContext('2d')
                if (!ctx) throw new Error(TOO_BIG)
                ctx.drawImage(bitmap, 0, 0)
                const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height)
                const ratio = removeBackgroundPixels(imageData.data, bitmap.width, bitmap.height, fill, 74)
                if (ratio < 0.04) {
                    throw new Error('Could not pick out the background. Try a photo with a plain wall behind you.')
                }
                if (ratio > 0.88) {
                    throw new Error('Too much of the photo looked like background. Try a clearer selfie.')
                }
                ctx.putImageData(imageData, 0, 0)
                const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.88 })
                self.postMessage({ id, ok: true, blob, ratio, size: blob.size })
            } finally {
                bitmap.close()
            }
            return
        }

        if (type === 'fit-image' || type === 'compress-image') {
            const { buffer, minBytes, maxBytes, allowUpscale } = event.data
            const { bitmap, capped } = await decodeBitmap(buffer)
            try {
                const result = await qualityFirstLoop(
                    bitmap,
                    bitmap.width,
                    bitmap.height,
                    minBytes,
                    maxBytes,
                    Boolean(allowUpscale),
                    false,
                    '#FFFFFF',
                    (size) => self.postMessage({ id, ok: true, progress: true, size })
                )
                self.postMessage({
                    id,
                    ok: true,
                    blob: result.blob,
                    size: result.size,
                    shrunk: result.shrunk || capped,
                })
            } finally {
                bitmap.close()
            }
            return
        }

        if (type === 'make-photo') {
            const { buffer, minBytes, maxBytes, outW, outH, fill, crop } = event.data
            const { bitmap } = await decodeBitmap(buffer)
            try {
                const canvas = new OffscreenCanvas(outW, outH)
                const ctx = canvas.getContext('2d')
                if (!ctx) throw new Error(TOO_BIG)
                ctx.fillStyle = fill || '#FFFFFF'
                ctx.fillRect(0, 0, outW, outH)
                const sx = Math.max(0, Math.min(bitmap.width - 1, crop.x * bitmap.width))
                const sy = Math.max(0, Math.min(bitmap.height - 1, crop.y * bitmap.height))
                const sw = Math.max(1, Math.min(bitmap.width - sx, crop.w * bitmap.width))
                const sh = Math.max(1, Math.min(bitmap.height - sy, crop.h * bitmap.height))
                ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, outW, outH)
                const result = await qualityFirstLoop(
                    canvas,
                    outW,
                    outH,
                    minBytes,
                    maxBytes,
                    true,
                    true,
                    fill || '#FFFFFF',
                    (size) => self.postMessage({ id, ok: true, progress: true, size })
                )
                self.postMessage({
                    id,
                    ok: true,
                    blob: result.blob,
                    size: result.size,
                    shrunk: result.shrunk,
                })
            } finally {
                bitmap.close()
            }
            return
        }

        throw new Error('Unknown job')
    } catch (err) {
        self.postMessage({
            id,
            ok: false,
            error: err && err.message ? err.message : TOO_BIG,
        })
    }
}

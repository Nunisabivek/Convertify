/**
 * EXIF orientation (1-8) of a JPEG, 1 when absent. Phones store photos sideways
 * and set this tag; browsers honour it on screen, but pdf-lib embeds raw pixels.
 */
export function jpegOrientation(buf: ArrayBuffer): number {
    const v = new DataView(buf)
    if (v.byteLength < 4 || v.getUint16(0) !== 0xffd8) return 1
    let p = 2
    while (p + 4 <= v.byteLength) {
        const marker = v.getUint16(p)
        const len = v.getUint16(p + 2)
        if (marker === 0xffda || (marker & 0xff00) !== 0xff00) break // start of scan: no EXIF before it
        // APP1 "Exif\0\0" then a TIFF header
        if (marker === 0xffe1 && v.getUint32(p + 4) === 0x45786966 && v.getUint16(p + 8) === 0) {
            const tiff = p + 10
            const le = v.getUint16(tiff) === 0x4949
            const u16 = (o: number) => v.getUint16(o, le)
            const ifd = tiff + v.getUint32(tiff + 4, le)
            if (ifd + 2 > v.byteLength) return 1
            for (let i = 0, n = u16(ifd); i < n; i++) {
                const e = ifd + 2 + i * 12
                if (e + 10 > v.byteLength) return 1
                if (u16(e) === 0x0112) {
                    const o = u16(e + 8)
                    return o >= 1 && o <= 8 ? o : 1
                }
            }
            return 1
        }
        p += 2 + len
    }
    return 1
}

/**
 * Where to draw a w×h image on its page so it shows upright, using pdf-lib's
 * drawImage rotation (counter-clockwise around x,y). Mirrored orientations
 * (2, 4, 5, 7) are drawn unmirrored; they are rare from cameras.
 */
export function uprightPlacement(o: number, w: number, h: number) {
    if (o === 3 || o === 4) return { page: [w, h] as const, x: w, y: h, rotate: 180 }
    if (o === 6 || o === 5) return { page: [h, w] as const, x: 0, y: w, rotate: -90 }
    if (o === 8 || o === 7) return { page: [h, w] as const, x: h, y: 0, rotate: 90 }
    return { page: [w, h] as const, x: 0, y: 0, rotate: 0 }
}

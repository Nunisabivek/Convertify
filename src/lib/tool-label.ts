const ACRONYMS = new Set(["pdf", "png", "jpg", "jpeg", "html", "heic", "svg", "bmp", "gif", "csv", "json", "xml", "qr", "ocr", "tiff", "webp"])

/** "/png-to-pdf" or "png-to-pdf" -> "PNG to PDF" (not "Png To Pdf": format names are acronyms). */
export function toolLabel(slug: string): string {
    return slug.replace(/^\//, "").split("-").map((w) =>
        ACRONYMS.has(w) ? w.toUpperCase() : w === "to" ? w : w.charAt(0).toUpperCase() + w.slice(1)
    ).join(" ")
}

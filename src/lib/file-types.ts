/** Android often reports PDFs/photos as octet-stream or an empty MIME type. */

function ext(file: File): string {
    const name = file.name || ''
    const dot = name.lastIndexOf('.')
    return dot >= 0 ? name.slice(dot + 1).toLowerCase() : ''
}

export function isPdfFile(file: File): boolean {
    return file.type === 'application/pdf' || ext(file) === 'pdf'
}

export function isJpegFile(file: File): boolean {
    return (
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        ext(file) === 'jpg' ||
        ext(file) === 'jpeg'
    )
}

export function isPngFile(file: File): boolean {
    return file.type === 'image/png' || ext(file) === 'png'
}

export function isHeicFile(file: File): boolean {
    const e = ext(file)
    return (
        file.type === 'image/heic' ||
        file.type === 'image/heif' ||
        e === 'heic' ||
        e === 'heif'
    )
}

export function isWordFile(file: File): boolean {
    const e = ext(file)
    return (
        e === 'doc' ||
        e === 'docx' ||
        file.type.includes('wordprocessingml') ||
        file.type === 'application/msword'
    )
}

export function isExcelFile(file: File): boolean {
    const e = ext(file)
    return (
        e === 'xls' ||
        e === 'xlsx' ||
        e === 'csv' ||
        file.type.includes('spreadsheet') ||
        file.type === 'application/vnd.ms-excel'
    )
}

export function friendlyFileError(err: unknown, fallback: string): string {
    const message = err instanceof Error ? err.message : String(err ?? '')
    const lower = message.toLowerCase()

    if (lower.includes('password') || lower.includes('encrypted')) {
        return 'This PDF is locked with a password. Unlock it first, then try again.'
    }
    if (lower.includes('corrupt') || lower.includes('invalid pdf') || lower.includes('bad xref')) {
        return 'Could not open that PDF. Try another file.'
    }
    if (lower.includes('heic') || lower.includes('heif')) {
        return 'Could not convert that iPhone photo. Try another picture.'
    }
    if (lower.includes('image') || lower.includes('decode')) {
        return 'Could not open that picture. Try another file.'
    }
    if (lower.includes('network') || lower.includes('fetch') || lower.includes('failed to load')) {
        return 'Something went wrong. Check the file and try again.'
    }
    return fallback
}

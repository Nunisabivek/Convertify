import ConvertifyFiles, { type PickedNativeFile } from '@/lib/convertify-files'

const RECENT_KEY = 'convertify-recent-files'
const MAX_RECENTS = 12
const OUTPUT_DIR = 'outputs'

export interface RecentFile {
    id: string
    name: string
    timestamp: number
    size: number
    type: string
    appPath: string
    sourceUri?: string
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatRecentTime(timestamp: number): string {
    const delta = Date.now() - timestamp
    const minutes = Math.round(delta / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} min ago`
    const hours = Math.round(minutes / 60)
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
    const days = Math.round(hours / 24)
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
}

export function loadRecentFiles(): RecentFile[] {
    if (typeof window === 'undefined') return []
    try {
        const raw = localStorage.getItem(RECENT_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) return []
        return parsed.filter((item: RecentFile) => item?.name && item?.appPath)
    } catch {
        return []
    }
}

export function saveRecentFiles(files: RecentFile[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(RECENT_KEY, JSON.stringify(files.slice(0, MAX_RECENTS)))
    window.dispatchEvent(new Event('convertify-recents-changed'))
}

export function recordRecentFile(entry: Omit<RecentFile, 'id' | 'timestamp'> & { timestamp?: number }): void {
    const next: RecentFile = {
        id: `${Date.now()}-${entry.name}`,
        timestamp: entry.timestamp ?? Date.now(),
        ...entry,
    }
    const existing = loadRecentFiles().filter((f) => f.appPath !== next.appPath)
    saveRecentFiles([next, ...existing])
}

export function dropRecentFile(id: string): void {
    saveRecentFiles(loadRecentFiles().filter((f) => f.id !== id))
}

export function clearRecentFiles(): void {
    saveRecentFiles([])
}

export async function isNativeAndroid(): Promise<boolean> {
    try {
        const { Capacitor } = await import('@capacitor/core')
        return Capacitor.isNativePlatform()
    } catch {
        return false
    }
}

export function mimeFromName(filename: string): string {
    const lower = filename.toLowerCase()
    if (lower.endsWith('.pdf')) return 'application/pdf'
    if (lower.endsWith('.png')) return 'image/png'
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
    if (lower.endsWith('.webp')) return 'image/webp'
    if (lower.endsWith('.zip')) return 'application/zip'
    if (lower.endsWith('.docx')) {
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }
    return 'application/octet-stream'
}

function safeFileName(name: string): string {
    return name.replace(/[/\\?%*:|"<>]/g, '-').slice(0, 120) || 'converted-file'
}

async function blobToBase64(blob: Blob): Promise<string> {
    const buffer = await blob.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    const chunk = 0x8000
    let binary = ''
    for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
    }
    return btoa(binary)
}

function base64ToFile(base64: string, name: string, mime: string): File {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return new File([bytes], name, { type: mime })
}

async function nativePickedToFile(picked: PickedNativeFile): Promise<File> {
    const { Filesystem, Directory } = await import('@capacitor/filesystem')
    const { data } = await Filesystem.readFile({
        path: picked.appPath,
        directory: Directory.Data,
    })
    const base64 = typeof data === 'string' ? data : ''
    return base64ToFile(base64, picked.name, picked.mime || mimeFromName(picked.name))
}

/** System picker (SAF). Copies into app storage before JS sees the file. */
export async function pickFilesNative(options: {
    multiple?: boolean
    mimeTypes?: string[]
}): Promise<File[]> {
    const result = await ConvertifyFiles.pickFiles({
        multiple: options.multiple ?? false,
        mimeTypes: options.mimeTypes?.length ? options.mimeTypes : ['*/*'],
    })
    const files: File[] = []
    for (const picked of result.files) {
        files.push(await nativePickedToFile(picked))
    }
    return files
}

/** WebView / website fallback: copy the picked File into app storage. */
export async function persistPickedFiles(files: File[]): Promise<File[]> {
    if (!(await isNativeAndroid())) return files
    const { Filesystem, Directory } = await import('@capacitor/filesystem')
    await Filesystem.mkdir({
        path: 'inbox',
        directory: Directory.Data,
        recursive: true,
    }).catch(() => undefined)

    for (const file of files) {
        const path = `inbox/${Date.now()}-${safeFileName(file.name)}`
        await Filesystem.writeFile({
            path,
            data: await blobToBase64(file),
            directory: Directory.Data,
        })
    }
    return files
}

export interface StoredOutput {
    appPath: string
    filename: string
    mime: string
    size: number
    uri: string
}

/** Write the converted file into app-owned storage (not Downloads yet). */
export async function storeOutput(blob: Blob, filename: string): Promise<StoredOutput> {
    const name = safeFileName(filename)
    const mime = blob.type || mimeFromName(name)

    if (!(await isNativeAndroid())) {
        return { appPath: '', filename: name, mime, size: blob.size, uri: URL.createObjectURL(blob) }
    }

    const { Filesystem, Directory } = await import('@capacitor/filesystem')
    await Filesystem.mkdir({
        path: OUTPUT_DIR,
        directory: Directory.Data,
        recursive: true,
    }).catch(() => undefined)

    const appPath = `${OUTPUT_DIR}/${Date.now()}-${name}`
    await Filesystem.writeFile({
        path: appPath,
        data: await blobToBase64(blob),
        directory: Directory.Data,
    })

    const { uri } = await Filesystem.getUri({
        path: appPath,
        directory: Directory.Data,
    })

    recordRecentFile({
        name,
        size: blob.size,
        type: mime,
        appPath,
    })

    try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
        await Haptics.impact({ style: ImpactStyle.Medium })
    } catch {
        // optional
    }

    return { appPath, filename: name, mime, size: blob.size, uri }
}

export async function shareStoredOutput(output: StoredOutput): Promise<void> {
    if (!(await isNativeAndroid())) {
        const a = document.createElement('a')
        a.href = output.uri
        a.download = output.filename
        a.click()
        return
    }
    const { Share } = await import('@capacitor/share')
    await Share.share({
        title: output.filename,
        url: output.uri,
        dialogTitle: 'Share',
    })
}

export async function saveStoredOutputToDownloads(output: StoredOutput): Promise<void> {
    if (!(await isNativeAndroid()) || !output.appPath) {
        await shareStoredOutput(output)
        return
    }
    await ConvertifyFiles.saveToDownloads({
        appPath: output.appPath,
        filename: output.filename,
        mime: output.mime,
    })
}

export async function shareRecentFile(file: RecentFile): Promise<void> {
    const exists = await ConvertifyFiles.fileExists({ appPath: file.appPath })
    if (!exists.exists) {
        dropRecentFile(file.id)
        throw new Error('gone')
    }
    const { Filesystem, Directory } = await import('@capacitor/filesystem')
    const { uri } = await Filesystem.getUri({
        path: file.appPath,
        directory: Directory.Data,
    })
    await shareStoredOutput({
        appPath: file.appPath,
        filename: file.name,
        mime: file.type || mimeFromName(file.name),
        size: file.size,
        uri,
    })
}

/** Website / interceptor helper: store then share. */
export async function saveOrShareFile(blob: Blob, filename: string): Promise<StoredOutput> {
    const stored = await storeOutput(blob, filename)
    await shareStoredOutput(stored)
    return stored
}

export { safeFileName }

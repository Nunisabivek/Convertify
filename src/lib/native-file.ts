import type { PickedNativeFile } from '@/lib/convertify-files'
// The plugin pulls in @capacitor/core; load it only on the code paths that run inside the app.
// Wrapped in an object ON PURPOSE: a promise resolved WITH the Capacitor plugin proxy calls
// proxy.then(), which Capacitor forwards to native ("then() is not implemented") and the await
// hangs forever (file picking, share and save all froze). Never return the plugin from a promise.
const nativeFiles = async () => ({ files: (await import('@/lib/convertify-files')).default })
import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'
import { nextHumanFilename } from '@/lib/human-filename'
import { addLibraryFile, loadLibrary, patchLibraryFile, removeLibraryFile, type LibFile } from '@/lib/library'

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

/** Newest files in the library, for Home's "Recent files". */
export function loadRecentFiles(limit = 5): RecentFile[] {
    return loadLibrary()
        .files.slice()
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit)
        .map((f) => ({ id: f.id, name: f.name, timestamp: f.createdAt, size: f.size, type: f.type, appPath: f.appPath }))
}

export function dropRecentFile(id: string): void {
    removeLibraryFile(id)
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
    return nextHumanFilename(name)
}

/** Characters Android file systems refuse, trimmed to a sane length. */
function safeDiskName(name: string): string {
    const clean = name.replace(/[\\/:*?"<>|\x00-\x1f]/g, '-').trim() || 'file'
    return clean.length > 120 ? clean.slice(0, 120) : clean
}

function uniqueVisibleName(filename: string): string {
    return nextHumanFilename(filename, loadLibrary().files.map((file) => file.name))
}

function blobToBase64(blob: Blob): Promise<string> {
    // FileReader encodes in native code: several times faster than a JS loop
    // on low-end phones, and it never holds three copies of a big file.
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const url = String(reader.result)
            resolve(url.slice(url.indexOf(',') + 1))
        }
        reader.onerror = () => reject(reader.error ?? new Error('read failed'))
        reader.readAsDataURL(blob)
    })
}

function base64ToFile(base64: string, name: string, mime: string): File {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return new File([bytes], name, { type: mime })
}

async function nativePickedToFile(picked: PickedNativeFile): Promise<File> {
    const { Filesystem, Directory } = await import('@capacitor/filesystem')
    const type = picked.mime || mimeFromName(picked.name)
    let file: File
    try {
        // Binary read through the WebView's local file server: no base64 over the
        // bridge (a 20 MB PDF was a 27 MB string plus a JS decode loop).
        const { Capacitor } = await import('@capacitor/core')
        const { uri } = await Filesystem.getUri({ path: picked.appPath, directory: Directory.Data })
        const res = await fetch(Capacitor.convertFileSrc(uri))
        if (!res.ok) throw new Error(String(res.status))
        file = new File([await res.blob()], picked.name, { type })
    } catch {
        const { data } = await Filesystem.readFile({ path: picked.appPath, directory: Directory.Data })
        file = base64ToFile(typeof data === 'string' ? data : '', picked.name, type)
    }
    // The bytes are in memory now; the inbox copy would only fill the phone.
    void Filesystem.deleteFile({ path: picked.appPath, directory: Directory.Data }).catch(() => undefined)
    return file
}

/** System picker (SAF). Copies into app storage before JS sees the file. */
export async function pickFilesNative(options: {
    multiple?: boolean
    mimeTypes?: string[]
}): Promise<File[]> {
    const result = await (await nativeFiles()).files.pickFiles({
        multiple: options.multiple ?? false,
        mimeTypes: options.mimeTypes?.length ? options.mimeTypes : ['*/*'],
    })
    const files: File[] = []
    for (const picked of result.files) {
        files.push(await nativePickedToFile(picked))
    }
    return files
}

/** Leftover picker copies from older versions or interrupted picks: delete anything over an hour old. */
export async function pruneInbox(): Promise<void> {
    if (!(await isNativeAndroid())) return
    try {
        const { Filesystem, Directory } = await import('@capacitor/filesystem')
        const { files } = await Filesystem.readdir({ path: 'inbox', directory: Directory.Data })
        const cutoff = Date.now() - 60 * 60 * 1000
        for (const f of files) {
            const name = typeof f === 'string' ? f : f.name
            const mtime = typeof f === 'string' ? 0 : Number(f.mtime ?? 0)
            const stamp = Number(name.split('-')[0]) || mtime
            if (stamp && stamp < cutoff) {
                await Filesystem.deleteFile({ path: `inbox/${name}`, directory: Directory.Data }).catch(() => undefined)
            }
        }
    } catch {
        // no inbox yet
    }
}

/**
 * Versions before 1.3 listed only the last 12 outputs but kept every file.
 * Once, bring every untracked file in outputs/ into the library so people
 * can see (and delete) them.
 */
export async function adoptOrphanOutputs(): Promise<void> {
    const FLAG = 'convertify-library-adopted'
    try {
        if (localStorage.getItem(FLAG)) return
    } catch {
        return
    }
    if (!(await isNativeAndroid())) return
    try {
        const { Filesystem, Directory } = await import('@capacitor/filesystem')
        const known = new Set(loadLibrary().files.map((f) => f.appPath))
        const found: { appPath: string; name: string; size: number; mtime: number }[] = []
        const { files } = await Filesystem.readdir({ path: OUTPUT_DIR, directory: Directory.Data })
        for (const entry of files) {
            if (entry.type === 'directory') {
                const inner = await Filesystem.readdir({ path: `${OUTPUT_DIR}/${entry.name}`, directory: Directory.Data }).catch(() => ({ files: [] }))
                for (const f of inner.files) {
                    if (f.type === 'file') found.push({ appPath: `${OUTPUT_DIR}/${entry.name}/${f.name}`, name: f.name, size: f.size, mtime: Number(f.mtime) })
                }
            } else {
                // Old layout: outputs/<timestamp>-<name>
                const m = /^(\d{10,})-(.+)$/.exec(entry.name)
                found.push({ appPath: `${OUTPUT_DIR}/${entry.name}`, name: m ? m[2] : entry.name, size: entry.size, mtime: m ? Number(m[1]) : Number(entry.mtime) })
            }
        }
        for (const f of found.sort((a, b) => a.mtime - b.mtime)) {
            if (known.has(f.appPath)) continue
            const added = addLibraryFile({ name: f.name, appPath: f.appPath, size: f.size, type: mimeFromName(f.name) })
            if (f.mtime > 0) patchLibraryFile(added.id, { createdAt: f.mtime })
        }
        localStorage.setItem(FLAG, '1')
    } catch {
        // no outputs folder yet: nothing to adopt
        try {
            localStorage.setItem(FLAG, '1')
        } catch {
            // ignore
        }
    }
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
    const name = uniqueVisibleName(filename)
    const mime = blob.type || mimeFromName(name)

    if (!(await isNativeAndroid())) {
        return { appPath: '', filename: name, mime, size: blob.size, uri: URL.createObjectURL(blob) }
    }

    const { Filesystem, Directory } = await import('@capacitor/filesystem')
    // One folder per file, so the file keeps its clean name: that's the name
    // people see when they share it or save it to the phone.
    const appPath = `${OUTPUT_DIR}/${Date.now().toString(36)}/${safeDiskName(name)}`
    await Filesystem.writeFile({
        path: appPath,
        data: await blobToBase64(blob),
        directory: Directory.Data,
        recursive: true,
    })

    const { uri } = await Filesystem.getUri({
        path: appPath,
        directory: Directory.Data,
    })

    addLibraryFile({ name, size: blob.size, type: mime, appPath })

    // The result sheet plays the success or warning haptic when it opens.
    return { appPath, filename: name, mime, size: blob.size, uri }
}

export async function shareStoredOutput(output: StoredOutput): Promise<void> {
    if (!(await isNativeAndroid()) || !output.appPath) {
        const a = document.createElement('a')
        a.href = output.uri
        a.download = output.filename
        a.click()
        return
    }
    await (await nativeFiles()).files.shareFile({
        appPath: output.appPath,
        mime: output.mime,
    })
}

/** Copies into Downloads/Convertify (or Downloads/Convertify/<folder>) on the phone. */
export async function saveStoredOutputToDownloads(output: StoredOutput, folder?: string): Promise<void> {
    if (!(await isNativeAndroid()) || !output.appPath) {
        await shareStoredOutput(output)
        return
    }
    await (await nativeFiles()).files.saveToDownloads({
        appPath: output.appPath,
        filename: output.filename,
        mime: output.mime,
        folder,
    })
}

async function ensureOnDisk(file: { id: string; appPath: string }): Promise<void> {
    const exists = await (await nativeFiles()).files.fileExists({ appPath: file.appPath })
    if (!exists.exists) {
        removeLibraryFile(file.id)
        throw new Error('This file is no longer on this phone.')
    }
}

export async function shareRecentFile(file: RecentFile | LibFile): Promise<void> {
    await ensureOnDisk(file)
    await (await nativeFiles()).files.shareFile({ appPath: file.appPath, mime: file.type || mimeFromName(file.name) })
}

export async function openLibraryFile(file: LibFile): Promise<void> {
    await ensureOnDisk(file)
    await (await nativeFiles()).files.openFile({ appPath: file.appPath, mime: file.type || mimeFromName(file.name) })
}

export async function saveLibraryFileToPhone(file: LibFile, folder?: string): Promise<void> {
    await ensureOnDisk(file)
    await (await nativeFiles()).files.saveToDownloads({
        appPath: file.appPath,
        filename: file.name,
        mime: file.type || mimeFromName(file.name),
        folder,
    })
}

/** Renames on disk too, so shared copies carry the new name. Returns the new path. */
export async function renameLibraryFileOnDisk(file: LibFile, newName: string): Promise<string> {
    if (!(await isNativeAndroid())) return file.appPath
    const { Filesystem, Directory } = await import('@capacitor/filesystem')
    const to = `${OUTPUT_DIR}/${Date.now().toString(36)}/${safeDiskName(newName)}`
    await Filesystem.mkdir({ path: to.slice(0, to.lastIndexOf('/')), directory: Directory.Data, recursive: true }).catch(() => undefined)
    await Filesystem.rename({ from: file.appPath, to, directory: Directory.Data, toDirectory: Directory.Data })
    return to
}

/** Frees the space; the library entry is removed by the caller. */
export async function deleteLibraryFileOnDisk(file: LibFile): Promise<void> {
    if (!(await isNativeAndroid())) return
    const { Filesystem, Directory } = await import('@capacitor/filesystem')
    await Filesystem.deleteFile({ path: file.appPath, directory: Directory.Data }).catch(() => undefined)
    const dir = file.appPath.slice(0, file.appPath.lastIndexOf('/'))
    if (dir.startsWith(`${OUTPUT_DIR}/`) && dir !== OUTPUT_DIR) {
        await Filesystem.rmdir({ path: dir, directory: Directory.Data, recursive: true }).catch(() => undefined)
    }
}

/** URL the WebView can show directly (thumbnails), without reading the file into JS. */
export async function libraryFileUrl(file: LibFile): Promise<string | null> {
    if (!(await isNativeAndroid())) return null
    try {
        const { Filesystem, Directory } = await import('@capacitor/filesystem')
        const { Capacitor } = await import('@capacitor/core')
        const { uri } = await Filesystem.getUri({ path: file.appPath, directory: Directory.Data })
        return Capacitor.convertFileSrc(uri)
    } catch {
        return null
    }
}

export const CONVERT_OFFER = 'convertify-offer-output'

export type ResultTone = 'ok' | 'warn'

export async function finishConvert(
    blob: Blob,
    filename: string,
    note?: string,
    tone: ResultTone = 'ok',
): Promise<void> {
    // No haptic here: the result sheet plays success or warning when it opens.
    if (IS_MOBILE_BUILD || (await isNativeAndroid())) {
        window.dispatchEvent(new CustomEvent(CONVERT_OFFER, { detail: { blob, filename, note, tone } }))
        return
    }
    const name = uniqueVisibleName(filename)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
}

/** Website / interceptor helper: store then share. */
export async function saveOrShareFile(blob: Blob, filename: string): Promise<StoredOutput> {
    const stored = await storeOutput(blob, filename)
    await shareStoredOutput(stored)
    return stored
}

export { safeFileName, uniqueVisibleName }

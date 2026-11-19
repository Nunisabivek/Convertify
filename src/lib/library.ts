/**
 * The app's file library: every finished file, in folders. Files live in the
 * app's private storage (outputs/<id>/<name>); this index lists them. It
 * replaces the old 12-item "recents" list, which forgot older files while
 * leaving them on disk forever.
 */

export interface LibFile {
    id: string
    name: string
    folderId: string | null
    appPath: string
    size: number
    type: string
    createdAt: number
}

export interface LibFolder {
    id: string
    name: string
    createdAt: number
}

export interface Library {
    files: LibFile[]
    folders: LibFolder[]
}

export type SortKey = 'newest' | 'oldest' | 'name' | 'size'

const KEY = 'convertify-library'
const OLD_RECENTS_KEY = 'convertify-recent-files'
export const LIBRARY_EVENT = 'convertify-library-changed'

const empty = (): Library => ({ files: [], folders: [] })
const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`

function storage(): Storage | null {
    try {
        return typeof window === 'undefined' ? null : window.localStorage
    } catch {
        return null
    }
}

export function loadLibrary(): Library {
    const ls = storage()
    if (!ls) return empty()
    try {
        const raw = ls.getItem(KEY)
        if (raw) {
            const lib = JSON.parse(raw) as Library
            return {
                files: Array.isArray(lib.files) ? lib.files.filter((f) => f && f.appPath && f.name) : [],
                folders: Array.isArray(lib.folders) ? lib.folders.filter((f) => f && f.id && f.name) : [],
            }
        }
        // First run of this version: bring over the old recents list.
        const old = JSON.parse(ls.getItem(OLD_RECENTS_KEY) || '[]') as {
            name?: string
            appPath?: string
            size?: number
            type?: string
            timestamp?: number
        }[]
        const lib: Library = {
            files: (Array.isArray(old) ? old : [])
                .filter((r) => r?.name && r?.appPath)
                .map((r) => ({
                    id: newId(),
                    name: r.name as string,
                    folderId: null,
                    appPath: r.appPath as string,
                    size: r.size ?? 0,
                    type: r.type ?? '',
                    createdAt: r.timestamp ?? Date.now(),
                })),
            folders: [],
        }
        saveLibrary(lib)
        return lib
    } catch {
        return empty()
    }
}

export function saveLibrary(lib: Library): void {
    const ls = storage()
    if (!ls) return
    try {
        ls.setItem(KEY, JSON.stringify(lib))
    } catch {
        // storage full: the files are still on disk
    }
    window.dispatchEvent(new Event(LIBRARY_EVENT))
}

function update(fn: (lib: Library) => Library): Library {
    const next = fn(loadLibrary())
    saveLibrary(next)
    return next
}

export function addLibraryFile(entry: Omit<LibFile, 'id' | 'createdAt' | 'folderId'> & { folderId?: string | null }): LibFile {
    const file: LibFile = { id: newId(), createdAt: Date.now(), folderId: entry.folderId ?? null, ...entry }
    update((lib) => ({ ...lib, files: [file, ...lib.files.filter((f) => f.appPath !== file.appPath)] }))
    return file
}

export function patchLibraryFile(id: string, change: Partial<Omit<LibFile, 'id'>>): void {
    update((lib) => ({ ...lib, files: lib.files.map((f) => (f.id === id ? { ...f, ...change } : f)) }))
}

export function removeLibraryFile(id: string): void {
    update((lib) => ({ ...lib, files: lib.files.filter((f) => f.id !== id) }))
}

export function addFolder(name: string): LibFolder {
    const folder: LibFolder = { id: newId(), name: name.trim().slice(0, 60), createdAt: Date.now() }
    update((lib) => ({ ...lib, folders: [...lib.folders, folder] }))
    return folder
}

export function renameFolder(id: string, name: string): void {
    update((lib) => ({ ...lib, folders: lib.folders.map((f) => (f.id === id ? { ...f, name: name.trim().slice(0, 60) } : f)) }))
}

/** Deletes the folder; its files move back to "All files" (nothing is lost). */
export function removeFolder(id: string): void {
    update((lib) => ({
        files: lib.files.map((f) => (f.folderId === id ? { ...f, folderId: null } : f)),
        folders: lib.folders.filter((f) => f.id !== id),
    }))
}

/** Files in a folder (null = all), matching a search, in the chosen order. Pure. */
export function queryFiles(lib: Library, opts: { folderId: string | null; search: string; sort: SortKey }): LibFile[] {
    const q = opts.search.trim().toLowerCase()
    const list = lib.files.filter(
        (f) => (opts.folderId === null || f.folderId === opts.folderId) && (!q || f.name.toLowerCase().includes(q)),
    )
    const by: Record<SortKey, (a: LibFile, b: LibFile) => number> = {
        newest: (a, b) => b.createdAt - a.createdAt,
        oldest: (a, b) => a.createdAt - b.createdAt,
        name: (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }),
        size: (a, b) => b.size - a.size,
    }
    return list.sort(by[opts.sort])
}

/** Folder names must be unique (case-insensitive) and not blank. */
export function folderNameProblem(lib: Library, name: string, exceptId?: string): string | null {
    const n = name.trim()
    if (!n) return 'Type a name for the folder.'
    if (n.length > 60) return 'Keep the name under 60 characters.'
    if (lib.folders.some((f) => f.id !== exceptId && f.name.toLowerCase() === n.toLowerCase())) return 'A folder with that name already exists.'
    return null
}

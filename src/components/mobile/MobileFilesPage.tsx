'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
    Download,
    ExternalLink,
    FileText,
    FolderInput,
    FolderOpen,
    FolderPlus,
    MoreVertical,
    Pencil,
    Search,
    Share2,
    Trash2,
    X,
} from 'lucide-react'
import {
    LIBRARY_EVENT,
    addFolder,
    folderNameProblem,
    loadLibrary,
    patchLibraryFile,
    queryFiles,
    removeFolder,
    removeLibraryFile,
    renameFolder,
    type Library,
    type LibFile,
    type LibFolder,
    type SortKey,
} from '@/lib/library'
import {
    deleteLibraryFileOnDisk,
    formatFileSize,
    formatRecentTime,
    libraryFileUrl,
    openLibraryFile,
    renameLibraryFileOnDisk,
    saveLibraryFileToPhone,
    shareRecentFile,
} from '@/lib/native-file'
import { haptic } from '@/lib/haptics'

type Dialog =
    | { kind: 'new-folder' }
    | { kind: 'rename-folder'; folder: LibFolder }
    | { kind: 'delete-folder'; folder: LibFolder }
    | { kind: 'rename-file'; file: LibFile }
    | { kind: 'move'; file: LibFile }
    | { kind: 'delete-file'; file: LibFile }

const SORTS: { id: SortKey; label: string }[] = [
    { id: 'newest', label: 'Newest' },
    { id: 'name', label: 'Name' },
    { id: 'size', label: 'Size' },
]

function kindOf(file: LibFile): { label: string; tone: string } {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (file.type === 'application/pdf' || ext === 'pdf') return { label: 'PDF', tone: 'pdf' }
    if (file.type.startsWith('image/')) return { label: ext.toUpperCase() || 'IMG', tone: 'img' }
    if (ext === 'docx' || ext === 'doc') return { label: 'DOC', tone: 'doc' }
    if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') return { label: 'XLS', tone: 'xls' }
    if (ext === 'pptx' || ext === 'ppt') return { label: 'PPT', tone: 'ppt' }
    if (ext === 'zip') return { label: 'ZIP', tone: 'zip' }
    return { label: (ext || 'FILE').slice(0, 4).toUpperCase(), tone: 'other' }
}

/** Pictures show themselves, straight from app storage (never read into JS). */
function Thumb({ file }: { file: LibFile }) {
    const [url, setUrl] = useState<string | null>(null)
    const k = kindOf(file)
    useEffect(() => {
        if (!file.type.startsWith('image/')) return
        let live = true
        void libraryFileUrl(file).then((u) => live && setUrl(u))
        return () => {
            live = false
        }
    }, [file])
    if (url) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img className="files-thumb" src={url} alt="" loading="lazy" decoding="async" onError={() => setUrl(null)} />
    }
    return <span className={`files-thumb files-badge is-${k.tone}`}>{k.label}</span>
}

function splitName(name: string): [string, string] {
    const i = name.lastIndexOf('.')
    return i > 0 ? [name.slice(0, i), name.slice(i)] : [name, '']
}

export default function MobileFilesPage() {
    const [lib, setLib] = useState<Library>({ files: [], folders: [] })
    const [folderId, setFolderId] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState<SortKey>('newest')
    const [menu, setMenu] = useState<LibFile | null>(null)
    const [dialog, setDialog] = useState<Dialog | null>(null)
    const [text, setText] = useState('')
    const [problem, setProblem] = useState<string | null>(null)
    const [toast, setToast] = useState<string | null>(null)
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const load = () => setLib(loadLibrary())
        load()
        window.addEventListener(LIBRARY_EVENT, load)
        return () => window.removeEventListener(LIBRARY_EVENT, load)
    }, [])

    // A folder deleted elsewhere: fall back to all files.
    useEffect(() => {
        if (folderId && !lib.folders.some((f) => f.id === folderId)) setFolderId(null)
    }, [lib, folderId])

    const files = useMemo(() => queryFiles(lib, { folderId, search, sort }), [lib, folderId, search, sort])
    const totalBytes = useMemo(() => lib.files.reduce((s, f) => s + (f.size || 0), 0), [lib])
    const countIn = (id: string | null) => (id === null ? lib.files.length : lib.files.filter((f) => f.folderId === id).length)
    const folderName = (id: string | null) => lib.folders.find((f) => f.id === id)?.name
    const current = lib.folders.find((f) => f.id === folderId) ?? null

    const say = (msg: string) => {
        setToast(msg)
        if (toastTimer.current) clearTimeout(toastTimer.current)
        toastTimer.current = setTimeout(() => setToast(null), 2600)
    }

    const run = async (fn: () => Promise<void>, done?: string) => {
        try {
            await fn()
            if (done) {
                say(done)
                void haptic('success')
            }
        } catch (err) {
            say((err as Error)?.message || 'That didn’t work. Try again.')
            void haptic('error')
        }
    }

    const openDialog = (d: Dialog) => {
        setMenu(null)
        setProblem(null)
        setText(
            d.kind === 'rename-folder' ? d.folder.name : d.kind === 'rename-file' ? splitName(d.file.name)[0] : '',
        )
        setDialog(d)
        void haptic('tap')
    }

    const confirm = async () => {
        if (!dialog) return
        if (dialog.kind === 'new-folder' || dialog.kind === 'rename-folder') {
            const p = folderNameProblem(lib, text, dialog.kind === 'rename-folder' ? dialog.folder.id : undefined)
            if (p) {
                setProblem(p)
                void haptic('error')
                return
            }
            if (dialog.kind === 'new-folder') setFolderId(addFolder(text).id)
            else renameFolder(dialog.folder.id, text)
            void haptic('success')
        } else if (dialog.kind === 'delete-folder') {
            removeFolder(dialog.folder.id)
            setFolderId(null)
            say(`Folder deleted. Its files are still in All files.`)
            void haptic('success')
        } else if (dialog.kind === 'rename-file') {
            const base = text.trim()
            if (!base) {
                setProblem('Type a name.')
                return
            }
            const file = dialog.file
            const name = base + splitName(file.name)[1]
            await run(async () => {
                const appPath = await renameLibraryFileOnDisk(file, name)
                patchLibraryFile(file.id, { name, appPath })
            }, 'Renamed')
        } else if (dialog.kind === 'delete-file') {
            const file = dialog.file
            await run(async () => {
                await deleteLibraryFileOnDisk(file)
                removeLibraryFile(file.id)
            }, 'Deleted')
        }
        setDialog(null)
    }

    const moveTo = (file: LibFile, target: string | null) => {
        patchLibraryFile(file.id, { folderId: target })
        setDialog(null)
        say(target ? `Moved to ${folderName(target)}` : 'Moved to All files')
        void haptic('success')
    }

    return (
        <div className="files-page">
            <header className="files-head">
                <p>
                    <strong>
                        {lib.files.length} file{lib.files.length === 1 ? '' : 's'}
                    </strong>{' '}
                    · {formatFileSize(totalBytes)} on this phone
                </p>
                <button type="button" className="files-icon-btn" aria-label="New folder" onClick={() => openDialog({ kind: 'new-folder' })}>
                    <FolderPlus size={22} />
                </button>
            </header>

            <label className="files-search">
                <Search size={18} aria-hidden />
                <input type="search" placeholder="Search files" value={search} onChange={(e) => setSearch(e.target.value)} />
                {search && (
                    <button type="button" aria-label="Clear search" onClick={() => setSearch('')}>
                        <X size={16} />
                    </button>
                )}
            </label>

            <div className="files-folders" role="tablist" aria-label="Folders">
                <button
                    type="button"
                    role="tab"
                    aria-selected={folderId === null}
                    className={`files-chip${folderId === null ? ' is-on' : ''}`}
                    onClick={() => {
                        setFolderId(null)
                        void haptic('select')
                    }}
                >
                    All files <span>{countIn(null)}</span>
                </button>
                {lib.folders.map((f) => (
                    <button
                        key={f.id}
                        type="button"
                        role="tab"
                        aria-selected={folderId === f.id}
                        className={`files-chip${folderId === f.id ? ' is-on' : ''}`}
                        onClick={() => {
                            setFolderId(f.id)
                            void haptic('select')
                        }}
                    >
                        <FolderOpen size={15} aria-hidden /> {f.name} <span>{countIn(f.id)}</span>
                    </button>
                ))}
                <button type="button" className="files-chip is-add" onClick={() => openDialog({ kind: 'new-folder' })}>
                    <FolderPlus size={15} aria-hidden /> New folder
                </button>
            </div>

            <div className="files-bar">
                <div className="files-sort" role="radiogroup" aria-label="Sort">
                    {SORTS.map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            role="radio"
                            aria-checked={sort === s.id}
                            className={sort === s.id ? 'is-on' : ''}
                            onClick={() => {
                                setSort(s.id)
                                void haptic('select')
                            }}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
                {current && (
                    <div className="files-folder-actions">
                        <button type="button" onClick={() => openDialog({ kind: 'rename-folder', folder: current })}>
                            Rename
                        </button>
                        <button type="button" className="is-danger" onClick={() => openDialog({ kind: 'delete-folder', folder: current })}>
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {files.length === 0 ? (
                <div className="files-empty">
                    <FileText size={30} />
                    <strong>{search ? 'No files match' : current ? 'This folder is empty' : 'No files yet'}</strong>
                    <span>
                        {search
                            ? 'Try another name.'
                            : current
                              ? 'Open a file’s menu and choose Move to put it here.'
                              : 'Everything you make with Convertify is kept here, on this phone.'}
                    </span>
                </div>
            ) : (
                <ul className="files-list">
                    {files.map((f) => (
                        <li key={f.id}>
                            <button
                                type="button"
                                className="files-row"
                                onClick={() => {
                                    void haptic('tap')
                                    void run(() => openLibraryFile(f))
                                }}
                            >
                                <Thumb file={f} />
                                <span className="files-meta">
                                    <strong>{f.name}</strong>
                                    <span>
                                        {formatFileSize(f.size)} · {formatRecentTime(f.createdAt)}
                                        {folderId === null && f.folderId ? ` · ${folderName(f.folderId) ?? ''}` : ''}
                                    </span>
                                </span>
                            </button>
                            <button
                                type="button"
                                className="files-more"
                                aria-label={`More for ${f.name}`}
                                onClick={() => {
                                    void haptic('tap')
                                    setMenu(f)
                                }}
                            >
                                <MoreVertical size={20} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {menu && (
                <div className="files-sheet-scrim" onClick={() => setMenu(null)}>
                    <div className="files-sheet" role="dialog" aria-label={menu.name} onClick={(e) => e.stopPropagation()}>
                        <div className="files-sheet-title">
                            <Thumb file={menu} />
                            <span className="files-meta">
                                <strong>{menu.name}</strong>
                                <span>{formatFileSize(menu.size)}</span>
                            </span>
                        </div>
                        <button type="button" onClick={() => { const f = menu; setMenu(null); void run(() => openLibraryFile(f)) }}>
                            <ExternalLink size={20} /> Open with…
                        </button>
                        <button type="button" onClick={() => { const f = menu; setMenu(null); void run(() => shareRecentFile(f)) }}>
                            <Share2 size={20} /> Share
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const f = menu
                                const folder = folderName(f.folderId)
                                setMenu(null)
                                void run(() => saveLibraryFileToPhone(f, folder), `Saved to Downloads/Convertify${folder ? `/${folder}` : ''}`)
                            }}
                        >
                            <Download size={20} /> Save to phone
                        </button>
                        <button type="button" onClick={() => openDialog({ kind: 'rename-file', file: menu })}>
                            <Pencil size={20} /> Rename
                        </button>
                        <button type="button" onClick={() => openDialog({ kind: 'move', file: menu })}>
                            <FolderInput size={20} /> Move to folder
                        </button>
                        <button type="button" className="is-danger" onClick={() => openDialog({ kind: 'delete-file', file: menu })}>
                            <Trash2 size={20} /> Delete
                        </button>
                    </div>
                </div>
            )}

            {dialog && (
                <div className="files-sheet-scrim" onClick={() => setDialog(null)}>
                    <div className="files-dialog" role="dialog" onClick={(e) => e.stopPropagation()}>
                        {dialog.kind === 'move' ? (
                            <>
                                <h2>Move to folder</h2>
                                <div className="files-move-list">
                                    <button type="button" className={dialog.file.folderId === null ? 'is-on' : ''} onClick={() => moveTo(dialog.file, null)}>
                                        <FileText size={18} /> All files (no folder)
                                    </button>
                                    {lib.folders.map((f) => (
                                        <button key={f.id} type="button" className={dialog.file.folderId === f.id ? 'is-on' : ''} onClick={() => moveTo(dialog.file, f.id)}>
                                            <FolderOpen size={18} /> {f.name}
                                        </button>
                                    ))}
                                </div>
                                <button type="button" className="files-link" onClick={() => openDialog({ kind: 'new-folder' })}>
                                    <FolderPlus size={18} /> New folder
                                </button>
                                <div className="files-dialog-actions">
                                    <button type="button" onClick={() => setDialog(null)}>Cancel</button>
                                </div>
                            </>
                        ) : dialog.kind === 'delete-file' || dialog.kind === 'delete-folder' ? (
                            <>
                                <h2>{dialog.kind === 'delete-file' ? 'Delete this file?' : `Delete “${dialog.folder.name}”?`}</h2>
                                <p>
                                    {dialog.kind === 'delete-file'
                                        ? `${dialog.file.name} will be removed from this phone. Copies you saved to Downloads or shared stay where they are.`
                                        : 'The folder goes away. Its files are kept and move to All files.'}
                                </p>
                                <div className="files-dialog-actions">
                                    <button type="button" onClick={() => setDialog(null)}>Cancel</button>
                                    <button type="button" className="is-danger" onClick={() => void confirm()}>Delete</button>
                                </div>
                            </>
                        ) : (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    void confirm()
                                }}
                            >
                                <h2>{dialog.kind === 'new-folder' ? 'New folder' : dialog.kind === 'rename-folder' ? 'Rename folder' : 'Rename file'}</h2>
                                <div className="files-input-row">
                                    <input
                                        autoFocus
                                        value={text}
                                        maxLength={dialog.kind === 'rename-file' ? 120 : 60}
                                        placeholder={dialog.kind === 'rename-file' ? 'File name' : 'e.g. Taxes 2026'}
                                        onChange={(e) => {
                                            setText(e.target.value)
                                            setProblem(null)
                                        }}
                                    />
                                    {dialog.kind === 'rename-file' && <span>{splitName(dialog.file.name)[1]}</span>}
                                </div>
                                {problem && <p className="files-problem">{problem}</p>}
                                <div className="files-dialog-actions">
                                    <button type="button" onClick={() => setDialog(null)}>Cancel</button>
                                    <button type="submit" className="is-primary">{dialog.kind === 'new-folder' ? 'Create' : 'Save'}</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {toast && <div className="files-toast" role="status">{toast}</div>}
        </div>
    )
}

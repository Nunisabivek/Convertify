import assert from 'node:assert/strict'

// Minimal browser globals so the module's localStorage + events work under node.
const store = new Map<string, string>()
;(globalThis as any).window = {
    localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => void store.set(k, v),
    },
    dispatchEvent: () => true,
}

const lib = await import('./library.ts')

// Old recents migrate into the library once.
store.set('convertify-recent-files', JSON.stringify([
    { id: 'a', name: 'old-scan.pdf', appPath: 'outputs/1-old-scan.pdf', size: 1200, type: 'application/pdf', timestamp: 1000 },
    { id: 'b', name: 'broken' }, // no appPath: dropped
]))
let L = lib.loadLibrary()
assert.equal(L.files.length, 1)
assert.equal(L.files[0].name, 'old-scan.pdf')
assert.equal(L.files[0].folderId, null)
assert.ok(store.has('convertify-library'))

// Add, folder, move, rename, query.
const f1 = lib.addLibraryFile({ name: 'Invoice 10.pdf', appPath: 'outputs/x/Invoice 10.pdf', size: 5000, type: 'application/pdf' })
const f2 = lib.addLibraryFile({ name: 'invoice 9.pdf', appPath: 'outputs/y/invoice 9.pdf', size: 900, type: 'application/pdf' })
const tax = lib.addFolder('  Taxes  ')
assert.equal(tax.name, 'Taxes')
lib.patchLibraryFile(f1.id, { folderId: tax.id })
L = lib.loadLibrary()
assert.equal(lib.queryFiles(L, { folderId: tax.id, search: '', sort: 'newest' }).length, 1)
assert.deepEqual(
    lib.queryFiles(L, { folderId: null, search: 'invoice', sort: 'name' }).map((f) => f.name),
    ['invoice 9.pdf', 'Invoice 10.pdf'], // natural, case-insensitive order
)
assert.deepEqual(lib.queryFiles(L, { folderId: null, search: '', sort: 'size' }).map((f) => f.size), [5000, 1200, 900])

// Folder names: blank and duplicates refused.
assert.equal(lib.folderNameProblem(L, '   '), 'Type a name for the folder.')
assert.equal(lib.folderNameProblem(L, 'taxes'), 'A folder with that name already exists.')
assert.equal(lib.folderNameProblem(L, 'taxes', tax.id), null)

// Deleting a folder keeps its files.
lib.removeFolder(tax.id)
L = lib.loadLibrary()
assert.equal(L.folders.length, 0)
assert.equal(L.files.find((f) => f.id === f1.id)?.folderId, null)

// Removing a file; re-adding the same path replaces instead of duplicating.
lib.removeLibraryFile(f2.id)
lib.addLibraryFile({ name: 'Invoice 10 v2.pdf', appPath: 'outputs/x/Invoice 10.pdf', size: 5100, type: 'application/pdf' })
L = lib.loadLibrary()
assert.equal(L.files.filter((f) => f.appPath === 'outputs/x/Invoice 10.pdf').length, 1)
assert.equal(L.files.length, 2)

console.log('library tests passed')

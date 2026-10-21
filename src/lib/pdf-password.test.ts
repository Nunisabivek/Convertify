import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import * as pdfLib from 'pdf-lib'
import { loadPdf } from './pdf-password.ts'

// Both fixtures were written by PyMuPDF (AES-256), so this also checks files from another producer.
const fixture = (name: string) => readFileSync(new URL(`../../scripts/fixtures/${name}`, import.meta.url))

// Permissions-only PDF (no open password): opens without asking.
const doc1 = await loadPdf(fixture('owner-only-aes256.pdf'), 'a.pdf', () => assert.fail('should not ask'))
assert.equal(doc1.getPageCount(), 2)

// Open password: a wrong answer asks again with retry=true, the right one decrypts.
const locked = fixture('user-pw-1234-aes256.pdf')
const answers = ['nope', '1234']
const retries: boolean[] = []
const doc2 = await loadPdf(locked, 'b.pdf', (_n, retry) => { retries.push(retry); return answers.shift() ?? null })
assert.deepEqual(retries, [false, true])
// Saved output is an ordinary unencrypted PDF.
const reopened = await pdfLib.PDFDocument.load(await doc2.save())
assert.equal(reopened.getPageCount(), 2)

// The password typed above is remembered: the same file opens without asking.
await loadPdf(locked, 'b.pdf', () => assert.fail('should not ask again'))

// Cancelling throws a readable error (no remembered password fits this file).
const { configure, lock } = await import('pdf-lib-encrypt')
configure(pdfLib)
const other = await lock(await (await pdfLib.PDFDocument.create()).save(), 'different')
await assert.rejects(loadPdf(other, 'c.pdf', () => null), /"c\.pdf" is password-protected/)

// Unencrypted files are untouched.
assert.equal((await loadPdf(await reopened.save())).getPageCount(), 2)

console.log('pdf-password tests passed')

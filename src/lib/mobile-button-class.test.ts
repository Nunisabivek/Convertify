import assert from 'node:assert/strict'
import { mobileButtonClass, stripButtonAppearance } from './mobile-button-class.ts'

// Resize's orange main action: colour and size go, layout stays.
assert.equal(stripButtonAppearance('w-full bg-orange-600 hover:bg-orange-700'), 'w-full')
assert.equal(stripButtonAppearance('flex-1 mt-4 h-14 px-8 text-lg rounded-xl gap-2'), 'flex-1 mt-4 gap-2')
assert.equal(stripButtonAppearance('text-center text-white border-b-[3px] border-[#0050BD] shadow-md'), 'text-center')
assert.equal(stripButtonAppearance('disabled:opacity-50 active:translate-y-0.5'), 'active:translate-y-0.5')
assert.equal(stripButtonAppearance(''), '')

assert.equal(mobileButtonClass(undefined, 'xl', 'w-full bg-purple-600'), 'm-btn m-btn-primary m-btn-lg w-full')
assert.equal(mobileButtonClass('outline', 'sm', 'text-slate-700'), 'm-btn m-btn-secondary m-btn-sm')
assert.equal(mobileButtonClass('ghost', 'icon'), 'm-btn m-btn-ghost m-btn-icon')
assert.equal(mobileButtonClass('destructive', undefined), 'm-btn m-btn-danger m-btn-md')

console.log('mobile button class tests passed')

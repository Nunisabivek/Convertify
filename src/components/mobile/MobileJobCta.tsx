'use client'

import { ReactNode } from 'react'

/** Pins the primary convert action above the Android bottom nav + banner. */
export default function MobileJobCta({ children }: { children: ReactNode }) {
    return <div className="mobile-job-cta">{children}</div>
}

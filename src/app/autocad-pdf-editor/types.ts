import type { PlacedItem } from "@/lib/cad/content-stream"
import type { Placement } from "@/lib/cad/export"
import type { PageFrame } from "@/lib/cad/viewport"

/** An editable text region. Geometry is in display space (points, y down) except `place`. */
export type Region = {
    id: string
    kind: "text" | "shx" | "manual"
    originalText?: string
    /** Oriented box: start-top corner of the text in reading order, size, clockwise angle on screen. */
    box: { x: number; y: number; w: number; h: number; angle: number }
    /** Where replacement text goes, in PDF user space. */
    place: Placement
    /** Sampled text colour and paper colour, "#rrggbb". */
    color: string
    paper: string
    family?: "sans" | "serif" | "mono"
    bold?: boolean
}

export type PageModel = {
    /** Object URL of the rendered page (revoked on reset/unmount). */
    url: string
    /** Canvas pixels per point the page was rendered at. */
    renderScale: number
    /** Displayed page size in points. */
    width: number
    height: number
    frame: PageFrame
    regions: Region[]
    /** Every real text item, for removing edited text from the content stream. */
    items: PlacedItem[]
    /** Detection counts, for the legend. */
    textCount: number
    shxCount: number
}

export type Tool =
    | "select"
    | "region"
    | "arrow"
    | "cloud"
    | "rect"
    | "highlight"
    | "note"
    | "stamp"
    | "measure"
    | "calibrate"

export const regionKey = (page: number, id: string) => `p${page}:${id}`

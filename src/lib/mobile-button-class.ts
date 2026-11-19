/**
 * Website tool screens style their <Button>s with Tailwind colours and sizes
 * (orange Resize, purple Merge, teal WebP...). The Android app reuses those
 * screens, so in the mobile build the shared Button drops the colour and size
 * utilities and takes the app's one button language instead. Layout utilities
 * (w-full, flex-1, margins, gaps) are kept so the screen still lays out.
 */

const APPEARANCE = [
    // colour, border, shadow, gradient, ring, opacity: on any state prefix
    /^(?:[a-z-]+:)*(?:bg|text|border|shadow|from|via|to|ring|outline|opacity|fill|stroke|decoration)(?:-|$)/,
    // height, padding and corner sizing belong to the app's button sizes
    /^(?:[a-z-]+:)*(?:h|min-h|px|py|pt|pb|pl|pr|p|rounded|leading|tracking|font|uppercase|lowercase|capitalize)(?:-|$)/,
]

// text-left/center/right is alignment, not appearance
const KEEP = /^(?:[a-z-]+:)*text-(?:left|center|right|justify|start|end)$/

export function stripButtonAppearance(className = ''): string {
    return className
        .split(/\s+/)
        .filter((c) => c && (KEEP.test(c) || !APPEARANCE.some((re) => re.test(c))))
        .join(' ')
}

type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null | undefined
type Size = 'default' | 'sm' | 'lg' | 'icon' | 'xl' | null | undefined

export function mobileButtonClass(variant: Variant, size: Size, className?: string): string {
    const v =
        variant === 'outline' || variant === 'secondary'
            ? 'secondary'
            : variant === 'ghost' || variant === 'link'
              ? 'ghost'
              : variant === 'destructive'
                ? 'danger'
                : 'primary'
    const s = size === 'sm' ? 'sm' : size === 'icon' ? 'icon' : size === 'xl' || size === 'lg' ? 'lg' : 'md'
    return ['m-btn', `m-btn-${v}`, `m-btn-${s}`, stripButtonAppearance(className)].filter(Boolean).join(' ')
}

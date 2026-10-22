/**
 * Google AdSense publisher. Not a secret: it appears in every page's HTML and in public/ads.txt.
 * Kept in a plain module (not "use client") so the server layout can read the value.
 */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-4814181825408625"

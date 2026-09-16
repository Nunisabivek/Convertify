/**
 * Website stub. convertify.work never loads AdMob; Adsterra stays in
 * src/components/ads/banner.tsx. The real module is src/lib/native-ads.ts
 * and is used only when NEXT_PUBLIC_MOBILE_BUILD=true.
 */
export function startNativeAds(): Promise<void> {
    return Promise.resolve()
}

export function noteSuccessfulConversion(): void {}

export { shouldOfferInterstitial, type InterstitialGate } from './interstitial-gate'

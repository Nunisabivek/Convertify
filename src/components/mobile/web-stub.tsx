// Website builds point the Android-only screens here (WEB_STUBS in next.config.ts), so their
// code and what it pulls in (pdf-lib, framer-motion, the Files library, haptics) never ships
// to website visitors. Pages render these only behind IS_MOBILE_BUILD, so nothing shows.
const Null = () => null

export default Null
export {
    Null as MobileHomePage,
    Null as MobileAboutPage,
    Null as MobileToolsDashboard,
    Null as MobileHero,
    Null as MobileToolGrid,
    Null as MobileRecentFiles,
}

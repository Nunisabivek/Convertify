'use client';

import { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdBanner } from "@/components/ads/banner";
import { JsonLd } from "@/components/seo/json-ld";
import { MobileLayout } from "@/components/mobile";
import { IS_MOBILE_BUILD } from "@/lib/is-mobile-build";
import { usePathname } from "next/navigation";

const FULL_WIDTH_ROUTES = ["/autocad-pdf-editor"];

export default function ClientLayout({
    children,
}: {
    children: ReactNode;
}) {
    const pathname = usePathname();
    const isFullWidth = FULL_WIDTH_ROUTES.includes(pathname || "");

    if (IS_MOBILE_BUILD) {
        return <MobileLayout>{children}</MobileLayout>;
    }

    return (
        <>
            <Header />

            <div className="flex justify-center w-full max-w-[1920px] mx-auto">
                {!isFullWidth && (
                    <aside className="hidden xl:flex w-[180px] shrink-0 flex-col items-center pt-8 sticky top-0 self-start">
                        <AdBanner variant="skyscraper" />
                    </aside>
                )}

                <main className="flex-1 min-w-0">
                    {children}
                </main>

                {!isFullWidth && (
                    <aside className="hidden xl:flex w-[180px] shrink-0 flex-col items-center pt-8 sticky top-0 self-start">
                        <AdBanner variant="skyscraper" />
                    </aside>
                )}
            </div>

            <AdBanner variant="footer" />
            <Footer />
            <JsonLd />
        </>
    );
}

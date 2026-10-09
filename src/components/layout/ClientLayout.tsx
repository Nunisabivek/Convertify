'use client';

import { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdBanner } from "@/components/ads/banner";
import { JsonLd } from "@/components/seo/json-ld";
import { PlayStoreBanner, PlayStoreTopBar } from "@/components/ui/google-play-badge";
import { usePathname } from "next/navigation";

const FULL_WIDTH_ROUTES = ["/autocad-pdf-editor"];

/** Website chrome only. The Android shell never imports this file. */
export default function ClientLayout({
    children,
}: {
    children: ReactNode;
}) {
    const pathname = usePathname();
    const isFullWidth = FULL_WIDTH_ROUTES.includes(pathname || "");

    return (
        <>
            <Header />
            <PlayStoreTopBar />

            <div className="flex justify-center w-full max-w-[1920px] mx-auto">
                {!isFullWidth && (
                    <aside className="hidden xl:flex w-[180px] shrink-0 flex-col items-center pt-8 sticky top-0 self-start">
                        <AdBanner variant="skyscraper" />
                    </aside>
                )}

                <main className="flex-1 min-w-0 pb-16 md:pb-20">
                    {children}

                    <div className="container max-w-5xl mx-auto px-4 mt-12 mb-4">
                        <PlayStoreBanner />
                    </div>
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

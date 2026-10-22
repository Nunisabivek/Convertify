'use client';

import { ReactNode, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";
import { PlayStoreBanner, PlayStoreTopBar } from "@/components/ui/google-play-badge";
import { usePathname } from "next/navigation";
import { startMonetag } from "@/lib/monetag";

/** Website chrome only. The Android shell never imports this file. */
export default function ClientLayout({
    children,
}: {
    children: ReactNode;
}) {
    const pathname = usePathname();

    // Ads never load while someone is working; see src/lib/monetag.ts for when they do.
    useEffect(() => startMonetag(pathname || "/"), [pathname]);

    return (
        <>
            <Header />
            {/* Phones already have the Play Store button in the header; the bar only pushed the tool below the fold. */}
            <PlayStoreTopBar className="hidden md:block" />

            <div className="flex justify-center w-full max-w-[1920px] mx-auto">
                <main className="flex-1 min-w-0 pb-16 md:pb-20">
                    {children}

                    <div className="container max-w-5xl mx-auto px-4 mt-12 mb-4">
                        <PlayStoreBanner />
                    </div>
                </main>
            </div>

            <Footer />
            <JsonLd />
        </>
    );
}

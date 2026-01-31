'use client';

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdBanner } from "@/components/ads/banner";
import { JsonLd } from "@/components/seo/json-ld";
import { MobileLayout } from "@/components/mobile";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isNative, setIsNative] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkPlatform = async () => {
            try {
                const { Capacitor } = await import('@capacitor/core');
                setIsNative(Capacitor.isNativePlatform());
            } catch {
                setIsNative(false);
            } finally {
                setLoading(false);
            }
        };

        checkPlatform();
    }, []);

    // While checking, render the Web layout (SSR default) to avoid hydration errors
    // But strictly, we might want a loading state if we want to prevent flash.
    // However, for SEO, we must render Web content by default.
    // If we are on Native, we will switch after hydration.

    if (isNative) {
        return <MobileLayout>{children}</MobileLayout>;
    }

    return (
        <>
            <Header />

            <div className="flex justify-center w-full max-w-[1920px] mx-auto">
                {/* Left Ad Sidebar */}
                <aside className="hidden xl:flex w-[180px] shrink-0 flex-col items-center pt-8 sticky top-0 h-screen">
                    <AdBanner variant="skyscraper" />
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {children}
                </main>

                {/* Right Ad Sidebar */}
                <aside className="hidden xl:flex w-[180px] shrink-0 flex-col items-center pt-8 sticky top-0 h-screen">
                    <AdBanner variant="skyscraper" />
                </aside>
            </div>

            <AdBanner />
            <Footer />
            <JsonLd />
        </>
    );
}

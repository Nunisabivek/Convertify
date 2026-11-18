import { AdBanner } from '@/components/ads/banner';
import { InToolPlayStoreCallout } from '@/components/ui/google-play-badge';

interface ToolContentProps {
    toolName: string;
    description: string;
}

// Short "About" paragraph under a tool, plus the app callout and an ad slot. The feature list,
// "Why use Convertify" benefit grid, use-case list and trust line that used to sit here were cut
// (2026-11-18): the same blocks on ~60 tool pages read as mass-produced text to Google.
export function ToolSeoContent({ toolName, description }: ToolContentProps) {
    return (
        <section className="w-full bg-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <InToolPlayStoreCallout toolName={toolName} className="mb-12" />
                <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        About {toolName}
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        {description}
                    </p>
                </div>
                <AdBanner variant="rectangle" />
            </div>
        </section>
    );
}

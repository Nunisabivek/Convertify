const fs = require('fs');
const path = require('path');

const tools = [
    'add-page-numbers',
    'compare-pdf',
    'crop-pdf',
    'edit-pdf',
    'ocr-pdf',
    'organize-pdf',
    'pdf-to-excel',
    'pdf-to-pdfa',
    'pdf-to-powerpoint',
    'redact-pdf',
    'repair-pdf',
    'sign-pdf'
];

const template = (toolName) => `import { Metadata } from "next"
import { ComingSoonTool } from "@/components/tools/coming-soon-tool"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { toolSeoData } from "@/lib/seo-data"

const toolName = "${toolName}"
// @ts-ignore
const seoData = toolSeoData[toolName]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: \`/\${toolName}\`,
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: \`/\${toolName}\`,
        images: [
            {
                url: "/images/og-banner.png",
                width: 1200,
                height: 630,
                alt: seoData.title,
            },
        ],
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <section className="w-full py-8 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        {seoData.description}
                    </p>
                </div>
                <ComingSoonTool />
            </section>

             <HowToSchema
                toolName={seoData.title}
                description={seoData.description}
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName={seoData.h1}
                faqs={seoData.faqs}
            />

            <RelatedTools currentTool={\`/\${toolName}\`} />
        </div>
    )
}
`;

const appDir = path.join(__dirname, '..', 'src', 'app');

tools.forEach(tool => {
    const toolDir = path.join(appDir, tool);
    if (!fs.existsSync(toolDir)) {
        console.log(`Creating directory for ${tool}...`);
        fs.mkdirSync(toolDir);
    } else {
        console.log(`Directory ${tool} already exists.`);
    }

    const pagePath = path.join(toolDir, 'page.tsx');
    if (!fs.existsSync(pagePath)) {
        console.log(`Creating page.tsx for ${tool}...`);
        fs.writeFileSync(pagePath, template(tool));
    } else {
        console.log(`page.tsx for ${tool} already exists. Skipping.`);
    }
});

console.log('Scaffolding complete!');

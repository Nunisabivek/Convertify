import GenericToolPage from "@/components/tools/generic-page"

import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Excel to PDF Converter - XLS to PDF Online - Convertify",
    description: "Convert Excel spreadsheets (XLS, XLSX) to PDF format. Keep your data tables intact and secure.",
    keywords: ["excel to pdf", "xls to pdf", "xlsx to pdf", "convert excel to pdf", "spreadsheet to pdf"],
    alternates: {
        canonical: "/excel-to-pdf",
    },
    openGraph: {
        title: "Excel to PDF Converter - XLS to PDF Online",
        description: "Convert Excel spreadsheets to PDF format easily.",
        url: "/excel-to-pdf",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "Excel to PDF - Convertify" }],
    },
}

export default function Page() {
    return <GenericToolPage />
}

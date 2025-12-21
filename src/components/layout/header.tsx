import Link from "next/link"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container px-4 md:px-6 flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-indigo-600" />
                    <span className="text-xl font-bold tracking-tight text-indigo-950">Convertify</span>
                </Link>
                <nav className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                        <Link href="/all-tools">All Tools</Link>
                    </Button>
                    <Button>Get Started</Button>
                </nav>
            </div>
        </header>
    )
}

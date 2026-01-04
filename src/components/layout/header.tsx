import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container px-4 md:px-6 flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/images/Convertify.png"
                        alt="Convertify Logo"
                        width={32}
                        height={32}
                        className="object-contain"
                    />
                    <span className="text-xl font-bold tracking-tight text-indigo-950">Convertify</span>
                </Link>
                <nav className="flex items-center gap-4">
                    <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-indigo-600 transition-colors">
                        Blog
                    </Link>
                    <Link href="/all-tools" className="text-sm font-medium text-muted-foreground hover:text-indigo-600 transition-colors">
                        All Tools
                    </Link>
                    <Button>Get Started</Button>
                </nav>
            </div>
        </header>
    )
}

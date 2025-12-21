import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Construction } from "lucide-react"

interface ComingSoonProps {
    title: string
    description: string
}

export function ComingSoon({ title, description }: ComingSoonProps) {
    return (
        <div className="container py-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
            <div className="bg-yellow-100 p-6 rounded-full text-yellow-600 mb-6">
                <Construction className="w-16 h-16" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{title}</h1>
            <p className="text-xl text-slate-500 max-w-lg mb-8">{description}</p>
            <div className="flex gap-4">
                <Button size="xl" asChild>
                    <Link href="/">Explore Other Tools</Link>
                </Button>
            </div>
        </div>
    )
}

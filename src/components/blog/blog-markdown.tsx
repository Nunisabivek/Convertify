import Link from "next/link"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"

// Renders blog post bodies (blog-data.ts / blog-posts-longtail.ts). The
// previous hand-rolled line renderer only understood one construct per line,
// so on 48 of 56 posts readers saw literal `**bold**`, `[text](/url)` and
// `| table | rows |`. This is a server component: no markdown code ships to
// the browser.

const components: Components = {
    // The page template already renders the post title as the only <h1>.
    h1: ({ children }) => (
        <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-900">{children}</h2>
    ),
    h2: ({ children }) => (
        <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-900">{children}</h2>
    ),
    h3: ({ children }) => (
        <h3 className="text-xl font-semibold mt-8 mb-3 text-slate-800">{children}</h3>
    ),
    h4: ({ children }) => (
        <h4 className="text-lg font-semibold mt-6 mb-2 text-slate-800">{children}</h4>
    ),
    p: ({ children }) => (
        <p className="mb-4 text-slate-700 leading-relaxed">{children}</p>
    ),
    ul: ({ children }) => (
        <ul className="list-disc ml-6 mb-4 space-y-1.5 text-slate-700">{children}</ul>
    ),
    ol: ({ children }) => (
        <ol className="list-decimal ml-6 mb-4 space-y-1.5 text-slate-700">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
    strong: ({ children }) => (
        <strong className="font-semibold text-slate-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-indigo-200 bg-indigo-50/40 pl-4 pr-3 py-2 my-6 text-slate-700 rounded-r-lg">
            {children}
        </blockquote>
    ),
    hr: () => <hr className="my-8 border-slate-200" />,
    code: ({ children }) => (
        <code className="font-mono text-[0.9em] bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">
            {children}
        </code>
    ),
    a: ({ href = "", children }) => {
        const className =
            "text-indigo-600 hover:text-indigo-700 underline underline-offset-2 font-medium"
        if (href.startsWith("/") || href.startsWith("#")) {
            return (
                <Link href={href} className={className}>
                    {children}
                </Link>
            )
        }
        return (
            <a href={href} className={className} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        )
    },
    table: ({ children }) => (
        <div className="my-6 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm text-left text-slate-700">{children}</table>
        </div>
    ),
    thead: ({ children }) => <thead className="bg-slate-100 text-slate-900">{children}</thead>,
    tr: ({ children }) => <tr className="border-b border-slate-200 last:border-b-0">{children}</tr>,
    th: ({ children }) => <th className="px-4 py-2.5 font-semibold align-top">{children}</th>,
    td: ({ children }) => <td className="px-4 py-2.5 align-top">{children}</td>,
}

export function BlogMarkdown({ content }: { content: string }) {
    return (
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
            {content}
        </ReactMarkdown>
    )
}

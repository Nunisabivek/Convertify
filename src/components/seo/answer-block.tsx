interface AnswerBlockProps {
    question: string
    answer: string
}

// Direct, one-sentence answer at the top of a tool/blog page.
// Optimized for AEO (Google featured snippets) and GEO (LLM citations).
// Renders a Question schema with a short, citable answer.
export function AnswerBlock({ question, answer }: AnswerBlockProps) {
    const questionSchema = {
        "@context": "https://schema.org",
        "@type": "Question",
        "name": question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": answer,
        },
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(questionSchema) }}
            />
            <aside
                className="w-full max-w-3xl mx-auto px-4 py-4 my-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg"
                aria-label="Quick answer"
            >
                <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                    Quick answer
                </p>
                <p className="text-base leading-relaxed text-slate-800">
                    {answer}
                </p>
            </aside>
        </>
    )
}

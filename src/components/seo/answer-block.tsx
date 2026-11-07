interface AnswerBlockProps {
    question: string
    answer: string
}

// Short, direct answer at the top of a tool/blog page, for readers and for
// featured snippets / AI answers that quote it. No JSON-LD: a bare Question
// outside an FAQPage or QAPage isn't a valid rich-result type, and Speakable
// only applies to news publishers. The page's FAQPage carries the Q&A markup.
export function AnswerBlock({ answer }: AnswerBlockProps) {
    return (
        <aside
            className="answer-block-speakable w-full max-w-3xl mx-auto px-4 py-4 my-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg"
            aria-label="Quick answer"
        >
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                Quick answer
            </p>
            <p className="text-base leading-relaxed text-slate-800">
                {answer}
            </p>
        </aside>
    )
}

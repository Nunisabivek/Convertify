interface AnswerBlockProps {
    question: string
    answer: string
}

// Direct, one-sentence answer at the top of a tool/blog page.
// Optimized for AEO (Google featured snippets) and GEO (LLM citations).
// Renders a Question schema with a short, citable answer + Speakable markup
// for voice search (Google Assistant, Siri, Alexa) and AI answer engines.
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

    // Speakable schema — tells search engines and voice assistants which
    // content on the page is most suitable for text-to-speech / AI citation.
    const speakableSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".answer-block-speakable"]
        }
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(questionSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
            />
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
        </>
    )
}

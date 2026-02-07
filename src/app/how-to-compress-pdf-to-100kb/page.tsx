import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import Link from "next/link"

export const metadata: Metadata = {
  title: "How to Compress PDF to 100KB for Government Forms",
  description: "Reduce PDF file size to exactly 100KB for visa applications, passport forms, and government portals. Free online compressor.",
  keywords: ["compress pdf to 100kb","reduce pdf to 100kb","pdf compressor 100kb","compress pdf for visa"],
  alternates: {
    canonical: "https://convertify.work/how-to-compress-pdf-to-100kb",
  },
  openGraph: {
    title: "How to Compress PDF to 100KB for Government Forms",
    description: "Reduce PDF file size to exactly 100KB for visa applications, passport forms, and government portals. Free online compressor.",
    url: "/how-to-compress-pdf-to-100kb",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "How to Compress PDF to 100KB for Government Forms",
      },
    ],
  },
}

const faqs = [
  {
    question: "Is this method really free?",
    answer: "Yes! Convertify is 100% free with no watermarks, no file limits, and no sign-up required. You can use all our tools unlimited times."
  },
  {
    question: "Do I need to install any software?",
    answer: "No installation needed. Everything works directly in your web browser on Windows, Mac, iPhone, Android, or any device."
  },
  {
    question: "Is my data safe and private?",
    answer: "Absolutely. All processing happens locally in your browser. Your files never leave your device, ensuring complete privacy."
  },
  {
    question: "Are there any file size limits?",
    answer: "No! Process files of any size. Unlike other tools, we don't impose artificial limits on file size or number of pages."
  }
]

const howToSteps = [
  { name: "Open Tool", text: "Visit Convertify and open the free online tool." },
  { name: "Upload File", text: "Select or drag and drop your file into the upload area." },
  { name: "Process", text: "The tool automatically processes your file in seconds." },
  { name: "Download", text: "Download your result instantly - no watermarks added!" }
]

export default function Page() {
  return (
    <div className="flex flex-col items-center">
      {/* Structured Data Schemas */}
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "/" },
          { name: "Guides", url: "/blog" },
          { name: "Compress PDF to 100KB - Government Form Ready", url: "/how-to-compress-pdf-to-100kb" }
        ]}
      />
      <SoftwareApplicationSchema
        toolName="PDF Tools"
        toolSlug="compress-pdf"
        description="Reduce PDF file size to exactly 100KB for visa applications, passport forms, and government portals. Free online compressor."
      />

      {/* Hero Section */}
      <section className="w-full py-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 text-center">
            Compress PDF to 100KB - Government Form Ready
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 text-center">
            Reduce PDF file size to exactly 100KB for visa applications, passport forms, and government portals. Free online compressor.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">100%</div>
              <div className="text-sm text-slate-600">Free</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">No Limits</div>
              <div className="text-sm text-slate-600">File Size</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">Private</div>
              <div className="text-sm text-slate-600">100% Secure</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link 
              href="/compress-pdf"
              className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Try Free Tool Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <h2>Why Use This Method?</h2>
            <p>
              This free online method is the easiest way to accomplish your task without downloading 
              expensive software like Adobe Acrobat ($22.99/month). Our tool works directly in your 
              browser and processes files locally for maximum privacy and security.
            </p>

            <h2>Step-by-Step Instructions</h2>
            <ol>
              <li>
                <strong>Open the Tool:</strong> Visit <Link href="/compress-pdf" className="text-indigo-600 hover:underline">Convertify's free tool</Link> in any web browser.
              </li>
              <li>
                <strong>Upload Your File:</strong> Click the upload button or drag and drop your file into the designated area.
              </li>
              <li>
                <strong>Process:</strong> The tool automatically processes your file in seconds using advanced algorithms.
              </li>
              <li>
                <strong>Download:</strong> Click download to save your result. No watermarks are added!
              </li>
            </ol>

            <h2>Benefits of Using Convertify</h2>
            <ul>
              <li>✅ <strong>100% Free</strong> - No hidden costs, trials, or subscriptions</li>
              <li>✅ <strong>No Software</strong> - Works in your browser, no installation</li>
              <li>✅ <strong>All Devices</strong> - Windows, Mac, iPhone, Android supported</li>
              <li>✅ <strong>Unlimited Use</strong> - No file size or usage limits</li>
              <li>✅ <strong>Private & Secure</strong> - Files processed locally, never uploaded</li>
              <li>✅ <strong>No Watermarks</strong> - Professional results every time</li>
            </ul>

            <h2>Common Questions</h2>
            <p>
              We've helped millions of users accomplish this task. Here are answers to the most 
              common questions we receive.
            </p>
          </div>
        </div>
      </section>

      {/* How To Schema Section */}
      <HowToSchema
        toolName="Compress PDF to 100KB - Government Form Ready"
        description="Reduce PDF file size to exactly 100KB for visa applications, passport forms, and government portals. Free online compressor."
        steps={howToSteps}
      />

      {/* FAQ Section */}
      <FAQSchema
        toolName="Compress PDF to 100KB - Government Form Ready"
        faqs={faqs}
      />

      {/* CTA Section */}
      <section className="w-full py-12 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Join millions of users who trust Convertify for their PDF needs.
          </p>
          <Link 
            href="/compress-pdf"
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Use Free Tool Now →
          </Link>
        </div>
      </section>
    </div>
  )
}

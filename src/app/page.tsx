import Link from "next/link";
import {
  FileStack,
  Scissors,
  Minimize2,
  Image as ImageIcon,
  FileImage,
  FileText,
  Sheet,
  Presentation,
  BookOpen
} from "lucide-react";
import { AdBanner } from "@/components/ads/banner";
import { blogPosts } from "@/lib/blog-data";

const tools = [
  {
    title: "Merge PDF",
    description: "Combine multiple PDFs into one.",
    icon: FileStack,
    color: "bg-red-100 text-red-600",
    href: "/merge-pdf",
  },
  {
    title: "Split PDF",
    description: "Separate pages from a PDF file.",
    icon: Scissors,
    color: "bg-blue-100 text-blue-600",
    href: "/split-pdf",
  },
  {
    title: "Compress PDF",
    description: "Reduce file size while keeping quality.",
    icon: Minimize2,
    color: "bg-green-100 text-green-600",
    href: "/compress-pdf",
  },
  {
    title: "JPG to PDF",
    description: "Turn your images into a PDF.",
    icon: ImageIcon,
    color: "bg-purple-100 text-purple-600",
    href: "/jpg-to-pdf",
  },
  {
    title: "PNG to PDF",
    description: "Convert PNG images to PDF.",
    icon: ImageIcon,
    color: "bg-emerald-100 text-emerald-600",
    href: "/png-to-pdf",
  },
  {
    title: "Word to PDF",
    description: "Make DOC and DOCX files easy to read.",
    icon: FileText,
    color: "bg-indigo-100 text-indigo-600",
    href: "/word-to-pdf",
  },
  {
    title: "Excel to PDF",
    description: "Convert Spreadsheets to PDF.",
    icon: Sheet,
    color: "bg-green-100 text-green-600",
    href: "/excel-to-pdf",
  },
  {
    title: "PowerPoint to PDF",
    description: "Convert PPTX presentations to PDF.",
    icon: Presentation,
    color: "bg-orange-100 text-orange-600",
    href: "/powerpoint-to-pdf",
  },
  {
    title: "Text to PDF",
    description: "Convert simple text files to PDF.",
    icon: FileText,
    color: "bg-slate-100 text-slate-600",
    href: "/text-to-pdf",
  },
  {
    title: "PDF to JPG",
    description: "Convert PDF pages to images.",
    icon: FileImage,
    color: "bg-yellow-100 text-yellow-600",
    href: "/pdf-to-jpg",
  },
  {
    title: "PDF to PNG",
    description: "Get high-quality PNGs from PDF.",
    icon: FileImage,
    color: "bg-cyan-100 text-cyan-600",
    href: "/pdf-to-png",
  },
  {
    title: "PDF to Text",
    description: "Extract text content from PDF.",
    icon: FileText,
    color: "bg-gray-100 text-gray-600",
    href: "/pdf-to-text",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full pt-12 pb-6 bg-gradient-to-b from-indigo-50 to-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-4">
          Every PDF Tool You Need
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-6">
          Simple, fast, and secure tools to manage your documents.
          Perfect for everyone, from students to pros.
        </p>
      </section>

      {/* Ad Section (High Visibility) */}
      <div className="w-full flex justify-center py-4 bg-white">
        <AdBanner variant="rectangle" />
      </div>

      {/* Tools Grid */}
      <section className="w-full max-w-6xl px-4 pt-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="group relative flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <div className={`p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-4 ${tool.color}`}>
                <tool.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {tool.title}
              </h3>
              <p className="text-slate-500 text-base">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Guides Section - NEW for SEO */}
      <section className="w-full max-w-6xl px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 flex items-center justify-center gap-2">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            Latest Guides & Tutorials
          </h2>
          <p className="text-slate-600">
            Learn how to get the most out of your PDF tools
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {blogPosts.slice(0, 6).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="text-xs text-indigo-600 font-semibold uppercase mb-2">
                  {post.category}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{post.readingTime} min read</span>
                  <span className="text-indigo-600 group-hover:text-indigo-700 font-medium">
                    Read Guide →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            View All Guides
            <BookOpen className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* How it Works (Simple) */}
      <section className="w-full bg-slate-50 py-16 text-center border-t">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold border-2 border-indigo-600 mb-4 shadow-sm">1</div>
              <h4 className="text-xl font-semibold mb-2">Choose a Tool</h4>
              <p className="text-slate-500">Select what you want to do with your file.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold border-2 border-indigo-600 mb-4 shadow-sm">2</div>
              <h4 className="text-xl font-semibold mb-2">Upload File</h4>
              <p className="text-slate-500">Pick your file from your computer or phone.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold border-2 border-indigo-600 mb-4 shadow-sm">3</div>
              <h4 className="text-xl font-semibold mb-2">Download</h4>
              <p className="text-slate-500">Get your processed file instantly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

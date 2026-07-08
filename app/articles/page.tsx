import { prisma } from "@/lib/prisma";
import { getArticleImage } from "@/lib/images";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 10;

export const metadata: Metadata = {
  title: "Blog & Travel Tips - ORTIZ Bali Car Rental",
  description: "Read the latest articles about Bali travel tips, driving guides, and car rental advice from ORTIZ, your trusted Bali car rental partner.",
  openGraph: {
    title: "Blog & Travel Tips - ORTIZ Bali Car Rental",
    description: "Bali travel tips, driving guides, and car rental advice.",
    type: "website",
  },
};

export default async function ArticlesPage() {
  let articles: any[] = [];
  try {
    articles = await prisma.article.findMany({
      where: { isPublished: true, publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: "desc" },
    });
  } catch (e) {
    console.log("DB not ready");
  }

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-dark">
            <i className="ri-steering-2-line text-gold text-2xl" />
            <span>DON&apos;T DREAM IT! <span className="text-gold">DRIVE IT!</span></span>
          </Link>
          <div className="hidden lg:flex space-x-6 font-medium text-sm text-gray-600">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <Link href="/#cars" className="hover:text-gold transition-colors">Cars</Link>
            <Link href="/articles" className="text-gold">Blog</Link>
            <Link href="/#contact" className="hover:text-gold transition-colors">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-dark text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-gold uppercase tracking-wider text-sm font-bold mb-3">Our Blog</p>
          <h1 className="text-4xl font-bold mb-4">Travel Tips &amp; Guides</h1>
          <p className="text-gray-300 leading-relaxed">Discover the best of Bali with our curated travel guides, driving tips, and insider recommendations to make your trip unforgettable.</p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-6">
          {articles.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <i className="ri-article-line text-5xl block mb-4" />
              <p>No articles published yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, i) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                >
                  {/* Image */}
                  <div className={`overflow-hidden bg-gray-100 ${i === 0 ? "h-72" : "h-48"}`}>
                    <img
                      src={getArticleImage(article)}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <i className="ri-calendar-line" />
                      <time>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : ""}</time>
                      <span className="mx-1">•</span>
                      <span>{Math.ceil(article.content.replace(/<[^>]*>/g, "").length / 1000)} min read</span>
                    </div>

                    {/* Title */}
                    <h2 className={`font-bold text-dark group-hover:text-gold transition-colors ${i === 0 ? "text-2xl mb-3" : "text-lg mb-2"}`}>
                      {article.title}
                    </h2>

                    {/* Excerpt */}
                    <p className={`text-gray-500 leading-relaxed ${i === 0 ? "text-base line-clamp-3" : "text-sm line-clamp-2"}`}>
                      {article.content.replace(/<[^>]*>/g, "").slice(0, i === 0 ? 200 : 120)}...
                    </p>

                    {/* Read more */}
                    <div className="mt-4 flex items-center text-gold text-sm font-semibold group-hover:gap-2 transition-all">
                      Read Article <i className="ri-arrow-right-line ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer mini */}
      <footer className="bg-darker text-gray-400 py-8 text-center text-sm">
        <Link href="/" className="text-gold hover:underline">← Back to ORTIZ Home</Link>
        <p className="mt-2">&copy; {new Date().getFullYear()} ORTIZ Bali Car Rental. All rights reserved.</p>
      </footer>
    </>
  );
}

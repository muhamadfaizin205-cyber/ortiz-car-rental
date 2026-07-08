import { prisma } from "@/lib/prisma";
import { getArticleImage } from "@/lib/images";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 10;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const article = await prisma.article.findUnique({ where: { slug: params.slug } });
    if (!article) return { title: "Article Not Found" };

    return {
      title: `${article.title} - ORTIZ Blog`,
      description: article.metaDescription || article.content.replace(/<[^>]*>/g, "").slice(0, 160),
      openGraph: {
        title: article.title,
        description: article.metaDescription || article.content.replace(/<[^>]*>/g, "").slice(0, 160),
        type: "article",
        publishedTime: article.publishedAt?.toISOString(),
        images: article.imagePath ? [{ url: article.imagePath }] : [],
      },
    };
  } catch {
    return { title: "Article - ORTIZ Blog" };
  }
}

export default async function ArticlePage({ params }: Props) {
  let article: any = null;
  let related: any[] = [];

  try {
    article = await prisma.article.findUnique({ where: { slug: params.slug } });
    if (!article || !article.isPublished) notFound();

    related = await prisma.article.findMany({
      where: { isPublished: true, slug: { not: params.slug }, publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });
  } catch {
    notFound();
  }

  const readTime = Math.max(1, Math.ceil(article.content.replace(/<[^>]*>/g, "").length / 1000));
  const publishDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

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

      {/* Article Hero Image */}
      <div className="w-full h-[50vh] min-h-[320px] max-h-[500px] relative bg-dark">
        <img
          src={getArticleImage(article)}
          alt={article.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent" />

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-3xl mx-auto">
            <Link href="/articles" className="text-gold text-sm font-medium hover:underline mb-4 inline-flex items-center gap-1">
              <i className="ri-arrow-left-line" /> All Articles
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mt-3">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-300 text-sm mt-4">
              <span className="flex items-center gap-1.5">
                <i className="ri-calendar-line text-gold" /> {publishDate}
              </span>
              <span className="flex items-center gap-1.5">
                <i className="ri-time-line text-gold" /> {readTime} min read
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          {/* Article body - clean typography */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-dark prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-gold prose-a:no-underline hover:prose-a:underline
              prose-strong:text-dark
              prose-img:rounded-xl prose-img:shadow-md
              prose-blockquote:border-gold prose-blockquote:bg-gold/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-xl
              prose-ul:text-gray-600 prose-ol:text-gray-600
              prose-li:mb-2"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Share & Tags */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Share this article</p>
                <div className="flex gap-2">
                  <a href={`https://wa.me/?text=${encodeURIComponent(article.title + " - ORTIZ Blog")}`} target="_blank"
                    className="w-10 h-10 rounded-full bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors">
                    <i className="ri-whatsapp-line text-lg" />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`} target="_blank"
                    className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 hover:bg-sky-100 flex items-center justify-center transition-colors">
                    <i className="ri-twitter-x-line text-lg" />
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(article.title)}`} target="_blank"
                    className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <i className="ri-facebook-fill text-lg" />
                  </a>
                </div>
              </div>
              <Link href="/articles" className="text-gold font-semibold text-sm hover:underline flex items-center gap-1">
                <i className="ri-arrow-left-line" /> Back to all articles
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="py-16 bg-light">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-dark mb-8 text-center">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(r => (
                <Link key={r.id} href={`/articles/${r.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100">
                  <div className="h-44 overflow-hidden bg-gray-100">
                    <img src={getArticleImage(r)} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-gray-400 mb-2">
                      {r.publishedAt ? new Date(r.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : ""}
                    </p>
                    <h3 className="font-bold text-dark group-hover:text-gold transition-colors line-clamp-2">{r.title}</h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{r.content.replace(/<[^>]*>/g, "").slice(0, 100)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="bg-dark text-white py-12">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-2xl font-bold mb-3">Ready to Explore Bali?</h2>
          <p className="text-gray-300 mb-6">Book your perfect rental car and start your unforgettable Bali adventure today.</p>
          <Link href="/#cars" className="inline-flex items-center bg-gold text-dark font-semibold px-8 py-3 rounded-xl hover:bg-yellow-500 transition-colors">
            <i className="ri-car-line mr-2" /> Browse Our Cars
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-darker text-gray-400 py-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} ORTIZ Bali Car Rental. All rights reserved.</p>
      </footer>
    </>
  );
}

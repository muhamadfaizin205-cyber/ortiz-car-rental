import Link from "next/link";

export default function ArticleNotFound() {
  return (
    <div className="min-h-screen bg-light flex flex-col">
      <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-dark">
            <i className="ri-steering-2-line text-gold text-2xl" />
            <span>ORTIZ</span>
          </Link>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <i className="ri-article-line text-6xl text-gray-300 block mb-4" />
          <h1 className="text-3xl font-bold text-dark mb-2">Article Not Found</h1>
          <p className="text-gray-400 mb-8">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/articles" className="bg-gold text-dark font-semibold px-6 py-3 rounded-xl hover:bg-yellow-500 transition-colors">
              Browse Articles
            </Link>
            <Link href="/" className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

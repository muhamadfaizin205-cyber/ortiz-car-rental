"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles").then(r => r.json()).then(d => { setArticles(d); setLoading(false); });
  }, []);

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    setArticles(articles.filter(a => a.id !== id));
  }

  async function togglePublish(id: number, current: boolean) {
    const res = await fetch(`/api/articles/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !current, publishedAt: !current ? new Date().toISOString() : null }),
    });
    if (res.ok) setArticles(articles.map(a => a.id === id ? { ...a, isPublished: !current } : a));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold text-dark">Articles</h1><p className="text-sm text-gray-400 mt-1">{articles.filter(a => a.isPublished).length} published, {articles.filter(a => !a.isPublished).length} drafts</p></div>
        <Link href="/admin/articles/new" className="bg-gold text-dark px-5 py-2.5 rounded-xl font-semibold hover:bg-yellow-500 flex items-center gap-2 shadow-sm">
          <i className="ri-add-circle-line text-lg" /> New Article
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400"><i className="ri-loader-4-line text-3xl animate-spin" /></div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <i className="ri-article-line text-4xl text-gray-300 block mb-3" />
          <p className="text-gray-400">No articles yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {articles.map(a => (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex">
              {/* Thumbnail */}
              <div className="w-36 min-h-full bg-gray-100 flex-shrink-0">
                {a.imagePath ? (
                  <img src={a.imagePath} alt={a.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300"><i className="ri-image-line text-2xl" /></div>
                )}
              </div>
              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-dark line-clamp-2">{a.title}</h3>
                  <button onClick={() => togglePublish(a.id, a.isPublished)}
                    className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${a.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {a.isPublished ? "Published" : "Draft"}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{a.content?.replace(/<[^>]*>/g, "")}</p>
                <div className="flex items-center justify-between mt-auto pt-3">
                  <span className="text-xs text-gray-400">{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("id-ID") : "No date"}</span>
                  <div className="flex gap-1">
                    <Link href={`/admin/articles/${a.id}`} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center"><i className="ri-pencil-line text-sm" /></Link>
                    <button onClick={() => handleDelete(a.id, a.title)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center"><i className="ri-delete-bin-line text-sm" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/reviews?all=true").then(r => r.json()).then(d => { setReviews(d); setLoading(false); });
  }, []);

  async function toggleApproval(id: number, current: boolean) {
    await fetch("/api/reviews", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, isApproved: !current }) });
    setReviews(reviews.map(r => r.id === id ? { ...r, is_approved: !current } : r));
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
    setReviews(reviews.filter(r => r.id !== id));
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.origin + "/review");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const filtered = filter === "all" ? reviews : filter === "approved" ? reviews.filter(r => r.is_approved) : reviews.filter(r => !r.is_approved);
  const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0";

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">Customer Reviews</h1>
          <p className="text-sm text-gray-400 mt-1">{reviews.length} reviews • {avgRating} avg rating</p>
        </div>
        <button onClick={copyLink} className="bg-gold text-dark px-5 py-2.5 rounded-xl font-semibold hover:bg-yellow-500 flex items-center gap-2 shadow-sm">
          <i className={copied ? "ri-check-line" : "ri-link"} /> {copied ? "Copied!" : "Copy Review Link"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button onClick={() => setFilter("all")} className={`p-4 rounded-xl border text-center transition-all ${filter === "all" ? "border-dark shadow-sm bg-white" : "border-gray-100 bg-white"}`}>
          <p className="text-2xl font-bold text-dark">{reviews.length}</p><p className="text-xs text-gray-400">Total</p>
        </button>
        <button onClick={() => setFilter("approved")} className={`p-4 rounded-xl border text-center transition-all ${filter === "approved" ? "border-green-400 shadow-sm bg-green-50" : "border-gray-100 bg-white"}`}>
          <p className="text-2xl font-bold text-green-600">{reviews.filter(r => r.is_approved).length}</p><p className="text-xs text-gray-400">Approved</p>
        </button>
        <button onClick={() => setFilter("pending")} className={`p-4 rounded-xl border text-center transition-all ${filter === "pending" ? "border-amber-400 shadow-sm bg-amber-50" : "border-gray-100 bg-white"}`}>
          <p className="text-2xl font-bold text-amber-600">{reviews.filter(r => !r.is_approved).length}</p><p className="text-xs text-gray-400">Pending</p>
        </button>
      </div>

      {/* Review link box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-center gap-3">
        <i className="ri-share-line text-blue-500 text-xl" />
        <div className="flex-1">
          <p className="text-sm text-blue-700 font-medium">Share this link with customers to collect reviews:</p>
          <code className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded mt-1 inline-block">{typeof window !== "undefined" ? window.location.origin : ""}/review</code>
        </div>
      </div>

      {/* Reviews list */}
      {loading ? (
        <div className="text-center py-16 text-gray-400"><i className="ri-loader-4-line text-3xl animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <i className="ri-star-line text-4xl text-gray-300 block mb-3" />
          <p className="text-gray-400">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(r => (
            <div key={r.id} className={`bg-white rounded-xl border p-5 transition-all ${r.is_approved ? "border-gray-100" : "border-amber-200 bg-amber-50/30"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                      {r.customer_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-dark">{r.customer_name}</p>
                      <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                  </div>
                  <p className="text-gold text-sm mb-2">{stars(r.rating)}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleApproval(r.id, r.is_approved)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${r.is_approved ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-amber-100 text-amber-700 hover:bg-amber-200"}`}>
                    {r.is_approved ? "✓ Approved" : "⏳ Pending"}
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center">
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

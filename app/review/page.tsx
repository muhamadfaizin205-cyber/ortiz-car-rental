"use client";
import { useState } from "react";
import Link from "next/link";

export default function ReviewPage() {
  const [form, setForm] = useState({ customerName: "", rating: 5, comment: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!form.customerName.trim() || !form.comment.trim()) {
      setError("Please fill in your name and review");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSuccess(true);
      else setError("Failed to submit. Please try again.");
    } catch {
      setError("Network error");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-dark">
            <i className="ri-steering-2-line text-gold text-2xl" />
            <span className="text-gold">ORTIZ</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gold">← Back to Home</Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-12">
        {success ? (
          /* Success state */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-check-line text-green-600 text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-dark mb-2">THANK YOU!</h1>
            <p className="text-gray-500 mb-6">Your review has been submitted and will appear on our website after approval.</p>
            <Link href="/" className="inline-flex items-center bg-gold text-dark font-semibold px-6 py-3 rounded-xl hover:bg-yellow-500 transition-colors">
              <i className="ri-home-line mr-2" /> Back to Homepage
            </Link>
          </div>
        ) : (
          /* Form */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-dark text-white p-6 text-center">
              <i className="ri-star-fill text-gold text-3xl" />
              <h1 className="text-2xl font-bold mt-2">RATE YOUR EXPERIENCE</h1>
              <p className="text-gray-300 text-sm mt-1">with ORTIZ Bali Car Rental</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="text-sm text-gray-600 block mb-1.5 font-medium">Your Name</label>
                <input
                  value={form.customerName}
                  onChange={e => setForm({ ...form, customerName: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-gold focus:outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>

              {/* Star Rating */}
              <div>
                <label className="text-sm text-gray-600 block mb-2 font-medium">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setForm({ ...form, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <i className={`text-3xl ${star <= form.rating ? "ri-star-fill text-gold" : "ri-star-line text-gray-300"}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-400 self-center">
                    {form.rating === 5 ? "Excellent!" : form.rating === 4 ? "Great!" : form.rating === 3 ? "Good" : form.rating === 2 ? "Fair" : "Poor"}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="text-sm text-gray-600 block mb-1.5 font-medium">Your Review</label>
                <textarea
                  value={form.comment}
                  onChange={e => setForm({ ...form, comment: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-gold focus:outline-none resize-none"
                  placeholder="Tell us about your experience with ORTIZ..."
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gold text-dark font-bold py-3.5 rounded-xl hover:bg-yellow-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><i className="ri-loader-4-line animate-spin" /> Submitting...</> : <><i className="ri-send-plane-fill" /> Submit Review</>}
              </button>

              <p className="text-xs text-gray-400 text-center">Your review will be visible after admin approval</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

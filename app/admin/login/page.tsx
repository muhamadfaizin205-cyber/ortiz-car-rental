"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        window.location.href = "/admin";
      } else {
        const data = await res.json();
        setError(data.error || "Invalid email or password");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-darker flex items-center justify-center px-4">
      <div className="bg-dark rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <i className="ri-steering-2-line text-gold text-4xl" />
          <h1 className="text-2xl font-bold text-white mt-3">ORTIZ <span className="text-gold">Admin</span></h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage your fleet</p>
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm block mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} className="w-full bg-darker border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none" placeholder="admin@ortiz.com" />
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} className="w-full bg-darker border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none" placeholder="••••••••" />
          </div>
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-gold text-dark font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

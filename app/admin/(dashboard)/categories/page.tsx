"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(d => { setCategories(d); setLoading(false); });
  }, []);

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}" and ALL cars in it?`)) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setCategories(categories.filter(c => c.id !== id));
  }

  const icons: Record<string, string> = { Luxury: "ri-vip-crown-line", Premium: "ri-star-line", City: "ri-building-line", Family: "ri-group-line" };
  const colors: Record<string, string> = { Luxury: "from-amber-500 to-orange-500", Premium: "from-blue-500 to-indigo-500", City: "from-green-500 to-emerald-500", Family: "from-purple-500 to-pink-500" };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold text-dark">Categories</h1><p className="text-sm text-gray-400 mt-1">Organize your fleet by type</p></div>
        <Link href="/admin/categories/new" className="bg-gold text-dark px-5 py-2.5 rounded-xl font-semibold hover:bg-yellow-500 transition-colors flex items-center gap-2 shadow-sm">
          <i className="ri-add-circle-line text-lg" /> Add Category
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400"><i className="ri-loader-4-line text-3xl animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className={`h-24 bg-gradient-to-r ${colors[cat.name] || "from-gray-500 to-gray-600"} flex items-center justify-center`}>
                <i className={`${icons[cat.name] || "ri-price-tag-line"} text-white text-4xl`} />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-dark">{cat.name}</h3>
                  <span className={`w-3 h-3 rounded-full ${cat.isActive ? "bg-green-400" : "bg-red-400"}`} title={cat.isActive ? "Active" : "Inactive"} />
                </div>
                <p className="text-sm text-gray-400 mb-4">{cat.description || "No description"}</p>
                <div className="flex items-center justify-between">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">{cat._count?.cars || 0} cars</span>
                  <div className="flex gap-1">
                    <Link href={`/admin/categories/${cat.id}`} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center"><i className="ri-pencil-line text-sm" /></Link>
                    <button onClick={() => handleDelete(cat.id, cat.name)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center"><i className="ri-delete-bin-line text-sm" /></button>
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

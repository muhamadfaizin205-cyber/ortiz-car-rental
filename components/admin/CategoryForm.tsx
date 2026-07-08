"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCarImage } from "@/lib/images";

export default function CategoryForm({ catId }: { catId?: string }) {
  const router = useRouter();
  const isEdit = !!catId && catId !== "new";
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(isEdit);
  const [cars, setCars] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", slug: "", description: "", isActive: true });

  useEffect(() => {
    if (isEdit) {
      fetch(`/api/categories/${catId}`)
        .then(r => r.json())
        .then(cat => {
          setForm({ name: cat.name, slug: cat.slug, description: cat.description || "", isActive: cat.isActive });
          setCars(cat.cars || []);
          setDataLoading(false);
        })
        .catch(() => setDataLoading(false));
    }
  }, [catId, isEdit]);

  function autoSlug(n: string) { return n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

  async function handleSubmit() {
    if (!form.name) { alert("Name is required"); return; }
    setLoading(true);
    const url = isEdit ? `/api/categories/${catId}` : "/api/categories";
    const method = isEdit ? "PUT" : "POST";
    const body = { ...form, slug: form.slug || autoSlug(form.name) };
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) window.location.href = "/admin/categories";
      else alert("Error: " + (await res.json()).error);
    } catch { alert("Network error"); }
    setLoading(false);
  }

  const ic = "w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:border-gold focus:ring-1 focus:ring-gold/30 focus:outline-none text-sm bg-white";

  const colors: Record<string, string> = { Luxury: "from-amber-500 to-orange-500", Premium: "from-blue-500 to-indigo-500", City: "from-green-500 to-emerald-500", Family: "from-purple-500 to-pink-500" };
  const gradientClass = colors[form.name] || "from-gray-500 to-gray-600";

  if (dataLoading) return <div className="text-center py-16 text-gray-400"><i className="ri-loader-4-line text-3xl animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">{isEdit ? "Edit Category" : "Add Category"}</h1>
        <button onClick={() => router.push("/admin/categories")} className="text-gray-500 hover:text-dark text-sm flex items-center gap-1"><i className="ri-arrow-left-line" /> Back</button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Form */}
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1 font-medium">Category Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: autoSlug(e.target.value) })} className={ic + " text-lg font-semibold"} placeholder="e.g. Luxury, Premium, City, Family" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1 font-medium">Slug</label>
              <div className="flex items-center text-sm text-gray-400">
                <span className="mr-1">category/</span>
                <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className={ic + " text-gray-500"} />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1 font-medium">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={ic} placeholder="Short description of this category..." />
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-12 h-7 rounded-full transition-colors relative ${form.isActive ? "bg-green-500" : "bg-gray-300"}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${form.isActive ? "right-1" : "left-1"}`} />
              </div>
              <div>
                <span className="text-sm font-medium block">{form.isActive ? "Active" : "Inactive"}</span>
                <span className="text-xs text-gray-400">{form.isActive ? "Shown on homepage" : "Hidden from homepage"}</span>
              </div>
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="hidden" />
            </label>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button onClick={handleSubmit} disabled={loading} className="bg-gold text-dark font-semibold px-8 py-3 rounded-xl hover:bg-yellow-500 disabled:opacity-50 flex items-center gap-2">
                {loading ? <><i className="ri-loader-4-line animate-spin" /> Saving...</> : <><i className={isEdit ? "ri-check-line" : "ri-add-line"} /> {isEdit ? "Update Category" : "Create Category"}</>}
              </button>
              <button onClick={() => router.push("/admin/categories")} className="border border-gray-200 text-gray-500 px-6 py-3 rounded-xl hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>

        {/* Preview sidebar */}
        <div className="space-y-5">
          {/* Category card preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-dark flex items-center gap-2 mb-4"><i className="ri-eye-line text-gold" /> Preview</h3>
            <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <div className={`h-20 bg-gradient-to-r ${gradientClass} flex items-center justify-center`}>
                <span className="text-white text-2xl font-bold">{form.name || "Category Name"}</span>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500">{form.description || "No description yet"}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">{cars.length} cars</span>
                  <span className={`w-3 h-3 rounded-full ${form.isActive ? "bg-green-400" : "bg-red-400"}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Cars in this category */}
          {isEdit && cars.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-dark flex items-center gap-2 mb-4"><i className="ri-car-line text-gold" /> Cars in {form.name}</h3>
              <div className="space-y-3">
                {cars.map((car: any) => (
                  <div key={car.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={getCarImage(car)} alt={car.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark truncate">{car.name}</p>
                      <p className="text-xs text-gray-400">Rp {car.price.toLocaleString("id-ID")}/{car.priceDuration}</p>
                    </div>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${car.isAvailable ? "bg-green-400" : "bg-red-400"}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Homepage integration info */}
          <div className="bg-gold/10 rounded-xl p-4 border border-gold/20">
            <p className="text-sm text-dark font-medium flex items-center gap-2"><i className="ri-information-line text-gold" /> Homepage Integration</p>
            <p className="text-xs text-gray-500 mt-1">This category {form.isActive ? "is visible" : "is hidden"} on the homepage. Cars in this category {form.isActive ? "appear in the carousel section" : "will not be shown"}.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

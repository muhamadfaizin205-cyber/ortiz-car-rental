"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";

export default function CarForm({ carId }: { carId?: string }) {
  const router = useRouter();
  const isEdit = !!carId && carId !== "new";
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    categoryId: "", name: "", slug: "", description: "", imagePath: "",
    seats: "4", fuelType: "Gasoline", transmission: "Automatic",
    price: "", priceDuration: "day", notes: "", isAvailable: true, sortOrder: "0",
  });

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(setCategories);
    if (isEdit) {
      fetch(`/api/cars/${carId}`).then(r => r.json()).then(car => {
        setForm({
          categoryId: String(car.categoryId || ""), name: car.name, slug: car.slug,
          description: car.description || "", imagePath: car.imagePath || "",
          seats: String(car.seats), fuelType: car.fuelType, transmission: car.transmission,
          price: String(car.price || ""), priceDuration: car.priceDuration,
          notes: car.notes || "", isAvailable: car.isAvailable, sortOrder: String(car.sortOrder || "0"),
        });
      });
    }
  }, [carId, isEdit]);

  function slug(n: string) { return n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm(f => ({ ...f, [name]: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function formatRupiah(val: string): string {
    const num = val.replace(/\D/g, "");
    if (!num) return "";
    return Number(num).toLocaleString("id-ID");
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    setForm(f => ({ ...f, price: raw }));
  }

  async function handleSubmit() {
    if (!form.name || !form.categoryId) { alert("Name and Category are required"); return; }
    setLoading(true);
    const url = isEdit ? `/api/cars/${carId}` : "/api/cars";
    const method = isEdit ? "PUT" : "POST";

    const payload = {
      ...form,
      slug: form.slug || slug(form.name),
      categoryId: Number(form.categoryId),
      seats: Number(form.seats) || 4,
      price: Number(form.price) || 0,
      sortOrder: Number(form.sortOrder) || 0,
    };

    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        const saved = await res.json();
        if (payload.imagePath && !saved.imagePath) {
          alert("Warning: Image was sent but not saved.");
        } else {
          window.location.href = "/admin/cars";
        }
      } else {
        const err = await res.json();
        alert("Error: " + (err.error || "Failed to save"));
      }
    } catch (e) { alert("Network error"); }
    setLoading(false);
  }

  const ic = "w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:border-gold focus:ring-1 focus:ring-gold/30 focus:outline-none text-sm bg-white";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">{isEdit ? "Edit Car" : "Add New Car"}</h1>
        <button onClick={() => router.push("/admin/cars")} className="text-gray-500 hover:text-dark text-sm flex items-center"><i className="ri-arrow-left-line mr-1" /> Back</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-600 block mb-1 font-medium">Category *</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} className={ic}>
                <option value={0}>Select category</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="text-sm text-gray-600 block mb-1 font-medium">Name *</label>
              <input name="name" value={form.name} onChange={e => { handleChange(e); setForm(f => ({ ...f, slug: slug(e.target.value) })); }} className={ic} />
            </div>
          </div>

          <div><label className="text-sm text-gray-600 block mb-1 font-medium">Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} className={ic + " text-gray-400"} />
          </div>

          <div><label className="text-sm text-gray-600 block mb-1 font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={ic} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-sm text-gray-600 block mb-1 font-medium">Seats</label>
              <input type="number" name="seats" value={form.seats} onChange={handleChange} onFocus={e => e.target.select()} min="1" max="20" className={ic} />
            </div>
            <div><label className="text-sm text-gray-600 block mb-1 font-medium">Fuel Type</label>
              <select name="fuelType" value={form.fuelType} onChange={handleChange} className={ic}>
                {["Gasoline","Diesel","Electric","Hybrid"].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div><label className="text-sm text-gray-600 block mb-1 font-medium">Transmission</label>
              <select name="transmission" value={form.transmission} onChange={handleChange} className={ic}>
                <option>Automatic</option><option>Manual</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-sm text-gray-600 block mb-1 font-medium">Price (Rp)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
                <input value={form.price ? formatRupiah(form.price) : ""} onChange={handlePriceChange} onFocus={e => e.target.select()} className={ic + " pl-10 text-right font-semibold"} placeholder="0" inputMode="numeric" />
              </div>
            </div>
            <div><label className="text-sm text-gray-600 block mb-1 font-medium">Duration</label>
              <select name="priceDuration" value={form.priceDuration} onChange={handleChange} className={ic}>
                <option value="day">Per Day</option><option value="12 hours">Per 12 Hours</option><option value="month">Per Month</option>
              </select>
            </div>
            <div><label className="text-sm text-gray-600 block mb-1 font-medium">Notes</label>
              <input name="notes" value={form.notes} onChange={handleChange} className={ic} placeholder="e.g. Include Driver" />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} className="w-4 h-4 accent-gold" />
              <span className="text-sm font-medium">Available for Booking</span>
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 font-medium">Sort</label>
              <input type="number" name="sortOrder" value={form.sortOrder} onChange={handleChange} onFocus={e => e.target.select()} className="border border-gray-200 rounded-lg px-3 py-1.5 w-20 text-sm" />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button onClick={handleSubmit} disabled={loading} className="bg-gold text-dark font-semibold px-8 py-2.5 rounded-lg hover:bg-yellow-500 disabled:opacity-50 flex items-center">
              {loading ? <><i className="ri-loader-4-line animate-spin mr-2" />Saving...</> : isEdit ? "Update Car" : "Create Car"}
            </button>
            <button onClick={() => router.push("/admin/cars")} className="border border-gray-200 text-gray-500 px-6 py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </div>

        {/* Image sidebar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <ImageUpload
            value={form.imagePath}
            onChange={(url) => setForm(f => ({ ...f, imagePath: url }))}
            width={800}
            height={450}
          />
        </div>
      </div>
    </div>
  );
}

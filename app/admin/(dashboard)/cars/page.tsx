"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminCarsPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/cars").then(r => r.json()).then(d => { setCars(d); setLoading(false); });
  }, []);

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/cars/${id}`, { method: "DELETE" });
    if (res.ok) setCars(cars.filter(c => c.id !== id));
  }

  async function toggleAvailability(id: number, current: boolean) {
    const res = await fetch(`/api/cars/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !current }),
    });
    if (res.ok) {
      setCars(cars.map(c => c.id === id ? { ...c, isAvailable: !current } : c));
    }
  }

  const categories = Array.from(new Set(cars.map(c => c.category?.name).filter(Boolean))) as string[];
  const filtered = filter === "all" ? cars : cars.filter(c => c.category?.name === filter);

  const catColor: Record<string, string> = {
    Luxury: "bg-amber-100 text-amber-700",
    Premium: "bg-blue-100 text-blue-700",
    City: "bg-green-100 text-green-700",
    Family: "bg-purple-100 text-purple-700",
  };

  function fmtPrice(n: number) { return "Rp " + n.toLocaleString("id-ID"); }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">Fleet Management</h1>
          <p className="text-sm text-gray-400 mt-1">{cars.length} cars total</p>
        </div>
        <Link href="/admin/cars/new" className="bg-gold text-dark px-5 py-2.5 rounded-xl font-semibold hover:bg-yellow-500 transition-colors flex items-center gap-2 shadow-sm">
          <i className="ri-add-circle-line text-lg" /> Add New Car
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === "all" ? "bg-dark text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-gold"}`}>
          All ({cars.length})
        </button>
        {categories.map(cat => {
          const count = cars.filter(c => c.category?.name === cat).length;
          return (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === cat ? "bg-dark text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-gold"}`}>
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Car Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-400"><i className="ri-loader-4-line text-3xl animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <i className="ri-car-line text-4xl text-gray-300 block mb-3" />
          <p className="text-gray-400">No cars found</p>
          <Link href="/admin/cars/new" className="text-gold hover:underline text-sm mt-2 inline-block">Add your first car</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(car => (
            <div key={car.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              {/* Image */}
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                {car.imagePath ? (
                  <img src={car.imagePath} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <i className="ri-image-line text-4xl" />
                  </div>
                )}
                {/* Category badge */}
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${catColor[car.category?.name] || "bg-gray-100 text-gray-600"}`}>
                  {car.category?.name}
                </span>
                {/* Availability toggle */}
                <button
                  onClick={() => toggleAvailability(car.id, car.isAvailable)}
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${car.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                >
                  {car.isAvailable ? "● Available" : "● Unavailable"}
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-dark">{car.name}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{car.description}</p>

                {/* Specs row */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                  <span className="flex items-center gap-1"><i className="ri-user-3-line text-gold" /> {car.seats}</span>
                  <span className="flex items-center gap-1"><i className="ri-gas-station-line text-gold" /> {car.fuelType}</span>
                  <span className="flex items-center gap-1"><i className="ri-settings-3-line text-gold" /> {car.transmission}</span>
                </div>

                {/* Price + Actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                  <div>
                    <span className="text-gold font-bold text-lg">{fmtPrice(car.price)}</span>
                    <span className="text-gray-400 text-xs"> / {car.priceDuration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/admin/cars/${car.id}`} className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors" title="Edit">
                      <i className="ri-pencil-line" />
                    </Link>
                    <button onClick={() => handleDelete(car.id, car.name)} className="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors" title="Delete">
                      <i className="ri-delete-bin-line" />
                    </button>
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

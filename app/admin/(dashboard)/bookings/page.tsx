"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetch("/api/bookings").then(r => r.json()).then(d => { setBookings(d); setLoading(false); });
  }, []);

  async function updateStatus(id: number, status: string) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this booking?")) return;
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    setBookings(bookings.filter(b => b.id !== id));
  }

  const filtered = statusFilter === "all" ? bookings : bookings.filter(b => b.status === statusFilter);
  const statusCount = (s: string) => bookings.filter(b => b.status === s).length;

  const sc: Record<string, { bg: string; text: string; icon: string }> = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", icon: "ri-time-line" },
    confirmed: { bg: "bg-blue-50", text: "text-blue-700", icon: "ri-check-line" },
    active: { bg: "bg-green-50", text: "text-green-700", icon: "ri-car-line" },
    completed: { bg: "bg-gray-50", text: "text-gray-600", icon: "ri-checkbox-circle-line" },
    cancelled: { bg: "bg-red-50", text: "text-red-600", icon: "ri-close-circle-line" },
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold text-dark">Bookings</h1><p className="text-sm text-gray-400 mt-1">{bookings.length} total bookings</p></div>
        <Link href="/admin/bookings/new" className="bg-gold text-dark px-5 py-2.5 rounded-xl font-semibold hover:bg-yellow-500 flex items-center gap-2 shadow-sm">
          <i className="ri-add-circle-line text-lg" /> Add Booking
        </Link>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {Object.entries(sc).map(([status, style]) => (
          <button key={status} onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
            className={`p-4 rounded-xl border transition-all ${statusFilter === status ? "border-dark shadow-sm" : "border-gray-100"} ${style.bg}`}>
            <div className="flex items-center gap-2">
              <i className={`${style.icon} ${style.text} text-lg`} />
              <span className={`text-2xl font-bold ${style.text}`}>{statusCount(status)}</span>
            </div>
            <p className={`text-xs font-medium mt-1 capitalize ${style.text}`}>{status}</p>
          </button>
        ))}
      </div>

      {/* Bookings list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100"><tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Code</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Customer</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Car</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Dates</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Total</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="text-center py-12 text-gray-400"><i className="ri-loader-4-line animate-spin text-2xl" /></td></tr> :
              filtered.length === 0 ? <tr><td colSpan={7} className="text-center py-12 text-gray-400">No bookings</td></tr> :
              filtered.map(b => (
                <tr key={b.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-4 font-mono font-bold text-dark">{b.bookingCode}</td>
                  <td className="px-5 py-4"><div className="font-medium">{b.customerName}</div><div className="text-xs text-gray-400">{b.customerPhone}</div></td>
                  <td className="px-5 py-4 text-gray-600">{b.car?.name}</td>
                  <td className="px-5 py-4 text-xs text-gray-500">{new Date(b.pickupDate).toLocaleDateString("id-ID")}<br/>{new Date(b.returnDate).toLocaleDateString("id-ID")}</td>
                  <td className="px-5 py-4 font-semibold text-dark">Rp {b.totalPrice.toLocaleString("id-ID")}</td>
                  <td className="px-5 py-4">
                    <select value={b.status} onChange={e => updateStatus(b.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border-0 cursor-pointer ${sc[b.status]?.bg} ${sc[b.status]?.text}`}>
                      {Object.keys(sc).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <Link href={`/admin/bookings/${b.id}`} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center"><i className="ri-pencil-line text-sm" /></Link>
                      <button onClick={() => handleDelete(b.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center"><i className="ri-delete-bin-line text-sm" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingForm({ bookingId }: { bookingId?: string }) {
  const router = useRouter();
  const isEdit = !!bookingId && bookingId !== "new";
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    carId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
    totalPrice: "",
    status: "pending",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/cars").then(r => r.json()).then(setCars);
    if (isEdit) {
      fetch("/api/bookings").then(r => r.json()).then(bks => {
        const b = bks.find((x: any) => x.id === parseInt(bookingId!));
        if (b) setForm({
          carId: String(b.carId),
          customerName: b.customerName,
          customerEmail: b.customerEmail || "",
          customerPhone: b.customerPhone,
          pickupDate: new Date(b.pickupDate).toISOString().slice(0, 16),
          returnDate: new Date(b.returnDate).toISOString().slice(0, 16),
          pickupLocation: b.pickupLocation || "",
          totalPrice: String(b.totalPrice || ""),
          status: b.status,
          notes: b.notes || "",
        });
      });
    }
  }, [bookingId, isEdit]);

  function formatRupiah(val: string): string {
    const num = val.replace(/\D/g, "");
    if (!num) return "";
    return Number(num).toLocaleString("id-ID");
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    setForm(f => ({ ...f, totalPrice: raw }));
  }

  async function handleSubmit() {
    if (!form.customerName || !form.carId || !form.pickupDate || !form.returnDate) {
      alert("Please fill in customer name, car, pickup & return dates");
      return;
    }
    setLoading(true);
    const url = isEdit ? `/api/bookings/${bookingId}` : "/api/bookings";
    const method = isEdit ? "PUT" : "POST";
    const payload = {
      ...form,
      carId: Number(form.carId),
      totalPrice: Number(form.totalPrice) || 0,
    };
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) window.location.href = "/admin/bookings";
      else alert("Error: " + (await res.json()).error);
    } catch { alert("Network error"); }
    setLoading(false);
  }

  const ic = "w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:border-gold focus:ring-1 focus:ring-gold/30 focus:outline-none text-sm bg-white";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">{isEdit ? "Edit Booking" : "Add Booking"}</h1>
        <button onClick={() => router.push("/admin/bookings")} className="text-gray-500 hover:text-dark text-sm flex items-center gap-1"><i className="ri-arrow-left-line" /> Back</button>
      </div>

      <div className="max-w-3xl space-y-5">
        {/* Car & Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2"><i className="ri-car-line text-gold" /> Booking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1 font-medium">Car *</label>
              <select value={form.carId} onChange={e => setForm({ ...form, carId: e.target.value })} className={ic}>
                <option value="">Select car</option>
                {cars.map((c: any) => <option key={c.id} value={c.id}>{c.name} — Rp {c.price.toLocaleString("id-ID")}/{c.priceDuration}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1 font-medium">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={ic}>
                {["pending", "confirmed", "active", "completed", "cancelled"].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2"><i className="ri-user-line text-gold" /> Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1 font-medium">Name *</label>
              <input value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} className={ic} placeholder="John Doe" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1 font-medium">Phone *</label>
              <input value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} className={ic} placeholder="08123456789" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1 font-medium">Email</label>
              <input type="email" value={form.customerEmail} onChange={e => setForm({ ...form, customerEmail: e.target.value })} className={ic} placeholder="john@email.com" />
            </div>
          </div>
        </div>

        {/* Rental Period */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2"><i className="ri-calendar-line text-gold" /> Rental Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1 font-medium">Pickup Date *</label>
              <input type="datetime-local" value={form.pickupDate} onChange={e => setForm({ ...form, pickupDate: e.target.value })} className={ic} />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1 font-medium">Return Date *</label>
              <input type="datetime-local" value={form.returnDate} onChange={e => setForm({ ...form, returnDate: e.target.value })} className={ic} />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1 font-medium">Pickup Location</label>
              <input value={form.pickupLocation} onChange={e => setForm({ ...form, pickupLocation: e.target.value })} className={ic} placeholder="e.g. Ngurah Rai Airport" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1 font-medium">Total Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">Rp</span>
                <input
                  value={form.totalPrice ? formatRupiah(form.totalPrice) : ""}
                  onChange={handlePriceChange}
                  onFocus={e => e.target.select()}
                  className={ic + " pl-10 text-right font-semibold"}
                  placeholder="0"
                  inputMode="numeric"
                />
              </div>
              {form.totalPrice && <p className="text-xs text-gray-400 mt-1 text-right">Rp {formatRupiah(form.totalPrice)}</p>}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2"><i className="ri-sticky-note-line text-gold" /> Notes</h3>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className={ic} placeholder="Additional notes..." />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={handleSubmit} disabled={loading}
            className="bg-gold text-dark font-semibold px-8 py-3 rounded-xl hover:bg-yellow-500 disabled:opacity-50 flex items-center gap-2">
            {loading ? <><i className="ri-loader-4-line animate-spin" /> Saving...</> : <><i className={isEdit ? "ri-check-line" : "ri-add-line"} /> {isEdit ? "Update Booking" : "Create Booking"}</>}
          </button>
          <button onClick={() => router.push("/admin/bookings")} className="border border-gray-200 text-gray-500 px-6 py-3 rounded-xl hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let totalCars = 0, activeCars = 0, pendingBookings = 0, totalArticles = 0;
  let totalRevenue = { _sum: { totalPrice: 0 } } as any;
  let latestBookings: any[] = [];

  try {
    [totalCars, activeCars, pendingBookings, totalArticles, totalRevenue, latestBookings] = await Promise.all([
      prisma.car.count(),
      prisma.car.count({ where: { isAvailable: true } }),
      prisma.booking.count({ where: { status: "pending" } }),
      prisma.article.count({ where: { isPublished: true } }),
      prisma.booking.aggregate({ where: { status: { in: ["confirmed", "active", "completed"] } }, _sum: { totalPrice: true } }),
      prisma.booking.findMany({ include: { car: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    ]);
  } catch (e) {
    console.log("DB not ready yet");
  }

  const stats = [
    { label: "Total Cars", value: totalCars, sub: `Active: ${activeCars}`, icon: "ri-car-line", color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Pending Bookings", value: pendingBookings, sub: "Needs confirmation", icon: "ri-time-line", color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Revenue", value: `Rp ${(totalRevenue._sum.totalPrice || 0).toLocaleString("id-ID")}`, sub: "From confirmed bookings", icon: "ri-money-dollar-circle-line", color: "text-green-500", bg: "bg-green-50" },
    { label: "Published Articles", value: totalArticles, sub: "Total published", icon: "ri-article-line", color: "text-purple-500", bg: "bg-purple-50" },
  ];

  const statusColor: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    active: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{s.label}</span>
              <div className={`${s.bg} ${s.color} p-2 rounded-lg`}><i className={`${s.icon} text-xl`} /></div>
            </div>
            <div className="text-2xl font-bold text-dark">{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100"><h2 className="font-bold text-dark">Latest Bookings</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Code</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Customer</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Car</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Total</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
            </tr></thead>
            <tbody>
              {latestBookings.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No bookings yet</td></tr>
              ) : latestBookings.map((b) => (
                <tr key={b.id} className="border-t border-gray-50">
                  <td className="px-6 py-4 font-mono font-bold">{b.bookingCode}</td>
                  <td className="px-6 py-4">{b.customerName}</td>
                  <td className="px-6 py-4">{b.car.name}</td>
                  <td className="px-6 py-4">Rp {b.totalPrice.toLocaleString("id-ID")}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[b.status] || ""}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

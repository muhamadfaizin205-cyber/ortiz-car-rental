"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: "ri-dashboard-line" },
  { href: "/admin/site-editor", label: "Site Editor", icon: "ri-palette-line" },
  { href: "/admin/categories", label: "Categories", icon: "ri-price-tag-3-line" },
  { href: "/admin/cars", label: "Cars", icon: "ri-car-line" },
  { href: "/admin/articles", label: "Articles", icon: "ri-article-line" },
  { href: "/admin/bookings", label: "Bookings", icon: "ri-calendar-check-line" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <aside className="w-64 bg-darker text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-gray-700">
        <Link href="/admin" className="flex items-center space-x-2">
          <i className="ri-steering-2-line text-gold text-2xl" />
          <span className="font-bold text-lg">ORTIZ <span className="text-gold">Admin</span></span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                active ? "bg-gold/20 text-gold" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <i className={`${link.icon} text-lg`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700 space-y-2">
        <Link href="/" className="flex items-center space-x-2 text-gray-400 hover:text-white text-sm px-4 py-2">
          <i className="ri-external-link-line" /><span>View Site</span>
        </Link>
        <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-400 hover:text-red-400 text-sm px-4 py-2 w-full">
          <i className="ri-logout-box-line" /><span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

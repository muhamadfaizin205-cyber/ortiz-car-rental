"use client";
import { useState } from "react";

const links = [
  { href: "#", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#cars", label: "Cars" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  function handleClick(href: string) {
    setOpen(false);
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <>
      {/* Top info bar — hidden on mobile */}
      <div className="bg-darker text-gray-300 text-xs py-1.5 px-6 hidden sm:flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><i className="ri-phone-line text-gold" /> 082140560055</span>
          <span className="flex items-center gap-1.5"><i className="ri-mail-line text-gold" /> ortiz@gmail.com</span>
        </div>
        <div className="flex items-center gap-1.5">
          <i className="ri-map-pin-line text-gold" />
          <span>Jalan Taman Sari 100, Kelan, Bali</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button onClick={() => handleClick("#")} className="flex items-center gap-2 text-lg font-bold text-dark">
              <i className="ri-steering-2-line text-gold text-2xl" />
              <span className="hidden sm:inline">DON&apos;T DREAM IT! <span className="text-gold">DRIVE IT!</span></span>
              <span className="sm:hidden text-gold">ORTIZ</span>
            </button>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-6 font-medium text-sm text-gray-600">
              {links.map(l => (
                <button key={l.label} onClick={() => handleClick(l.href)} className="hover:text-gold transition-colors">
                  {l.label}
                </button>
              ))}
              <a href="https://wa.me/6282140560055" target="_blank" className="bg-gold text-dark font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors text-xs flex items-center gap-1.5">
                <i className="ri-whatsapp-line" /> WhatsApp
              </a>
            </div>

            {/* Mobile: WhatsApp + Hamburger */}
            <div className="flex items-center gap-3 lg:hidden">
              <a href="https://wa.me/6282140560055" target="_blank" className="bg-gold text-dark w-9 h-9 rounded-lg flex items-center justify-center">
                <i className="ri-whatsapp-line text-lg" />
              </a>
              <button onClick={() => setOpen(!open)} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-dark hover:bg-gray-50">
                <i className={`${open ? "ri-close-line" : "ri-menu-line"} text-xl`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-4">
            {links.map(l => (
              <button
                key={l.label}
                onClick={() => handleClick(l.href)}
                className="block w-full text-left py-3 text-sm font-medium text-gray-600 hover:text-gold border-b border-gray-50 transition-colors"
              >
                {l.label}
              </button>
            ))}
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><i className="ri-phone-line text-gold" /> 082140560055</span>
              <span className="flex items-center gap-1"><i className="ri-mail-line text-gold" /> ortiz@gmail.com</span>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

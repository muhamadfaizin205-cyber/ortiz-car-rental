"use client";
import { useEffect, useState } from "react";
import { DEFAULT_SETTINGS, SiteSettings } from "@/lib/settings";

export default function SiteEditorPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("brand");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => { setSettings(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    else alert("Error saving");
    setSaving(false);
  }

  function update(section: keyof SiteSettings, key: string, value: string) {
    setSettings(s => ({ ...s, [section]: { ...s[section], [key]: value } }));
  }

  const ic = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-gold focus:outline-none bg-white";
  const lb = "text-xs text-gray-500 block mb-1 font-medium";

  const sections = [
    { id: "brand", label: "Brand", icon: "ri-store-2-line" },
    { id: "hero", label: "Hero Banner", icon: "ri-landscape-line" },
    { id: "about", label: "About Us", icon: "ri-information-line" },
    { id: "safety", label: "Safety", icon: "ri-shield-check-line" },
    { id: "contact", label: "Contact", icon: "ri-map-pin-line" },
    { id: "colors", label: "Colors", icon: "ri-palette-line" },
  ];

  if (loading) return <div className="flex items-center justify-center h-96 text-gray-400"><i className="ri-loader-4-line text-3xl animate-spin" /></div>;

  return (
    <div className="h-[calc(100vh-48px)] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-dark">Site Editor</h1>
          <p className="text-sm text-gray-400">Edit homepage content and see changes in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-green-600 text-sm flex items-center gap-1"><i className="ri-check-line" /> Saved!</span>}
          <button onClick={handleSave} disabled={saving} className="bg-gold text-dark font-semibold px-6 py-2.5 rounded-xl hover:bg-yellow-500 disabled:opacity-50 flex items-center gap-2">
            {saving ? <><i className="ri-loader-4-line animate-spin" /> Saving...</> : <><i className="ri-save-line" /> Save Changes</>}
          </button>
        </div>
      </div>

      {/* Main layout: editor + preview */}
      <div className="flex gap-4 flex-1 min-h-0">

        {/* Left: Section tabs + fields */}
        <div className="w-80 flex-shrink-0 flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Section tabs */}
          <div className="flex flex-wrap gap-1 p-3 border-b border-gray-100 bg-gray-50">
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${activeSection === s.id ? "bg-gold text-dark" : "text-gray-500 hover:bg-gray-200"}`}>
                <i className={s.icon} /> {s.label}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">

            {activeSection === "brand" && <>
              <div><label className={lb}>Business Name</label><input value={settings.brand.name} onChange={e => update("brand", "name", e.target.value)} className={ic} /></div>
              <div><label className={lb}>Tagline</label><input value={settings.brand.tagline} onChange={e => update("brand", "tagline", e.target.value)} className={ic} /></div>
              <div><label className={lb}>Tagline Highlight</label><input value={settings.brand.taglineHighlight} onChange={e => update("brand", "taglineHighlight", e.target.value)} className={ic} /></div>
              <div><label className={lb}>Phone</label><input value={settings.brand.phone} onChange={e => update("brand", "phone", e.target.value)} className={ic} /></div>
              <div><label className={lb}>Email</label><input value={settings.brand.email} onChange={e => update("brand", "email", e.target.value)} className={ic} /></div>
              <div><label className={lb}>WhatsApp (with country code)</label><input value={settings.brand.whatsapp} onChange={e => update("brand", "whatsapp", e.target.value)} className={ic} /></div>
              <div><label className={lb}>Instagram</label><input value={settings.brand.instagram} onChange={e => update("brand", "instagram", e.target.value)} className={ic} /></div>
              <div><label className={lb}>TikTok</label><input value={settings.brand.tiktok} onChange={e => update("brand", "tiktok", e.target.value)} className={ic} /></div>
            </>}

            {activeSection === "hero" && <>
              <div><label className={lb}>Title</label><input value={settings.hero.title} onChange={e => update("hero", "title", e.target.value)} className={ic + " text-lg font-bold"} /></div>
              <div><label className={lb}>Title Highlight</label><input value={settings.hero.titleHighlight} onChange={e => update("hero", "titleHighlight", e.target.value)} className={ic + " text-lg font-bold"} style={{ color: settings.colors.primary }} /></div>
              <div><label className={lb}>Subtitle</label><textarea value={settings.hero.subtitle} onChange={e => update("hero", "subtitle", e.target.value)} rows={4} className={ic} /></div>
            </>}

            {activeSection === "about" && <>
              <div><label className={lb}>Section Title</label><input value={settings.about.title} onChange={e => update("about", "title", e.target.value)} className={ic} /></div>
              <div><label className={lb}>Paragraph 1</label><textarea value={settings.about.p1} onChange={e => update("about", "p1", e.target.value)} rows={3} className={ic} /></div>
              <div><label className={lb}>Paragraph 2</label><textarea value={settings.about.p2} onChange={e => update("about", "p2", e.target.value)} rows={3} className={ic} /></div>
              <div><label className={lb}>Paragraph 3</label><textarea value={settings.about.p3} onChange={e => update("about", "p3", e.target.value)} rows={3} className={ic} /></div>
            </>}

            {activeSection === "safety" && <>
              <div><label className={lb}>Title</label><input value={settings.safety.title} onChange={e => update("safety", "title", e.target.value)} className={ic} /></div>
              <div><label className={lb}>Title Highlight</label><input value={settings.safety.titleHighlight} onChange={e => update("safety", "titleHighlight", e.target.value)} className={ic} /></div>
              <div><label className={lb}>Description</label><textarea value={settings.safety.description} onChange={e => update("safety", "description", e.target.value)} rows={4} className={ic} /></div>
            </>}

            {activeSection === "contact" && <>
              <div><label className={lb}>Section Title</label><input value={settings.contact.title} onChange={e => update("contact", "title", e.target.value)} className={ic} /></div>
              <div><label className={lb}>Subtitle</label><textarea value={settings.contact.subtitle} onChange={e => update("contact", "subtitle", e.target.value)} rows={2} className={ic} /></div>
              <div><label className={lb}>Full Address</label><textarea value={settings.contact.address} onChange={e => update("contact", "address", e.target.value)} rows={2} className={ic} /></div>
            </>}

            {activeSection === "colors" && <>
              <div><label className={lb}>Primary / Gold</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={settings.colors.primary} onChange={e => update("colors", "primary", e.target.value)} className="w-10 h-10 rounded border-0 cursor-pointer" />
                  <input value={settings.colors.primary} onChange={e => update("colors", "primary", e.target.value)} className={ic} />
                </div>
              </div>
              <div><label className={lb}>Dark Background</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={settings.colors.dark} onChange={e => update("colors", "dark", e.target.value)} className="w-10 h-10 rounded border-0 cursor-pointer" />
                  <input value={settings.colors.dark} onChange={e => update("colors", "dark", e.target.value)} className={ic} />
                </div>
              </div>
              <div><label className={lb}>Darker Background</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={settings.colors.darker} onChange={e => update("colors", "darker", e.target.value)} className="w-10 h-10 rounded border-0 cursor-pointer" />
                  <input value={settings.colors.darker} onChange={e => update("colors", "darker", e.target.value)} className={ic} />
                </div>
              </div>
            </>}
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2 flex-shrink-0">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="text-xs text-gray-400 ml-2 font-mono">ortiz-car-rental.vercel.app</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {/* Mini preview of homepage */}
            <div style={{ fontSize: "11px", lineHeight: "1.4" }}>

              {/* Top bar preview */}
              <div style={{ background: settings.colors.darker }} className="text-gray-300 px-3 py-1 flex justify-between items-center">
                <span style={{ color: settings.colors.primary }}>{settings.brand.phone}</span>
                <span>{settings.brand.email}</span>
              </div>

              {/* Navbar preview */}
              <div className="bg-white px-3 py-2 border-b flex justify-between items-center">
                <span className="font-bold text-dark">{settings.brand.tagline} <span style={{ color: settings.colors.primary }}>{settings.brand.taglineHighlight}</span></span>
                <div className="flex gap-2 text-gray-400" style={{ fontSize: "9px" }}>
                  <span>Home</span><span>About</span><span>Cars</span><span>Blog</span><span>Contact</span>
                </div>
              </div>

              {/* Hero preview */}
              <div className="hero-bg text-white text-center py-10 px-4">
                <h2 className="text-2xl font-bold">{settings.hero.title} <span style={{ color: settings.colors.primary }}>{settings.hero.titleHighlight}</span></h2>
                <p className="text-gray-300 mt-2 mx-auto" style={{ maxWidth: "400px", fontSize: "10px" }}>{settings.hero.subtitle}</p>
                <div className="flex gap-2 justify-center mt-3">
                  <span style={{ background: settings.colors.primary }} className="px-3 py-1 rounded text-dark font-bold" >Book Now</span>
                  <span className="px-3 py-1 rounded border border-white">Our Location</span>
                </div>
              </div>

              {/* About preview */}
              <div className="py-6 px-4">
                <h3 className="font-bold text-lg mb-2">{settings.about.title}</h3>
                <p className="text-gray-500 mb-1">{settings.about.p1?.slice(0, 80)}...</p>
                <p className="text-gray-500 mb-1">{settings.about.p2?.slice(0, 80)}...</p>
              </div>

              {/* Car section preview placeholder */}
              <div className="bg-gray-50 py-4 px-4">
                <h3 className="font-bold mb-2">LUXURY CAR PRICE LIST</h3>
                <div className="flex gap-2 overflow-hidden">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-28 flex-shrink-0 bg-white rounded-lg border border-dashed p-2" style={{ borderColor: settings.colors.primary + "66" }}>
                      <div className="w-full h-12 bg-gray-200 rounded mb-1" />
                      <div className="h-2 bg-gray-200 rounded w-3/4 mb-1" />
                      <div className="h-2 rounded w-1/2" style={{ background: settings.colors.primary }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety preview */}
              <div style={{ background: settings.colors.dark }} className="text-white py-6 px-4 flex">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{settings.safety.title}<br/><span style={{ color: settings.colors.primary }}>{settings.safety.titleHighlight}</span></h3>
                  <p className="text-gray-300 mt-1" style={{ fontSize: "10px" }}>{settings.safety.description?.slice(0, 100)}...</p>
                </div>
                <div className="w-24 h-16 bg-gray-600 rounded ml-3 flex-shrink-0" />
              </div>

              {/* Contact preview */}
              <div className="py-6 px-4">
                <h3 className="font-bold text-lg mb-1">{settings.contact.title}</h3>
                <p className="text-gray-400 mb-2" style={{ fontSize: "10px" }}>{settings.contact.subtitle}</p>
                <div className="space-y-1">
                  <p className="flex items-center gap-1"><span style={{ color: settings.colors.primary }}>📍</span> {settings.contact.address?.slice(0, 50)}...</p>
                  <p className="flex items-center gap-1"><span className="text-green-500">💬</span> {settings.brand.phone}</p>
                  <p className="flex items-center gap-1"><span className="text-pink-500">📷</span> {settings.brand.instagram}</p>
                </div>
              </div>

              {/* Footer preview */}
              <div style={{ background: settings.colors.darker }} className="text-gray-400 py-4 px-4">
                <span className="font-bold text-white">{settings.brand.tagline} <span style={{ color: settings.colors.primary }}>{settings.brand.taglineHighlight}</span></span>
                <p className="mt-1" style={{ fontSize: "9px" }}>ORTIZ Bali Car Rental</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

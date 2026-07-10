"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { DEFAULT_SETTINGS, SiteSettings } from "@/lib/settings";

export default function SiteEditorPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("brand");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [iframeKey, setIframeKey] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => { setSettings({ ...DEFAULT_SETTINGS, ...d }); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const autoSave = useCallback((newSettings: SiteSettings) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("idle");
    timerRef.current = setTimeout(async () => {
      setStatus("saving");
      try {
        const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newSettings) });
        if (res.ok) {
          setStatus("saved");
          setIframeKey(k => k + 1); // reload preview
          setTimeout(() => setStatus("idle"), 2000);
        } else { setStatus("error"); }
      } catch { setStatus("error"); }
    }, 1500);
  }, []);

  function update(section: keyof SiteSettings, key: string, value: string) {
    const n = { ...settings, [section]: { ...settings[section], [key]: value } };
    setSettings(n);
    autoSave(n);
  }

  async function handleSave() {
    setStatus("saving");
    try {
      const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      if (res.ok) { setStatus("saved"); setIframeKey(k => k + 1); setTimeout(() => setStatus("idle"), 2000); }
      else { setStatus("error"); alert("Error: " + (await res.json()).error); }
    } catch { setStatus("error"); }
  }

  const ic = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-gold focus:outline-none bg-white";
  const lb = "text-xs text-gray-500 block mb-1 font-medium";
  const sections = [
    { id: "brand", label: "Brand", icon: "ri-store-2-line" },
    { id: "hero", label: "Hero", icon: "ri-landscape-line" },
    { id: "about", label: "About", icon: "ri-information-line" },
    { id: "safety", label: "Safety", icon: "ri-shield-check-line" },
    { id: "contact", label: "Contact", icon: "ri-map-pin-line" },
    { id: "colors", label: "Colors", icon: "ri-palette-line" },
  ];

  if (loading) return <div className="flex items-center justify-center h-96 text-gray-400"><i className="ri-loader-4-line text-3xl animate-spin" /></div>;

  return (
    <div className="h-[calc(100vh-48px)] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-dark">SITE EDITOR</h1>
          <p className="text-xs text-gray-400">Auto-saves as you type • preview updates on save</p>
        </div>
        <div className="flex items-center gap-3">
          {status === "saving" && <span className="text-gray-400 text-sm flex items-center gap-1"><i className="ri-loader-4-line animate-spin" /> Saving...</span>}
          {status === "saved" && <span className="text-green-600 text-sm flex items-center gap-1"><i className="ri-check-line" /> Saved!</span>}
          {status === "error" && <span className="text-red-500 text-sm flex items-center gap-1"><i className="ri-error-warning-line" /> Error</span>}
          <button onClick={handleSave} className="bg-gold text-dark font-semibold px-5 py-2 rounded-xl hover:bg-yellow-500 flex items-center gap-2 text-sm">
            <i className="ri-save-line" /> Save
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left: Editor */}
        <div className="w-72 flex-shrink-0 flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex flex-wrap gap-1 p-2 border-b border-gray-100 bg-gray-50">
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${activeSection === s.id ? "bg-gold text-dark" : "text-gray-500 hover:bg-gray-200"}`}>
                <i className={s.icon} /> {s.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {activeSection === "brand" && <>
              <div><label className={lb}>Business Name</label><input value={settings.brand.name} onChange={e => update("brand", "name", e.target.value)} className={ic} /></div>
              <div><label className={lb}>Tagline</label><input value={settings.brand.tagline} onChange={e => update("brand", "tagline", e.target.value)} className={ic} /></div>
              <div><label className={lb}>Tagline Highlight</label><input value={settings.brand.taglineHighlight} onChange={e => update("brand", "taglineHighlight", e.target.value)} className={ic} /></div>
              <div><label className={lb}>Phone</label><input value={settings.brand.phone} onChange={e => update("brand", "phone", e.target.value)} className={ic} /></div>
              <div><label className={lb}>Email</label><input value={settings.brand.email} onChange={e => update("brand", "email", e.target.value)} className={ic} /></div>
              <div><label className={lb}>WhatsApp</label><input value={settings.brand.whatsapp} onChange={e => update("brand", "whatsapp", e.target.value)} className={ic} /></div>
              <div><label className={lb}>Instagram</label><input value={settings.brand.instagram} onChange={e => update("brand", "instagram", e.target.value)} className={ic} /></div>
              <div><label className={lb}>TikTok</label><input value={settings.brand.tiktok} onChange={e => update("brand", "tiktok", e.target.value)} className={ic} /></div>
            </>}
            {activeSection === "hero" && <>
              <div><label className={lb}>Title</label><input value={settings.hero.title} onChange={e => update("hero", "title", e.target.value)} className={ic + " font-bold"} /></div>
              <div><label className={lb}>Highlight</label><input value={settings.hero.titleHighlight} onChange={e => update("hero", "titleHighlight", e.target.value)} className={ic + " font-bold"} style={{ color: settings.colors.primary }} /></div>
              <div><label className={lb}>Subtitle</label><textarea value={settings.hero.subtitle} onChange={e => update("hero", "subtitle", e.target.value)} rows={4} className={ic} /></div>
            </>}
            {activeSection === "about" && <>
              <div><label className={lb}>Title</label><input value={settings.about.title} onChange={e => update("about", "title", e.target.value)} className={ic} /></div>
              <div><label className={lb}>Paragraph 1</label><textarea value={settings.about.p1} onChange={e => update("about", "p1", e.target.value)} rows={3} className={ic} /></div>
              <div><label className={lb}>Paragraph 2</label><textarea value={settings.about.p2} onChange={e => update("about", "p2", e.target.value)} rows={3} className={ic} /></div>
              <div><label className={lb}>Paragraph 3</label><textarea value={settings.about.p3} onChange={e => update("about", "p3", e.target.value)} rows={3} className={ic} /></div>
            </>}
            {activeSection === "safety" && <>
              <div><label className={lb}>Title</label><input value={settings.safety.title} onChange={e => update("safety", "title", e.target.value)} className={ic} /></div>
              <div><label className={lb}>Highlight</label><input value={settings.safety.titleHighlight} onChange={e => update("safety", "titleHighlight", e.target.value)} className={ic} /></div>
              <div><label className={lb}>Description</label><textarea value={settings.safety.description} onChange={e => update("safety", "description", e.target.value)} rows={4} className={ic} /></div>
            </>}
            {activeSection === "contact" && <>
              <div><label className={lb}>Title</label><input value={settings.contact.title} onChange={e => update("contact", "title", e.target.value)} className={ic} /></div>
              <div><label className={lb}>Subtitle</label><textarea value={settings.contact.subtitle} onChange={e => update("contact", "subtitle", e.target.value)} rows={2} className={ic} /></div>
              <div><label className={lb}>Address</label><textarea value={settings.contact.address} onChange={e => update("contact", "address", e.target.value)} rows={2} className={ic} /></div>
            </>}
            {activeSection === "colors" && <>
              <div><label className={lb}>Primary Color</label>
                <div className="flex gap-2 items-center"><input type="color" value={settings.colors.primary} onChange={e => update("colors", "primary", e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" /><input value={settings.colors.primary} onChange={e => update("colors", "primary", e.target.value)} className={ic} /></div>
              </div>
              <div><label className={lb}>Dark Color</label>
                <div className="flex gap-2 items-center"><input type="color" value={settings.colors.dark} onChange={e => update("colors", "dark", e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" /><input value={settings.colors.dark} onChange={e => update("colors", "dark", e.target.value)} className={ic} /></div>
              </div>
              <div><label className={lb}>Darker Color</label>
                <div className="flex gap-2 items-center"><input type="color" value={settings.colors.darker} onChange={e => update("colors", "darker", e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" /><input value={settings.colors.darker} onChange={e => update("colors", "darker", e.target.value)} className={ic} /></div>
              </div>
            </>}
          </div>
        </div>

        {/* Right: Live Preview (iframe) */}
        <div className="flex-1 flex flex-col bg-gray-100 rounded-xl border border-gray-200 overflow-hidden">
          {/* Browser chrome */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-yellow-400" /><div className="w-3 h-3 rounded-full bg-green-400" /></div>
              <span className="text-xs text-gray-400 font-mono ml-3">ortiz-car-rental.vercel.app</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-200 rounded-lg p-0.5">
              <button onClick={() => setPreviewMode("desktop")}
                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${previewMode === "desktop" ? "bg-white text-dark shadow-sm" : "text-gray-500"}`}>
                <i className="ri-computer-line" /> Desktop
              </button>
              <button onClick={() => setPreviewMode("mobile")}
                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${previewMode === "mobile" ? "bg-white text-dark shadow-sm" : "text-gray-500"}`}>
                <i className="ri-smartphone-line" /> Mobile
              </button>
            </div>
            <button onClick={() => setIframeKey(k => k + 1)} className="text-gray-400 hover:text-dark text-sm" title="Refresh preview">
              <i className="ri-refresh-line" />
            </button>
          </div>

          {/* Iframe */}
          <div className="flex-1 flex justify-center items-start overflow-auto p-4 bg-gray-100">
            <div className={`bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300 ${previewMode === "mobile" ? "w-[375px]" : "w-full max-w-[1200px]"}`}
              style={{ height: previewMode === "mobile" ? "700px" : "100%" }}>
              <iframe
                key={iframeKey}
                src="/"
                className="w-full h-full border-0"
                style={{ transform: previewMode === "mobile" ? "scale(1)" : "scale(1)", transformOrigin: "top left" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

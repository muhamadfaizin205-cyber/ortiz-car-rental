"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";
import { textToHtml, htmlToText } from "@/lib/editor";

export default function ArticleForm({ articleId }: { articleId?: string }) {
  const router = useRouter();
  const isEdit = !!articleId && articleId !== "new";
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    rawContent: "",   // plain text (what admin types)
    imagePath: "",
    isPublished: false,
    publishedAt: "",
    metaDescription: "",
  });

  useEffect(() => {
    if (isEdit) {
      fetch("/api/articles").then(r => r.json()).then(arts => {
        const a = arts.find((x: any) => x.id === parseInt(articleId!));
        if (a) {
          setForm({
            title: a.title,
            slug: a.slug,
            rawContent: htmlToText(a.content || ""),
            imagePath: a.imagePath || "",
            isPublished: a.isPublished,
            publishedAt: a.publishedAt ? new Date(a.publishedAt).toISOString().slice(0, 16) : "",
            metaDescription: a.metaDescription || "",
          });
        }
      });
    }
  }, [articleId, isEdit]);

  function autoSlug(n: string) {
    return n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  // Live HTML preview
  const htmlPreview = useMemo(() => textToHtml(form.rawContent), [form.rawContent]);

  // Word count
  const wordCount = form.rawContent.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  async function handleSubmit() {
    if (!form.title) { alert("Title is required"); return; }
    if (!form.rawContent.trim()) { alert("Content is required"); return; }
    setLoading(true);

    const htmlContent = textToHtml(form.rawContent);
    const url = isEdit ? `/api/articles/${articleId}` : "/api/articles";
    const method = isEdit ? "PUT" : "POST";

    const payload = {
      title: form.title,
      slug: form.slug || autoSlug(form.title),
      content: htmlContent,
      imagePath: form.imagePath || null,
      isPublished: form.isPublished,
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : (form.isPublished ? new Date().toISOString() : null),
      metaDescription: form.metaDescription || form.title,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) window.location.href = "/admin/articles";
      else alert("Error: " + (await res.json()).error);
    } catch { alert("Network error"); }
    setLoading(false);
  }

  const ic = "w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:border-gold focus:ring-1 focus:ring-gold/30 focus:outline-none text-sm bg-white";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">{isEdit ? "Edit Article" : "New Article"}</h1>
        <button onClick={() => router.push("/admin/articles")} className="text-gray-500 hover:text-dark text-sm flex items-center gap-1">
          <i className="ri-arrow-left-line" /> Back
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main editor - 2 cols */}
        <div className="xl:col-span-2 space-y-5">

          {/* Title + Slug */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1 font-medium">Title *</label>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value, slug: autoSlug(e.target.value) })}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-gold focus:outline-none text-lg font-semibold"
                placeholder="Your article title..."
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1 font-medium">Slug</label>
              <div className="flex items-center text-sm text-gray-400">
                <span className="mr-1">/articles/</span>
                <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className={ic + " text-gray-500"} />
              </div>
            </div>
          </div>

          {/* Content Editor with Write/Preview tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab("write")}
                className={`px-6 py-3 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === "write" ? "text-gold border-b-2 border-gold bg-gold/5" : "text-gray-500 hover:text-dark"}`}
              >
                <i className="ri-pencil-line" /> Write
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-6 py-3 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === "preview" ? "text-gold border-b-2 border-gold bg-gold/5" : "text-gray-500 hover:text-dark"}`}
              >
                <i className="ri-eye-line" /> Preview
              </button>
              <div className="ml-auto px-4 flex items-center text-xs text-gray-400 gap-3">
                <span>{wordCount} words</span>
                <span>{readTime} min read</span>
              </div>
            </div>

            {/* Write tab */}
            {activeTab === "write" && (
              <div className="p-5">
                <textarea
                  value={form.rawContent}
                  onChange={e => setForm({ ...form, rawContent: e.target.value })}
                  rows={18}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-gold focus:outline-none text-sm leading-relaxed resize-y font-mono"
                  placeholder={"Write your article here...\n\nJust type naturally — no HTML needed!\n\n## Use ## for headings\n\n### Use ### for sub-headings\n\n- Use - for bullet lists\n1. Use 1. for numbered lists\n\n**Bold text** and *italic text*\n\nEmpty lines create new paragraphs."}
                />
                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium mb-1">Formatting Guide:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-400">
                    <span><code className="bg-white px-1 py-0.5 rounded text-gray-600">## text</code> → Heading</span>
                    <span><code className="bg-white px-1 py-0.5 rounded text-gray-600">### text</code> → Sub-heading</span>
                    <span><code className="bg-white px-1 py-0.5 rounded text-gray-600">**text**</code> → <strong>Bold</strong></span>
                    <span><code className="bg-white px-1 py-0.5 rounded text-gray-600">*text*</code> → <em>Italic</em></span>
                    <span><code className="bg-white px-1 py-0.5 rounded text-gray-600">- item</code> → Bullet list</span>
                    <span><code className="bg-white px-1 py-0.5 rounded text-gray-600">1. item</code> → Numbered list</span>
                    <span className="col-span-2"><code className="bg-white px-1 py-0.5 rounded text-gray-600">Empty line</code> → New paragraph</span>
                  </div>
                </div>
              </div>
            )}

            {/* Preview tab */}
            {activeTab === "preview" && (
              <div className="p-8">
                {form.rawContent.trim() ? (
                  <div className="max-w-none prose prose-lg prose-headings:text-dark prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-gold prose-strong:text-dark prose-blockquote:border-gold">
                    {form.title && <h1 className="text-3xl font-bold text-dark mb-4">{form.title}</h1>}
                    <div dangerouslySetInnerHTML={{ __html: htmlPreview }} />
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <i className="ri-article-line text-4xl block mb-3" />
                    <p>Start writing to see the preview</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - 1 col */}
        <div className="space-y-5">

          {/* Publish settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="font-bold text-dark flex items-center gap-2"><i className="ri-settings-3-line text-gold" /> Publish Settings</h3>

            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-12 h-7 rounded-full transition-colors relative ${form.isPublished ? "bg-green-500" : "bg-gray-300"}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${form.isPublished ? "right-1" : "left-1"}`} />
              </div>
              <div>
                <span className="text-sm font-medium block">{form.isPublished ? "Published" : "Draft"}</span>
                <span className="text-xs text-gray-400">{form.isPublished ? "Visible on website" : "Not visible yet"}</span>
              </div>
              <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="hidden" />
            </label>

            {form.isPublished && (
              <div>
                <label className="text-sm text-gray-600 block mb-1 font-medium">Publish Date</label>
                <input
                  type="datetime-local"
                  value={form.publishedAt}
                  onChange={e => setForm({ ...form, publishedAt: e.target.value })}
                  className={ic}
                />
              </div>
            )}

            <div>
              <label className="text-sm text-gray-600 block mb-1 font-medium">Meta Description</label>
              <textarea
                value={form.metaDescription}
                onChange={e => setForm({ ...form, metaDescription: e.target.value })}
                rows={2}
                className={ic}
                placeholder="Short description for search engines..."
              />
              <p className="text-xs text-gray-400 mt-1">{(form.metaDescription || "").length}/160 characters</p>
            </div>

            {/* Save buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gold text-dark font-semibold py-3 rounded-xl hover:bg-yellow-500 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><i className="ri-loader-4-line animate-spin" /> Saving...</> : (
                  <><i className={isEdit ? "ri-check-line" : "ri-send-plane-line"} /> {isEdit ? "Update Article" : "Publish Article"}</>
                )}
              </button>
              <button
                onClick={() => router.push("/admin/articles")}
                className="w-full border border-gray-200 text-gray-500 py-2.5 rounded-xl hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-dark flex items-center gap-2 mb-4"><i className="ri-image-line text-gold" /> Cover Image</h3>
            <ImageUpload
              value={form.imagePath}
              onChange={url => setForm(f => ({ ...f, imagePath: url }))}
              width={800}
              height={450}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

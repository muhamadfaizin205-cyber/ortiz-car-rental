"use client";
import { useRef, useState, useEffect } from "react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  width?: number;
  height?: number;
}

export default function ImageUpload({ value, onChange, width = 800, height = 450 }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");

  // Sync preview & urlInput when parent value changes (e.g. API response loads)
  useEffect(() => {
    if (value) {
      setPreview(value);
      if (!value.startsWith("data:")) {
        setUrlInput(value);
      }
    }
  }, [value]);

  function resizeImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d")!;
          ctx.fillStyle = "#f3f4f6";
          ctx.fillRect(0, 0, width, height);
          const scale = Math.max(width / img.width, height / img.height);
          const sw = width / scale;
          const sh = height / scale;
          const sx = (img.width - sw) / 2;
          const sy = (img.height - sh) / 2;
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.8));
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target!.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select an image file"); return; }
    if (file.size > 10 * 1024 * 1024) { setError("Image must be under 10MB"); return; }

    setError("");
    setUploading(true);
    try {
      const resized = await resizeImage(file);
      setPreview(resized);
      setUrlInput("");  // Clear URL input since we're using uploaded file
      onChange(resized); // Update parent form
    } catch {
      setError("Failed to process image");
    }
    setUploading(false);
    // Reset file input so same file can be re-selected
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleUrlSubmit(url: string) {
    setUrlInput(url);
    if (url.startsWith("http")) {
      setPreview(url);
      onChange(url);
    } else if (url === "") {
      // Only clear if user explicitly empties the field
      // Don't change preview/parent if they just haven't typed yet
    }
    setError("");
  }

  function handleClearImage() {
    setPreview("");
    setUrlInput("");
    onChange("");
  }

  return (
    <div className="space-y-3">
      <label className="text-sm text-gray-600 block font-medium">Car Image</label>

      {/* Upload / Preview area */}
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-colors relative"
      >
        {uploading ? (
          <div className="text-gray-400 py-6">
            <i className="ri-loader-4-line text-3xl animate-spin block" />
            <p className="text-sm mt-2">Processing...</p>
          </div>
        ) : preview ? (
          <div>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg"
              onError={() => { setPreview(""); setError("Image failed to load"); }}
            />
            <p className="text-xs text-gray-400 mt-2">Click to change image</p>
          </div>
        ) : (
          <div className="text-gray-400 py-6">
            <i className="ri-image-add-line text-4xl block" />
            <p className="text-sm mt-2 font-medium">Click to upload image</p>
            <p className="text-xs mt-1">JPG, PNG, WebP • Max 10MB</p>
          </div>
        )}
      </div>

      {/* Clear button */}
      {preview && (
        <button
          onClick={(e) => { e.preventDefault(); handleClearImage(); }}
          className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
        >
          <i className="ri-delete-bin-line" /> Remove image
        </button>
      )}

      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      <p className="text-xs text-gray-400">
        Auto-resized to <span className="font-mono font-medium">{width} × {height}px</span>
      </p>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or paste URL</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* URL input */}
      <input
        value={urlInput}
        onChange={(e) => handleUrlSubmit(e.target.value)}
        placeholder="https://images.unsplash.com/..."
        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-gold focus:outline-none"
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Debug: show what will be saved */}
      {preview && (
        <p className="text-xs text-green-600">
          ✓ Image ready ({preview.startsWith("data:") ? `${Math.round(preview.length / 1024)}KB base64` : "URL"})
        </p>
      )}
    </div>
  );
}

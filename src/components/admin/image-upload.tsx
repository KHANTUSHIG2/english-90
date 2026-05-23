"use client";
import { useRef, useState } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Section Image" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) { setError("Only image files are allowed."); return; }
    setUploading(true); setError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Upload failed."); return; }
      onChange(data.url);
    } catch { setError("Network error."); }
    finally { setUploading(false); }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-text-secondary">{label} <span className="font-normal">(optional)</span></p>

      {value ? (
        <div className="space-y-2">
          <div className="relative inline-block">
            <img src={value} alt="section" className="max-h-56 max-w-full rounded-xl border border-border object-contain bg-gray-50" />
            <button type="button" onClick={() => { onChange(""); setUrlInput(""); }}
              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white border border-border shadow text-danger text-xs font-bold hover:bg-red-50 flex items-center justify-center">
              ✕
            </button>
          </div>
        </div>
      ) : urlMode ? (
        <div className="flex gap-2">
          <input autoFocus type="text" placeholder="https://example.com/image.png"
            value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light" />
          <button type="button" onClick={() => { onChange(urlInput); setUrlMode(false); }}
            className="px-3 py-2 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 shrink-0">Use</button>
          <button type="button" onClick={() => setUrlMode(false)}
            className="px-3 py-2 border border-border text-xs rounded-lg hover:bg-gray-100 shrink-0">✕</button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()} onDrop={onDrop}
          className="border-2 border-dashed border-border rounded-xl p-5 bg-gray-50 flex flex-col items-center gap-3 text-center">
          {error && <p className="text-xs text-danger">{error}</p>}
          <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary text-xl">⬆</div>
          <div>
            <p className="text-sm font-medium text-text-primary">{uploading ? "Uploading…" : "Drop image here"}</p>
            <p className="text-xs text-text-secondary mt-0.5">PNG, JPG, GIF up to 8 MB</p>
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} />
          <button type="button" disabled={uploading} onClick={() => inputRef.current?.click()}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
            {uploading ? "Uploading…" : "Choose File"}
          </button>
          <button type="button" onClick={() => setUrlMode(true)}
            className="text-xs text-text-secondary hover:text-primary hover:underline">
            or paste a URL
          </button>
        </div>
      )}
    </div>
  );
}

"use client";
import { useRef, useState } from "react";

interface MultiImageUploadProps {
  value: string;       // stored as JSON array string OR plain URL (legacy)
  onChange: (val: string) => void;
  label?: string;
}

function parseUrls(raw: string): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [raw];
  } catch {
    return [raw];
  }
}

function serializeUrls(urls: string[]): string {
  return urls.length === 0 ? "" : JSON.stringify(urls);
}

export function ImageUpload({ value, onChange, label = "Section Images" }: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const images = parseUrls(value);

  function addUrl(url: string) {
    if (!url.trim()) return;
    onChange(serializeUrls([...images, url.trim()]));
  }

  function removeImage(idx: number) {
    const next = images.filter((_, i) => i !== idx);
    onChange(serializeUrls(next));
  }

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) { setError("Only image files allowed."); return; }
    setUploading(true); setError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Upload failed."); return; }
      addUrl(data.url);
      if (inputRef.current) inputRef.current.value = "";
    } catch { setError("Network error."); }
    finally { setUploading(false); }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(handleFile);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    Array.from(e.dataTransfer.files).forEach(handleFile);
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-text-secondary">
        {label} <span className="font-normal text-text-secondary">(optional — shown to student)</span>
      </p>

      {/* Existing images grid */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((url, idx) => (
            <div key={idx} className="relative group">
              <img
                src={url}
                alt={`image ${idx + 1}`}
                className="h-28 w-auto rounded-lg border border-border object-contain bg-gray-50"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white border border-border shadow text-danger text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-50"
              >
                ✕
              </button>
              <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1 rounded">
                {idx + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {urlMode ? (
        <div className="flex gap-2">
          <input
            autoFocus
            type="text"
            placeholder="https://example.com/image.png"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addUrl(urlInput); setUrlInput(""); setUrlMode(false); }}}
            className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          <button type="button"
            onClick={() => { addUrl(urlInput); setUrlInput(""); setUrlMode(false); }}
            className="px-3 py-2 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 shrink-0">
            Add
          </button>
          <button type="button" onClick={() => setUrlMode(false)}
            className="px-3 py-2 border border-border text-xs rounded-lg hover:bg-gray-100 shrink-0">
            Cancel
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()} onDrop={onDrop}
          className="border-2 border-dashed border-border rounded-xl p-4 bg-gray-50 flex items-center gap-4">
          {error && <p className="text-xs text-danger">{error}</p>}
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onInputChange} />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 shrink-0">
            {uploading ? "Uploading…" : images.length > 0 ? "+ Add Picture" : "Upload Picture"}
          </button>
          <div className="text-xs text-text-secondary">
            <span>PNG, JPG up to 5 MB · drag & drop · </span>
            <button type="button" onClick={() => setUrlMode(true)} className="text-primary hover:underline">
              paste URL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

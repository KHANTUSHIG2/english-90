"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const CATEGORIES = [
  "Academic Word List",
  "Education",
  "Environment",
  "Technology",
  "Society",
  "Health",
  "Economy",
  "Culture",
  "Government",
  "Crime",
  "Media",
  "Science",
];

const empty = {
  word: "",
  definition: "",
  example: "",
  category: "Academic Word List",
  collocations: "",
  audioUrl: "",
};

export function NewVocabularyForm() {
  const router = useRouter();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.word || !form.definition || !form.example || !form.category) {
      setError("Word, definition, example and category are required.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/vocabulary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess("Word added successfully!");
        setForm(empty);
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error ?? "Failed.");
      }
    } catch {
      setError("Network error.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-danger text-sm rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 text-success text-sm rounded-lg">
          {success}
        </div>
      )}

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Word *"
              placeholder="e.g. ubiquitous"
              value={form.word}
              onChange={update("word")}
              required
            />
            <Select
              label="Category *"
              value={form.category}
              onChange={update("category")}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </div>
          <Textarea
            label="Definition *"
            placeholder="Present or appearing everywhere at the same time."
            value={form.definition}
            onChange={update("definition")}
            rows={2}
            required
          />
          <Textarea
            label="Example Sentence *"
            placeholder="Mobile phones have become ubiquitous in modern society."
            value={form.example}
            onChange={update("example")}
            rows={2}
            required
          />
          <Input
            label="Collocations (comma-separated)"
            placeholder="ubiquitous presence, ubiquitous technology, become ubiquitous"
            value={form.collocations}
            onChange={update("collocations")}
          />
          <Input
            label="Audio URL (optional)"
            placeholder="https://..."
            value={form.audioUrl}
            onChange={update("audioUrl")}
          />
        </CardContent>
      </Card>

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Add Vocabulary Word
      </Button>
    </form>
  );
}

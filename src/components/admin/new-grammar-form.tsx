"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const CATEGORIES = [
  "Sentence Structure",
  "Tenses",
  "Conditionals",
  "Passive Voice",
  "Relative Clauses",
  "Modals",
  "Articles",
  "Punctuation",
  "Cohesive Devices",
  "Complex Sentences",
];

const empty = {
  title: "",
  category: "Sentence Structure",
  content: "",
  order: "0",
};

export function NewGrammarForm() {
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
    if (!form.title || !form.category || !form.content) {
      setError("Title, category and content are required.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order: parseInt(form.order) || 0 }),
      });
      if (res.ok) {
        setSuccess("Lesson created successfully!");
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
          <Input
            label="Lesson Title *"
            placeholder="e.g. Using the Passive Voice in Academic Writing"
            value={form.title}
            onChange={update("title")}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category *"
              value={form.category}
              onChange={update("category")}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
            <Input
              label="Order (sort position)"
              type="number"
              placeholder="0"
              value={form.order}
              onChange={update("order")}
            />
          </div>
          <div>
            <Textarea
              label="Content (HTML supported) *"
              placeholder={`<p>The passive voice is formed with <strong>be + past participle</strong>.</p>\n<p><strong>Example:</strong> <em>The essay was written carefully.</em></p>\n<ul><li>Use passive when the agent is unknown or unimportant.</li></ul>`}
              value={form.content}
              onChange={update("content")}
              rows={10}
              required
            />
            <p className="text-xs text-text-secondary mt-1">
              You can use HTML tags: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;h4&gt;, &lt;code&gt;
            </p>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Create Grammar Lesson
      </Button>
    </form>
  );
}

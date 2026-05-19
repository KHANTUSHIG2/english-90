"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function NewWritingTopicForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    taskType: "TASK2",
    category: "Education",
    title: "",
    prompt: "",
    imageUrl: "",
    sampleAnswer: "",
    difficulty: "MEDIUM",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.prompt) { setError("Title and prompt are required."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/admin/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess("Topic created successfully!");
        setForm({ taskType: "TASK2", category: "Education", title: "", prompt: "", imageUrl: "", sampleAnswer: "", difficulty: "MEDIUM" });
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error ?? "Failed.");
      }
    } catch { setError("Network error."); }
    setLoading(false);
  }

  const categories = ["Education", "Environment", "Technology", "Society", "Health", "Economy", "Culture", "Government", "Crime", "Media"];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-danger text-sm rounded-lg">{error}</div>}
      {success && <div className="px-4 py-3 bg-green-50 border border-green-200 text-success text-sm rounded-lg">{success}</div>}

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Task Type"
              value={form.taskType}
              onChange={update("taskType")}
              options={[
                { value: "TASK2", label: "Task 2 — Essay" },
                { value: "TASK1_ACADEMIC", label: "Task 1 — Academic" },
                { value: "TASK1_GENERAL", label: "Task 1 — General" },
              ]}
            />
            <Select
              label="Category"
              value={form.category}
              onChange={update("category")}
              options={categories.map((c) => ({ value: c, label: c }))}
            />
          </div>
          <Input label="Title (brief summary) *" placeholder="Should university education be free?" value={form.title} onChange={update("title")} required />
          <Textarea label="Full Prompt *" placeholder="Some people believe that..." value={form.prompt} onChange={update("prompt")} rows={4} required />
          <Input label="Image URL (Task 1 only)" placeholder="https://..." value={form.imageUrl} onChange={update("imageUrl")} />
          <Textarea label="Band 9 Sample Answer" placeholder="Model answer..." value={form.sampleAnswer} onChange={update("sampleAnswer")} rows={6} />
          <Select
            label="Difficulty"
            value={form.difficulty}
            onChange={update("difficulty")}
            options={[{ value: "EASY", label: "Easy" }, { value: "MEDIUM", label: "Medium" }, { value: "HARD", label: "Hard" }]}
          />
        </CardContent>
      </Card>

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Create Writing Topic
      </Button>
    </form>
  );
}

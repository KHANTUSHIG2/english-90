"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const TASK1_CATEGORIES = [
  { value: "Bar Chart", icon: "▬", desc: "Compare values with bars" },
  { value: "Line Graph", icon: "📈", desc: "Show trends over time" },
  { value: "Table", icon: "⊞", desc: "Rows and columns of data" },
  { value: "Pie Chart", icon: "◑", desc: "Show proportions / percentages" },
  { value: "Map", icon: "🗺", desc: "Geographical or layout map" },
  { value: "Process", icon: "⟳", desc: "Steps or stages in a process" },
  { value: "Diagram", icon: "⬡", desc: "Technical or visual diagram" },
  { value: "Combination", icon: "⧉", desc: "Two or more chart types" },
];
const TASK2_CATEGORIES = ["Education", "Environment", "Technology", "Society", "Health", "Economy", "Culture", "Government", "Crime", "Media"];

export function NewWritingTopicForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    taskType: "TASK2",
    category: "Education",
    title: "",
    prompt: "",
    imageUrl: "",
    sampleAnswer: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => {
        const next = { ...prev, [field]: e.target.value };
        if (field === "taskType") {
          next.category = e.target.value === "TASK1_ACADEMIC"
            ? TASK1_CATEGORIES[0].value
            : TASK2_CATEGORIES[0];
        }
        return next;
      });
    };
  }

  function setCategory(val: string) {
    setForm((prev) => ({ ...prev, category: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/admin/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess("Topic created successfully!");
        setForm({ taskType: "TASK2", category: "Education", title: "", prompt: "", imageUrl: "", sampleAnswer: "" });
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error ?? "Failed.");
      }
    } catch { setError("Network error."); }
    setLoading(false);
  }

  const isTask1 = form.taskType === "TASK1_ACADEMIC";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-danger text-sm rounded-lg">{error}</div>}
      {success && <div className="px-4 py-3 bg-green-50 border border-green-200 text-success text-sm rounded-lg">{success}</div>}

      <Card>
        <CardContent className="p-4 space-y-4">
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

          {isTask1 ? (
            <div>
              <p className="text-xs font-semibold text-text-secondary mb-2">Chart / Diagram Type</p>
              <div className="grid grid-cols-2 gap-2">
                {TASK1_CATEGORIES.map((cat) => {
                  const selected = form.category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-left transition-all ${
                        selected
                          ? "border-primary bg-primary-50 text-primary"
                          : "border-border bg-white text-text-primary hover:border-primary-light"
                      }`}
                    >
                      <span className="text-xl shrink-0">{cat.icon}</span>
                      <div>
                        <div className={`text-sm font-semibold leading-tight ${selected ? "text-primary" : "text-text-primary"}`}>
                          {cat.value}
                        </div>
                        <div className="text-xs text-text-secondary leading-tight">{cat.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <Select
              label="Category"
              value={form.category}
              onChange={update("category")}
              options={TASK2_CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          )}

          <Input label="Title (optional)" placeholder="e.g. The graph shows CO₂ emissions..." value={form.title} onChange={update("title")} />
          <Textarea label="Full Prompt (optional)" placeholder="The chart below shows... Summarise the information..." value={form.prompt} onChange={update("prompt")} rows={4} />
          <Input label="Image URL (Task 1 — optional)" placeholder="https://..." value={form.imageUrl} onChange={update("imageUrl")} />
          <Textarea label="Band 9 Sample Answer (optional)" placeholder="Model answer..." value={form.sampleAnswer} onChange={update("sampleAnswer")} rows={6} />
        </CardContent>
      </Card>

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Create Writing Topic
      </Button>
    </form>
  );
}

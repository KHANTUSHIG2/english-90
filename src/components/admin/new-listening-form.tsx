"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface Question {
  questionNum: number;
  type: string;
  prompt: string;
  options: string;
  correctAnswer: string;
  explanation: string;
}
interface Section {
  sectionNum: number;
  title: string;
  questions: Question[];
}

const Q_TYPES = [
  { value: "FILL_BLANK", label: "Fill in the Blank" },
  { value: "MCQ", label: "Multiple Choice" },
  { value: "SHORT_ANSWER", label: "Short Answer" },
  { value: "MATCHING", label: "Matching" },
];

function blankQ(num: number): Question {
  return { questionNum: num, type: "FILL_BLANK", prompt: "", options: "", correctAnswer: "", explanation: "" };
}

function blankSection(num: number): Section {
  return {
    sectionNum: num,
    title: "",
    questions: [blankQ(1), blankQ(2), blankQ(3), blankQ(4), blankQ(5)],
  };
}

export function NewListeningTestForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [sections, setSections] = useState<Section[]>([blankSection(1)]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function addSection() {
    const nextNum = sections.length + 1;
    setSections((prev) => [...prev, blankSection(nextNum)]);
  }

  function addQuestion(sIdx: number) {
    setSections((prev) => {
      const updated = [...prev];
      const nextNum = updated[sIdx].questions.length + 1;
      updated[sIdx].questions = [...updated[sIdx].questions, blankQ(nextNum)];
      return updated;
    });
  }

  function updateSection(sIdx: number, field: keyof Section, val: any) {
    setSections((prev) => {
      const updated = [...prev];
      (updated[sIdx] as any)[field] = val;
      return updated;
    });
  }

  function updateQuestion(sIdx: number, qIdx: number, field: keyof Question, val: string) {
    setSections((prev) => {
      const updated = [...prev];
      updated[sIdx].questions[qIdx] = { ...updated[sIdx].questions[qIdx], [field]: val };
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !audioUrl) { setError("Title and audio URL are required."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/listening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, audioUrl, difficulty, sections }),
      });
      if (res.ok) {
        setSuccess("Test created successfully!");
        setTitle(""); setDescription(""); setAudioUrl("");
        setSections([blankSection(1)]);
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error ?? "Failed to create test.");
      }
    } catch {
      setError("Network error.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-danger text-sm rounded-lg">{error}</div>}
      {success && <div className="px-4 py-3 bg-green-50 border border-green-200 text-success text-sm rounded-lg">{success}</div>}

      <Card>
        <CardContent className="p-4 space-y-4">
          <Input label="Test Title *" placeholder="Cambridge IELTS 18 Test 1" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Textarea label="Description" placeholder="Brief description..." value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          <Input label="Audio URL *" placeholder="https://..." value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} required />
          <Select
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            options={[{ value: "EASY", label: "Easy" }, { value: "MEDIUM", label: "Medium" }, { value: "HARD", label: "Hard" }]}
          />
        </CardContent>
      </Card>

      {sections.map((section, sIdx) => (
        <Card key={sIdx}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-text-primary text-sm">Section {section.sectionNum}</h3>
              <span className="text-xs text-text-secondary">{section.questions.length} questions</span>
            </div>
            <Input
              label="Section Title (optional)"
              placeholder="e.g. A conversation about..."
              value={section.title}
              onChange={(e) => updateSection(sIdx, "title", e.target.value)}
              className="mb-4"
            />
            <div className="space-y-4">
              {section.questions.map((q, qIdx) => (
                <div key={qIdx} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">Q{q.questionNum}</span>
                    <select
                      value={q.type}
                      onChange={(e) => updateQuestion(sIdx, qIdx, "type", e.target.value)}
                      className="text-xs border border-border rounded px-2 py-1"
                    >
                      {Q_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Question prompt *"
                    value={q.prompt}
                    onChange={(e) => updateQuestion(sIdx, qIdx, "prompt", e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-border rounded"
                  />
                  {q.type === "MCQ" && (
                    <input
                      type="text"
                      placeholder='Options (JSON array): ["A","B","C","D"]'
                      value={q.options}
                      onChange={(e) => updateQuestion(sIdx, qIdx, "options", e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-border rounded"
                    />
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Correct answer *"
                      value={q.correctAnswer}
                      onChange={(e) => updateQuestion(sIdx, qIdx, "correctAnswer", e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Explanation (optional)"
                      value={q.explanation}
                      onChange={(e) => updateQuestion(sIdx, qIdx, "explanation", e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-border rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button type="button" variant="ghost" size="sm" className="mt-3" onClick={() => addQuestion(sIdx)}>
              + Add Question
            </Button>
          </CardContent>
        </Card>
      ))}

      {sections.length < 4 && (
        <Button type="button" variant="outline" onClick={addSection} className="w-full">
          + Add Section ({sections.length}/4)
        </Button>
      )}

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Create Listening Test
      </Button>
    </form>
  );
}

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
interface Passage {
  passageNum: number;
  title: string;
  content: string;
  questions: Question[];
}

const Q_TYPES = [
  { value: "TRUE_FALSE_NG", label: "True/False/Not Given" },
  { value: "MCQ", label: "Multiple Choice" },
  { value: "FILL_BLANK", label: "Fill in the Blank" },
  { value: "MATCHING", label: "Matching" },
  { value: "MATCHING_HEADINGS", label: "Matching Headings" },
];

function blankQ(num: number): Question {
  return { questionNum: num, type: "TRUE_FALSE_NG", prompt: "", options: "", correctAnswer: "", explanation: "" };
}

function blankPassage(num: number): Passage {
  return {
    passageNum: num, title: "", content: "",
    questions: [blankQ(1), blankQ(2), blankQ(3), blankQ(4), blankQ(5)],
  };
}

export function NewReadingTestForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [testType, setTestType] = useState("ACADEMIC");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [passages, setPassages] = useState<Passage[]>([blankPassage(1)]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function addPassage() {
    if (passages.length < 3) {
      setPassages((prev) => [...prev, blankPassage(prev.length + 1)]);
    }
  }

  function updatePassage(pIdx: number, field: keyof Passage, val: any) {
    setPassages((prev) => {
      const updated = [...prev];
      (updated[pIdx] as any)[field] = val;
      return updated;
    });
  }

  function updateQuestion(pIdx: number, qIdx: number, field: keyof Question, val: string) {
    setPassages((prev) => {
      const updated = [...prev];
      updated[pIdx].questions[qIdx] = { ...updated[pIdx].questions[qIdx], [field]: val };
      return updated;
    });
  }

  function addQuestion(pIdx: number) {
    setPassages((prev) => {
      const updated = [...prev];
      const nextNum = updated[pIdx].questions.length + 1;
      updated[pIdx].questions = [...updated[pIdx].questions, blankQ(nextNum)];
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title) { setError("Title is required."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/admin/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, testType, difficulty, passages }),
      });
      if (res.ok) {
        setSuccess("Test created!");
        setTitle(""); setDescription(""); setPassages([blankPassage(1)]);
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error ?? "Failed.");
      }
    } catch { setError("Network error."); }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-danger text-sm rounded-lg">{error}</div>}
      {success && <div className="px-4 py-3 bg-green-50 border border-green-200 text-success text-sm rounded-lg">{success}</div>}

      <Card>
        <CardContent className="p-4 space-y-3">
          <Input label="Test Title *" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" value={testType} onChange={(e) => setTestType(e.target.value)}
              options={[{ value: "ACADEMIC", label: "Academic" }, { value: "GENERAL", label: "General Training" }]} />
            <Select label="Difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
              options={[{ value: "EASY", label: "Easy" }, { value: "MEDIUM", label: "Medium" }, { value: "HARD", label: "Hard" }]} />
          </div>
        </CardContent>
      </Card>

      {passages.map((passage, pIdx) => (
        <Card key={pIdx}>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3">Passage {passage.passageNum}</h3>
            <div className="space-y-2 mb-4">
              <Input label="Passage Title *" value={passage.title} onChange={(e) => updatePassage(pIdx, "title", e.target.value)} />
              <Textarea label="Passage Content *" value={passage.content} onChange={(e) => updatePassage(pIdx, "content", e.target.value)} rows={6} />
            </div>
            <div className="space-y-3">
              {passage.questions.map((q, qIdx) => (
                <div key={qIdx} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">Q{q.questionNum}</span>
                    <select value={q.type} onChange={(e) => updateQuestion(pIdx, qIdx, "type", e.target.value)}
                      className="text-xs border border-border rounded px-2 py-1">
                      {Q_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <input type="text" placeholder="Question *" value={q.prompt}
                    onChange={(e) => updateQuestion(pIdx, qIdx, "prompt", e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-border rounded" />
                  {q.type === "MCQ" && (
                    <input type="text" placeholder='Options JSON: ["A","B","C","D"]' value={q.options}
                      onChange={(e) => updateQuestion(pIdx, qIdx, "options", e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-border rounded" />
                  )}
                  <div className="flex gap-2">
                    <input type="text" placeholder="Correct answer *" value={q.correctAnswer}
                      onChange={(e) => updateQuestion(pIdx, qIdx, "correctAnswer", e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-border rounded" />
                    <input type="text" placeholder="Explanation" value={q.explanation}
                      onChange={(e) => updateQuestion(pIdx, qIdx, "explanation", e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-border rounded" />
                  </div>
                </div>
              ))}
            </div>
            <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => addQuestion(pIdx)}>
              + Add Question
            </Button>
          </CardContent>
        </Card>
      ))}

      {passages.length < 3 && (
        <Button type="button" variant="outline" onClick={addPassage} className="w-full">
          + Add Passage ({passages.length}/3)
        </Button>
      )}

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Create Reading Test
      </Button>
    </form>
  );
}

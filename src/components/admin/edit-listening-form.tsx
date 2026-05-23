"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";

const LETTERS = ["A", "B", "C", "D"];

interface AnswerSlot {
  questionNum: number;
  type: "FILL_BLANK" | "MCQ";
  correctAnswer: string;
  correctAnswer2: string;
  mcqA: string;
  mcqB: string;
  mcqC: string;
  mcqD: string;
  correctLetter: string;
}

interface Part {
  sectionNum: number;
  audioUrl: string;
  imageUrl: string;
  slots: AnswerSlot[];
}

interface TestData {
  id: string;
  title: string;
  audioUrl: string;
  sections: Array<{
    sectionNum: number;
    audioUrl: string | null;
    imageUrl: string | null;
    questions: Array<{
      questionNum: number;
      type: string;
      title: string | null;
      prompt: string;
      options: string | null;
      correctAnswer: string;
      audioTimestamp: number | null;
    }>;
  }>;
}

const LETTERS_KEYS = ["mcqA", "mcqB", "mcqC", "mcqD"] as const;

function blankSlot(): AnswerSlot {
  return { questionNum: 0, type: "FILL_BLANK", correctAnswer: "", correctAnswer2: "", mcqA: "", mcqB: "", mcqC: "", mcqD: "", correctLetter: "" };
}

function getOffset(parts: Part[], pIdx: number): number {
  return parts.slice(0, pIdx).reduce((sum, p) => sum + p.slots.length, 0);
}

function parseSlot(q: TestData["sections"][0]["questions"][0]): AnswerSlot {
  const isMCQ = q.type === "MCQ";
  let opts: string[] = [];
  if (isMCQ && q.options) {
    try { opts = JSON.parse(q.options); } catch { opts = []; }
  }
  const texts = opts.map((o) => o.replace(/^[A-D]\.\s*/, ""));
  const correctLetter = isMCQ
    ? (q.correctAnswer.match(/^([A-D])\./)?.[1] ?? q.correctAnswer.trim().toUpperCase().charAt(0))
    : "";

  const [ans1, ans2] = isMCQ ? ["", ""] : q.correctAnswer.split("|").map(s => s.trim());
  return {
    questionNum: q.questionNum,
    type: isMCQ ? "MCQ" : "FILL_BLANK",
    correctAnswer: ans1 ?? q.correctAnswer,
    correctAnswer2: ans2 ?? "",
    mcqA: texts[0] ?? "",
    mcqB: texts[1] ?? "",
    mcqC: texts[2] ?? "",
    mcqD: texts[3] ?? "",
    correctLetter,
  };
}

function mcqOptionArray(slot: AnswerSlot): string[] {
  return LETTERS.map((l, i) => {
    const text = [slot.mcqA, slot.mcqB, slot.mcqC, slot.mcqD][i];
    return text ? `${l}. ${text}` : "";
  }).filter(Boolean);
}

function mcqCorrectAnswer(slot: AnswerSlot): string {
  const idx = LETTERS.indexOf(slot.correctLetter);
  const text = [slot.mcqA, slot.mcqB, slot.mcqC, slot.mcqD][idx];
  if (!text || idx < 0) return slot.correctLetter;
  return `${slot.correctLetter}. ${text}`;
}

export function EditListeningForm({ test }: { test: TestData }) {
  const router = useRouter();
  const [title, setTitle] = useState(test.title);
  const [mainAudioUrl, setMainAudioUrl] = useState(test.audioUrl);
  const [parts, setParts] = useState<Part[]>(
    test.sections.map((s) => ({
      sectionNum: s.sectionNum,
      audioUrl: s.audioUrl ?? "",
      imageUrl: s.imageUrl ?? "",
      slots: s.questions.length > 0
        ? s.questions.map(parseSlot)
        : [blankSlot(), blankSlot()],
    }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updatePart(pIdx: number, field: keyof Part, val: string) {
    setParts((prev) => { const u = [...prev]; (u[pIdx] as any)[field] = val; return u; });
  }

  function updateSlot(pIdx: number, sIdx: number, field: keyof AnswerSlot, val: string) {
    setParts((prev) => {
      const u = [...prev];
      u[pIdx].slots[sIdx] = { ...u[pIdx].slots[sIdx], [field]: val };
      return u;
    });
  }

  function addSlot(pIdx: number) {
    setParts((prev) => {
      const u = [...prev];
      u[pIdx].slots = [...u[pIdx].slots, blankSlot()];
      return u;
    });
  }

  function removeSlot(pIdx: number, sIdx: number) {
    setParts((prev) => {
      const u = [...prev];
      u[pIdx].slots = u[pIdx].slots.filter((_, i) => i !== sIdx);
      return u;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !mainAudioUrl) { setError("Title and audio URL are required."); return; }
    setLoading(true); setError(""); setSuccess("");

    const sections = parts.map((p, pIdx) => {
      const offset = getOffset(parts, pIdx);
      return {
        sectionNum: p.sectionNum,
        audioUrl: p.audioUrl || null,
        imageUrl: p.imageUrl || null,
        passage: null,
        title: null,
        questions: p.slots
          .map((s, sIdx) => ({ s, globalNum: offset + sIdx + 1 }))
          .filter(({ s }) => s.type === "MCQ" ? s.correctLetter : s.correctAnswer)
          .map(({ s, globalNum }) => ({
            questionNum: globalNum,
            type: s.type,
            title: null,
            prompt: `Question ${globalNum}`,
            options: s.type === "MCQ" ? mcqOptionArray(s) : null,
            correctAnswer: s.type === "MCQ"
              ? mcqCorrectAnswer(s)
              : s.correctAnswer2.trim()
                ? `${s.correctAnswer.trim()}|${s.correctAnswer2.trim()}`
                : s.correctAnswer.trim(),
            explanation: null,
          })),
      };
    });

    try {
      const res = await fetch(`/api/admin/listening/${test.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: null, audioUrl: mainAudioUrl, sections }),
      });
      if (res.ok) {
        setSuccess("Test updated!");
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error ?? "Failed.");
      }
    } catch { setError("Network error."); }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-danger text-sm rounded-lg">{error}</div>}
      {success && <div className="px-4 py-3 bg-green-50 border border-green-200 text-success text-sm rounded-lg">{success}</div>}

      <Card>
        <CardContent className="p-4 space-y-3">
          <Input label="Test Title *" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Main Audio URL *" placeholder="https://..." value={mainAudioUrl} onChange={(e) => setMainAudioUrl(e.target.value)} required />
        </CardContent>
      </Card>

      {parts.map((part, pIdx) => {
        const offset = getOffset(parts, pIdx);
        return (<Card key={pIdx}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-base shrink-0">{part.sectionNum}</div>
              <div>
                <p className="font-bold text-text-primary text-sm">Part {part.sectionNum}</p>
                <p className="text-xs text-text-secondary">{part.slots.length} answer slots</p>
              </div>
            </div>

            <Input
              label="Part Audio URL (optional)"
              placeholder="https://..."
              value={part.audioUrl}
              onChange={(e) => updatePart(pIdx, "audioUrl", e.target.value)}
              className="mb-3"
            />

            {/* Image */}
            <div className="mb-4">
              <ImageUpload
                value={part.imageUrl}
                onChange={(url) => updatePart(pIdx, "imageUrl", url)}
                label={`Part ${part.sectionNum} Image`}
              />
            </div>

            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Answer Slots</p>
            <div className="space-y-2">
              {part.slots.map((slot, sIdx) => (
                <SlotRow
                  key={sIdx}
                  slot={slot}
                  qNum={offset + sIdx + 1}
                  onChange={(field, val) => updateSlot(pIdx, sIdx, field, val)}
                  onRemove={() => removeSlot(pIdx, sIdx)}
                />
              ))}
            </div>

            <Button type="button" variant="ghost" size="sm" className="mt-3 text-xs" onClick={() => addSlot(pIdx)}>
              + Add Answer Slot
            </Button>
          </CardContent>
        </Card>);
      })}

      {parts.length < 4 && (
        <Button type="button" variant="outline" className="w-full"
          onClick={() => setParts((p) => [...p, { sectionNum: p.length + 1, audioUrl: "", imageUrl: "", slots: [blankSlot(), blankSlot()] }])}>
          + Add Part ({parts.length}/4)
        </Button>
      )}

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Save Changes
      </Button>
    </form>
  );
}

function SlotRow({ slot, qNum, onChange, onRemove }: {
  slot: AnswerSlot;
  qNum: number;
  onChange: (field: keyof AnswerSlot, val: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="border border-border rounded-xl p-3 bg-white space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
          {qNum}
        </span>

        {/* Type toggle */}
        <div className="flex rounded-lg border border-border overflow-hidden shrink-0">
          <button type="button"
            onClick={() => onChange("type", "FILL_BLANK")}
            className={`px-3 py-1 text-xs font-semibold transition-colors ${slot.type === "FILL_BLANK" ? "bg-primary text-white" : "bg-white text-text-secondary hover:bg-gray-50"}`}>
            Fill
          </button>
          <button type="button"
            onClick={() => onChange("type", "MCQ")}
            className={`px-3 py-1 text-xs font-semibold transition-colors border-l border-border ${slot.type === "MCQ" ? "bg-primary text-white" : "bg-white text-text-secondary hover:bg-gray-50"}`}>
            MCQ
          </button>
        </div>

        {slot.type === "FILL_BLANK" && (
          <>
            <input
              type="text"
              placeholder="Answer 1 *"
              value={slot.correctAnswer}
              onChange={(e) => onChange("correctAnswer", e.target.value)}
              className="flex-1 min-w-[100px] px-3 py-1.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            <input
              type="text"
              placeholder="Answer 2 (optional)"
              value={slot.correctAnswer2}
              onChange={(e) => onChange("correctAnswer2", e.target.value)}
              className="flex-1 min-w-[100px] px-3 py-1.5 text-sm border border-dashed border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light bg-gray-50"
            />
          </>
        )}

        <button type="button" onClick={onRemove}
          className="ml-auto text-xs text-danger hover:underline shrink-0">✕</button>
      </div>

      {slot.type === "MCQ" && (
        <div className="ml-9 space-y-2">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {LETTERS_KEYS.map((key, i) => (
              <div key={key} className="flex items-center gap-2">
                <span className={`text-xs font-bold w-5 shrink-0 ${slot.correctLetter === LETTERS[i] ? "text-success" : "text-primary"}`}>
                  {LETTERS[i]}.
                </span>
                <input
                  type="text"
                  placeholder={`Option ${LETTERS[i]}`}
                  value={slot[key]}
                  onChange={(e) => onChange(key, e.target.value)}
                  className={`flex-1 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary-light ${
                    slot.correctLetter === LETTERS[i] ? "border-success bg-green-50" : "border-border"
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-secondary">Correct:</span>
            <div className="flex gap-1">
              {LETTERS.map((l) => (
                <button key={l} type="button"
                  onClick={() => onChange("correctLetter", l)}
                  className={`w-8 h-8 rounded-full text-xs font-bold border-2 transition-all ${
                    slot.correctLetter === l
                      ? "bg-success text-white border-success"
                      : "bg-white text-text-secondary border-border hover:border-primary"
                  }`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

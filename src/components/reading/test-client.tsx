"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDuration, formatBandScore, getBandBg } from "@/lib/utils";

interface Question {
  id: string;
  questionNum: number;
  type: string;
  prompt: string;
  options: string | null;
  correctAnswer: string;
  explanation: string | null;
}
interface Passage {
  id: string;
  passageNum: number;
  title: string;
  content: string;
  questions: Question[];
}
interface Test {
  id: string;
  title: string;
  duration: number;
  testType: string;
  passages: Passage[];
}

export function ReadingTestClient({ test, userId: _userId }: { test: Test; userId: string }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(test.duration);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; band: number; correct: Record<string, boolean> } | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePassage, setActivePassage] = useState(0);
  const [highlighted, setHighlighted] = useState("");

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [submitted]);

  async function handleSubmit() {
    if (submitted) return;
    setLoading(true);
    setSubmitted(true);
    const res = await fetch("/api/reading/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testId: test.id, answers }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  if (result) {
    const totalQ = test.passages.flatMap((p) => p.questions).length;
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Reading Complete!</h1>
          <p className="text-text-secondary">{test.title}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-8 max-w-xs mx-auto">
          <Card><CardContent className="p-6 text-center">
            <div className="text-sm text-text-secondary mb-1">Score</div>
            <div className="text-3xl font-bold text-success">{result.score}/{totalQ}</div>
          </CardContent></Card>
          <Card><CardContent className="p-6 text-center">
            <div className="text-sm text-text-secondary mb-1">Band</div>
            <div className={`text-3xl font-bold rounded-full px-3 py-1 inline-block ${getBandBg(result.band)}`}>
              {formatBandScore(result.band)}
            </div>
          </CardContent></Card>
        </div>

        {test.passages.map((passage) => (
          <Card key={passage.id} className="mb-4">
            <CardContent className="p-6">
              <h3 className="font-semibold text-text-primary mb-4">Passage {passage.passageNum}: {passage.title}</h3>
              <div className="space-y-3">
                {passage.questions.map((q) => {
                  const isCorrect = result.correct[q.id];
                  return (
                    <div key={q.id} className={`p-3 rounded-lg border text-sm ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                      <span className="font-medium">Q{q.questionNum}: </span>{q.prompt}
                      <div className="mt-1 text-xs">
                        Your answer: <span className={isCorrect ? "text-success font-semibold" : "text-danger font-semibold"}>{answers[q.id] || "(blank)"}</span>
                        {!isCorrect && <span className="ml-2 text-success font-semibold">Correct: {q.correctAnswer}</span>}
                      </div>
                      {q.explanation && <div className="mt-1 text-xs text-text-secondary italic">{q.explanation}</div>}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => router.push("/practice/reading")}>Back to Tests</Button>
          <Button onClick={() => router.push("/dashboard")}>View Dashboard</Button>
        </div>
      </div>
    );
  }

  const currentPassage = test.passages[activePassage];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-border px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <span className="font-semibold text-text-primary text-sm">{test.title}</span>
          <span className="text-xs text-text-secondary ml-2">· {test.testType}</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Passage tabs */}
          <div className="hidden sm:flex gap-1">
            {test.passages.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActivePassage(i)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${i === activePassage ? "bg-primary text-white" : "bg-gray-100 text-text-secondary hover:text-primary"}`}
              >
                Passage {p.passageNum}
              </button>
            ))}
          </div>
          <div className={`font-mono font-bold text-sm ${timeLeft < 600 ? "text-danger" : "text-primary"}`}>
            {formatDuration(timeLeft)}
          </div>
          <Button size="sm" variant="danger" onClick={handleSubmit} loading={loading}>
            Submit
          </Button>
        </div>
      </div>

      {/* Split screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Passage */}
        <div className="w-1/2 overflow-y-auto p-6 border-r border-border">
          <h2 className="text-lg font-bold text-text-primary mb-1">
            Passage {currentPassage.passageNum}: {currentPassage.title}
          </h2>
          <div
            className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap"
            onMouseUp={() => {
              const sel = window.getSelection()?.toString();
              if (sel) setHighlighted(sel);
            }}
          >
            {currentPassage.content}
          </div>
          {highlighted && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
              Highlighted: "{highlighted.slice(0, 100)}"
            </div>
          )}
        </div>

        {/* Questions */}
        <div className="w-1/2 overflow-y-auto p-6">
          <h3 className="font-semibold text-text-primary mb-4 text-sm">
            Questions {currentPassage.questions[0]?.questionNum}–{currentPassage.questions.at(-1)?.questionNum}
          </h3>
          <div className="space-y-5">
            {currentPassage.questions.map((q) => (
              <div key={q.id} className="border-b border-border pb-4 last:border-0">
                <p className="text-sm font-medium text-text-primary mb-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-50 text-primary text-xs font-bold mr-1">
                    {q.questionNum}
                  </span>
                  {q.prompt}
                </p>
                {q.options ? (
                  <div className="space-y-1.5 ml-6">
                    {(JSON.parse(q.options) as string[]).map((opt, i) => (
                      <label key={i} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={opt}
                          checked={answers[q.id] === opt}
                          onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                          className="accent-primary"
                        />
                        <span className="text-xs text-text-primary">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={answers[q.id] ?? ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder="Your answer..."
                    className="ml-6 px-3 py-1.5 border border-border rounded-lg text-xs w-48 focus:outline-none focus:ring-2 focus:ring-primary-light"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile passage selector */}
      <div className="sm:hidden bg-white border-t border-border flex overflow-x-auto">
        {test.passages.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setActivePassage(i)}
            className={`flex-1 py-2 text-xs font-medium ${i === activePassage ? "bg-primary text-white" : "text-text-secondary"}`}
          >
            Passage {p.passageNum}
          </button>
        ))}
      </div>
    </div>
  );
}

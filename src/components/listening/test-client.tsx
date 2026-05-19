"use client";
import { useState, useEffect, useRef } from "react";
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
interface Section {
  id: string;
  sectionNum: number;
  title: string | null;
  questions: Question[];
}
interface Test {
  id: string;
  title: string;
  audioUrl: string;
  duration: number;
  sections: Section[];
}

export function ListeningTestClient({ test, userId: _userId }: { test: Test; userId: string }) {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(test.duration);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{
    score: number; band: number; correct: Record<string, boolean>;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const handleSubmitRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { handleSubmitRef.current(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [submitted]);

  // all questions used for counting

  async function handleSubmit() {
    if (submitted) return;
    setLoading(true);
    setSubmitted(true);
    try {
      const res = await fetch("/api/listening/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId: test.id, answers }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult(null);
    }
    setLoading(false);
  }

  handleSubmitRef.current = handleSubmit;

  function setAnswer(qId: string, val: string) {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  }

  if (result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Test Complete!</h1>
          <p className="text-text-secondary">{test.title}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-8 max-w-xs mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-sm text-text-secondary mb-1">Score</div>
              <div className="text-3xl font-bold text-primary">{result.score}/40</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-sm text-text-secondary mb-1">Band</div>
              <div className={`text-3xl font-bold rounded-full px-3 py-1 inline-block ${getBandBg(result.band)}`}>
                {formatBandScore(result.band)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 mb-8">
          {test.sections.map((section) => (
            <Card key={section.id}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-text-primary mb-4">
                  Section {section.sectionNum}{section.title ? ` — ${section.title}` : ""}
                </h3>
                <div className="space-y-4">
                  {section.questions.map((q) => {
                    const userAns = answers[q.id] ?? "";
                    const isCorrect = result.correct[q.id];
                    return (
                      <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                        <div className="flex items-start gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isCorrect ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                            Q{q.questionNum}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary mb-1">{q.prompt}</p>
                            <p className="text-xs text-text-secondary">
                              Your answer: <span className={isCorrect ? "text-success font-medium" : "text-danger font-medium"}>{userAns || "(blank)"}</span>
                            </p>
                            {!isCorrect && (
                              <p className="text-xs text-success font-medium mt-0.5">
                                Correct: {q.correctAnswer}
                              </p>
                            )}
                            {q.explanation && (
                              <p className="text-xs text-text-secondary mt-1 italic">{q.explanation}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => router.push("/practice/listening")}>Back to Tests</Button>
          <Button onClick={() => router.push("/dashboard")}>View Dashboard</Button>
        </div>
      </div>
    );
  }

  const currentSection = test.sections[activeSection];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sticky top-16 bg-muted py-3 z-10">
        <div>
          <h1 className="font-bold text-text-primary">{test.title}</h1>
          <p className="text-sm text-text-secondary">
            Section {activeSection + 1} of {test.sections.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`text-lg font-bold font-mono ${timeLeft < 300 ? "text-danger" : "text-primary"}`}>
            {formatDuration(timeLeft)}
          </div>
          <Button variant="danger" size="sm" onClick={handleSubmit} loading={loading}>
            Submit
          </Button>
        </div>
      </div>

      {/* Audio player */}
      <div className="mb-6">
        <audio
          ref={audioRef}
          src={test.audioUrl}
          controls
          className="w-full"
          controlsList="nodownload"
        />
        <p className="text-xs text-text-secondary mt-1 text-center">
          In exam mode, audio plays once. Use practice mode to replay.
        </p>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {test.sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              i === activeSection
                ? "bg-primary text-white"
                : "bg-white border border-border text-text-secondary hover:text-primary"
            }`}
          >
            Section {s.sectionNum}
          </button>
        ))}
      </div>

      {/* Questions */}
      <Card>
        <CardContent className="p-6">
          {currentSection.title && (
            <h2 className="text-lg font-semibold text-text-primary mb-1">{currentSection.title}</h2>
          )}
          <div className="space-y-6 mt-4">
            {currentSection.questions.map((q) => (
              <QuestionItem
                key={q.id}
                question={q}
                value={answers[q.id] ?? ""}
                onChange={(v) => setAnswer(q.id, v)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          disabled={activeSection === 0}
          onClick={() => setActiveSection((p) => p - 1)}
        >
          ← Previous Section
        </Button>
        {activeSection < test.sections.length - 1 ? (
          <Button onClick={() => setActiveSection((p) => p + 1)}>
            Next Section →
          </Button>
        ) : (
          <Button onClick={handleSubmit} loading={loading}>
            Submit Test
          </Button>
        )}
      </div>
    </div>
  );
}

function QuestionItem({
  question, value, onChange,
}: {
  question: Question; value: string; onChange: (v: string) => void;
}) {
  const options = question.options ? (JSON.parse(question.options) as string[]) : null;

  return (
    <div className="border-b border-border pb-5 last:border-0 last:pb-0">
      <p className="text-sm font-medium text-text-primary mb-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-50 text-primary text-xs font-bold mr-2">
          {question.questionNum}
        </span>
        {question.prompt}
      </p>
      {options ? (
        <div className="space-y-2 ml-8">
          {options.map((opt, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name={`q-${question.id}`}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                className="accent-primary"
              />
              <span className="text-sm text-text-primary group-hover:text-primary">{opt}</span>
            </label>
          ))}
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer..."
          className="ml-8 px-3 py-1.5 border border-border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      )}
    </div>
  );
}

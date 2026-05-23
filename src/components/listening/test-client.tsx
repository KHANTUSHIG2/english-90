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
  title: string | null;
  prompt: string;
  options: string | null;
  correctAnswer: string;
  explanation: string | null;
}
interface Section {
  id: string;
  sectionNum: number;
  title: string | null;
  audioUrl: string | null;
  passage: string | null;
  imageUrl: string | null;
  description: string | null;
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
  const [result, setResult] = useState<{ score: number; band: number; correct: Record<string, boolean> } | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [showFill, setShowFill] = useState(false);
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
      setResult(await res.json());
    } catch {
      setResult(null);
    }
    setLoading(false);
  }

  handleSubmitRef.current = handleSubmit;

  function setAnswer(qId: string, val: string) {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  }

  function fillAnswers() {
    const filled: Record<string, string> = {};
    for (const section of test.sections)
      for (const q of section.questions)
        filled[q.id] = q.correctAnswer;
    setAnswers(filled);
    setShowFill(false);
  }

  /* ── Results screen ── */
  if (result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Test Complete!</h1>
          <p className="text-text-secondary">{test.title}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-8 max-w-xs mx-auto">
          <Card><CardContent className="p-6 text-center">
            <div className="text-sm text-text-secondary mb-1">Score</div>
            <div className="text-3xl font-bold text-primary">{result.score}/40</div>
          </CardContent></Card>
          <Card><CardContent className="p-6 text-center">
            <div className="text-sm text-text-secondary mb-1">Band</div>
            <div className={`text-3xl font-bold rounded-full px-3 py-1 inline-block ${getBandBg(result.band)}`}>
              {formatBandScore(result.band)}
            </div>
          </CardContent></Card>
        </div>
        <div className="space-y-4 mb-8">
          {test.sections.map((section) => (
            <Card key={section.id}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-text-primary mb-4">
                  Section {section.sectionNum}{section.title ? ` — ${section.title}` : ""}
                </h3>
                <div className="space-y-3">
                  {section.questions.map((q) => {
                    const userAns = answers[q.id] ?? "";
                    const isCorrect = result.correct[q.id];
                    return (
                      <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                        <div className="flex items-start gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${isCorrect ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>Q{q.questionNum}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-text-primary mb-1">{q.prompt}</p>
                            <p className="text-xs text-text-secondary">Your answer: <span className={isCorrect ? "text-success font-medium" : "text-danger font-medium"}>{userAns || "(blank)"}</span></p>
                            {!isCorrect && <p className="text-xs text-success font-medium mt-0.5">Correct: {q.correctAnswer.replace("|", " or ")}</p>}
                            {q.explanation && <p className="text-xs text-text-secondary mt-1 italic">{q.explanation}</p>}
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
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sticky top-16 bg-muted py-3 z-10 gap-3 flex-wrap">
        <div>
          <h1 className="font-bold text-text-primary text-sm">{test.title}</h1>
          <p className="text-xs text-text-secondary">Part {activeSection + 1} of {test.sections.length}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={() => setShowFill(!showFill)} className="text-xs">Fill Answers</Button>
          <div className={`text-lg font-bold font-mono ${timeLeft < 300 ? "text-danger" : "text-primary"}`}>{formatDuration(timeLeft)}</div>
          <Button variant="danger" size="sm" onClick={handleSubmit} loading={loading}>Submit</Button>
        </div>
      </div>

      {showFill && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between gap-3">
          <p className="text-xs text-yellow-800">Fill all answers with correct answers (practice mode)?</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowFill(false)}>Cancel</Button>
            <Button size="sm" onClick={fillAnswers}>Yes, Fill</Button>
          </div>
        </div>
      )}

      {/* Audio */}
      <div className="mb-4 bg-white border border-border rounded-xl p-3">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Part {activeSection + 1} Audio</p>
        <audio key={currentSection.audioUrl ?? test.audioUrl} ref={audioRef}
          src={currentSection.audioUrl ?? test.audioUrl} controls className="w-full" controlsList="nodownload" />
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {test.sections.map((s, i) => (
          <button key={s.id} onClick={() => setActiveSection(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${i === activeSection ? "bg-primary text-white" : "bg-white border border-border text-text-secondary hover:text-primary"}`}>
            Part {s.sectionNum}
          </button>
        ))}
      </div>

      {/* Two-column layout: LEFT = content, RIGHT = answers */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 items-start">

        {/* LEFT: image + passage or question prompts */}
        <Card>
          <CardContent className="p-5">
            {currentSection.imageUrl && <SectionImages raw={currentSection.imageUrl} />}
            {currentSection.title && (
              <h2 className="text-base font-semibold text-text-primary mb-1">{currentSection.title}</h2>
            )}
            {currentSection.description && (
              <p className="text-xs text-text-secondary italic mb-4">{currentSection.description}</p>
            )}
            {currentSection.passage ? (
              <PassageDisplay passage={currentSection.passage} questions={currentSection.questions} />
            ) : !currentSection.imageUrl ? (
              <QuestionList questions={currentSection.questions} />
            ) : (
              <p className="text-xs text-text-secondary italic mt-2">Listen to the audio and write your answers on the right →</p>
            )}
          </CardContent>
        </Card>

        {/* RIGHT: answer inputs — always sticky */}
        <div className="sticky top-32">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
                Answers — Part {currentSection.sectionNum}
              </p>
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {(() => {
                  const offset = test.sections
                    .slice(0, activeSection)
                    .reduce((sum, s) => sum + s.questions.length, 0);
                  return currentSection.questions.map((q, i) => (
                    <AnswerInput
                      key={q.id}
                      question={q}
                      qNum={offset + i + 1}
                      value={answers[q.id] ?? ""}
                      onChange={(v) => setAnswer(q.id, v)}
                    />
                  ));
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" disabled={activeSection === 0} onClick={() => setActiveSection((p) => p - 1)}>← Previous Part</Button>
        {activeSection < test.sections.length - 1
          ? <Button onClick={() => setActiveSection((p) => p + 1)}>Next Part →</Button>
          : <Button onClick={handleSubmit} loading={loading}>Submit Test</Button>}
      </div>
    </div>
  );
}

/* ── Section images: supports single URL (legacy) or JSON array ── */
function SectionImages({ raw }: { raw: string }) {
  let urls: string[] = [];
  try {
    const p = JSON.parse(raw);
    urls = Array.isArray(p) ? p : [raw];
  } catch {
    urls = [raw];
  }
  if (urls.length === 0) return null;
  return (
    <div className={`mb-4 ${urls.length > 1 ? "space-y-3" : ""}`}>
      {urls.map((url, i) => (
        <img key={i} src={url} alt={`diagram ${i + 1}`}
          className="w-full rounded-lg border border-border object-contain max-h-[520px] bg-gray-50" />
      ))}
    </div>
  );
}

/* ── Passage display: shows [N] as numbered circle badges (inputs live in right panel) ── */
function PassageDisplay({ passage, questions }: { passage: string; questions: Question[] }) {
  const parts = passage.split(/\[(\d+)\]/);
  return (
    <div className="text-sm text-text-primary leading-relaxed">
      {parts.map((part, i) => {
        if (i % 2 === 0) return <span key={i} style={{ whiteSpace: "pre-wrap" }}>{part}</span>;
        const qNum = parseInt(part);
        const exists = questions.some((q) => q.questionNum === qNum);
        if (!exists) return <span key={i} className="text-xs text-text-secondary">[{part}]</span>;
        return (
          <span key={i} className="inline-flex items-center justify-center w-6 h-6 mx-0.5 rounded-full bg-primary text-white text-xs font-bold align-middle shrink-0">
            {qNum}
          </span>
        );
      })}
    </div>
  );
}

/* ── Question list: shows prompts read-only for sections without a passage ── */
function QuestionList({ questions }: { questions: Question[] }) {
  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <div key={q.id} className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-50 text-primary text-xs font-bold shrink-0 mt-0.5">
            {q.questionNum}
          </span>
          <div>
            {q.title && <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-0.5">{q.title}</p>}
            <p className="text-sm text-text-primary">{q.prompt}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Answer input for the right panel ── */
function AnswerInput({ question, qNum, value, onChange }: {
  question: Question;
  qNum: number;
  value: string;
  onChange: (v: string) => void;
}) {
  const options = question.options ? (JSON.parse(question.options) as string[]) : null;

  return (
    <div className="flex items-start gap-2">
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-50 text-primary text-xs font-bold shrink-0 mt-1">
        {qNum}
      </span>
      <div className="flex-1 min-w-0">
        {options ? (
          question.type === "MATCHING" ? (
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-2 py-1.5 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-light bg-white"
            >
              <option value="">— select —</option>
              {options.map((opt, i) => {
                const letter = opt.match(/^([A-H])\./)?.[1] ?? String.fromCharCode(65 + i);
                return <option key={i} value={letter}>{opt}</option>;
              })}
            </select>
          ) : (
            <div className="space-y-1.5">
              {options.map((opt, i) => {
                const letter = opt.match(/^([A-D])\./)?.[1] ?? String.fromCharCode(65 + i);
                const text = opt.replace(/^[A-D]\.\s*/, "");
                const selected = value === opt;
                return (
                  <label key={i} className={`flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1.5 transition-colors ${selected ? "bg-primary-50 ring-1 ring-primary" : "hover:bg-gray-50"}`}>
                    <input type="radio" name={`q-${question.id}`} value={opt} checked={selected}
                      onChange={() => onChange(opt)} className="sr-only" />
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${selected ? "bg-primary text-white" : "bg-gray-100 text-text-secondary"}`}>{letter}</span>
                    <span className={`text-sm leading-snug ${selected ? "text-primary font-medium" : "text-text-primary"}`}>{text}</span>
                  </label>
                );
              })}
            </div>
          )
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type answer..."
            className="w-full px-2 py-1.5 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
        )}
      </div>
    </div>
  );
}

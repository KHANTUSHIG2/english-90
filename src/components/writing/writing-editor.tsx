"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDuration, formatBandScore } from "@/lib/utils";

interface Topic {
  id: string;
  taskType: string;
  title: string;
  prompt: string;
  imageUrl: string | null;
  sampleAnswer: string | null;
  category: string;
}

interface AiFeedback {
  overallBand: number;
  criteria: {
    taskAchievement: number;
    coherenceCohesion: number;
    lexicalResource: number;
    grammarAccuracy: number;
  };
  grammarErrors: Array<{ original: string; corrected: string; explanation: string }>;
  vocabularySuggestions: Array<{ original: string; suggestion: string; reason: string }>;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
}

export function WritingEditor({
  topic,
  userId: _userId,
  minWords,
  timeLimit,
}: {
  topic: Topic;
  userId: string;
  minWords: number;
  timeLimit: number;
}) {
  const router = useRouter();
  const [essay, setEssay] = useState("");
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<AiFeedback | null>(null);
  const [showSample, setShowSample] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;
  const hasEnough = wordCount >= minWords;

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => {
      setTimeLeft((p) => (p <= 1 ? 0 : p - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [submitted]);

  async function handleSubmit() {
    if (!essay.trim() || loading) return;
    setLoading(true);
    setSubmitted(true);
    try {
      const res = await fetch("/api/writing/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId: topic.id, essayText: essay, wordCount }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
    } catch {
      setFeedback(null);
    }
    setLoading(false);
  }

  if (feedback) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-text-primary mb-1">Your Writing Feedback</h1>
        <p className="text-text-secondary text-sm mb-8">{topic.title}</p>

        {/* Band score overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="col-span-2 md:col-span-1 bg-primary text-white border-0">
            <CardContent className="p-4 text-center">
              <div className="text-xs font-medium opacity-80 mb-1">Overall Band</div>
              <div className="text-4xl font-bold">{formatBandScore(feedback.overallBand)}</div>
            </CardContent>
          </Card>
          {[
            { label: "Task Achievement", val: feedback.criteria.taskAchievement },
            { label: "Coherence & Cohesion", val: feedback.criteria.coherenceCohesion },
            { label: "Lexical Resource", val: feedback.criteria.lexicalResource },
            { label: "Grammar Accuracy", val: feedback.criteria.grammarAccuracy },
          ].map((c) => (
            <Card key={c.label}>
              <CardContent className="p-4 text-center">
                <div className="text-xs text-text-secondary mb-1">{c.label}</div>
                <div className={`text-2xl font-bold ${c.val >= 7 ? "text-success" : c.val >= 5 ? "text-warning" : "text-danger"}`}>
                  {formatBandScore(c.val)}
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                  <div className={`rounded-full h-1.5 ${c.val >= 7 ? "bg-success" : c.val >= 5 ? "bg-warning" : "bg-danger"}`} style={{ width: `${(c.val / 9) * 100}%` }} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall feedback */}
        <Card className="mb-6">
          <CardHeader><CardTitle>Overall Feedback</CardTitle></CardHeader>
          <CardContent>
            <p className="text-text-secondary leading-relaxed">{feedback.overallFeedback}</p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-xs font-semibold text-success uppercase tracking-wide mb-2">Strengths</div>
                <ul className="space-y-1">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                      <span className="text-success mt-0.5">✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold text-warning uppercase tracking-wide mb-2">Areas to Improve</div>
                <ul className="space-y-1">
                  {feedback.improvements.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                      <span className="text-warning mt-0.5">→</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grammar errors */}
        {feedback.grammarErrors.length > 0 && (
          <Card className="mb-6">
            <CardHeader><CardTitle>Grammar Corrections ({feedback.grammarErrors.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {feedback.grammarErrors.map((e, i) => (
                  <div key={i} className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="line-through text-danger">{e.original}</span>
                      <span className="text-text-secondary">→</span>
                      <span className="font-medium text-success">{e.corrected}</span>
                    </div>
                    <div className="text-xs text-text-secondary">{e.explanation}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vocabulary suggestions */}
        {feedback.vocabularySuggestions.length > 0 && (
          <Card className="mb-6">
            <CardHeader><CardTitle>Vocabulary Upgrades ({feedback.vocabularySuggestions.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {feedback.vocabularySuggestions.map((v, i) => (
                  <div key={i} className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="bg-blue-100 px-2 py-0.5 rounded text-primary">{v.original}</span>
                      <span className="text-text-secondary">→</span>
                      <span className="font-semibold text-primary">{v.suggestion}</span>
                    </div>
                    <div className="text-xs text-text-secondary">{v.reason}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Your essay */}
        <Card className="mb-6">
          <CardHeader><CardTitle>Your Essay ({wordCount} words)</CardTitle></CardHeader>
          <CardContent>
            <div className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap bg-muted rounded-lg p-4">
              {essay}
            </div>
          </CardContent>
        </Card>

        {/* Sample answer */}
        {topic.sampleAnswer && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Band 9 Model Answer</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setShowSample(!showSample)}>
                  {showSample ? "Hide" : "Show"}
                </Button>
              </div>
            </CardHeader>
            {showSample && (
              <CardContent>
                <div className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap bg-green-50 rounded-lg p-4 border border-green-100">
                  {topic.sampleAnswer}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push("/practice/writing")}>Try Another Topic</Button>
          <Button onClick={() => router.push("/dashboard")}>View Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Badge variant="info" className="mb-2">
            {topic.taskType.replace(/_/g, " ")}
          </Badge>
          <h1 className="text-xl font-bold text-text-primary">{topic.category}</h1>
        </div>
        <div className={`text-xl font-mono font-bold ${timeLeft < 300 ? "text-danger" : "text-primary"}`}>
          {formatDuration(timeLeft)}
        </div>
      </div>

      {/* Prompt */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">Task Prompt</p>
          {topic.imageUrl && (() => {
            let urls: string[] = [];
            try { const p = JSON.parse(topic.imageUrl!); urls = Array.isArray(p) ? p : [topic.imageUrl!]; }
            catch { urls = [topic.imageUrl!]; }
            return urls.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={url} alt={`Task diagram ${i + 1}`} className="w-full max-h-72 object-contain mb-4 rounded-lg border border-border bg-gray-50" />
            ));
          })()}
          <p className="text-text-primary leading-relaxed">{topic.prompt}</p>
          <p className="text-xs text-text-secondary mt-3">
            Write at least <strong>{minWords} words</strong> in {formatDuration(timeLimit)}.
          </p>
        </CardContent>
      </Card>

      {/* Editor */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-text-primary">Your Essay</label>
          <span className={`text-sm font-medium ${hasEnough ? "text-success" : "text-text-secondary"}`}>
            {wordCount} / {minWords}+ words
          </span>
        </div>
        <textarea
          ref={textareaRef}
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          placeholder={`Write your essay here. Aim for at least ${minWords} words.`}
          className="w-full h-96 px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-light resize-none text-sm leading-relaxed"
          disabled={submitted}
        />
        <div className="flex justify-end mt-1">
          <div className="w-48 bg-gray-100 rounded-full h-1.5">
            <div
              className={`rounded-full h-1.5 transition-all ${hasEnough ? "bg-success" : "bg-primary-light"}`}
              style={{ width: `${Math.min(100, (wordCount / minWords) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-xs text-blue-700">
        <strong>Tips:</strong> Use complex sentences, a variety of vocabulary, and clear paragraph
        structure. Link ideas with cohesive devices (However, Furthermore, In contrast...).
      </div>

      <div className="flex gap-3">
        <Button
          size="lg"
          onClick={handleSubmit}
          loading={loading}
          disabled={!essay.trim()}
        >
          Submit for AI Feedback
        </Button>
        <Button size="lg" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

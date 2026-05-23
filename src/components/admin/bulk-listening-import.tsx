"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const EXAMPLE = JSON.stringify([
  {
    title: "Cambridge IELTS 18 Academic Test 1",
    audioUrl: "https://example.com/audio.mp3",
    duration: 1800,
    isPublished: true,
    sections: [
      {
        sectionNum: 1,
        title: "A phone conversation about renting",
        questions: [
          { questionNum: 1, type: "FILL_BLANK", prompt: "The caller's surname is ___", correctAnswer: "Johnson" },
          { questionNum: 2, type: "FILL_BLANK", prompt: "The street address is ___ Oak Road", correctAnswer: "14" },
          { questionNum: 3, type: "MCQ", prompt: "What type of property is available?", options: ["Flat", "House", "Studio"], correctAnswer: "Flat" },
        ],
      },
      {
        sectionNum: 2,
        title: "A talk about a local museum",
        questions: [
          { questionNum: 11, type: "MCQ", prompt: "The museum first opened in ___", options: ["1892", "1902", "1912"], correctAnswer: "1902" },
        ],
      },
    ],
  },
], null, 2);

export function BulkListeningImport() {
  const router = useRouter();
  const [json, setJson] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ created: number; errors: string[] } | null>(null);
  const [parseError, setParseError] = useState("");

  async function handleImport() {
    setParseError("");
    setResult(null);
    let parsed: any;
    try {
      parsed = JSON.parse(json);
    } catch {
      setParseError("Invalid JSON — check the format and try again.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/listening/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      setResult(data);
      if (data.created > 0) { setJson(""); router.refresh(); }
    } catch {
      setParseError("Network error — please try again.");
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-text-primary mb-1">Bulk JSON Import</h3>
          <p className="text-xs text-text-secondary">
            Paste an array of tests in JSON format. Each test needs{" "}
            <code className="bg-gray-100 px-1 rounded">title</code>,{" "}
            <code className="bg-gray-100 px-1 rounded">audioUrl</code>, and{" "}
            <code className="bg-gray-100 px-1 rounded">sections</code>.
          </p>
        </div>

        <details className="text-xs">
          <summary className="cursor-pointer text-primary font-medium">Show example format</summary>
          <pre className="mt-2 bg-gray-50 border border-border rounded-lg p-3 overflow-x-auto text-xs text-text-secondary leading-relaxed">
            {EXAMPLE}
          </pre>
        </details>

        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          placeholder="Paste your JSON array here..."
          rows={14}
          className="w-full px-3 py-2 border border-border rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-light resize-y"
        />

        {parseError && (
          <div className="px-3 py-2 bg-red-50 border border-red-200 text-danger text-xs rounded-lg">
            {parseError}
          </div>
        )}

        {result && (
          <div className={`px-3 py-2 rounded-lg text-xs border ${result.created > 0 ? "bg-green-50 border-green-200 text-success" : "bg-red-50 border-red-200 text-danger"}`}>
            <p className="font-semibold">✓ Imported {result.created} test{result.created !== 1 ? "s" : ""}</p>
            {result.errors.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            )}
          </div>
        )}

        <Button onClick={handleImport} loading={loading} disabled={!json.trim()} className="w-full">
          Import Tests
        </Button>
      </CardContent>
    </Card>
  );
}

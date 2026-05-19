"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface Attempt {
  completedAt: Date | string;
  bandScore: number | null;
}
interface Submission {
  submittedAt: Date | string;
  overallBand: number | null;
}

export function BandChart({
  listeningAttempts,
  readingAttempts,
  writingSubmissions,
}: {
  listeningAttempts: Attempt[];
  readingAttempts: Attempt[];
  writingSubmissions: Submission[];
}) {
  type Row = { date: string; Listening?: number; Reading?: number; Writing?: number };
  const map: Record<string, Row> = {};

  listeningAttempts.forEach((a) => {
    const d = new Date(a.completedAt).toLocaleDateString();
    if (!map[d]) map[d] = { date: d };
    map[d].Listening = a.bandScore ?? undefined;
  });
  readingAttempts.forEach((a) => {
    const d = new Date(a.completedAt).toLocaleDateString();
    if (!map[d]) map[d] = { date: d };
    map[d].Reading = a.bandScore ?? undefined;
  });
  writingSubmissions.forEach((s) => {
    const d = new Date(s.submittedAt).toLocaleDateString();
    if (!map[d]) map[d] = { date: d };
    map[d].Writing = s.overallBand ?? undefined;
  });

  const data = Object.values(map).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-text-secondary text-sm">
        Complete tests to see your progress chart here.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis domain={[0, 9]} ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(v: any) => (typeof v === "number" ? v.toFixed(1) : v)} />
        <Legend />
        <Line type="monotone" dataKey="Listening" stroke="#1E3A8A" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="Reading" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="Writing" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

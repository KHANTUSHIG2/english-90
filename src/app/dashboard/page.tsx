import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatBandScore, getBandBg } from "@/lib/utils";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BandChart } from "@/components/dashboard/band-chart";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = session.user.id;

  const [listeningAttempts, readingAttempts, writingSubmissions, vocabProgress] =
    await Promise.all([
      db.listeningAttempt.findMany({
        where: { userId },
        include: { test: { select: { title: true } } },
        orderBy: { completedAt: "desc" },
        take: 5,
      }),
      db.readingAttempt.findMany({
        where: { userId },
        include: { test: { select: { title: true } } },
        orderBy: { completedAt: "desc" },
        take: 5,
      }),
      db.writingSubmission.findMany({
        where: { userId },
        include: { topic: { select: { title: true, taskType: true } } },
        orderBy: { submittedAt: "desc" },
        take: 5,
      }),
      db.vocabularyProgress.count({ where: { userId, mastered: true } }),
    ]);

  const avgListening =
    listeningAttempts.length > 0
      ? listeningAttempts.reduce((s, a) => s + (a.bandScore ?? 0), 0) /
        listeningAttempts.length
      : null;

  const avgReading =
    readingAttempts.length > 0
      ? readingAttempts.reduce((s, a) => s + (a.bandScore ?? 0), 0) /
        readingAttempts.length
      : null;

  const avgWriting =
    writingSubmissions.length > 0
      ? writingSubmissions.reduce((s, w) => s + (w.overallBand ?? 0), 0) /
        writingSubmissions.length
      : null;

  // chartData built inside BandChart component

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          Welcome back, {session.user.name ?? "Student"}!
        </h1>
        <p className="text-text-secondary mt-1">
          {session.user.role === "ADMIN" || session.user.role === "TEACHER" ? (
            <span>
              You have admin access.{" "}
              <Link href="/admin" className="text-primary hover:underline">
                Go to Admin Dashboard
              </Link>
            </span>
          ) : (
            "Here's your IELTS progress at a glance."
          )}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Listening"
          value={avgListening != null ? formatBandScore(avgListening) : "—"}
          sub={`${listeningAttempts.length} test${listeningAttempts.length !== 1 ? "s" : ""}`}
          color={avgListening ? getBandBg(avgListening) : "bg-gray-100 text-gray-700"}
          href="/practice/listening"
        />
        <StatCard
          label="Reading"
          value={avgReading != null ? formatBandScore(avgReading) : "—"}
          sub={`${readingAttempts.length} test${readingAttempts.length !== 1 ? "s" : ""}`}
          color={avgReading ? getBandBg(avgReading) : "bg-gray-100 text-gray-700"}
          href="/practice/reading"
        />
        <StatCard
          label="Writing"
          value={avgWriting != null ? formatBandScore(avgWriting) : "—"}
          sub={`${writingSubmissions.length} essay${writingSubmissions.length !== 1 ? "s" : ""}`}
          color={avgWriting ? getBandBg(avgWriting) : "bg-gray-100 text-gray-700"}
          href="/practice/writing"
        />
        <StatCard
          label="Vocabulary"
          value={String(vocabProgress)}
          sub="words mastered"
          color="bg-purple-100 text-purple-800"
          href="/practice/vocabulary"
        />
      </div>

      {/* Chart + recent activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Band Score Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <BandChart listeningAttempts={listeningAttempts as any} readingAttempts={readingAttempts as any} writingSubmissions={writingSubmissions as any} />
            </CardContent>
          </Card>
        </div>

        {/* Recent activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...listeningAttempts.map((a) => ({ type: "Listening", title: a.test.title, band: a.bandScore, date: a.completedAt })),
                ...readingAttempts.map((a) => ({ type: "Reading", title: a.test.title, band: a.bandScore, date: a.completedAt })),
                ...writingSubmissions.map((s) => ({ type: "Writing", title: s.topic.title, band: s.overallBand, date: s.submittedAt })),
              ]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 8)
                .map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="min-w-0">
                      <div className="text-xs text-text-secondary">{item.type}</div>
                      <div className="text-sm font-medium text-text-primary truncate">{item.title}</div>
                      <div className="text-xs text-text-secondary">
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </div>
                    {item.band != null && (
                      <Badge variant={item.band >= 7 ? "success" : item.band >= 5 ? "warning" : "danger"}>
                        {formatBandScore(item.band)}
                      </Badge>
                    )}
                  </div>
                ))}
              {listeningAttempts.length === 0 && readingAttempts.length === 0 && writingSubmissions.length === 0 && (
                <p className="text-text-secondary text-sm py-4 text-center">
                  No activity yet. Start practising!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: "/practice/listening", label: "Practice Listening", icon: "🎧" },
          { href: "/practice/reading", label: "Practice Reading", icon: "📖" },
          { href: "/practice/writing", label: "Write an Essay", icon: "✍️" },
          { href: "/practice/vocabulary", label: "Learn Vocabulary", icon: "📚" },
        ].map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer text-center">
              <CardContent className="p-4">
                <div className="text-2xl mb-2">{link.icon}</div>
                <div className="text-sm font-medium text-text-primary">{link.label}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label, value, sub, color, href,
}: {
  label: string; value: string; sub: string; color: string; href: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
            {label}
          </div>
          <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-bold ${color} mb-1`}>
            {value}
          </div>
          <div className="text-xs text-text-secondary">{sub}</div>
        </CardContent>
      </Card>
    </Link>
  );
}

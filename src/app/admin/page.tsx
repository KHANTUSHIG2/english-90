export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const [
    userCount,
    listeningCount,
    readingCount,
    writingCount,
    vocabularyCount,
    grammarCount,
    submissionsToday,
    recentSubmissions,
  ] = await Promise.all([
    db.user.count(),
    db.listeningTest.count(),
    db.readingTest.count(),
    db.writingTopic.count(),
    db.vocabularyWord.count(),
    db.grammarLesson.count(),
    db.writingSubmission.count({
      where: { submittedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    }),
    db.writingSubmission.findMany({
      take: 10,
      orderBy: { submittedAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        topic: { select: { title: true, taskType: true } },
      },
    }),
  ]);

  const stats = [
    { label: "Total Students", value: userCount, icon: "👥", href: "/admin/users" },
    { label: "Listening Tests", value: listeningCount, icon: "🎧", href: "/admin/listening" },
    { label: "Reading Tests", value: readingCount, icon: "📖", href: "/admin/reading" },
    { label: "Writing Topics", value: writingCount, icon: "✍️", href: "/admin/writing" },
    { label: "Vocab Words", value: vocabularyCount, icon: "📚", href: "/admin/vocabulary" },
    { label: "Grammar Lessons", value: grammarCount, icon: "🔤", href: "/admin/grammar" },
    { label: "Essays Today", value: submissionsToday, icon: "📝", href: "/admin/writing" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
          <p className="text-text-secondary">Welcome, {session.user.name ?? session.user.email}</p>
        </div>
        <Link href="/dashboard" className="text-sm text-primary hover:underline">
          Student View
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-2xl font-bold text-primary">{s.value}</div>
                <div className="text-xs text-text-secondary">{s.label}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[
          { href: "/admin/listening", label: "Listening Tests", icon: "🎧", desc: "Upload audio, add questions, publish tests" },
          { href: "/admin/reading", label: "Reading Tests", icon: "📖", desc: "Add passages, questions, and answers" },
          { href: "/admin/writing", label: "Writing Topics", icon: "✍️", desc: "Add Task 1 and Task 2 prompts" },
          { href: "/admin/vocabulary", label: "Vocabulary", icon: "📚", desc: "Add words, definitions, and collocations" },
          { href: "/admin/grammar", label: "Grammar Lessons", icon: "🔤", desc: "Add grammar lessons with HTML content" },
        ].map((a) => (
          <Link key={a.href} href={a.href}>
            <Card className="border border-border hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">{a.icon}</div>
                <div className="font-semibold text-text-primary mb-1">{a.label}</div>
                <div className="text-sm text-text-secondary">{a.desc}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Writing Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSubmissions.length === 0 ? (
            <p className="text-text-secondary text-sm py-4">No submissions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-semibold text-text-secondary">Student</th>
                    <th className="pb-3 font-semibold text-text-secondary">Topic</th>
                    <th className="pb-3 font-semibold text-text-secondary">Task</th>
                    <th className="pb-3 font-semibold text-text-secondary">Band</th>
                    <th className="pb-3 font-semibold text-text-secondary">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((s) => (
                    <tr key={s.id} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium">{s.user.name ?? s.user.email}</td>
                      <td className="py-3 text-text-secondary truncate max-w-xs">{s.topic.title}</td>
                      <td className="py-3 text-text-secondary">{s.topic.taskType.replace(/_/g, " ")}</td>
                      <td className="py-3">
                        {s.overallBand != null && (
                          <span className={`font-bold ${s.overallBand >= 7 ? "text-success" : s.overallBand >= 5 ? "text-warning" : "text-danger"}`}>
                            {s.overallBand}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-text-secondary">
                        {new Date(s.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

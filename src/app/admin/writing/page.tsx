export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewWritingTopicForm } from "@/components/admin/new-writing-form";

export default async function AdminWritingPage() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) redirect("/dashboard");

  const topics = await db.writingTopic.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { submissions: true } } },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-primary hover:underline">← Admin</Link>
        <h1 className="text-2xl font-bold text-text-primary mt-1">Writing Topics</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Add New Topic</h2>
          <NewWritingTopicForm />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Topics ({topics.length})</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {topics.map((t) => (
              <Card key={t.id}>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-text-primary line-clamp-2 mb-1">{t.title}</div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Badge variant="info">{t.taskType.replace(/_/g, " ")}</Badge>
                    <span>{t.category}</span>
                    <span>{t._count.submissions} submissions</span>
                    <Badge variant={t.isPublished ? "success" : "warning"}>
                      {t.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {topics.length === 0 && (
              <p className="text-text-secondary text-sm">No topics yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

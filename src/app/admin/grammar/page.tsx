export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewGrammarForm } from "@/components/admin/new-grammar-form";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminGrammarPage() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) redirect("/dashboard");

  const lessons = await db.grammarLesson.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  const categories = [...new Set(lessons.map((l) => l.category))];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-primary hover:underline">← Admin</Link>
        <h1 className="text-2xl font-bold text-text-primary mt-1">Grammar Lessons</h1>
        <p className="text-text-secondary text-sm mt-1">{lessons.length} lessons across {categories.length} categories</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Add New Lesson</h2>
          <NewGrammarForm />
        </div>

        {/* Lesson list */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">All Lessons ({lessons.length})</h2>
          <div className="space-y-6 max-h-[700px] overflow-y-auto pr-1">
            {categories.map((cat) => (
              <div key={cat}>
                <div className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                  {cat}
                </div>
                <div className="space-y-2">
                  {lessons
                    .filter((l) => l.category === cat)
                    .map((lesson) => (
                      <Card key={lesson.id}>
                        <CardContent className="p-3 flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-semibold text-sm text-text-primary line-clamp-1">
                                {lesson.title}
                              </span>
                              <Badge variant="info" className="text-xs flex-shrink-0">#{lesson.order}</Badge>
                            </div>
                            <p className="text-xs text-text-secondary line-clamp-1">
                              {lesson.content.replace(/<[^>]+>/g, " ").trim().slice(0, 80)}…
                            </p>
                          </div>
                          <DeleteButton id={lesson.id} endpoint="/api/admin/grammar" label="lesson" />
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
            {lessons.length === 0 && (
              <p className="text-text-secondary text-sm">No lessons yet. Add one on the left.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

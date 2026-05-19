export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function GrammarPage() {
  const lessons = await db.grammarLesson.findMany({ orderBy: { order: "asc" } });
  const categories = [...new Set(lessons.map((l) => l.category))];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">IELTS Grammar</h1>
        <p className="text-text-secondary">
          Master the grammar structures examiners reward in IELTS Writing and Speaking.
        </p>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">
          <div className="text-5xl mb-4">📝</div>
          <p>Grammar lessons coming soon!</p>
        </div>
      ) : (
        categories.map((cat) => (
          <div key={cat} className="mb-10">
            <h2 className="text-lg font-bold text-text-primary mb-4">{cat}</h2>
            <div className="space-y-4">
              {lessons
                .filter((l) => l.category === cat)
                .map((lesson) => (
                  <Card key={lesson.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{lesson.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="text-sm text-text-primary leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: lesson.content }}
                      />
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

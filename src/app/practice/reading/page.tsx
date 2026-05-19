export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function ReadingListPage() {
  const tests = await db.readingTest.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Reading Tests</h1>
        <p className="text-text-secondary">
          3 passages, 40 questions, 60 minutes. Academic and General Training available.
        </p>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">
          <div className="text-5xl mb-4">📖</div>
          <p>No tests available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tests.map((test, i) => (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-success font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-text-primary">{test.title}</div>
                    {test.description && (
                      <div className="text-sm text-text-secondary truncate">{test.description}</div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="info">{test.testType}</Badge>
                      <Badge variant={test.difficulty === "EASY" ? "success" : test.difficulty === "HARD" ? "danger" : "warning"}>
                        {test.difficulty}
                      </Badge>
                      <span className="text-xs text-text-secondary">60 min · 40 questions</span>
                    </div>
                  </div>
                </div>
                <Link href={`/practice/reading/${test.id}`} className="flex-shrink-0">
                  <Button size="sm" variant="secondary">Start Test</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

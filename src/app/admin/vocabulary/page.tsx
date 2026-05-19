export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewVocabularyForm } from "@/components/admin/new-vocabulary-form";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminVocabularyPage() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) redirect("/dashboard");

  const words = await db.vocabularyWord.findMany({
    orderBy: [{ category: "asc" }, { word: "asc" }],
    include: { _count: { select: { progress: true } } },
  });

  const categories = [...new Set(words.map((w) => w.category))];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-primary hover:underline">← Admin</Link>
        <h1 className="text-2xl font-bold text-text-primary mt-1">Vocabulary Words</h1>
        <p className="text-text-secondary text-sm mt-1">{words.length} words across {categories.length} categories</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Add New Word</h2>
          <NewVocabularyForm />
        </div>

        {/* Word list */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">All Words ({words.length})</h2>
          <div className="space-y-6 max-h-[700px] overflow-y-auto pr-1">
            {categories.map((cat) => (
              <div key={cat}>
                <div className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                  {cat}
                </div>
                <div className="space-y-2">
                  {words
                    .filter((w) => w.category === cat)
                    .map((w) => (
                      <Card key={w.id}>
                        <CardContent className="p-3 flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-semibold text-sm text-text-primary">{w.word}</span>
                              <Badge variant="info" className="text-xs">{w._count.progress} learners</Badge>
                            </div>
                            <p className="text-xs text-text-secondary line-clamp-1">{w.definition}</p>
                            {w.collocations && (
                              <p className="text-xs text-primary mt-0.5 line-clamp-1">{w.collocations}</p>
                            )}
                          </div>
                          <DeleteButton id={w.id} endpoint="/api/admin/vocabulary" label="word" />
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
            {words.length === 0 && (
              <p className="text-text-secondary text-sm">No words yet. Add one on the left.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

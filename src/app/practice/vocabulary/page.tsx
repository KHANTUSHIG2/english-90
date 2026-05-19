export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { VocabularyClient } from "@/components/vocabulary/vocabulary-client";

export default async function VocabularyPage() {
  const session = await getServerSession(authOptions);

  const words = await db.vocabularyWord.findMany({ orderBy: { category: "asc" } });

  let mastered: string[] = [];
  if (session) {
    const progress = await db.vocabularyProgress.findMany({
      where: { userId: session.user.id, mastered: true },
      select: { wordId: true },
    });
    mastered = progress.map((p) => p.wordId);
  }

  const categories = [...new Set(words.map((w) => w.category))];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">IELTS Vocabulary</h1>
        <p className="text-text-secondary">
          Academic Word List and topic-specific vocabulary. Click a word to see definition and
          collocations. Mark words as mastered to track progress.
        </p>
      </div>

      {words.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">
          <div className="text-5xl mb-4">📚</div>
          <p>Vocabulary words coming soon!</p>
        </div>
      ) : (
        <VocabularyClient words={words as any} categories={categories} mastered={mastered} userId={session?.user.id} />
      )}
    </div>
  );
}

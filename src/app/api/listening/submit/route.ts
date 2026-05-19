export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { scoreToBand } from "@/lib/utils";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { testId, answers } = await req.json();

  const test = await db.listeningTest.findUnique({
    where: { id: testId },
    include: {
      sections: { include: { questions: true } },
    },
  });

  if (!test) return NextResponse.json({ error: "Test not found" }, { status: 404 });

  const allQuestions = test.sections.flatMap((s) => s.questions);
  const correct: Record<string, boolean> = {};
  let score = 0;

  for (const q of allQuestions) {
    const userAns = (answers[q.id] ?? "").trim().toLowerCase();
    const correctAns = q.correctAnswer.trim().toLowerCase();
    const isCorrect = userAns === correctAns;
    correct[q.id] = isCorrect;
    if (isCorrect) score++;
  }

  const band = scoreToBand(score);

  await db.listeningAttempt.create({
    data: {
      userId: session.user.id,
      testId,
      answers: JSON.stringify(answers),
      score,
      bandScore: band,
    },
  });

  return NextResponse.json({ score, band, correct });
}

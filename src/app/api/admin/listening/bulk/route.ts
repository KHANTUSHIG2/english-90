export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const tests: any[] = Array.isArray(body) ? body : [body];

  if (tests.length === 0) {
    return NextResponse.json({ error: "No tests provided." }, { status: 400 });
  }

  const created: string[] = [];
  const errors: string[] = [];

  for (const t of tests) {
    if (!t.title || !t.audioUrl) {
      errors.push(`Skipped: missing title or audioUrl (${t.title ?? "unknown"})`);
      continue;
    }
    try {
      const test = await db.listeningTest.create({
        data: {
          title: t.title,
          description: t.description ?? null,
          audioUrl: t.audioUrl,
          difficulty: t.difficulty ?? "MEDIUM",
          duration: t.duration ?? 1800,
          isPublished: t.isPublished ?? false,
          sections: {
            create: (t.sections ?? []).map((s: any) => ({
              sectionNum: s.sectionNum,
              title: s.title ?? null,
              questions: {
                create: (s.questions ?? [])
                  .filter((q: any) => q.prompt && q.correctAnswer)
                  .map((q: any) => ({
                    questionNum: q.questionNum,
                    type: q.type ?? "FILL_BLANK",
                    prompt: q.prompt,
                    options: q.options ? JSON.stringify(q.options) : null,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation ?? null,
                  })),
              },
            })),
          },
        },
      });
      created.push(test.id);
    } catch (e: any) {
      errors.push(`Failed: ${t.title} — ${e.message}`);
    }
  }

  return NextResponse.json({ created: created.length, errors }, { status: 201 });
}

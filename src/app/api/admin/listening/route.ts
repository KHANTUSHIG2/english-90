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

  const { title, description, audioUrl, sections } = await req.json();

  if (!title || !audioUrl) {
    return NextResponse.json({ error: "Title and audioUrl are required." }, { status: 400 });
  }

  const test = await db.listeningTest.create({
    data: {
      title,
      description,
      audioUrl,
      difficulty: "MEDIUM",
      isPublished: false,
      sections: {
        create: sections.map((s: any) => ({
          sectionNum: s.sectionNum,
          title: s.title || null,
          audioUrl: s.audioUrl || null,
          imageUrl: s.imageUrl || null,
          passage: s.passage || null,
          questions: {
            create: s.questions
              .filter((q: any) => q.prompt && q.correctAnswer)
              .map((q: any) => ({
                questionNum: q.questionNum,
                type: q.type,
                title: q.title || null,
                prompt: q.prompt,
                options: q.options || null,
                correctAnswer: q.correctAnswer,
                audioTimestamp: q.audioTimestamp ?? null,
                explanation: q.explanation || null,
              })),
          },
        })),
      },
    },
  });

  return NextResponse.json({ id: test.id }, { status: 201 });
}

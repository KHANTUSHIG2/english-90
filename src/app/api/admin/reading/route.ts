import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, description, testType, difficulty, passages } = await req.json();

  if (!title) return NextResponse.json({ error: "Title required." }, { status: 400 });

  const test = await db.readingTest.create({
    data: {
      title,
      description,
      testType: testType ?? "ACADEMIC",
      difficulty: difficulty ?? "MEDIUM",
      isPublished: false,
      passages: {
        create: passages.map((p: any) => ({
          passageNum: p.passageNum,
          title: p.title,
          content: p.content,
          questions: {
            create: p.questions
              .filter((q: any) => q.prompt && q.correctAnswer)
              .map((q: any) => ({
                questionNum: q.questionNum,
                type: q.type,
                prompt: q.prompt,
                options: q.options || null,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation || null,
              })),
          },
        })),
      },
    },
  });

  return NextResponse.json({ id: test.id }, { status: 201 });
}

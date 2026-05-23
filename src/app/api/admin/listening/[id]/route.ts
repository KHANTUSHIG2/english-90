export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) return null;
  return session;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!await checkAuth()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const test = await db.listeningTest.findUnique({
    where: { id: params.id },
    include: {
      sections: {
        orderBy: { sectionNum: "asc" },
        include: { questions: { orderBy: { questionNum: "asc" } } },
      },
    },
  });
  if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(test);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!await checkAuth()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { title, description, audioUrl, sections } = body;

  if (!title || !audioUrl) {
    return NextResponse.json({ error: "Title and audio URL are required." }, { status: 400 });
  }

  try {
    // Delete existing sections (questions cascade)
    await db.listeningSection.deleteMany({ where: { testId: params.id } });

    const test = await db.listeningTest.update({
      where: { id: params.id },
      data: {
        title,
        description: description ?? null,
        audioUrl,
        sections: {
          create: (sections ?? []).map((s: any) => ({
            sectionNum: s.sectionNum,
            title: s.title ?? null,
            audioUrl: s.audioUrl ?? null,
            imageUrl: s.imageUrl ?? null,
            passage: s.passage ?? null,
            questions: {
              create: (s.questions ?? [])
                .filter((q: any) => q.prompt && q.correctAnswer)
                .map((q: any) => ({
                  questionNum: q.questionNum,
                  type: q.type ?? "FILL_BLANK",
                  title: q.title ?? null,
                  prompt: q.prompt,
                  options: q.options ? JSON.stringify(q.options) : null,
                  correctAnswer: q.correctAnswer,
                  audioTimestamp: q.audioTimestamp ?? null,
                  explanation: q.explanation ?? null,
                })),
            },
          })),
        },
      },
    });
    return NextResponse.json(test);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!await checkAuth()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    await db.listeningTest.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

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
  const { taskType, category, title, prompt, imageUrl, sampleAnswer, difficulty } = body;

  if (!title || !prompt) {
    return NextResponse.json({ error: "Title and prompt required." }, { status: 400 });
  }

  const topic = await db.writingTopic.create({
    data: {
      taskType,
      category,
      title,
      prompt,
      imageUrl: imageUrl || null,
      sampleAnswer: sampleAnswer || null,
      difficulty: difficulty ?? "MEDIUM",
      isPublished: true,
    },
  });

  return NextResponse.json({ id: topic.id }, { status: 201 });
}

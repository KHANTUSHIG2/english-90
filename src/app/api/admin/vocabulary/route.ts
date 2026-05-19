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
  const { word, definition, example, category, collocations, audioUrl } = body;

  if (!word || !definition || !example || !category) {
    return NextResponse.json({ error: "Word, definition, example and category are required." }, { status: 400 });
  }

  const created = await db.vocabularyWord.create({
    data: {
      word: word.trim(),
      definition: definition.trim(),
      example: example.trim(),
      category: category.trim(),
      collocations: collocations?.trim() || null,
      audioUrl: audioUrl?.trim() || null,
    },
  });

  return NextResponse.json({ id: created.id }, { status: 201 });
}

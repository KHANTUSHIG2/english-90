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
  const { title, category, content, order } = body;

  if (!title || !category || !content) {
    return NextResponse.json({ error: "Title, category and content are required." }, { status: 400 });
  }

  const created = await db.grammarLesson.create({
    data: {
      title: title.trim(),
      category: category.trim(),
      content: content.trim(),
      order: typeof order === "number" ? order : 0,
    },
  });

  return NextResponse.json({ id: created.id }, { status: 201 });
}

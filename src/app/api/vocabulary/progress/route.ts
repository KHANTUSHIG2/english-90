export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { wordId, mastered } = await req.json();

  await db.vocabularyProgress.upsert({
    where: { userId_wordId: { userId: session.user.id, wordId } },
    update: { mastered },
    create: { userId: session.user.id, wordId, mastered },
  });

  return NextResponse.json({ ok: true });
}

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

  const formData = await req.formData();
  const testId = formData.get("testId") as string;
  const type = formData.get("type") as string;

  if (!testId || !type) {
    return NextResponse.json({ error: "Missing testId or type" }, { status: 400 });
  }

  try {
    if (type === "listening") {
      const test = await db.listeningTest.findUnique({ where: { id: testId } });
      if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 });
      await db.listeningTest.update({
        where: { id: testId },
        data: { isPublished: !test.isPublished },
      });
    } else if (type === "reading") {
      const test = await db.readingTest.findUnique({ where: { id: testId } });
      if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 });
      await db.readingTest.update({
        where: { id: testId },
        data: { isPublished: !test.isPublished },
      });
    } else {
      return NextResponse.json({ error: "Unknown type" }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

  const referer = req.headers.get("referer") ?? "/admin/listening";
  return NextResponse.redirect(referer, { status: 303 });
}

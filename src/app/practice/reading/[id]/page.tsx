export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { ReadingTestClient } from "@/components/reading/test-client";

export default async function ReadingTestPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const test = await db.readingTest.findUnique({
    where: { id: params.id, isPublished: true },
    include: {
      passages: {
        orderBy: { passageNum: "asc" },
        include: {
          questions: { orderBy: { questionNum: "asc" } },
        },
      },
    },
  });

  if (!test) notFound();

  return <ReadingTestClient test={test as any} userId={session.user.id} />;
}

export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { ListeningTestClient } from "@/components/listening/test-client";

export default async function ListeningTestPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const test = await db.listeningTest.findUnique({
    where: { id: params.id, isPublished: true },
    include: {
      sections: {
        orderBy: { sectionNum: "asc" },
        include: {
          questions: { orderBy: { questionNum: "asc" } },
        },
      },
    },
  });

  if (!test) notFound();

  return <ListeningTestClient test={test as any} userId={session.user.id} />;
}

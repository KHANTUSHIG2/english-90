export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { WritingEditor } from "@/components/writing/writing-editor";

export default async function WritingTopicPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const topic = await db.writingTopic.findUnique({
    where: { id: params.id, isPublished: true },
  });

  if (!topic) notFound();

  const minWords = topic.taskType === "TASK2" ? 250 : 150;
  const timeLimit = topic.taskType === "TASK2" ? 2400 : 1200;

  return (
    <WritingEditor
      topic={topic as any}
      userId={session.user.id}
      minWords={minWords}
      timeLimit={timeLimit}
    />
  );
}

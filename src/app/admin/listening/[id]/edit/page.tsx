export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { EditListeningForm } from "@/components/admin/edit-listening-form";

export default async function EditListeningTestPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) redirect("/dashboard");

  const test = await db.listeningTest.findUnique({
    where: { id: params.id },
    include: {
      sections: {
        orderBy: { sectionNum: "asc" },
        include: { questions: { orderBy: { questionNum: "asc" } } },
      },
    },
  });

  if (!test) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/admin/listening" className="text-sm text-primary hover:underline">← Listening Tests</Link>
        <h1 className="text-2xl font-bold text-text-primary mt-1">Edit Test</h1>
        <p className="text-sm text-text-secondary mt-1">{test.title}</p>
      </div>
      <EditListeningForm test={test} />
    </div>
  );
}

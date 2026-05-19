export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewReadingTestForm } from "@/components/admin/new-reading-form";

export default async function AdminReadingPage() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) redirect("/dashboard");

  const tests = await db.readingTest.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { passages: true, attempts: true } } },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-primary hover:underline">← Admin</Link>
        <h1 className="text-2xl font-bold text-text-primary mt-1">Reading Tests</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Add New Test</h2>
          <NewReadingTestForm />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Existing Tests ({tests.length})</h2>
          <div className="space-y-3">
            {tests.map((test) => (
              <Card key={test.id}>
                <CardContent className="p-4">
                  <div className="font-medium text-text-primary text-sm">{test.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={test.isPublished ? "success" : "warning"}>
                      {test.isPublished ? "Published" : "Draft"}
                    </Badge>
                    <Badge variant="info">{test.testType}</Badge>
                    <span className="text-xs text-text-secondary">
                      {test._count.passages} passages · {test._count.attempts} attempts
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {tests.length === 0 && (
              <p className="text-text-secondary text-sm">No tests yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

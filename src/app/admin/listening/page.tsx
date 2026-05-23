export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewListeningTestForm } from "@/components/admin/new-listening-form";
import { BulkListeningImport } from "@/components/admin/bulk-listening-import";
import { DeleteTestButton } from "@/components/admin/delete-test-button";
import { PencilIcon } from "lucide-react";

export default async function AdminListeningPage() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) redirect("/dashboard");

  const tests = await db.listeningTest.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { sections: true, attempts: true } } },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-sm text-primary hover:underline">← Admin</Link>
          <h1 className="text-2xl font-bold text-text-primary mt-1">Listening Tests</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left column: add one + bulk import */}
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Add Single Test</h2>
            <NewListeningTestForm />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Bulk Import (JSON)</h2>
            <BulkListeningImport />
          </div>
        </div>

        {/* Test list */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Existing Tests ({tests.length})</h2>
          <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-1">
            {tests.map((test) => (
              <Card key={test.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium text-text-primary text-sm">{test.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={test.isPublished ? "success" : "warning"}>
                          {test.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <span className="text-xs text-text-secondary">
                          {test._count.sections} sections · {test._count.attempts} attempts
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link href={`/admin/listening/${test.id}/edit`}>
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <PencilIcon className="w-3 h-3" /> Edit
                        </Button>
                      </Link>
                      <PublishButton testId={test.id} isPublished={test.isPublished} />
                      <DeleteTestButton testId={test.id} type="listening" />
                    </div>
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

function PublishButton({ testId, isPublished }: { testId: string; isPublished: boolean }) {
  return (
    <form action={`/api/admin/tests/publish`} method="POST">
      <input type="hidden" name="testId" value={testId} />
      <input type="hidden" name="type" value="listening" />
      <Button size="sm" variant={isPublished ? "outline" : "primary"} type="submit">
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
    </form>
  );
}

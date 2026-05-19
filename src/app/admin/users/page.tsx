import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN"].includes(session.user.role)) redirect("/dashboard");

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { listeningAttempts: true, readingAttempts: true, writingSubmissions: true },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-primary hover:underline">← Admin</Link>
        <h1 className="text-2xl font-bold text-text-primary mt-1">User Management</h1>
        <p className="text-text-secondary mt-1">{users.length} registered users</p>
      </div>

      <Card>
        <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-semibold text-text-secondary">Name</th>
                  <th className="pb-3 font-semibold text-text-secondary">Email</th>
                  <th className="pb-3 font-semibold text-text-secondary">Role</th>
                  <th className="pb-3 font-semibold text-text-secondary">Target</th>
                  <th className="pb-3 font-semibold text-text-secondary">Activity</th>
                  <th className="pb-3 font-semibold text-text-secondary">Joined</th>
                  <th className="pb-3 font-semibold text-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium">{user.name ?? "—"}</td>
                    <td className="py-3 text-text-secondary">{user.email}</td>
                    <td className="py-3">
                      <Badge variant={user.role === "ADMIN" ? "danger" : user.role === "TEACHER" ? "warning" : "info"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 text-text-secondary">{user.targetBand ?? "—"}</td>
                    <td className="py-3 text-xs text-text-secondary">
                      L:{user._count.listeningAttempts} R:{user._count.readingAttempts} W:{user._count.writingSubmissions}
                    </td>
                    <td className="py-3 text-text-secondary">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <Badge variant={user.isActive ? "success" : "danger"}>
                        {user.isActive ? "Active" : "Suspended"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

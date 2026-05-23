export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChangePasswordForm } from "@/components/admin/change-password-form";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) redirect("/dashboard");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, password: true, createdAt: true },
  });
  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-primary hover:underline">← Admin</Link>
        <h1 className="text-2xl font-bold text-text-primary mt-1">Settings</h1>
      </div>

      {/* Account info */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold text-text-primary mb-4">Account</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-text-secondary w-20 shrink-0">Name</span>
              <span className="font-medium text-text-primary">{user.name ?? "—"}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-text-secondary w-20 shrink-0">Email</span>
              <span className="font-medium text-text-primary">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-text-secondary w-20 shrink-0">Role</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${user.role === "ADMIN" ? "bg-primary text-white" : "bg-primary-50 text-primary"}`}>
                {user.role}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-text-secondary w-20 shrink-0">Member since</span>
              <span className="text-text-primary">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <ChangePasswordForm hasPassword={!!user.password} />
    </div>
  );
}

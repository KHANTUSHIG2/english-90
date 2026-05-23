"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function ChangePasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match."); return;
    }
    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters."); return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Password changed successfully!");
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setError(data.error ?? "Failed.");
      }
    } catch { setError("Network error."); }
    setLoading(false);
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-base font-semibold text-text-primary mb-4">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
          {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-danger text-sm rounded-lg">{error}</div>}
          {success && <div className="px-4 py-3 bg-green-50 border border-green-200 text-success text-sm rounded-lg">{success}</div>}

          {hasPassword && (
            <Input
              label="Current Password"
              type="password"
              value={form.currentPassword}
              onChange={update("currentPassword")}
              required
              autoComplete="current-password"
            />
          )}
          <Input
            label="New Password"
            type="password"
            value={form.newPassword}
            onChange={update("newPassword")}
            required
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
            required
            autoComplete="new-password"
          />
          <Button type="submit" loading={loading} className="w-full">
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

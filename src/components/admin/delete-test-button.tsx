"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeleteTestButton({ testId, type }: { testId: string; type: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this test? This cannot be undone.")) return;
    setLoading(true);
    await fetch(`/api/admin/${type}/${testId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <Button size="sm" variant="outline" onClick={handleDelete} loading={loading}
      className="text-danger border-danger/30 hover:bg-red-50">
      Delete
    </Button>
  );
}

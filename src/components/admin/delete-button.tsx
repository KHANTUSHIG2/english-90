"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  id: string;
  endpoint: string;
  label: string;
}

export function DeleteButton({ id, endpoint, label }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button variant="danger" size="sm" loading={loading} onClick={handleDelete}>
          Yes
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
          No
        </Button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex-shrink-0 text-text-secondary hover:text-danger transition-colors p-1 rounded"
      title={`Delete ${label}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}

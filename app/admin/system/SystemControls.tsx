"use client";

import { useState, useTransition } from "react";
import { lockSystem } from "@/app/actions/admin";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import type { SystemConfig } from "@/types";

export function SystemControls({ config }: { config: SystemConfig | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isLocked = config?.isLocked ?? false;

  function handleToggle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await lockSystem({
        isLocked: !isLocked,
        lockReason: (data.get("lockReason") as string) || undefined,
      });
      if (res.success) router.refresh();
      else setError(res.error);
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-3 h-3 rounded-full ${isLocked ? "bg-red-500" : "bg-green-500"}`} />
        <span className="font-semibold text-gray-900">
          System is {isLocked ? "locked" : "operational"}
        </span>
      </div>

      {isLocked && config?.lockReason && (
        <p className="text-sm text-gray-500 mb-4">Reason: {config.lockReason}</p>
      )}

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleToggle} className="space-y-4">
        {!isLocked && (
          <Input
            label="Lock reason"
            name="lockReason"
            placeholder="Why are you locking the system?"
          />
        )}
        <Button
          type="submit"
          variant={isLocked ? "secondary" : "danger"}
          loading={isPending}
        >
          {isLocked ? "Unlock system" : "Lock system"}
        </Button>
      </form>
    </div>
  );
}

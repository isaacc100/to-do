"use client";

import { useState, useTransition } from "react";
import { blockIp, unblockIp } from "@/app/actions/admin";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useRouter } from "next/navigation";
import type { BlockedIp } from "@/types";

export function BlockedIpManager({ initialBlockedIps }: { initialBlockedIps: BlockedIp[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleBlock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    startTransition(async () => {
      const res = await blockIp({
        ipAddress: data.get("ipAddress") as string,
        reason: (data.get("reason") as string) || undefined,
      });
      if (res.success) { form.reset(); router.refresh(); }
      else setError(res.error);
    });
  }

  function handleUnblock(id: string) {
    startTransition(async () => {
      await unblockIp(id);
      router.refresh();
    });
  }

  return (
    <div>
      <form onSubmit={handleBlock} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Block an IP address</h2>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          <Input label="IP Address" name="ipAddress" required placeholder="1.2.3.4" />
          <Input label="Reason" name="reason" placeholder="Optional" />
        </div>
        <Button type="submit" variant="danger" loading={isPending}>Block IP</Button>
      </form>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {initialBlockedIps.length === 0 ? (
          <p className="p-6 text-gray-500">No blocked IPs.</p>
        ) : (
          initialBlockedIps.map((ip) => (
            <div key={ip.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm text-gray-900">{ip.ipAddress}</code>
                  <Badge variant={ip.isActive ? "danger" : "default"}>
                    {ip.isActive ? "Blocked" : "Unblocked"}
                  </Badge>
                </div>
                {ip.reason && <p className="text-sm text-gray-500 mt-0.5">{ip.reason}</p>}
              </div>
              {ip.isActive && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleUnblock(ip.id)}
                  disabled={isPending}
                >
                  Unblock
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

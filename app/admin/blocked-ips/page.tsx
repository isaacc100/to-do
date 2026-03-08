import { getAllBlockedIps } from "@/lib/db/queries/blockedIps";
import { BlockedIpManager } from "./BlockedIpManager";

export const dynamic = "force-dynamic";

export default async function AdminBlockedIpsPage() {
  const allBlockedIps = await getAllBlockedIps().catch(() => []);
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Blocked IPs</h1>
      <BlockedIpManager initialBlockedIps={allBlockedIps} />
    </div>
  );
}

import { getAuditLog } from "@/lib/db/queries/audit";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

const eventTypeColors: Record<string, "success" | "danger" | "warning" | "info" | "default"> = {
  TASK_CREATED: "success",
  TASK_SYNC_SUCCEEDED: "success",
  TASK_SYNC_FAILED: "danger",
  BLOCKED_REQUEST_DENIED: "danger",
  SYSTEM_LOCKED: "warning",
  SYSTEM_UNLOCKED: "info",
  IP_BLOCKED: "danger",
  IP_UNBLOCKED: "info",
  TASK_DELETED: "danger",
};

export default async function AdminAuditPage() {
  const logs = await getAuditLog(200).catch(() => []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Audit Log</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {logs.length === 0 ? (
          <p className="p-6 text-gray-500">No audit events yet.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Summary</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {log.eventTimestamp ? new Date(log.eventTimestamp).toLocaleString("en-GB") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={eventTypeColors[log.eventType] ?? "default"}>
                      {log.eventType}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{log.eventSummary}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{log.actorIp ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

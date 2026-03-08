import { getSystemConfig } from "@/lib/db/queries/systemConfig";
import { getAllTasks } from "@/lib/db/queries/tasks";
import { getBlockedIps } from "@/lib/db/queries/blockedIps";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [config, allTasks, blockedIpList] = await Promise.all([
    getSystemConfig().catch(() => null),
    getAllTasks(1000).catch(() => []),
    getBlockedIps().catch(() => []),
  ]);

  const pendingTasks = allTasks.filter((t) => t.syncStatus === "pending").length;
  const failedTasks = allTasks.filter((t) => t.syncStatus === "failed").length;
  const syncedTasks = allTasks.filter((t) => t.syncStatus === "synced").length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {config?.isLocked && (
        <div className="mb-6 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
          <p className="font-medium text-yellow-800">⚠️ System is locked</p>
          {config.lockReason && <p className="text-sm text-yellow-700 mt-1">{config.lockReason}</p>}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
        {[
          { label: "Total tasks", value: allTasks.length, href: "/admin/tasks" },
          { label: "Synced", value: syncedTasks, href: "/admin/tasks" },
          { label: "Pending", value: pendingTasks, href: "/admin/tasks" },
          { label: "Failed", value: failedTasks, href: "/admin/tasks" },
          { label: "Blocked IPs", value: blockedIpList.length, href: "/admin/blocked-ips" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition-colors">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { title: "Manage Tasks", desc: "View and manage all submitted tasks", href: "/admin/tasks" },
          { title: "Categories", desc: "Create and manage task categories", href: "/admin/categories" },
          { title: "Audit Log", desc: "View system audit trail", href: "/admin/audit" },
          { title: "System", desc: "Lock/unlock task submissions", href: "/admin/system" },
          { title: "Blocked IPs", desc: "Manage blocked IP addresses", href: "/admin/blocked-ips" },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-colors">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

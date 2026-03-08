import { getAllTasks } from "@/lib/db/queries/tasks";
import { SyncStatusBadge } from "@/components/SyncStatusBadge";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminTasksPage() {
  const allTasks = await getAllTasks(200).catch(() => []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Tasks</h1>
      <div className="bg-white rounded-xl border border-gray-200 px-6">
        {allTasks.length === 0 ? (
          <p className="py-12 text-center text-gray-500">No tasks yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {allTasks.map((task) => (
              <li key={task.id} className="py-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/tasks/${task.id}`} className="font-medium text-gray-900 hover:text-blue-600 truncate">
                      {task.title}
                    </Link>
                    {task.categoryNameSnapshot && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {task.categoryNameSnapshot}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {task.createdAt ? new Date(task.createdAt).toLocaleString("en-GB") : "Unknown"}
                    {" · "}IP: {task.creatorIp}
                    {task.submittedName && ` · ${task.submittedName}`}
                  </p>
                </div>
                <SyncStatusBadge status={task.syncStatus as "pending" | "synced" | "failed"} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

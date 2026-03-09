import Link from "next/link";
import { SyncStatusBadge } from "@/components/SyncStatusBadge";
import type { Task } from "@/types";

interface TaskListProps {
  tasks: Task[];
  showSyncStatus?: boolean;
  showActions?: boolean;
}

export function TaskList({ tasks, showSyncStatus = false, showActions = false }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No tasks found.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {tasks.map((task) => (
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
            {task.notes && (
              <p className="text-sm text-gray-500 mt-1 truncate">{task.notes}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {task.createdAt ? new Date(task.createdAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              }) : "Unknown date"}
              {task.submittedName && ` · by ${task.submittedName}`}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {showSyncStatus && (
              <SyncStatusBadge status={task.syncStatus as "pending" | "synced" | "failed"} />
            )}
            {showActions && (
              <Link href={`/tasks/${task.id}`} className="text-sm text-blue-600 hover:underline">
                View
              </Link>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getTaskById } from "@/lib/db/queries/tasks";
import { SyncStatusBadge } from "@/components/SyncStatusBadge";
import { TaskEditForm } from "./TaskEditForm";

export const dynamic = "force-dynamic";

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  let task: Awaited<ReturnType<typeof getTaskById>> | null = null;
  try {
    task = await getTaskById(id) ?? null;
  } catch {
    notFound();
  }

  if (!task) notFound();

  const isOwner = session?.user?.id && task.ownerUserId === session.user.id;
  const isAdminUser = (session?.user as any)?.role === "admin";
  const canEdit = isOwner || isAdminUser;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="text-lg font-semibold text-gray-900">tasks.isaaccritchley.uk</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href="/my-tasks" className="text-sm text-blue-600 hover:underline">← My Tasks</Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex-1">{task.title}</h1>
            <SyncStatusBadge status={task.syncStatus as "pending" | "synced" | "failed"} />
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm mb-6">
            {task.categoryNameSnapshot && (
              <>
                <dt className="text-gray-500 font-medium">Category</dt>
                <dd className="text-gray-900">{task.categoryNameSnapshot}</dd>
              </>
            )}
            {task.submittedName && (
              <>
                <dt className="text-gray-500 font-medium">Submitted by</dt>
                <dd className="text-gray-900">{task.submittedName}</dd>
              </>
            )}
            {task.dueAt && (
              <>
                <dt className="text-gray-500 font-medium">Due</dt>
                <dd className="text-gray-900">{new Date(task.dueAt).toLocaleString("en-GB")}</dd>
              </>
            )}
            <dt className="text-gray-500 font-medium">Created</dt>
            <dd className="text-gray-900">{task.createdAt ? new Date(task.createdAt).toLocaleString("en-GB") : "—"}</dd>
          </dl>

          {task.notes && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Notes</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{task.notes}</p>
            </div>
          )}

          {canEdit && <TaskEditForm task={task} />}
        </div>
      </main>
    </div>
  );
}

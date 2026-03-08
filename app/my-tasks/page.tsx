import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { getTasksByOwner } from "@/lib/db/queries/tasks";
import { TaskList } from "@/components/TaskList";

export const dynamic = "force-dynamic";

export default async function MyTasksPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/my-tasks");
  }

  let userTasks: Awaited<ReturnType<typeof getTasksByOwner>> = [];
  try {
    userTasks = await getTasksByOwner(session.user.id);
  } catch {
    // handle error gracefully
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="text-lg font-semibold text-gray-900">tasks.isaaccritchley.uk</Link>
            <p className="text-xs text-gray-500">My Tasks</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{session.user.email}</span>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
              <button type="submit" className="text-sm text-red-600 hover:underline">Sign out</button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <Link href="/" className="text-sm text-blue-600 hover:underline">+ Submit new task</Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 px-6">
          <TaskList tasks={userTasks} showSyncStatus showActions />
        </div>
      </main>
    </div>
  );
}

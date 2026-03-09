import { Suspense } from "react";
import { TaskForm } from "@/components/TaskForm";
import { getEnabledCategories } from "@/lib/db/queries/categories";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function TaskFormWrapper() {
  let categories: Awaited<ReturnType<typeof getEnabledCategories>> = [];
  try {
    categories = await getEnabledCategories();
  } catch {
    // DB not available at build time
  }
  return <TaskForm categories={categories} />;
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">tasks.isaaccritchley.uk</h1>
            <p className="text-xs text-gray-500">Submit a task to Apple Reminders</p>
          </div>
          <Link href="/login" className="text-sm text-blue-600 hover:underline">Sign in</Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Submit a task</h2>
              <p className="text-gray-500 mt-1">Tasks sync automatically to Apple Reminders via IFTTT.</p>
            </div>
            <Suspense fallback={<div className="py-8 text-center text-gray-400">Loading form...</div>}>
              <TaskFormWrapper />
            </Suspense>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-gray-400 space-x-4">
        <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
        <span>·</span>
        <Link href="/my-tasks" className="hover:text-gray-600">My Tasks</Link>
        <span>·</span>
        <span>© {new Date().getFullYear()} Isaac Critchley</span>
      </footer>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { editTask } from "@/app/actions/tasks";
import { useRouter } from "next/navigation";
import type { Task } from "@/types";

export function TaskEditForm({ task }: { task: Task }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await editTask(task.id, {
        title: data.get("title") as string,
        notes: (data.get("notes") as string) || undefined,
        dueAt: (data.get("dueAt") as string) || undefined,
      });
      if (res.success) {
        setIsEditing(false);
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  if (!isEditing) {
    return (
      <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit task</Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-gray-100 pt-6">
      <h3 className="font-medium text-gray-900">Edit task</h3>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Input label="Title" name="title" defaultValue={task.title} required />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Notes</label>
        <textarea
          name="notes"
          defaultValue={task.notes ?? ""}
          rows={3}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        />
      </div>
      <Input
        label="Due date"
        name="dueAt"
        type="datetime-local"
        defaultValue={task.dueAt ? new Date(task.dueAt).toISOString().slice(0, 16) : ""}
      />
      <div className="flex gap-2">
        <Button type="submit" loading={isPending}>Save changes</Button>
        <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
      </div>
    </form>
  );
}

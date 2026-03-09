"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { submitTask } from "@/app/actions/tasks";
import type { Category } from "@/types";

interface TaskFormProps {
  categories: Category[];
}

export function TaskForm({ categories }: TaskFormProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; error?: string; taskId?: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload: Record<string, unknown> = {
      title: data.get("title") as string,
      notes: (data.get("notes") as string) || undefined,
      categoryId: (data.get("categoryId") as string) || undefined,
      submittedName: (data.get("submittedName") as string) || undefined,
      dueAt: (data.get("dueAt") as string) || undefined,
    };

    startTransition(async () => {
      const res = await submitTask(payload);
      if (res.success) {
        setResult({ success: true, taskId: res.data.id });
        setFieldErrors({});
        form.reset();
      } else {
        setResult({ success: false, error: res.error });
        setFieldErrors(res.fieldErrors ?? {});
      }
    });
  }

  if (result?.success) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Task submitted!</h3>
        <p className="text-gray-500 mb-6">Your task has been received and will be synced to Apple Reminders.</p>
        <Button onClick={() => setResult(null)} variant="secondary">Submit another task</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {result && !result.success && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {result.error}
        </div>
      )}

      <Input
        label="Task title"
        name="title"
        required
        placeholder="What needs to be done?"
        maxLength={500}
        error={fieldErrors.title?.[0]}
      />

      {categories.length > 0 && (
        <div className="flex flex-col gap-1">
          <label htmlFor="categoryId" className="text-sm font-medium text-gray-700">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          maxLength={5000}
          placeholder="Additional details (optional)"
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {fieldErrors.notes?.[0] && <p className="text-xs text-red-600">{fieldErrors.notes[0]}</p>}
      </div>

      <Input
        label="Your name"
        name="submittedName"
        placeholder="Optional"
        maxLength={200}
        error={fieldErrors.submittedName?.[0]}
      />

      <Input
        label="Due date"
        name="dueAt"
        type="datetime-local"
        error={fieldErrors.dueAt?.[0]}
      />

      <Button type="submit" loading={isPending} className="w-full">
        Submit task
      </Button>
    </form>
  );
}

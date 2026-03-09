"use client";

import { useState, useTransition } from "react";
import { createCategory, deleteCategory } from "@/app/actions/categories";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Category } from "@/types";
import { useRouter } from "next/navigation";

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      const res = await createCategory({
        name: data.get("name") as string,
        slug: (data.get("slug") as string).toLowerCase().replace(/\s+/g, "-"),
        description: (data.get("description") as string) || undefined,
        sortOrder: parseInt(data.get("sortOrder") as string) || 0,
        isEnabled: data.get("isEnabled") === "on",
      });
      if (res.success) { form.reset(); setShowForm(false); router.refresh(); }
      else setError(res.error);
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    startTransition(async () => {
      await deleteCategory(id);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowForm(!showForm)} variant="primary">
          {showForm ? "Cancel" : "+ New Category"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-900">New Category</h2>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" name="name" required />
            <Input label="Slug" name="slug" required placeholder="e.g. work-tasks" />
          </div>
          <Input label="Description" name="description" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Sort order" name="sortOrder" type="number" defaultValue="0" />
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="isEnabled" name="isEnabled" defaultChecked className="rounded" />
              <label htmlFor="isEnabled" className="text-sm font-medium text-gray-700">Enabled</label>
            </div>
          </div>
          <Button type="submit" loading={isPending}>Create category</Button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {initialCategories.length === 0 ? (
          <p className="p-6 text-gray-500">No categories yet.</p>
        ) : (
          initialCategories.map((cat) => (
            <div key={cat.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{cat.name}</span>
                  <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{cat.slug}</code>
                  {!cat.isEnabled && <Badge variant="warning">Disabled</Badge>}
                </div>
                {cat.description && <p className="text-sm text-gray-500 mt-0.5">{cat.description}</p>}
              </div>
              <Button variant="danger" size="sm" onClick={() => handleDelete(cat.id)} disabled={isPending}>
                Delete
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

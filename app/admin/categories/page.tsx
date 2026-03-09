import { getAllCategories } from "@/lib/db/queries/categories";
import { CategoryManager } from "./CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const allCategories = await getAllCategories().catch(() => []);
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Categories</h1>
      <CategoryManager initialCategories={allCategories} />
    </div>
  );
}

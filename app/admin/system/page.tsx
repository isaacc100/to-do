import { getSystemConfig } from "@/lib/db/queries/systemConfig";
import { SystemControls } from "./SystemControls";

export const dynamic = "force-dynamic";

export default async function AdminSystemPage() {
  const config = await getSystemConfig().catch(() => null);
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">System</h1>
      <SystemControls config={config ?? null} />
    </div>
  );
}

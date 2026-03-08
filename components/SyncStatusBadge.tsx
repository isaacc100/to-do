import { Badge } from "@/components/ui/Badge";
import type { SyncStatus } from "@/types";

export function SyncStatusBadge({ status }: { status: SyncStatus }) {
  const config = {
    pending: { variant: "warning" as const, label: "Pending" },
    synced: { variant: "success" as const, label: "Synced" },
    failed: { variant: "danger" as const, label: "Failed" },
  };
  const { variant, label } = config[status] ?? config.pending;
  return <Badge variant={variant}>{label}</Badge>;
}

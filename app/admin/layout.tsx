import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { AdminNav } from "@/components/AdminNav";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if ((session.user as any).role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-semibold text-gray-900">tasks.isaaccritchley.uk</Link>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{session.user.email}</span>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
              <button type="submit" className="text-sm text-red-600 hover:underline">Sign out</button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">
        <aside className="w-48 shrink-0">
          <AdminNav />
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

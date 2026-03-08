import { auth } from "@/lib/auth";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if ((user as any).role !== "admin") throw new Error("Forbidden");
  return user;
}

export async function isAdmin(): Promise<boolean> {
  try {
    const session = await auth();
    return (session?.user as any)?.role === "admin";
  } catch {
    return false;
  }
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

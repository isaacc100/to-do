"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/tasks", label: "Tasks" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/audit", label: "Audit Log" },
  { href: "/admin/system", label: "System" },
  { href: "/admin/blocked-ips", label: "Blocked IPs" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map(({ href, label, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

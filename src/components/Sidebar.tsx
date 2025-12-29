"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Users, Briefcase, Settings, LogOut } from "lucide-react";
import clsx from "clsx";
import { signOut } from "next-auth/react";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Jobs", href: "/jobs", icon: Briefcase },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null;
  }

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">CleanDay CRM</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <Icon size={20} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

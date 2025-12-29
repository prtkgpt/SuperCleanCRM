"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Users, Briefcase, Settings } from "lucide-react";
import clsx from "clsx";

export function MobileNav() {
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
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group",
                isActive ? "text-blue-600" : "text-gray-500"
              )}
            >
              <Icon
                className={clsx(
                  "w-6 h-6 mb-1",
                  isActive ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"
                )}
              />
              <span className="text-xs">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

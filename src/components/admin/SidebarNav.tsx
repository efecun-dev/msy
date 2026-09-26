"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Package,
  Settings,
  BarChart2,
  MessageSquare,
} from "lucide-react";

export default function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Genel Bakış",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Teklifler",
      href: "/dashboard/quotes",
      icon: FileText,
    },
    {
      name: "Ürünler",
      href: "/dashboard/products",
      icon: Package,
    },
    {
      name: "Mesajlar",
      href: "/dashboard/messages",
      icon: MessageSquare,
    },
    {
      name: "Raporlar",
      href: "/dashboard/reports",
      icon: BarChart2,
    },
    {
      name: "Ayarlar",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <nav className="space-y-0.5 px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-sm transition-colors ${
              isActive
                ? "bg-brand-3 text-brand-11"
                : "text-panel-11 hover:bg-panel-3 hover:text-panel-12"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

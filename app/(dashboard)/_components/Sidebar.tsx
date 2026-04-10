"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Search, 
  FileText, 
  File, 
  Archive, 
  Users, 
  X
} from "lucide-react";
import { Role } from "@/lib/generated/prisma/enums";
import LogOut from "@/components/LogOut";

export const navItems = [
  {
    label: "الرئيسية",
    path: "/",
    icon: Home,
    role: ["ADMIN", "OFFICER", "AUDITOR"],
  },
  {
    label: "بحث المواطنين",
    path: "/citizens",
    icon: Search,
    role: ["ADMIN", "OFFICER"],
  },
  {
    label: "الواقعات المدنية",
    path: "/events",
    icon: FileText,
    role: ["ADMIN", "OFFICER"],
  },
  {
    label: "إصدار الوثائق",
    path: "/documents",
    icon: File,
    role: ["ADMIN", "OFFICER"],
  },
  {
    label: "الأرشيف الرقمي",
    path: "/archive",
    icon: Archive,
    role: ["ADMIN", "OFFICER", "AUDITOR"],
  },
  { label: "إدارة الموظفين", path: "/employees", icon: Users, role: ["ADMIN"] },
  {
    label: "سجل التدقيق",
    path: "/audit",
    icon: FileText,
    role: ["ADMIN", "AUDITOR"],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

export default function Sidebar({ open, onClose, user }: SidebarProps) {
  const pathname = usePathname();
  const userRole = user?.role as Role;
  const splitName = user?.name?.split(" ")[0]?.charAt(0);

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full z-50 flex flex-col transition-all duration-200 bg-sidebar-background ${
          open ? "w-60" : "w-0 overflow-hidden"
        }`}
      >
        {/* Logo area */}
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center">
              <FileText className="w-5 h-5 text-sidebar-foreground" />
            </div>
            <div>
              <h1 className="text-sidebar-foreground font-bold text-sm">
                السجل المدني
              </h1>
              <p className="text-sidebar-foreground/60 text-xs">
                النظام الرقمي الموحد
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const hasAccess = user && item.role.includes(userRole);

            if (!hasAccess) return null;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-foreground font-medium border-r-2 border-sidebar-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-sidebar-border ">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground text-xs font-bold">
              {splitName}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground text-sm font-medium truncate">
                {user?.name}
              </p>
              <p className="text-sidebar-foreground/50 text-xs">{userRole}</p>
            </div>
            <LogOut />
          </div>
        </div>
      </aside>
    </>
  );
}

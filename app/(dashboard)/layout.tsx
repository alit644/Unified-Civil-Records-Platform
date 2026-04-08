"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  FileText,
  File,
  Archive,
  Users,
  Bell,
  HelpCircle,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Role } from "@/lib/generated/prisma/enums";
import { IUser } from "@/types";
import LogOut from "@/components/LogOut";
const navItems = [
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
    role: ["ADMIN", "OFFICER","AUDITOR"],
  },
  { label: "إدارة الموظفين", path: "/employees", icon: Users, role: ["ADMIN"] },
  {
    label: "سجل التدقيق",
    path: "/audit",
    icon: FileText,
    role: ["ADMIN", "AUDITOR"],
  },
];

const pageTitles: Record<string, string> = {
  "/": "الرئيسية",
  "/citizens": "بحث المواطنين",
  "/events": "الواقعات المدنية",
  "/documents": "إصدار الوثائق",
  "/archive": "الأرشيف الرقمي",
  "/employees": "إدارة الموظفين",
  "/audit": "سجل التدقيق الكامل",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // get session
  const { data: session, isPending } = authClient.useSession();
  const userName = session?.user?.name;
  const  userRole = session?.user?.role as Role;
  const splitName = userName?.split(" ")[0]?.charAt(0)
  const pageTitle = pageTitles[pathname] || "السجل المدني";
  if (isPending) return <div className="p-4">جاري التحميل...</div>;
  return (
    <div className="flex min-h-screen w-full font-cairo" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full z-40 flex flex-col transition-all duration-200 bg-sidebar-background ${
          sidebarOpen ? "w-60" : "w-0 overflow-hidden"
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
            const hasAccess = session?.user && item.role.includes(userRole);

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
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground text-xs font-bold">
              {splitName}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground text-sm font-medium truncate">
                {userName}
              </p>
              <p className="text-sidebar-foreground/50 text-xs">{userRole}</p>
            </div>
            <LogOut />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ${sidebarOpen ? "mr-60" : "mr-0"}`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-card border-b flex items-center px-6 gap-4 shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <h2 className="text-lg font-bold text-foreground">{pageTitle}</h2>

          <div className="flex-1 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="بحث بالاسم أو الرقم الوطني..."
                className="w-full h-9 pr-10 pl-4 rounded-md border bg-secondary/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                ٣
              </span>
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 pr-3 border-r">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
          {splitName}
              </div>
              <span className="text-sm font-medium">{userName}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

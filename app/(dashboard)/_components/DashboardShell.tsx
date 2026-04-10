"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardShellProps {
  children: React.ReactNode;
  user: any;
}

export default function DashboardShell({ children, user }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen w-full font-cairo bg-background text-foreground" dir="rtl">
      {/* Sidebar Component */}
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        user={user} 
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          sidebarOpen ? "md:mr-60" : ""
        }`}
      >
        {/* Header Component */}
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          user={user} 
        />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

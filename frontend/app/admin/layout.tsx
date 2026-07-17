"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsAuthorized(true);
      return;
    }
    const token = Cookies.get("admin_token");
    if (!token) {
      router.push("/admin/login");
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  if (!isAuthorized) return <div className="min-h-screen bg-slate-950" />;
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div className="flex-1 flex flex-col w-full h-full relative overflow-hidden bg-slate-950/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

        <Header setIsOpen={setIsSidebarOpen} />

        {/* PERBAIKAN: Menghapus z-10 agar modal di dalamnya bisa lepas ke layer paling atas browser */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

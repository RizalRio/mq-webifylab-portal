"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Cpu,
  Briefcase,
  Box,
  MessageSquare,
  Terminal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export default function Sidebar({
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
    { name: "Teknologi", icon: Cpu, href: "/admin/technologies" },
    { name: "Portofolio", icon: Briefcase, href: "/admin/portfolio" },
    { name: "Produk SaaS", icon: Box, href: "/admin/saas" },
    { name: "Pesan Masuk", icon: MessageSquare, href: "/admin/messages" },
  ];

  return (
    <>
      {/* Overlay Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Kontainer Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-slate-950 border-r border-slate-800 transform transition-all duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-72"}`}
      >
        {/* Header Sidebar (Logo + Tombol Collapse) */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800 relative">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2.5 mx-auto lg:mx-0 px-2"
          >
            <div className="p-2 bg-blue-600/10 border border-blue-500/20 rounded-xl shrink-0">
              <Terminal className="w-5 h-5 text-blue-500" />
            </div>
            {/* Sembunyikan teks logo jika collapse aktif */}
            {!isCollapsed && (
              <span className="text-xl font-bold text-white tracking-tight animate-in fade-in duration-200">
                Webify<span className="text-blue-500">Lab</span>
              </span>
            )}
          </Link>

          {/* Tombol Silang Mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white absolute right-4"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Tombol Collapse Desktop (Hanya muncul di layar gede) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-7 w-6 h-6 bg-slate-900 border border-slate-700 rounded-full items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 transition-colors z-50 shadow-md"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Navigasi Menu */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : ""} // Memunculkan tooltip bawaan browser jika menciut
                className={`flex items-center rounded-xl transition-all font-medium text-sm group/item ${
                  isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
                } ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-400" : "text-slate-500 group-hover/item:text-slate-300"}`}
                />

                {/* Sembunyikan teks menu jika dikompres */}
                {!isCollapsed && (
                  <span className="animate-in fade-in duration-150 whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-800">
          <div
            className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold uppercase border border-slate-700 shrink-0">
              A
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in duration-200 overflow-hidden whitespace-nowrap">
                <p className="text-sm font-bold text-white">Administrator</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

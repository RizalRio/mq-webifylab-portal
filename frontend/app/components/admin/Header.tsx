"use client";

import { Menu, LogOut, Search, Bell } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface HeaderProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default function Header({ setIsOpen }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("admin_token");
    router.push("/admin/login");
  };

  return (
    <header className="h-20 bg-slate-950/50 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Tombol Hamburger (Hanya muncul di Mobile/Tablet) */}
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar Semu (Estetika & Kemudahan Penggunaan) */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-500">
          <Search className="w-4 h-4" />
          <span className="text-sm">Cari data (Ctrl+K)</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-white relative group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-slate-950"></span>
        </button>

        <div className="w-px h-6 bg-slate-800 mx-2"></div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 hover:text-rose-400 border border-rose-500/20 rounded-xl transition-colors font-semibold text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block">Keluar</span>
        </button>
      </div>
    </header>
  );
}

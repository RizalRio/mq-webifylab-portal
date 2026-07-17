"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Box,
  Mail,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";

interface DashboardStats {
  totalPortfolios: number;
  totalSaaS: number;
  totalMessages: number;
}

interface RecentMessage {
  id: number;
  sender_name: string;
  subject: string;
  created_at: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPortfolios: 0,
    totalSaaS: 0,
    totalMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const timestamp = new Date().getTime();

        // PERBAIKAN: Ambil token dari Cookies dengan nama key "admin_token"
        const token = Cookies.get("admin_token");

        const safeFetch = async (url: string) => {
          const res = await fetch(url, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "Content-Type": "application/json",
            },
          });

          const text = await res.text();
          try {
            return JSON.parse(text);
          } catch (err) {
            console.error(`❌ Error parsing dari ${url}:`, text);
            return null;
          }
        };

        const [portData, saasData, msgData] = await Promise.all([
          safeFetch(
            `http://localhost:8000/api/v1/portfolios?page=1&limit=1&_t=${timestamp}`,
          ),
          safeFetch(
            `http://localhost:8000/api/v1/saas?page=1&limit=1&_t=${timestamp}`,
          ),
          safeFetch(
            `http://localhost:8000/api/v1/admin/messages?page=1&limit=5&_t=${timestamp}`,
          ),
        ]);

        const getCount = (res: any) => {
          if (!res || !res.data) return 0;
          return (
            res.data.total_rows ||
            res.data.total_items ||
            res.data.total ||
            res.data.total_data ||
            0
          );
        };

        setStats({
          totalPortfolios: getCount(portData),
          totalSaaS: getCount(saasData),
          totalMessages: getCount(msgData),
        });

        setRecentMessages(msgData?.data?.data || []);
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 min-h-screen p-8 flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Activity className="w-8 h-8 text-blue-500 animate-pulse" />
          <p className="text-slate-400 text-sm animate-pulse">
            Menyinkronkan Data Server...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-slate-950 min-h-screen text-slate-50">
      {/* Header Dashboard */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          Pusat Komando
        </h1>
        <p className="text-slate-400">
          Pantau aktivitas metrik dan pesan masuk WebifyLab hari ini.
        </p>
      </div>

      {/* Grid Metrik (Kartu Statistik) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Kartu 1: Pesan */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-rose-500/20 transition-colors duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-rose-400">
              <Mail className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" /> Aktif
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="text-4xl font-bold text-white mb-1">
              {stats.totalMessages}
            </h3>
            <p className="text-slate-400 text-sm font-medium">
              Total Pesan Masuk
            </p>
          </div>
        </div>

        {/* Kartu 2: Portofolio */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-blue-400">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-4xl font-bold text-white mb-1">
              {stats.totalPortfolios}
            </h3>
            <p className="text-slate-400 text-sm font-medium">
              Karya Portofolio
            </p>
          </div>
        </div>

        {/* Kartu 3: SaaS */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-purple-500/20 transition-colors duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-purple-400">
              <Box className="w-6 h-6" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-4xl font-bold text-white mb-1">
              {stats.totalSaaS}
            </h3>
            <p className="text-slate-400 text-sm font-medium">Inkubator SaaS</p>
          </div>
        </div>
      </div>

      {/* Tabel Preview Pesan Terbaru */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            Transmisi Pesan Terbaru
          </h2>
          <Link
            href="/admin/messages"
            className="flex items-center gap-1 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Lihat Semua <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Pengirim</th>
                <th className="px-6 py-4 font-semibold">Subjek</th>
                <th className="px-6 py-4 font-semibold text-right">
                  Waktu (WIB)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentMessages.length > 0 ? (
                recentMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">
                        {msg.sender_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{msg.subject}</td>
                    <td className="px-6 py-4 text-right text-slate-500 text-sm flex items-center justify-end gap-2">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-8 text-center text-slate-500 text-sm"
                  >
                    Belum ada pesan yang masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

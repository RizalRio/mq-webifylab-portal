"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  User,
  Trash2,
  Loader2,
  Eye,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Circle,
} from "lucide-react";

interface ContactMessage {
  id: number;
  sender_name: string;
  sender_email: string;
  sender_phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function InboxPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // State untuk Search dan Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fungsi Tarik Data Terintegrasi Paginasi & Search Query
  const fetchMessages = async (page: number, search: string) => {
    setIsLoading(true);
    setError("");
    try {
      const token = Cookies.get("admin_token");
      // Menambahkan query params page dan search ke backend Golang
      const res = await fetch(
        `http://localhost:8000/api/v1/admin/messages?page=${page}&limit=10&search=${search}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const jsonResponse = await res.json();

      if (res.ok && jsonResponse.status === "success") {
        const extractedData = jsonResponse.data?.data;
        setMessages(Array.isArray(extractedData) ? extractedData : []);

        // Ambil meta data paginasi dari respons Golang
        setCurrentPage(jsonResponse.data?.current_page || 1);
        setTotalPages(jsonResponse.data?.total_page || 1);
      } else {
        setError(jsonResponse.message || "Gagal mengambil data pesan.");
      }
    } catch (err) {
      setError("Gagal terhubung ke server backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchMessages(currentPage, searchQuery);
  }, [currentPage]);

  // Handler untuk Trigger Pencarian saat ketik (Debounce manual atau tombol bisa disesuaikan, ini instant via enter/button)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset ke halaman 1 saat cari data baru
    fetchMessages(1, searchQuery);
  };

  // Fungsi Mengubah Status Menjadi Sudah Dibaca (Mark as Read)
  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);

    // Jika pesan belum dibaca, tembak API patch/put ke Golang
    if (!msg.is_read) {
      try {
        const token = Cookies.get("admin_token");
        const res = await fetch(
          `http://localhost:8000/api/v1/admin/messages/${msg.id}/read`,
          {
            method: "PATCH", // atau PUT, sesuaikan dengan endpoint Golang milikmu
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (res.ok) {
          // Update state lokal frontend agar lingkaran biru hilang instant
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m)),
          );
        }
      } catch (err) {
        console.error("Gagal memperbarui status baca ke backend:", err);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pesan ini?")) return;
    setIsDeleting(id);
    try {
      const token = Cookies.get("admin_token");
      const res = await fetch(
        `http://localhost:8000/api/v1/admin/messages/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      } else {
        alert(data.message || "Gagal menghapus pesan.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!isMounted) return "...";
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString("id-ID", options);
    } catch {
      return dateString;
    }
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Pesan Masuk
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Kelola penawaran masuk dari halaman depan.
          </p>
        </div>
        <div className="w-fit px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold text-slate-300 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          Total: {messages.length} data dimuat
        </div>
      </div>

      {/* Bar Pencarian (Search Engine) */}
      <form onSubmit={handleSearchSubmit} className="flex gap-3 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama pengirim atau subjek..."
            className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-800 text-sm text-white rounded-xl focus:outline-none focus:border-blue-500/80 transition-all placeholder:text-slate-600"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-sm font-semibold rounded-xl text-slate-300 transition-colors"
        >
          Cari
        </button>
      </form>

      {/* Tabel Konten */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-center font-medium">
          {error}
        </div>
      ) : messages.length === 0 ? (
        <div className="p-12 bg-slate-900/30 border border-slate-800 rounded-3xl text-center text-slate-500">
          <Mail className="w-12 h-12 mx-auto mb-4 text-slate-700" />
          Tidak menemukan pesan masuk.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6 w-8"></th>
                    <th className="py-4 px-6">Pengirim</th>
                    <th className="py-4 px-6">Subjek Penawaran</th>
                    <th className="py-4 px-6">Tanggal Masuk</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {messages.map((msg) => (
                    <tr
                      key={msg.id}
                      className={`hover:bg-slate-900/40 transition-colors group cursor-pointer ${!msg.is_read ? "bg-blue-950/10" : ""}`}
                      onClick={() => handleOpenMessage(msg)}
                    >
                      {/* Indikator Belum Dibaca */}
                      <td
                        className="py-4 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {!msg.is_read && (
                          <Circle
                            className="w-2.5 h-2.5 fill-blue-500 text-blue-500 mx-auto"
                            title="Belum dibaca"
                          />
                        )}
                      </td>
                      <td
                        className={`py-4 px-6 text-white ${!msg.is_read ? "font-bold" : "font-medium"}`}
                      >
                        <div className="flex flex-col">
                          <span>{msg.sender_name}</span>
                          <span className="text-xs text-slate-500 font-normal mt-0.5">
                            {msg.sender_email}
                          </span>
                        </div>
                      </td>
                      <td
                        className={`py-4 px-6 text-slate-300 max-w-xs truncate ${!msg.is_read ? "font-bold" : "font-normal"}`}
                      >
                        {msg.subject}
                      </td>
                      <td className="py-4 px-6 text-slate-400 text-xs">
                        {formatDate(msg.created_at)}
                      </td>
                      <td
                        className="py-4 px-6 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenMessage(msg)}
                            className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(msg.id)}
                            disabled={isDeleting === msg.id}
                            className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-500 hover:text-rose-400 transition-colors disabled:opacity-50"
                          >
                            {isDeleting === msg.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Navigasi Kontrol Paginasi (Pagination Footer) */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 font-medium">
              Halaman {currentPage} dari {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED READER MODAL (FIXED CLOSE INTERACTION) */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-end p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedMessage(null)} // Klik area background hitam untuk menutup modal
        >
          <div
            className="w-full max-w-lg h-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup secara tidak sengaja saat mengklik isi dalam modal
          >
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Detail Transmisi
                  </span>
                </div>
                {/* Tombol Close Silang yang Dipertegas */}
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer z-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-semibold text-white">
                    {selectedMessage.sender_name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-400">
                    {selectedMessage.sender_email}
                  </span>
                </div>
                {selectedMessage.sender_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-400">
                      {selectedMessage.sender_phone}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-500">
                    {formatDate(selectedMessage.created_at)}
                  </span>
                </div>
              </div>

              <div className="h-px bg-slate-800 my-6" />

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Subjek
                </h3>
                <p className="text-lg font-bold text-white tracking-tight">
                  {selectedMessage.subject}
                </p>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-4">
                  Pesan Detail
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/50 p-4 border border-slate-800/80 rounded-xl whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800 flex items-center justify-between gap-4 mt-8">
              <button
                type="button"
                onClick={() => handleDelete(selectedMessage.id)}
                className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 rounded-xl font-semibold text-sm"
              >
                <Trash2 className="w-4 h-4" /> Hapus
              </button>
              <a
                href={`mailto:${selectedMessage.sender_email}?subject=Re: ${selectedMessage.subject}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm"
              >
                Balas via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

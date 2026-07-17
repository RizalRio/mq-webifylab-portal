"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Cpu, Plus, Trash2, Loader2, X, Link as LinkIcon } from "lucide-react";

interface Technology {
  id: number;
  name: string;
  icon_url: string;
}

export default function TechnologiesPage() {
  const [techs, setTechs] = useState<Technology[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // State Form Slide-Over
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [iconUrl, setIconUrl] = useState(""); // Diubah dari File menjadi String URL
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const fetchTechnologies = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/technologies`,
      );
      const jsonResponse = await res.json();

      if (res.ok && jsonResponse.status === "success") {
        setTechs(jsonResponse.data || []);
      } else {
        setError(jsonResponse.message || "Gagal memuat data teknologi.");
      }
    } catch {
      setError("Gagal terhubung ke server backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchTechnologies();
  }, []);

  // Format pengiriman data disesuaikan menjadi JSON Murni
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert("Nama teknologi wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    const token = Cookies.get("admin_token");

    // Siapkan Payload JSON
    const payload = {
      name: name,
      icon_url: iconUrl || null, // Mengirim null jika URL kosong (sesuai pointer di backend)
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/technologies`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Menggunakan JSON, bukan multipart
          },
          body: JSON.stringify(payload),
        },
      );

      const jsonResponse = await res.json();

      if (res.ok && jsonResponse.status === "success") {
        await fetchTechnologies();
        closeModal();
      } else {
        alert(jsonResponse.message || "Gagal menambahkan teknologi.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan saat mengirim data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus teknologi ini?")) return;
    setIsDeleting(id);

    try {
      const token = Cookies.get("admin_token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/technologies/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const jsonResponse = await res.json();

      if (res.ok && jsonResponse.status === "success") {
        setTechs((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert(jsonResponse.message || "Gagal menghapus teknologi.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsDeleting(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setName("");
    setIconUrl("");
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-8">
      {/* Top Bar Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Manajemen Teknologi
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Kelola pustaka teknologi yang tampil di landing page.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-fit flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]"
        >
          <Plus className="w-4 h-4" /> Tambah Teknologi
        </button>
      </div>

      {/* Tampilan Utama Grid */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-center font-medium">
          {error}
        </div>
      ) : techs.length === 0 ? (
        <div className="p-12 bg-slate-900/30 border border-slate-800 rounded-3xl text-center text-slate-500">
          <Cpu className="w-12 h-12 mx-auto mb-4 text-slate-700" />
          Belum ada teknologi yang ditambahkan ke database.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {techs.map((tech) => (
            <div
              key={tech.id}
              className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center backdrop-blur-sm transition-all duration-300 hover:border-slate-700"
            >
              {/* Pratinjau Ikon di Grid */}
              <div className="w-16 h-16 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-3 mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                {tech.icon_url ? (
                  <img
                    src={tech.icon_url}
                    alt={tech.name}
                    className="w-full h-full object-contain"
                    // Fallback icon jika URL rusak
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <Cpu className="w-6 h-6 text-slate-600" />
                )}
              </div>

              <span className="text-sm font-semibold text-slate-200 tracking-tight">
                {tech.name}
              </span>

              <button
                onClick={() => handleDelete(tech.id)}
                disabled={isDeleting === tech.id}
                className="absolute top-3 right-3 p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-500 hover:text-rose-400 hover:border-rose-500/30 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
              >
                {isDeleting === tech.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- SLIDE-OVER MODAL FORM --- */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-end p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md h-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Entri Teknologi Baru
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Nama Engine / Tech
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 text-slate-200 text-sm rounded-xl focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-700"
                    placeholder="Contoh: Golang"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Tautan URL Ikon
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      value={iconUrl}
                      onChange={(e) => setIconUrl(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 text-slate-200 text-sm rounded-xl focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-700"
                      placeholder="https://.../logo.svg"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Gunakan URL eksternal (misal dari CDN Devicon atau GitHub).
                  </p>

                  {/* Auto Preview Image box */}
                  {iconUrl && (
                    <div className="mt-4 p-4 border border-slate-800 rounded-xl bg-slate-950/30 flex items-center gap-4 animate-in fade-in duration-300">
                      <div className="w-12 h-12 bg-slate-900 rounded-lg border border-slate-800 p-2 shrink-0">
                        <img
                          src={iconUrl}
                          alt="Preview"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Pratinjau ikon dari URL. Pastikan gambar muncul di sini.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl font-semibold text-sm transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-70 shadow-lg shadow-blue-500/20"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Simpan Data"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Cloud,
  Plus,
  Trash2,
  Loader2,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Pencil,
  Power,
} from "lucide-react";

interface MediaAsset {
  id: number;
  file_url: string;
  is_primary: boolean;
}

interface SaaSProduct {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  subdomain_url: string;
  is_active: boolean;
  media_assets: MediaAsset[];
}

export default function SaaSPage() {
  const [products, setProducts] = useState<SaaSProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Pagination & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [subdomainUrl, setSubdomainUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fungsi Fetch Data
  const fetchData = async (page: number, search: string) => {
    setIsLoading(true);
    try {
      // PERBAIKAN: Kita hapus header Cache-Control yang memicu blokir CORS.
      // Sebagai gantinya, kita gunakan parameter unik (_t) di ujung URL
      // agar browser selalu menganggap ini adalah request baru yang belum di-cache.
      const timestamp = new Date().getTime();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/saas?page=${page}&limit=8&search=${search}&_t=${timestamp}`,
      );

      const jsonRes = await res.json();

      if (res.ok && jsonRes.status === "success") {
        setProducts(jsonRes.data?.data || []);
        setCurrentPage(jsonRes.data?.current_page || 1);
        setTotalPages(jsonRes.data?.total_page || 1);
      }
    } catch (err) {
      setError("Gagal terhubung ke server backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchData(currentPage, searchQuery);
  }, [currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData(1, searchQuery);
  };

  // Auto-generate Slug dari Nama
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    // Jika sedang tambah baru (bukan edit), otomatis buat slug
    if (!editingId) {
      const autoSlug = newName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(autoSlug);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  // Buka Modal Edit
  const handleEdit = (prod: SaaSProduct) => {
    setEditingId(prod.id);
    setName(prod.name);
    setSlug(prod.slug);
    setTagline(prod.tagline);
    setDescription(prod.description);
    setSubdomainUrl(prod.subdomain_url);
    setIsActive(prod.is_active);

    // Tarik gambar terbaru dari array
    if (prod.media_assets?.length > 0) {
      const latestMedia = prod.media_assets[prod.media_assets.length - 1];
      setPreviewUrl(
        `${process.env.NEXT_PUBLIC_API_URL}${latestMedia.file_url}`,
      );
    } else {
      setPreviewUrl(null);
    }

    setIsModalOpen(true);
  };

  // Submit Dinamis (Create & Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = Cookies.get("admin_token");

    const payload = {
      name,
      slug,
      tagline,
      description,
      subdomain_url: subdomainUrl,
      is_active: isActive,
    };

    try {
      const url = editingId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/saas/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/saas`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const jsonResponse = await res.json();

      if (res.ok && jsonResponse.status === "success") {
        const targetId = editingId || jsonResponse.data?.id;

        // TAHAP 2: Jika ada file baru, unggah ke API Media
        if (file && targetId) {
          const formData = new FormData();
          formData.append("mediable_id", targetId.toString());
          formData.append("mediable_type", "saas_products");
          formData.append("is_primary", "true");
          formData.append("file", file);

          const mediaRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/media`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            },
          );

          if (!mediaRes.ok) {
            alert(
              "SaaS berhasil disimpan, tetapi gambar cover gagal diunggah karena format salah atau file > 2MB.",
            );
          }
        }

        await fetchData(currentPage, searchQuery);
        closeModal();
      } else {
        alert(jsonResponse.message || "Gagal menyimpan produk SaaS.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus produk SaaS ini secara permanen?")) return;
    setIsDeleting(id);

    try {
      const token = Cookies.get("admin_token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/saas/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const jsonResponse = await res.json();

      if (res.ok && jsonResponse.status === "success") {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(jsonResponse.message || "Gagal menghapus produk SaaS.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsDeleting(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setName("");
    setSlug("");
    setTagline("");
    setDescription("");
    setSubdomainUrl("");
    setIsActive(true);
    setFile(null);
    setPreviewUrl(null);
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Pusat Aplikasi SaaS
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Kelola ekosistem aplikasi berlangganan dan perangkat lunak milik
            agensi.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-fit flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]"
        >
          <Plus className="w-4 h-4" /> Luncurkan Produk
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex gap-3 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama SaaS..."
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

      {/* Grid List SaaS */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-center font-medium">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 bg-slate-900/30 border border-slate-800 rounded-3xl text-center text-slate-500">
          <Cloud className="w-12 h-12 mx-auto mb-4 text-slate-700" />
          Belum ada produk SaaS yang aktif.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-slate-700 transition-colors relative"
              >
                {/* Overlay Action Buttons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => handleEdit(prod)}
                    className="p-2 bg-blue-600/90 backdrop-blur-sm border border-blue-500 rounded-lg text-white hover:bg-blue-500 transition-colors shadow-lg"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id)}
                    disabled={isDeleting === prod.id}
                    className="p-2 bg-slate-950/90 backdrop-blur-sm border border-slate-700 rounded-lg text-slate-300 hover:text-rose-400 hover:border-rose-500 transition-colors shadow-lg"
                  >
                    {isDeleting === prod.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Status Indicator (IsActive) */}
                <div className="absolute top-3 left-3 z-10">
                  {prod.is_active ? (
                    <span className="px-2.5 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full shadow-lg flex items-center gap-1.5">
                      <Power className="w-3 h-3" /> Aktif
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-slate-800/90 backdrop-blur-sm text-slate-300 text-[10px] font-bold rounded-full shadow-lg flex items-center gap-1.5">
                      <Power className="w-3 h-3" /> Offline
                    </span>
                  )}
                </div>

                {/* Thumbnail Area */}
                <div className="h-48 bg-slate-950 relative overflow-hidden flex items-center justify-center border-b border-slate-800">
                  {prod.media_assets?.length > 0 ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${prod.media_assets[prod.media_assets.length - 1].file_url}`}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      // HAPUS BAGIAN ON-ERROR DI SINI
                    />
                  ) : (
                    <Cloud className="w-8 h-8 text-slate-800" />
                  )}
                </div>

                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                    {prod.name}
                  </h3>
                  <span className="text-xs font-semibold text-blue-400 mb-3 block">
                    {prod.tagline}
                  </span>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">
                    {prod.description}
                  </p>

                  {prod.subdomain_url && (
                    <a
                      href={prod.subdomain_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:text-blue-400 hover:border-blue-500/50 transition-colors mt-auto"
                    >
                      <LinkIcon className="w-3 h-3" /> Buka Aplikasi
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 font-medium">
              Halaman {currentPage} dari {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FORM SLIDE-OVER --- */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-end p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl h-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    {editingId
                      ? "Konfigurasi Ulang SaaS"
                      : "Inisialisasi SaaS Baru"}
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

              {/* Data Dasar */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Nama Produk <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={handleNameChange}
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 text-slate-200 text-sm rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="Misal: PosAja"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Slug ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 text-slate-400 text-sm rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="pos-aja"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Slogan (Tagline) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 text-slate-200 text-sm rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="Aplikasi Kasir Cloud Tercepat"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Deskripsi Fitur <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 text-slate-200 text-sm rounded-xl focus:outline-none focus:border-blue-500 transition-all resize-none"
                    placeholder="Jelaskan fitur utama dari SaaS ini..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Subdomain / Tautan Aplikasi{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="url"
                      required
                      value={subdomainUrl}
                      onChange={(e) => setSubdomainUrl(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 text-slate-200 text-sm rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="https://posaja.webifylab.com"
                    />
                  </div>
                </div>

                {/* Sakelar Status (Toggle Active) */}
                <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                  <div>
                    <span className="text-sm font-semibold text-slate-200 block">
                      Status Operasional
                    </span>
                    <span className="text-xs text-slate-500">
                      Matikan jika aplikasi sedang dalam masa
                      perbaikan/maintenance.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Upload Media (Cover SaaS) */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Cover Aplikasi{" "}
                  {editingId && "(Pilih file baru untuk mengganti)"}
                </label>
                <div className="relative border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-2xl bg-slate-950/30 transition-colors p-4 text-center flex flex-col items-center justify-center min-h-[140px]">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-28 object-contain rounded-xl border border-slate-800"
                    />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-slate-600 mb-2" />
                      <span className="text-xs font-medium text-slate-400">
                        Pilih berkas JPG/PNG/WEBP
                      </span>
                      <span className="text-[10px] text-slate-600 mt-1">
                        Maksimal 2MB (Gunakan rasio 16:9 untuk hasil terbaik)
                      </span>
                    </>
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
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingId ? (
                  "Terapkan Perubahan"
                ) : (
                  "Deploy SaaS"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Briefcase,
  Plus,
  Trash2,
  Loader2,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Upload,
  Link as LinkIcon,
  User,
  Image as ImageIcon,
  Pencil,
} from "lucide-react";

interface Technology {
  id: number;
  name: string;
}

interface MediaAsset {
  id: number;
  file_url: string;
  is_primary: boolean;
}

interface Portfolio {
  id: number;
  title: string;
  description: string;
  client_name: string | null;
  project_url: string | null;
  technologies: Technology[];
  media_assets: MediaAsset[];
}

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [availableTechs, setAvailableTechs] = useState<Technology[]>([]);

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

  // State Khusus Edit
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [selectedTechs, setSelectedTechs] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchData = async (page: number, search: string) => {
    setIsLoading(true);
    try {
      const resPort = await fetch(
        `http://localhost:8000/api/v1/portfolios?page=${page}&limit=8&search=${search}`,
      );
      const jsonPort = await resPort.json();

      if (resPort.ok && jsonPort.status === "success") {
        setPortfolios(jsonPort.data?.data || []);
        setCurrentPage(jsonPort.data?.current_page || 1);
        setTotalPages(jsonPort.data?.total_page || 1);
      }

      const resTech = await fetch("http://localhost:8000/api/v1/technologies");
      const jsonTech = await resTech.json();
      if (resTech.ok && jsonTech.status === "success") {
        setAvailableTechs(jsonTech.data || []);
      }
    } catch (err) {
      setError("Gagal terhubung ke server.");
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

  const toggleTech = (id: number) => {
    setSelectedTechs((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  // Fungsi Trigger Buka Modal Edit
  const handleEdit = (port: Portfolio) => {
    setEditingId(port.id);
    setTitle(port.title);
    setDescription(port.description);
    setClientName(port.client_name || "");
    setProjectUrl(port.project_url || "");
    setSelectedTechs(port.technologies?.map((t) => t.id) || []);

    // PERBAIKAN: Selalu ambil gambar versi terbaru (terakhir di-upload)
    if (port.media_assets?.length > 0) {
      const latestMedia = port.media_assets[port.media_assets.length - 1];
      setPreviewUrl(`http://localhost:8000${latestMedia.file_url}`);
    } else {
      setPreviewUrl(null);
    }

    setIsModalOpen(true);
  };

  // Submit Dinamis (Create & Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTechs.length === 0) {
      alert("Pilih minimal satu teknologi yang digunakan.");
      return;
    }

    setIsSubmitting(true);
    const token = Cookies.get("admin_token");

    const payload = {
      title,
      description,
      client_name: clientName || null,
      project_url: projectUrl || null,
      technology_ids: selectedTechs,
    };

    try {
      // Penentuan Metode HTTP dan Endpoint
      const url = editingId
        ? `http://localhost:8000/api/v1/admin/portfolios/${editingId}`
        : "http://localhost:8000/api/v1/admin/portfolios";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const jsonResponse = await res.json();

      if (res.ok && jsonResponse.status === "success") {
        // ID target untuk upload media
        const targetId = editingId || jsonResponse.data?.id;

        // Jika ada file baru yang diunggah, tembak ke API Media
        if (file && targetId) {
          const formData = new FormData();
          formData.append("mediable_id", targetId.toString());
          formData.append("mediable_type", "portfolios");
          formData.append("is_primary", "true");
          formData.append("file", file);

          const mediaRes = await fetch(
            "http://localhost:8000/api/v1/admin/media",
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            },
          );

          // PERBAIKAN: Beri peringatan jika gambar gagal di-upload (misal > 2MB)
          if (!mediaRes.ok) {
            const errData = await mediaRes.json();
            alert(
              "Teks berhasil disimpan, tetapi gambar gagal diunggah: " +
                (errData.message || "File terlalu besar/format salah."),
            );
          }
        }

        await fetchData(currentPage, searchQuery);
        closeModal();
      } else {
        alert(
          jsonResponse.message ||
            `Gagal ${editingId ? "memperbarui" : "menyimpan"} portofolio.`,
        );
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Hapus proyek portofolio ini? Semua data dan gambar terkait akan dihapus permanen.",
      )
    )
      return;
    setIsDeleting(id);

    try {
      const token = Cookies.get("admin_token");
      const res = await fetch(
        `http://localhost:8000/api/v1/admin/portfolios/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const jsonResponse = await res.json();

      if (res.ok && jsonResponse.status === "success") {
        setPortfolios((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(jsonResponse.message || "Gagal menghapus portofolio.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsDeleting(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null); // Reset mode edit
    setTitle("");
    setDescription("");
    setClientName("");
    setProjectUrl("");
    setSelectedTechs([]);
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
            Etalase Portofolio
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Kelola studi kasus dan proyek yang telah diselesaikan.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-fit flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]"
        >
          <Plus className="w-4 h-4" /> Proyek Baru
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex gap-3 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama proyek..."
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

      {/* Grid Portofolio */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-center font-medium">
          {error}
        </div>
      ) : portfolios.length === 0 ? (
        <div className="p-12 bg-slate-900/30 border border-slate-800 rounded-3xl text-center text-slate-500">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-700" />
          Belum ada portofolio yang terdaftar.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {portfolios.map((port) => (
              <div
                key={port.id}
                className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-slate-700 transition-colors relative"
              >
                {/* Overlay Action Buttons (Edit & Delete) */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => handleEdit(port)}
                    className="p-2 bg-blue-600/90 backdrop-blur-sm border border-blue-500 rounded-lg text-white hover:bg-blue-500 transition-colors shadow-lg"
                    title="Edit Proyek"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(port.id)}
                    disabled={isDeleting === port.id}
                    className="p-2 bg-slate-950/90 backdrop-blur-sm border border-slate-700 rounded-lg text-slate-300 hover:text-rose-400 hover:border-rose-500 transition-colors shadow-lg"
                    title="Hapus Proyek"
                  >
                    {isDeleting === port.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Thumbnail Area */}
                <div className="h-48 bg-slate-950 relative overflow-hidden flex items-center justify-center border-b border-slate-800">
                  {port.media_assets?.length > 0 ? (
                    <img
                      // PERBAIKAN: Render gambar terbaru
                      src={`http://localhost:8000${port.media_assets[port.media_assets.length - 1].file_url}`}
                      alt={port.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-800" />
                  )}
                </div>

                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                    {port.title}
                  </h3>
                  {port.client_name && (
                    <span className="text-xs font-medium text-blue-400 mb-3 block">
                      {port.client_name}
                    </span>
                  )}
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">
                    {port.description}
                  </p>

                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {port.technologies?.slice(0, 3).map((t) => (
                      <span
                        key={t.id}
                        className="px-2 py-1 bg-slate-800/50 border border-slate-700 rounded text-[10px] font-semibold text-slate-300"
                      >
                        {t.name}
                      </span>
                    ))}
                    {(port.technologies?.length || 0) > 3 && (
                      <span className="px-2 py-1 bg-slate-800/50 border border-slate-700 rounded text-[10px] font-semibold text-slate-500">
                        +{port.technologies.length - 3}
                      </span>
                    )}
                  </div>
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

      {/* --- FORM SLIDE-OVER (Dinamic Create/Edit) --- */}
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
                  {editingId ? (
                    <Pencil className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Briefcase className="w-5 h-5 text-blue-500" />
                  )}
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    {editingId ? "Perbarui Proyek" : "Proyek Baru"}
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
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Judul Proyek <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 text-slate-200 text-sm rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="E-Commerce Nusantara..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Deskripsi <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 text-slate-200 text-sm rounded-xl focus:outline-none focus:border-blue-500 transition-all resize-none"
                    placeholder="Ceritakan tantangan dan solusi..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Klien (Opsional)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 text-slate-200 text-sm rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                        placeholder="PT Sukses Makmur"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Tautan Web (Opsional)
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="url"
                        value={projectUrl}
                        onChange={(e) => setProjectUrl(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 text-slate-200 text-sm rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pemilihan Teknologi */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Tumpukan Teknologi <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTechs.map((tech) => (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => toggleTech(tech.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        selectedTechs.includes(tech.id)
                          ? "bg-blue-600/20 border-blue-500 text-blue-400"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {tech.name}
                    </button>
                  ))}
                  {availableTechs.length === 0 && (
                    <span className="text-xs text-slate-500">
                      Belum ada teknologi.
                    </span>
                  )}
                </div>
              </div>

              {/* Upload Media */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Sampul Proyek{" "}
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
                        Maksimal 2MB
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
                  "Simpan Perubahan"
                ) : (
                  "Simpan Proyek"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Users, GraduationCap, LayoutDashboard,
  FileText, LogOut, AlertTriangle,
} from "lucide-react";
import Image from "next/image";

interface Guru {
  id: string;
  nama_guru: string;
  mata_pelajaran: string;
}

export default function AdminGuruPage() {
  const router = useRouter();

  const [semuaGuru, setSemuaGuru] = useState<Guru[]>([]);
  const [showModalGuru, setShowModalGuru] = useState(false);
  const [selectedGuru, setSelectedGuru] = useState<Guru | null>(null);
  const [inputEditGuru, setInputEditGuru] = useState({ nama_guru: "", mata_pelajaran: "" });
  const [showTambahGuru, setShowTambahGuru] = useState(false);
  const [inputTambahGuru, setInputTambahGuru] = useState({ id: "", nama_guru: "", mata_pelajaran: "" });
  const [showDeleteGuruModal, setShowDeleteGuruModal] = useState(false);
  const [selectedGuruId, setSelectedGuruId] = useState<string>("");

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  const openEditGuru = (guru: Guru) => {
    setSelectedGuru(guru);
    setInputEditGuru({ nama_guru: guru.nama_guru, mata_pelajaran: guru.mata_pelajaran });
    setShowModalGuru(true);
  };

  const closeModalGuru = () => {
    setSelectedGuru(null);
    setShowModalGuru(false);
  };

  const closeTambahGuru = () => {
    setInputTambahGuru({ id: "", nama_guru: "", mata_pelajaran: "" });
    setShowTambahGuru(false);
  };

  const handleTambahGuru = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/guru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputTambahGuru),
      });
      if (res.ok) {
        setSemuaGuru([...semuaGuru, { ...inputTambahGuru }]);
        closeTambahGuru();
      } else {
        alert("Gagal menambahkan guru. Pastikan ID belum terdaftar.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditGuru = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuru) return;
    try {
      const res = await fetch(`/api/admin/guru/${selectedGuru.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputEditGuru),
      });
      if (res.ok) {
        setSemuaGuru(semuaGuru.map((g) =>
          g.id === selectedGuru.id ? { ...g, ...inputEditGuru } : g
        ));
        closeModalGuru();
      } else {
        alert("Gagal memperbarui data guru.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteGuru = async () => {
    if (!selectedGuruId) return;
    try {
      const res = await fetch(`/api/admin/guru/${selectedGuruId}`, { method: "DELETE" });
      if (res.ok) {
        setSemuaGuru(semuaGuru.filter((g) => g.id !== selectedGuruId));
        setShowDeleteGuruModal(false);
        setSelectedGuruId("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch("/api/admin/guru");
        const data = await res.json();
        setSemuaGuru(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetch_();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100" suppressHydrationWarning>

      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="text-center pt-4">
            <div className="relative w-16 h-16 mx-auto mb-3">
              <Image src="/logo.png" alt="Logo" fill sizes="64px"
                className="rounded-lg object-cover border border-slate-700" priority />
            </div>
            <h2 className="text-sm font-semibold tracking-wide leading-snug px-2 text-slate-200">
              Aplikasi Pengolahan <br /> Nilai Siswa
            </h2>
          </div>
          <hr className="border-slate-800 mx-[-16px]" />
          <nav className="space-y-1">
            <button type="button" onClick={() => router.push("/admin/dashboard")}
              className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition text-slate-400 hover:text-slate-200 hover:bg-slate-800/50">
              <LayoutDashboard size={18} /><span>Dashboard</span>
            </button>
            <button type="button" onClick={() => router.push("/admin/kelola-siswa")}
              className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition text-slate-400 hover:text-slate-200 hover:bg-slate-800/50">
              <Users size={18} /><span>Kelola Data Siswa</span>
            </button>
            <button type="button" onClick={() => router.push("/admin/kelola-guru")}
              className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition bg-indigo-600 text-white shadow-md shadow-indigo-600/10">
              <GraduationCap size={18} /><span>Kelola Data Guru</span>
            </button>
            <button type="button" onClick={() => router.push("/admin/laporan-nilai")}
              className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition text-slate-400 hover:text-slate-200 hover:bg-slate-800/50">
              <FileText size={18} /><span>Laporan Nilai</span>
            </button>
          </nav>
        </div>
        <div className="pb-4">
          <button type="button" onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-950/40 border border-slate-700 hover:border-red-900/50 text-slate-300 hover:text-red-400 font-medium py-2 px-4 rounded-full text-sm transition-colors shadow-sm">
            <LogOut size={16} /><span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Kelola Data Guru</h1>
            <p className="text-sm text-slate-400 mt-1">Daftar keseluruhan guru yang terdaftar di dalam sistem</p>
          </div>
          <button onClick={() => setShowTambahGuru(true)} type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-sm">
            + Tambah Guru
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Nama Guru</th>
                  <th className="py-3 px-4">Mata Pelajaran</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {semuaGuru.length > 0 ? (
                  semuaGuru.map((guru) => (
                    <tr key={guru.id} className="border-b border-slate-800/60 hover:bg-slate-800/20 transition">
                      <td className="py-3.5 px-4">{guru.id}</td>
                      <td className="py-3.5 px-4">{guru.nama_guru}</td>
                      <td className="py-3.5 px-4">{guru.mata_pelajaran}</td>
                      <td className="py-3.5 px-4 text-center">
                        <button type="button" onClick={() => openEditGuru(guru)}
                          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 mr-2 transition">
                          Edit
                        </button>
                        <button type="button" onClick={() => { setSelectedGuruId(guru.id); setShowDeleteGuruModal(true); }}
                          className="text-xs bg-red-950/40 hover:bg-red-900/60 text-red-400 px-2.5 py-1 rounded border border-red-900/50 transition">
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      Belum ada data atau sedang memuat data guru...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showTambahGuru && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Tambah Guru</h2>
              <form onSubmit={handleTambahGuru} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">ID Guru</label>
                  <input type="text" value={inputTambahGuru.id} required placeholder="Masukkan ID unik"
                    onChange={(e) => setInputTambahGuru({ ...inputTambahGuru, id: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Nama Guru</label>
                  <input type="text" value={inputTambahGuru.nama_guru} required placeholder="Nama Lengkap dengan Gelar"
                    onChange={(e) => setInputTambahGuru({ ...inputTambahGuru, nama_guru: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Mata Pelajaran</label>
                  <input type="text" value={inputTambahGuru.mata_pelajaran} required placeholder="Contoh: Pemrograman Web"
                    onChange={(e) => setInputTambahGuru({ ...inputTambahGuru, mata_pelajaran: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={closeTambahGuru}
                    className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-sm font-medium">Batal</button>
                  <button type="submit"
                    className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-sm font-medium text-white">Tambah Data</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showModalGuru && selectedGuru && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Edit Data Guru</h2>
              <form onSubmit={handleEditGuru} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">ID Guru</label>
                  <input type="text" value={selectedGuru.id} disabled
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-500 font-mono cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Nama Guru</label>
                  <input type="text" value={inputEditGuru.nama_guru} required
                    onChange={(e) => setInputEditGuru({ ...inputEditGuru, nama_guru: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Mata Pelajaran</label>
                  <input type="text" value={inputEditGuru.mata_pelajaran} required
                    onChange={(e) => setInputEditGuru({ ...inputEditGuru, mata_pelajaran: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={closeModalGuru}
                    className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-sm font-medium">Batal</button>
                  <button type="submit"
                    className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-sm font-medium text-white">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteGuruModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl shadow-black/50">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-950/60 border border-red-800/50 rounded-full flex items-center justify-center mb-4 text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">Konfirmasi Hapus</h3>
                <p className="text-sm text-slate-400 mt-2 px-2">
                  Hapus data guru dengan ID{" "}
                  <span className="font-mono text-indigo-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{selectedGuruId}</span>?
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => { setShowDeleteGuruModal(false); setSelectedGuruId(""); }}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-sm transition-colors">
                  Batal
                </button>
                <button type="button" onClick={handleDeleteGuru}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors">
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
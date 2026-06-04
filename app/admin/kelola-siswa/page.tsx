'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Users, GraduationCap, LayoutDashboard,
  FileText, LogOut, AlertTriangle, Loader2,
} from "lucide-react";
import Image from "next/image";

type Siswa = {
  nis: string;
  nama: string;
  kelas: string;
  mata_pelajaran: string;
  id_guru: string;
};

type Guru = {
  id: string;
  mata_pelajaran: string;
};

export default function AdminSiswaPage() {
  const router = useRouter();

  const [daftarGuru, setDaftarGuru] = useState<Guru[]>([]);
  const [semuaSiswa, setSemuaSiswa] = useState<Siswa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal edit
  const [showModalSiswa, setShowModalSiswa] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);

  const [inputEdit, setInputEdit] = useState({ nama: "", kelas: "", id_guru: "" });

  // Modal tambah
  const [showTambahSiswa, setShowTambahSiswa] = useState(false);
  const [inputTambah, setInputTambah] = useState({ nis: "", nama: "", kelas: "", id_guru: "" });

  // Modal hapus
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSiswaHapus, setSelectedSiswaHapus] = useState<Siswa | null>(null); 


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resSiswa, resGuru] = await Promise.all([
        fetch("/api/admin/siswa"),
        fetch("/api/admin/guru"),
      ]);
      const dataSiswa = await resSiswa.json();
      const dataGuru = await resGuru.json();
      setSemuaSiswa(dataSiswa);
      setDaftarGuru(dataGuru);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  const openEditSiswa = (siswa: Siswa) => {
    setSelectedSiswa(siswa);
    setInputEdit({ nama: siswa.nama, kelas: siswa.kelas, id_guru: siswa.id_guru ?? "" });
    setShowModalSiswa(true);
  };

  const closeModalSiswa = () => {
    setSelectedSiswa(null);
    setInputEdit({ nama: "", kelas: "", id_guru: "" });
    setShowModalSiswa(false);
  };

  const handleEditSiswa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswa) return;
    try {
      const res = await fetch(`/api/admin/siswa/${selectedSiswa.nis}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputEdit),
      });
      if (res.ok) {
        await fetchData();
        closeModalSiswa();
      } else {
        alert("Gagal memperbarui data siswa.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeTambahSiswa = () => {
    setInputTambah({ nis: "", nama: "", kelas: "", id_guru: "" });
    setShowTambahSiswa(false);
  };

  const handleTambahSiswa = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/siswa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputTambah),
      });
      if (res.ok) {
        await fetchData();
        closeTambahSiswa();
      } else {
        alert("Gagal menambahkan siswa. Pastikan NIS belum terdaftar.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSiswa = async () => {
    if (!selectedSiswaHapus) return;
    try {
      const res = await fetch(`/api/admin/siswa/${selectedSiswaHapus.nis}`, { method: "DELETE" });
      if (res.ok) {
        setSemuaSiswa(semuaSiswa.filter((s) => s.nis !== selectedSiswaHapus.nis));
        setShowDeleteModal(false);
        setSelectedSiswaHapus(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100" suppressHydrationWarning>

      {/* Sidebar */}
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
              className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition bg-indigo-600 text-white shadow-md shadow-indigo-600/10">
              <Users size={18} /><span>Kelola Data Siswa</span>
            </button>
            <button type="button" onClick={() => router.push("/admin/kelola-guru")}
              className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition text-slate-400 hover:text-slate-200 hover:bg-slate-800/50">
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

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Kelola Data Siswa</h1>
            <p className="text-sm text-slate-400 mt-1">Daftar keseluruhan siswa yang terdaftar di dalam sistem</p>
          </div>
          <button onClick={() => setShowTambahSiswa(true)} type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-sm">
            + Tambah Siswa
          </button>
        </div>

        {/* Tabel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                  <th className="py-3 px-4">NIS</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Mata Pelajaran</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-500">
                      <Loader2 size={20} className="animate-spin mx-auto mb-2" />
                      Memuat data siswa...
                    </td>
                  </tr>
                ) : semuaSiswa.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      Belum ada data siswa.
                    </td>
                  </tr>
                ) : (
                  semuaSiswa.map((siswa) => (
                    <tr key={siswa.nis} className="border-b border-slate-800/60 hover:bg-slate-800/20 transition">
                      <td className="py-3.5 px-4">{siswa.nis}</td>
                      <td className="py-3.5 px-4">{siswa.nama}</td>
                      <td className="py-3.5 px-4">{siswa.kelas}</td>
                      <td className="py-3.5 px-4">{siswa.mata_pelajaran ?? "-"}</td>
                      <td className="py-3.5 px-4 text-center">
                        <button type="button" onClick={() => openEditSiswa(siswa)}
                          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 mr-2 transition">
                          Edit
                        </button>
                        <button type="button" onClick={() => { setSelectedSiswaHapus(siswa); setShowDeleteModal(true); }}
                          className="text-xs bg-red-950/40 hover:bg-red-900/60 text-red-400 px-2.5 py-1 rounded border border-red-900/50 transition">
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModalSiswa && selectedSiswa && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Edit Data Siswa</h2>
              <form onSubmit={handleEditSiswa} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">NIS</label>
                  <input type="text" value={selectedSiswa.nis} disabled
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-500 font-mono cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Nama Siswa</label>
                  <input type="text" value={inputEdit.nama} required
                    onChange={(e) => setInputEdit({ ...inputEdit, nama: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Kelas</label>
                  <input type="text" value={inputEdit.kelas} required
                    onChange={(e) => setInputEdit({ ...inputEdit, kelas: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Mata Pelajaran</label>
                  <select
                    value={inputEdit.id_guru}
                    required
                    onChange={(e) => setInputEdit({ ...inputEdit, id_guru: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
                  >
                    <option value="">Pilih Mata Pelajaran</option>
                    {daftarGuru.map((guru) => (
                      <option key={guru.id} value={guru.id}>{guru.mata_pelajaran}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={closeModalSiswa}
                    className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-sm font-medium">Batal</button>
                  <button type="submit"
                    className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-sm font-medium text-white">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showTambahSiswa && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Tambah Siswa</h2>
              <form onSubmit={handleTambahSiswa} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">NIS</label>
                  <input type="text" value={inputTambah.nis} required placeholder="Masukkan NIS baru"
                    onChange={(e) => setInputTambah({ ...inputTambah, nis: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Nama Siswa</label>
                  <input type="text" value={inputTambah.nama} required placeholder="Nama Lengkap"
                    onChange={(e) => setInputTambah({ ...inputTambah, nama: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Kelas</label>
                  <input type="text" value={inputTambah.kelas} required placeholder="Contoh: XII-RPL-1"
                    onChange={(e) => setInputTambah({ ...inputTambah, kelas: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Mata Pelajaran</label>
                  <select
                    value={inputTambah.id_guru}
                    required
                    onChange={(e) => setInputTambah({ ...inputTambah, id_guru: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
                  >
                    <option value="">Pilih Mata Pelajaran</option>
                    {daftarGuru.map((guru) => (
                      <option key={guru.id} value={guru.id}>{guru.mata_pelajaran}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={closeTambahSiswa}
                    className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-sm font-medium">Batal</button>
                  <button type="submit"
                    className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-sm font-medium text-white">Tambah Data</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteModal && selectedSiswaHapus && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl shadow-black/50">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-950/60 border border-red-800/50 rounded-full flex items-center justify-center mb-4 text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">Konfirmasi Hapus</h3>
                <p className="text-sm text-slate-400 mt-2 px-2">
                  Hapus data siswa{" "}
                  <span className="text-slate-200 font-medium">{selectedSiswaHapus.nama}</span>{" "}
                  dengan NIS{" "}
                  <span className="font-mono text-indigo-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    {selectedSiswaHapus.nis}
                  </span>?
                  <br />
                  <span className="text-red-400/80 text-xs mt-1 block">Tindakan ini tidak dapat dibatalkan.</span>
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button"
                  onClick={() => { setShowDeleteModal(false); setSelectedSiswaHapus(null); }}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-sm transition-colors">
                  Batal
                </button>
                <button type="button" onClick={handleDeleteSiswa}
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
'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Users,
  LayoutDashboard,
  FileText,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";

type Nilai = {
  id: number;
  nis: string;
  nama: string;
  kelas: string;
  mata_pelajaran: string;
  nilai_tugas: number;
  nilai_uts: number;
  nilai_uas: number;
  nilai_akhir: number;
  status_kelulusan: string | null; 
  status_nilai: string;         
};

export default function GuruNilaiPage() {
  const router = useRouter();

  const [semuaNilai, setSemuaNilai] = useState<Nilai[]>([]);
  const [showModalTambahNilai, setShowModalTambahNilai] = useState(false);
  const [showModalEditNilai, setShowModalEditNilai] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState<Nilai | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [inputTambahNilai, setInputTambahNilai] = useState({
    nis: "",
    mata_pelajaran: "",
    nilai_tugas: "",
    nilai_uts: "",
    nilai_uas: "",
    status_nilai: "Belum Dinilai",
  });

  const [inputEditNilai, setInputEditNilai] = useState({
    nilai_tugas: "",
    nilai_uts: "",
    nilai_uas: "",
    status_nilai: "",
  });

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  };

  const hitungNilai = (tugas: number, uts: number, uas: number) => {
    const akhir = tugas * 0.3 + uts * 0.3 + uas * 0.4;
    return {
      nilaiAkhir: parseFloat(akhir.toFixed(2)),
      statusKelulusan: akhir >= 75 ? "Lulus" : "Tidak Lulus",
    };
  };

  const openTambahNilai = (nilai: Nilai) => {
    setSelectedSiswa(nilai);

    setSelectedId(nilai.id);

    setInputTambahNilai({
      nis: nilai.nis,
      mata_pelajaran: nilai.mata_pelajaran,
      nilai_tugas: "",
      nilai_uts: "",
      nilai_uas: "",
      status_nilai: "Belum Dinilai",
    });

    setShowModalTambahNilai(true);
  };

  const openEditNilai = (nilai: Nilai) => {
    setSelectedSiswa(nilai);
    setSelectedId(nilai.id);

    setInputEditNilai({
      nilai_tugas: String(nilai.nilai_tugas || ""),
      nilai_uts: String(nilai.nilai_uts || ""),
      nilai_uas: String(nilai.nilai_uas || ""),
      status_nilai: nilai.status_nilai || "Belum Dinilai",
    });

    setShowModalEditNilai(true);
  };

  const closeModalTambah = () => {
    setSelectedSiswa(null);
    setInputTambahNilai({ nis: "", mata_pelajaran: "", nilai_tugas: "", nilai_uts: "", nilai_uas: "", status_nilai: "Belum Dinilai" });
    setShowModalTambahNilai(false);
  };

  const closeModalEdit = () => {
    setSelectedSiswa(null);

    setInputEditNilai({
      nilai_tugas: "",
      nilai_uts: "",
      nilai_uas: "",
      status_nilai: "",
    });

    setShowModalEditNilai(false);
  };

  const handleTambahNilai = async (e: React.FormEvent) => {
    e.preventDefault();
    const tugas = Number(inputTambahNilai.nilai_tugas);
    const uts = Number(inputTambahNilai.nilai_uts);
    const uas = Number(inputTambahNilai.nilai_uas);
    const hasil = hitungNilai(tugas, uts, uas);
    try {
      const res = await fetch(`/api/guru/nilai/${selectedId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inputTambahNilai, nilai_tugas: tugas, nilai_uts: uts, nilai_uas: uas, nilai_akhir: hasil.nilaiAkhir, status_kelulusan: hasil.statusKelulusan }),
      });
      if (res.ok) {
        await fetchNilai();
        closeModalTambah();
      } else {
        alert("Gagal menambahkan nilai.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditNilai = async (e: React.FormEvent) => {
    e.preventDefault();
    const tugas = Number(inputEditNilai.nilai_tugas);
    const uts = Number(inputEditNilai.nilai_uts);
    const uas = Number(inputEditNilai.nilai_uas);
    const hasil = hitungNilai(tugas, uts, uas);
    try {
      const res = await fetch(`/api/guru/nilai/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inputEditNilai, nilai_tugas: tugas, nilai_uts: uts, nilai_uas: uas, nilai_akhir: hasil.nilaiAkhir, status_kelulusan: hasil.statusKelulusan }),
      });
      if (res.ok) {
        await fetchNilai();
        closeModalEdit();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteNilai = async () => {
    try {
      const res = await fetch(`/api/guru/nilai/${selectedId}`, { method: "DELETE" });
      if (res.ok) {
        await fetchNilai();
        setShowDeleteModal(false);
        setSelectedId(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNilai = async () => {
    try {
      const res = await fetch("/api/guru/nilai");
      const data = await res.json();
      setSemuaNilai(data);
    } catch (error) {
      console.error("Gagal memuat data nilai:", error);
    }
  };

  useEffect(() => {
    fetchNilai();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100" suppressHydrationWarning>

      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="text-center pt-4">
            <div className="relative w-16 h-16 mx-auto mb-3">
              <Image src="/logo.png" alt="Logo Aplikasi" fill sizes="64px"
                className="rounded-lg object-cover border border-slate-700" priority />
            </div>
            <h2 className="text-sm font-semibold tracking-wide leading-snug px-2 text-slate-200">
              Aplikasi Pengolahan <br /> Nilai Siswa
            </h2>
          </div>

          <hr className="border-slate-800 mx-[-16px]" />

          <nav className="space-y-1">
            <button type="button" onClick={() => router.push("/guru/dashboard")}
              className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition text-slate-400 hover:text-slate-200 hover:bg-slate-800/50">
              <LayoutDashboard size={18} /><span>Dashboard</span>
            </button>
            <button type="button" onClick={() => router.push("/guru/kelola-nilai")}
              className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition bg-indigo-600 text-white shadow-md shadow-indigo-600/10">
              <Users size={18} /><span>Kelola Nilai Siswa</span>
            </button>
            <button type="button" onClick={() => router.push("/guru/laporan-nilai")}
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
            <h1 className="text-2xl font-bold text-slate-100">Kelola Nilai Siswa</h1>
            <p className="text-sm text-slate-400 mt-1">Tambah atau edit nilai siswa sesuai mata pelajaran yang diampu</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                  <th className="py-3 px-4 text-center">NIS</th>
                  <th className="py-3 px-4 text-center">Nama Siswa</th>
                  <th className="py-3 px-4 text-center">Kelas</th>
                  <th className="py-3 px-4 text-center">Mata Pelajaran</th>
                  <th className="py-3 px-4 text-center">Nilai Tugas</th>
                  <th className="py-3 px-4 text-center">Nilai UTS</th>
                  <th className="py-3 px-4 text-center">Nilai UAS</th>
                  <th className="py-3 px-4 text-center">Nilai Akhir</th>
                  <th className="py-3 px-4 text-center">Status Kelulusan</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {semuaNilai.length > 0 ? (
                  semuaNilai.map((nilai) => (
                    <tr key={nilai.id} className="border-b border-slate-800/60 hover:bg-slate-800/20 transition">
                      <td className="py-3.5 px-4 text-center font-mono text-indigo-400">{nilai.nis}</td>
                      <td className="py-3.5 px-4 text-center text-slate-200 font-medium">{nilai.nama}</td>
                      <td className="py-3.5 px-4 text-center text-slate-400">{nilai.kelas}</td>
                      <td className="py-3.5 px-4 text-center text-slate-400">{nilai.mata_pelajaran}</td>
                      <td className="py-3.5 px-4 text-center">{nilai.nilai_tugas}</td>
                      <td className="py-3.5 px-4 text-center">{nilai.nilai_uts}</td>
                      <td className="py-3.5 px-4 text-center">{nilai.nilai_uas}</td>
                      <td className="py-3.5 px-4 text-center">{nilai.nilai_akhir}</td>
                      <td className="py-3.5 px-4 text-center text-slate-300">{nilai.status_kelulusan || "-"}</td>
                      <td className="py-3.5 px-4 text-center">
                        <button type="button" onClick={() => openTambahNilai(nilai)}
                          className="text-xs bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-400 px-2.5 py-1 rounded border border-indigo-800/50 mr-2 transition">
                          + Input Nilai
                        </button>
                        <button type="button" onClick={() => openEditNilai(nilai)}
                          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 mr-2 transition">
                          Edit Nilai
                        </button>
                        <button type="button" onClick={() => { setSelectedId(nilai.id); setShowDeleteModal(true); }}
                          className="text-xs bg-red-950/40 hover:bg-red-900/60 text-red-400 px-2.5 py-1 rounded border border-red-900/50 transition">
                          Hapus Nilai
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-500">
                      Belum ada data atau sedang memuat data siswa...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModalTambahNilai && selectedSiswa && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-1">Tambah Nilai</h2>
              <p className="text-sm text-slate-400 mb-4">
                Siswa: <span className="text-slate-200 font-medium">{selectedSiswa.nama}</span> — {selectedSiswa.kelas}
              </p>
              <form onSubmit={handleTambahNilai} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">NIS</label>
                  <input type="text" value={selectedSiswa.nis} disabled
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-500 font-mono cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={inputTambahNilai.mata_pelajaran}
                    disabled
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-500 cursor-not-allowed"
                  />
                </div>
                {["nilai_tugas", "nilai_uts", "nilai_uas"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm mb-1">
                      {field === "nilai_tugas" ? "Nilai Tugas" : field === "nilai_uts" ? "Nilai UTS" : "Nilai UAS"}
                    </label>
                    <input type="number"
                      value={inputTambahNilai[field as keyof typeof inputTambahNilai]}
                      onChange={(e) => setInputTambahNilai({ ...inputTambahNilai, [field]: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm mb-1">Status Nilai</label>
                  <select 
                    value={inputTambahNilai.status_nilai}
                    onChange={(e) => setInputTambahNilai({ ...inputTambahNilai, status_nilai: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
                  >
                    <option value="Belum Dinilai">Belum Dinilai</option>
                    <option value="Sudah Dinilai">Sudah Dinilai</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={closeModalTambah}
                    className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-sm font-medium">Batal</button>
                  <button type="submit"
                    className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-sm font-medium text-white">Simpan Nilai</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showModalEditNilai && selectedSiswa && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-1">Edit Nilai</h2>
              <p className="text-sm text-slate-400 mb-4">
                Siswa: <span className="text-slate-200 font-medium">{selectedSiswa.nama}</span> — {selectedSiswa.kelas}
              </p>
              <form onSubmit={handleEditNilai} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Mata Pelajaran</label>

                  <div className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-400">
                    {selectedSiswa.mata_pelajaran}
                  </div>
                </div>
                {["nilai_tugas", "nilai_uts", "nilai_uas"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm mb-1">
                      {field === "nilai_tugas" ? "Nilai Tugas" : field === "nilai_uts" ? "Nilai UTS" : "Nilai UAS"}
                    </label>
                    <input type="number"
                      value={inputEditNilai[field as keyof typeof inputEditNilai]}
                      onChange={(e) => setInputEditNilai({ ...inputEditNilai, [field]: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2" />
                  </div>
                ))}
                <div>
          <label className="block text-sm mb-1">Status Nilai</label>
          <select 
            value={inputEditNilai.status_nilai}
            onChange={(e) => setInputEditNilai({ ...inputEditNilai, status_nilai: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
          >
            <option value="Belum Dinilai">Belum Dinilai</option>
            <option value="Sudah Dinilai">Sudah Dinilai</option>
          </select>
        </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={closeModalEdit}
                    className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-sm font-medium">Batal</button>
                  <button type="submit"
                    className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-sm font-medium text-white">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl shadow-black/50">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-950/60 border border-red-800/50 rounded-full flex items-center justify-center mb-4 text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">Konfirmasi Hapus</h3>
                <p className="text-sm text-slate-400 mt-2 px-2">
                  Hapus nilai siswa dengan ID{" "}
                  <span className="font-mono text-indigo-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{selectedId}</span>?
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => { setShowDeleteModal(false); setSelectedId(null); }}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-sm transition-colors">
                  Batal
                </button>
                <button type="button" onClick={handleDeleteNilai}
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
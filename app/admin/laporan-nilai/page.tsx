'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users, GraduationCap, LayoutDashboard, FileText, LogOut } from "lucide-react";
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

export default function AdminLaporanPage() {
  const router = useRouter();
  const [dataNilai, setDataNilai] = useState<Nilai[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/laporan"); // Pastikan endpoint ini sesuai
        const data = await res.json();
        setDataNilai(data);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };
    fetchData();
  }, []);

    const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
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
              className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition text-slate-400 hover:text-slate-200 hover:bg-slate-800/50">
              <GraduationCap size={18} /><span>Kelola Data Guru</span>
            </button>
            <button type="button" onClick={() => router.push("/admin/laporan-nilai")}
              className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition bg-indigo-600 text-white shadow-md shadow-indigo-600/10">
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

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Laporan Nilai Keseluruhan</h1>
          <p className="text-slate-400">Rekapitulasi data nilai seluruh siswa.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-xs tracking-wider font-bold">
                <th className="py-4 px-4">NIS</th>
                <th className="py-4 px-4">Nama</th>
                <th className="py-4 px-4">Mapel</th>
                <th className="py-4 px-4 text-center">Tugas</th>
                <th className="py-4 px-4 text-center">UTS</th>
                <th className="py-4 px-4 text-center">UAS</th>
                <th className="py-4 px-4 text-center">Akhir</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-center">Kelulusan</th>
              </tr>
            </thead>
            <tbody>
              {dataNilai.map((n) => (
                <tr key={n.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="py-4 px-4 font-mono text-indigo-400">{n.nis}</td>
                  <td className="py-4 px-4">{n.nama}</td>
                  <td className="py-4 px-4 text-slate-400">{n.mata_pelajaran}</td>
                  <td className="py-4 px-4 text-center">{n.nilai_tugas}</td>
                  <td className="py-4 px-4 text-center">{n.nilai_uts}</td>
                  <td className="py-4 px-4 text-center">{n.nilai_uas}</td>
                  <td className="py-4 px-4 text-center font-bold">{n.nilai_akhir}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${n.status_nilai === 'Sudah Dinilai' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {n.status_nilai}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${n.status_kelulusan === 'Lulus' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                      {n.status_kelulusan || "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
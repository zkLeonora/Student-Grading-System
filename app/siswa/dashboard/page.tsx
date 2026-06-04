'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, LogOut } from "lucide-react";
import Image from "next/image";

// Tipe data disesuaikan
type Nilai = {
  id: number;
  mata_pelajaran: string;
  nilai_tugas: number;
  nilai_uts: number;
  nilai_uas: number;
  nilai_akhir: number;
  status_kelulusan: string | null;
  status_nilai: string;
};

export default function SiswaDashboardPage() {
  const router = useRouter();
  const [dataNilai, setDataNilai] = useState<Nilai[]>([]);

useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await fetch("/api/siswa/nilai");
            const data = await res.json();

            console.log("DATA API:", data);

            if (Array.isArray(data)) {
                setDataNilai(data);
            }
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
              <Image src="/logo.png" alt="Logo" fill sizes="64px" className="rounded-lg object-cover border border-slate-700" priority />
            </div>
            <h2 className="text-sm font-semibold text-slate-200">Dashboard Siswa</h2>
          </div>
          <hr className="border-slate-800 mx-[-16px]" />
          <nav>
            <button className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium bg-indigo-600 text-white">
              <LayoutDashboard size={18} /><span>Dashboard</span>
            </button>
          </nav>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-950/40 text-slate-300 py-2 rounded-full text-sm">
          <LogOut size={16} /><span>Logout</span>
        </button>
      </aside>

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Nilai Akademik Saya</h1>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-xs">
                <th className="py-4 px-4">Mapel</th>
                <th className="py-4 px-4 text-center">Tugas</th>
                <th className="py-4 px-4 text-center">UTS</th>
                <th className="py-4 px-4 text-center">UAS</th>
                <th className="py-4 px-4 text-center">Akhir</th>
                <th className="py-4 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {dataNilai.map((n) => (
                <tr key={n.id} className="border-b border-slate-800/50">
                  <td className="py-4 px-4">{n.mata_pelajaran}</td>
                  <td className="py-4 px-4 text-center">{n.nilai_tugas}</td>
                  <td className="py-4 px-4 text-center">{n.nilai_uts}</td>
                  <td className="py-4 px-4 text-center">{n.nilai_uas}</td>
                  <td className="py-4 px-4 text-center font-bold">{n.nilai_akhir}</td>
                  <td className="py-4 px-4 text-center">{n.status_nilai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
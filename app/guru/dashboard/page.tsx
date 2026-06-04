'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Users,
  ClipboardList,
  LayoutDashboard,
  FileText,
  LogOut,
} from "lucide-react";
import Image from "next/image";

type Siswa = {
  nis: string;
  nama: string;
  kelas: string;
};

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
  status_nilai: string;
};

type DashboardData = {
  totalSiswa: number;
  totalNilai: number;
  siswa: Siswa[];
  nilai: Nilai[];
};

export default function GuruDashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardData>({
    totalSiswa: 0,
    totalNilai: 0,
    siswa: [],
    nilai: [],
  });
  
  const aktivitasTerbaru = [...dashboard.nilai]
  .sort((a, b) => b.id - a.id)
  .slice(0, 5);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  };

  const belumDinilai = dashboard.nilai.filter(
    (n) => n.status_nilai === "Belum Dinilai"
  ).length;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/guru/dashboard");
        const data = await res.json();
        setDashboard(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100" suppressHydrationWarning>

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="text-center pt-4">
            <div className="relative w-16 h-16 mx-auto mb-3">
              <Image
                src="/logo.png"
                alt="Logo Aplikasi"
                fill
                sizes="64px"
                className="rounded-lg object-cover border border-slate-700"
                priority
              />
            </div>
            <h2 className="text-sm font-semibold tracking-wide leading-snug px-2 text-slate-200">
              Aplikasi Pengolahan <br /> Nilai Siswa
            </h2>
          </div>

          <hr className="border-slate-800 mx-[-16px]" />

          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => router.push("/guru/dashboard")}
              className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/guru/kelola-nilai")}
              className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            >
              <Users size={18} />
              <span>Kelola Nilai Siswa</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/guru/laporan-nilai")}
              className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            >
              <FileText size={18} />
              <span>Laporan Nilai</span>
            </button>
          </nav>
        </div>

        <div className="pb-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-950/40 border border-slate-700 hover:border-red-900/50 text-slate-300 hover:text-red-400 font-medium py-2 px-4 rounded-full text-sm transition-colors shadow-sm"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-100">Selamat Datang</h1>
          <p className="text-sm text-slate-400 mt-1" suppressHydrationWarning>
            Tanggal: {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 320px",
            gridTemplateRows: "auto auto auto",
            gap: "1.5rem",
          }}
        >

          <div
            style={{ gridArea: "1 / 1 / 2 / 2" }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between min-h-[140px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm font-semibold tracking-wider uppercase">Total Siswa</span>
              <Users className="text-indigo-500" size={24} />
            </div>
            <p className="text-4xl font-bold tracking-tight mt-4 text-slate-100">{dashboard.totalSiswa}</p>
          </div>

          <div
            style={{ gridArea: "1 / 2 / 2 / 3" }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between min-h-[140px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm font-semibold tracking-wider uppercase">Total Nilai Yang Perlu Dimasukkan</span>
              <ClipboardList className="text-indigo-500" size={24} />
            </div>
            <p className="text-4xl font-bold tracking-tight mt-4 text-slate-100">{belumDinilai}</p>
          </div>

          <div
            style={{ gridArea: "1 / 3 / 4 / 4" }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
          >
            <h3 className="text-md font-semibold mb-6 text-slate-200 text-center">Aktivitas Terbaru</h3>
            
            <div className="space-y-4"> 
              {aktivitasTerbaru.length > 0 ? (
                aktivitasTerbaru.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-800/30 border-l-4 border-indigo-500 rounded-r-lg p-4 transition-all hover:bg-slate-800/50"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-slate-100 leading-tight">
                        {item.nama}
                      </p>
                    </div>

                    <div className="text-xs text-slate-400 mb-2">
                      Mapel: <span className="text-slate-300">{item.mata_pelajaran}</span>
                    </div>

                    <div className="text-slate-100 leading-tight">
                      NILAI: {item.nilai_akhir}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-48 border border-dashed border-slate-800 rounded-lg text-slate-500 text-sm">
                  <span>Belum ada aktivitas terbaru</span>
                </div>
              )}
            </div>
          </div>

          <div
            style={{ gridArea: "2 / 1 / 3 / 3" }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
          >
            <h3 className="text-md font-semibold mb-3 text-slate-200">Tabel Nilai Siswa</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-medium">
                    <th className="py-2.5 px-3">NIS</th>
                    <th className="py-2.5 px-3">NAMA</th>
                    <th className="py-2.5 px-3">KELAS</th>
                    <th className="py-2.5 px-3">MATA PELAJARAN</th>
                    <th className="py-2.5 px-3 text-right">NILAI AKHIR</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.nilai && dashboard.nilai.length > 0 ? (
                    dashboard.nilai.slice(0, 5).map((n) => (
                      <tr key={n.id} className="border-b border-slate-800/50">
                        <td className="py-3 px-3 font-mono text-indigo-400">{n.nis}</td>
                        <td className="py-3 px-3">{n.nama}</td>
                        <td className="py-3 px-3">{n.kelas}</td>
                        <td className="py-3 px-3">{n.mata_pelajaran}</td>
                        <td className="py-3 px-3 text-right font-semibold">{n.nilai_akhir}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-500">
                        Belum ada nilai yang dimasukkan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div
            style={{ gridArea: "3 / 1 / 4 / 3" }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
          >
            <h3 className="text-md font-semibold mb-3 text-slate-200">Tabel Data Siswa</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-medium">
                    <th className="py-2.5 px-3">NIS</th>
                    <th className="py-2.5 px-3">NAMA</th>
                    <th className="py-2.5 px-3">KELAS</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.siswa.length > 0 ? (
                    dashboard.siswa.slice(0, 3).map((siswa) => (
                      <tr key={siswa.nis} className="border-b border-slate-800/50">
                        <td className="py-3 px-3 font-mono text-indigo-400">{siswa.nis}</td>
                        <td className="py-3 px-3">{siswa.nama}</td>
                        <td className="py-3 px-3">{siswa.kelas}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-slate-500">
                        Belum ada data siswa
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
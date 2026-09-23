'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell, { PageHeader } from "@/components/AppShell";
import {
  DistributionChart,
  HBarList,
  avg,
  groupAvg,
} from "@/components/charts";
import { Timeline } from "@/components/Timeline";
import { SortTh, sortRows, type SortState } from "@/components/SortableTh";
import { useI18n } from "@/components/I18n";
import {
  emptyCell,
  panel,
  panelHeader,
  sectionTitle,
  statItem,
  statLabel,
  statStrip,
  statValue,
  tableHeadRow,
  td,
  tdCenter,
  tr,
} from "@/components/ui";

interface Guru {
  id: string;
  nama_guru: string;
  mata_pelajaran: string;
}

type Siswa = {
  nis: string;
  nama: string;
  kelas: string;
};

type DashboardData = {
  totalSiswa: number;
  totalGuru: number;
  totalNilai: number;
  siswa: Siswa[];
  guru: Guru[];
  nilai: Nilai[];
};

type Nilai = {
  id: number;
  nis: string;
  nama: string;
  kelas: string;
  mata_pelajaran: string;
  nilai_akhir: number;
  nama_guru?: string;
  created_at?: string | null;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { t, tv, locale } = useI18n();

  const [dashboard, setDashboard] = useState<DashboardData>({
    totalSiswa: 0,
    totalGuru: 0,
    totalNilai: 0,
    siswa: [],
    guru: [],
    nilai: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [sortNilai, setSortNilai] = useState<SortState | null>(null);
  const [sortGuru, setSortGuru] = useState<SortState | null>(null);
  const [sortSiswa, setSortSiswa] = useState<SortState | null>(null);

  const aktivitasTerbaru = [...dashboard.nilai]
    .sort((a, b) => {
      const da = a.created_at ?? "";
      const db_ = b.created_at ?? "";
      if (da !== db_) return db_.localeCompare(da);
      return b.id - a.id;
    })
    .slice(0, 8)
    .map((n) => ({
      id: n.id,
      title: n.nama,
      subtitle: `${tv(n.mata_pelajaran)} · ${n.kelas}`,
      actor: n.nama_guru,
      date: n.created_at ?? null,
      badge: String(n.nilai_akhir),
    }));

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        setDashboard(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const loadingRow = (colSpan: number) => (
    <tr>
      <td colSpan={colSpan} className={emptyCell}>
        {t("loading.data")}
      </td>
    </tr>
  );

  return (
    <AppShell
      role="admin"
      active="/admin/dashboard"
      onNavigate={(href) => router.push(href)}
      onLogout={handleLogout}
    >
      <PageHeader
        title={t("dash.welcome")}
        description={
          <>
            {t("date.prefix")}{" "}
            {new Date().toLocaleDateString(locale, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </>
        }
      />

      <div className={statStrip}>
        <div className={statItem}>
          <p className={statLabel}>{t("stat.totalSiswa")}</p>
          <p className={statValue}>{dashboard.totalSiswa}</p>
        </div>
        <div className={statItem}>
          <p className={statLabel}>{t("stat.totalGuru")}</p>
          <p className={statValue}>{dashboard.totalGuru}</p>
        </div>
        <div className={statItem}>
          <p className={statLabel}>{t("stat.totalNilai")}</p>
          <p className={statValue}>{dashboard.totalNilai}</p>
        </div>
        <div className={statItem}>
          <p className={statLabel}>{t("stat.avg")}</p>
          <p className={statValue}>
            {dashboard.nilai.length > 0
              ? avg(dashboard.nilai.map((n) => n.nilai_akhir)).toFixed(1)
              : "—"}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className={panel}>
          <div className={panelHeader}>
            <h2 className={sectionTitle}>{t("chart.distribution")}</h2>
          </div>
          <DistributionChart values={dashboard.nilai.map((n) => n.nilai_akhir)} />
        </section>
        <section className={panel}>
          <div className={panelHeader}>
            <h2 className={sectionTitle}>{t("chart.avgPerKelas")}</h2>
          </div>
          <HBarList
            items={groupAvg(
              dashboard.nilai,
              (n) => n.kelas,
              (n) => n.nilai_akhir
            )}
            format={(v) => v.toFixed(1)}
          />
        </section>
        <section className={panel}>
          <div className={panelHeader}>
            <h2 className={sectionTitle}>{t("chart.avgPerMapel")}</h2>
          </div>
          <HBarList
            items={groupAvg(
              dashboard.nilai,
              (n) => tv(n.mata_pelajaran),
              (n) => n.nilai_akhir
            )}
            format={(v) => v.toFixed(1)}
          />
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <section className={panel}>
            <div className={panelHeader}>
              <h2 className={sectionTitle}>{t("dash.studentGrades")}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={tableHeadRow}>
                    <SortTh label={t("common.nis")} id="nis" sort={sortNilai} onSort={setSortNilai} />
                    <SortTh label={t("th.nama")} id="nama" sort={sortNilai} onSort={setSortNilai} />
                    <SortTh label={t("common.class")} id="kelas" sort={sortNilai} onSort={setSortNilai} />
                    <SortTh label={t("th.mapel")} id="mata_pelajaran" sort={sortNilai} onSort={setSortNilai} />
                    <SortTh label={t("th.nilaiAkhir")} id="nilai_akhir" sort={sortNilai} onSort={setSortNilai} center />
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    loadingRow(5)
                  ) : dashboard.nilai && dashboard.nilai.length > 0 ? (
                    sortRows(dashboard.nilai, sortNilai).slice(0, 5).map((n) => (
                      <tr key={n.id} className={tr}>
                        <td className={td + " font-mono"}>{n.nis}</td>
                        <td className={td + " font-medium text-white"}>{n.nama}</td>
                        <td className={td}>{n.kelas}</td>
                        <td className={td}>{tv(n.mata_pelajaran)}</td>
                        <td className={tdCenter + " font-bold text-white"}>
                          {n.nilai_akhir}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className={emptyCell}>
                        {t("empty.noNilai")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className={panel}>
            <div className={panelHeader}>
              <h2 className={sectionTitle}>{t("dash.teacherData")}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={tableHeadRow}>
                    <SortTh label={t("common.id")} id="id" sort={sortGuru} onSort={setSortGuru} />
                    <SortTh label={t("th.nama")} id="nama_guru" sort={sortGuru} onSort={setSortGuru} />
                    <SortTh label={t("th.mapel")} id="mata_pelajaran" sort={sortGuru} onSort={setSortGuru} />
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    loadingRow(3)
                  ) : dashboard.guru.length > 0 ? (
                    sortRows(dashboard.guru, sortGuru).slice(0, 3).map((guru) => (
                      <tr key={guru.id} className={tr}>
                        <td className={td + " font-mono"}>{guru.id}</td>
                        <td className={td + " font-medium text-white"}>
                          {guru.nama_guru}
                        </td>
                        <td className={td}>{tv(guru.mata_pelajaran)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className={emptyCell}>
                        {t("empty.noGuru")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className={panel}>
            <div className={panelHeader}>
              <h2 className={sectionTitle}>{t("dash.studentData")}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={tableHeadRow}>
                    <SortTh label={t("common.nis")} id="nis" sort={sortSiswa} onSort={setSortSiswa} />
                    <SortTh label={t("th.nama")} id="nama" sort={sortSiswa} onSort={setSortSiswa} />
                    <SortTh label={t("common.class")} id="kelas" sort={sortSiswa} onSort={setSortSiswa} />
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    loadingRow(3)
                  ) : dashboard.siswa.length > 0 ? (
                    sortRows(dashboard.siswa, sortSiswa).slice(0, 3).map((siswa) => (
                      <tr key={siswa.nis} className={tr}>
                        <td className={td + " font-mono"}>{siswa.nis}</td>
                        <td className={td + " font-medium text-white"}>
                          {siswa.nama}
                        </td>
                        <td className={td}>{siswa.kelas}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className={emptyCell}>
                        {t("empty.noSiswa")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <section className={panel + " h-full"}>
            <div className={panelHeader}>
              <h2 className={sectionTitle}>{t("dash.activity")}</h2>
            </div>
            {isLoading ? (
              <p className={emptyCell}>{t("loading.data")}</p>
            ) : (
              <Timeline items={aktivitasTerbaru} />
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
}

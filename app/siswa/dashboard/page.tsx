'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AppShell, { PageHeader } from "@/components/AppShell";
import {
  DistributionChart,
  DonutChart,
  HBarList,
  avg,
} from "@/components/charts";
import { SortTh, sortRows, type SortState } from "@/components/SortableTh";
import { useI18n } from "@/components/I18n";
import {
  badgeStatusNilai,
  emptyCell,
  panel,
  panelHeader,
  sectionTitle,
  statItem,
  statLabel,
  statStripFour,
  statValue,
  tableHeadRow,
  td,
  tdCenter,
  tr,
} from "@/components/ui";

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
  const { t, tv } = useI18n();
  const [dataNilai, setDataNilai] = useState<Nilai[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState<SortState | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/siswa/nilai");
        const data = await res.json();

        if (Array.isArray(data)) {
          setDataNilai(data);
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  const nilaiAkhir = dataNilai.map((n) => n.nilai_akhir);
  const rataRata = dataNilai.length > 0 ? avg(nilaiAkhir) : null;
  const tertinggi = dataNilai.length > 0 ? Math.max(...nilaiAkhir) : null;
  const terendah = dataNilai.length > 0 ? Math.min(...nilaiAkhir) : null;
  const lulus = dataNilai.filter((n) => n.status_kelulusan === "Lulus").length;
  const tidakLulus = dataNilai.filter(
    (n) => n.status_kelulusan && n.status_kelulusan !== "Lulus"
  ).length;
  const belumDinilai = dataNilai.filter(
    (n) => n.status_kelulusan === null || n.status_nilai !== "Sudah Dinilai"
  ).length;

  return (
    <AppShell
      role="siswa"
      active="/siswa/dashboard"
      onNavigate={(href) => router.push(href)}
      onLogout={handleLogout}
    >
      <PageHeader
        title={t("siswa.title")}
        description={t("siswa.desc")}
      />

      <div className={statStripFour}>
        <div className={statItem}>
          <p className={statLabel}>{t("stat.avg")}</p>
          <p className={statValue}>
            {rataRata !== null ? rataRata.toFixed(1) : "—"}
          </p>
        </div>
        <div className={statItem}>
          <p className={statLabel}>{t("stat.tertinggi")}</p>
          <p className={statValue}>
            {tertinggi !== null ? tertinggi : "—"}
          </p>
        </div>
        <div className={statItem}>
          <p className={statLabel}>{t("stat.terendah")}</p>
          <p className={statValue}>
            {terendah !== null ? terendah : "—"}
          </p>
        </div>
        <div className={statItem}>
          <p className={statLabel}>{t("stat.jumlahMapel")}</p>
          <p className={statValue}>{dataNilai.length}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className={panel}>
          <div className={panelHeader}>
            <h2 className={sectionTitle}>{t("chart.distribution")}</h2>
          </div>
          <DistributionChart values={nilaiAkhir} />
        </section>
        <section className={panel}>
          <div className={panelHeader}>
            <h2 className={sectionTitle}>{t("chart.gradesPerMapel")}</h2>
          </div>
          <HBarList
            items={[...dataNilai]
              .map((n) => ({
                label: tv(n.mata_pelajaran),
                value: n.nilai_akhir,
              }))
              .sort((a, b) => b.value - a.value)}
          />
        </section>
        <section className={panel}>
          <div className={panelHeader}>
            <h2 className={sectionTitle}>{t("chart.passStatus")}</h2>
          </div>
          <DonutChart
            segments={[
              { label: t("donut.lulus"), value: lulus, color: "#1ed760" },
              {
                label: t("donut.tidakLulus"),
                value: tidakLulus,
                color: "#f3727f",
              },
              {
                label: t("donut.belumDinilai"),
                value: belumDinilai,
                color: "#ffa42b",
              },
            ]}
            totalLabel={t("chart.mapel")}
          />
        </section>
      </div>

      <section className={panel + " mt-4"}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={tableHeadRow}>
                <SortTh label={t("th.mapel")} id="mata_pelajaran" sort={sort} onSort={setSort} />
                <SortTh label={t("th.tugas")} id="nilai_tugas" sort={sort} onSort={setSort} center />
                <SortTh label={t("th.uts")} id="nilai_uts" sort={sort} onSort={setSort} center />
                <SortTh label={t("th.uas")} id="nilai_uas" sort={sort} onSort={setSort} center />
                <SortTh label={t("th.akhir")} id="nilai_akhir" sort={sort} onSort={setSort} center />
                <SortTh label={t("th.status")} id="status_nilai" sort={sort} onSort={setSort} center />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className={emptyCell}>
                    <Loader2 size={18} className="mr-2 inline animate-spin align-middle text-[#b3b3b3]" />
                    {t("loading.grades")}
                  </td>
                </tr>
              ) : dataNilai.length > 0 ? (
                sortRows(dataNilai, sort).map((n) => (
                  <tr key={n.id} className={tr}>
                    <td className={td + " font-medium text-white"}>
                      {tv(n.mata_pelajaran)}
                    </td>
                    <td className={tdCenter}>{n.nilai_tugas}</td>
                    <td className={tdCenter}>{n.nilai_uts}</td>
                    <td className={tdCenter}>{n.nilai_uas}</td>
                    <td className={tdCenter + " font-bold text-white"}>
                      {n.nilai_akhir}
                    </td>
                    <td className={tdCenter}>
                      <span className={badgeStatusNilai(n.status_nilai)}>
                        {tv(n.status_nilai)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={emptyCell}>
                    {t("empty.noNilaiPlain")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}

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
  groupAvg,
} from "@/components/charts";
import { SortTh, sortRows, type SortState } from "@/components/SortableTh";
import { useI18n } from "@/components/I18n";
import {
  badgeKelulusan,
  badgeStatusNilai,
  emptyCell,
  panel,
  panelHeader,
  searchInput,
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

export default function GuruLaporanPage() {
  const router = useRouter();
  const { t, tv } = useI18n();
  const [semuaNilai, setSemuaNilai] = useState<Nilai[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortState | null>(null);

  const fetchNilai = async () => {
    try {
      const res = await fetch("/api/guru/nilai");
      const data = await res.json();
      setSemuaNilai(data);
    } catch (error) {
      console.error("Gagal memuat data nilai:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNilai();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  };

  const query = q.trim().toLowerCase();
  const filtered = query
    ? semuaNilai.filter(
        (n) =>
          n.nis.toLowerCase().includes(query) ||
          n.nama.toLowerCase().includes(query) ||
          n.kelas.toLowerCase().includes(query) ||
          n.mata_pelajaran.toLowerCase().includes(query) ||
          tv(n.mata_pelajaran).toLowerCase().includes(query)
      )
    : semuaNilai;

  const sorted = sortRows(filtered, sort);

  const lulus = semuaNilai.filter((n) => n.status_kelulusan === "Lulus").length;
  const belumDinilai = semuaNilai.filter(
    (n) => n.status_nilai !== "Sudah Dinilai"
  ).length;

  return (
    <AppShell
      role="guru"
      active="/guru/laporan-nilai"
      onNavigate={(href) => router.push(href)}
      onLogout={handleLogout}
    >
      <PageHeader
        title={t("lap.guru.title")}
        description={t("lap.guru.desc")}
      />

      <div className={statStripFour}>
        <div className={statItem}>
          <p className={statLabel}>{t("stat.jumlahData")}</p>
          <p className={statValue}>{semuaNilai.length}</p>
        </div>
        <div className={statItem}>
          <p className={statLabel}>{t("stat.avg")}</p>
          <p className={statValue}>
            {semuaNilai.length > 0
              ? avg(semuaNilai.map((n) => n.nilai_akhir)).toFixed(1)
              : "—"}
          </p>
        </div>
        <div className={statItem}>
          <p className={statLabel}>{t("stat.lulus")}</p>
          <p className={statValue}>{lulus}</p>
        </div>
        <div className={statItem}>
          <p className={statLabel}>{t("stat.belumDinilai")}</p>
          <p className={statValue}>{belumDinilai}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className={panel}>
          <div className={panelHeader}>
            <h2 className={sectionTitle}>{t("chart.distribution")}</h2>
          </div>
          <DistributionChart values={semuaNilai.map((n) => n.nilai_akhir)} />
        </section>
        <section className={panel}>
          <div className={panelHeader}>
            <h2 className={sectionTitle}>{t("chart.kelulusan")}</h2>
          </div>
          <DonutChart
            segments={[
              { label: t("donut.lulus"), value: lulus, color: "#1ed760" },
              {
                label: t("donut.tidakLulus"),
                value: semuaNilai.length - lulus - belumDinilai,
                color: "#f3727f",
              },
              {
                label: t("donut.belumDinilai"),
                value: belumDinilai,
                color: "#ffa42b",
              },
            ]}
            totalLabel={t("chart.entries")}
          />
        </section>
        <section className={panel}>
          <div className={panelHeader}>
            <h2 className={sectionTitle}>{t("chart.avgPerMapel")}</h2>
          </div>
          <HBarList
            items={groupAvg(
              semuaNilai,
              (n) => tv(n.mata_pelajaran),
              (n) => n.nilai_akhir
            )}
            format={(v) => v.toFixed(1)}
          />
        </section>
      </div>

      <section className={panel + " mt-4"}>
        <div className={panelHeader}>
          <h2 className={sectionTitle}>{t("lap.table")}</h2>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search.ph")}
            className={searchInput}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={tableHeadRow}>
                <SortTh label={t("common.nis")} id="nis" sort={sort} onSort={setSort} />
                <SortTh label={t("th.nama")} id="nama" sort={sort} onSort={setSort} />
                <SortTh label={t("th.mapel")} id="mata_pelajaran" sort={sort} onSort={setSort} />
                <SortTh label={t("th.tugas")} id="nilai_tugas" sort={sort} onSort={setSort} center />
                <SortTh label={t("th.uts")} id="nilai_uts" sort={sort} onSort={setSort} center />
                <SortTh label={t("th.uas")} id="nilai_uas" sort={sort} onSort={setSort} center />
                <SortTh label={t("th.akhir")} id="nilai_akhir" sort={sort} onSort={setSort} center />
                <SortTh label={t("th.statusNilai")} id="status_nilai" sort={sort} onSort={setSort} center />
                <SortTh label={t("th.kelulusan")} id="status_kelulusan" sort={sort} onSort={setSort} center />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className={emptyCell}>
                    <Loader2 size={18} className="mr-2 inline animate-spin align-middle text-[#b3b3b3]" />
                    {t("loading.grades")}
                  </td>
                </tr>
              ) : sorted.length > 0 ? (
                sorted.map((n) => (
                  <tr key={n.id} className={tr}>
                    <td className={td + " font-mono"}>{n.nis}</td>
                    <td className={td + " font-medium text-white"}>{n.nama}</td>
                    <td className={td + " text-[#b3b3b3]"}>{tv(n.mata_pelajaran)}</td>
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
                    <td className={tdCenter}>
                      <span className={badgeKelulusan(n.status_kelulusan)}>
                        {n.status_kelulusan ? tv(n.status_kelulusan) : "-"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className={emptyCell}>
                    {query
                      ? t("search.none", { q })
                      : t("empty.noGrades")}
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

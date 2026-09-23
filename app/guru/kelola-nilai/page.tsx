'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertTriangle, Info, Loader2 } from "lucide-react";
import AppShell, { PageHeader } from "@/components/AppShell";
import { SortTh, sortRows, type SortState } from "@/components/SortableTh";
import { useI18n } from "@/components/I18n";
import {
  badgeKelulusan,
  btnCta,
  btnDarkPill,
  btnDangerPill,
  btnSmDanger,
  btnSmNeutral,
  btnSmPrimary,
  emptyCell,
  input,
  label,
  modalBody,
  modalFooter,
  modalOverlay,
  modalPanel,
  modalTitle,
  panel,
  select,
  tableHeadRow,
  tdCenter,
  thCenter,
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

export default function GuruNilaiPage() {
  const router = useRouter();
  const { t, tv } = useI18n();

  const [semuaNilai, setSemuaNilai] = useState<Nilai[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState<SortState | null>(null);
  const [showModalTambahNilai, setShowModalTambahNilai] = useState(false);
  const [showModalEditNilai, setShowModalEditNilai] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNeedInputModal, setShowNeedInputModal] = useState(false);
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

  const belumPernahInput = (nilai: Nilai) =>
    !nilai.status_nilai || nilai.status_nilai === "Belum Dinilai";

  const openEditNilai = (nilai: Nilai) => {
    if (belumPernahInput(nilai)) {
      openNeedInput(nilai);
      return;
    }

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

  const openNeedInput = (nilai: Nilai) => {
    setSelectedSiswa(nilai);
    setSelectedId(nilai.id);
    setShowNeedInputModal(true);
  };

  const openDeleteNilai = (nilai: Nilai) => {
    if (belumPernahInput(nilai)) {
      openNeedInput(nilai);
      return;
    }
    setSelectedId(nilai.id);
    setShowDeleteModal(true);
  };

  const closeNeedInputModal = () => {
    setShowNeedInputModal(false);
    setSelectedSiswa(null);
    setSelectedId(null);
  };

  const gotoInputFromNeedInput = () => {
    const nilai = selectedSiswa;
    setShowNeedInputModal(false);
    if (nilai) openTambahNilai(nilai);
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
        alert(t("nmg.errAdd"));
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNilai();
  }, []);

  return (
    <AppShell
      role="guru"
      active="/guru/kelola-nilai"
      onNavigate={(href) => router.push(href)}
      onLogout={handleLogout}
    >
      <PageHeader
        title={t("nmg.title")}
        description={t("nmg.desc")}
      />

      <section className={panel}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={tableHeadRow}>
                <SortTh label={t("common.nis")} id="nis" sort={sort} onSort={setSort} center />
                <SortTh label={t("th.namaSiswa")} id="nama" sort={sort} onSort={setSort} center />
                <SortTh label={t("common.class")} id="kelas" sort={sort} onSort={setSort} center />
                <SortTh label={t("th.mapel")} id="mata_pelajaran" sort={sort} onSort={setSort} center />
                <SortTh label={t("th.nilaiTugas")} id="nilai_tugas" sort={sort} onSort={setSort} center />
                <SortTh label={t("th.nilaiUts")} id="nilai_uts" sort={sort} onSort={setSort} center />
                <SortTh label={t("th.nilaiUas")} id="nilai_uas" sort={sort} onSort={setSort} center />
                <SortTh label={t("th.nilaiAkhir")} id="nilai_akhir" sort={sort} onSort={setSort} center />
                <SortTh label={t("th.statusKelulusan")} id="status_kelulusan" sort={sort} onSort={setSort} center />
                <th className={thCenter}>{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} className={emptyCell}>
                    <Loader2 size={18} className="mr-2 inline animate-spin align-middle text-[#b3b3b3]" />
                    {t("loading.grades")}
                  </td>
                </tr>
              ) : semuaNilai.length > 0 ? (
                sortRows(semuaNilai, sort).map((nilai) => {
                  const belumInput = belumPernahInput(nilai);
                  return (
                  <tr key={nilai.id} className={tr}>
                    <td className={tdCenter + " font-mono"}>{nilai.nis}</td>
                    <td className={tdCenter + " font-medium text-white"}>{nilai.nama}</td>
                    <td className={tdCenter + " text-[#b3b3b3]"}>{nilai.kelas}</td>
                    <td className={tdCenter + " text-[#b3b3b3]"}>{tv(nilai.mata_pelajaran)}</td>
                    <td className={tdCenter}>{nilai.nilai_tugas}</td>
                    <td className={tdCenter}>{nilai.nilai_uts}</td>
                    <td className={tdCenter}>{nilai.nilai_uas}</td>
                    <td className={tdCenter + " font-bold text-white"}>{nilai.nilai_akhir}</td>
                    <td className={tdCenter}>
                      <span className={badgeKelulusan(nilai.status_kelulusan)}>
                        {nilai.status_kelulusan ? tv(nilai.status_kelulusan) : "-"}
                      </span>
                    </td>
                    <td className={tdCenter + " whitespace-nowrap"}>
                      <button
                        type="button"
                        onClick={() => openTambahNilai(nilai)}
                        className={btnSmPrimary + " mr-2"}
                      >
                        {t("nmg.input")}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditNilai(nilai)}
                        title={belumInput ? t("nmg.needInputBody") : undefined}
                        className={
                          btnSmNeutral +
                          " mr-2" +
                          (belumInput
                            ? " cursor-not-allowed opacity-50"
                            : "")
                        }
                      >
                        {t("nmg.edit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteNilai(nilai)}
                        title={belumInput ? t("nmg.needInputBody") : undefined}
                        className={
                          btnSmDanger +
                          (belumInput
                            ? " cursor-not-allowed opacity-50"
                            : "")
                        }
                      >
                        {t("nmg.del")}
                      </button>
                    </td>
                  </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className={emptyCell}>
                    {t("empty.noGrades")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModalTambahNilai && selectedSiswa && (
        <div className={modalOverlay}>
          <div className={modalPanel}>
            <div className={modalBody}>
              <h2 className={modalTitle}>{t("nmg.modalAdd")}</h2>
              <p className="mb-4 mt-1 text-sm text-[#b3b3b3]">
                {t("nmg.student")} <span className="font-semibold text-white">{selectedSiswa.nama}</span> — {selectedSiswa.kelas}
              </p>
              <form onSubmit={handleTambahNilai} className="space-y-4">
                <div>
                  <label className={label}>{t("common.nis")}</label>
                  <input
                    type="text"
                    value={selectedSiswa.nis}
                    disabled
                    className={input + " font-mono"}
                  />
                </div>
                <div>
                  <label className={label}>{t("th.mapel")}</label>
                  <input
                    type="text"
                    value={tv(inputTambahNilai.mata_pelajaran)}
                    disabled
                    className={input}
                  />
                </div>
                {["nilai_tugas", "nilai_uts", "nilai_uas"].map((field) => (
                  <div key={field}>
                    <label className={label}>
                      {field === "nilai_tugas" ? t("th.nilaiTugas") : field === "nilai_uts" ? t("th.nilaiUts") : t("th.nilaiUas")}
                    </label>
                    <input type="number"
                      min={0}
                      max={100}
                      value={inputTambahNilai[field as keyof typeof inputTambahNilai]}
                      onChange={(e) => setInputTambahNilai({ ...inputTambahNilai, [field]: e.target.value })}
                      className={input} />
                  </div>
                ))}
                <div>
                  <label className={label}>{t("th.statusNilai")}</label>
                  <select
                    value={inputTambahNilai.status_nilai}
                    onChange={(e) => setInputTambahNilai({ ...inputTambahNilai, status_nilai: e.target.value })}
                    className={select}
                  >
                    <option value="Belum Dinilai">{tv("Belum Dinilai")}</option>
                    <option value="Sudah Dinilai">{tv("Sudah Dinilai")}</option>
                  </select>
                </div>
                <div className={modalFooter}>
                  <button type="button" onClick={closeModalTambah} className={btnDarkPill}>
                    {t("common.cancel")}
                  </button>
                  <button type="submit" className={btnCta}>
                    {t("nmg.save")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showModalEditNilai && selectedSiswa && (
        <div className={modalOverlay}>
          <div className={modalPanel}>
            <div className={modalBody}>
              <h2 className={modalTitle}>{t("nmg.modalEdit")}</h2>
              <p className="mb-4 mt-1 text-sm text-[#b3b3b3]">
                {t("nmg.student")} <span className="font-semibold text-white">{selectedSiswa.nama}</span> — {selectedSiswa.kelas}
              </p>
              <form onSubmit={handleEditNilai} className="space-y-4">
                <div>
                  <label className={label}>{t("th.mapel")}</label>
                  <div className={input + " cursor-default text-[#b3b3b3]"}>
                    {tv(selectedSiswa.mata_pelajaran)}
                  </div>
                </div>
                {["nilai_tugas", "nilai_uts", "nilai_uas"].map((field) => (
                  <div key={field}>
                    <label className={label}>
                      {field === "nilai_tugas" ? t("th.nilaiTugas") : field === "nilai_uts" ? t("th.nilaiUts") : t("th.nilaiUas")}
                    </label>
                    <input type="number"
                      min={0}
                      max={100}
                      value={inputEditNilai[field as keyof typeof inputEditNilai]}
                      onChange={(e) => setInputEditNilai({ ...inputEditNilai, [field]: e.target.value })}
                      className={input} />
                  </div>
                ))}
                <div>
                  <label className={label}>{t("th.statusNilai")}</label>
                  <select
                    value={inputEditNilai.status_nilai}
                    onChange={(e) => setInputEditNilai({ ...inputEditNilai, status_nilai: e.target.value })}
                    className={select}
                  >
                    <option value="Belum Dinilai">{tv("Belum Dinilai")}</option>
                    <option value="Sudah Dinilai">{tv("Sudah Dinilai")}</option>
                  </select>
                </div>
                <div className={modalFooter}>
                  <button type="button" onClick={closeModalEdit} className={btnDarkPill}>
                    {t("common.cancel")}
                  </button>
                  <button type="submit" className={btnCta}>
                    {t("common.save")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showNeedInputModal && selectedSiswa && (
        <div className={modalOverlay}>
          <div className={modalPanel + " max-w-sm"}>
            <div className={modalBody}>
              <div className="flex flex-col items-center text-center">
                <Info size={28} className="mb-3 text-[#ffa42b]" />
                <h3 className="text-base font-bold text-white">
                  {t("nmg.needInputTitle")}
                </h3>
                <p className="mt-2 text-sm text-[#b3b3b3]">
                  {t("nmg.needInputBody")}
                </p>
              </div>
              <div className={modalFooter}>
                <button
                  type="button"
                  onClick={closeNeedInputModal}
                  className={btnDarkPill}
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="button"
                  onClick={gotoInputFromNeedInput}
                  className={btnCta}
                >
                  {t("nmg.needInputCta")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={modalOverlay}>
          <div className={modalPanel + " max-w-sm"}>
            <div className={modalBody}>
              <div className="flex flex-col items-center text-center">
                <AlertTriangle size={28} className="mb-3 text-[#f3727f]" />
                <h3 className="text-base font-bold text-white">{t("common.confirmDelete")}</h3>
                <p className="mt-2 text-sm text-[#b3b3b3]">
                  {t("nmg.delMsg", { id: "\u0000" }).split("\u0000")[0]}
                  <span className="rounded bg-[#1f1f1f] px-1.5 py-0.5 font-mono text-white">
                    {selectedId}
                  </span>
                  {t("nmg.delMsg", { id: "\u0000" }).split("\u0000")[1]}
                </p>
              </div>
              <div className={modalFooter}>
                <button
                  type="button"
                  onClick={() => { setShowDeleteModal(false); setSelectedId(null); }}
                  className={btnDarkPill}
                >
                  {t("common.cancel")}
                </button>
                <button type="button" onClick={handleDeleteNilai} className={btnDangerPill}>
                  {t("common.yesDelete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

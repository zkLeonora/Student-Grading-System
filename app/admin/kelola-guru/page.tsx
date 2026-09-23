'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import AppShell, { PageHeader } from "@/components/AppShell";
import { SortTh, sortRows, type SortState } from "@/components/SortableTh";
import { useI18n } from "@/components/I18n";
import {
  btnCta,
  btnDarkPill,
  btnDangerPill,
  btnSmDanger,
  btnSmNeutral,
  emptyCell,
  input,
  label,
  modalBody,
  modalFooter,
  modalOverlay,
  modalPanel,
  modalTitle,
  panel,
  panelHeader,
  searchInput,
  sectionTitle,
  tableHeadRow,
  td,
  thCenter,
  tr,
} from "@/components/ui";

interface Guru {
  id: string;
  nama_guru: string;
  mata_pelajaran: string;
}

export default function AdminGuruPage() {
  const router = useRouter();
  const { t, tv } = useI18n();

  const [semuaGuru, setSemuaGuru] = useState<Guru[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortState | null>(null);
  const [showModalGuru, setShowModalGuru] = useState(false);
  const [selectedGuru, setSelectedGuru] = useState<Guru | null>(null);
  const [inputEditGuru, setInputEditGuru] = useState({ nama_guru: "", mata_pelajaran: "" });
  const [showTambahGuru, setShowTambahGuru] = useState(false);
  const [inputTambahGuru, setInputTambahGuru] = useState({ id: "", nama_guru: "", mata_pelajaran: "", username: "", password:"", });
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
    setInputTambahGuru({ id: "", nama_guru: "", mata_pelajaran: "", username: "", password: "", });
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
        alert(t("guru.errAdd"));
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
        alert(t("guru.errEdit"));
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
      } finally {
        setIsLoading(false);
      }
    };
    fetch_();
  }, []);

  const query = q.trim().toLowerCase();
  const filtered = query
    ? semuaGuru.filter(
        (g) =>
          g.id.toLowerCase().includes(query) ||
          g.nama_guru.toLowerCase().includes(query) ||
          g.mata_pelajaran.toLowerCase().includes(query) ||
          tv(g.mata_pelajaran).toLowerCase().includes(query)
      )
    : semuaGuru;

  const sorted = sortRows(filtered, sort);

  return (
    <AppShell
      role="admin"
      active="/admin/kelola-guru"
      onNavigate={(href) => router.push(href)}
      onLogout={handleLogout}
    >
      <PageHeader
        title={t("guru.title")}
        description={t("guru.desc")}
        stackAction
        action={
          <button
            onClick={() => setShowTambahGuru(true)}
            type="button"
            className={btnCta}
          >
            {t("guru.add")}
          </button>
        }
      />

      <section className={panel}>
        <div className={panelHeader}>
          <h2 className={sectionTitle}>{t("guru.list")}</h2>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search.phGuru")}
            className={searchInput}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={tableHeadRow}>
                <SortTh label={t("common.id")} id="id" sort={sort} onSort={setSort} />
                <SortTh label={t("th.namaGuru")} id="nama_guru" sort={sort} onSort={setSort} />
                <SortTh label={t("th.mapel")} id="mata_pelajaran" sort={sort} onSort={setSort} />
                <th className={thCenter}>{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className={emptyCell}>
                    <Loader2 size={18} className="mr-2 inline animate-spin align-middle text-[#b3b3b3]" />
                    {t("loading.guru")}
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                sorted.map((guru) => (
                  <tr key={guru.id} className={tr}>
                    <td className={td + " font-mono"}>{guru.id}</td>
                    <td className={td + " font-medium text-white"}>{guru.nama_guru}</td>
                    <td className={td}>{tv(guru.mata_pelajaran)}</td>
                    <td className={td + " whitespace-nowrap text-center"}>
                      <button
                        type="button"
                        onClick={() => openEditGuru(guru)}
                        className={btnSmNeutral + " mr-2"}
                      >
                        {t("common.edit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSelectedGuruId(guru.id); setShowDeleteGuruModal(true); }}
                        className={btnSmDanger}
                      >
                        {t("common.delete")}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className={emptyCell}>
                    {query
                      ? t("search.none", { q })
                      : t("empty.noGuru")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showTambahGuru && (
        <div className={modalOverlay}>
          <div className={modalPanel}>
            <div className={modalBody}>
              <h2 className={modalTitle + " mb-4"}>{t("guru.modalAdd")}</h2>
              <form onSubmit={handleTambahGuru} className="space-y-4">
                <div>
                  <label className={label}>{t("guru.idLabel")}</label>
                  <input
                    type="text"
                    value={inputTambahGuru.id}
                    required
                    placeholder={t("guru.phId")}
                    onChange={(e) => setInputTambahGuru({ ...inputTambahGuru, id: e.target.value })}
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>{t("th.namaGuru")}</label>
                  <input
                    type="text"
                    value={inputTambahGuru.nama_guru}
                    required
                    placeholder={t("guru.phName")}
                    onChange={(e) => setInputTambahGuru({ ...inputTambahGuru, nama_guru: e.target.value })}
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>{t("th.mapel")}</label>
                  <input
                    type="text"
                    value={inputTambahGuru.mata_pelajaran}
                    required
                    placeholder={t("guru.phMapel")}
                    onChange={(e) => setInputTambahGuru({ ...inputTambahGuru, mata_pelajaran: e.target.value })}
                    className={input}
                  />
                </div>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#7c7c7c]">
                    {t("guru.accountSection")}
                  </p>
                </div>
                <div>
                  <label className={label}>{t("guru.usernameLogin")}</label>
                  <input
                    type="text"
                    value={inputTambahGuru.username}
                    required
                    placeholder={t("guru.phUsername")}
                    onChange={(e) =>
                      setInputTambahGuru({
                        ...inputTambahGuru,
                        username: e.target.value,
                      })
                    }
                    className={input}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label className={label}>{t("guru.initialPassword")}</label>
                  <input
                    type="password"
                    value={inputTambahGuru.password}
                    required
                    placeholder={t("guru.phPassword")}
                    onChange={(e) =>
                      setInputTambahGuru({
                        ...inputTambahGuru,
                        password: e.target.value,
                      })
                    }
                    className={input}
                    autoComplete="new-password"
                  />
                </div>
                <div className={modalFooter}>
                  <button type="button" onClick={closeTambahGuru} className={btnDarkPill}>
                    {t("common.cancel")}
                  </button>
                  <button type="submit" className={btnCta}>
                    {t("common.addData")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showModalGuru && selectedGuru && (
        <div className={modalOverlay}>
          <div className={modalPanel}>
            <div className={modalBody}>
              <h2 className={modalTitle + " mb-4"}>{t("guru.modalEdit")}</h2>
              <form onSubmit={handleEditGuru} className="space-y-4">
                <div>
                  <label className={label}>{t("guru.idLabel")}</label>
                  <input
                    type="text"
                    value={selectedGuru.id}
                    disabled
                    className={input + " font-mono"}
                  />
                </div>
                <div>
                  <label className={label}>{t("th.namaGuru")}</label>
                  <input
                    type="text"
                    value={inputEditGuru.nama_guru}
                    required
                    onChange={(e) => setInputEditGuru({ ...inputEditGuru, nama_guru: e.target.value })}
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>{t("th.mapel")}</label>
                  <input
                    type="text"
                    value={inputEditGuru.mata_pelajaran}
                    required
                    onChange={(e) => setInputEditGuru({ ...inputEditGuru, mata_pelajaran: e.target.value })}
                    className={input}
                  />
                </div>
                <div className={modalFooter}>
                  <button type="button" onClick={closeModalGuru} className={btnDarkPill}>
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

      {showDeleteGuruModal && (
        <div className={modalOverlay}>
          <div className={modalPanel + " max-w-sm"}>
            <div className={modalBody}>
              <div className="flex flex-col items-center text-center">
                <AlertTriangle size={28} className="mb-3 text-[#f3727f]" />
                <h3 className="text-base font-bold text-white">{t("common.confirmDelete")}</h3>
                <p className="mt-2 text-sm text-[#b3b3b3]">
                  {t("guru.delMsg", { id: "\u0000" }).split("\u0000")[0]}
                  <span className="rounded bg-[#1f1f1f] px-1.5 py-0.5 font-mono text-white">
                    {selectedGuruId}
                  </span>
                  {t("guru.delMsg", { id: "\u0000" }).split("\u0000")[1]}
                </p>
              </div>
              <div className={modalFooter}>
                <button
                  type="button"
                  onClick={() => { setShowDeleteGuruModal(false); setSelectedGuruId(""); }}
                  className={btnDarkPill}
                >
                  {t("common.cancel")}
                </button>
                <button type="button" onClick={handleDeleteGuru} className={btnDangerPill}>
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

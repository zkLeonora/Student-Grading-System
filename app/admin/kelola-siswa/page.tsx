'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertTriangle, Loader2, X, Plus,
} from "lucide-react";
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
  select,
  tableHeadRow,
  td,
  thCenter,
  tr,
} from "@/components/ui";

type Siswa = {
  nis: string;
  nama: string;
  kelas: string;
  mapel: {
    nama: string;
    id_guru: string;
    nilai_id: number;
  }[];
};

type Guru = {
  id: string;
  mata_pelajaran: string;
};

// ── Dipindah ke luar komponen ──────────────────────────
function MapelInputList({
  mapel,
  daftarGuru,
  onChange,
}: {
  mapel: string[];
  daftarGuru: Guru[];
  onChange: (updated: string[]) => void;
}) {
  const { t, tv } = useI18n();
  const update = (i: number, val: string) => {
    const next = [...mapel];
    next[i] = val;
    onChange(next);
  };
  const add = () => onChange([...mapel, ""]);
  const remove = (i: number) => onChange(mapel.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      {mapel.map((m, i) => (
        <div key={i} className="flex gap-2 items-center">
          <select
            value={m}
            required={i === 0}
            onChange={(e) => update(i, e.target.value)}
            className={select + " flex-1"}
          >
            <option value="">{t("siswaMgmt.selectSubject")}</option>
            {daftarGuru.map((g) => (
              <option key={g.id} value={g.id}>{tv(g.mata_pelajaran)}</option>
            ))}
          </select>
          {mapel.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={t("siswaMgmt.removeSubject")}
              className="rounded-full bg-[#1f1f1f] p-2 text-[#f3727f] transition-colors hover:bg-[#252525]"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1ed760] hover:underline"
      >
        <Plus size={13} /> {t("siswaMgmt.addSubject")}
      </button>
    </div>
  );
}

// ── Komponen utama ─────────────────────────────────────
export default function AdminSiswaPage() {
  const router = useRouter();
  const { t, tv } = useI18n();

  const [daftarGuru, setDaftarGuru] = useState<Guru[]>([]);
  const [semuaSiswa, setSemuaSiswa] = useState<Siswa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortState | null>(null);

  const [showModalSiswa, setShowModalSiswa] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
  const [inputEdit, setInputEdit] = useState({ nama: "", kelas: "", mapel: [""] });

  const [showTambahSiswa, setShowTambahSiswa] = useState(false);
  const [inputTambah, setInputTambah] = useState({
    nis: "", nama: "", kelas: "", mapel: [""], username: "", password: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSiswaHapus, setSelectedSiswaHapus] = useState<Siswa | null>(null);

  // ── fetchData tidak memanggil setState secara langsung di body effect ──
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const [resSiswa, resGuru] = await Promise.all([
          fetch("/api/admin/siswa"),
          fetch("/api/admin/guru"),
        ]);
        const siswaData = await resSiswa.json();
        const guruData = await resGuru.json();
        if (!cancelled) {
          setSemuaSiswa(siswaData);
          setDaftarGuru(guruData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resSiswa, resGuru] = await Promise.all([
        fetch("/api/admin/siswa"),
        fetch("/api/admin/guru"),
      ]);
      setSemuaSiswa(await resSiswa.json());
      setDaftarGuru(await resGuru.json());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  const openEditSiswa = (siswa: Siswa) => {
    setSelectedSiswa(siswa);
    setInputEdit({
      nama: siswa.nama,
      kelas: siswa.kelas,
      mapel: siswa.mapel.length > 0 ? siswa.mapel.map((m) => m.id_guru) : [""],
    });
    setShowModalSiswa(true);
  };

  const closeModalSiswa = () => {
    setSelectedSiswa(null);
    setInputEdit({ nama: "", kelas: "", mapel: [""] });
    setShowModalSiswa(false);
  };

  const handleEditSiswa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswa) return;
    const mapelValid = inputEdit.mapel.filter(Boolean);
    if (mapelValid.length === 0) return alert(t("siswaMgmt.errMinSubject"));
    try {
      const res = await fetch(`/api/admin/siswa/${selectedSiswa.nis}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama: inputEdit.nama, kelas: inputEdit.kelas, mapel: mapelValid }),
      });
      if (res.ok) { await fetchData(); closeModalSiswa(); }
      else alert(t("siswaMgmt.errEdit"));
    } catch (error) { console.error(error); }
  };

  const closeTambahSiswa = () => {
    setInputTambah({ nis: "", nama: "", kelas: "", mapel: [""], username: "", password: "" });
    setShowTambahSiswa(false);
  };

  const handleTambahSiswa = async (e: React.FormEvent) => {
    e.preventDefault();
    const mapelValid = inputTambah.mapel.filter(Boolean);
    if (mapelValid.length === 0) return alert(t("siswaMgmt.errMinSubject"));
    try {
      const res = await fetch("/api/admin/siswa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inputTambah, mapel: mapelValid }),
      });
      if (res.ok) { await fetchData(); closeTambahSiswa(); }
      else alert(t("siswaMgmt.errAdd"));
    } catch (error) { console.error(error); }
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
    } catch (error) { console.error(error); }
  };

  const query = q.trim().toLowerCase();
  const filtered = query
    ? semuaSiswa.filter(
        (s) =>
          s.nis.toLowerCase().includes(query) ||
          s.nama.toLowerCase().includes(query) ||
          s.kelas.toLowerCase().includes(query) ||
          s.mapel.some(
            (m) =>
              m.nama.toLowerCase().includes(query) ||
              tv(m.nama).toLowerCase().includes(query)
          )
      )
    : semuaSiswa;

  const sorted = sortRows(
    filtered.map((s) => ({
      ...s,
      mapel_text: s.mapel.map((m) => `${m.nama} ${tv(m.nama)}`).join(", "),
    })),
    sort
  );

  return (
    <AppShell
      role="admin"
      active="/admin/kelola-siswa"
      onNavigate={(href) => router.push(href)}
      onLogout={handleLogout}
    >
      <PageHeader
        title={t("siswaMgmt.title")}
        description={t("siswaMgmt.desc")}
        stackAction
        action={
          <button
            onClick={() => setShowTambahSiswa(true)}
            type="button"
            className={btnCta}
          >
            {t("siswaMgmt.add")}
          </button>
        }
      />

      <section className={panel}>
        <div className={panelHeader}>
          <h2 className={sectionTitle}>{t("siswaMgmt.list")}</h2>
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
                <SortTh label={t("th.namaSiswa")} id="nama" sort={sort} onSort={setSort} />
                <SortTh label={t("common.class")} id="kelas" sort={sort} onSort={setSort} />
                <SortTh label={t("th.mapel")} id="mapel_text" sort={sort} onSort={setSort} />
                <th className={thCenter}>{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className={emptyCell}>
                    <Loader2 size={18} className="mr-2 inline animate-spin align-middle text-[#b3b3b3]" />
                    {t("loading.siswa")}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className={emptyCell}>
                    {query
                      ? t("search.none", { q })
                      : t("empty.noSiswa")}
                  </td>
                </tr>
              ) : (
                sorted.map((siswa) => (
                  <tr key={siswa.nis} className={tr}>
                    <td className={td + " font-mono"}>{siswa.nis}</td>
                    <td className={td + " font-medium text-white"}>{siswa.nama}</td>
                    <td className={td}>{siswa.kelas}</td>
                    <td className={td}>
                      {siswa.mapel.length === 0 ? (
                        <span className="text-[#7c7c7c]">-</span>
                      ) : (
                        <span className="flex flex-col gap-0.5 text-[#b3b3b3]">
                          {siswa.mapel.map((m, i) => (
                            <span key={i}>{tv(m.nama)}</span>
                          ))}
                        </span>
                      )}
                    </td>
                    <td className={td + " whitespace-nowrap text-center"}>
                      <button
                        type="button"
                        onClick={() => openEditSiswa(siswa)}
                        className={btnSmNeutral + " mr-2"}
                      >
                        {t("common.edit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSelectedSiswaHapus(siswa); setShowDeleteModal(true); }}
                        className={btnSmDanger}
                      >
                        {t("common.delete")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Modal Edit ── */}
      {showModalSiswa && selectedSiswa && (
        <div className={modalOverlay}>
          <div className={modalPanel}>
            <div className={modalBody}>
              <h2 className={modalTitle + " mb-4"}>{t("siswaMgmt.modalEdit")}</h2>
              <form onSubmit={handleEditSiswa} className="space-y-4">
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
                  <label className={label}>{t("th.namaSiswa")}</label>
                  <input
                    type="text"
                    value={inputEdit.nama}
                    required
                    onChange={(e) => setInputEdit({ ...inputEdit, nama: e.target.value })}
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>{t("common.class")}</label>
                  <input
                    type="text"
                    value={inputEdit.kelas}
                    required
                    onChange={(e) => setInputEdit({ ...inputEdit, kelas: e.target.value })}
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>{t("th.mapel")}</label>
                  <MapelInputList
                    mapel={inputEdit.mapel}
                    daftarGuru={daftarGuru}
                    onChange={(updated) => setInputEdit({ ...inputEdit, mapel: updated })}
                  />
                </div>
                <div className={modalFooter}>
                  <button type="button" onClick={closeModalSiswa} className={btnDarkPill}>
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

      {/* ── Modal Tambah ── */}
      {showTambahSiswa && (
        <div className={modalOverlay}>
          <div className={modalPanel}>
            <div className={modalBody}>
              <h2 className={modalTitle + " mb-4"}>{t("siswaMgmt.modalAdd")}</h2>
              <form onSubmit={handleTambahSiswa} className="space-y-4">
                <div>
                  <label className={label}>{t("common.nis")}</label>
                  <input
                    type="text"
                    value={inputTambah.nis}
                    required
                    placeholder={t("siswaMgmt.phNis")}
                    onChange={(e) => setInputTambah({ ...inputTambah, nis: e.target.value })}
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>{t("th.namaSiswa")}</label>
                  <input
                    type="text"
                    value={inputTambah.nama}
                    required
                    placeholder={t("siswaMgmt.phName")}
                    onChange={(e) => setInputTambah({ ...inputTambah, nama: e.target.value })}
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>{t("common.class")}</label>
                  <input
                    type="text"
                    value={inputTambah.kelas}
                    required
                    placeholder={t("siswaMgmt.phClass")}
                    onChange={(e) => setInputTambah({ ...inputTambah, kelas: e.target.value })}
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>{t("th.mapel")}</label>
                  <MapelInputList
                    mapel={inputTambah.mapel}
                    daftarGuru={daftarGuru}
                    onChange={(updated) => setInputTambah({ ...inputTambah, mapel: updated })}
                  />
                </div>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#7c7c7c]">
                    {t("siswaMgmt.accountSection")}
                  </p>
                </div>
                <div>
                  <label className={label}>{t("guru.usernameLogin")}</label>
                  <input
                    type="text"
                    value={inputTambah.username}
                    required
                    placeholder={t("siswaMgmt.phUsername")}
                    onChange={(e) => setInputTambah({ ...inputTambah, username: e.target.value })}
                    className={input}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label className={label}>{t("guru.initialPassword")}</label>
                  <input
                    type="password"
                    value={inputTambah.password}
                    required
                    placeholder={t("siswaMgmt.phPassword")}
                    onChange={(e) => setInputTambah({ ...inputTambah, password: e.target.value })}
                    className={input}
                    autoComplete="new-password"
                  />
                </div>
                <div className={modalFooter}>
                  <button type="button" onClick={closeTambahSiswa} className={btnDarkPill}>
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

      {/* ── Modal Hapus ── */}
      {showDeleteModal && selectedSiswaHapus && (
        <div className={modalOverlay}>
          <div className={modalPanel + " max-w-sm"}>
            <div className={modalBody}>
              <div className="flex flex-col items-center text-center">
                <AlertTriangle size={28} className="mb-3 text-[#f3727f]" />
                <h3 className="text-base font-bold text-white">{t("common.confirmDelete")}</h3>
                <p className="mt-2 text-sm text-[#b3b3b3]">
                  {t("siswaMgmt.delA")}{" "}
                  <span className="font-semibold text-white">
                    {selectedSiswaHapus.nama}
                  </span>{" "}
                  {t("siswaMgmt.delB")}{" "}
                  <span className="rounded bg-[#1f1f1f] px-1.5 py-0.5 font-mono text-white">
                    {selectedSiswaHapus.nis}
                  </span>
                  ?
                  <br />
                  <span className="mt-1 block text-xs text-[#f3727f]">
                    {t("common.irreversible")}
                  </span>
                </p>
              </div>
              <div className={modalFooter}>
                <button
                  type="button"
                  onClick={() => { setShowDeleteModal(false); setSelectedSiswaHapus(null); }}
                  className={btnDarkPill}
                >
                  {t("common.cancel")}
                </button>
                <button type="button" onClick={handleDeleteSiswa} className={btnDangerPill}>
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

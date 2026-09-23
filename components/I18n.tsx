"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "id" | "en";

/* ── Kamus UI ─────────────────────────────────────────── */

const ID: Record<string, string> = {
  // shell
  "shell.brand": "Aplikasi Pengolahan Nilai Siswa",
  "shell.menu": "Menu",
  "shell.logout": "Logout",
  "shell.nav.dashboard": "Dashboard",
  "shell.nav.kelolaSiswa": "Kelola Data Siswa",
  "shell.nav.kelolaGuru": "Kelola Data Guru",
  "shell.nav.laporanNilai": "Laporan Nilai",
  "shell.nav.kelolaNilai": "Kelola Nilai Siswa",
  "shell.openNav": "Buka menu navigasi",
  "shell.switchLang": "Ganti bahasa",
  "role.admin": "Admin",
  "role.guru": "Guru",
  "role.siswa": "Siswa",

  // login
  "login.subtitle": "Silakan masuk untuk mengakses data nilai",
  "login.username": "Username",
  "login.password": "Password",
  "login.usernamePh": "Masukkan username Anda",
  "login.passwordPh": "Masukkan password Anda",
  "login.submit": "Masuk ke Sistem",
  "login.processing": "Memproses...",
  "login.fail": "Login gagal. Periksa username dan password Anda.",
  "login.network": "Tidak dapat terhubung ke server. Coba lagi nanti.",
  "login.footer": "Hubungi Admin jika terkendala akses.",
  "login.logoAlt": "Logo Sistem Nilai Siswa",

  // tanggal
  "date.prefix": "Tanggal:",
  "time.today": "Hari ini",
  "time.yesterday": "Kemarin",
  "time.unknown": "Waktu tidak diketahui",

  // sort
  "sort.by": "Urutkan berdasarkan {label}",

  // pencarian / umum
  "search.none": "Tidak ada hasil untuk \u201C{q}\u201D.",
  "common.cancel": "Batal",
  "common.save": "Simpan Perubahan",
  "common.edit": "Edit",
  "common.delete": "Hapus",
  "common.yesDelete": "Ya, Hapus",
  "common.confirmDelete": "Konfirmasi Hapus",
  "common.irreversible": "Tindakan ini tidak dapat dibatalkan.",
  "common.actions": "Aksi",
  "common.name": "Nama",
  "common.class": "Kelas",
  "common.subject": "Mata Pelajaran",
  "common.nis": "NIS",
  "common.id": "ID",
  "common.addData": "Tambah Data",

  // loading / empty
  "loading.data": "Memuat data...",
  "loading.grades": "Memuat data nilai...",
  "loading.guru": "Memuat data guru...",
  "loading.siswa": "Memuat data siswa...",
  "empty.noData": "Belum ada data.",
  "empty.noGrades": "Belum ada data nilai.",
  "empty.noNilai": "Belum ada nilai yang dimasukkan",
  "empty.noNilaiPlain": "Belum ada nilai.",
  "empty.noGuru": "Belum ada data guru",
  "empty.noSiswa": "Belum ada data siswa",
  "empty.noActivity": "Belum ada aktivitas terbaru",
  "empty.noGradeData": "Belum ada data nilai.",

  // header tabel
  "th.nama": "Nama",
  "th.mapel": "Mata Pelajaran",
  "th.nilaiAkhir": "Nilai Akhir",
  "th.tugas": "Tugas",
  "th.uts": "UTS",
  "th.uas": "UAS",
  "th.akhir": "Akhir",
  "th.status": "Status",
  "th.statusNilai": "Status Nilai",
  "th.kelulusan": "Kelulusan",
  "th.statusKelulusan": "Status Kelulusan",
  "th.namaGuru": "Nama Guru",
  "th.namaSiswa": "Nama Siswa",
  "th.nilaiTugas": "Nilai Tugas",
  "th.nilaiUts": "Nilai UTS",
  "th.nilaiUas": "Nilai UAS",

  // grafik
  "chart.distribution": "Distribusi Nilai",
  "chart.avgPerKelas": "Rata-rata per Kelas",
  "chart.avgPerMapel": "Rata-rata per Mapel",
  "chart.gradesPerMapel": "Nilai per Mapel",
  "chart.passStatus": "Status Kelulusan",
  "chart.kelulusan": "Kelulusan",
  "chart.progress": "Progres Penilaian",
  "chart.entries": "Entri",
  "chart.mapel": "Mapel",
  "chart.rangeNote": "Rentang nilai akhir \u00B7 total {n} data",

  // statistik
  "stat.totalSiswa": "Total Siswa",
  "stat.totalGuru": "Total Guru",
  "stat.totalNilai": "Total Nilai Masuk",
  "stat.avg": "Rata-rata Nilai",
  "stat.diampu": "Siswa Diampu",
  "stat.perluDinilai": "Perlu Dinilai",
  "stat.sudahDinilai": "Sudah Dinilai",
  "stat.jumlahData": "Jumlah Data",
  "stat.lulus": "Lulus",
  "stat.belumDinilai": "Belum Dinilai",
  "stat.tertinggi": "Tertinggi",
  "stat.terendah": "Terendah",
  "stat.jumlahMapel": "Jumlah Mapel",

  // dashboard admin/guru
  "dash.welcome": "Selamat Datang",
  "dash.activity": "Aktivitas Terbaru",
  "dash.studentGrades": "Tabel Nilai Siswa",
  "dash.teacherData": "Data Guru",
  "dash.studentData": "Data Siswa",
  "dash.assigned": "Siswa Yang Diampu",

  // dashboard siswa
  "siswa.title": "Nilai Akademik Saya",
  "siswa.desc": "Rekap nilai tugas, UTS, UAS, dan nilai akhir Anda.",
  "donut.lulus": "Lulus",
  "donut.tidakLulus": "Tidak Lulus",
  "donut.belumDinilai": "Belum Dinilai",

  // laporan
  "lap.admin.title": "Laporan Nilai Keseluruhan",
  "lap.admin.desc": "Rekapitulasi data nilai seluruh siswa.",
  "lap.guru.title": "Laporan Nilai Siswa",
  "lap.guru.desc": "Rekapitulasi seluruh nilai akhir dan status kelulusan siswa.",
  "lap.table": "Tabel Nilai",

  // pencarian
  "search.ph": "Cari NIS, nama, kelas, mapel...",
  "search.phGuru": "Cari ID, nama, mapel...",

  // kelola guru
  "guru.title": "Kelola Data Guru",
  "guru.desc": "Daftar keseluruhan guru yang terdaftar di dalam sistem",
  "guru.add": "+ Tambah Guru",
  "guru.list": "Daftar Guru",
  "guru.modalAdd": "Tambah Guru",
  "guru.modalEdit": "Edit Data Guru",
  "guru.idLabel": "ID Guru",
  "guru.accountSection": "Akun Login",
  "guru.usernameLogin": "Username Login",
  "guru.initialPassword": "Password Awal",
  "guru.phId": "Masukkan ID unik",
  "guru.phName": "Nama Lengkap dengan Gelar",
  "guru.phMapel": "Contoh: Pemrograman Web",
  "guru.phUsername": "Contoh: Heru",
  "guru.phPassword": "Contoh: G00X/G0XX",
  "guru.errAdd": "Gagal menambahkan guru. Pastikan ID belum terdaftar.",
  "guru.errEdit": "Gagal memperbarui data guru.",
  "guru.delMsg": "Hapus data guru dengan ID {id}? Tindakan ini tidak dapat dibatalkan.",

  // kelola siswa
  "siswaMgmt.title": "Kelola Data Siswa",
  "siswaMgmt.desc": "Daftar keseluruhan siswa yang terdaftar di dalam sistem",
  "siswaMgmt.add": "+ Tambah Siswa",
  "siswaMgmt.list": "Daftar Siswa",
  "siswaMgmt.modalAdd": "Tambah Siswa",
  "siswaMgmt.modalEdit": "Edit Data Siswa",
  "siswaMgmt.addSubject": "Tambah Mata Pelajaran",
  "siswaMgmt.selectSubject": "Pilih Mata Pelajaran",
  "siswaMgmt.removeSubject": "Hapus mata pelajaran",
  "siswaMgmt.phNis": "Masukkan NIS baru",
  "siswaMgmt.phName": "Nama Lengkap",
  "siswaMgmt.phClass": "Contoh: XII-RPL-1",
  "siswaMgmt.accountSection": "Tambah Akun Siswa",
  "siswaMgmt.phUsername": "Contoh: siswa01",
  "siswaMgmt.phPassword": "Contoh: S001",
  "siswaMgmt.delA": "Hapus data siswa",
  "siswaMgmt.delB": "dengan NIS",
  "siswaMgmt.errEdit": "Gagal memperbarui data siswa.",
  "siswaMgmt.errAdd": "Gagal menambahkan siswa. Periksa NIS atau mapel yang dipilih.",
  "siswaMgmt.errMinSubject": "Pilih minimal satu mata pelajaran.",

  // kelola nilai (guru)
  "nmg.title": "Kelola Nilai Siswa",
  "nmg.desc": "Tambah atau edit nilai siswa sesuai mata pelajaran yang diampu",
  "nmg.input": "+ Input Nilai",
  "nmg.edit": "Edit Nilai",
  "nmg.del": "Hapus Nilai",
  "nmg.modalAdd": "Tambah Nilai",
  "nmg.modalEdit": "Edit Nilai",
  "nmg.student": "Siswa:",
  "nmg.save": "Simpan Nilai",
  "nmg.errAdd": "Gagal menambahkan nilai.",
  "nmg.delMsg": "Hapus nilai siswa dengan ID {id}? Tindakan ini tidak dapat dibatalkan.",
  "nmg.needInputTitle": "Nilai Belum Diinput",
  "nmg.needInputBody":
    "Siswa ini belum pernah menerima input nilai. Silakan input nilai terlebih dahulu sebelum mengedit atau menghapus.",
  "nmg.needInputCta": "Input Nilai Sekarang",
};

const EN: Record<string, string> = {
  "shell.brand": "Student Grade Management System",
  "shell.menu": "Menu",
  "shell.logout": "Log Out",
  "shell.nav.dashboard": "Dashboard",
  "shell.nav.kelolaSiswa": "Manage Students",
  "shell.nav.kelolaGuru": "Manage Teachers",
  "shell.nav.laporanNilai": "Grade Reports",
  "shell.nav.kelolaNilai": "Manage Student Grades",
  "shell.openNav": "Open navigation menu",
  "shell.switchLang": "Switch language",
  "role.admin": "Admin",
  "role.guru": "Teacher",
  "role.siswa": "Student",

  "login.subtitle": "Sign in to access grade data",
  "login.username": "Username",
  "login.password": "Password",
  "login.usernamePh": "Enter your username",
  "login.passwordPh": "Enter your password",
  "login.submit": "Sign In",
  "login.processing": "Processing...",
  "login.fail": "Login failed. Check your username and password.",
  "login.network": "Cannot connect to the server. Try again later.",
  "login.footer": "Contact the Admin if you have access issues.",
  "login.logoAlt": "Student Grade System Logo",

  "date.prefix": "Date:",
  "time.today": "Today",
  "time.yesterday": "Yesterday",
  "time.unknown": "Unknown time",

  "sort.by": "Sort by {label}",

  "search.none": "No results for \u201C{q}\u201D.",
  "common.cancel": "Cancel",
  "common.save": "Save Changes",
  "common.edit": "Edit",
  "common.delete": "Delete",
  "common.yesDelete": "Yes, Delete",
  "common.confirmDelete": "Confirm Delete",
  "common.irreversible": "This action cannot be undone.",
  "common.actions": "Actions",
  "common.name": "Name",
  "common.class": "Class",
  "common.subject": "Subject",
  "common.nis": "Student ID",
  "common.id": "ID",
  "common.addData": "Add Data",

  "loading.data": "Loading data...",
  "loading.grades": "Loading grades...",
  "loading.guru": "Loading teachers...",
  "loading.siswa": "Loading students...",
  "empty.noData": "No data yet.",
  "empty.noGrades": "No grade data yet.",
  "empty.noNilai": "No grades entered yet",
  "empty.noNilaiPlain": "No grades yet.",
  "empty.noGuru": "No teacher data yet",
  "empty.noSiswa": "No student data yet",
  "empty.noActivity": "No recent activity yet",
  "empty.noGradeData": "No grade data yet.",

  "th.nama": "Name",
  "th.mapel": "Subject",
  "th.nilaiAkhir": "Final Grade",
  "th.tugas": "Tasks",
  "th.uts": "Midterm",
  "th.uas": "Final Exam",
  "th.akhir": "Final",
  "th.status": "Status",
  "th.statusNilai": "Grade Status",
  "th.kelulusan": "Pass Status",
  "th.statusKelulusan": "Pass Status",
  "th.namaGuru": "Teacher Name",
  "th.namaSiswa": "Student Name",
  "th.nilaiTugas": "Task Grade",
  "th.nilaiUts": "Midterm Grade",
  "th.nilaiUas": "Final Exam Grade",

  "chart.distribution": "Grade Distribution",
  "chart.avgPerKelas": "Average by Class",
  "chart.avgPerMapel": "Average by Subject",
  "chart.gradesPerMapel": "Grades by Subject",
  "chart.passStatus": "Pass Status",
  "chart.kelulusan": "Pass / Fail",
  "chart.progress": "Grading Progress",
  "chart.entries": "Entries",
  "chart.mapel": "Subjects",
  "chart.rangeNote": "Final grade ranges \u00B7 {n} entries",

  "stat.totalSiswa": "Total Students",
  "stat.totalGuru": "Total Teachers",
  "stat.totalNilai": "Total Grades Entered",
  "stat.avg": "Average Grade",
  "stat.diampu": "Assigned Students",
  "stat.perluDinilai": "Pending Grades",
  "stat.sudahDinilai": "Graded",
  "stat.jumlahData": "Data Count",
  "stat.lulus": "Passed",
  "stat.belumDinilai": "Not Graded",
  "stat.tertinggi": "Highest",
  "stat.terendah": "Lowest",
  "stat.jumlahMapel": "Subjects",

  "dash.welcome": "Welcome",
  "dash.activity": "Recent Activity",
  "dash.studentGrades": "Student Grades",
  "dash.teacherData": "Teacher Data",
  "dash.studentData": "Student Data",
  "dash.assigned": "Assigned Students",

  "siswa.title": "My Academic Grades",
  "siswa.desc": "Summary of task, midterm, final exam, and final grades.",
  "donut.lulus": "Passed",
  "donut.tidakLulus": "Failed",
  "donut.belumDinilai": "Not Graded",

  "lap.admin.title": "Overall Grade Report",
  "lap.admin.desc": "Recap of all student grades.",
  "lap.guru.title": "Student Grade Report",
  "lap.guru.desc": "Summary of all final grades and pass status.",
  "lap.table": "Grades Table",

  "search.ph": "Search ID, name, class, subject...",
  "search.phGuru": "Search ID, name, subject...",

  "guru.title": "Manage Teachers",
  "guru.desc": "List of all registered teachers",
  "guru.add": "+ Add Teacher",
  "guru.list": "Teacher List",
  "guru.modalAdd": "Add Teacher",
  "guru.modalEdit": "Edit Teacher",
  "guru.idLabel": "Teacher ID",
  "guru.accountSection": "Login Account",
  "guru.usernameLogin": "Login Username",
  "guru.initialPassword": "Initial Password",
  "guru.phId": "Enter unique ID",
  "guru.phName": "Full name with degree",
  "guru.phMapel": "e.g. Web Programming",
  "guru.phUsername": "e.g. Heru",
  "guru.phPassword": "e.g. G00X/G0XX",
  "guru.errAdd": "Failed to add teacher. Make sure the ID is not already registered.",
  "guru.errEdit": "Failed to update teacher data.",
  "guru.delMsg": "Delete teacher with ID {id}? This action cannot be undone.",

  "siswaMgmt.title": "Manage Students",
  "siswaMgmt.desc": "List of all registered students",
  "siswaMgmt.add": "+ Add Student",
  "siswaMgmt.list": "Student List",
  "siswaMgmt.modalAdd": "Add Student",
  "siswaMgmt.modalEdit": "Edit Student",
  "siswaMgmt.addSubject": "Add Subject",
  "siswaMgmt.selectSubject": "Select Subject",
  "siswaMgmt.removeSubject": "Remove subject",
  "siswaMgmt.phNis": "Enter new student ID",
  "siswaMgmt.phName": "Full name",
  "siswaMgmt.phClass": "e.g. XII-RPL-1",
  "siswaMgmt.accountSection": "Add Student Account",
  "siswaMgmt.phUsername": "e.g. student01",
  "siswaMgmt.phPassword": "e.g. S001",
  "siswaMgmt.delA": "Delete student",
  "siswaMgmt.delB": "with ID",
  "siswaMgmt.errEdit": "Failed to update student data.",
  "siswaMgmt.errAdd": "Failed to add student. Check the ID or selected subjects.",
  "siswaMgmt.errMinSubject": "Select at least one subject.",

  "nmg.title": "Manage Student Grades",
  "nmg.desc": "Add or edit grades for the subjects you teach",
  "nmg.input": "+ Enter Grades",
  "nmg.edit": "Edit Grades",
  "nmg.del": "Delete Grades",
  "nmg.modalAdd": "Add Grades",
  "nmg.modalEdit": "Edit Grades",
  "nmg.student": "Student:",
  "nmg.save": "Save Grades",
  "nmg.errAdd": "Failed to add grades.",
  "nmg.delMsg": "Delete grade entry with ID {id}? This action cannot be undone.",
  "nmg.needInputTitle": "Grades Not Entered Yet",
  "nmg.needInputBody":
    "This student has no grades entered yet. Please enter the grades first before editing or deleting.",
  "nmg.needInputCta": "Enter Grades Now",
};

/* ── Kamus value data (mapel, status, pesan server) ───── */

const VALUE_EN: Record<string, string> = {
  // mata pelajaran
  "Agama Islam": "Islamic Education",
  "Ga punya agama": "No Religion",
  // status nilai
  "Belum Dinilai": "Not Graded",
  "Sudah Dinilai": "Graded",
  // status kelulusan
  Lulus: "Passed",
  "Tidak Lulus": "Failed",
  // pesan API yang diketahui
  "Username tidak ditemukan": "Username not found",
  "Password salah": "Incorrect password",
  "Anda tidak memiliki akses": "You do not have access",
  "Server Error": "Server Error",
  "Login gagal": "Login failed",
};

/* ── Context ──────────────────────────────────────────── */

type I18nValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  tv: (value: string | null | undefined) => string;
  locale: string;
};

const I18nContext = createContext<I18nValue>({
  lang: "id",
  setLang: () => {},
  t: (key) => key,
  tv: (v) => v ?? "",
  locale: "id-ID",
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("id");

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const saved = localStorage.getItem("lang");
        if (saved === "en" || saved === "id") setLangState(saved);
      } catch {
        /* localStorage tidak tersedia */
      }
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {
      /* ignore */
    }
  };

  const t: I18nValue["t"] = (key, vars) => {
    let out = lang === "en" ? (EN[key] ?? ID[key] ?? key) : (ID[key] ?? key);
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        out = out.split(`{${k}}`).join(String(v));
      }
    }
    return out;
  };

  const tv: I18nValue["tv"] = (value) => {
    if (value == null) return "";
    if (lang !== "en") return value;
    return VALUE_EN[value] ?? value;
  };

  const value: I18nValue = {
    lang,
    setLang,
    t,
    tv,
    locale: lang === "en" ? "en-US" : "id-ID",
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface CountRow extends RowDataPacket {
  total: number;
}

interface Guru extends RowDataPacket {
  id: number; 
  nama_guru: string;
  mata_pelajaran: string;
}

interface Siswa extends RowDataPacket {
  nis: string;
  nama: string;
  kelas: string;
}

interface Nilai extends RowDataPacket {
  id: number;
  nis: string;
  nama: string;
  kelas: string;
  mata_pelajaran: string;
  nilai_akhir: number;
  nama_guru?: string;
  created_at?: string | null;
}

export async function GET() {
  try {
    const [siswaCount] = await db.query<CountRow[]>("SELECT COUNT(*) AS total FROM siswa");
    const [guruCount] = await db.query<CountRow[]>("SELECT COUNT(*) AS total FROM guru");
    const [nilaiCount] = await db.query<CountRow[]>("SELECT COUNT(*) AS total FROM nilai");

    const [siswaRows] = await db.query<Siswa[]>("SELECT * FROM siswa LIMIT 5");
    const [guruRows] = await db.query<Guru[]>("SELECT * FROM guru LIMIT 5");

    // ambil data siswa
    const [nilaiRows] = await db.query<Nilai[]>(`
        SELECT
            n.id,
            s.nis,
            s.nama,
            s.kelas,
            g.mata_pelajaran,
            g.nama_guru,
            n.nilai_akhir,
            n.status_nilai,
            n.created_at
            FROM nilai n
            JOIN siswa s ON n.nis = s.nis
            JOIN guru g ON n.id_guru = g.id
            ORDER BY n.id DESC
        LIMIT 5
    `);

    return NextResponse.json({
      totalSiswa: siswaCount[0].total,
      totalGuru: guruCount[0].total,
      totalNilai: nilaiCount[0].total,
      siswa: siswaRows,
      guru: guruRows,
      nilai: nilaiRows, 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengambil data" }, { status: 500 });
  }
}
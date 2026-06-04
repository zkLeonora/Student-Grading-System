import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface CountResult extends RowDataPacket {
  totalSiswa: number;
}

interface NilaiCountResult extends RowDataPacket {
  totalNilai: number;
}

export async function GET() {
  try {
    const [siswaRows] = await db.query<CountResult[]>(
      "SELECT COUNT(*) AS totalSiswa FROM siswa"
    );

    const [nilaiRows] = await db.query<NilaiCountResult[]>(`
      SELECT COUNT(*) AS totalNilai 
      FROM nilai 
      WHERE status_nilai = 'Belum Dinilai'
    `);

    const [siswa] = await db.query<RowDataPacket[]>(`
      SELECT nis,nama,kelas
      FROM siswa
      ORDER BY nama ASC
      LIMIT 5
    `);

    const [nilai] = await db.query<RowDataPacket[]>(`
        SELECT
            n.id,
            s.nis,
            s.nama,
            s.kelas,
            g.mata_pelajaran,
            n.nilai_akhir,
            n.status_nilai
            FROM nilai n
            JOIN siswa s ON n.nis = s.nis
            JOIN guru g ON n.id_guru = g.id
            ORDER BY n.id DESC
        LIMIT 5
    `);

    return NextResponse.json({
      totalSiswa: siswaRows[0].totalSiswa,
      totalNilai: nilaiRows[0].totalNilai,
      siswa,
      nilai,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gagal mengambil dashboard" },
      { status: 500 }
    );
  }
}
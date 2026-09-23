import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";

interface CountResult extends RowDataPacket {
  total: number;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUser = cookieStore.get("session_user");

    if (!sessionUser) {
      return NextResponse.json(
        { message: "Anda tidak memiliki akses" },
        { status: 401 }
      );
    }

    let guruId: string | null = null;
    try {
      const session = JSON.parse(sessionUser.value) as { guru_id?: string | null };
      guruId = session.guru_id ?? null;
    } catch {
      guruId = null;
    }

    if (!guruId) {
      return NextResponse.json(
        { message: "Anda tidak memiliki akses" },
        { status: 403 }
      );
    }

    const [siswaRows] = await db.query<CountResult[]>(
      "SELECT COUNT(*) AS total FROM nilai WHERE id_guru = ?",
      [guruId]
    );

    const [nilaiRows] = await db.query<CountResult[]>(
      `SELECT COUNT(*) AS total
       FROM nilai
       WHERE id_guru = ? AND status_nilai = 'Belum Dinilai'`,
      [guruId]
    );

    const [siswa] = await db.query<RowDataPacket[]>(
      `
      SELECT s.nis, s.nama, s.kelas
      FROM siswa s
      JOIN nilai n ON n.nis = s.nis AND n.id_guru = ?
      ORDER BY s.nama ASC
      LIMIT 5
    `,
      [guruId]
    );

    const [nilai] = await db.query<RowDataPacket[]>(
      `
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
      WHERE n.id_guru = ?
      ORDER BY n.id DESC
      LIMIT 5
    `,
      [guruId]
    );

    return NextResponse.json({
      totalSiswa: siswaRows[0].total,
      totalNilai: nilaiRows[0].total,
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

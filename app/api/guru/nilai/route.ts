import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";

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

    const [rows] = await db.query<RowDataPacket[]>(
      `
      SELECT
        s.nis,
        s.nama,
        s.kelas,
        n.id,
        g.mata_pelajaran,
        n.nilai_tugas,
        n.nilai_uts,
        n.nilai_uas,
        n.nilai_akhir,
        n.status_nilai,
        n.status_kelulusan
      FROM siswa s
      JOIN nilai n ON n.nis = s.nis AND n.id_guru = ?
      JOIN guru g ON n.id_guru = g.id
      ORDER BY s.nama ASC;
    `,
      [guruId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil nilai" },
      { status: 500 }
    );
  }
}

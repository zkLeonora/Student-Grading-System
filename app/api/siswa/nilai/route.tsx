import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionUser = (await cookieStore).get("session_user");

    if (!sessionUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = JSON.parse(sessionUser.value).id;

    const [rows] = await db.query<RowDataPacket[]>(
      `
      SELECT 
        n.id,
        g.mata_pelajaran,
        n.nilai_tugas,
        n.nilai_uts,
        n.nilai_uas,
        n.nilai_akhir,
        n.status_nilai
      FROM nilai n
      JOIN siswa s ON n.nis = s.nis
      JOIN guru g ON n.id_guru = g.id
      WHERE s.user_id = ?
      `,
      [userId]
    );

    return NextResponse.json(rows);

  } catch (error) {
    console.error("API SISWA ERROR:", error);
    return NextResponse.json(
      { message: "Gagal memuat data", error: String(error) },
      { status: 500 }
    );
  }
}
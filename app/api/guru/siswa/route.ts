import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface Siswa extends RowDataPacket {
  nis: string;
  nama: string;
  kelas: string;
}

export async function GET() {
  try {
    const [rows] = await db.query<Siswa[]>(`
      SELECT *
      FROM siswa
      ORDER BY nama ASC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gagal mengambil data siswa" },
      { status: 500 }
    );
  }
}
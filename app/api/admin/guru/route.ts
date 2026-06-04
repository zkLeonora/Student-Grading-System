import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface Guru extends RowDataPacket {
  id: number;
  nama_guru: string;
  mata_pelajaran: string;
}

// ambil data 
export async function GET() {
  try {
    const [rows] = await db.query<Guru[]>(
      `
      SELECT *
      FROM guru
      ORDER BY nama_guru
      `
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memuat data guru",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id, nama_guru, mata_pelajaran } =
      await req.json();

    await db.query(
      `
      INSERT INTO guru
      (id, nama_guru, mata_pelajaran)
      VALUES (?, ?, ?)
      `,
      [id, nama_guru, mata_pelajaran]
    );

    return NextResponse.json({
      success: true,
      message: "Guru berhasil ditambahkan",
    });
  } catch (error) {
    console.error("POST Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan data guru",
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface Siswa extends RowDataPacket {
  nis: string;
  nama: string;
  kelas: string;
  mata_pelajaran: string;
  // ✅ FIX: sertakan id_guru agar FE bisa pre-populate dropdown saat edit
  id_guru: string;
}

// Ambil semua data siswa
export async function GET() {
  try {
    const [rows] = await db.query<Siswa[]>(
      `SELECT 
        s.nis,
        s.nama,
        s.kelas,
        g.mata_pelajaran,
        n.id_guru
      FROM siswa s
      LEFT JOIN nilai n ON s.nis = n.nis
      LEFT JOIN guru g ON n.id_guru = g.id
      ORDER BY s.nis ASC;`
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data siswa" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { nis, nama, kelas, id_guru } = await req.json();
  
  // Gunakan Transaction agar jika salah satu gagal, keduanya batal
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query("INSERT INTO siswa (nis, nama, kelas) VALUES (?, ?, ?)", [nis, nama, kelas]);
    await connection.query("INSERT INTO nilai (nis, id_guru, nilai_tugas, nilai_uts, nilai_uas, nilai_akhir) VALUES (?, ?, 0, 0, 0, 0)", [nis, id_guru]);
    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
}
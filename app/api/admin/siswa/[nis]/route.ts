import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ nis: string }> }) {
  const { nis } = await params;
  const { nama, kelas, id_guru } = await req.json();

  // 1. Update data pokok siswa
  await db.query(`UPDATE siswa SET nama = ?, kelas = ? WHERE nis = ?`, [nama, kelas, nis]);

  // 2. Update data nilai (pasti hanya ada 1 karena constraint UNIQUE)
  await db.query(`UPDATE nilai SET id_guru = ? WHERE nis = ?`, [id_guru, nis]);

  return NextResponse.json({ success: true });
}

// Hapus data siswa berdasarkan NIS
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ nis: string }> }
) {
  try {
    const { nis } = await params;

    // ✅ NOTE: jika ada FK constraint di tabel nilai (nis → siswa.nis),
    // pastikan ON DELETE CASCADE aktif di DB, atau hapus nilai dulu secara manual:
    // await db.query(`DELETE FROM nilai WHERE nis = ?`, [nis]);

    await db.query(`DELETE FROM siswa WHERE nis = ?`, [nis]);

    return NextResponse.json({
      success: true,
      message: "Data siswa berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus data siswa" },
      { status: 500 }
    );
  }
}
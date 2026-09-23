import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ nis: string }> }) {
  const { nis } = await params;
  const { nama, kelas, mapel } = await req.json();

  if (!Array.isArray(mapel) || mapel.length === 0) {
    return NextResponse.json({ success: false, message: "Pilih minimal satu mata pelajaran." }, { status: 400 });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(`UPDATE siswa SET nama = ?, kelas = ? WHERE nis = ?`, [nama, kelas, nis]);

    await connection.query(`DELETE FROM nilai WHERE nis = ?`, [nis]);

    for (const id_guru of mapel) {
      if (!id_guru) continue;
      await connection.query(
        `INSERT INTO nilai (nis, id_guru, nilai_tugas, nilai_uts, nilai_uas, nilai_akhir)
         VALUES (?, ?, 0, 0, 0, 0)`,
        [nis, id_guru]
      );
    }

    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    await connection.rollback();
    console.error("PUT Error:", error);
    return NextResponse.json({ success: false, message: "Gagal memperbarui data siswa." }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ nis: string }> }) {
  try {
    const { nis } = await params;
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(`DELETE FROM nilai WHERE nis = ?`, [nis]);
      await conn.query(`DELETE FROM siswa WHERE nis = ?`, [nis]);
      await conn.commit();
    } catch (innerError) {
      await conn.rollback();
      throw innerError;
    } finally {
      conn.release();
    }
    return NextResponse.json({ success: true, message: "Data siswa berhasil dihapus" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ success: false, message: "Gagal menghapus data siswa" }, { status: 500 });
  }
}
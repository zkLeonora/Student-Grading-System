import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface Params {
  params: {
    id: string;
  };
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();

    const tugas = Number(body.nilai_tugas ?? 0);
    const uts = Number(body.nilai_uts ?? 0);
    const uas = Number(body.nilai_uas ?? 0);

    const nilai_akhir = (tugas * 0.3) + (uts * 0.3) + (uas * 0.4);
    const status_nilai = body.status_nilai ?? "Belum Dinilai"; 
    const status_kelulusan = nilai_akhir >= 75 ? "Lulus" : "Tidak Lulus"; 
    
    if (!id || id === "null") {
      return NextResponse.json(
        { message: "ID nilai tidak valid" },
        { status: 400 }
      );
    }

    await db.query(
      `
      UPDATE nilai
      SET
        nilai_tugas = ?,
        nilai_uts = ?,
        nilai_uas = ?,
        nilai_akhir = ?,
        status_nilai = ?,
        status_kelulusan = ?  
      WHERE id = ?
      `,
      [tugas, uts, uas, nilai_akhir, status_nilai, status_kelulusan, id]
    );

    return NextResponse.json({ message: "Nilai berhasil diupdate" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal update nilai" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const { id } = await params;

  await db.query(`
    UPDATE nilai
    SET
      nilai_tugas = 0,
      nilai_uts = 0,
      nilai_uas = 0,
      nilai_akhir = 0,
      status_kelulusan = NULL 
    WHERE id = ?
  `, [id]);

  return NextResponse.json({ message: "Nilai berhasil dihapus" });
}
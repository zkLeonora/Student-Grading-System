import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Update data guru berdasarkan ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { nama_guru, mata_pelajaran } = await req.json();

    await db.query(
      `
      UPDATE guru
      SET nama_guru = ?, mata_pelajaran = ?
      WHERE id = ?
      `,
      [nama_guru, mata_pelajaran, id]
    );

    return NextResponse.json({
      success: true,
      message: "Data guru berhasil diperbarui",
    });
  } catch (error) {
    console.error("PUT Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui data guru",
      },
      { status: 500 }
    );
  }
}

// Hapus data guru berdasarkan ID
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: id_guru } = await params;

    await db.query(
      `
      DELETE FROM guru
      WHERE id = ?
      `,
      [id_guru]
    );

    return NextResponse.json({
      success: true,
      message: "Data guru berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus data guru",
      },
      { status: 500 }
    );
  }
}
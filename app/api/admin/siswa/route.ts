import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";

interface SiswaRow extends RowDataPacket {
  nis: string;
  nama: string;
  kelas: string;
  mata_pelajaran: string | null;
  id_guru: string | null;
  nilai_id: number | null;
}

interface SiswaGrouped {
  nis: string;
  nama: string;
  kelas: string;
  mapel: {
    nama: string;
    id_guru: string;
    nilai_id: number;
  }[];
}

export async function GET() {
  try {
    const [rows] = await db.query<SiswaRow[]>(`
      SELECT 
        s.nis,
        s.nama,
        s.kelas,
        g.mata_pelajaran,
        n.id_guru,
        n.id AS nilai_id
      FROM siswa s
      LEFT JOIN nilai n ON s.nis = n.nis
      LEFT JOIN guru g ON n.id_guru = g.id
      ORDER BY s.nis ASC
    `);

    const grouped = rows.reduce<SiswaGrouped[]>((acc, row) => {
      let siswa = acc.find((s) => s.nis === row.nis);

      if (!siswa) {
        siswa = {
          nis: row.nis,
          nama: row.nama,
          kelas: row.kelas,
          mapel: [],
        };
        acc.push(siswa);
      }

      if (
        row.mata_pelajaran &&
        row.id_guru &&
        row.nilai_id !== null
      ) {
        siswa.mapel.push({
          nama: row.mata_pelajaran,
          id_guru: row.id_guru,
          nilai_id: row.nilai_id,
        });
      }

      return acc;
    }, []);

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memuat data siswa",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { nis, nama, kelas, mapel, username, password } = await req.json();

  if (!Array.isArray(mapel) || mapel.length === 0) {
    return NextResponse.json(
      { success: false, message: "Pilih minimal satu mata pelajaran." },
      { status: 400 }
    );
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Cek username sudah dipakai belum
    const [existingUser] = await connection.query<RowDataPacket[]>(
      `SELECT id FROM users WHERE username = ?`,
      [username]
    );

    if (existingUser.length > 0) {
      await connection.rollback();
      return NextResponse.json(
        { success: false, message: "Username sudah digunakan" },
        { status: 400 }
      );
    }

    // Buat akun user
    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await connection.query<ResultSetHeader>(
      `INSERT INTO users (username, password, role) VALUES (?, ?, 'siswa')`,
      [username, hashedPassword]
    );
    const userId = userResult.insertId;

    // Insert siswa dengan user_id
    const [existingSiswa] = await connection.query<RowDataPacket[]>(
      `SELECT nis FROM siswa WHERE nis = ?`,
      [nis]
    );

    if (existingSiswa.length === 0) {
      await connection.query(
        `INSERT INTO siswa (nis, user_id, nama, kelas) VALUES (?, ?, ?, ?)`,
        [nis, userId, nama, kelas]
      );
    } else {
      await connection.rollback();
      return NextResponse.json(
        { success: false, message: "NIS sudah terdaftar." },
        { status: 400 }
      );
    }

    // Insert nilai per mata pelajaran
    for (const id_guru of mapel as string[]) {
      if (!id_guru) continue;
      await connection.query<ResultSetHeader>(
        `INSERT INTO nilai (nis, id_guru, nilai_tugas, nilai_uts, nilai_uas, nilai_akhir)
         VALUES (?, ?, 0, 0, 0, 0)
         ON DUPLICATE KEY UPDATE id_guru = id_guru`,
        [nis, id_guru]
      );
    }

    await connection.commit();
    return NextResponse.json({ success: true, message: "Siswa dan akun berhasil dibuat" });
  } catch (e) {
    await connection.rollback();
    console.error("POST Error:", e);
    return NextResponse.json(
      { success: false, message: "Gagal menambahkan data." },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
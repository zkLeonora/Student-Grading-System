import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";

interface Guru extends RowDataPacket {
  id: string;
  user_id: number;
  nama_guru: string;
  mata_pelajaran: string;
}

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
  const connection = await db.getConnection();

  try {
      const {
    id,
    nama_guru,
    mata_pelajaran,
    username,
    password,
  } = await req.json();

  const [existingUser] =
    await connection.query<RowDataPacket[]>(
      `
      SELECT id
      FROM users
      WHERE username = ?
      `,
      [username]
    );

  if (existingUser.length > 0) {
    await connection.rollback();

    return NextResponse.json(
      {
        success: false,
        message: "Username sudah digunakan",
      },
      { status: 400 }
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const [userResult] =
    await connection.query<ResultSetHeader>(
      `
      INSERT INTO users
      (username, password, role)
      VALUES (?, ?, 'guru')
      `,
      [username, hashedPassword]
    );

    const userId = userResult.insertId;

    await connection.query(
      `
      INSERT INTO guru
      (id, user_id, nama_guru, mata_pelajaran)
      VALUES (?, ?, ?, ?)
      `,
      [
        id,
        userId,
        nama_guru,
        mata_pelajaran,
      ]
    );

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: "Guru dan akun berhasil dibuat",
      username: id,
      password_awal: id,
    });
  } catch (error) {
    await connection.rollback();

    console.error("POST Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan data guru",
      },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
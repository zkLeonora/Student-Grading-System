import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};

type Guru = {
  id: string;
  user_id: number;
};

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Username tidak ditemukan" },
        { status: 401 }
      );
    }

    const user = rows[0] as User;
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Password salah" },
        { status: 401 }
      );
    }

    const [guruRows] = await db.query<RowDataPacket[]>(
      "SELECT id FROM guru WHERE user_id = ?",
      [user.id]
    );

    const guru = guruRows[0] as Guru | undefined;

    const response = NextResponse.json({
      success: true,
      role: user.role,
    });

    response.cookies.set("session_user", JSON.stringify({
      id: user.id,
      guru_id: guru?.id ?? null,
      username: user.username,
      role: user.role,
    }), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 8, 
    });

    response.cookies.set("session_role", user.role, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}
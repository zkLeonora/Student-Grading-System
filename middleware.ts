import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const role = req.cookies.get("session_role")?.value;
  const path = req.nextUrl.pathname;

  if (!role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (role !== "admin" && path.startsWith("/admin")) {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));
  }
  if (role !== "guru" && path.startsWith("/guru")) {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));
  }
  if (role !== "siswa" && path.startsWith("/siswa")) {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/guru/:path*", "/siswa/:path*"],
};
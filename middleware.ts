import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ อนุญาตหน้า login (ไม่ต้องมี token)
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // ✅ กันทุกหน้า /admin (ยกเว้น /admin/login)
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// ให้ middleware ทำงานเฉพาะ /admin
export const config = {
  matcher: ["/admin/:path*"],
};
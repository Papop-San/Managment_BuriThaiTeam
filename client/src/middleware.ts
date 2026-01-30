import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware = (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));

    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp < now) {
      const response = NextResponse.redirect(new URL("/", req.url));
      response.cookies.delete("token");
      return response;
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.delete("token");
    return response;
  }
};

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/account/:path*",
    "/banner/:path*",
    "/order/:path*",
    "/product/:path*",
    "/role/:path*",
    "/stock/:path*",
    "/category/:path*",
    "/payment/:path*",
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware = (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const base64Url = token.split(".")[1];
    const decoded = JSON.parse(Buffer.from(base64Url, "base64").toString());
    const now = Date.now() / 1000;

    if (decoded.exp && decoded.exp < now) {
      const response = NextResponse.redirect(new URL("/", req.url));
      response.cookies.delete("token");
      return response;
    }

    return NextResponse.next();
  } catch (err) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("token");
    return response;
  }
};

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/account/:path*", 
    "/banner/:path*", 
    "/order/:path*", 
    "/product/:path*", 
    "/role/:path*", 
    "/stock/:path*"
  ],
};

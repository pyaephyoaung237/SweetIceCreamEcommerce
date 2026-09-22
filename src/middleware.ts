import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Helper function for your auth secret
const authSecret = () => new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key-change-me");

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  // Use the exact cookie name "token"
  const token = req.cookies.get("token")?.value;

  let role: string | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, authSecret());
      role = payload.role as string;
    } catch {
      role = null;
    }
  }

  if (!role) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }
  if (path.startsWith("/admin") && role !== "admin") return NextResponse.redirect(new URL("/", req.url));
  if (path.startsWith("/supervisor") && role !== "supervisor")
    return NextResponse.redirect(new URL("/", req.url));

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/supervisor/:path*", "/account/:path*"] };
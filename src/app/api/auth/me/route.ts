import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-me";

// Used by the Navbar to know who is logged in
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      // Not logged in is normal, so answer 200 (no red 401 in the console)
      return NextResponse.json({ user: null });
    }

    const payload = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      name: string;
      email: string;
      role: string;
    };

    return NextResponse.json({
      user: { id: payload.userId, name: payload.name, email: payload.email, role: payload.role },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
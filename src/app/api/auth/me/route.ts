import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const authSecret = () => new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key-change-me");

export async function GET() {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      console.log("❌ CONSOLE CHECK: No token cookie found!");
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, authSecret());
    
    // 👇 CONSOLE LOG THE FULL JWT PAYLOAD TO SEE IF 'name' EXISTS
    console.log("🟢 CONSOLE CHECK - JWT Payload:", payload);

    return NextResponse.json({
      user: {
        userId: payload.userId,
        name: payload.name || "User", 
        email: payload.email,
        role: payload.role,
      },
    });
  } catch (error) {
    console.error("❌ CONSOLE CHECK - Token verification failed:", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
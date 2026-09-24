import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-me";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Same normalisation as signup (lowercase email, password untouched)
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const result: any = await query("SELECT * FROM users WHERE email = $1", [email]);
    const users = Array.isArray(result) ? result : result?.rows || [];
    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const user = users[0];

    if (user.status !== "active") {
      return NextResponse.json({ error: "This account is inactive" }, { status: 403 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Token holds name + email so the navbar can show them (no branch_id)
    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      role: user.role,
      redirect: user.role === "admin" ? "/admin" : "/",
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
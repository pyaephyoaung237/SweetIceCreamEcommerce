import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-me";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim();
    const password = body?.password?.trim();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const users = await query("SELECT * FROM users WHERE email = $1", [email]);
    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 🔴 CRITICAL FIX: Include 'name' in the JWT payload so the navbar can read it!
    const token = jwt.sign(
      { 
        userId: user.id, 
        name: user.name, // <--- This sends your database name into the token cookie
        email: user.email, 
        role: user.role, 
        branch_id: user.branch_id 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ 
      success: true, 
      role: user.role,
      redirect: user.role === "admin" ? "/admin" : "/" 
    });
  } catch (error) {
    console.error("Login API internal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
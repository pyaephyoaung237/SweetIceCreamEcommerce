import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body?.name?.trim();
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;
    const phone = body?.phone?.trim() || null;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // 2. Check if the email is already used
    const existing: any = await query("SELECT id FROM users WHERE email = $1", [email]);
    const existingRows = Array.isArray(existing) ? existing : existing?.rows || [];
    if (existingRows.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // 3. Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // 4. Public signups are always 'user' + 'active' (no branch link on users)
    const result: any = await query(
      `INSERT INTO users (name, email, phone, password_hash, role, status)
       VALUES ($1, $2, $3, $4, 'user', 'active')
       RETURNING id, name, email, phone, role, status, created_at`,
      [name, email, phone, password_hash]
    );

    const rows = Array.isArray(result) ? result : result?.rows || [];
    return NextResponse.json(
      { success: true, message: "Account created successfully!", user: rows[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup API error:", error?.message || error);
    // While developing, show the real cause in the browser too
    const message =
      process.env.NODE_ENV !== "production"
        ? `Signup failed: ${error?.message || "unknown error"}`
        : "Internal server error. Please try again later.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
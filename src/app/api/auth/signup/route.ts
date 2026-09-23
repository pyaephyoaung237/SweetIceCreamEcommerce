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
    const branch_id = body?.branch_id || null;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    // 2. Check if user already exists with this email
    // Note: If your @/lib/db helper returns an object like { rows: [...] }, 
    // make sure to change 'existingUsers' to 'existingUsers.rows' depending on your setup.
    const existingUsers = await query("SELECT id FROM users WHERE email = $1", [email]);
    
    // Safety check for standard pg pool vs custom helper wrappers
    const userRows = Array.isArray(existingUsers) ? existingUsers : existingUsers?.rows || [];

    if (userRows.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // 3. Hash the password securely using bcrypt
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 4. Default public signups to the 'user' role and 'active' status
    const role = "user";
    const status = "active";

    // 5. Insert into the database including phone and return safe user data
    const result = await query(
      `INSERT INTO users (name, email, phone, password_hash, role, branch_id, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, name, email, phone, role, branch_id, status, created_at`,
      [name, email, phone, password_hash, role, branch_id, status]
    );

    const insertedRows = Array.isArray(result) ? result : result?.rows || [];
    const newUser = insertedRows[0];

    return NextResponse.json(
      { 
        success: true, 
        message: "Account created successfully!",
        user: newUser 
      },
      { status: 201 }
    );

  } catch (error: any) {
    // Detailed error logging to see the exact cause in your terminal console
    console.error("Signup API internal error details:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
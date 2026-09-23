import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const res = await query("SELECT * FROM branches ORDER BY created_at DESC");
    const rows = Array.isArray(res) ? res : res.rows || [];
    return NextResponse.json({ success: true, branches: rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, city, address, phone, latitude, longitude, status } = body;

    if (!name || !city || !address) {
      return NextResponse.json({ error: "Name, city, and address are required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now();

    const res = await query(
      `INSERT INTO branches (name, slug, city, address, phone, latitude, longitude, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, slug, city, address, phone || "", latitude || null, longitude || null, status || "active"]
    );

    const newBranch = Array.isArray(res) ? res[0] : res?.rows?.[0];
    return NextResponse.json({ success: true, branch: newBranch }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, city, address, phone, latitude, longitude, status } = body;

    const res = await query(
      `UPDATE branches SET name = $1, city = $2, address = $3, phone = $4, latitude = $5, longitude = $6, status = $7 WHERE id = $8 RETURNING *`,
      [name, city, address, phone, latitude || null, longitude || null, status, id]
    );

    const updated = Array.isArray(res) ? res[0] : res?.rows?.[0];
    return NextResponse.json({ success: true, branch: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await query("DELETE FROM branches WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
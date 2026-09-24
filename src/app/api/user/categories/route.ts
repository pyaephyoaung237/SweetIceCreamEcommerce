import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/user/categories -> active categories for the store filter
export async function GET() {
  try {
    const result: any = await query(
      `SELECT id, name, slug, description, image_url
       FROM categories
       WHERE status = 'active'
       ORDER BY name ASC`
    );
    const rows = Array.isArray(result) ? result : result.rows || [];
    return NextResponse.json({ success: true, categories: rows });
  } catch (error: any) {
    console.error("User categories error:", error);
    return NextResponse.json({ success: false, error: "Failed to load categories" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// --- GET: Fetch All Categories ---
export async function GET() {
  try {
    const categories = await query("SELECT * FROM categories ORDER BY name ASC");
    const rows = Array.isArray(categories) ? categories : categories.rows || [];
    return NextResponse.json({ success: true, categories: rows });
  } catch (error: any) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// --- POST: Create Category ---
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || "";
    const status = (formData.get("status") as string) || "active";

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now();
    const validStatus = ["active", "inactive"].includes(status) ? status : "active";

    const dbResult = await query(
      `INSERT INTO categories (name, slug, description, status, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
      [name, slug, description, validStatus]
    );
    
    const newCategory = Array.isArray(dbResult) ? dbResult[0] : dbResult?.rows?.[0];
    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create category:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// --- PUT: Update Category ---
export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || "";
    const status = (formData.get("status") as string) || "active";

    if (!id || !name) {
      return NextResponse.json({ error: "ID and category name are required" }, { status: 400 });
    }

    const dbResult = await query(
      `UPDATE categories SET name = $1, description = $2, status = $3 WHERE id = $4 RETURNING *`,
      [name, description, status, id]
    );
    const updatedCategory = Array.isArray(dbResult) ? dbResult[0] : dbResult?.rows?.[0];
    return NextResponse.json({ success: true, category: updatedCategory });
  } catch (error: any) {
    console.error("Failed to update category:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// --- DELETE: Delete Category ---
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Category ID required" }, { status: 400 });

    await query(`DELETE FROM categories WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete category:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
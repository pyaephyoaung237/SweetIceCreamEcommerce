import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Helpers ---------------------------------------------------------------
const VALID_STATUS = ["available", "unavailable", "hidden"];

// Discount is stored as a whole number between 0 and 90 (matches the DB check)
const parseDiscount = (value: FormDataEntryValue | null) => {
  const n = parseInt(String(value ?? "0"), 10);
  if (Number.isNaN(n)) return 0;
  return Math.min(90, Math.max(0, n));
};

async function saveImage(imageFile: File): Promise<string> {
  const bytes = await imageFile.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, "_")}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
}

// --- GET: Fetch Products with Category Names ---
export async function GET() {
  try {
    const products = await query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.created_at DESC
    `);

    const rows = Array.isArray(products) ? products : products.rows || [];
    return NextResponse.json({ success: true, products: rows });
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// --- POST: Create Product ---
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const category_id = formData.get("category_id") as string;
    const status = formData.get("status") as string;
    const discount_percent = parseDiscount(formData.get("discount_percent"));
    const imageFile = formData.get("image") as File | null;

    if (!name || !price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveImage(imageFile);
    }

    const validStatus = VALID_STATUS.includes(status) ? status : "available";
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now();

    const dbResult = await query(
      `INSERT INTO products (name, slug, description, price, discount_percent, category_id, status, image_url, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`,
      [
        name,
        slug,
        description || "",
        parseFloat(price),
        discount_percent,
        category_id ? parseInt(category_id) : null,
        validStatus,
        imageUrl,
      ]
    );

    const newProduct = Array.isArray(dbResult) ? dbResult[0] : dbResult?.rows?.[0];
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// --- PUT: Update Product ---
export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const category_id = formData.get("category_id") as string;
    const status = formData.get("status") as string;
    const discount_percent = parseDiscount(formData.get("discount_percent"));
    const imageFile = formData.get("image") as File | null;

    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    if (!name || !price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    let imageUrl = (formData.get("existing_image") as string) || null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveImage(imageFile);
    }

    const validStatus = VALID_STATUS.includes(status) ? status : "available";

    const dbResult = await query(
      `UPDATE products
       SET name = $1, description = $2, price = $3, discount_percent = $4,
           category_id = $5, status = $6, image_url = $7
       WHERE id = $8 RETURNING *`,
      [
        name,
        description || "",
        parseFloat(price),
        discount_percent,
        category_id ? parseInt(category_id) : null,
        validStatus,
        imageUrl,
        id,
      ]
    );

    const updatedProduct = Array.isArray(dbResult) ? dbResult[0] : dbResult?.rows?.[0];
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// --- DELETE: Delete Product ---
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    await query(`DELETE FROM products WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
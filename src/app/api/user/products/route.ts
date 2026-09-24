import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// Public endpoint for the customer store.
//   GET /api/user/products                 -> all available products
//   GET /api/user/products?category=3      -> filter by category id
//   GET /api/user/products?search=choc     -> search by name
//   GET /api/user/products?slug=my-slug    -> single product
//   GET /api/user/products?limit=8         -> limit results
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = Number(searchParams.get("limit")) || 0;

    // Customers only ever see 'available' products (never 'hidden' / 'unavailable')
    const where: string[] = ["p.status = 'available'"];
    const params: any[] = [];

    if (slug) {
      params.push(slug);
      where.push(`p.slug = $${params.length}`);
    }
    if (category && category !== "all") {
      params.push(parseInt(category));
      where.push(`p.category_id = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      where.push(`p.name ILIKE $${params.length}`);
    }

    let sql = `
      SELECT p.id, p.name, p.slug, p.description, p.price, p.discount_percent,
             p.image_url, p.category_id, p.status, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${where.join(" AND ")}
      ORDER BY p.created_at DESC`;

    if (limit > 0) {
      params.push(Math.min(limit, 100));
      sql += ` LIMIT $${params.length}`;
    }

    const result: any = await query(sql, params);
    const rows = Array.isArray(result) ? result : result.rows || [];

    if (slug) {
      if (rows.length === 0) {
        return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, product: rows[0] });
    }
    return NextResponse.json({ success: true, products: rows });
  } catch (error: any) {
    console.error("User products error:", error);
    return NextResponse.json({ success: false, error: "Failed to load products" }, { status: 500 });
  }
}
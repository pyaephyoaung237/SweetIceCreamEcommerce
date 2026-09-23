import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Adjust path to your MySQL pool connection if different

// GET: Fetch all or recent orders
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    let query = `
      SELECT o.id, u.name as customer_name, b.name as branch_name, o.total_amount, o.status, o.created_at
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN branches b ON o.branch_id = b.id
      ORDER BY o.created_at DESC
    `;

    if (limit) {
      query += ` LIMIT ${parseInt(limit, 10)}`;
    }

    const [orders]: any = await pool.query(query);

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Update order status (e.g., pending -> completed / processing)
export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Order ID and status are required" }, { status: 400 });
    }

    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);

    return NextResponse.json({ success: true, message: "Order status updated successfully" });
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
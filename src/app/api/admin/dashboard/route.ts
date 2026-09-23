import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // 1. Total Orders count
    const [orderCountResult]: any = await pool.query("SELECT COUNT(*) as count FROM orders");
    const totalOrders = orderCountResult[0]?.count || 0;

    // 2. Active Products count
    const [productCountResult]: any = await pool.query("SELECT COUNT(*) as count FROM products WHERE status = 'active'");
    const activeProducts = productCountResult[0]?.count || 0;

    // 3. Branches count
    const [branchCountResult]: any = await pool.query("SELECT COUNT(*) as count FROM branches WHERE status = 'active'");
    const branches = branchCountResult[0]?.count || 0;

    // 4. Pending Deliveries count
    const [pendingResult]: any = await pool.query("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'");
    const pendingDeliveries = pendingResult[0]?.count || 0;

    // 5. Popular Ice Creams (based on order items quantity)
    const [popularProducts]: any = await pool.query(`
      SELECT p.id, p.name, p.category, p.price, SUM(oi.quantity) as total_sold
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY p.id, p.name, p.category, p.price
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    // 6. Recent Orders
    const [recentOrders]: any = await pool.query(`
      SELECT o.id, u.name as customer_name, b.name as branch_name, o.total_amount, o.status, o.created_at
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN branches b ON o.branch_id = b.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        activeProducts,
        branches,
        pendingDeliveries,
      },
      popularProducts,
      recentOrders,
    });
  } catch (error: any) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
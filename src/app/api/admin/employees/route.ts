import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "salaries") {
      const sal = await query(`
        SELECT s.*, u.name as employee_name, b.name as branch_name 
        FROM salaries s 
        JOIN employees e ON s.employee_id = e.id 
        JOIN users u ON e.user_id = u.id 
        JOIN branches b ON s.branch_id = b.id 
        ORDER BY s.created_at DESC
      `);
      return NextResponse.json({ success: true, salaries: Array.isArray(sal) ? sal : sal.rows || [] });
    }

    const emp = await query(`
      SELECT e.*, u.name as name, u.email as email, u.phone as phone, b.name as branch_name 
      FROM employees e 
      JOIN users u ON e.user_id = u.id 
      JOIN branches b ON e.branch_id = b.id 
      ORDER BY e.id DESC
    `);
    return NextResponse.json({ success: true, employees: Array.isArray(emp) ? emp : emp.rows || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, name, email, password, phone, branch_id, position, base_salary, employee_id, period, amount, bonus, note } = body;

    if (type === "salary") {
      const salRes = await query(
        `INSERT INTO salaries (employee_id, branch_id, period, amount, bonus, note) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [employee_id, branch_id, period, amount, bonus || 0, note || ""]
      );
      return NextResponse.json({ success: true, salary: salRes });
    }

    // Create User first
    const hashedPass = await query(`SELECT crypt($1, gen_salt('bf')) as hash`, [password || "password123"]);
    const passHash = Array.isArray(hashedPass) ? hashedPass[0].hash : hashedPass.rows[0].hash;

    const userRes = await query(
      `INSERT INTO users (name, email, phone, password_hash, role, status) VALUES ($1, $2, $3, $4, 'user', 'active') RETURNING id`,
      [name, email, phone || "", passHash]
    );
    const userId = Array.isArray(userRes) ? userRes[0].id : userRes.rows[0].id;

    // Link in Employees table
    const empRes = await query(
      `INSERT INTO employees (user_id, branch_id, position, base_salary, status) VALUES ($1, $2, $3, $4, 'active') RETURNING *`,
      [userId, branch_id, position, base_salary]
    );

    return NextResponse.json({ success: true, employee: empRes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (type === "salary") {
      await query("DELETE FROM salaries WHERE id = $1", [id]);
    } else {
      // Deleting employee cascades to user delete based on DB constraint setup or delete user directly
      const emp = await query("SELECT user_id FROM employees WHERE id = $1", [id]);
      const userId = Array.isArray(emp) ? emp[0]?.user_id : emp.rows?.[0]?.user_id;
      await query("DELETE FROM users WHERE id = $1", [userId]);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
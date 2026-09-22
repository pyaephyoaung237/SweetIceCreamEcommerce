import { query } from "./db";
import { isoDate, num } from "./utils";

export type SalesFilter = { shopId?: number; categoryId?: number; from?: string; to?: string };

export function parseSalesFilter(sp: Record<string, string | undefined>): SalesFilter {
  return {
    shopId: num(sp.shop),
    categoryId: num(sp.category),
    from: isoDate(sp.from),
    to: isoDate(sp.to),
  };
}

const JOINS = `FROM order_items oi
  JOIN orders o ON o.id = oi.order_id
  JOIN shops s ON s.id = oi.shop_id
  LEFT JOIN categories c ON c.id = oi.category_id`;

function salesWhere(f: SalesFilter) {
  const conds: string[] = [];
  const params: any[] = [];
  if (f.shopId) {
    params.push(f.shopId);
    conds.push(`oi.shop_id = $${params.length}`);
  }
  if (f.categoryId) {
    params.push(f.categoryId);
    conds.push(`oi.category_id = $${params.length}`);
  }
  if (f.from) {
    params.push(f.from);
    conds.push(`o.created_at >= $${params.length}::date`);
  }
  if (f.to) {
    params.push(f.to);
    conds.push(`o.created_at < ($${params.length}::date + 1)`);
  }
  return { where: conds.length ? "WHERE " + conds.join(" AND ") : "", params };
}

export async function salesSummary(f: SalesFilter) {
  const { where, params } = salesWhere(f);
  const rows = await query<{ revenue: number; units: number; orders: number }>(
    `SELECT COALESCE(SUM(oi.line_total), 0) AS revenue,
            COALESCE(SUM(oi.quantity), 0) AS units,
            COUNT(DISTINCT oi.order_id) AS orders
     ${JOINS} ${where}`,
    params
  );
  return rows[0];
}

export async function salesByShop(f: SalesFilter) {
  const { where, params } = salesWhere(f);
  return query<{ id: number; name: string; revenue: number; units: number }>(
    `SELECT s.id, s.name, SUM(oi.line_total) AS revenue, SUM(oi.quantity) AS units
     ${JOINS} ${where}
     GROUP BY s.id, s.name ORDER BY revenue DESC`,
    params
  );
}

export async function salesByCategory(f: SalesFilter) {
  const { where, params } = salesWhere(f);
  return query<{ name: string; revenue: number; units: number }>(
    `SELECT COALESCE(c.name, 'Uncategorised') AS name,
            SUM(oi.line_total) AS revenue, SUM(oi.quantity) AS units
     ${JOINS} ${where}
     GROUP BY COALESCE(c.name, 'Uncategorised') ORDER BY revenue DESC`,
    params
  );
}

export async function topSelling(f: SalesFilter, limit = 5) {
  const { where, params } = salesWhere(f);
  params.push(limit);
  return query<{ product_id: number | null; product_name: string; units: number; revenue: number }>(
    `SELECT oi.product_id, oi.product_name, SUM(oi.quantity) AS units, SUM(oi.line_total) AS revenue
     ${JOINS} ${where}
     GROUP BY oi.product_id, oi.product_name
     ORDER BY units DESC, revenue DESC LIMIT $${params.length}`,
    params
  );
}

export async function salesRows(f: SalesFilter, limit = 100) {
  const { where, params } = salesWhere(f);
  params.push(limit);
  return query<{
    order_id: number;
    created_at: Date;
    product_name: string;
    category: string;
    shop: string;
    customer_name: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }>(
    `SELECT o.id AS order_id, o.created_at, oi.product_name,
            COALESCE(c.name, 'Uncategorised') AS category, s.name AS shop,
            o.customer_name, oi.quantity, oi.unit_price, oi.line_total
     ${JOINS} ${where}
     ORDER BY o.created_at DESC, oi.id DESC LIMIT $${params.length}`,
    params
  );
}

export async function dailyRevenue(shopId: number | undefined, days = 14) {
  const params: any[] = [days];
  let shopCond = "";
  if (shopId) {
    params.push(shopId);
    shopCond = `AND oi.shop_id = $2`;
  }
  return query<{ label: string; revenue: number }>(
    `SELECT to_char(g.d, 'Mon DD') AS label, COALESCE(SUM(oi.line_total), 0) AS revenue
     FROM generate_series(CURRENT_DATE - ($1::int - 1), CURRENT_DATE, interval '1 day') AS g(d)
     LEFT JOIN orders o ON o.created_at::date = g.d::date
     LEFT JOIN order_items oi ON oi.order_id = o.id ${shopCond}
     GROUP BY g.d ORDER BY g.d`,
    params
  );
}

// ---------- Payroll ----------

export type EmployeeRow = {
  id: number;
  shop_id: number;
  shop_name: string;
  name: string;
  position: string;
  base_salary: number;
  hired_on: string;
  last_paid: string | null;
};

export async function employeesByShop(shopId?: number) {
  const params: any[] = [];
  let where = "";
  if (shopId) {
    params.push(shopId);
    where = "WHERE e.shop_id = $1";
  }
  return query<EmployeeRow>(
    `SELECT e.id, e.shop_id, s.name AS shop_name, e.name, e.position, e.base_salary,
            to_char(e.hired_on, 'YYYY-MM-DD') AS hired_on,
            (SELECT MAX(period) FROM salaries sl WHERE sl.employee_id = e.id) AS last_paid
     FROM employees e JOIN shops s ON s.id = e.shop_id
     ${where} ORDER BY s.id, e.name`,
    params
  );
}

export type SalaryRow = {
  id: number;
  period: string;
  amount: number;
  bonus: number;
  note: string | null;
  paid_on: string;
  employee: string;
  position: string;
  shop_name: string;
  paid_by: string | null;
};

export async function salaryHistory(opts: { shopId?: number; period?: string; limit?: number } = {}) {
  const params: any[] = [];
  const conds: string[] = [];
  if (opts.shopId) {
    params.push(opts.shopId);
    conds.push(`sl.shop_id = $${params.length}`);
  }
  if (opts.period && /^\d{4}-\d{2}$/.test(opts.period)) {
    params.push(opts.period);
    conds.push(`sl.period = $${params.length}`);
  }
  params.push(opts.limit ?? 100);
  return query<SalaryRow>(
    `SELECT sl.id, sl.period, sl.amount, sl.bonus, sl.note,
            to_char(sl.created_at, 'YYYY-MM-DD') AS paid_on,
            e.name AS employee, e.position, s.name AS shop_name, u.name AS paid_by
     FROM salaries sl
     JOIN employees e ON e.id = sl.employee_id
     JOIN shops s ON s.id = sl.shop_id
     LEFT JOIN users u ON u.id = sl.paid_by
     ${conds.length ? "WHERE " + conds.join(" AND ") : ""}
     ORDER BY sl.period DESC, sl.created_at DESC LIMIT $${params.length}`,
    params
  );
}

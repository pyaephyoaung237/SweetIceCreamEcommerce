import { query, queryOne } from "./db";
import type { Product } from "./types";

export const PRODUCT_SELECT = `
  SELECT p.id, p.name, p.description, p.price, p.discount_percent,
         ROUND(p.price * (100 - p.discount_percent) / 100.0, 2) AS final_price,
         p.image_url, p.stock, p.is_top, p.category_id, c.name AS category_name,
         p.shop_id, s.name AS shop_name
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
  JOIN shops s ON s.id = p.shop_id`;

export type ProductFilter = {
  q?: string;
  categoryId?: number;
  shopId?: number;
  onSale?: boolean;
  topOnly?: boolean;
  sort?: string;
  limit?: number;
};

export async function listProducts(f: ProductFilter = {}): Promise<Product[]> {
  const where: string[] = [];
  const params: any[] = [];
  if (f.q) {
    params.push(`%${f.q}%`);
    where.push(`(p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`);
  }
  if (f.categoryId) {
    params.push(f.categoryId);
    where.push(`p.category_id = $${params.length}`);
  }
  if (f.shopId) {
    params.push(f.shopId);
    where.push(`p.shop_id = $${params.length}`);
  }
  if (f.onSale) where.push(`p.discount_percent > 0`);
  if (f.topOnly) where.push(`p.is_top = true`);

  const order =
    f.sort === "price_asc"
      ? "final_price ASC"
      : f.sort === "price_desc"
      ? "final_price DESC"
      : f.sort === "discount"
      ? "p.discount_percent DESC, p.id DESC"
      : "p.is_top DESC, p.id DESC";

  params.push(f.limit ?? 60);
  return query<Product>(
    `${PRODUCT_SELECT} ${where.length ? "WHERE " + where.join(" AND ") : ""}
     ORDER BY ${order} LIMIT $${params.length}`,
    params
  );
}

export async function getProduct(id: number): Promise<Product | null> {
  return queryOne<Product>(`${PRODUCT_SELECT} WHERE p.id = $1`, [id]);
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_percent: number;
  image_url: string | null;
  category_id: number | null;
  category_name: string | null;
  status: 'available' | 'unavailable' | 'hidden';
}

export const finalPrice = (p: Pick<Product, 'price' | 'discount_percent'>) =>
  Number(p.price) * (1 - (p.discount_percent || 0) / 100);

export const formatMMK = (n: number) => `${Math.round(n).toLocaleString()} MMK`;
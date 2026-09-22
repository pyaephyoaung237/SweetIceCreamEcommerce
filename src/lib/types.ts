export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_percent: number;
  final_price: number;
  image_url: string | null;
  stock: number;
  is_top: boolean;
  category_id: number | null;
  category_name: string | null;
  shop_id: number;
  shop_name: string;
};

export type Shop = { id: number; name: string; slug: string; city: string; phone: string | null };
export type Category = { id: number; name: string; slug: string };

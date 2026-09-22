/**
 * Creates all tables and fills them with demo data.
 * Run with:  npm run db:setup      (WARNING: drops existing Pedalworks tables)
 */
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Client } from "../node_modules/@types/pg";
import bcrypt from "bcryptjs";

dotenv.config({ path: ".env.local" });
dotenv.config();

// small deterministic random generator so the demo data is the same every time
let seed = 42;
function rand(): number {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing. Copy .env.example to .env.local and edit it.");
  }
  const db = new Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();

  console.log("Creating tables...");
  await db.query(fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8"));

  // ---- shops ----
  const shopRows = [
    ["Shop 1 Downtown", "shop-1", "12 Market Street, Downtown", "+1 555 0101"],
    ["Shop 2 Riverside", "shop-2", "48 River Road, Riverside", "+1 555 0102"],
    ["Shop 3 Hilltop", "shop-3", "7 Summit Avenue, Hilltop", "+1 555 0103"],
  ];
  const shopIds: number[] = [];
  for (const s of shopRows) {
    const r = await db.query("INSERT INTO shops (name, slug, city, phone) VALUES ($1,$2,$3,$4) RETURNING id", s);
    shopIds.push(r.rows[0].id);
  }

  // ---- users: admin, 3 shop supervisors, customers ----
  const hash = (p: string) => bcrypt.hashSync(p, 10);
  await db.query("INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,'admin')", [
    "Alex Admin", "admin@pedalworks.com", hash("Admin@123"),
  ]);
  const supervisors: number[] = [];
  const supNames = ["Sam Shopone", "Riley Shoptwo", "Jordan Shopthree"];
  for (let i = 0; i < 3; i++) {
    const r = await db.query(
      "INSERT INTO users (name, email, password_hash, role, shop_id) VALUES ($1,$2,$3,'supervisor',$4) RETURNING id",
      [supNames[i], `shop${i + 1}@pedalworks.com`, hash("Shop@123"), shopIds[i]]
    );
    supervisors.push(r.rows[0].id);
  }
  const customers: { id: number; name: string }[] = [];
  const custNames = ["Demo Customer", "Maya Lopez", "Ben Carter", "Nina Patel", "Tom Fischer"];
  for (let i = 0; i < custNames.length; i++) {
    const email = i === 0 ? "user@example.com" : `${custNames[i].split(" ")[0].toLowerCase()}@example.com`;
    const r = await db.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,'customer') RETURNING id",
      [custNames[i], email, hash("User@123")]
    );
    customers.push({ id: r.rows[0].id, name: custNames[i] });
  }

  // ---- categories ----
  const catNames = ["Road", "Mountain", "City", "Electric", "Kids", "Accessories"];
  const cat: Record<string, number> = {};
  for (const n of catNames) {
    const r = await db.query("INSERT INTO categories (name, slug) VALUES ($1,$2) RETURNING id", [
      n, n.toLowerCase(),
    ]);
    cat[n] = r.rows[0].id;
  }

  // ---- products: [name, category, shopIndex, price, discount, stock, top, image, description] ----
  const products: [string, string, number, number, number, number, boolean, string, string][] = [
    ["Aero R1 Road Bike", "Road", 0, 1290, 10, 40, true, "road-blue", "Lightweight aluminium frame, 22-speed groupset and carbon fork. Built for fast weekend rides and club runs."],
    ["Trail X Pro", "Mountain", 0, 1490, 0, 40, true, "mtb-green", "29-inch hardtail with front suspension, hydraulic disc brakes and wide tyres for rough trails."],
    ["Urban Glide", "City", 0, 690, 15, 40, false, "city-teal", "Upright city bike with mudguards, front basket and a comfortable saddle for daily commuting."],
    ["Sprout 20 Kids Bike", "Kids", 0, 320, 0, 40, false, "kids-yellow", "20-inch kids bike with easy-reach brakes and a chain guard. Fits ages 6 to 9."],
    ["Sprint SL Road Bike", "Road", 1, 1590, 5, 40, true, "road-red", "Race-ready geometry, disc brakes and a stiff frame for climbing and sprinting."],
    ["Ridge 29 Mountain Bike", "Mountain", 1, 1190, 20, 40, false, "mtb-orange", "Reliable trail bike with 100 mm of suspension travel and a 1x11 drivetrain."],
    ["Commuter Classic", "City", 1, 540, 0, 40, false, "city-sand", "A simple 7-speed town bike with a rack, lights and a step-through frame."],
    ["Volt E-City", "Electric", 1, 2190, 8, 40, true, "electric-slate", "Electric city bike with a 60 km range, integrated battery and hub motor."],
    ["Aero Helmet", "Accessories", 1, 79, 0, 100, false, "helmet", "Ventilated helmet with adjustable fit and rear light."],
    ["Gravel Nomad", "Road", 2, 1390, 12, 40, true, "gravel-olive", "Drop-bar gravel bike with clearance for wide tyres and mounts for bags and bottles."],
    ["Volt E-Trail", "Electric", 2, 2890, 0, 40, false, "electric-slate", "Electric mountain bike with a mid-drive motor and 500 Wh battery."],
    ["Steel U-Lock Pro", "Accessories", 2, 49, 25, 100, false, "lock", "Hardened steel U-lock with two keys and a frame mount."],
    ["Balance 12 Kids Bike", "Kids", 2, 180, 10, 40, false, "kids-yellow", "Pedal-free balance bike that teaches balance before pedals. Ages 2 to 4."],
  ];
  const prodInfo: { id: number; shopId: number; catId: number; name: string; price: number }[] = [];
  for (const [name, c, si, price, disc, stock, top, img, desc] of products) {
    const r = await db.query(
      `INSERT INTO products (name, description, price, discount_percent, image_url, category_id, shop_id, stock, is_top)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [name, desc, price, disc, `/bikes/${img}.svg`, cat[c], shopIds[si], stock, top]
    );
    prodInfo.push({
      id: r.rows[0].id,
      shopId: shopIds[si],
      catId: cat[c],
      name,
      price: Math.round(price * (100 - disc)) / 100,
    });
  }

  // ---- 90 days of demo orders ----
  for (let i = 0; i < 140; i++) {
    const customer = pick(customers);
    const daysAgo = Math.floor(rand() * 90);
    const lines = Array.from({ length: 1 + Math.floor(rand() * 3) }, () => {
      const p = pick(prodInfo);
      return { p, qty: 1 + Math.floor(rand() * (p.price < 200 ? 3 : 2)) };
    });
    const total = lines.reduce((n, l) => n + l.p.price * l.qty, 0);
    const o = await db.query(
      `INSERT INTO orders (user_id, customer_name, address, total, created_at)
       VALUES ($1,$2,$3,$4, now() - make_interval(days => $5::int, mins => $6::int)) RETURNING id`,
      [customer.id, customer.name, "221 Demo Street", Math.round(total * 100) / 100, daysAgo, Math.floor(rand() * 600)]
    );
    for (const l of lines) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, product_name, category_id, shop_id, quantity, unit_price, line_total)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [o.rows[0].id, l.p.id, l.p.name, l.p.catId, l.p.shopId, l.qty, l.p.price, Math.round(l.p.price * l.qty * 100) / 100]
      );
    }
  }

  // ---- employees + last two months of salaries ----
  const staff: [string, number][][] = [
    [["Dana Wheeler|Head mechanic", 2800], ["Eli Brooks|Sales associate", 2100], ["Fay Ortiz|Cashier", 1900]],
    [["Gus Miller|Head mechanic", 2900], ["Hana Kim|Sales associate", 2200], ["Ian Rossi|Store assistant", 1800], ["Jules Adams|Cashier", 1900]],
    [["Kai Nguyen|Head mechanic", 2750], ["Lena Berg|Sales associate", 2050], ["Milo Cruz|Store assistant", 1750]],
  ];
  const now = new Date();
  const periods = [1, 2].map((back) => {
    const d = new Date(now.getFullYear(), now.getMonth() - back, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  for (let s = 0; s < 3; s++) {
    for (const [label, salary] of staff[s]) {
      const [name, position] = label.split("|");
      const e = await db.query(
        "INSERT INTO employees (shop_id, name, position, base_salary, hired_on) VALUES ($1,$2,$3,$4, CURRENT_DATE - $5::int) RETURNING id",
        [shopIds[s], name, position, salary, 120 + Math.floor(rand() * 900)]
      );
      for (const period of periods) {
        const bonus = rand() > 0.7 ? 150 : 0;
        await db.query(
          `INSERT INTO salaries (employee_id, shop_id, period, amount, bonus, note, paid_by) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [e.rows[0].id, shopIds[s], period, salary, bonus, bonus ? "Sales target bonus" : null, supervisors[s]]
        );
      }
    }
  }

  await db.end();
  console.log("\nDone. Demo logins:");
  console.log("  Admin        admin@pedalworks.com   Admin@123");
  console.log("  Shop 1/2/3   shop1@pedalworks.com   Shop@123   (also shop2@..., shop3@...)");
  console.log("  Customer     user@example.com       User@123");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

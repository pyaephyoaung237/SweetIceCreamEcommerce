# Pedalworks: bike shop e-commerce

Full-stack bike shop with **Next.js 14 (App Router)**, **TypeScript**, **PostgreSQL** and **Tailwind CSS**.
Three shops sell bikes. Each shop has a supervisor account, and one admin sees everything.

## Roles

| Role | Login | Can do |
|------|-------|--------|
| **Admin** | `admin@pedalworks.com` / `Admin@123` | Upload bikes (photo, price, discount, stock), mark **top products**, see **all shops' sales** with shop / category / date filters, open each shop to see its **supervisor account**, employees and **salary payments** |
| **Shop 1 / 2 / 3 supervisor** | `shop1@pedalworks.com`, `shop2@...`, `shop3@...` / `Shop@123` | See only their own shop's sales, manage employees, **view and give salaries** (the admin can see every payment) |
| **Customer** | `user@example.com` / `User@123` (or sign up) | Browse, filter, add to cart, check out, see own orders |

## Quick start

You need Node.js 18.17+ and PostgreSQL.

```bash
# 1. create an empty database
createdb pedalworks            # or use pgAdmin / any client

# 2. configure
cp .env.example .env.local     # then edit DATABASE_URL and AUTH_SECRET

# 3. install, create tables + demo data, run
npm install
npm run db:setup               # WARNING: drops and recreates the Pedalworks tables
npm run dev                    # http://localhost:3000
```

For production: `npm run build && npm start`.

## Where things are

```
db/schema.sql              tables (shops, users, categories, products, orders, order_items, employees, salaries)
scripts/setup-db.ts        creates tables and seeds demo data (3 shops, 13 bikes, 140 orders, staff, salaries)
src/middleware.ts          blocks /admin, /supervisor, /account for the wrong role
src/lib/                   db pool, login cookie (JWT), sales and payroll queries
src/app/actions/           server actions: login, products (upload), checkout, salaries
src/app/(public pages)     /, /shop, /product/[id], /cart, /login, /register, /account/orders
src/app/admin/             overview, products, sales, shops (+ shop detail), salaries
src/app/supervisor/        overview, sales, employees, pay salaries
uploads/                   bike photos uploaded by the admin (created automatically)
```

## Notes

- **Uploaded photos** are saved in `./uploads` and served from `/api/uploads/...`. On a host with a temporary disk (Vercel and similar), switch `saveProduct` in `src/app/actions/products.ts` to S3, Cloudinary or another object store.
- **Checkout is a demo**: no payment is taken. Orders are stored, stock goes down, and sales appear in the admin and shop reports. Prices are always re-read from the database, never trusted from the browser.
- **Security**: passwords are hashed with bcrypt, sessions are signed HTTP-only cookies, every admin/supervisor page and action re-checks the role on the server, and a supervisor can only ever read or pay their own shop.
- Set `COOKIE_SECURE=true` in `.env.local` when serving over HTTPS.
- Change the currency with `NEXT_PUBLIC_CURRENCY` (for example `EUR`, `GBP`, `THB`).
- Colours live in `tailwind.config.ts` (`ink`, `paper`, `cobalt`, `sprint`, `pine`).

-- =========================================================
-- ICE CREAM DELIVERY & SHOP - DATABASE SCHEMA (PostgreSQL 13+)
-- Roles: 'admin', 'user' (Branch staff/managers are users linked via employees)
-- =========================================================

-- Enable pgcrypto extension for automatic bcrypt hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS
    salaries,
    reviews,
    favourites,
    deliveries,
    payments,
    order_items,
    orders,
    cart_items,
    carts,
    addresses,
    employees,
    branch_products,
    products,
    categories,
    users,
    branches
CASCADE;


-- =========================================================
-- 1. BRANCHES
-- =========================================================
CREATE TABLE branches (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    slug        TEXT UNIQUE NOT NULL,
    city        TEXT NOT NULL,
    address     TEXT NOT NULL,
    phone       TEXT,
    latitude    NUMERIC(10,7),
    longitude   NUMERIC(10,7),
    status      TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'inactive')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- =========================================================
-- 2. USERS
-- admin = owner / system administrator
-- user  = customer or employee
-- =========================================================
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    email           TEXT UNIQUE NOT NULL,
    phone           TEXT,
    password_hash   TEXT NOT NULL,

    role            TEXT NOT NULL DEFAULT 'user'
                    CHECK (role IN ('admin', 'user')),

    status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'inactive')),

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX users_role_idx ON users(role);


-- =========================================================
-- 3. CATEGORIES
-- =========================================================
CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    name        TEXT UNIQUE NOT NULL,
    slug        TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    image_url   TEXT,
    status      TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'inactive')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- =========================================================
-- 4. PRODUCTS
-- =========================================================
CREATE TABLE products (
    id                 SERIAL PRIMARY KEY,
    name               TEXT NOT NULL,
    slug               TEXT UNIQUE NOT NULL,
    description        TEXT NOT NULL DEFAULT '',
    price              NUMERIC(10,2) NOT NULL
                       CHECK (price >= 0),
    discount_percent   INT NOT NULL DEFAULT 0
                       CHECK (discount_percent BETWEEN 0 AND 90),
    image_url          TEXT,
    category_id        INT REFERENCES categories(id)
                       ON DELETE SET NULL,
    status             TEXT NOT NULL DEFAULT 'available'
                       CHECK (status IN ('available', 'unavailable', 'hidden')),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX products_category_idx ON products(category_id);


-- =========================================================
-- 5. BRANCH PRODUCT / STOCK
-- =========================================================
CREATE TABLE branch_products (
    id                    SERIAL PRIMARY KEY,
    branch_id             INT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    product_id            INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    stock                 INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    low_stock_threshold   INT NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
    price                 NUMERIC(10,2) CHECK (price >= 0),
    status                TEXT NOT NULL DEFAULT 'available'
                          CHECK (status IN ('available', 'unavailable')),
    UNIQUE (branch_id, product_id)
);

CREATE INDEX branch_products_branch_idx ON branch_products(branch_id);
CREATE INDEX branch_products_product_idx ON branch_products(product_id);


-- =========================================================
-- 6. EMPLOYEES (Links a User to a Branch & Position/Salary)
-- =========================================================
CREATE TABLE employees (
    id          SERIAL PRIMARY KEY,
    user_id     INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    branch_id   INT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    position    TEXT NOT NULL, -- e.g., 'Branch Manager', 'Cashier', 'Delivery Staff'
    base_salary NUMERIC(12,2) NOT NULL CHECK (base_salary >= 0),
    hired_on    DATE NOT NULL DEFAULT CURRENT_DATE,
    status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

CREATE INDEX employees_branch_idx ON employees(branch_id);


-- =========================================================
-- 7. SALARIES
-- =========================================================
CREATE TABLE salaries (
    id            SERIAL PRIMARY KEY,
    employee_id   INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    branch_id     INT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    period        TEXT NOT NULL CHECK (period ~ '^[0-9]{4}-[0-9]{2}$'),
    amount        NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    bonus         NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (bonus >= 0),
    note          TEXT,
    paid_by       INT REFERENCES users(id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (employee_id, period)
);

CREATE INDEX salaries_branch_idx ON salaries(branch_id);
CREATE INDEX salaries_period_idx ON salaries(period);


-- =========================================================
-- 8. CUSTOMER ADDRESSES
-- =========================================================
CREATE TABLE addresses (
    id          SERIAL PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    phone       TEXT NOT NULL,
    address     TEXT NOT NULL,
    city        TEXT NOT NULL,
    township    TEXT,
    latitude    NUMERIC(10,7),
    longitude   NUMERIC(10,7),
    is_default  BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX addresses_user_idx ON addresses(user_id);


-- =========================================================
-- 9. CART & CART ITEMS
-- =========================================================
CREATE TABLE carts (
    id          SERIAL PRIMARY KEY,
    user_id     INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cart_items (
    id          SERIAL PRIMARY KEY,
    cart_id     INT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id  INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity    INT NOT NULL CHECK (quantity > 0),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (cart_id, product_id)
);

CREATE INDEX cart_items_cart_idx ON cart_items(cart_id);


-- =========================================================
-- 10. FAVOURITES
-- =========================================================
CREATE TABLE favourites (
    id          SERIAL PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id  INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, product_id)
);

CREATE INDEX favourites_product_idx ON favourites(product_id);


-- =========================================================
-- 11. ORDERS
-- =========================================================
CREATE TABLE orders (
    id              SERIAL PRIMARY KEY,
    order_number    TEXT UNIQUE NOT NULL,
    user_id         INT REFERENCES users(id) ON DELETE SET NULL,
    branch_id       INT NOT NULL REFERENCES branches(id),
    order_type      TEXT NOT NULL CHECK (order_type IN ('shop', 'delivery')),
    status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled')),
    payment_status  TEXT NOT NULL DEFAULT 'pending'
                    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    customer_name   TEXT NOT NULL,
    customer_phone  TEXT NOT NULL,
    subtotal        NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
    delivery_fee    NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
    discount        NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
    total           NUMERIC(12,2) NOT NULL CHECK (total >= 0),
    note            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX orders_user_idx ON orders(user_id);
CREATE INDEX orders_branch_idx ON orders(branch_id);
CREATE INDEX orders_status_idx ON orders(status);


-- =========================================================
-- 12. ORDER ITEMS
-- =========================================================
CREATE TABLE order_items (
    id              SERIAL PRIMARY KEY,
    order_id        INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id      INT REFERENCES products(id) ON DELETE SET NULL,
    product_name    TEXT NOT NULL,
    category_id     INT REFERENCES categories(id) ON DELETE SET NULL,
    branch_id       INT NOT NULL REFERENCES branches(id),
    quantity        INT NOT NULL CHECK (quantity > 0),
    unit_price      NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    discount        NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
    line_total      NUMERIC(12,2) NOT NULL CHECK (line_total >= 0)
);

CREATE INDEX order_items_order_idx ON order_items(order_id);


-- =========================================================
-- 13. PAYMENTS
-- =========================================================
CREATE TABLE payments (
    id              SERIAL PRIMARY KEY,
    order_id        INT UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_method  TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'kbz_pay', 'aya_pay', 'wave_pay')),
    transaction_id  TEXT,
    amount          NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    paid_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX payments_status_idx ON payments(status);


-- =========================================================
-- 14. DELIVERIES
-- =========================================================
CREATE TABLE deliveries (
    id                  SERIAL PRIMARY KEY,
    order_id            INT UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    address_id          INT REFERENCES addresses(id) ON DELETE SET NULL,
    delivery_person_id  INT REFERENCES users(id) ON DELETE SET NULL,
    status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'assigned', 'picked_up', 'out_for_delivery', 'delivered', 'failed')),
    delivery_address    TEXT NOT NULL,
    customer_phone      TEXT NOT NULL,
    latitude            NUMERIC(10,7),
    longitude           NUMERIC(10,7),
    assigned_at         TIMESTAMPTZ,
    picked_up_at        TIMESTAMPTZ,
    delivered_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX deliveries_status_idx ON deliveries(status);


-- =========================================================
-- 15. REVIEWS
-- =========================================================
CREATE TABLE reviews (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id      INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    order_id        INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    taste_rating    INT NOT NULL CHECK (taste_rating BETWEEN 1 AND 5),
    amount_rating   INT NOT NULL CHECK (amount_rating BETWEEN 1 AND 5),
    comment         TEXT,
    status          TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, product_id, order_id)
);

CREATE INDEX reviews_product_idx ON reviews(product_id);



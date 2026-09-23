-- 0. Enable pgcrypto extension for automatic bcrypt hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Clear out all tables safely in the correct dependency order using CASCADE
TRUNCATE TABLE 
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
RESTART IDENTITY CASCADE;

-- =========================================================
-- 1. SEED BRANCHES
-- =========================================================
INSERT INTO branches (id, name, slug, city, address, phone, status) VALUES 
(1, 'Ice Cream Central', 'central', 'Mandalay', '78th Street, Between 34x35', '09123456789', 'active'),
(2, 'Ice Cream North', 'north', 'Mandalay', 'Chan Mya Thar Zi Township', '09987654321', 'active');

-- =========================================================
-- 2. SEED USERS 
-- Role constraints: 'admin', 'user'
-- =========================================================
INSERT INTO users (id, name, email, phone, password_hash, role, status) VALUES 
(1, 'System Admin', 'admin@gmail.com', '09911111111', crypt('admin123', gen_salt('bf')), 'admin', 'active'),
(2, 'Central Branch Manager', 'branch1@gmail.com', '09922222222', crypt('admin123', gen_salt('bf')), 'user', 'active'),
(3, 'Test Customer', 'customer@gmail.com', '09933333333', crypt('admin123', gen_salt('bf')), 'user', 'active');

-- =========================================================
-- 3. SEED EMPLOYEES (Assigns branch1@gmail.com as Manager of Branch 1)
-- =========================================================
INSERT INTO employees (user_id, branch_id, position, base_salary, status) VALUES 
(2, 1, 'Branch Manager', 500000.00, 'active');

-- =========================================================
-- 4. SEED CATEGORIES
-- =========================================================
INSERT INTO categories (id, name, slug, description, status) VALUES 
(1, 'Scoops', 'scoops', 'Classic single and double ice cream scoops', 'active'),
(2, 'Sundaes', 'sundaes', 'Loaded ice cream sundaes with toppings', 'active'),
(3, 'Milkshakes', 'milkshakes', 'Creamy blended ice cream drinks', 'active');

-- =========================================================
-- 5. SEED PRODUCTS
-- =========================================================
INSERT INTO products (id, name, slug, description, price, discount_percent, category_id, status) VALUES 
(1, 'Vanilla Bean Scoop', 'vanilla-bean-scoop', 'Rich natural vanilla bean ice cream', 3500.00, 0, 1, 'available'),
(2, 'Dark Chocolate Sundae', 'dark-chocolate-sundae', 'Deep chocolate ice cream with fudge sauce', 6000.00, 10, 2, 'available'),
(3, 'Strawberry Milkshake', 'strawberry-milkshake', 'Fresh strawberry blended milkshake', 4500.00, 0, 3, 'available');

-- =========================================================
-- 6. SEED BRANCH PRODUCTS (Stock allocation per branch)
-- =========================================================
INSERT INTO branch_products (branch_id, product_id, stock, low_stock_threshold, price, status) VALUES 
(1, 1, 50, 5, 3500.00, 'available'),
(1, 2, 30, 5, 6000.00, 'available'),
(1, 3, 20, 5, 4500.00, 'available'),
(2, 1, 40, 5, 3500.00, 'available'),
(2, 2, 15, 5, 6000.00, 'available');
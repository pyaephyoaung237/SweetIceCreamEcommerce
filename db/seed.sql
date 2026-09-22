TRUNCATE TABLE users, categories, shops RESTART IDENTITY CASCADE;
-- 1. Insert Shops first
INSERT INTO shops (id, name, slug, city, phone) VALUES 
(1, 'Pedalworks Central', 'central', 'Mandalay', '09123456789'),
(2, 'Pedalworks North', 'north', 'Mandalay', '09987654321'),
(3, 'Pedalworks South', 'south', 'Yangon', '09456789123');

-- 2. Insert Categories
INSERT INTO categories (id, name, slug) VALUES 
(1, 'Mountain Bikes', 'mountain-bikes'),
(2, 'Road Bikes', 'road-bikes'),
(3, 'Electric Bikes', 'electric-bikes');

-- 3. Insert Users last (shops now exist)
INSERT INTO users (name, email, password_hash, role, shop_id) VALUES 
('System Admin', 'admin@gmail.com', 'admin123', 'admin', NULL),
('Shop 1 Supervisor', 'shop1@gmail.com', 'shop123', 'supervisor', 1),
('Shop 2 Supervisor', 'shop2@gmail.com', 'shop123', 'supervisor', 2),
('Shop 3 Supervisor', 'shop3@gmail.com', 'shop123', 'supervisor', 3);
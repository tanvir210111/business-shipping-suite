-- ==========================================================
-- Business Shipping Suite - Production Database Seed DML
-- Pre-generated Seed for MySQL 8.0+
-- ==========================================================

-- Admin User: admin@businessshipping.com / Admin@123
INSERT INTO users (id, name, email, password_hash, role, avatar, created_at, last_login)
VALUES (1, 'Captain David Vance', 'admin@businessshipping.com', '$2a$10$wE9mN5E8N2MvH2tI4P8Q8O7N4k5K6L7M8N9O0P1Q2R3S4T5U6V7W8', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '2025-12-01 08:00:00', '2026-10-03 09:30:00')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO businesses (id, name, logo, timezone, currency)
VALUES (1, 'Business Shipping Suite - Main Fleet', 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=150', 'America/New_York', 'USD')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO business_users (id, business_id, user_id, role)
VALUES (1, 1, 1, 'admin')
ON DUPLICATE KEY UPDATE role=VALUES(role);

INSERT INTO pages (id, business_id, name, handle, category, followers)
VALUES 
  (1, 1, 'Express Freight Line', '@expressfreight', 'Maritime Logistics & Cargo', 28540),
  (2, 1, 'Priority Air Cargo', '@priorityair', 'Aviation Cargo & Express', 12380),
  (3, 1, 'Oceanic Commerce Fleet', '@oceaniccommerce', 'Global Deepsea Shipping', 7340)
ON DUPLICATE KEY UPDATE followers=VALUES(followers);

-- (For full historical data import of 276 days, run: npm run seed)

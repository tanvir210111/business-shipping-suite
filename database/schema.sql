-- ==========================================================
-- Business Shipping Suite - Production Database Schema
-- Exactly 19 Normalized Relational Tables with Indexes
-- ==========================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'viewer') DEFAULT 'admin',
    avatar VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Businesses Table
CREATE TABLE IF NOT EXISTS businesses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(500) DEFAULT NULL,
    timezone VARCHAR(100) DEFAULT 'UTC',
    currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Business Users Mapping Table
CREATE TABLE IF NOT EXISTS business_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    user_id INT NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_bus_usr (business_id, user_id),
    CONSTRAINT fk_bu_business FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    CONSTRAINT fk_bu_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Pages / Shipping Channels Table
CREATE TABLE IF NOT EXISTS pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    handle VARCHAR(100) NOT NULL,
    category VARCHAR(100) DEFAULT 'Logistics & Supply Chain',
    followers INT DEFAULT 0,
    avatar VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_page_business (business_id),
    CONSTRAINT fk_page_business FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Daily Analytics Table (2026-01-01 to 2026-10-03 Time Series)
CREATE TABLE IF NOT EXISTS daily_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    page_id INT DEFAULT NULL,
    date DATE NOT NULL,
    reach INT NOT NULL DEFAULT 0,
    impressions INT NOT NULL DEFAULT 0,
    engagement INT NOT NULL DEFAULT 0,
    likes INT NOT NULL DEFAULT 0,
    comments INT NOT NULL DEFAULT 0,
    shares INT NOT NULL DEFAULT 0,
    followers INT NOT NULL DEFAULT 0,
    new_followers INT NOT NULL DEFAULT 0,
    unfollows INT NOT NULL DEFAULT 0,
    profile_visits INT NOT NULL DEFAULT 0,
    content_views INT NOT NULL DEFAULT 0,
    video_views INT NOT NULL DEFAULT 0,
    link_clicks INT NOT NULL DEFAULT 0,
    messages INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_business_date_page (business_id, date, page_id),
    INDEX idx_daily_bus_date (business_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Earnings Table
CREATE TABLE IF NOT EXISTS earnings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    estimated_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    source VARCHAR(100) DEFAULT 'Shipping Suite Monetization',
    content_id INT DEFAULT NULL,
    platform VARCHAR(50) DEFAULT 'Web Platform',
    country VARCHAR(50) DEFAULT 'US',
    status ENUM('estimated', 'pending', 'paid') DEFAULT 'estimated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_earnings_bus_date (business_id, date),
    INDEX idx_earnings_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Content Table
CREATE TABLE IF NOT EXISTS content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    content_type ENUM('post', 'reel', 'story', 'video', 'photo', 'link') DEFAULT 'post',
    thumbnail VARCHAR(500) DEFAULT NULL,
    published_at DATETIME NOT NULL,
    status ENUM('published', 'scheduled', 'draft', 'archived') DEFAULT 'published',
    platform VARCHAR(50) DEFAULT 'Shipping Suite',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_content_bus_pub (business_id, published_at),
    INDEX idx_content_type (content_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Content Metrics Table
CREATE TABLE IF NOT EXISTS content_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_id INT NOT NULL,
    date DATE NOT NULL,
    reach INT NOT NULL DEFAULT 0,
    impressions INT NOT NULL DEFAULT 0,
    views INT NOT NULL DEFAULT 0,
    likes INT NOT NULL DEFAULT 0,
    comments INT NOT NULL DEFAULT 0,
    shares INT NOT NULL DEFAULT 0,
    saves INT NOT NULL DEFAULT 0,
    clicks INT NOT NULL DEFAULT 0,
    engagement INT NOT NULL DEFAULT 0,
    watch_time INT NOT NULL DEFAULT 0, -- in seconds
    earnings DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cm_content_date (content_id, date),
    CONSTRAINT fk_cm_content FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Audience Metrics Table
CREATE TABLE IF NOT EXISTS audience_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    date DATE NOT NULL,
    total_followers INT NOT NULL DEFAULT 0,
    net_growth INT NOT NULL DEFAULT 0,
    men_percent DECIMAL(5,2) DEFAULT 58.40,
    women_percent DECIMAL(5,2) DEFAULT 41.60,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_aud_bus_date (business_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Audience Countries Table
CREATE TABLE IF NOT EXISTS audience_countries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    country_code VARCHAR(10) NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    follower_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_aud_ctry_bus (business_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Audience Age Groups Table
CREATE TABLE IF NOT EXISTS audience_age_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    age_bracket VARCHAR(20) NOT NULL,
    male_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    female_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    total_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_aud_age_bus (business_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Audience Gender Table
CREATE TABLE IF NOT EXISTS audience_gender (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_aud_gnd_bus (business_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Platform Metrics Table
CREATE TABLE IF NOT EXISTS platform_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    date DATE NOT NULL,
    platform VARCHAR(100) NOT NULL,
    reach INT NOT NULL DEFAULT 0,
    engagement INT NOT NULL DEFAULT 0,
    earnings DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_plat_bus_date (business_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_avatar VARCHAR(500) DEFAULT NULL,
    last_message TEXT NOT NULL,
    status ENUM('unread', 'read', 'archived') DEFAULT 'unread',
    response_time_minutes INT DEFAULT 12,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_msg_bus_status (business_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Message Replies Table
CREATE TABLE IF NOT EXISTS message_replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id INT NOT NULL,
    sender_type ENUM('user', 'customer') NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reply_msg (message_id),
    CONSTRAINT fk_mr_message FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('alert', 'system', 'milestone', 'earnings') DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notif_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    date_range VARCHAR(100) NOT NULL,
    metrics_json TEXT NOT NULL,
    content_types_json TEXT NOT NULL,
    file_format VARCHAR(20) DEFAULT 'CSV',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_rep_bus (business_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Payouts Table
CREATE TABLE IF NOT EXISTS payouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    payout_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status ENUM('paid', 'processing', 'scheduled') DEFAULT 'paid',
    method VARCHAR(100) DEFAULT 'Direct Bank Deposit (ACH)',
    reference_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_payouts_bus (business_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    theme ENUM('light', 'dark', 'system') DEFAULT 'system',
    email_alerts BOOLEAN DEFAULT TRUE,
    weekly_digest BOOLEAN DEFAULT TRUE,
    currency VARCHAR(10) DEFAULT 'USD',
    timezone VARCHAR(100) DEFAULT 'America/New_York',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

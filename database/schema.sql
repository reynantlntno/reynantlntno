-- DATABASE CREATION
-- Replace if needed with your actual database name
-- CREATE DATABASE IF NOT EXISTS `u725458043_rtlntnodev`;
-- USE `u725458043_rtlntnodev`;

-- CONTENT TABLE (Flexible content storage for About section and other dynamic content)
CREATE TABLE `t_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL COMMENT 'Content type (about, resume, etc.)',
  `title` varchar(255) DEFAULT NULL,
  `content` mediumtext NOT NULL COMMENT 'Stores markdown, JSON or plain text',
  `format` varchar(20) NOT NULL COMMENT 'markdown, json, text',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_content_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SKILLS TABLE
CREATE TABLE `t_skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL COMMENT 'frontend, backend, database, etc.',
  `proficiency` tinyint NOT NULL COMMENT '1-10 rating',
  `icon` varchar(255) DEFAULT NULL COMMENT 'URL or icon identifier',
  `description` text,
  `display_order` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_skills_category` (`category`),
  KEY `idx_skills_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BLOG POSTS TABLE
CREATE TABLE `t_blog_posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `summary` text,
  `content` mediumtext NOT NULL COMMENT 'Markdown content',
  `image_url` varchar(255) DEFAULT NULL,
  `published` boolean NOT NULL DEFAULT false,
  `published_at` datetime DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text,
  `tags` json DEFAULT NULL COMMENT 'Store tags as JSON array',
  `read_time` int DEFAULT NULL COMMENT 'Reading time in minutes',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_blog_posts_slug` (`slug`),
  KEY `idx_blog_posts_published` (`published`),
  KEY `idx_blog_posts_published_at` (`published_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PROJECTS TABLE
CREATE TABLE `t_projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `content` mediumtext COMMENT 'Detailed description (markdown)',
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `github_url` varchar(255) DEFAULT NULL,
  `demo_url` varchar(255) DEFAULT NULL,
  `technologies` json DEFAULT NULL COMMENT 'JSON array of technologies used',
  `featured` boolean NOT NULL DEFAULT false,
  `display_order` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_projects_slug` (`slug`),
  KEY `idx_projects_featured` (`featured`),
  KEY `idx_projects_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PROJECT IMAGES TABLE (Multiple images per project)
CREATE TABLE `t_project_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `display_order` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_project_images_order` (`display_order`),
  CONSTRAINT `fk_project_images_project_id` FOREIGN KEY (`project_id`) 
    REFERENCES `t_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- APPOINTMENT SLOTS TABLE (For recurring or specific slots)
CREATE TABLE `t_appointment_slots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `day_of_week` tinyint DEFAULT NULL COMMENT 'NULL for specific date, 0-6 for recurring (0=Sunday)',
  `specific_date` date DEFAULT NULL COMMENT 'NULL for recurring slots',
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `capacity` int NOT NULL DEFAULT 1,
  `is_active` boolean NOT NULL DEFAULT true,
  `recurring` boolean NOT NULL DEFAULT false,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_appointment_slots_day` (`day_of_week`),
  KEY `idx_appointment_slots_date` (`specific_date`),
  KEY `idx_appointment_slots_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- APPOINTMENTS TABLE (Actual bookings)
CREATE TABLE `t_appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slot_id` int NOT NULL,
  `appointment_date` date NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text,
  `reference_code` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending' COMMENT 'pending, confirmed, cancelled, completed',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_appointments_reference` (`reference_code`),
  KEY `idx_appointments_date` (`appointment_date`),
  KEY `idx_appointments_status` (`status`),
  KEY `idx_appointments_email` (`email`),
  CONSTRAINT `fk_appointments_slot_id` FOREIGN KEY (`slot_id`) 
    REFERENCES `t_appointment_slots` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE `t_newsletter_subscribers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `subscribed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) NOT NULL DEFAULT 'active' COMMENT 'active, unsubscribed',
  `unsubscribed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_newsletter_subscribers_email` (`email`),
  KEY `idx_newsletter_subscribers_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CONTACT MESSAGES TABLE
CREATE TABLE `t_contact_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `read` boolean NOT NULL DEFAULT false,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contact_messages_read` (`read`),
  KEY `idx_contact_messages_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- API KEYS TABLE (For third-party access)
CREATE TABLE `t_api_keys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `key_value` varchar(255) NOT NULL,
  `scopes` json NOT NULL COMMENT 'JSON formatted scope configuration',
  `is_active` boolean NOT NULL DEFAULT true,
  `expires_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_used_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_api_keys_key_value` (`key_value`),
  KEY `idx_api_keys_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- API REQUESTS LOG TABLE (For rate limiting and monitoring)
CREATE TABLE `t_api_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `api_key_id` int DEFAULT NULL,
  `endpoint` varchar(255) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `status_code` smallint NOT NULL,
  `response_time` int DEFAULT NULL COMMENT 'in milliseconds',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_api_requests_key_id` (`api_key_id`),
  KEY `idx_api_requests_endpoint` (`endpoint`),
  KEY `idx_api_requests_ip_address` (`ip_address`),
  KEY `idx_api_requests_created_at` (`created_at`),
  CONSTRAINT `fk_api_requests_api_key_id` FOREIGN KEY (`api_key_id`) 
    REFERENCES `t_api_keys` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
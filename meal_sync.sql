-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 07, 2026 at 07:03 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `meal_sync`
--

-- --------------------------------------------------------

--
-- Table structure for table `alergies`
--

CREATE TABLE `alergies` (
  `id` bigint(20) NOT NULL,
  `alergy_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alergies`
--

INSERT INTO `alergies` (`id`, `alergy_name`) VALUES
(1, 'Cereale care conțin gluten'),
(2, 'Crustacee'),
(3, 'Ouă'),
(4, 'Pește'),
(5, 'Arahide'),
(6, 'Soia'),
(7, 'Lapte'),
(8, 'Fructe cu coajă lemnoasă (nuci)'),
(9, 'Țelină'),
(10, 'Muștar'),
(11, 'Semințe de susan'),
(12, 'Dioxid de sulf și sulfiți'),
(13, 'Lupin'),
(14, 'Moluște');

-- --------------------------------------------------------

--
-- Table structure for table `coupon_types`
--

CREATE TABLE `coupon_types` (
  `id` bigint(20) NOT NULL,
  `coupon_name` varchar(100) NOT NULL,
  `discount_percent` int(11) DEFAULT NULL,
  `discount_fixed` double DEFAULT NULL,
  `loyalty_cost` int(11) NOT NULL,
  `expiry_days` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupon_types`
--

INSERT INTO `coupon_types` (`id`, `coupon_name`, `discount_percent`, `discount_fixed`, `loyalty_cost`, `expiry_days`) VALUES
(1, '-10% Off Order', 10, NULL, 25, 30),
(2, '-20% Off Order', 20, NULL, 45, 30),
(3, '-30% Off Order', 30, NULL, 60, 30);

-- --------------------------------------------------------

--
-- Table structure for table `diets`
--

CREATE TABLE `diets` (
  `id` bigint(20) NOT NULL,
  `vegan_flag` bigint(20) DEFAULT 0,
  `description` varchar(255) DEFAULT NULL,
  `diet_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `diets`
--

INSERT INTO `diets` (`id`, `vegan_flag`, `description`, `diet_name`) VALUES
(1, 0, 'A complete weekly diet combining both protein-rich and plant-based menus.', 'Balanced Weekly Diet');

-- --------------------------------------------------------

--
-- Table structure for table `diet_menus`
--

CREATE TABLE `diet_menus` (
  `id` bigint(20) NOT NULL,
  `diet_id` bigint(20) NOT NULL,
  `menu_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `diet_menus`
--

INSERT INTO `diet_menus` (`id`, `diet_id`, `menu_id`) VALUES
(1, 1, 1),
(2, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `meals`
--

CREATE TABLE `meals` (
  `id` bigint(20) NOT NULL,
  `calories` bigint(20) DEFAULT NULL,
  `vegan_flag` tinyint(1) DEFAULT 0,
  `price` double DEFAULT NULL,
  `discount` int(11) DEFAULT 0,
  `delivery_cost` double DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `meal_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meals`
--

INSERT INTO `meals` (`id`, `calories`, `vegan_flag`, `price`, `discount`, `delivery_cost`, `image_url`, `description`, `meal_name`) VALUES
(1, 520, 0, 32, 0, 5, '/uploads/meals/meal1.jpg', 'Tender grilled chicken with quinoa and roasted vegetables.', 'Grilled Chicken Bowl'),
(2, 410, 1, 28, 0, 5, '/uploads/meals/meal2.jpg', 'Chickpeas, avocado, brown rice and tahini dressing.', 'Vegan Buddha Bowl'),
(3, 480, 0, 38, 15, 5, '/uploads/meals/meal3.jpg', 'Pan-seared salmon fillet with steamed broccoli and spinach.', 'Salmon & Greens'),
(4, 390, 0, 25, 25, 5, '/uploads/meals/meal4.jpg', 'Whole wheat wrap with lean turkey, lettuce and hummus.', 'Turkey Wrap'),
(5, 310, 1, 20, 0, 5, '/uploads/meals/meal5.jpg', 'Hearty red lentil soup with cumin and fresh herbs.', 'Lentil Soup'),
(6, 280, 0, 22.5, 0, 5, '/uploads/meals/meal6.jpg', 'Fluffy egg white omelette with spinach, tomatoes and feta.', 'Egg White Omelette'),
(7, 612, 0, 66, 0, 5, '/uploads/meals/1774172884979.jpg', 'test', 'test meal');

-- --------------------------------------------------------

--
-- Table structure for table `meal_alergies`
--

CREATE TABLE `meal_alergies` (
  `id` bigint(20) NOT NULL,
  `meal_id` bigint(20) NOT NULL,
  `alergy_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meal_alergies`
--

INSERT INTO `meal_alergies` (`id`, `meal_id`, `alergy_id`) VALUES
(11, 1, 3),
(12, 1, 11),
(15, 2, 14);

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` bigint(20) NOT NULL,
  `vegan_flag` bigint(20) DEFAULT 0,
  `price` double DEFAULT NULL,
  `discount` int(11) DEFAULT 0,
  `delivery_cost` double DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `menu_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `vegan_flag`, `price`, `discount`, `delivery_cost`, `image_url`, `description`, `menu_name`) VALUES
(1, 0, 85, 0, 5, NULL, 'A selection of high-protein meals for muscle building and recovery.', 'High Protein Plan'),
(2, 1, 75, 10, 5, NULL, 'Fully plant-based meals for a clean and light diet.', 'Plant Based Plan');

-- --------------------------------------------------------

--
-- Table structure for table `menu_meals`
--

CREATE TABLE `menu_meals` (
  `id` bigint(20) NOT NULL,
  `menu_id` bigint(20) NOT NULL,
  `meal_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_meals`
--

INSERT INTO `menu_meals` (`id`, `menu_id`, `meal_id`) VALUES
(1, 1, 1),
(2, 1, 3),
(3, 1, 4),
(13, 2, 2),
(14, 2, 5),
(15, 2, 6);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `user_coupon_id` bigint(20) DEFAULT NULL,
  `total_price` double NOT NULL,
  `delivery_cost` double NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `user_coupon_id`, `total_price`, `delivery_cost`, `created_at`) VALUES
(2, 1, NULL, 85, 5, '2026-03-14 17:04:25'),
(3, 1, NULL, 99.8, 10, '2026-03-14 17:19:36'),
(4, 1, NULL, 170, 5, '2026-03-22 10:32:27'),
(5, 1, NULL, 255, 5, '2026-03-22 10:32:35'),
(6, 1, 1, 60.75, 5, '2026-03-22 10:33:00'),
(7, 1, NULL, 255, 5, '2026-03-22 10:33:14'),
(8, 2, NULL, 66, 5, '2026-03-22 12:14:12');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `meal_id` bigint(20) DEFAULT NULL,
  `menu_id` bigint(20) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `item_price` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `meal_id`, `menu_id`, `quantity`, `item_price`) VALUES
(2, 2, NULL, 1, 1, 85),
(3, 3, 3, NULL, 1, 32.3),
(4, 3, NULL, 2, 1, 67.5),
(5, 4, NULL, 1, 2, 85),
(6, 5, NULL, 1, 3, 85),
(7, 6, NULL, 2, 1, 67.5),
(8, 7, NULL, 1, 3, 85),
(9, 8, 7, NULL, 1, 66);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL,
  `role_name` varchar(100) NOT NULL,
  `role_permission` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `role_permission`) VALUES
(1, 'client', 1),
(2, 'admin', 99);

-- --------------------------------------------------------

--
-- Table structure for table `subscription_menus`
--

CREATE TABLE `subscription_menus` (
  `id` bigint(20) NOT NULL,
  `user_subscription_id` bigint(20) NOT NULL,
  `menu_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subscription_menus`
--

INSERT INTO `subscription_menus` (`id`, `user_subscription_id`, `menu_id`) VALUES
(2, 1, 2),
(3, 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `subscription_plans`
--

CREATE TABLE `subscription_plans` (
  `id` bigint(20) NOT NULL,
  `subscription_type_id` bigint(20) NOT NULL,
  `duration_months` int(11) NOT NULL,
  `discount_percent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subscription_plans`
--

INSERT INTO `subscription_plans` (`id`, `subscription_type_id`, `duration_months`, `discount_percent`) VALUES
(1, 1, 1, 0),
(2, 1, 3, 10),
(3, 1, 6, 15),
(4, 1, 12, 25),
(5, 2, 1, 0),
(6, 2, 3, 10),
(7, 2, 6, 15),
(8, 2, 12, 25);

-- --------------------------------------------------------

--
-- Table structure for table `subscription_types`
--

CREATE TABLE `subscription_types` (
  `id` bigint(20) NOT NULL,
  `type_name` varchar(50) NOT NULL,
  `price_per_month` double NOT NULL,
  `daily_loyalty_points` int(11) NOT NULL,
  `max_daily_menus` int(11) NOT NULL,
  `delivery_discount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subscription_types`
--

INSERT INTO `subscription_types` (`id`, `type_name`, `price_per_month`, `daily_loyalty_points`, `max_daily_menus`, `delivery_discount`) VALUES
(1, 'Premium', 99, 10, 1, 50),
(2, 'Platinum', 179, 25, 3, 100);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `login_user` varchar(100) NOT NULL,
  `login_password` varchar(255) NOT NULL,
  `role` bigint(20) NOT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `user_surname` varchar(100) DEFAULT NULL,
  `user_age` int(11) DEFAULT NULL,
  `user_email` varchar(150) DEFAULT NULL,
  `user_address` varchar(255) DEFAULT NULL,
  `loyalty_points` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `login_user`, `login_password`, `role`, `user_name`, `user_surname`, `user_age`, `user_email`, `user_address`, `loyalty_points`) VALUES
(1, 'test', '$2b$10$iYHe8cbDb7337HenZ2PZuu/Oi/jx1NQ6q8VgknvAWZQJ6rGyAO.HK', 1, 'test', 'test', 22, 'test@test.test', 'test test test', 5),
(2, 'admin', '$2b$10$HAwOp9Eda3p4BydNxSfWmOgjaYxvAqgGD9d9/2dCAjRNhBSHmg83a', 2, 'admin', 'admin', 99, 'admin@admin.com', 'admin', 7);

-- --------------------------------------------------------

--
-- Table structure for table `user_alergies`
--

CREATE TABLE `user_alergies` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `alergy_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_alergies`
--

INSERT INTO `user_alergies` (`id`, `user_id`, `alergy_id`) VALUES
(3, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `user_coupons`
--

CREATE TABLE `user_coupons` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `coupon_type_id` bigint(20) NOT NULL,
  `redeemed_at` datetime NOT NULL DEFAULT current_timestamp(),
  `expires_at` datetime NOT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  `used_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_coupons`
--

INSERT INTO `user_coupons` (`id`, `user_id`, `coupon_type_id`, `redeemed_at`, `expires_at`, `is_used`, `used_at`) VALUES
(1, 1, 1, '2026-03-22 10:32:37', '2026-04-21 10:32:37', 1, '2026-03-22 10:33:00'),
(2, 1, 2, '2026-03-22 10:42:53', '2026-04-21 10:42:53', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_diets`
--

CREATE TABLE `user_diets` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `diet_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_subscriptions`
--

CREATE TABLE `user_subscriptions` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `plan_id` bigint(20) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_subscriptions`
--

INSERT INTO `user_subscriptions` (`id`, `user_id`, `plan_id`, `start_date`, `end_date`, `is_active`) VALUES
(1, 1, 1, '2026-03-22', '2026-04-22', 0),
(2, 1, 1, '2026-03-22', '2026-04-22', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alergies`
--
ALTER TABLE `alergies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coupon_types`
--
ALTER TABLE `coupon_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `diets`
--
ALTER TABLE `diets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `diet_menus`
--
ALTER TABLE `diet_menus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `diet_id` (`diet_id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Indexes for table `meals`
--
ALTER TABLE `meals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `meal_alergies`
--
ALTER TABLE `meal_alergies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `meal_id` (`meal_id`),
  ADD KEY `alergy_id` (`alergy_id`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menu_meals`
--
ALTER TABLE `menu_meals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menu_id` (`menu_id`),
  ADD KEY `meal_id` (`meal_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `user_coupon_id` (`user_coupon_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `meal_id` (`meal_id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscription_menus`
--
ALTER TABLE `subscription_menus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_subscription_id` (`user_subscription_id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Indexes for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subscription_type_id` (`subscription_type_id`);

--
-- Indexes for table `subscription_types`
--
ALTER TABLE `subscription_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role` (`role`);

--
-- Indexes for table `user_alergies`
--
ALTER TABLE `user_alergies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `alergy_id` (`alergy_id`);

--
-- Indexes for table `user_coupons`
--
ALTER TABLE `user_coupons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `coupon_type_id` (`coupon_type_id`);

--
-- Indexes for table `user_diets`
--
ALTER TABLE `user_diets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `diet_id` (`diet_id`);

--
-- Indexes for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `plan_id` (`plan_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alergies`
--
ALTER TABLE `alergies`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `coupon_types`
--
ALTER TABLE `coupon_types`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `diets`
--
ALTER TABLE `diets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `diet_menus`
--
ALTER TABLE `diet_menus`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `meals`
--
ALTER TABLE `meals`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `meal_alergies`
--
ALTER TABLE `meal_alergies`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `menu_meals`
--
ALTER TABLE `menu_meals`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `subscription_menus`
--
ALTER TABLE `subscription_menus`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `subscription_types`
--
ALTER TABLE `subscription_types`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_alergies`
--
ALTER TABLE `user_alergies`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_coupons`
--
ALTER TABLE `user_coupons`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_diets`
--
ALTER TABLE `user_diets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `diet_menus`
--
ALTER TABLE `diet_menus`
  ADD CONSTRAINT `diet_menus_ibfk_1` FOREIGN KEY (`diet_id`) REFERENCES `diets` (`id`),
  ADD CONSTRAINT `diet_menus_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`);

--
-- Constraints for table `meal_alergies`
--
ALTER TABLE `meal_alergies`
  ADD CONSTRAINT `meal_alergies_ibfk_1` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`),
  ADD CONSTRAINT `meal_alergies_ibfk_2` FOREIGN KEY (`alergy_id`) REFERENCES `alergies` (`id`);

--
-- Constraints for table `menu_meals`
--
ALTER TABLE `menu_meals`
  ADD CONSTRAINT `menu_meals_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`),
  ADD CONSTRAINT `menu_meals_ibfk_2` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`user_coupon_id`) REFERENCES `user_coupons` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`),
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`);

--
-- Constraints for table `subscription_menus`
--
ALTER TABLE `subscription_menus`
  ADD CONSTRAINT `subscription_menus_ibfk_1` FOREIGN KEY (`user_subscription_id`) REFERENCES `user_subscriptions` (`id`),
  ADD CONSTRAINT `subscription_menus_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`);

--
-- Constraints for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  ADD CONSTRAINT `subscription_plans_ibfk_1` FOREIGN KEY (`subscription_type_id`) REFERENCES `subscription_types` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role`) REFERENCES `roles` (`id`);

--
-- Constraints for table `user_alergies`
--
ALTER TABLE `user_alergies`
  ADD CONSTRAINT `user_alergies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_alergies_ibfk_2` FOREIGN KEY (`alergy_id`) REFERENCES `alergies` (`id`);

--
-- Constraints for table `user_coupons`
--
ALTER TABLE `user_coupons`
  ADD CONSTRAINT `user_coupons_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_coupons_ibfk_2` FOREIGN KEY (`coupon_type_id`) REFERENCES `coupon_types` (`id`);

--
-- Constraints for table `user_diets`
--
ALTER TABLE `user_diets`
  ADD CONSTRAINT `user_diets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_diets_ibfk_2` FOREIGN KEY (`diet_id`) REFERENCES `diets` (`id`);

--
-- Constraints for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  ADD CONSTRAINT `user_subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_subscriptions_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

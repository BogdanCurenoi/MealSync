-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gazdă: 127.0.0.1
-- Timp de generare: mart. 15, 2026 la 01:45 PM
-- Versiune server: 10.4.32-MariaDB
-- Versiune PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Bază de date: `meal_sync`
--

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `alergies`
--

CREATE TABLE `alergies` (
  `id` bigint(20) NOT NULL,
  `alergy_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Eliminarea datelor din tabel `alergies`
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
-- Structură tabel pentru tabel `coupon_types`
--

CREATE TABLE `coupon_types` (
  `id` bigint(20) NOT NULL,
  `coupon_name` varchar(100) NOT NULL,
  `discount_percent` int(11) DEFAULT NULL,
  `discount_fixed` double DEFAULT NULL,
  `loyalty_cost` int(11) NOT NULL,
  `expiry_days` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `diets`
--

CREATE TABLE `diets` (
  `id` bigint(20) NOT NULL,
  `vegan_flag` bigint(20) DEFAULT 0,
  `description` varchar(255) DEFAULT NULL,
  `diet_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Eliminarea datelor din tabel `diets`
--

INSERT INTO `diets` (`id`, `vegan_flag`, `description`, `diet_name`) VALUES
(1, 0, 'A complete weekly diet combining both protein-rich and plant-based menus.', 'Balanced Weekly Diet');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `diet_menus`
--

CREATE TABLE `diet_menus` (
  `id` bigint(20) NOT NULL,
  `diet_id` bigint(20) NOT NULL,
  `menu_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Eliminarea datelor din tabel `diet_menus`
--

INSERT INTO `diet_menus` (`id`, `diet_id`, `menu_id`) VALUES
(1, 1, 1),
(2, 1, 2);

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `meals`
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
-- Eliminarea datelor din tabel `meals`
--

INSERT INTO `meals` (`id`, `calories`, `vegan_flag`, `price`, `discount`, `delivery_cost`, `image_url`, `description`, `meal_name`) VALUES
(1, 520, 0, 32, 0, 5, '/uploads/meals/meal1.jpg', 'Tender grilled chicken with quinoa and roasted vegetables.', 'Grilled Chicken Bowl'),
(2, 410, 1, 28, 0, 5, '/uploads/meals/meal2.jpg', 'Chickpeas, avocado, brown rice and tahini dressing.', 'Vegan Buddha Bowl'),
(3, 480, 0, 38, 15, 5, '/uploads/meals/meal3.jpg', 'Pan-seared salmon fillet with steamed broccoli and spinach.', 'Salmon & Greens'),
(4, 390, 0, 25, 25, 5, '/uploads/meals/meal4.jpg', 'Whole wheat wrap with lean turkey, lettuce and hummus.', 'Turkey Wrap'),
(5, 310, 1, 20, 0, 5, '/uploads/meals/meal5.jpg', 'Hearty red lentil soup with cumin and fresh herbs.', 'Lentil Soup'),
(6, 280, 0, 22, 0, 5, '/uploads/meals/meal6.jpg', 'Fluffy egg white omelette with spinach, tomatoes and feta.', 'Egg White Omelette');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `meal_alergies`
--

CREATE TABLE `meal_alergies` (
  `id` bigint(20) NOT NULL,
  `meal_id` bigint(20) NOT NULL,
  `alergy_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Eliminarea datelor din tabel `meal_alergies`
--

INSERT INTO `meal_alergies` (`id`, `meal_id`, `alergy_id`) VALUES
(1, 1, 1),
(2, 1, 2);

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `menus`
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
-- Eliminarea datelor din tabel `menus`
--

INSERT INTO `menus` (`id`, `vegan_flag`, `price`, `discount`, `delivery_cost`, `image_url`, `description`, `menu_name`) VALUES
(1, 0, 85, 0, 5, NULL, 'A selection of high-protein meals for muscle building and recovery.', 'High Protein Plan'),
(2, 1, 75, 10, 5, NULL, 'Fully plant-based meals for a clean and light diet.', 'Plant Based Plan');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `menu_meals`
--

CREATE TABLE `menu_meals` (
  `id` bigint(20) NOT NULL,
  `menu_id` bigint(20) NOT NULL,
  `meal_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Eliminarea datelor din tabel `menu_meals`
--

INSERT INTO `menu_meals` (`id`, `menu_id`, `meal_id`) VALUES
(1, 1, 1),
(2, 1, 3),
(3, 1, 4),
(4, 2, 2),
(5, 2, 5),
(6, 2, 6);

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `orders`
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
-- Eliminarea datelor din tabel `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `user_coupon_id`, `total_price`, `delivery_cost`, `created_at`) VALUES
(2, 1, NULL, 85, 5, '2026-03-14 17:04:25'),
(3, 1, NULL, 99.8, 10, '2026-03-14 17:19:36');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `order_items`
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
-- Eliminarea datelor din tabel `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `meal_id`, `menu_id`, `quantity`, `item_price`) VALUES
(2, 2, NULL, 1, 1, 85),
(3, 3, 3, NULL, 1, 32.3),
(4, 3, NULL, 2, 1, 67.5);

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL,
  `role_name` varchar(100) NOT NULL,
  `role_permission` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Eliminarea datelor din tabel `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `role_permission`) VALUES
(1, 'client', 1),
(2, 'admin', 99);

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `subscription_menus`
--

CREATE TABLE `subscription_menus` (
  `id` bigint(20) NOT NULL,
  `user_subscription_id` bigint(20) NOT NULL,
  `menu_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `subscription_plans`
--

CREATE TABLE `subscription_plans` (
  `id` bigint(20) NOT NULL,
  `subscription_type_id` bigint(20) NOT NULL,
  `duration_months` int(11) NOT NULL,
  `discount_percent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `subscription_types`
--

CREATE TABLE `subscription_types` (
  `id` bigint(20) NOT NULL,
  `type_name` varchar(50) NOT NULL,
  `price_per_month` double NOT NULL,
  `daily_loyalty_points` int(11) NOT NULL,
  `max_daily_menus` int(11) NOT NULL,
  `delivery_discount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `users`
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
-- Eliminarea datelor din tabel `users`
--

INSERT INTO `users` (`id`, `login_user`, `login_password`, `role`, `user_name`, `user_surname`, `user_age`, `user_email`, `user_address`, `loyalty_points`) VALUES
(1, 'test', '$2b$10$iYHe8cbDb7337HenZ2PZuu/Oi/jx1NQ6q8VgknvAWZQJ6rGyAO.HK', 1, 'test', 'test', 22, 'test@test.test', 'test test test', 0);

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `user_alergies`
--

CREATE TABLE `user_alergies` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `alergy_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Eliminarea datelor din tabel `user_alergies`
--

INSERT INTO `user_alergies` (`id`, `user_id`, `alergy_id`) VALUES
(3, 1, 2);

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `user_coupons`
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

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `user_diets`
--

CREATE TABLE `user_diets` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `diet_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `user_subscriptions`
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
-- Indexuri pentru tabele eliminate
--

--
-- Indexuri pentru tabele `alergies`
--
ALTER TABLE `alergies`
  ADD PRIMARY KEY (`id`);

--
-- Indexuri pentru tabele `coupon_types`
--
ALTER TABLE `coupon_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexuri pentru tabele `diets`
--
ALTER TABLE `diets`
  ADD PRIMARY KEY (`id`);

--
-- Indexuri pentru tabele `diet_menus`
--
ALTER TABLE `diet_menus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `diet_id` (`diet_id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Indexuri pentru tabele `meals`
--
ALTER TABLE `meals`
  ADD PRIMARY KEY (`id`);

--
-- Indexuri pentru tabele `meal_alergies`
--
ALTER TABLE `meal_alergies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `meal_id` (`meal_id`),
  ADD KEY `alergy_id` (`alergy_id`);

--
-- Indexuri pentru tabele `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`);

--
-- Indexuri pentru tabele `menu_meals`
--
ALTER TABLE `menu_meals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menu_id` (`menu_id`),
  ADD KEY `meal_id` (`meal_id`);

--
-- Indexuri pentru tabele `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `user_coupon_id` (`user_coupon_id`);

--
-- Indexuri pentru tabele `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `meal_id` (`meal_id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Indexuri pentru tabele `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexuri pentru tabele `subscription_menus`
--
ALTER TABLE `subscription_menus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_subscription_id` (`user_subscription_id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Indexuri pentru tabele `subscription_plans`
--
ALTER TABLE `subscription_plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subscription_type_id` (`subscription_type_id`);

--
-- Indexuri pentru tabele `subscription_types`
--
ALTER TABLE `subscription_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexuri pentru tabele `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role` (`role`);

--
-- Indexuri pentru tabele `user_alergies`
--
ALTER TABLE `user_alergies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `alergy_id` (`alergy_id`);

--
-- Indexuri pentru tabele `user_coupons`
--
ALTER TABLE `user_coupons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `coupon_type_id` (`coupon_type_id`);

--
-- Indexuri pentru tabele `user_diets`
--
ALTER TABLE `user_diets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `diet_id` (`diet_id`);

--
-- Indexuri pentru tabele `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `plan_id` (`plan_id`);

--
-- AUTO_INCREMENT pentru tabele eliminate
--

--
-- AUTO_INCREMENT pentru tabele `alergies`
--
ALTER TABLE `alergies`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pentru tabele `coupon_types`
--
ALTER TABLE `coupon_types`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pentru tabele `diets`
--
ALTER TABLE `diets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pentru tabele `diet_menus`
--
ALTER TABLE `diet_menus`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pentru tabele `meals`
--
ALTER TABLE `meals`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pentru tabele `meal_alergies`
--
ALTER TABLE `meal_alergies`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pentru tabele `menus`
--
ALTER TABLE `menus`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pentru tabele `menu_meals`
--
ALTER TABLE `menu_meals`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pentru tabele `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pentru tabele `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pentru tabele `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pentru tabele `subscription_menus`
--
ALTER TABLE `subscription_menus`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pentru tabele `subscription_plans`
--
ALTER TABLE `subscription_plans`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pentru tabele `subscription_types`
--
ALTER TABLE `subscription_types`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pentru tabele `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pentru tabele `user_alergies`
--
ALTER TABLE `user_alergies`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pentru tabele `user_coupons`
--
ALTER TABLE `user_coupons`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pentru tabele `user_diets`
--
ALTER TABLE `user_diets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pentru tabele `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constrângeri pentru tabele eliminate
--

--
-- Constrângeri pentru tabele `diet_menus`
--
ALTER TABLE `diet_menus`
  ADD CONSTRAINT `diet_menus_ibfk_1` FOREIGN KEY (`diet_id`) REFERENCES `diets` (`id`),
  ADD CONSTRAINT `diet_menus_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`);

--
-- Constrângeri pentru tabele `meal_alergies`
--
ALTER TABLE `meal_alergies`
  ADD CONSTRAINT `meal_alergies_ibfk_1` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`),
  ADD CONSTRAINT `meal_alergies_ibfk_2` FOREIGN KEY (`alergy_id`) REFERENCES `alergies` (`id`);

--
-- Constrângeri pentru tabele `menu_meals`
--
ALTER TABLE `menu_meals`
  ADD CONSTRAINT `menu_meals_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`),
  ADD CONSTRAINT `menu_meals_ibfk_2` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`);

--
-- Constrângeri pentru tabele `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`user_coupon_id`) REFERENCES `user_coupons` (`id`);

--
-- Constrângeri pentru tabele `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`),
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`);

--
-- Constrângeri pentru tabele `subscription_menus`
--
ALTER TABLE `subscription_menus`
  ADD CONSTRAINT `subscription_menus_ibfk_1` FOREIGN KEY (`user_subscription_id`) REFERENCES `user_subscriptions` (`id`),
  ADD CONSTRAINT `subscription_menus_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`);

--
-- Constrângeri pentru tabele `subscription_plans`
--
ALTER TABLE `subscription_plans`
  ADD CONSTRAINT `subscription_plans_ibfk_1` FOREIGN KEY (`subscription_type_id`) REFERENCES `subscription_types` (`id`);

--
-- Constrângeri pentru tabele `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role`) REFERENCES `roles` (`id`);

--
-- Constrângeri pentru tabele `user_alergies`
--
ALTER TABLE `user_alergies`
  ADD CONSTRAINT `user_alergies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_alergies_ibfk_2` FOREIGN KEY (`alergy_id`) REFERENCES `alergies` (`id`);

--
-- Constrângeri pentru tabele `user_coupons`
--
ALTER TABLE `user_coupons`
  ADD CONSTRAINT `user_coupons_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_coupons_ibfk_2` FOREIGN KEY (`coupon_type_id`) REFERENCES `coupon_types` (`id`);

--
-- Constrângeri pentru tabele `user_diets`
--
ALTER TABLE `user_diets`
  ADD CONSTRAINT `user_diets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_diets_ibfk_2` FOREIGN KEY (`diet_id`) REFERENCES `diets` (`id`);

--
-- Constrângeri pentru tabele `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  ADD CONSTRAINT `user_subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_subscriptions_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

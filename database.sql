CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL,
    role_permission BIGINT NOT NULL
);

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    login_user VARCHAR(100) NOT NULL,
    login_password VARCHAR(255) NOT NULL,
    role BIGINT NOT NULL,
    user_name VARCHAR(100),
    user_surname VARCHAR(100),
    user_age INT,
    user_email VARCHAR(150),
    user_address VARCHAR(255),
    loyalty_points INT DEFAULT 0,
    FOREIGN KEY (role) REFERENCES roles(id)
);

CREATE TABLE alergies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    alergy_name VARCHAR(100) NOT NULL
);

CREATE TABLE meals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    calories BIGINT,
    vegan_flag BOOLEAN DEFAULT FALSE,
    price DOUBLE PRECISION,
    discount INT DEFAULT 0,
    delivery_cost DOUBLE PRECISION
);

CREATE TABLE meal_alergies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    meal_id BIGINT NOT NULL,
    alergy_id BIGINT NOT NULL,
    FOREIGN KEY (meal_id) REFERENCES meals(id),
    FOREIGN KEY (alergy_id) REFERENCES alergies(id)
);

CREATE TABLE user_alergies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    alergy_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (alergy_id) REFERENCES alergies(id)
);

CREATE TABLE menus (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vegan_flag BIGINT DEFAULT 0,
    price DOUBLE PRECISION,
    discount INT DEFAULT 0,
    delivery_cost DOUBLE PRECISION
);

CREATE TABLE menu_meals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    menu_id BIGINT NOT NULL,
    meal_id BIGINT NOT NULL,
    FOREIGN KEY (menu_id) REFERENCES menus(id),
    FOREIGN KEY (meal_id) REFERENCES meals(id)
);

CREATE TABLE diets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vegan_flag BIGINT DEFAULT 0
);

CREATE TABLE diet_menus (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    diet_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    FOREIGN KEY (diet_id) REFERENCES diets(id),
    FOREIGN KEY (menu_id) REFERENCES menus(id)
);

CREATE TABLE user_diets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    diet_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (diet_id) REFERENCES diets(id)
);

CREATE TABLE subscription_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL,
    price_per_month DOUBLE PRECISION NOT NULL,
    daily_loyalty_points INT NOT NULL,
    max_daily_menus INT NOT NULL,
    delivery_discount INT NOT NULL
);

CREATE TABLE subscription_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subscription_type_id BIGINT NOT NULL,
    duration_months INT NOT NULL,
    discount_percent INT NOT NULL,
    FOREIGN KEY (subscription_type_id) REFERENCES subscription_types(id)
);

CREATE TABLE user_subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

CREATE TABLE subscription_menus (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_subscription_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    FOREIGN KEY (user_subscription_id) REFERENCES user_subscriptions(id),
    FOREIGN KEY (menu_id) REFERENCES menus(id)
);

CREATE TABLE coupon_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    coupon_name VARCHAR(100) NOT NULL,
    discount_percent INT,
    discount_fixed DOUBLE PRECISION,
    loyalty_cost INT NOT NULL,
    expiry_days INT NOT NULL
);

CREATE TABLE user_coupons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    coupon_type_id BIGINT NOT NULL,
    redeemed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (coupon_type_id) REFERENCES coupon_types(id)
);

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    user_coupon_id BIGINT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    total_price DOUBLE PRECISION NOT NULL,
    delivery_cost DOUBLE PRECISION NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (user_coupon_id) REFERENCES user_coupons(id)
);

CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    meal_id BIGINT,
    menu_id BIGINT,
    quantity INT NOT NULL DEFAULT 1,
    item_price DOUBLE PRECISION NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (meal_id) REFERENCES meals(id),
    FOREIGN KEY (menu_id) REFERENCES menus(id)
);

ALTER TABLE meals ADD COLUMN image_url VARCHAR(255);
ALTER TABLE menus ADD COLUMN image_url VARCHAR(255);

ALTER TABLE meals ADD COLUMN description VARCHAR(255);
ALTER TABLE menus ADD COLUMN description VARCHAR(255);
ALTER TABLE diets ADD COLUMN description VARCHAR(255);

ALTER TABLE meals ADD COLUMN meal_name VARCHAR(100);
ALTER TABLE menus ADD COLUMN menu_name VARCHAR(100);
ALTER TABLE diets ADD COLUMN diet_name VARCHAR(100);

ALTER TABLE orders DROP COLUMN status;
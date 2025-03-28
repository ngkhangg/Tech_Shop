CREATE DATABASE IF NOT EXISTS shop_db;
USE shop_db;

-- Bảng người dùng
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng danh mục sản phẩm
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng sản phẩm
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    category_id INT,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Bảng giỏ hàng
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Bảng đơn hàng
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
	order_number INT NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng chi tiết đơn hàng
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


INSERT INTO products (name, description, price, image, stock, category_id) VALUES

-- Chuột gaming
('Chuột gaming Logitech G102', 'Chuột gaming có đèn RGB, độ phân giải 8000DPI', 400000, 'https://product.hstatic.net/200000722513/product/logitech-g102-lightsync-rgb-black-1_bf4f5774229c4a0f81b8e8a2feebe4d8_aeb4ae49ee844c3e9d315883d4e482d4_1024x1024.jpg', 50, 1),
('Chuột Razer DeathAdder V2', 'Chuột gaming ergonomic, cảm biến 20K DPI', 1290000, 'https://product.hstatic.net/200000722513/product/chuot-gaming-da-v2-gearvn-1_59b42345fdb54b509619c7f74cdfb275_c0847dbc458942b1aba533c648341aa7_1024x1024.jpg', 30, 1),

-- Bàn phím cơ
('Bàn phím cơ Keychron K6', 'Bàn phím cơ không dây, switch Gateron Red', 2190000, 'https://owlgaming.vn/wp-content/uploads/2021/01/Keychron-K6-keyboard.jpg', 20, 2),
('Bàn phím cơ Razer BlackWidow V4 Pro Green Switch', 'Bàn phím cơ, switch Green clicky', 4990000, 'https://product.hstatic.net/200000722513/product/phim_6c19f3491c624a93acecf707c68a9cd8_137391e150d54883a044e69479533a20_84db1b13d01a4a5887432c33da001df9_1024x1024.png', 15, 2),

-- Tai nghe
('Tai nghe Sony WH-1000XM4', 'Tai nghe chống ồn chủ động, thời lượng pin 30h', 4990000, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/s/o/sony_wh-1000xm4_1.png', 10, 3),
('Tai nghe Logitech G Pro X Gaming Black', 'Tai nghe gaming, tích hợp Blue Voice', 2350000, 'https://product.hstatic.net/200000722513/product/gvn_logitech_prox_79c556630c454086baf1bee06c577ab7_3471d9d886fd4dbe8ab5ae6bed9f4d78_1024x1024.png', 20, 3),
('Tai nghe Bluetooth True Wireless Havit TW958 Pro', 'Tai nghe không dây Havit TW958 Pro sở hữu màng loa dày chắc chắn cùng công suất ổn định.', 450000, 'https://cdn-v2.didongviet.vn/files/products/2024/10/13/1/1731477536623_tai_nghe.png', 22, 3),

-- Webcam
('Webcam Logitech C920', 'Webcam Full HD 1080p, hỗ trợ livestream', 1890000, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/w/e/webcam-logitech-c920-hd-1.jpg', 15, 4),
('Webcam Razer Kiyo', 'Webcam HD 720p, có đèn LED', 2590000, 'https://product.hstatic.net/200000722513/product/arvn.com-products-webcam-razer-kiyo-1_07a3548166184401aa7c47c0885ee9e4_cabeb0a983c043c0bb7d39529b50fdba_1024x1024.jpg', 10, 4),

-- Bộ sạc
('Sạc 3 Cổng Anker 735 Nano II 65W - A2667 (Series 7)', 'Bộ sạc nhanh hỗ trợ PD và USB-C', 520000, 'https://product.hstatic.net/1000153276/product/a2667_2_a3f9bc3d24954956bbf56039b90ce280_grande.png', 40, 5),
('Củ sạc Baseus Gan3 Pro Desktop 2C-2U 100W', 'Sạc nhanh 100W, hỗ trợ laptop', 1250000, 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_1_3__6.png', 25, 5),

-- Bàn di chuột
('Bàn di chuột Razer Goliathus Xanh đen', 'Bàn di chuột gaming, kích thước 25cm x 30cm dày 4mm', 45000, 'https://hanoicomputercdn.com/media/product/77327_ban_di_chuot_razer_goliathus_xanh_den_25cm_x_30cm_day_4mm.jpg', 50, 6),
('Bàn di chuột Logitech G640', 'Bàn di chuột cỡ lớn, bề mặt mềm', 699000, 'https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g640/g640-gallery-2-new.png?v=1', 40, 6);

Select * from products;
SELECT * FROM categories;
select * from users;

INSERT INTO categories (id, name) VALUES

(1, 'Chuột gaming'),
(2, 'Bàn phím cơ'),
(3, 'Tai nghe'),
(4, 'Webcam'),
(5, 'Bộ sạc'),
(6, 'Bàn di chuột'),
(7, 'Ghế'),
(8, 'Máy chơi game cầm tay'),
(9, 'Bàn'),
(10, 'Tay cầm'),
(11, 'Máy Chơi Game Console Playstation'),
(12, 'Loa');


SET @new_auto_increment = (SELECT MAX(id) + 1 FROM users);
SET @sql = CONCAT('ALTER TABLE users AUTO_INCREMENT = ', @new_auto_increment);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

ALTER TABLE orders ADD COLUMN order_number INT NOT NULL;


INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@gmail.com', 'admin123', 'admin');




INSERT INTO orders (user_id, total_price, order_number, status)
SELECT 
    ? AS user_id,
    ? AS total_price,
    COALESCE(MAX(order_number), 0) + 1 AS order_number,
    'pending'
FROM orders 
WHERE user_id = ?;


-- Xóa dữ liệu trong order_items trước (nếu có ràng buộc khóa ngoại)
DELETE FROM order_items;
DELETE FROM orders;

-- Đặt lại ID về 1
ALTER TABLE orders AUTO_INCREMENT = 1;
ALTER TABLE order_items AUTO_INCREMENT = 1;

SELECT * FROM products WHERE category_id = 1;
DELETE FROM orders;
truncate table orders;
truncate table order_items;
select * from orders;
SELECT * FROM orders WHERE user_id = '7';
select * from order_items;

select * from products;

DELETE FROM users;
ALTER TABLE users AUTO_INCREMENT = 1;
select * from users;

SELECT * FROM categories
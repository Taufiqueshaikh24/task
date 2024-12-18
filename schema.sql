CREATE DATABASE mydatabase;
USE mydatabase;


CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    categoryId INT,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id)
);



INSERT INTO categories (name) VALUES ('Electronics');
INSERT INTO categories (name) VALUES ('Books');
INSERT INTO categories (name) VALUES ('Clothing');
INSERT INTO categories (name) VALUES ('Home Appliances');
INSERT INTO categories (name) VALUES ('Sports');




INSERT INTO products (name, categoryId, price, description) VALUES
('Smartphone', 1, 699.99, 'A high-end smartphone with a 6.5-inch display'),
('Laptop', 1, 999.99, 'A powerful laptop with 16GB RAM and 512GB SSD'),
('Fiction Book', 2, 14.99, 'A thrilling mystery novel'),
('Non-Fiction Book', 2, 19.99, 'An insightful non-fiction book on self-improvement'),
('T-Shirt', 3, 9.99, 'A comfortable cotton T-shirt'),
('Jeans', 3, 39.99, 'Stylish denim jeans'),
('Blender', 4, 49.99, 'A powerful kitchen blender'),
('Microwave', 4, 89.99, 'A compact microwave oven'),
('Soccer Ball', 5, 19.99, 'A durable soccer ball for outdoor play'),
('Tennis Racket', 5, 49.99, 'A lightweight tennis racket for beginners');

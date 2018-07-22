CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;

CREATE TABLE IF NOT EXISTS products (
	item_ID INT NOT NULL AUTO_INCREMENT
    , product_name VARCHAR(50) NOT NULL
    , department_name VARCHAR(50) NOT NULL
    , price DECIMAL(10, 2)
    , stock_quantity INT(10)
    , PRIMARY KEY (item_ID)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Echo Dot', 'electronics', 49.99, 300)
, ('Sonicare Electric Toothbrush', 'health and beauty', 99.95, 280)
, ('YETI Hopper Cooler', 'sports and outdoors', 244.99, 175)
, ('Intex Challenger Kayak', 'sports and outdoors', 47.39, 60)
, ('Worlds Okayest Employee Mug', 'home and decor', 13.00, 500)
, ('NES Classic Edition', 'electronics', 89.95, 95)
, ('Starbrite Mildew Stain Remover', 'home and decor', 10.99, 1435)
, ('Dove Men+ Care Deoderant', 'health and beauty', 8.00, 3000)
, ('Sony 85-in 4k Smart TV', 'electronics', 3998.00, 2)
, ('Bunch O Balloons, Instant Water Balloons', 'toys and games', 6.65, 480);


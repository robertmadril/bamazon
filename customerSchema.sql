DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (

    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT(6) NOT NULL,
    PRIMARY KEY(item_id)

);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Roomba", "Electronics", 99.99, 15), ("Google Home", "Electronics", 120.50, 8), ("MacBook Pro", "Electronics", 1099.99, 2), ("iPhone", "Electronics", 599.99, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Hiking Boots", "Clothing", 89.99, 20), ("T-Shirt", "Clothing", 15.99, 45), ("Socks", "Clothing", 4.99, 60);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bone", "Pet Supplies", 10.99, 40), ("Treats", "Pet Supplies", 15.99, 30), ("Leash", "Pet Supplies", 25.99, 13);
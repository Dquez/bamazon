DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;


drop table if exists products;
CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(7,2) DEFAULT 0,
  stock_quantity DECIMAL(7,0) DEFAULT 0,
  product_sales  DECIMAL(7,2) DEFAULT 0,
  PRIMARY KEY (item_id)
);
 
CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs DECIMAL(11,2)  default 0,
  PRIMARY KEY (department_id)
);
select * from products;
select * from departments;

-- query to group all the sales of each department (if there are more than one row in each department
-- SELECT department_name, SUM(product_sales) as 'product_sales'
-- FROM products GROUP BY department_name ORDER BY product_sales;
-- 
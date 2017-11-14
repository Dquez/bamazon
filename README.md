# Bamazon Node.js & MySQL Project

## Overview

In this activity, I created a virtual Amazonesque storefront using MySql and Node.js. The app performs multiple functions, each according to who the user is currently logged in as. It takes in orders from customers which depletes stock from the store's inventory *MySQL DB*. The app also has managerial tasks including:
  * View low inventory
  * Add inventory
  * Add New product
  * View highest grossing departments
  * Create new departments

## How I built it

I used MySql workbench to create the database as well as some initial products to populate my table. After I completed the basic customer search query, I worked on manipulating the DB as a manager and eventually supervisor who had more or less control over the departments. The backend was built with Node.js and I included the following packages:
* [inquirer](https://www.npmjs.com/package/inquirer)
* [cli-table](https://www.npmjs.com/package/cli-table)
* [mysql](https://www.npmjs.com/package/mysql)

Running an npm install should install all of the dependencies you need to get this project started.


Make sure you use the normal GitHub. Because this is a CLI App, there will be no need to deploy it to Heroku. This time, though, you need to include screenshots, a gif, and/or a video showing us that you got the app working with no bugs. You can include these screenshots or a link to a video in a `README.md` file.

## Main tasks

### Customer View

1. First, I created a database with a table named `products`. I filled the table 5 rows, each with their own product name, department name, price and quantity *columns in the table*.
2. All the items along with their IDs are shown. The user is then prompted to choose an ID and how many units of the product they'd like to purchase. The application then checks if your store has enough of the product to meet the customer's request.
3. If there is enough product of the customer, the SQL database updates to reflect the remaining quantity and the user is told home much $ they spent.

**Refer to Database-demo and Customer-Search files in this repo for the quick demostration of these tasks**



### Manager View
The tasks in the manager view are as follows:
    1. View Products for Sale
    2. View Low Inventory
    3. Add to Inventory
    4. Add New Product
    
* If a manager selects `View Products for Sale`, the app lists every available item along with the item IDs, names, prices, and quantities.

* If a manager selects `View Low Inventory`, the app lists all items with an inventory count lower than 20.

* If a manager selects `Add to Inventory`, the app displays a prompt that will let the manager "add more" of any item currently in the store.

* If a manager selects `Add New Product`, the manager can add a completely new product to the store.

**Refer to the Products-&-Low-Inventory, Add-Inventory, and New-Product files in this repo for a quick demo of these tasks**


### Supervisor View

1. This is where I go back into the database to create a `departments` table. It includes the columns:

   * department_id

   * department_name

   * over_head_costs (A dummy number you set for each department)

2. I modified the database to add a new column to the products table: `product_sales`. I also updated the `bamazonCustomer.js` module so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

3. Running the Supervisor view, the application will list a set of menu options:

   * View Product Sales by Department
   
   * Create New Department

4. When a supervisor selects `View Product Sales by Department`, a table appears that is the result of an inner join query that links the products and departments table on the basis of `department_name`
5. The `total_profit` column is calculated using the difference between `over_head_costs` and `product_sales`.

**Refer to the New-Department and Sales-by-Department files in this repo for a quick demo of these tasks**

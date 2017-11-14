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

#### Customer View

1. First, I created a database with a table named `products`. I filled the table 5 rows, each with their own product name, department name, price and quantity *columns in the table*.
2. All the items along with their IDs are shown. The user is then prompted to choose an ID and how many units of the product they'd like to purchase. The application then checks if your store has enough of the product to meet the customer's request.
3. If there is enough product of the customer, the SQL database updates to reflect the remaining quantity and the user is told home much $ they spent.



### Challenge #2: Manager View (Next Level)

* Create a new Node application called `bamazonManager.js`. Running this application will:

  * List a set of menu options:

    * View Products for Sale
    
    * View Low Inventory
    
    * Add to Inventory
    
    * Add New Product

  * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

  * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

  * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

  * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

- - -

* If you finished Challenge #2 and put in all the hours you were willing to spend on this activity, then rest easy! Otherwise continue to the next and final challenge.

- - -

### Challenge #3: Supervisor View (Final Level)

1. Create a new MySQL table called `departments`. Your table should include the following columns:

   * department_id

   * department_name

   * over_head_costs (A dummy number you set for each department)

2. Modify the products table so that there's a product_sales column and modify the `bamazonCustomer.js` app so that this value is updated with each individual products total revenue from each sale.

3. Modify your `bamazonCustomer.js` app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

   * Make sure your app still updates the inventory listed in the `products` column.

4. Create another Node app called `bamazonSupervisor.js`. Running this application will list a set of menu options:

   * View Product Sales by Department
   
   * Create New Department

5. When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

| department_id | department_name | over_head_costs | product_sales | total_profit |
| ------------- | --------------- | --------------- | ------------- | ------------ |
| 01            | Electronics     | 10000           | 20000         | 10000        |
| 02            | Clothing        | 60000           | 100000        | 40000        |

6. The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. You should use a custom alias.

7. If you can't get the table to display properly after a few hours, then feel free to go back and just add `total_profit` to the `departments` table.

   * Hint: You may need to look into aliases in MySQL.

   * Hint: You may need to look into GROUP BYs.

   * Hint: You may need to look into JOINS.

   * **HINT**: There may be an NPM package that can log the table to the console. What's is it? Good question :)

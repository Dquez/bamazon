var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "dariell",
    password: "password",
    database: "bamazon"
});
// bamazonManager.js
var manager = {
    manager: function () {
        inquirer
            .prompt({
                name: "menu",
                type: "list",
                message: "What task would you like to perform today?",
                choices: [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product",
                    "Come back later"
                ]
            })
            .then(function (answer) {
                switch (answer.menu) {
                    case "View Products for Sale":
                        manager.productsForSale();
                        break;

                    case "View Low Inventory":
                        manager.lowInventory();
                        break;

                    case "Add to Inventory":
                        manager.addInventory();
                        break;
                    case "Add New Product":
                        manager.newProduct();
                        break;
                    case "Come back later":
                        console.log("See you soon!");
                        connection.end();
                        break;
                }
            });
    },
    productsForSale: function () {
        console.log("Selecting all products...\n");
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            for (var i = 0; i < res.length; i++) {
                console.log("\nID: " + res[i].item_id +
                    "\nProduct: " + res[i].product_name +
                    "\nDepartment: " + res[i].department_name +
                    "\nPrice: " + res[i].stock_quantity + "\n-------------");
            }
            console.log("Taking you back to the home screen...");
            manager.manager();
        });
    },
    lowInventory: function () {
        var query = "SELECT stock_quantity, product_name FROM products WHERE stock_quantity < 20 ORDER BY stock_quantity";
        connection.query(query, function (err, res) {
            for (var i = 0; i < res.length; i++) {
                console.log("Product name: " + res[i].product_name + "\nUnits left: " + res[i].stock_quantity + "\n-------------");
            }
            inquirer
                .prompt({
                    name: "refill",
                    type: "confirm",
                    message: "Would you like to refill stock?"
                })
                .then(function (answer) {
                    if (answer.refill) {
                        manager.addInventory();

                    } else {
                        console.log("C'mon it'll take two seconds!");
                        manager.addInventory();
                    }

                });

        });
    },
    addInventory: function () {
        connection.query("Select product_name FROM products", function (err, res) {
            console.log("Products available: ");

            var productArr = [];

            for (var i = 0; i < res.length; i++) {
                productArr.push(res[i].product_name);
            }
            productArr.forEach(function (product) {
                console.log(product);
            });


            inquirer.prompt([{
                    name: "name",
                    type: "input",
                    message: "What's the name of the item you'd like to add?",
                    validate: function (product) {
                        if (productArr.indexOf(product) < 0) {
                            console.log("\nPlease make sure you used the correct name!");
                            return false;
                        }
                        return true;
                    }
                },
                {
                    name: "units",
                    type: "input",
                    message: "How many units would you like add?",
                    validate: function (value) {
                        if ((isNaN(value) === false) && (value > 0)) {
                            return true;
                        }
                        return false
                    }
                }
            ]).then(function (val) {
                var updateQuery = "UPDATE products SET stock_quantity = stock_quantity + " + parseInt(val.units) + " WHERE ?";
                // var newStock = parseInt(stock_quantity) + parseInt(val.units)
                connection.query(updateQuery, {
                    product_name: val.name
                }, function (err, res) {
                    if (err) throw err
                    console.log("Your " + val.name + " stock has been updated.\n-------------");
                    manager.manager();
                });
            });
        });
    },
    newProduct: function () {
        inquirer.prompt([{
                name: "name",
                type: "input",
                message: "Please enter product name?"
            },
            {
                name: "department",
                type: "input",
                message: "Please enter department name?"
            },
            {
                name: "quantity",
                type: "input",
                message: "Please enter the product quantity?",
                validate: function (value) {
                    if ((isNaN(value) === false) && (value > 0)) {
                        return true;
                    }
                    return false
                }
            },
            {
                name: "price",
                type: "input",
                message: "Please enter product price?",
                validate: function (value) {
                    if ((isNaN(value) === false) && (value > 0)) {
                        return true;
                    }
                    return false
                }
            }
        ]).then(function (val) {
            var query = "INSERT INTO products SET ?";
            console.log("Inserting new product...\n");
            connection.query(query, {
                    product_name: val.name,
                    department_name: val.department,
                    price: val.price,
                    stock_quantity: val.quantity
                },
                function (err) {
                    if (err) throw err;
                    console.log("Success!");
                    manager.manager();
                });
        });
    }
}
module.exports = manager;
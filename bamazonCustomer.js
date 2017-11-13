var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Your username
  user: "dariell",
  // Your password
  password: "password",
  database: "bamazon"
});
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  login();
  // connection.end();
});

//  CLI Module

function login() {

  inquirer
    .prompt({
      name: "user",
      type: "list",
      message: "Who are you logging in as today?",
      choices: [
        "Customer",
        "Manager",
        "Supervisor"
      ]
    })
    .then(function (answer) {
      switch (answer.user) {
        case "Customer":
          customerSearch();
          break;

        case "Manager":
          manager();
          break;

        case "Supervisor":
          supervisor();
          break;
      }
    });
}



//  Customer Module
function customerSearch() {
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
      message: "What is the name of the item you would like to purchase?",
      validate: function (product) {
        if (productArr.indexOf(product) < 0) {
          console.log("\nPlease make sure you used the correct name!");
          return false;
        }
        return true;
      }
    }, {
      name: "quantity",
      type: "input",
      message: "How many units would you like to purchase?",
      validate: function (value) {
        if ((isNaN(value) === false) && (value > 0)) {
          return true;
        }
        return false
      }
    }]).then(function (val) {
      var query = "SELECT product_name, stock_quantity, price FROM products WHERE ?";
      connection.query(query, {
        product_name: val.name
      }, function (err, res) {
        if (res[0].stock_quantity - val.quantity < 0) {
          console.log("Insufficient quantity! \n --------------\nThere are only " + res[0].stock_quantity + " of those left.");

          customerSearch();
        } else {
          if (val.quantity == 1) {
            console.log("There is " + val.quantity + " " + res[0].product_name + " coming right up!");
          } else {
            console.log("There are " + val.quantity + " " + res[0].product_name + "s coming right up!");
          }
          var newUnits = parseInt(res[0].stock_quantity) - parseInt(val.quantity);
          var total = parseInt(val.quantity) * parseInt(res[0].price);
          var updateQuery = "UPDATE products SET product_sales = product_sales + " + total + ", ? WHERE ?";
          connection.query(updateQuery, [{
            stock_quantity: newUnits
          }, {
            product_name: val.name
          }], function (error, result) {
            console.log("Your total will be $" + total + ".");
            console.log("Thank you for shopping with us! \n --------------");
            login();
          });
        }
      });

    });
  });
}

// bamazonManager.js

function manager() {

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
          productsForSale();
          break;

        case "View Low Inventory":
          lowInventory();
          break;

        case "Add to Inventory":
          addInventory();
          break;
        case "Add New Product":
          newProduct();
          break;
        case "Come back later":
          console.log("See you soon!");
          connection.end();
          break;
      }
    });
}

function productsForSale() {

  // If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
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
    manager();
  });
}
// 
function lowInventory() {
  var query = "SELECT stock_quantity, product_name FROM products WHERE stock_quantity < 5 ORDER BY stock_quantity";
  connection.query(query, function (err, res) {
    // console.log(res);
    for (var i = 0; i < res.length; i++) {
      console.log("Product name: " + res[i].product_name + "\nUnits left: " + res[i].stock_quantity + "\n-------------");
    }
    // console.log("---------------");
    inquirer
      .prompt({
        name: "refill",
        type: "confirm",
        message: "Would you like to refill stock?"
      })
      .then(function (answer) {
        if (answer.refill) {
          addInventory();

        } else {
          connection.end();
        }

      });
  });
}



function addInventory() {
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
        login();
      });
    });
  });
}

function newProduct() {

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
        manager();
      });
  });
}

//       // bamazonSupervisor.js
//       // View Product Sales by Department

//       // Create New Department

var Table = require('cli-table');


function supervisor() {
  inquirer
    .prompt({
      name: "menu",
      type: "list",
      message: "What task would you like to perform today?",
      choices: [
        "View product sales by department",
        "Create new department",
        "Come back later"
      ]
    })
    .then(function (answer) {
      switch (answer.menu) {
        case "View product sales by department":
          productSalesByDept();

          break;
        case "Create a new department":
          console.log("depts");
          newDepartment();
          break;
        case "Come back later":
          console.log("See you soon!");
          break;
      }
      connection.end();
    });
}



function productSalesByDept() {

  var totalSales = 0;
  var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, ";
  query += "SUM(products.product_sales) as 'product_sales', SUM(products.product_sales-departments.over_head_costs) total_profit ";
  query += "FROM products INNER JOIN departments USING (department_name) group by departments.department_id, ";
  query += " departments.over_head_costs, products.department_name";
  connection.query(query, function (err, res) {
    // if (err) throw err;
    console.log(res);
    // instantiate 
    var table = new Table({
      head: ['department_id', 'department_name', 'over_head_costs', 'product_sales', 'total_profit'],
      colWidths: [20, 20, 20, 20, 20]
    });


    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit],
      );
    }


    console.log(table.toString());
    supervisor();
  });
}


function newDepartment() {
  
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
          supervisor();
        });
    });
  }
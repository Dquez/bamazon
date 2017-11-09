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


// connection.query("Select * from products", function (err, res) {
//   for (var i =0; i < res.length; i++ ) {
//       console.log("\nProduct: " + res[i].product_name + "\nDeptartment: " + res[i].department_name + "\nPrice: " + res[i].price + "\nStock: " + res[i].stock_quantity + "\n-----------------");
//   }
//   connection.end();
// });

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


  inquirer.prompt([{

    name: "id",
    type: "input",
    message: "What is the ID of the item you would like to purchase?",
    validate: function (value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false
    }
  }, {
    name: "quantity",
    type: "input",
    message: "How many units would you like to purchase?",
    validate: function (value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false
    }
  }]).then(function (val) {
    var query = "SELECT product_name, stock_quantity, price FROM products WHERE ?";
    connection.query(query, {item_id: val.id}, function (err, res) {
      if (res[0].stock_quantity - val.quantity < 0) {
        console.log("Insufficient quantity! \n --------------");
        customerSearch();
      } else {
        if (val.quantity == 1) {
          console.log("There is " + val.quantity + " " + res[0].product_name + " coming right up!");
        } else {
          console.log("There are " + val.quantity + " " + res[0].product_name + "s coming right up!");
        }
        var newUnits = parseInt(res[0].stock_quantity) - parseInt(val.quantity);
        //might need to make new units global or within the scope of the .then function
        var total = parseInt(val.quantity) * parseInt(res[0].price);
        var updateQuery = "UPDATE products SET ? WHERE ?";
        connection.query(updateQuery, [{
          stock_quantity: newUnits
        }, {
          item_id: val.id
        }], function (error, result) {
          console.log("Your total will be $" + total + ".");
          console.log("Thank you for shopping with us! \n --------------");
          // productSales();
          login();
        });
      }
    });
  });
}


// make product sales default to INT zero
// Modify the products table so that there's a product_sales column and modify the bamazonCustomer.js app so that this value is updated with each individual products total revenue from each sale.
// function productSales() {
//   var query = "SELECT units, price FROM products WHERE ?"
//   connection.query(query, {
//     product_ID: val.id
//   }, function (err, res) {
//     var updateQuery = "UPDATE products SET ? WHERE ?";
//     connection.query(updateQuery, [{
//       product_sales: product_sales + (val.price * res[0].units)
//     }, {
//       product_ID: val.id
//     }], function (err, res) {});
//   });
// }












// // bamazonManager.js

// function manager() {

//   inquirer
//     .prompt({
//       name: "menu",
//       type: "list",
//       message: "What task would you like to perform today?",
//       choices: [
//         "View Products for Sale",
//         "View Low Inventory",
//         "Add to Inventory",
//         "Add New Product",
//         "Come back later"
//       ]
//     })
//     .then(function (answer) {
//       switch (answer.user) {
//         case "View Products for Sale":
//           productsForSale();
//           break;

//         case "View Low Inventory":
//           lowInventory();
//           break;

//         case "Add to Inventory":
//           addInventory();
//           break;
//         case "Add New Product":
//           newProduct();
//           break;
//         case "Come back later":
//           console.log("See you soon!");
//           connection.end();
//           break;
//       }
//     });
// }

// function productsForSale(); {

//   // If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
//   console.log("Selecting all products...\n");
//   connection.query("SELECT * FROM products", function (err, res) {
//     if (err) throw err;
//     // Log all results of the SELECT statement
//     console.log(res);
//     console.log("Taking you back to the home screen...");
//     //     Might want to prettify the result
//     manager();
//   });


// }






// function lowInventory(); {

//   var query = "SELECT product_name, units FROM products GROUP BY units HAVING count(*) < 5";
//   connection.query(query, function (err, res) {
//     for (var i = 0; i < res.length; i++) {
//       console.log("Product name: " + res[i].product_name + "\nUnits left: " + res[i].unit + "\n --------------");
//     }
//     console.log("Taking you back to the home screen...");
//     manager();
//   });

//   function addInventory(); {


//     // If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.

//     inquirer.prompt([{

//         name: name,
//         type: input,
//         message: "What is name of the item you would like to add to?"
//       },
//       {
//         name: units,
//         type: input,
//         message: "How many units would you like add?",
//         validate: function (value) {
//           if (isNaN === false) {
//             return true;
//           }
//           return false
//         }
//       }
//     ]).then(function (val) {


//       var updateQuery = "UPDATE products SET ? WHERE ?";
//       connection.query(updateQuery, [{
//         units: units + val.units;
//       }, {
//         prdouct_name: val.name
//       }], function (err, res) {
//         // UPDATE t1 SET col1 = col1 + 1;
//         console.log("Your "
//           res[0].prdouct_name + " stock is now up to" + parseInt(res[0].units + "\n --------------"));
//         login();
//       });
//     });
//   }

//   function newProduct(); {

//     inquirer.prompt([{
//         name: name,
//         type: input,
//         message: "Please enter product name?"
//       },
//       {

//         name: department,
//         type: input,
//         message: "Please enter department name?"
//       },

//       {
//         name: quanitity,
//         type: input,
//         message: "Please enter the product quantity?",
//         validate: function (value) {
//           if (isNaN === false) {
//             return true;
//           }
//           return false
//         }
//       },
//       {
//         name: price,
//         type: input,
//         message: "Please enter product price?",
//         validate: function (value) {
//           if (isNaN === false) {
//             return true;
//           }
//           return false
//         }
//       }
//     ]).then(function (val) {


//       var query = "INSERT INTO products SET ?";
//       console.log("Inserting a new product...\n");
//       connection.query(query, "INSERT INTO products SET ?", {
//           flavor: val.name,
//           department: val.department,
//           quantity: val.quantity,
//           price: val.price
//         },
//         function (err, res) {
//           console.log(res.affectedRows + " product inserted!\n");
//           // Call updateProduct AFTER the INSERT completes
//           manager();
//         });
//     });

//   }




// Create a new MySQL table called departments. Your table should include the following columns:

// department_id

// department_name

// over_head_costs (A dummy number you set for each department)





// Modify your bamazonCustomer.js app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

// Make sure your app still updates the inventory listed in the products column.
// Create another Node app called bamazonSupervisor.js. Running this application will list a set of menu options:

// View Product Sales by Department

// Create New Department

// When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

// department_id	department_name	over_head_costs	product_sales	total_profit
// 01	Electronics	10000	20000	10000
// 02	Clothing	60000	100000	40000
// The total_profit column should be calculated on the fly using the difference between over_head_costs and product_sales. total_profit should not be stored in any database. You should use a custom alias.

// If you can't get the table to display properly after a few hours, then feel free to go back and just add total_profit to the departments table.

// Hint: You may need to look into aliases in MySQL.

// Hint: You may need to look into GROUP BYs.

// Hint: You may need to look into JOINS.

// HINT: There may be an NPM package that can log the table to the console. What's is it? Good question :)

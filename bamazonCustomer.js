var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "dariell",
  password: "password",
  database: "bamazon"
});
//  Customer Module
var customer = {
  customerSearch: function () {
    connection.query("SELECT * FROM products", function (err, res) {
      if (err) throw err;
      console.log("Products available: ");
      // Log all results of the SELECT statement
      var productArr = [];
      for (var i = 0; i < res.length; i++) {
        // pushing each id to an array so that I can validate the user's response. This way, if their product id isn't in the array, they have to try again.
        productArr.push(res[i].item_id)
        console.log("\nID: " + res[i].item_id +
          "\nProduct: " + res[i].product_name +
          "\nDepartment: " + res[i].department_name +
          "\nPrice: " + res[i].stock_quantity + "\n-------------");
      }
      inquirer.prompt([{
        name: "id",
        type: "input",
        message: "What is the id of the item you would like to purchase?",
        validate: function (product) {
          for (var i = 0; i < productArr.length; i++) {
            if (product == productArr[i]) {
              return true;
            }
          }
          console.log("\nPlease make sure you used the correct id!");
          return false;
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
          item_id: val.id
        }, function (err, res) {
          if (res[0].stock_quantity - val.quantity < 0) {
            console.log("Insufficient quantity! \n --------------\nThere are only " + res[0].stock_quantity + " of those left.");

            customer.customerSearch();
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
              connection.end();
            });
          }
        });
      });
    });
  }
}
module.exports = customer;
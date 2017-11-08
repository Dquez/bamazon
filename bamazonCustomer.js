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
//   postBid();
  // connection.end();
});

// function postBid() {
//     // var query = "";
//     inquirer
//       .prompt({
//         name: "postOrBid",
//         type: "rawlist",
//         message: "Would you like to [POST] an auction or [BID] on an auction?",
//         choices: ["POST", "BID"]
//       })
//       .then(function (answer) {
//         if (answer.postOrBid == "POST") {
//           post()
//         } else {
//           bid();
//         }
  
//       });
//   }


  connection.query("Select * from products", function (err, res) {
    for (var i =0; i < res.length; i++ ) {
        console.log("\nProduct: " + res[i].product_name + "\nDeptartment: " + res[i].department_name + "\nPrice: " + res[i].price + "\nStock: " + res[i].stock_quantity + "\n-----------------");
    }
    connection.end();
  });
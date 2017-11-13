var mysql = require("mysql");
var inquirer = require("inquirer");
var customer = require("./bamazonCustomer");
var manager = require("./bamazonManager");
var supervisor = require("./bamazonSupervisor");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "dariell",
    password: "password",
    database: "bamazon"
});
// connection.connect(function (err) {
//     if (err) throw err;
//     console.log("connected as id " + connection.threadId);
login();
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
                    customer.customerSearch();
                    break;
                case "Manager":
                    manager.manager();
                    break;
                case "Supervisor":
                    supervisor.supervisor();
                    break;
            }
        });
}

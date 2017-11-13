var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "dariell",
    password: "password",
    database: "bamazon"
});
// bamazonSupervisor.js
var supervisor = {
    supervisor: function () {
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
                        supervisor.productSalesByDept();
                        break;
                    case "Create new department":
                        supervisor.newDepartment();
                        break;
                    case "Come back later":
                        console.log("See you soon!");
                        break;
                }
            });
    },
    productSalesByDept: function () {

        var totalSales = 0;
        var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, ";
        query += "SUM(products.product_sales) as 'product_sales', SUM(products.product_sales-departments.over_head_costs) total_profit ";
        query += "FROM products INNER JOIN departments USING (department_name) group by departments.department_id, ";
        query += " departments.over_head_costs, products.department_name";
        connection.query(query, function (err, res) {
            if (err) throw err;
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
            supervisor.supervisor();
        });
    },
    newDepartment: function () {
        inquirer.prompt([{
                name: "name",
                type: "input",
                message: "Please enter department name?"
            },
            {
                name: "costs",
                type: "input",
                message: "Please enter the overhead costs?",
                validate: function (value) {
                    if ((isNaN(value) === false) && (value > 0)) {
                        return true;
                    }
                    return false
                }
            }
        ]).then(function (val) {
            var query = "INSERT INTO departments SET ?";
            console.log("Inserting new department...\n");
            connection.query(query, {
                    department_name: val.name,
                    over_head_costs: val.costs
                },
                function (err) {
                    if (err) throw err;
                    console.log("Success!");
                    supervisor.supervisor();
                });
        });
    }
}
module.exports = supervisor;
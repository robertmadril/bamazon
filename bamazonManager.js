var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "r00tr00t",
    database: "bamazon"
});

var Table = require('cli-table');
 
// instantiate
var table = new Table({
    head: ['ID', 'Product Name', 'Department', 'Price', 'Stock']
  , colWidths: [10, 20, 20, 15, 15]
});

connection.connect(function (err) {
    if (err) throw err;
    initialPrompt();
});

function initialPrompt() {

    inquirer
        .prompt([{
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
        ])
        .then(function (response) {

            actionHandler(response.action);

        });

};

function actionHandler(str) {

    switch (str) {
        case "View Products for Sale":
            viewProducts();
            break;
        case "View Low Inventory":
            viewLowInv();
            break;
        case "Add to Inventory":
            inputStockAmt();
            break;
        case "Add New Product":
            console.log("Adding new product...");
            addNewItem();
            break;
        default:
            console.log("Thanks!");
            connection.end();


    };
};

function viewProducts() {

    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        for (i = 0; i < results.length; i++) {
            table.push([results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]);
        };
        console.log(table.toString());
        table = new Table({
            head: ['ID', 'Product Name', 'Department', 'Price', 'Stock']
          , colWidths: [10, 20, 20, 15, 15]
        });
        initialPrompt();

    });

};

function viewLowInv() {

    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, results) {
        if (err) throw err;

        for (i = 0; i < results.length; i++) {
            table.push([results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]);
        };
        console.log(table.toString());
        table = new Table({
            head: ['ID', 'Product Name', 'Department', 'Price', 'Stock']
          , colWidths: [10, 20, 20, 15, 15]
        });
        initialPrompt();

    });

};

function inputStockAmt() {
    inquirer
        .prompt([{
            type: "input",
            name: "inputID",
            message: "What is the ID of the item?",
        },
        {
            type: "input",
            name: "inputAmount",
            message: "How many would you like to add?",
        },
        ])
        .then(function (response) {
            console.log("Updating inventory...");
            var prodID = parseInt(response.inputID);
            var query = "SELECT stock_quantity FROM products WHERE item_id=" + prodID;
            var addAmt = parseInt(response.inputAmount);


            connection.query(query, function (err, results) {
                if (err) throw err;
                var currAmt = parseInt(results[0].stock_quantity);
                var totalAmt = currAmt + addAmt;
                updateStockAmt(prodID, totalAmt);

            });

        });
};

function updateStockAmt(id, amt) {
    var query = "UPDATE products SET stock_quantity=? WHERE item_id=?";

    connection.query(query, [amt, id], function (err, results) {
        if (err) throw err;
        console.log("Stock quantity updated to " + amt);
        initialPrompt();
    });
};

function addNewItem() {
    inquirer
        .prompt([{
            type: "input",
            name: "inputName",
            message: "What is the name of the item?",
        },
        {
            type: "input",
            name: "inputDpt",
            message: "What department is the item located?",
        },
        {
            type: "input",
            name: "inputPrice",
            message: "What's the price of the item?",
        },
        {
            type: "input",
            name: "inputStock",
            message: "How many are in stock?"
        }
        ])
        .then(function (response) {
            console.log("Adding to inventory...");
            var name = response.inputName;
            var department = response.inputDpt;
            var price = parseFloat(response.inputPrice);
            var stock = parseInt(response.inputStock);
            var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (? ,? , ?, ?);"

            connection.query(query, [name, department, price, stock], function (err, results) {
                if (err) throw err;
                console.log("Updated new item");
                initialPrompt();

            });

        });
};




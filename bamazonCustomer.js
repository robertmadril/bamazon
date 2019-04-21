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
    head: ['ID', 'Product Name', 'Price']
  , colWidths: [10, 30, 15]
});

connection.connect(function (err) {
    if (err) throw err;
    initialRead();
});

function initialRead() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        

        for (i = 0; i < results.length; i++) {
            table.push([results[i].item_id, results[i].product_name , results[i].price]);
        };
        console.log(table.toString());
        inquirerPrompt();

    })
}

function inquirerPrompt() {
    inquirer
        .prompt([{
            type: "input",
            name: "inputID",
            message: "What is the ID of your purchase?",
        },
        {
            type: "input",
            name: "inputAmount",
            message: "How many would you like to purchase?",
        },
        ])
        .then(function (response) {

            console.log("Checking your order...")
            orderProcessing(response.inputID, response.inputAmount);

        });
};

function orderProcessing(id, amt) {

    connection.query("SELECT * FROM products WHERE ?",
        {
            item_id: id

        }, function (err, results) {
            if (err) throw err;

            if (amt <= results[0].stock_quantity) {
                var newAmt = results[0].stock_quantity - amt;
                var price = results[0].price * amt;
                buyProduct(id, newAmt, price);
            }
            else {
                console.log("Sorry, we don't have enough in stock");
                connection.end();
            }

        });

};

function buyProduct(id, amt, price) {
    var query = "UPDATE products SET stock_quantity=" + amt + " WHERE item_id=" + id;

    connection.query(query
        , function (err, results) {
            if (err) throw err;
            console.log("Your purchase is complete. Purchase price was $" + price);
            connection.end();
        });

}
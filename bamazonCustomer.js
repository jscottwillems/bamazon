var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon'
})

connection.connect(function(err) {
    if (err) throw err;
    console.log('\n\n-------- Welcome to Bamazon! --------\n');
    displayItems();
    connection.end();
})

function displayItems() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++)  {
            var idNum = res[i].item_ID;
            var prodName = res[i].product_name;
            var price = res[i].price;
            console.log('ID: ' + idNum + ' || ' + prodName + ' || $' + price);
        }
    })
}

function firstPrompt() {
    
}

// take in orders from customer

// deplete stock from inventory as items are purchased

// bonus: track product sales across stores departments and return summary of the highest-grossing departments in the store.

// display all items available for sale (id, name, price).

// prompt 1: ask for id of product customer wishes to purchase

// prompt 2: ask how many of them item the customer would like to purchase

// then check if store has enough of the product to make the sale

// if no console.log('Insufficient quantity!') & prevent order from going through

// if yes update database to reflect new quantity then show customer total cost of purchase
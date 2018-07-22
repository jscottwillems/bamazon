var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon'
})

bamazon();

function bamazon() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log('\n\n-------- Welcome to Bamazon! --------\n');
        displayItems();
        setTimeout(prompts, 1000);
    })
};

function displayItems() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            var idNum = res[i].item_ID;
            var prodName = res[i].product_name;
            var price = res[i].price;
            console.log('\nID#: ' + idNum + ' || ' + prodName + ' || $' + price);
        }
        console.log('\n');
    })
}

function prompts() {

    inquirer.prompt({
        name: 'idselect',
        type: 'input',
        message: 'Select the item you wish to purchase by entering the apporopriate ID number: ',
        validate: function(value) {
            if (value === 'list') {
                displayItems();
            return false;
            }
            else if (isNaN(value) === false && value != 'list') {
              return true;
            }
            console.log('\n\nPlease enter a valid ID number or enter "list" to view all items.\n')
            return false;
          }
    }).then(function (answer) {

        var selectedNum = parseInt(answer.idselect);
        
        connection.query('SELECT * FROM products WHERE item_ID=' + selectedNum, function (err, res) {
            if (err) throw err;
            var idNum = res[0].item_ID;
            var prodName = res[0].product_name;
            var price = res[0].price;
            var stock  = parseInt(res[0].stock_quantity);
            console.log('\nYou have selected:\nID#: ' + idNum + ' || ' + prodName + ' || $' + price + '\n')

            inquirer.prompt({
                name: "quantity",
                type: "input",
                message: "How many would you like to purchase?",
                validate: function(value) {
                    if (isNaN(value) === false && value <= stock) {
                      return true;
                    } else if (isNaN(value) === false && value > stock) {
                    console.log('\n\nNot enough product available. Please enter a lower amount.\n')
                    return false;
                    } else {
                        console.log('\n\nPlease enter a valid number.\n')
                        return false;
                    }
                  }
            }).then(function(answer) {
                connection.query('UPDATE products SET stock_quantity ='+ stock - parseInt(answer.quantity) + 'WHERE item_ID =' + selectedNum, function (err, res) {
                    if (err) throw err;
                    console.log(res)
                    connection.end();
                })
            })
        })
    })

}


// deplete stock from inventory as items are purchased

// prompt 2: ask how many of them item the customer would like to purchase

// then check if store has enough of the product to make the sale
 
// if yes update database to reflect new quantity then show customer total cost of purchase

// bonus: track product sales across stores departments and return summary of the highest-grossing departments in the store.
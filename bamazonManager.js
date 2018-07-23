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
        console.log('\n\n-------- Welcome to Bamazon!--------\n');
        mainMenu();

    })
}

function displayItems() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            var idNum = res[i].item_ID;
            var depart = res[i].department_name;
            var prodName = res[i].product_name;
            var price = res[i].price;
            var stock = res[i].stock_quantity;
            console.log('\nID#: ' + idNum + ' || ' + prodName + ' || $' + price + ' || ' + depart + ' || instock: ' + stock);
        }
        console.log('\n');
    })
}

function backToMain() {
    inquirer.prompt({
        name: "backToMain",
        type: "confirm",
        message: "Would you like to return to the Main Menu?"
    }).then(function (answer) {
        if (answer.backToMain === true) {
            console.log('\nReturning to Main Menu\n');
            console.log('\n\n-------- Welcome to Bamazon! --------\n');
            mainMenu();
        } else {
            console.log('\nThank you for using Bamazon. Goodbye.\n');
            connection.end();
        }
    })
}

function mainMenu() {
    inquirer.prompt({
        name: "main",
        type: "list",
        message: "Please select one of the following options:",
        choices: [
            "View products",
            "View low inventory",
            "Add to existing inventory",
            "Add new item to inventory"
        ]
    }).then(function (answer) {
        switch (answer.main) {
            case "View products":
                displayItems();
                console.log('\n');
                setTimeout(backToMain, 1000);
                break;
            case "View low inventory":
                connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (err, res) {
                    if (err) throw err;
                    for (var i = 0; i < res.length; i++) {
                        var idNum = res[i].item_ID;
                        var prodName = res[i].product_name;
                        var depart = res[i].department_name;
                        var price = res[i].price;
                        var stock = res[i].stock_quantity;
                        console.log('\nID#: ' + idNum + ' || ' + prodName + ' || $' + price + ' || ' + depart + ' || instock: ' + stock + '\n');
                        backToMain();
                    }
                });
                break;
            case "Add to existing inventory":
                displayItems();
                inquirer.prompt({
                    name: 'idselect',
                    type: 'input',
                    message: 'Select the item you wish to add to by entering the apporopriate ID number: ',
                    validate: function (value) {
                        if (value === 'list') {
                            displayItems();
                            return false;
                        } else if (isNaN(value) === false && value != 'list') {
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
                        var depart = res[0].department_name;
                        var stock = parseInt(res[0].stock_quantity);
                        console.log('\nYou have selected:\nID#: ' + idNum + ' || ' + prodName + ' || $' + price + ' || ' + depart + ' || instock: ' + stock + '\n');

                        inquirer.prompt({
                            name: "quantity",
                            type: "input",
                            message: "How many items would you like to add to the inventory?",
                            validate: function (value) {
                                if (isNaN(value) === false) {
                                    return true;
                                } else {
                                    console.log("\n\nPlease enter a valid number.\n")
                                    return false;
                                }
                            }
                        }).then(function (answer) {
                            var newTotal = parseInt(stock) + parseInt(answer.quantity);
                            connection.query('UPDATE products SET stock_quantity ="' + newTotal + '" WHERE item_ID=' + selectedNum, function (err, res) {
                                if (err) throw err;

                                console.log('\nSuccessfully added ' + answer.quantity + ' new items. The new instock total for ' + prodName + ' is ' + newTotal + '\n');
                                backToMain();
                            })
                        })
                    })
                })
                break;
            case "Add new item to inventory":

                var answersArr = [];

                inquirer.prompt({
                    name: "name",
                    type: "input",
                    message: "Please enter the name for the item you wish to add:"
                }).then(function (answer) {

                    answersArr.push(answer.name);

                    inquirer.prompt({
                        name: "depart",
                        type: "list",
                        message: "Please select a departement for the item you wish to add.",
                        choices: [
                            "electronics",
                            "sports and outdoors",
                            "health and beauty",
                            "home and decor",
                            "toys and games",
                            "other"
                        ]
                    }).then(function (answer) {
                        answersArr.push(answer.depart);

                        inquirer.prompt({
                            name: "price",
                            type: "input",
                            message: "Please enter the cost per item in dollars and cents:",
                            validate: function (value) {
                                if (isNaN(value) === false) {
                                    return true;
                                } else {
                                    console.log('\n\nPlease enter a valid number.\n')
                                    return false;
                                }
                            }
                        }).then(function (answer) {
                            var toNum = parseInt(answer.price);
                            var fixNum = toNum.toFixed(2);
                            answersArr.push(fixNum);

                            inquirer.prompt({
                                name: "stock",
                                type: "input",
                                message: "Please enter the ammount of items you wish to add",
                                validate: function (value) {
                                    if (isNaN(value) === false) {
                                        return true;
                                    } else {
                                        console.log('\n\nPlease enter a valid number.\n')
                                        return false;
                                    }
                                }
                            }).then(function (answer) {
                                var toNum = parseInt(answer.stock);
                                answersArr.push(toNum);
                                connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + answersArr[0] + "', '" + answersArr[1] + "', " + answersArr[2] + ", " + answersArr[3] + ")", function (err, res) {
                                    if (err) throw err;

                                    console.log('New item successfully added!');
                                    setTimeout(backToMain, 1000);
                                })
                            })
                        })
                    })
                });
                break;
        }
    })
}
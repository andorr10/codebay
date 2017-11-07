var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");

var connection = mysql.createConnection({
 host: "localhost",
 port: 3306,
 // Your username
 user: "root",
 // Your password
 password: "",
 database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  //console.log("connected as id " + connection.threadId + "\n");
  console.log("connected!");
  displayProducts();
  //buy();
});


function displayProducts(){
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    //console.log(results);
    var table = new Table({ chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''} });
    // var dbArray = [];
      table.push([
        "Item ID", "Product Name", "Department Name", "Price", "Quantity"
      ]);
      for (var i = 0; i < results.length; i++) {
        table.push([
          results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity
        ]);
      }
      // table.push([results[0].product_name, results[0].product_name, results[0].department_name, results[0].price, results[0].stock_quantity]);
      console.log(table.toString());
      buy();


  });

}


function buy(){

  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    inquirer.prompt([
      {
        name: "choice",
        type: "rawlist",
        choices: function() {
          //var choiceArray = ["apple", "sweater"];
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].product_name);
          }
          return choiceArray;
        },
        message: "What would you like to purchase?"
      },
      {
        name: "bid",
        type: "input",
        message: "How many would you like?"
      }
    ])
    .then(function(response){
      console.log("you want " + response.bid + " of " + response.choice);
      //console.log("test  " + JSON.stringify(results[0].product_name));
      var chosenItem;
      for (var i = 0; i < results.length; i++) {
        if (results[i].product_name === response.choice) {
          chosenItem = results[i];
          console.log("we have " + chosenItem.stock_quantity + " of what you're looking for.");
        }
      }
      if (response.bid < chosenItem.stock_quantity) {
        console.log("we have enough");
        //write mysql formula to update database
      }
      if (response.bid > chosenItem.stock_quantity) {
        console.log("sorry, we don't have enough of that.  Maybe try to buy something else");
        displayProducts();
      }

      // connection.query('UPDATE users SET foo = ?, bar = ?, baz = ? WHERE id = ?', ['a', 'b', 'c', userId], function (error, results, fields) {
      //   if (error) throw error;
      //   // ...
      // });

    //connection.escape()
    });
  });


}

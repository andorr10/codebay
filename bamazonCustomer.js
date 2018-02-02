var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");
var newItem;
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
  console.log("Welcome to Bamazon!");
  //displayProducts();
  chooseBuyOrSell();
  //buy();
});

//******************************************
//This function determines whether the person wants to buy or sell products
//******************************************
function chooseBuyOrSell(){
  //console.log("Buy or sell something?");
  inquirer.prompt([
      {
        name: "choice",
        type: "rawlist",
        choices: ["Buy", "Sell"],
        message: "Would you like to Buy or Sell something?"
      }
    ]).then(function(response){
      console.log("Awesome, what do you want to " + response.choice);
      if(response.choice ==="Buy"){
        displayProducts();
      }
      if(response.choice === "Sell") {
        // console.log("Oh'");
        Sell();
      }
      

    });
      }




//******************************************
//This function displays the all the inventory and
//******************************************
function displayProducts(){
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    //console.log(results);
    var table = new Table({
      head:["Item ID", "Product Name", "Department Name", "Price", "Stock"]
    });
      // { chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''}
    //  });
    // var dbArray = [];
      // table.push([
      //   "Item ID", "Product Name", "Department Name", "Price", "Quantity"
      // ]);
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
//******************************************
// This function below will ask them what product they want and 
//******************************************
function buy(){
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    inquirer.prompt([
      {
        name: "choice",
        type: "rawlist",
        choices: function() {
          //var choiceArray = ["Nothing. Just looking"];
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
      // if(response.choice === "Nothing. Just Looking"){
      //   console.log("end the entire application");
      // }
      // else {
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
          var amountLeft = chosenItem.stock_quantity - response.bid;
          //console.log(amountLeft + " left");
          //console.log("we have enough");
          // write mysql formula to update database
          updateDB(amountLeft, response.choice);
        }
        if (response.bid > chosenItem.stock_quantity) {
          console.log("");
          console.log("sorry, we don't have enough of that.  Maybe try to buy something else");
          console.log("");
          stillShopping();
        }
    });
  });
}


function Sell(){
  var productsArray = [];
  connection.query("SELECT * FROM products", function(err, results){
      if (err) throw err; 

      for (var i = 0; i < results.length; i++){
        productsArray.push(results[i].product_name);
      }
      console.log(productsArray);
      // console.log(productsArray);
      // return productsArray;



      inquirer.prompt([{
        name: "item",
        type: "input",
        message: "What you slangin' bud?"
        }]).then(function(response){
          newItem=response.item;
          if(productsArray.includes(response.item)) {
            console.log("sorry bud we already got those, how about something else?");
            chooseBuyOrSell();
          }
          else {
            console.log("awesome, something new");
            inquirer.prompt([{
              name: "department",
              type: "input",
              message: "What category would you say that is?"
              },
              {
              name: "price",
              type: "input",
              message: "Ok, and how much you want for it?"
              },
              {
                name: "amount",
                type: "input",
                message: "How many you got?"
              }]).then(function(response){
                console.log("added this bad boy to the store");
                addNewToDB(newItem, response.department, response.price, response.amount);
                console.log("anything else you want to do?");
              });

            }
        });

//         inquirer.prompt(
//         [
//         name: "department",
//         type: "rawlist"
//         message: "Huh, that's interesting.  What department would I store that in?"
//         ]).then(function(response){
//           if (response.product = true){
//             inquirer.prompt([
//                 name: "amount",
//                 type: "input"
//                 message: "How many you tryna slang?"
//               ],
//               [
//                 name: "cost",
//                 type: "input",
//                 message "How much you want for one?"
//               ]).then(function(response){
//                 for (var i=0; i<results.)

//               });

//           }
//           if (response.product !==true){
//             console.log("Sorry fam, we already got that");
//             return;
//           }


//         });

   });

 }

function stillShopping(){
  inquirer.prompt([
      {
        name: "choice",
        type: "rawlist",
        choices: ["Yes", "No"],
        message: "Would you like to continue shopping?"
      }
    ]).then(function(response){
      if(response.choice ==="Yes"){
        displayProducts();
      }
      if(response.choice === "No") {
        console.log("Thanks for your business, see you again.");
        return;
      }

    });
    return;
}

//******************************************
// This function updates the database to reflect the current stock of each item
//******************************************
// function addToDB(amount, item){
//   var sql = ("")

// }

function updateDB(amount, item){
    var sql = ("UPDATE products SET stock_quantity = ? WHERE product_name = ?");
    connection.query(sql, [amount, item],function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
      stillShopping();
    });
  }

  function addNewToDB(item, department, price, amount){
    var addSql = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + newItem + "', '"+department+"', "+price+", "+amount+")";
    connection.query(addSql, function(err, result) {
      if (err)throw err;
      console.log("Thanks, now I can add "+ newItem + " to the marketplace.  I now have "+ result.affectedRows + " more item.");
      stillShopping();
    });
    //console.log(addSql);
  }

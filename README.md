codebay
using mysql and mysql npm to create an application that acts like ebay
My "Amazon/Ebay"-like app only runs when choose to buy.  It will give you a list of items that are in stock and then ask you to choose the time.

Below is the starting image for when the program runs, showing all the available products to buy:
https://github.com/andorr10/codebay/blob/master/images/Bamazon-Start.png?raw=true





the first thing the application does is establish a connection to the mysql database, through the mysql npm.  Once the connection is confirmed, the terminal displays a welcome message and then executes the display products function to show all the items in the marketplace.



display products()-
this function queries the mysql database and pulls all products.  It then takes each row and pushes them into an array by running a for loop through each row.  Once the products are displayed it runs the run function.

run()-  The run function executes the logic for the application. It connects to the database, then prompts the the user which item it would like to buy from the list of products in the database and then prompts how many the user would like to buy.  It then compares the response to the the amount of the desired product in the database.  If the amount requested is larger than the amount in the db then it will respond that there isn't sufficient amount and ask you to choose something else to buy.  If the amount is less than the db it will then subtract the amount requested from the amount in the database and store the value as amountLeft.  It then executes the updateDB function passing through the two values, amount and item (which will be amountLeft and the product choice)  

updateDB()- this function takes two inputs and updates the database.  It will set a mysql command to set the stock quantity to the amountLeft that was passed through when the product is equal to the item name (that was passed through).  Once this is done successfully it informs you that the db was updated and goes back to displaying the db with the updated information.

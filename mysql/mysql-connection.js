var mysql = require('mysql');


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "book_store",
  multipleStatements: true
});


con.connect(function(err) {
    if (err) return   console.log("failed to connect to book_store pls download mysql");

    else return console.log("connection establish with book_store!!!!");
});

module.exports = con;

    
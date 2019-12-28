var mysql = require('mysql');
const table_name = "books";


var con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  database: "book",
  multipleStatements: true
});


con.connect(function(err) {
    if (err) return   console.log("mysql-connection failed to connect");

    else return console.log("connection establish!!!!");
});

module.exports = con;

    
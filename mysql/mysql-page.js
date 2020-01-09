const express = require("express");
const con = require("./mysql-connection");
const Router = express.Router();
const joi = require("joi");

    //in REST architechure we use post method  to insert data
Router.post("/api/book/",(req,res)=>{
    //validation is left 
  var sql = `INSERT INTO book VALUEs ("${req.body.id}","${req.body.title}", "${req.body.subject}",${req.body.year},"${req.body.author}",${req.body.user_id})`;
        con.query(sql, (err, result) =>{
            if (err) console.log(err);
            console.log("1 record inserted");
            });

    });


//for login
//validation is left and will not use jquery for validation
Router.post("/api/login/user/",(req,res)=>{
  con.query(`SELECT * FROM user where log_id ="${req.body.username}" and password="${req.body.password}"`,(err, result, fields)=> {
if(err)console.log(err);           
console.log(result,fields);
if(result.length>0) 
res.send("sucess");
});
    });



//to remove data
Router.delete("/api/book/:id",(req,res)=>{
        //validation is left
    con.connect(function(err) {
        if (err) return  err;
        var sql = `DELETE FROM book WHERE id = ${req.body.id}`;
        con.query(sql, function (err, result) {
            if (err) return  err;
            console.log("Number of records deleted: " + result.affectedRows);
            });
        });
    });



    //to show data

Router.get("/api/book/",(req,res)=>{
  con.query(`SELECT * FROM book where name ="${req.query.title}"`,(err, result, fields)=> {
if(err)console.log(err);           
console.log(result);
 res.send(result);
});
    });




 //to update data
Router.put("/api/book/:id/:name/:year",(req,res)=>{
        con.connect(function(err) {
            if (err) return  err;
            var sql = `UPDATE book SET name = ${req.body.name} WHERE id = ${req.body.id}`;
            con.query(sql, function (err, result) {
              if (err) return  err;
              console.log(result.affectedRows + " record(s) updated");
            });
        });

});

module.exports = Router;




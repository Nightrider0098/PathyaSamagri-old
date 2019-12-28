const express = require("express");
// const con = require("./mysql-connection");
const Router = express.Router();
const joi = require("joi");

    //in rest architechure we use post method  to insert data
Router.post("/api/book/:name/:year",(req,res)=>{
    //validation is left 
    con.connect( (err) =>{
        if (err) return  err;
        console.log("Connected!");
        var sql = `INSERT INTO customers (name, year) VALUES (${req.body.name}, ${req.body.year})`;
        con.query(sql, (err, result) =>{
            if (err) return  err;
            console.log("1 record inserted");
            });
        });
    
    });

//to remove data
Router.delete("/api/book/:id",(req,res)=>{
        //validation is left
    con.connect(function(err) {
        if (err) return  err;
        var sql = `DELETE FROM customers WHERE id = ${req.body.id}`;
        con.query(sql, function (err, result) {
            if (err) return  err;
            console.log("Number of records deleted: " + result.affectedRows);
            });
        });
    });
    //to show data
Router.get("/api/book/:id",(req,res)=>{
    res.send("ok");
    con.connect(function(err) {
            if (err) return  err;
            con.query(`SELECT * FROM customers where id =${req.body.id}`,(err, result, fields)=> {
            if (err) return  err;
            console.log(result);
            });
        });
    });

        //to update data
Router.put("/api/book/:id/:name/:year",(req,res)=>{
        con.connect(function(err) {
            if (err) return  err;
            var sql = `UPDATE customers SET name = ${req.body.name} WHERE id = ${req.body.id}`;
            con.query(sql, function (err, result) {
              if (err) return  err;
              console.log(result.affectedRows + " record(s) updated");
            });
        });

});

module.exports = Router;




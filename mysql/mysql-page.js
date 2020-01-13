const express = require("express");
const con = require("./mysql-connection");
const Router = express.Router();
const joi = require("joi");

//in REST architechure we use post method  to insert data
Router.post("/book_entry/", (req, res) => {
    //validation is left 


    //book id generator

// console.log(req.user.username);
    // var sql = `INSERT INTO book VALUEs ("${req.body.id}","${req.body.title}", "${req.body.subject}",${req.body.year},"${req.body.author}",${req.user})`;
    // con.query(sql, (err, result) => {
        // if (err) console.log(err);

        console.log("1 record inserted");
        console.log(req.session.passport);
        res.send(200);
        console.log(req.user);
    // });

});


//for login
//validation is left and will not use jquery for validation
Router.post("/api/login/user/", (req, res, next) => {
    con.query(`SELECT * FROM user where usr_nm ="${req.body.username}" and password="${req.body.password}"`, (err, result, fields) => {
        console.log("pass");
        if (err) next(err);
        if (result.length > 0)
            res.send("sucess");
        else
        res.send("failed");
    });
});



//to remove data
Router.delete("/api/book/:id", (req, res) => {
    //validation is left
    con.connect(function (err) {
        if (err) return err;
        var sql = `DELETE FROM book WHERE id = ${req.body.id}`;
        con.query(sql, function (err, result) {
            if (err) return err;
            console.log("Number of records deleted: " + result.affectedRows);
        });
    });
});



//to show data

Router.get("/api/book/", (req, res) => {
    con.query(`SELECT * FROM book where name ="${req.query.title}"`, (err, result, fields) => {
        if (err) console.log(err);
        res.json({ "book_find": result });
    });
});

Router.get("/api/book/hint", (req, res) => {
    con.query(`SELECT * FROM book where name ="${req.query.title}"`, (err, result, fields) => {
        if (err) return console.log(err);
        var book_title =[];
        for(i=0;i<Object.values(result).length;i++)
        {
book_title.push(result[i].name);

        }
        
        res.json({"hint_find":book_title});
    });
});



//to update data
Router.put("/api/book/:id/:name/:year", (req, res) => {
    con.connect(function (err) {
        if (err) return err;
        var sql = `UPDATE book SET name = ${req.body.name} WHERE id = ${req.body.id}`;
        con.query(sql, function (err, result) {
            if (err) return err;
            console.log(result.affectedRows + " record(s) updated");
        });
    });

});

module.exports = Router;




//in REST architechure we use post method  to insert data
const express = require("express");
const con = require("./mysql-connection");
const Router = express.Router();
const joi = require("joi");
const uuidv1 = require("uuid/v1");
//assuming that uuid is unique for each user


Router.post("/api/login/new_user/", (req, res, next) => {

    con.query(`SELECT * FROM user where username ="${req.body.username}" or email="${req.body.email}"`, (err, result, fields) => {
        if (err) next(err);
        if (result.length > 0)
            res.redirect("/signup_fail");
        else {

            con.query(`INSERT into user ( user_id,username,email,password) values("${uuidv1()}","${req.body.username}","${req.body.email}","${req.body.password}")`, (err, result, fields) => {
                console.log("new account created by ", req.body.username);
                if (err) next(err);

                else
                    res.redirect("/login");
            });
        }
    });
});


//new book registration
Router.post("/book_entry/", (req, res) => {
    //subject books list to be updated
    const valid_sub = ['maths', 'english', 'science', 'physics', 'chemistry', 'biology', 'communication', 'mechinacal', 'electronics', 'electrical', 'civil'];
    if (valid_sub.find(element => element.localeCompare(req.body['subject'])).localeCompare(req.body['subject']) == 0) { return res.send("invalid books subject"); }
    var book_pre_index = 0;
    var sql_sub_index = "select book_id from book where subject='" + req.body['subject'] + "' order by book_id desc limit 1";
    con.query(sql_sub_index, (error, result) => {
        if (error) { console.log(error); return res.send("book submition failed"); } else {
            if (result == 0) { book_pre_index = 0; } else { book_pre_index = parseInt(result[0]['book_id'].slice(2)) + 1; }
            const sub_acro = ['mh', "en", 'sc', 'py', 'ch', 'bo', 'cm', 'me', 'ec', 'et', 'cl'];
            var book_id_generated = " ('" + sub_acro[valid_sub.indexOf(req.body['subject'])] + String(book_pre_index) + "'" + ',';


            var book_parms = Object.keys(req.body);
            book_parms.pop('signin');
            var sql = 'insert into book ( book_id,',
                sql_values = book_id_generated;
            for (i = 0; i < book_parms.length; i++) {
                if (req.body[book_parms[i]] !== '') {
                    if (book_parms[i] !== 'edition') {
                        sql = sql + book_parms[i] + ',';
                        sql_values = sql_values + "'" + req.body[book_parms[i]] + "'" + ",";
                    } else {
                        sql = sql + book_parms[i] + ',';
                        sql_values = sql_values + req.body[book_parms[i]] + ",";

                    }


                }
            }
            sql = sql + "owner_id,";
            sql_values = sql_values + "'" + req.user[0].user_id + "',";

            sql = sql.slice(0, sql.length - 1) + ') values' + sql_values.slice(0, sql_values.length - 1) + ')';

            con.query(sql, (error, result) => {

                if (error) { console.log(error); } else {
                    console.log("book donated!!!");
                    res.send("sucess");
                }

            });
        }
    });
    //fetching number of already donated books
    sql = "select book_donated from user where user_id='" + req.user[0].user_id + "'";
    con.query(sql, (error, result) => {
        if (error) { return console.log(error); }
        var book_donated = parseInt(result[0].book_donated) + 1;
        console.log("books donated by user ", req.user[0].username, " total", book_donated);
        //updating number of books donated in the user database 
        sql = "update user set book_donated=" + book_donated + " where user_id = '" + req.user[0].user_id + "'";
        con.query(sql, (error, result) => {
            if (error) { return console.log(error); }
            console.log("user data updated");
        })
    });


});


//to show books with bookname 
Router.get("/api/book/", (req, res) => {
    con.query(`SELECT * FROM book where title ="${req.query.title}"`, (err, result, fields) => {
        if (err) console.log(err);
        res.json({ "book_find": result });
    });
});

//is used for getting near result
Router.get("/api/book/hint", (req, res) => {
    con.query(`SELECT * FROM book where title like "%${req.query.title}%"`, (err, result, fields) => {
        if (err) return console.log(err);
        var book_title = [];
        for (i = 0; i < Object.values(result).length; i++) {
            book_title.push(result[i].title);
        }
        res.json({ "hint_find": book_title });
    });
});

Router.post("/advance_book_Search",(req,res)=>{
console.log(req.body,req.query);



});
//to load 12 books data
Router.get("/recent_books/", (req, res) => {
    if (req.query.index) {
        con.query(`SELECT * FROM book order by donated_on desc limit ${req.query.index},12`, (err, result, fields) => {
            if (err) console.log(err);
            res.json({ "recent_books": result });
            console.log('sent 12 books',`SELECT * FROM book order by donated_on desc limit ${req.query.index},${parseInt(req.query.index) + 12}`);
        });
    } else {
        con.query(`SELECT * FROM book order by donated_on desc limit 12`, (err, result, fields) => {
            if (err) console.log(err);
            res.json({ "recent_books": result });
        });
    }

});


//to get single user books that he has donated
Router.get("/user_books/", (req, res) => {
    var user_book_result = "";
    sql = `SELECT * FROM book  where owner_id = '${req.user[0].user_id}' order by donated_on desc limit 12`;
    con.query(sql, (err, result, fields) => {
        if (err) console.log(err);
        user_book_result = result;


        var tot_book_donated = 0;
        sql = `SELECT book_id FROM book  where owner_id = '${req.user[0].user_id}' `;
        con.query(sql, (err, result, fields) => {
            if (err) console.log(err);
            tot_book_donated = result.length;


            res.json({ "user_books": user_book_result, "username": req.user[0].username, "book_donated": tot_book_donated });

        });

    });


});


// //to show books with advance feature
// Router.get("/book/advance/", (req, res) => {
//     con.query(`SELECT * FROM book where title ="${req.query.title}"`, (err, result, fields) => {
//         if (err) console.log(err);
// sql ='SELECT * FROM book where ';
//         if(req.query['word_containing'] !=='')
// sql = sql+ "title like '*"+req.query['word_containing']+"*' ";
// if(req.query['edition_range']!=='')
// sql = sql + "edition >=" + req.query['edition_range'];
// if(req.query['owner'] !== '')
// sql = sql + "subject in ("+ req.query[] 
        

//         // res.json({ "book_find": result });
//     });
// });


Router.post("/advance_search",(req,res)=>{
console.log(req.body);



});





//to remove data
//authentication is to be checked
Router.delete("/delete/:title", (req, res) => {
    //validation is left
    var delete_book_id;
    con.query(`SELECT book_id FROM book where title ="${req.body.title}"`, (err, result, fields) => {
        if (err) console.log(err);
        delete_book_id = result[0].book_id;
    });


    var sql = 'DELETE FROM book WHERE book_id =' + book_id + "'";
    con.query(sql, function (err, result) {
        if (err) return err;
        console.log("Number of records deleted: " + result.affectedRows);

    });
});

//------------------------------------------not used ----------------------------------------//
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
const fs = require('fs');
const path = require('path');
const express = require("express");
const con = require("./mysql-connection");
const Router = express.Router();
const joi = require("joi");
const uuidv1 = require("uuid/v1");
//assuming that uuid is unique for each user


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.user[0].username, " has requested ");
        return next();
    } else
        res.redirect("/login");
};


Router.post("/api/login/new_user/", (req, res, next) => {

    con.query(`SELECT * FROM user where username ="${req.body.username}" or email="${req.body.email}"`, (err, result, fields) => {
        if (err) next(err);
        if (result.length > 0)
            res.redirect("/signup_fail");
        else {

            function mkuser() {
                con.query(`INSERT into user ( user_id,username,email,password) values("${uuidv1()}","${req.body.username}","${req.body.email}","${req.body.password}")`, (err, result, fields) => {
                    if (err) {
                        mkuser();
                        console.log("err", err);
                    }
                    else {
                        console.log("new account created by ", req.body.username);
                        res.redirect("/login");
                    }
                });
            }
            mkuser();
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
    con.query(`SELECT * FROM book where title ="${req.query.title}" limit ${req.query.limit},12`, (err, result, fields) => {
        if (err) console.log(err);
        res.json({ "book_find": result });
        console.log(`SELECT * FROM book where title ="${req.query.title}" limit ${req.query.limit},12"`);
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

//to load 12 books data
Router.get("/recent_books/", (req, res) => {
    if (req.query.index) {
        con.query(`SELECT * FROM book order by donated_on desc limit ${req.query.index}, 12`, (err, result, fields) => {
            if (err) console.log(err);
            res.json({ "recent_books": result });
            console.log('sent 12 books', `SELECT * FROM book order by donated_on desc limit ${req.query.index},12}`);
        });
    } else {
        con.query(`SELECT * FROM book order by donated_on desc limit 12`, (err, result, fields) => {
            if (err) console.log(err);
            res.json({ "recent_books": result });
        });
    }

});


//to get user books that he has donated
Router.get("/user_books/", (req, res) => {
    var user_book_result = "";
    sql = `SELECT * FROM book  where owner_id = '${req.user[0].user_id}' order by donated_on desc limit ${req.query['index']},12 `;
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


Router.post("/advance_search", (req, res) => {
    var sql = 'select * from book where ';
    var all_options = Object.keys(req.body);
    sql += `donated_on >= '${req.body['donation_from']}' `
    if (req.body['donation_to'])
        sql += `and donated_on < '${req.body['donation_to']}' `;

    if (req.body['book_title'] != '')
        sql += ` and title like "%${req.body['book_title']}%"`;
    sql += `and edition >= ${req.body['lower_edition']} and edition < ${req.body['upper_edition']} `;
    if (req.body['owner'])
        sql += `and owner_id = '${req.body['owner']}' `;
    if (req.body['publisher'])
        sql += `and publisher = "${req.body['publisher']}"`;
    if (req.body['subject'])
        sql += `and subject = "${req.body['subject']}" `
    if(req.body['available_now'])
    {
        if(req.body['available_now'] == "availible")
        sql+= 'and available_now = 1';
        else if (req.body['available_now'] == "not availible")
        sql += 'and available_now = 0'
        
   }   con.query(sql, (err, result, fields) => {
        res.send(result);

    });

});

//once the book is booked
Router.get("/book_booked", checkAuthenticated, (req, res) => {

    sql = "select book_issued from user where username='" + req.user[0].username + "'";
    con.query(sql, (err, result) => {
        var book_issued_by_user = result[0]['book_issued'];
        if (book_issued_by_user < 4) {
            //books less then 4
            sql = "select available_now,donated_to  from book where book_id ='" + req.query['book_id'] + "'";
            con.query(sql, (err, result_) => {
                if (err) res.send(err);
                if (result_[0]['available_now'] == '0')
                    if (result_[0]['donated_to'] == req.user[0].user_id) {
                        sql = "select address,phone_no,username from user where user_id='" + result_[0]['donated_to'] + "'";
                        con.query(sql, (err, result__) => {
                            if (err) res.send(err);
                            else {
                                ;
                                res.render(path.resolve(__dirname.slice(0, __dirname.length - 5), "View", "confirmation_page.ejs"), result__[0]);
                            }
                        })
                    }
                    else
                        res.send("already reffered sorry");
                else {
                    //updating book availability
                    sql = "update book set available_now = 0 , donated_to ='" + req.user[0]['user_id'] + "' where book_id='" + req.query['book_id'] + "'";
                    con.query(sql, (err, result) => {
                        if (err) return res.send(err);

                        sql = "select owner_id,Book_id,title from book where book_id ='" + req.query['book_id'] + "'";
                        con.query(sql, (err, result_) => {
                            if (err) res.send(err);

                            //writing into notify file
                            fs.appendFile(`C:/Users/SAMSUNG/Desktop/mongodb_project/noti/doner/${result_[0]['owner_id']}.txt`, "\r\n  " + Date() + " your book with name " + result_[0]['title'] + " and id " + result_[0]['Book_id'] + " is requested by user " + req.user[0].username + " phone no " + req.user[0].phone_no, (err) => {
                                if (err) {
                                    fs.writeFile(`C:/Users/SAMSUNG/Desktop/mongodb_project/noti/doner/${result_[0]['owner_id']}.txt`, "\r\n  " + Date() + " your book with name " + result_[0]['title'] + " and id " + result_[0]['Book_id'] + " is requested by user " + req.user[0].username + " phone no " + req.user[0].phone_no, (err) => { console.log(err); });
                                }
                            });

                            fs.appendFile(`C:/Users/SAMSUNG/Desktop/mongodb_project/noti/reciever/${req.user[0].user_id}.txt`, "\r\n  " + Date() + " you have book a book with name " + result_[0]['title'] + " and id " + result_[0]['Book_id'] + " from  by user " + req.user[0].username + " his phone no " + req.user[0].phone_no, (err) => {
                                if (err) {
                                    fs.writeFile(`C:/Users/SAMSUNG/Desktop/mongodb_project/noti/reciever/${req.user[0].user_id}.txt`, "\r\n  " + Date() + " you have book a book with name " + result_[0]['title'] + " and id " + result_[0]['Book_id'] + " from  by user " + req.user[0].username + " his phone no " + req.user[0].phone_no, (err) => { console.log(err); });

                                }
                            });




                            sql = "select address,phone_no,username from user where user_id='" + result_[0]['owner_id'] + "'";
                            con.query(sql, (err, result__) => {
                                if (err) res.send(err);
                                else {
// console.log(sql);
                                    res.render(path.resolve(__dirname.slice(0, __dirname.length - 5), "View", "confirmation_page.ejs"), result__[0]);
                                }
                            })

                        })
                        //updating user issued books
                        con.query("update user set book_issued=" + (book_issued_by_user + 1) + " where username='" + req.user[0].username + "'", (err, result) => {
                            if (err) console.log(err);


                        });



                    })
                }
            })


        }
        else
            res.send("already issued 4 books!!!");



    })
    console.log(req.query['book_id']);
});

//address and phone no
Router.post("/update_user", (req, res) => {
    sql = "update user set address='" + req.body['address'] + "' ,phone_no = '" + req.body['phone'] + "' where username='" + req.user[0].username + "'";
    con.query(sql, (err, result) => {
        res.redirect("/profile");

    });

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

//changing book details
Router.post("/book_update/", (req, res) => {

    //check for subject change
    sub_query = "select subject from book where book_id='" + req.body['book_id'] + "'"
    con.query(sub_query, (err, result) => {
        if (result[0]['subject'] == req.body['subject']) {
            new_sql = "update book set title='" + req.body['title'] + "',publisher='" + req.body['publisher'] + "', author='" + req.body['author'] + "', edition=" + req.body['edition'] + ",for_year='" + req.body['for_year'] + "' where book_id='" + req.body['book_id'] + "'";
            con.query(new_sql, (err, result_up) => { if (err) { console.log(err); } });
            res.send("updated");
        }


        else {

            //subject books list to be updated
            const valid_sub = ['maths', 'english', 'science', 'physics', 'chemistry', 'biology', 'communication', 'mechinacal', 'electronics', 'electrical', 'civil'];
            if (valid_sub.find(element => element.localeCompare(req.body['subject'])).localeCompare(req.body['subject']) == 0) { return res.send("invalid books subject"); }
            var book_pre_index = 0;
            //for creating book_id
            var sql_sub_index = "select book_id from book where subject='" + req.body['subject'] + "' order by book_id desc limit 1";
            con.query(sql_sub_index, (error, result) => {
                if (error) { console.log(error); return res.send("book submition failed"); }
                else {
                    if (result == 0) { book_pre_index = 0; }
                    else {
                        book_pre_index = parseInt(result[0]['book_id'].slice(2)) + 1;
                    }

                    const sub_acro = ['mh', "en", 'sc', 'py', 'ch', 'bo', 'cm', 'me', 'ec', 'et', 'cl'];
                    var book_id_generated = " ('" + sub_acro[valid_sub.indexOf(req.body['subject'])] + String(book_pre_index) + "'" + ',';

                    var book_parms = Object.keys(req.body);
                    book_parms.pop('signin');
                    var sql = 'insert into book ( book_id,',
                        sql_values = book_id_generated;
                    for (i = 0; i < book_parms.length; i++) {

                        if (req.body[book_parms[i]] !== '') {
                            if (book_parms[i] == 'book_id') { continue; }

                            else if (book_parms[i] !== 'edition') {
                                //sql is coloumn to enter the values
                                sql = sql + book_parms[i] + ',';

                                //sql_Value is for values to enter
                                sql_values = sql_values + "'" + req.body[book_parms[i]] + "'" + ",";
                            } else {
                                //since edition is int type 
                                sql = sql + book_parms[i] + ',';
                                sql_values = sql_values + req.body[book_parms[i]] + ",";

                            }


                        }
                    }
                    //dont need owner id since it is already made
                    // sql = sql + "owner_id,";
                    // sql_values = sql_values + "'" + req.user[0].user_id + "',";

                    sql = sql.slice(0, sql.length - 1) + ') values' + sql_values.slice(0, sql_values.length - 1) + ')';
                    console.log(sql);
                    con.query(sql, (error, result) => {

                        if (error) { console.log(error); } else {
                            console.log("book donated!!!");
                            res.send("sucess");
                        }

                    });
                }
            });

            // deleting the last recored
            del_sql = "delete from book where book_id ='" + req.body['book_id'] + "'";
            con.query(del_sql, (err, res_) => { if (err) { console.log(err); } });

        }
    })

});

module.exports = Router;
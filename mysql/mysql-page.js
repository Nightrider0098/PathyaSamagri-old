const fs = require('fs');
const path = require('path');
const express = require("express");
const con = require("./mysql-connection");
const Router = express.Router();
const joi = require("joi");
const formidable = require('formidable');
const uuidv1 = require("uuid/v1");


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

    var form = new formidable.IncomingForm();

    form.uploadDir = "C:/Users/SAMSUNG/Desktop/mongodb_project/Public/images/books/";

    form.parse(req, function (err, fields, files) {
        var file_name = files['book_image'].path.split("\\")[files['book_image'].path.split("\\").length - 1] + ".png";


        fs.rename(files['book_image']['path'], path.join(__dirname, "..", "public", "images", "books", file_name), (err) => { console.log(err); });
        const valid_sub = ['maths', 'english', 'science', 'physics', 'chemistry', 'biology', 'communication', 'mechinacal', 'electronics', 'electrical', 'civil'];
        if (valid_sub.find(element => element.localeCompare(fields['subject'])).localeCompare(fields['subject']) == 0) { return res.send("invalid books subject"); }
        var book_pre_index = 0;
        var sql_sub_index = "select book_id from book where subject='" + fields['subject'] + "' order by book_id desc limit 1";
        con.query(sql_sub_index, (error, result) => {
            if (error) { console.log(error); return res.send("book submition failed"); } else {
                if (result == 0) { book_pre_index = 1; } else { book_pre_index = parseInt(result[0]['book_id'].slice(2)) + 1; }
                const sub_acro = ['mh', "en", 'sc', 'py', 'ch', 'bo', 'cm', 'me', 'ec', 'et', 'cl'];
                str_index = ''
                if (book_pre_index < 10)
                    str_index = "00" + String(book_pre_index)
                else if (book_pre_index < 100)
                    str_index = "0" + String(book_pre_index)
                else if (book_pre_index < 1000)
                    str_index = "" + String(book_pre_index)
                var book_id_generated = " ('" + sub_acro[valid_sub.indexOf(fields['subject'])] + str_index + "'" + ',';


                var book_parms = Object.keys(fields);
                book_parms.pop('signin');
                var sql = 'insert into book ( book_id,',
                    sql_values = book_id_generated;
                for (i = 0; i < book_parms.length; i++) {
                    if (fields[book_parms[i]] !== '') {
                        if (book_parms[i] !== 'edition') {
                            sql = sql + book_parms[i] + ',';
                            sql_values = sql_values + "'" + fields[book_parms[i]] + "'" + ",";
                        } else {
                            sql = sql + book_parms[i] + ',';
                            sql_values = sql_values + fields[book_parms[i]] + ",";

                        }


                    }
                }
                sql = sql + "owner_id,";
                sql_values = sql_values + "'" + req.user[0].user_id + "',";
                //adding image id
                sql = sql + "img_id";
                sql_values = sql_values + "'" + file_name + "'";
                sql = sql + ') values' + sql_values + ')';

                con.query(sql, (error, result) => {

                    if (error) { console.log(error); } else {
                        console.log("book donated!!!");
                        res.send("sucess");
                        //book saved
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
    con.query(`SELECT Distinct(title) FROM book where title like "%${req.query.title}%" `, (err, result, fields) => {
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


Router.get("/user_book_issued/", (req, res) => {
    var sql_smt = "select * from book where donated_to ='" + req.user[0]['user_id'] + "' limit " + req.query["index"] + ",12";
    con.query(sql_smt, (err, data) => {
        res.json({ "issued_books": data })
    })
})

//to get user books that he has donated
Router.get("/user_books/", (req, res) => {
    var user_book_result = "";
    sql = `SELECT * FROM book  where owner_id = '${req.user[0].user_id}' order by donated_on desc limit ${req.query['index']},12 `;
    con.query(sql, (err, result, fields) => {
        if (err) console.log(err);

        res.json({ "user_books": result });

    });

});

Router.post("/advance_search", (req, res) => {

    var sql = 'select * from book where ';
    var all_options = Object.keys(req.body);
    sql += `donated_on >= '${req.body['donation_from']}' `

    if (req.body['book_title'] != '')
        sql += ` and title like "%${req.body['book_title']}%"`;
    sql += `and edition >= ${req.body['lower_edition']} and edition < ${req.body['upper_edition']} `;
    if (req.body['owner'])
        sql += `and owner_id like '%${req.body['owner']}%' `;
    if (req.body['publisher'])
        sql += `and publisher like "%${req.body['publisher']}%"`;
    if (req.body['subject'])
        sql += `and subject = "${req.body['subject']}" `
    if (req.body['available_now']) {
        if (req.body['available_now'] == "availible")
            sql += 'and available_now = 1';
        else if (req.body['available_now'] == "not availible")
            sql += 'and available_now = 0'
    } sql = sql + " limit " + req.body['index'] + ",12"
    con.query(sql, (err, result, fields) => {
        res.json({ "book_find": result });
        console.log(sql);

    });

});

//once the book is booked
Router.get("/book_booked", checkAuthenticated, (req, res) => {

    sql12 = "select donated_to"



    sql = "select available_now,donated_to,owner_id  from book where book_id ='" + req.query['book_id'] + "'";
    con.query(sql, (err, result_) => {
        if (err) res.send(err);
        if (result_[0]['available_now'] == '0')
            //if the user is again looking for the same book when issuing
            if (result_[0]['donated_to'] == req.user[0].user_id) {

                if (result_[0]['book_anom'] == "1")
                    sql = "select address,phone_no,username from anom_user where user_id='" + result_[0]['owner_id'] + "'";
                else
                    sql = "select address,phone_no,username from user where user_id='" + result_[0]['owner_id'] + "'";
                con.query(sql, (err, result__) => {
                    if (err) res.send(err);
                    else {
                        console.log("cofimation requested again", sql, result__);
                        res.render(path.resolve(__dirname, "..", "View", "confirmation_detail.ejs"), result__[0]);
                    }
                })
            }
            else
                res.send("already reffered sorry");
        else {
            var book_issued_by_user = req.user[0]['book_issued']
            if (book_issued_by_user < 4) {
                //books less then 4
                if ((result_[0]['owner_id'] == req.user[0].user_id)) {
                    res.send("not allowed to issue own books");
                }
                else {
                    //updating book availability 
                    sql = "update book set available_now = 0 , donated_to ='" + req.user[0]['user_id'] + "' where book_id='" + req.query['book_id'] + "'";
                    con.query(sql, (err, result) => {
                        if (err) return res.send(err);
                        // searching weather the books is donated by anom
                        sql_1 = 'select book_id from book where book_anom=1'

                        con.query(sql_1, (err, result54, feilds) => {
                            book_is_anom = 0;
                            console.log(result54)
                            for (i = 0; i < result54.length; i++)
                                if (result54[i]['book_id'] == req.query['book_id']) {
                                    book_is_anom = 1;
                                    console.log("this book is anom ")
                                }
                            //    if the book belong to annomyus
                            if (book_is_anom == 0) {
                                sql = "select owner_id,Book_id,title from book where book_id ='" + req.query['book_id'] + "'";
                                con.query(sql, (err, result_) => {
                                    if (err) res.send(err);
                                    // if(result_[])
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
                                    //acknolegment to the user that book has been issued
                                    sql = "select address,phone_no,username from user where user_id='" + result_[0]['owner_id'] + "'";
                                    con.query(sql, (err, result__) => {
                                        if (err) res.send(err);
                                        else {
                                            console.log(result__[0], sql);
                                            res.render(path.resolve(__dirname, "..", "View", "confirmation_page.ejs"), result__[0]);
                                        }
                                    })
                                })

                                //updating number of books issued by user

                                con.query("update user set book_issued=" + (book_issued_by_user + 1) + " where username='" + req.user[0].username + "'", (err, result) => {
                                    if (err) console.log(err);
                                });
                            }
                            else {
                                sql = "select owner_id,Book_id,title from book where book_id ='" + req.query['book_id'] + "'";

                                con.query(sql, (err, result_) => {
                                    if (err) res.send(err);
                                    //writing into reciver notify file
                                    fs.appendFile(`C:/Users/SAMSUNG/Desktop/mongodb_project/noti/reciever/${req.user[0].user_id}.txt`, "\r\n  " + Date() + " you have book a book with name " + result_[0]['title'] + " and id " + result_[0]['Book_id'] + " from  by user " + req.user[0].username + " his phone no " + req.user[0].phone_no, (err) => {
                                        if (err) {
                                            fs.writeFile(`C:/Users/SAMSUNG/Desktop/mongodb_project/noti/reciever/${req.user[0].user_id}.txt`, "\r\n  " + Date() + " you have book a book with name " + result_[0]['title'] + " and id " + result_[0]['Book_id'] + " from  by user " + req.user[0].username + " his phone no " + req.user[0].phone_no, (err) => { console.log(err); });

                                        }
                                    });


                                    //acknolegment to the user that book has been issued
                                    sql = "select address,phone_no,username from anom_user where user_id='" + result_[0]['owner_id'] + "'";
                                    con.query(sql, (err, result__) => {
                                        if (err) res.send(err);
                                        else {
                                            res.render(path.resolve(__dirname, "..", "View", "confirmation_page_anomymus.ejs"), result__[0]);
                                        }
                                    })
                                })
                            }
                        })
                    })
                }
            }

            else
                res.render(path.join(__dirname, "..", "View", "Book_limit.ejs")), {};

        }

    })


});


//address and phone no and other data
Router.post("/update_user", (req, res) => {

    var form2 = new formidable.IncomingForm();

    form2.uploadDir = "C:/Users/SAMSUNG/Desktop/mongodb_project/Public/images/user/";

    form2.parse(req, function (err, fields, files) {
        var file_name = files['book_image'].path.split("\\")[files['book_image'].path.split("\\").length - 1] + ".png";
        fs.rename(files['book_image']['path'], path.join(__dirname, "..", "public", "images", "user", file_name), (err) => { if (err) console.log("file not saved", err); });

        if (files['book_image'].name !== "") {
            sql = "update user set address='" + fields['address'] + "' ,phone_no = '" + fields['phone'] + "',prof_img_id = '" + file_name + "' where username='" + req.user[0].username + "'";
            con.query(sql, (err, result) => {

                res.redirect("/profile");

            });
        }

        else {
            sql = "update user set address='" + fields['address'] + "' ,phone_no = '" + fields['phone'] + "' where username='" + req.user[0].username + "'";
            con.query(sql, (err, result) => {
                res.send(sql);
            });
        }



    })
});

//to remove data
//authentication is to be checked
Router.get("/delete", (req, res) => {
    //validation is left


    var sql = 'DELETE FROM book WHERE book_id ="' + req.query.title + '"';
    console.log("got it");
    con.query(sql, function (err, result) {
        if (err) return console.log(sql);
        res.send("Number of records deleted: " + result.affectedRows);

    });
});

//changing book details
Router.post("/book_update/", (req, res) => {

    //check for subject change

    var form2 = new formidable.IncomingForm();

    form2.uploadDir = "C:/Users/SAMSUNG/Desktop/mongodb_project/Public/images/books/";

    form2.parse(req, function (err, fields, files) {
        //    console

        var file_name = false;
        if (files['book_image'].name !== '') {
            file_name = files['book_image'].path.split("\\")[files['book_image'].path.split("\\").length - 1] + ".png";
            fs.rename(files['book_image']['path'], path.join(__dirname, "..", "public", "images", "books", file_name), (err) => { if (err) console.log("file not saved", err); });
        }
        sub_query = "select subject from book where book_id='" + fields['book_id'] + "'"

        con.query(sub_query, (err, result) => {
            if (result[0]['subject'] == fields['subject']) {
                if (!file_name) {
                    new_sql = "update book set title='" + fields['title'] + "',publisher='" + fields['publisher'] + "', author='" + fields['author'] + "', edition=" + fields['edition'] + ",for_year='" + fields['for_year'] + "," + "' where book_id='" + fields['book_id'] + "'";
                }
                else {
                    new_sql = "update book set title='" + fields['title'] + "',img_id='" + file_name + "',publisher='" + fields['publisher'] + "', author='" + fields['author'] + "', edition=" + fields['edition'] + ",for_year='" + fields['for_year'] + "," + "' where book_id='" + fields['book_id'] + "'";

                }
                con.query(new_sql, (err, result_up) => { if (err) { console.log(err); } });
                res.redirect("/profile");
            }


            else {
                // for getting older image id
                if (!file_name) {
                    sql_img = "select img_id from book where book_id='" + fields['book_id'] + "'";
                    con.query(sql_img, (err, img_result, feilds23) => {
                        if (err) return console.log(err);
                        file_name = img_result[0]['img_id'];
                    })
                }





                //subject books list to be updated
                const valid_sub = ['maths', 'english', 'science', 'physics', 'chemistry', 'biology', 'communication', 'mechinacal', 'electronics', 'electrical', 'civil'];
                if (valid_sub.find(element => element.localeCompare(fields['subject'])).localeCompare(fields['subject']) == 0) { return res.send("invalid books subject"); }
                var book_pre_index = 0;
                //for creating book_id
                var sql_sub_index = "select book_id from book where subject='" + fields['subject'] + "' order by book_id desc limit 1";
                con.query(sql_sub_index, (error, result) => {
                    if (error) { console.log(error); return res.send("book submition failed"); }
                    else {
                        if (result == 0) { book_pre_index = 0; }
                        else {
                            book_pre_index = parseInt(result[0]['book_id'].slice(2)) + 1;
                        }

                        const sub_acro = ['mh', "en", 'sc', 'py', 'ch', 'bo', 'cm', 'me', 'ec', 'et', 'cl'];
                        str_index = ''
                        if (book_pre_index < 10)
                            str_index = "00" + String(book_pre_index)
                        else if (book_pre_index < 100)
                            str_index = "0" + String(book_pre_index)
                        else if (book_pre_index < 1000)
                            str_index = "" + String(book_pre_index)



                        var book_id_generated = " ('" + sub_acro[valid_sub.indexOf(fields['subject'])] + str_index + "'" + ',';

                        var book_parms = Object.keys(fields);
                        book_parms.pop('signin');
                        var sql = 'insert into book ( book_id,',
                            sql_values = book_id_generated;
                        for (i = 0; i < book_parms.length; i++) {

                            if (fields[book_parms[i]] !== '') {
                                if (book_parms[i] == 'book_id') { continue; }

                                else if (book_parms[i] !== 'edition') {
                                    //sql is coloumn to enter the values
                                    sql = sql + book_parms[i] + ',';

                                    //sql_Value is for values to enter
                                    sql_values = sql_values + "'" + fields[book_parms[i]] + "'" + ",";
                                } else {
                                    //since edition is int type 
                                    sql = sql + book_parms[i] + ',';
                                    sql_values = sql_values + fields[book_parms[i]] + ",";

                                }


                            }
                        }
                        //dont need owner id since it is already made
                        sql = sql + "owner_id,";
                        sql_values = sql_values + "'" + req.user[0].user_id + "',";


                        //when even the image is changed
                        if (file_name) {
                            sql = sql + "img_id,";
                            sql_values = sql_values + "'" + file_name + "',";
                        }
                        sql = sql.slice(0, sql.length - 1) + ') values' + sql_values.slice(0, sql_values.length - 1) + ')';
                        console.log(sql);
                        con.query(sql, (error, result) => {

                            if (error) { console.log(error); } else {
                                console.log("book donated!!!");
                                res.redirect("/profile");
                            }

                        });
                    }
                });

                // deleting the last recored
                del_sql = "delete from book where book_id ='" + fields['book_id'] + "'";
                con.query(del_sql, (err, res_) => { if (err) { console.log(err); } });

            }
        })

    });


    //new book registration
    Router.post("/anom_book_entry/", (req, res) => {
        //subject books list to be updated


        var uniq_userID = uuidv1();
        // to connect the anom user with its books for verificatoin
        //    var password =  uuidv1();
        var form = new formidable.IncomingForm();

        form.uploadDir = "C:/Users/SAMSUNG/Desktop/mongodb_project/Public/images/anom_user/";

        form.parse(req, function (err, fields, files) {
            var file_name = files['book_image'].path.split("\\")[files['book_image'].path.split("\\").length - 1] + ".png";


            fs.rename(files['book_image']['path'], path.join(__dirname, "..", "public", "images", "anom_user", file_name), (err) => { console.log(err); });

            const valid_sub = ['maths', 'english', 'science', 'physics', 'chemistry', 'biology', 'communication', 'mechinacal', 'electronics', 'electrical', 'civil'];

            if (valid_sub.find(element => element.localeCompare(fields['subject'])).localeCompare(fields['subject']) == 0) {
                return res.send("invalid books subject");
            }
            var book_pre_index = 0;
            var sql_sub_index = "select book_id from book where subject='" + fields['subject'] + "' order by book_id desc limit 1";
            con.query(sql_sub_index, (error, result) => {
                if (error) { console.log(error); return res.send("book submition failed"); } else {
                    if (result == 0) { book_pre_index = 1; } else { book_pre_index = parseInt(result[0]['book_id'].slice(2)) + 1; }
                    const sub_acro = ['mh', "en", 'sc', 'py', 'ch', 'bo', 'cm', 'me', 'ec', 'et', 'cl'];
                    str_index = ''
                    if (book_pre_index < 10)
                        str_index = "00" + String(book_pre_index)
                    else if (book_pre_index < 100)
                        str_index = "0" + String(book_pre_index)
                    else if (book_pre_index < 1000)
                        str_index = "" + String(book_pre_index)
                    var book_id_generated = " ('" + sub_acro[valid_sub.indexOf(fields['subject'])] + str_index + "'" + ',';


                    var book_parms = Object.keys(fields);
                    book_parms.pop('signin');
                    var sql = 'insert into book ( book_id,',
                        sql_values = book_id_generated;
                    for (i = 0; i < book_parms.length; i++) {
                        if (fields[book_parms[i]] !== '') {
                            if (book_parms[i] == 'username' || book_parms[i] == 'phone_no') {
                                continue;
                            }

                            if (book_parms[i] !== 'edition') {
                                sql = sql + book_parms[i] + ',';
                                sql_values = sql_values + "'" + fields[book_parms[i]] + "'" + ",";
                            } else {
                                sql = sql + book_parms[i] + ',';
                                sql_values = sql_values + fields[book_parms[i]] + ",";

                            }


                        }
                    }
                    sql = sql + "owner_id,";
                    sql_values = sql_values + "'" + uniq_userID + "',";
                    //adding image id
                    sql = sql + "img_id,";
                    sql_values = sql_values + "'" + file_name + "'";

                    sql = sql + "book_anom";
                    sql_values = sql_values + ",1";

                    sql = sql + ') values ' + sql_values + ')';


                    con.query(sql, (error, result) => {

                        if (error) { console.log(error); } else {
                            console.log("book donated!!!");

                            // res.send("sucess");
                            //book saved
                        }

                    });
                }
            });


            var file_name2 = files['user_image'].path.split("\\")[files['user_image'].path.split("\\").length - 1] + ".png";

            fs.rename(files['user_image']['path'], path.join(__dirname, "..", "public", "images", "anom_user", file_name2), (err) => { if (err) console.log("file not saved", err); });


            con.query(`SELECT * FROM anom_user where username ="${fields['username']}" `, (err, result, fields_) => {
                if (err) next(err);
                if (result.length > 0)
                // res.redirect("/anom_donate");
                {
                    console.log(result)
                    res.send("userNameTaken")
                } else {

                    function mkuser() {
                        con.query(`INSERT into anom_user (user_id,username,email,password,address,phone_no,prof_img_id)  values("${uniq_userID}","${fields['username']}","-","-","-","${fields['phone_no']}","${file_name2}")`, (err, result, fields) => {
                            if (err) {
                                mkuser();
                                console.log("err", err);
                            }
                            else {
                                console.log("new account created by ", req.body.username);
                                // res.redirect("/index");
                                res.send("book submitted sucessfully ");
                            }
                        });
                    }
                    mkuser();
                }
            });

        });





    });

})

module.exports = Router;
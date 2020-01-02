const express = require("express");
const Route = express.Router();
const user_details = require("../model/mongoose_user");
const book_details = require("../model/mongoose_book");
const user_books_adb = require("../Public/js/all_book_by_user");

Route.post("/signup", (req, res) => {
    user_details.find({ "username": req.body.username }, { "_id": 1 }).exec((error, result) => {
        if (!error) {
            if (Object.values(result).length > 0) {
                if (req.baseUrl == "localhost") {
                    var req_url = "http://localhost:5400";
                }
                else {
                    var req_url = "https://" + req.baseUrl;
                }
                res.redirect(req_url + "/signup_fail");
            }
            else {
                var data = user_details({ "username": req.body.username, "email": req.body.email, "password": req.body.password });
                data.save((error) => {
                    if (error) res.send(error);
                    else
                        res.send("saved");

                })
            }
        }
    }
    )
});



Route.post("/login/", (req, res) => {

    user_details.find({ "username": req.body.username, "password": req.body.password }, { "username": 1, }, (error, employee) => {
        if (!error) {
            if (Object.values(employee).length == 1) { res.send("sucess"); }
            else {
                if (req.baseUrl == "localhost") {
                    var req_url = "http://localhost:5400";
                }
                else {
                    var req_url = "https://" + req.baseUrl;
                }
                res.redirect(req_url + "/login_fail");
            }
        }
        else { res.send(error); }
    });

});


















Route.post("/find/", (req, res) => {

    user_details.find({}, { "username": 1, "_id": 0 }, (error, employee) => {
        if (!error) {
            var list_ = [];
            for (i = 0; i < Object.values(employee).length; i++)
                list_.push(Object.values(employee)[i]["username"]);
            res.send(list_);
        }
        else { res.send(error); }
    });

});



Route.get("/login/", (req, res) => {

    user_details.find({ "username": req.query.username, "password": req.query.password }, { "username": 1, }, (error, employee) => {
        if (!error) {
            if (Object.values(employee).length > 0) { res.send("sucess"); }
            else { res.send("failed"); console.log(req.params); }
        }
        else { res.send(error); }
    });

});


Route.get("/namesearch/", (req, res) => {
    user_details.find({ "username": req.query.username }, { "username": 1 }, (error, result) => {
        if (!error) if (Object.values(result).length == 1) {
            // res.setHeader("Content-Type: text/plain; charset=utf-8") ;
            res.send("0");
        }
        else { res.send("1"); }
    });

});







Route.post("/book_entry/insert/", (req, res) => {
    var date = new Date;

    var data = book_details({ "book_id": req.body.book_id, "title": req.body.book_title, "edition": req.body.book_edition, "owner_id": req.body.book_owner_id, "donation_date": date, "book_subject": req.body.book_sub })
    console.log(data);
    data.save((error) => {
        if (!error) { console.log("saved"); }
        else {
            console.log(error);
        }
    });
    res.send("saved");
});



Route.use("/user_book", user_books_adb);
module.exports = Route;



// var data = new user_details({"username":"hitesh","email":"hitesh08gmail.com","password":"135","phone":"3434124515"});
//     data.save((error) =>{
//         if(!error)
//             { return console.log("saved"); }
//         else{ return console.log(error.message);
//         }});
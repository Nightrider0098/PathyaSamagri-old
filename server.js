const express = require("express");
const app = express();
const path = require("path");
//const mongoose_route = require("./Route/mongoose")   all routes are now according to mysql
const mysql_route = require("./mysql/mysql-page");
const con = require("./mysql/mysql-connection");

const port = process.env.PORT || 5400;
const bodyParser = require("body-parser");
const session = require('express-session');
const cookie_parser = require("cookie-parser");
const passport = require('passport');
// const multer = require("multer");
app.use(express.static(path.join(__dirname, "\\Public\\")));

app.use(cookie_parser());
// app.use(multer);     used for uploadin multipart/form-data in forms like videos etc
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var MySQLStore = require('express-mysql-session')(session);

var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'book_store'
};

var sessionStore = new MySQLStore(options);

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));
//middleware to be used for passport 
app.use(passport.initialize());
app.use(passport.session());


//function containing login query
require("./passport")(passport);


//middle ware to be used for checking if used is already logged in and trying to used signin or signup form
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.user[0].username, " has requested ");
        return next();
    } else
        res.redirect("/login");
};

//check if the used is trying to access something for which he has to register
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return res.send("your are already authenticated");
    else next();
};


app.get("/", (req, res) => { res.sendFile(path.resolve(__dirname, "View", "index.html")); });


//dont used (req,res)=>{passport.authenticat()} will cause an error
app.post("/authenticate/", passport.authenticate('local', { failureRedirect: '/login_fail' }),
    function(req, res) {
        res.redirect('/bookentry');
        console.log(req.user);

    }
);


app.get("/logout", checkAuthenticated, (req, res) => {
    con.query(`delete  FROM sessions where session_id ="${req.cookies.session_cookie_name.slice(2,32+2)}"`, (err, result, fields) => {

        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("user with cookes", req.cookies.session_cookie_name.slice(2, 32 + 2), " logged out");
            res.redirect("/");

        }
    });
});


//to be used only in development mode  
app.get("/clr", (req, res) => {
    con.query(`delete  FROM sessions`, (err, result, fields) => {

        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send("all clear");

        }
    });
});


//all login signup routes

app.use("/book_entry/", checkAuthenticated, (req, res, next) => {
    res.sendFile(path.resolve(__dirname, "View", "book_entry.html"));
});




app.use("/signup/", checkNotAuthenticated, (req, res, next) => {
    res.sendFile(path.resolve(__dirname, "View", "signup.html"));
});
app.use("/signup_fail/", checkNotAuthenticated, (req, res, next) => {
    res.sendFile(path.resolve(__dirname, "View", "signup_fail.html"));
});

app.use("/login/", checkNotAuthenticated, (req, res, next) => {
    console.log(req.user);
    res.sendFile(path.resolve(__dirname, "View", "login.html"));
});

app.use("/login_fail/", checkNotAuthenticated, (req, res, next) => {
    res.sendFile(path.resolve(__dirname, "View", "login_fail.html"));
});


//all mysql routes inlcudes the route for finding book and its hints
app.use("/mysql", mysql_route);


app.use("/book_search/", (req, res, next) => {
    res.sendFile(path.resolve(__dirname, "View", "book-search.html"));
});

app.use("/book_advance/", (req, res, next) => {
    res.sendFile(path.resolve(__dirname, "View" , "book-search-advance.html"));
});

app.use("/bookentry/", checkAuthenticated, (req, res) => {
    res.sendFile(path.resolve(__dirname, "View", "book_entry.html"));
});

app.use("/profile/", checkAuthenticated, (req, res) => {
    res.sendFile(path.resolve(__dirname, "View", "user-profile.html"));
});

app.listen(port, () => { console.log(`listining on port ${port}`); });
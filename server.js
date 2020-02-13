const fs = require('fs')
const express = require("express");
const app = express();
const path = require("path");
const mysql_route = require("./mysql/mysql-page");
const con = require("./mysql/mysql-connection");
const port = process.env.PORT || 5400;
const bodyParser = require("body-parser");
const session = require('express-session');
const cookie_parser = require("cookie-parser");
const passport = require('passport');
app.use(express.static(path.join(__dirname, "\\Public\\")));
app.set('view engine', 'ejs');
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    next();
})

app.use(cookie_parser());
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


function checkAllDetails(req, res, next) {
    sql = "select address,phone_no from user where username='" + req.user[0].username + "'";
    con.query(sql, (err, result) => {
        if ((result[0]['address'] == null && result[0]['phone_no'] == null)) {
            res.redirect('/profile_info');
        }
        else
            next();
    });
}



app.get("/", (req, res) => { 
    var user_verfiled = req.isAuthenticated().toString();
    res.render(path.resolve(__dirname, "View", "index.ejs"),{ "Log_message": user_verfiled }) });

app.get("/profile_info", (req, res) => { res.render(path.resolve(__dirname, "View", "profile_info.ejs"), { "data": req.user[0] }); }); 

app.get("/book_edit/", (req, res) => {
    var sql = "select * from book where book_id ='" + req.query['book_id'] + "'";
    // res.send("re");
    con.query(sql, (err, result) => {

        //   console.log(err,result[0],sql,path.resolve(__dirname, "View", "book_edit.ejs"));
        if (result[0] == undefined) { return res.send("Book is changed or no such book Exits"); }
        else
            res.render(path.resolve("View", "book_edit.ejs"), result[0]);
        console.log(result[0]);
    })
});


//dont used (req,res)=>{passport.authenticat()} will cause an error
app.post("/authenticate/", passport.authenticate('local', { failureRedirect: '/login_fail' }),
    function (req, res) {
        res.redirect('/');
    }
);

app.get("/logout", checkAuthenticated, (req, res) => {
    con.query(`delete  FROM sessions where session_id ="${req.cookies.session_cookie_name.slice(2, 32 + 2)}"`, (err, result, fields) => {

        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("user with cookes", req.cookies.session_cookie_name.slice(2, 32 + 2), " logged out");
            res.redirect("/");

        }
    });
});


app.get("/notif_user/", checkAuthenticated, (req, res) => {
    fs.readFile(`C:/Users/SAMSUNG/Desktop/mongodb_project/noti/${req.user[0].username}.txt`, (err, data) => { res.json({ "notif": data.toString() }); })
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


app.use("/book_entry/", checkAuthenticated, checkAllDetails, (req, res) => {
    res.sendFile(path.resolve(__dirname, "View", "book_entry.html"));
});

app.use("/profile/", checkAuthenticated, (req, res) => {
    res.render(path.resolve(__dirname, "View", "user-profile.ejs"), { "details": req.user[0] });
});

app.use("/user_noti/", (req, res) => {

    fs.readFile("C:/Users/SAMSUNG/Desktop/mongodb_project/noti/doner/" + req.user[0]['user_id'] + ".txt", (err, data) => {

        fs.readFile("C:/Users/SAMSUNG/Desktop/mongodb_project/noti/reciever/" + req.user[0]['user_id'] + ".txt", (err, data2) => {

            if (data2 == undefined && data == undefined)
                res.send({ "user_noti": '{}' });

            else
                res.send({ 'user_noti': data + " /n" + data2 });
        })
    });
})
app.get("/user_details/", (req, res) => {

    res.json({ "username": req.user[0]['username'], 'address': req.user[0]['address'], 'email': req.user[0]['email'], "phone_no": req.user[0]['phone_no'], 'book_issued': req.user[0]['book_issued'], 'book_donated': req.user[0]['book_donated'], "book_issued": req.user[0]['book_issued'], "prof_img_id": req.user[0]['prof_img_id'] });

})

app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, "View", "err_404.html"));
});

app.listen(port, () => { console.log(`listining on port ${port}`); });


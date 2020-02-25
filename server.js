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
app.use(bodyParser.urlencoded({
    extended: true
}));
var MySQLStore = require('express-mysql-session')(session);

var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'MITohnasan',
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
        } else
            next();
    });
}


function last_login(req, res, next) {
    if (req.isAuthenticated()) { //remember that this will not facilate on the spot notification to user means if the user logged and some othe user request then notification will not be displayed
        pre_login = req.user[0].last_login;
        last_noti = req.user[0].last_noti;
        con.query("update user set last_login=current_timestamp where user_id='"+req.user[0].user_id+"'")
        if (last_noti !== null) {
            console.log("last login was on ", pre_login, "and last noti", last_noti);
            if(new Date(pre_login)>new Date(last_noti))
          {  console.log("needs notification pls")

        
        }
        else
        console.log("notification are not needed")
        }
        else
        console.log("notification are not needed as last no notification")


    }
    
    next();

}
app.get("/", last_login, (req, res) => {
    var user_verfiled = req.isAuthenticated().toString();
    res.render(path.resolve(__dirname, "View", "index.ejs"), {
        "Log_message": user_verfiled
    })
});

app.get("/unused", (req, res) => {
    var user_verfiled = req.isAuthenticated().toString();
    res.render(path.resolve(__dirname, "View", "index_only_unused.ejs"), {
        "Log_message": user_verfiled
    })
});
app.get("/unused1", (req, res) => {
    var user_verfiled = req.isAuthenticated().toString();
    res.render(path.resolve(__dirname, "View", "index_only_unused copy.ejs"), {
        "Log_message": user_verfiled
    })
});

app.get("/chat_bot", (req, res) => {
    // ${req.user[0].username}/
    function abc() {
        fs.readFile(`C:/Users/Dhruvam/Desktop/mongodb_project/chat_bot/hitesh.txt`, (err, data) => {
            if (err) {
                console.log(err)
            }
            text_data = data.toString().split("\r\n");
            res_Data = ""
            for (var i = 0; i < text_data.length; i++) {
                curr_str = text_data[i]
                curr_str_id = curr_str[0]
                if (curr_str_id == 0)
                    res_Data += ` <div class="alert  " style="    background-color: #92999f!important;">
<img src="images/login/signin-image.jpg" style=" max-width: 35px;
width: 100%;
margin-right: 20px;
border-radius: 50%;">${curr_str.slice(1)}
<button type="button" class="close" data-dismiss="alert">&times;</button>
</div>`
                else
                    res_Data += `<div class="alert  " style="    background-color: #3b9357!important;">
<img src="images/login/signin-image.jpg" style=" max-width: 35px;
width: 100%;
margin-right: 20px;
border-radius: 50%;">${curr_str.slice(1)}
<button type="button" class="close" data-dismiss="alert">&times;</button>
</div>`

            }

        })
        fs.readFile(`C:/Users/Dhruvam/Desktop/mongodb_project/chat_bot/dinesh.txt`, (err, data) => {
            if (err) {
                console.log(err)
            }
            text_data = data.toString().split("\r\n");
            res_Data1 = ""
            for (var i = 0; i < text_data.length; i++) {
                curr_str = text_data[i]
                curr_str_id = curr_str[0]
                if (curr_str_id == 0)
                    res_Data1 += ` <div class="alert  " style="    background-color: #92999f!important;">
<img src="images/login/signin-image.jpg" style=" max-width: 35px;
width: 100%;
margin-right: 20px;
border-radius: 50%;">${curr_str.slice(1)}
<button type="button" class="close" data-dismiss="alert">&times;</button>
</div>`
                else
                    res_Data1 += `<div class="alert  " style="    background-color: #3b9357!important;">
<img src="images/login/signin-image.jpg" style=" max-width: 35px;
width: 100%;
margin-right: 20px;
border-radius: 50%;">${curr_str.slice(1)}
<button type="button" class="close" data-dismiss="alert">&times;</button>
</div>`

            }

        })
        fs.readFile(`C:/Users/Dhruvam/Desktop/mongodb_project/chat_bot/lokesh.txt`, (err, data) => {
            if (err) {
                console.log(err)
            }
            text_data = data.toString().split("\r\n");
            res_Data2 = ""
            for (var i = 0; i < text_data.length; i++) {
                curr_str = text_data[i]
                curr_str_id = curr_str[0]
                if (curr_str_id == 0)
                    res_Data2 += ` <div class="alert  " style="    background-color: #92999f!important;">
<img src="images/login/signin-image.jpg" style=" max-width: 35px;
width: 100%;
margin-right: 20px;
border-radius: 50%;">${curr_str.slice(1)}
<button type="button" class="close" data-dismiss="alert">&times;</button>
</div>`
                else
                    res_Data2 += `<div class="alert  " style="    background-color: #3b9357!important;">
<img src="images/login/signin-image.jpg" style=" max-width: 35px;
width: 100%;
margin-right: 20px;
border-radius: 50%;">${curr_str.slice(1)}
<button type="button" class="close" data-dismiss="alert">&times;</button>
</div>`

            }

        })
        fs.readFile(`C:/Users/Dhruvam/Desktop/mongodb_project/chat_bot/raman.txt`, (err, data) => {
            if (err) {
                console.log(err)
            }
            text_data = data.toString().split("\r\n");
            res_Data3 = ""
            for (var i = 0; i < text_data.length; i++) {
                curr_str = text_data[i]
                curr_str_id = curr_str[0]
                if (curr_str_id == 0)
                    res_Data3 += ` <div class="alert  " style="    background-color: #92999f!important;">
<img src="images/login/signin-image.jpg" style=" max-width: 35px;
width: 100%;
margin-right: 20px;
border-radius: 50%;">${curr_str.slice(1)}
<button type="button" class="close" data-dismiss="alert">&times;</button>
</div>`
                else
                    res_Data3 += `<div class="alert  " style="    background-color: #3b9357!important;">
<img src="images/login/signin-image.jpg" style=" max-width: 35px;
width: 100%;
margin-right: 20px;
border-radius: 50%;">${curr_str.slice(1)}
<button type="button" class="close" data-dismiss="alert">&times;</button>
</div>`

            }

        })
        fs.readFile(`C:/Users/Dhruvam/Desktop/mongodb_project/chat_bot/jainish.txt`, (err, data) => {
            if (err) {
                console.log(err)
            }
            text_data = data.toString().split("\r\n");
            res_Data4 = ""
            for (var i = 0; i < text_data.length; i++) {
                curr_str = text_data[i]
                curr_str_id = curr_str[0]
                if (curr_str_id == 0)
                    res_Data4 += ` <div class="alert  " style="    background-color: #92999f!important;">
<img src="images/login/signin-image.jpg" style=" max-width: 35px;
width: 100%;
margin-right: 20px;
border-radius: 50%;">${curr_str.slice(1)}
<button type="button" class="close" data-dismiss="alert">&times;</button>
</div>`
                else
                    res_Data4 += `<div class="alert  " style="    background-color: #3b9357!important;">
<img src="images/login/signin-image.jpg" style=" max-width: 35px;
width: 100%;
margin-right: 20px;
border-radius: 50%;">${curr_str.slice(1)}
<button type="button" class="close" data-dismiss="alert">&times;</button>
</div>`

            }

        })
    }
    abc()
    setTimeout(adc, 100)

    function adc() {
        res.render(path.resolve(__dirname, "View", "text.ejs"), {
            "data": res_Data,
            "data1": res_Data1,
            "data2": res_Data2,
            "data3": res_Data3,
            "data4": res_Data4
        });
    }
});

app.get("/chat_bot_message", (req, res) => {
    var res_Data = ""
    var res_Data1 = ""
    fs.readFile(`C:/Users/Dhruvam/Desktop/mongodb_project/chat_bot/hitesh.txt`, (err, data) => {
        if (err) {
            console.log(err)
        }
        text_data = data.toString().split("\r\n");
        for (var i = 0; i < text_data.length; i++) {
            curr_str = text_data[i]
            curr_str_id = curr_str[0]
            if (curr_str_id == 0)
                res_Data += ` <div class="alert  " style="    background-color: #92999f!important;">
<img src="images/login/signin-image.jpg" style=" max-width: 35px;
width: 100%;
margin-right: 20px;
border-radius: 50%;">${curr_str.slice(1)}
<button type="button" class="close" data-dismiss="alert">&times;</button>
</div>`
            else
                res_Data += `<div class="alert  " style="    background-color: #3b9357!important;">
<img src="images/login/signin-image.jpg" style=" max-width: 35px;
width: 100%;
margin-right: 20px;
border-radius: 50%;">${curr_str.slice(1)}
<button type="button" class="close" data-dismiss="alert">&times;</button>
</div>`

        }

        fs.readFile(`C:/Users/Dhruvam/Desktop/mongodb_project/chat_bot/dinesh.txt`, (err, data) => {
            if (err) {
                console.log(err)
            }
            text_data = data.toString().split("\r\n");
            for (var i = 0; i < text_data.length; i++) {
                curr_str = text_data[i]
                curr_str_id = curr_str[0]
                if (curr_str_id == 0)
                    res_Data1 += ` <div class="alert  " style="    background-color: #92999f!important;">
    <img src="images/login/signin-image.jpg" style=" max-width: 35px;
    width: 100%;
    margin-right: 20px;
    border-radius: 50%;">${curr_str.slice(1)}
    <button type="button" class="close" data-dismiss="alert">&times;</button>
    </div>`
                else
                    res_Data1 += `<div class="alert  " style="    background-color: #3b9357!important;">
    <img src="images/login/signin-image.jpg" style=" max-width: 35px;
    width: 100%;
    margin-right: 20px;
    border-radius: 50%;">${curr_str.slice(1)}
    <button type="button" class="close" data-dismiss="alert">&times;</button>
    </div>`

            }
            res.json({
                "data": res_Data,
                "data1": res_Data1
            })


        })



    });
})
app.get("/chat_bot_message1", (req, res) => {
    // ${req.user[0].username}/
    var res_Data1 = ""


    fs.readFile(`C:/Users/Dhruvam/Desktop/mongodb_project/chat_bot/dinesh.txt`, (err, data) => {
        if (err) {
            console.log(err)
        }
        text_data = data.toString().split("\r\n");

        for (var i = 0; i < text_data.length; i++) {
            curr_str = text_data[i]
            curr_str_id = curr_str[0]
            if (curr_str_id == 0)
                res_Data1 += ` <div class="alert  " style="    background-color: #92999f!important;">
<img src="images/login/signin-image.jpg" style=" max-width: 35px;
width: 100%;
margin-right: 20px;
border-radius: 50%;">${curr_str.slice(1)}
<button type="button" class="close" data-dismiss="alert">&times;</button>
</div>`
            else
                res_Data1 += `<div class="alert  " style="    background-color: #3b9357!important;">
<img src="images/login/signin-image.jpg" style=" max-width: 35px;
width: 100%;
margin-right: 20px;
border-radius: 50%;">${curr_str.slice(1)}
<button type="button" class="close" data-dismiss="alert">&times;</button>
</div>`

        }
        res.json({
            "data1": res_Data1
        })

    })

});

app.get("/profile_info", (req, res) => {
    res.render(path.resolve(__dirname, "View", "profile_info.ejs"), {
        "data": req.user[0]
    });
});

app.get("/book_edit/", (req, res) => {
    var sql = "select * from book where book_id ='" + req.query['book_id'] + "'";
    // res.send("re");
    con.query(sql, (err, result) => {

        //   console.log(err,result[0],sql,path.resolve(__dirname, "View", "book_edit.ejs"));
        if (result[0] == undefined) {
            return res.send("Book is changed or no such book Exits");
        } else
            res.render(path.resolve("View", "book_edit.ejs"), result[0]);
        console.log(result[0]);
    })
});


//dont used (req,res)=>{passport.authenticat()} will cause an error
app.post("/authenticate/", passport.authenticate('local', {
        failureRedirect: '/login_fail'
    }),
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
    fs.readFile(`C:/Users/Dhruvam/Desktop/mongodb_project/noti/${req.user[0].username}.txt`, (err, data) => {
        res.json({
            "notif": data.toString()
        });
    })
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
    res.render(path.resolve(__dirname, "View", "user-profile.ejs"), {
        "details": req.user[0]
    });
});

app.use("/user_noti/", (req, res) => {

    fs.readFile("C:/Users/Dhruvam/Desktop/mongodb_project/noti/doner/" + req.user[0]['user_id'] + ".txt", (err, data) => {

        fs.readFile("C:/Users/Dhruvam/Desktop/mongodb_project/noti/reciever/" + req.user[0]['user_id'] + ".txt", (err, data2) => {

            if (data2 == undefined && data == undefined)
                res.send({
                    "user_noti": '{}'
                });

            else
                res.send({
                    'user_noti': data + " /n" + data2
                });
        })
    });
})
app.get("/user_details/", (req, res) => {

    res.json({
        "username": req.user[0]['username'],
        'address': req.user[0]['address'],
        'email': req.user[0]['email'],
        "phone_no": req.user[0]['phone_no'],
        'book_issued': req.user[0]['book_issued'],
        'book_donated': req.user[0]['book_donated'],
        "book_issued": req.user[0]['book_issued'],
        "prof_img_id": req.user[0]['prof_img_id']
    });

})


app.use("/anom_donate/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "View", "anom_Donate.html"), );
});

app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, "View", "err_404.html"));
});

app.listen(port, () => {
    console.log(`listining on port ${port}`);
});
const express = require("express");
const app = express();
const path = require("path");
const mongoose_route = require("./Route/mongoose")
// const mysql_route = require("./mysql/mysql-page");
const port = process.env.PORT || 5400;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "\\Public\\")));
app.use(express.static(path.join(__dirname,"\\login-signup\\")))

app.use("/signup/", (req, res, next) => {
    res.sendFile("C:\\Users\\Admin\\Desktop\\this year project\\collage project - Mangodb\\Public\\login-signup\\signup.html"); 
});
app.use("/signup_fail/", (req, res, next) => {
    res.sendFile("C:\\Users\\Admin\\Desktop\\this year project\\collage project - Mangodb\\Public\\login-signup\\signup_fail.html"); 
});

app.use("/login/", (req, res, next) => {
    res.sendFile("C:\\Users\\Admin\\Desktop\\this year project\\collage project - Mangodb\\Public\\login-signup\\login.html"); 
});


app.use("/login_fail/", (req, res, next) => {
    res.sendFile("C:\\Users\\Admin\\Desktop\\this year project\\collage project - Mangodb\\Public\\login-signup\\login_fail.html"); 
});

app.use("/mongo", (req, res, next) => {
    res.sendFile("C:\\Users\\Admin\\Desktop\\this year project\\collage project - Mangodb\\View\\Search_book.html");
});

app.use("/mongoose", mongoose_route);


app.use("/bookentry/", (req,res)=>{
    res.sendFile("C:\\Users\\Admin\\Desktop\\this year project\\collage project - Mangodb\\View\\book_entry.html");
});

app.use("/signup", (req, res, next) => {
    res.sendFile("C:\\Users\\Admin\\Desktop\\this year project\\collage project - Mangodb\\View\\signup.html"); 
});


app.use("/homepage/s", (req, res, next) => {
    res.sendFile("C:\\Users\\Admin\\Desktop\\this year project\\collage project - Mangodb\\View\\userhomepage.html");
});



app.listen(port, () => { console.log(`listining on port ${port}`); });


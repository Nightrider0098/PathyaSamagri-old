const express = require("express");
const app = express();
const path = require("path");
const mongoose_route = require("./Route/mongoose")
// const mysql_route = require("./mysql/mysql-page");
const port = process.env.PORT || 5400;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "\\login\\")));

app.use("/login", (req, res, next) => {
    res.sendFile("C:\\Users\\Admin\\Desktop\\this year project\\collage project - Mangodb\\View\\index.html"); process.env.current_url =  req.get('host');
    console.log(process.env.current_url);
});

app.use("/mongo", (req, res, next) => {
    res.sendFile("C:\\Users\\Admin\\Desktop\\this year project\\collage project - Mangodb\\View\\Search_book.html"); process.env.current_url =  req.get('host');
    console.log(process.env.current_url);
});

app.use("/mongoose", mongoose_route);


app.use("/signup", (req, res, next) => {
    res.sendFile("C:\\Users\\Admin\\Desktop\\this year project\\collage project\\View\\signup.html"); process.env.current_url = req.get('host');
    console.log(process.env.current_url);
});


// app.use("/mysql", mysql_route);


app.listen(port, () => { console.log(`listining on port ${port}`); });
// console.log();

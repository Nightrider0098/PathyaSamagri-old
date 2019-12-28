const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/mangotube", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once("open", () => { console.log("connected to mongodb server"); }).on("error", () => { console.log("your error"); });
module.exports = mongoose;
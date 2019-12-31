const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://localhost/`, { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true },(error)=>{if(error)console.log(error)});
mongoose.connection.once("open", () => { console.log("connected to mongodb server"); }).on("error",  (error)=>{{console.log(error)}});
module.exports = mongoose;
const express = require("express");
const Route = express.Router();
const user_collection_1 = require("../model/mongoose_user");

Route.post("/find/", (req, res) => {
    
    user_collection_1.find({ "username":`${req.body.username}`},{"username":1,"_id":0}, (error, employee) => { if(!error){
        var list_ = [];
            for (i=0 ;i<Object.values(employee).length ;i++) 
            list_.push( Object.values(employee)[i]["username"]);
            res.send(list_);
        }
        else {res.send(error); }});

});



Route.post("/login/", (req, res) => {
    
    user_collection_1.find({ "username": req.body.username,"password": req.body.password},{"username":1,}, (error, employee) => { if(!error){
            if(Object.values(employee).length ==1)
            {res.send("sucess");}
            else{res.send("failed");}
        }
        else {res.send(error); }});

});

Route.get("/login/", (req, res) => {
    
    user_collection_1.find({ "username": req.params.username,"password": req.params.password},{"username":1,}, (error, employee) => { if(!error){
            if(Object.values(employee).length ==1)
            {res.send("sucess");}
            else{res.send("failed");}
        }
        else {res.send(error); }});

});


module.exports = Route;



// var data = new user_collection_1({"username":"hitesh","email":"hitesh08gmail.com","password":"135","phone":"3434124515"});
//     data.save((error) =>{
//         if(!error)
//             { return console.log("saved"); }
//         else{ return console.log(error.message);
//         }});
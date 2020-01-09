const express = require("express");
const con = require("./mysql-connection");
const Router = express.Router();
const joi = require("joi");


module.exports = function(passport){
	Router.post("/login/",(req,res)=>{
  	con.query(`SELECT * FROM user where log_id 	="${req.body.username}" and 	password="${req.body.password}"`,(err, result, fields)=> {
if(err){
	console.log(err); 
	res.send("username or password wrong");	
}

if(result.length>0) 
{
	res.send(result);	
}});
    });

Router.post('/login_',passport.authenticate("local",
{failureRedirect:"/login",
 sucessRedirect:"/profile"}),function(req,res){
res.send("hey");
});


return Router;  
}
const book_details = require("./../../model/mongoose_book");
const express = require("express");
const Route = express.Router();

Route.get("/", (req, res) => {
    book_details.find({"owner_id":req.query.owner_id},{"title":1,"_id":0}).exec((error, result)=>{
        if (!error) 
        {
var list_1 = []
            for(i =0;i<Object.values(result).length;i++)
{list_1.push(Object.values(result)[i]["title"]);}
res.send(list_1);

        }   
    })});

    module.exports = Route;
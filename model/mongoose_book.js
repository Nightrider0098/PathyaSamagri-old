const mongoose = require("./../controller/mongoose_connector", (error) => console.log("got some error"+error));

const user_details_schema = mongoose.Schema({
    book_id: { type: String, required: true },
    title:{type:String,required:true},
    edition:{type:String},
    owner_id:{type:String,required:true},
    publish:{type:String},
    donation_date:{type:Date},
    referred_someone:{type:Boolean,default:0}, // weather someone is already took the details of doner
    available: {type:Boolean,default:1}, //is available at present
    book_subject:{type:String ,enum:["maths","physics","chemistry","electronics","Algorithum"]}
});

module.exports = mongoose.model("Book_Details", user_details_schema);


























// var element_1 = new user_collection({username:"hitesh",email:"htiesh08011999gmail.com",phone:"4545454545",password:"lol"});

// element_1.save((error)=>{
//     if(error){
// if(error.errors['email']){assert.equal(error.errors['email'].message,'not a valid email address!!!');console.log("dft");}

// else if(error.errors['username']){assert.equal(error.errors['username'].message,'Path `username` is required.');}

// else if(error.errors['phone']){assert.equal(error.errors['phone'].message,'not a valid phone number!!!');}
// }
// });   





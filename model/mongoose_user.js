const mongoose = require("./../controller/mongoose_connector", (error) => console.log(error));

const user_details_schema = mongoose.Schema({
    username: { type: String, required: true},
    email: {
        type: String,
        require: true,
        validate:
        {
            validator: function (v) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            }, message: "not a valid email address!!!"
        }
    },
    phone: {
        type: String,
        require: true,
        validate:
        {
            validator: function (v) {
                return /^([\w-]{10})?$/.test(v);
            }
            , message: "not a valid phone number!!!"
        }
    },
    password: String,
    book_issued:Number,

});

module.exports = mongoose.model("User_details", user_details_schema);


























// var element_1 = new user_collection({username:"hitesh",email:"htiesh08011999gmail.com",phone:"4545454545",password:"lol"});

// element_1.save((error)=>{
//     if(error){
// if(error.errors['email']){assert.equal(error.errors['email'].message,'not a valid email address!!!');console.log("dft");}

// else if(error.errors['username']){assert.equal(error.errors['username'].message,'Path `username` is required.');}

// else if(error.errors['phone']){assert.equal(error.errors['phone'].message,'not a valid phone number!!!');}
// }
// });   





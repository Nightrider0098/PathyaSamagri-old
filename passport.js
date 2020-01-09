var LocalStatergy = require('passport-local').Statergy;
const con = require("./mysql-connection");

module.exports  = function(passport)
{
passport.serializeUser((user,done)=>{done(null,user);});

passport.deserializeUser((user,done)=>{done(null,user);});

passport.use(new LocalStratergy(function(username,password,done){

}));
};
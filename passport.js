
const con = require("./mysql/mysql-connection");

module.exports = (passport) => {
    var LocalStrategy = require('passport-local').Strategy;

    passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, function (username, password, done) {
        con.query(`SELECT * FROM user where (username ="${username}" and password="${password}") or (email ="${username}" and 	password="${password}")`, (err, result, fields) => {

            if (err) {
                console.log(err);
                return done(err);
            }

            if (result.length == 0) {

                console.log("failed attempt by user",username);
                
                return done(null, false, { message: "correct password" });

            }
            else {
                console.log("user ",result[0].username,"logged");
                return done(null, result);

            }
        });

    }));

    passport.serializeUser((user, done) => { done(null, user[0].user_id); });
    passport.deserializeUser((id, done) => {
        con.query(`SELECT * FROM user where user_id ="${id}"`, (err, result, fields) => {
            done(null, result);
        });
   })};
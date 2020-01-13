
const con = require("./mysql/mysql-connection");

module.exports = (passport) => {
    var LocalStrategy = require('passport-local').Strategy;

    passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, function (username, password, done) {
        con.query(`SELECT * FROM login where usr_nm ="${username}" and 	pwd="${password}"`, (err, result, fields) => {

            if (err) {
                console.log(err);
                return done(err);
            }

            if (result.length == 0) {
                console.log("not found");
                return done(null, false, { message: "correct password" });

            }
            else {
                console.log("user ",result[0].usr_nm,"logged");
                return done(null, result);

            }
        });

    }));

    passport.serializeUser((user, done) => { done(null, user[0].id); });
    passport.deserializeUser((id, done) => {
        con.query(`SELECT * FROM login where id ="${id}"`, (err, result, fields) => {
            done(null, result);
        });
   })};
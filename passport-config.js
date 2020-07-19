const LocalStrategy = require('passport-local').Strategy
const User = require("./models/userModel")
const bcrypt = require("bcrypt")

function passportInit(passport) {
    let strategy = new LocalStrategy(async (username, password, done) => {
        try {
            let foundUser = await User.findOne({username: username});
            if (!foundUser) {
                return done(null, false, {message: "User Doesn't Exists"});
            } 

            if (!await bcrypt.compare(password, foundUser.password)) {
                return done(null, false,  {message: "Password Incorrect!"});
            }

            return done(null, foundUser, {message: "Welcome, " + foundUser.name});
        } catch (error) {
            return done(error,  {message: "Something Wrong"});
        }
    })

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async function(id, done) {
        try {
            let user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    passport.use(strategy)
}

module.exports = passportInit;
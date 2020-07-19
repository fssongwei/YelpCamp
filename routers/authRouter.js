const express = require('express')
const router = express.Router()
const User = require("../models/userModel")
const middlewares = require("../middlewares")
const bcrypt = require("bcrypt")
const passport = require("passport")


router.get('/auth/register', (req, res) => {
    if (req.isAuthenticated()) return res.redirect("/camps");
    res.render("auth/register");
})

router.post("/auth/register", middlewares.registerVerification, async (req, res) => {
    try {
        let userToBeRegister = req.body.user;
        userToBeRegister.password = await bcrypt.hash(userToBeRegister.password, 10);
        await User.create(userToBeRegister);
        res.redirect("/auth/login");
        console.log("User create success!");
    } catch (error) {
        console.log(error);
    }

})

router.get('/auth/login', (req, res) => {
    if (req.isAuthenticated()) return res.redirect("/camps");
    res.render("auth/login");
})

router.post("/auth/login", 
passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: true,
    successRedirect: "/camps",
    successFlash: true
}))

router.get("/auth/logout", (req, res) => {
    req.logOut();
    req.flash("success", "You have successfully logout!");
    res.redirect("/camps");
})

module.exports = router;
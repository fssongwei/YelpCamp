const User = require("./models/userModel")
const Camp = require("./models/campModel")
const Comment = require("./models/commentModel")


let middlewares = {}

middlewares.registerVerification = async (req, res, next) => {
    try {
        let userToBeRegister = req.body.user;
        if (!userToBeRegister.username || !userToBeRegister.password) {
            req.flash("error", "Illegal username or password for registration");
            res.redirect("/auth/register");
        } else if (await User.findOne({username: req.body.user.username})) {
            req.flash("error", "Username Exists!");
            res.redirect("/auth/register");
        } else {
            req.flash("success", "Register Success!");
            next();
        }
    } catch (error) {
        console.log(error);
    }
}

middlewares.isAuthenticated = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            next();
        } else {
            req.flash("error", "You need to login first");
            res.redirect("/auth/login");
        }
    } catch (error) {
        console.log(error);
    }
}

middlewares.CampAuthorization = async (req, res, next) => {
    try {
        let camp = await Camp.findById(req.params.id).populate("author").exec();
        if (user && camp.author.username === req.user.username) {
            next();
        } else {
            req.flash("error", "You are not allow to edit this camp");
            res.redirect("/camps/" + req.params.id);
        }
    } catch (error) {
        console.log(error);
    }
}

middlewares.CommentAuthorization = async (req, res, next) => {
    try {
        let comment = await Comment.findById(req.params.commentID).populate("author").exec();
        if (user && comment.author.username === req.user.username) {
            next();
        } else {
            req.flash("error", "You are not allow to edit this comment");
            res.redirect("/camps/" + req.params.campID);
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = middlewares;
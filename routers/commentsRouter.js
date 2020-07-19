const express = require('express')
const router = express.Router()
const Camp = require("../models/campModel")
const Comment = require("../models/commentModel")
const middlewares = require("../middlewares")

// Comment Create

router.post("/camps/:id/comments", middlewares.isAuthenticated, async (req, res) => {
    try {
        let comment = await Comment.create({author: req.user, text: req.body.comment});
        let camp = await Camp.findById(req.params.id);
        await camp.comments.push(comment);
        await camp.save();
        req.flash("success", "Comment Posted!");
        res.redirect("/camps/" + req.params.id);
    } catch (error) {
        req.flash("error", "Oops~ There is an error.");
        console.log(error);
        res.redirect("/camps/" + req.params.id);
    }
})

// Comment Delete
router.delete("/camps/:campID/comments/:commentID", middlewares.isAuthenticated, middlewares.CommentAuthorization, async (req, res) => {
    try {
        await Comment.findByIdAndRemove(req.params.commentID);
        let camp = await Camp.findById(req.params.campID);
        await camp.comments.pull(req.params.commentID);
        await camp.save();
        req.flash("success", "Comment Delete!");
        res.redirect("/camps/" + req.params.campID);
    } catch (error) {
        req.flash("error", "Oops~ There is an error.");
        console.log(error);
        res.redirect("/camps/" + req.params.campID);
    }
})

module.exports = router;
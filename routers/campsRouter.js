let express = require('express')
let router = express.Router()
let Camp = require("../models/campModel")
let Comment = require("../models/commentModel")
let middlewares = require("../middlewares")

router.get("/camps", (req, res) => {
    Camp.find({}, (err, camps) => {
        if (err) {
            console.log(err);
        } else {
            res.render("camps/camps", {camps: camps});
        }
    });
});

// New
router.get("/camps/new", middlewares.isAuthenticated, (req, res) => {
    res.render("camps/new");
});


// Create
router.post("/camps", middlewares.isAuthenticated, async (req, res) => {
    try {
        let camp = req.body.camp;
        camp.author = req.user;
        campAutoComplete(camp);
        await Camp.create(camp);
        req.flash("success", "Camp Created!");
        res.redirect("camps");
    } catch (error) {
        req.flash("error", "Oops~ There is an error: " + error);
        console.log(error);
        res.redirect("/camps/");
    }
});

// Show
router.get("/camps/:id", async (req, res) => {
    try {
        let camp = await Camp.findById(req.params.id).populate("author").populate({ path: "comments", populate: { path: "author" } }).exec();
        res.render("camps/camp", {camp: camp});
    } catch (error) {
        req.flash("error", "Oops~ There is an error: " + error);
        console.log(error);
        res.redirect("/camps");
    }
})

// Edit
router.get("/camps/:id/edit", middlewares.isAuthenticated, middlewares.CampAuthorization, async (req, res) => {
    try {
        let camp = await Camp.findById(req.params.id);
        res.render("camps/edit", {camp: camp});
    } catch (error) {
        req.flash("error", "Oops~ There is an error: " + error);
        console.log(error);
        res.redirect("/camps/" + req.params.id);
    }
})

// Put
router.put("/camps/:id", middlewares.isAuthenticated, middlewares.CampAuthorization, async (req, res) => {
    try {
        campAutoComplete(req.body.camp);
        await Camp.findByIdAndUpdate(req.params.id, req.body.camp);
        req.flash("success", "Camp Updated!");
        res.redirect("/camps/" + req.params.id);
    } catch (error) {
        req.flash("error", "Oops~ There is an error: " + error);
        console.log(error);
        res.redirect("/camps/" + req.params.id);
    }
});

// Delete
router.delete("/camps/:id", middlewares.isAuthenticated, middlewares.CampAuthorization, async (req, res) => {
    try {
        let camp = await Camp.findById(req.params.id).populate("comments").exec();
        for (comment of camp.comments) {
            await Comment.findByIdAndDelete(comment._id);
        }
        await Camp.findByIdAndDelete(camp._id);
        req.flash("success", "Camp Deleted!");
        res.redirect("/");
    } catch (error) {
        req.flash("error", "Oops~ There is an error: " + error);
        console.log(error);
        res.redirect("/");
    }
});

function campAutoComplete(camp) {
    if (!camp.contact) camp.contact = "Contact Not Avaliable";
    if (!camp.intro) camp.intro = "No introduction of this camp. If you are the owner, feel free to create a new one by yourself."
    if (!camp.time) camp.time = "Opening Time Not Avaliable";
    if (!camp.price) camp.price = "Price Not Avaliable";
    if (!camp.address) camp.address = "Address Not Avaliable";
    if (!camp.image) camp.image = "https://steemitimages.com/640x0/https://img.esteem.ws/12glo6ebvl.jpg";
}

module.exports = router;
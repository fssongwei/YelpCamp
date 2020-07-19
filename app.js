if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const expressSanitizer = require("express-sanitizer")
const flash = require("express-flash")
const session = require("express-session")
const passport = require("passport")

const Camp = require("./models/campModel")
const Comment = require("./models/commentModel")
const User = require("./models/userModel")
const passportInit = require("./passport-config")

const authRouter = require("./routers/authRouter");
const campsRouter = require("./routers/campsRouter");
const commentsRouter = require("./routers/commentsRouter");

app.set("view engine", "ejs");
mongoose.set('useFindAndModify', false);

// Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

const moment = require('moment');
app.locals.dateFormator = function(date) {
    let daysFromNow = (Date.now() - date.getTime()) / (1000 * 3600 * 24); 
    if (daysFromNow > 7) {
        return moment(date).format("YYYY/MM/DD");
    } else if (daysFromNow < 1) {
        return moment(date).startOf('hour').fromNow();  
    } else return moment(date).startOf('day').fromNow();  
}

// Authentication
passportInit(passport);

// Database
mongoose.connect('mongodb://localhost/YelpCamp', { useNewUrlParser: true, useUnifiedTopology: true});

// Seed Database (comment out if in production enviroment)
if (process.env.NODE_ENV !== "production") {
    const seedDB =  require("./seeds")
    seedDB();
}

// Routers
app.use(authRouter);
app.use(campsRouter);
app.use(commentsRouter);

// Index
app.get("/", (req, res) => {
    res.redirect("/camps");
})

// Listener
app.listen(process.env.PORT, () => {
    console.log("server start on port " + process.env.PORT);
})
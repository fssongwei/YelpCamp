const mongoose = require("mongoose");

// schema
const userSchema = new mongoose.Schema({  
    username: String,  
    password: String,
    name: String
});

// model
let User = mongoose.model('User', userSchema);

module.exports = User;


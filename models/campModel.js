const mongoose = require("mongoose");

// schema
const campSchema = new mongoose.Schema({  
    name:           String,  
    intro:          String,  
    address:        String,
    image:          String,
    comments:       [{type: mongoose.Types.ObjectId, ref: "Comment"}],
    date:           {type: Date, default: Date.now},
    author:         {type: mongoose.Types.ObjectId, ref: "User"},
    contact:        String,
    time:           String,
    price:          String,
    rating:         Number,
    ratingNums:     Number,
});

// model
let Camp = mongoose.model('Camp', campSchema);

module.exports = Camp;


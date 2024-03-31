const mongoose = require("mongoose");
const { Schema } = mongoose;


const reviewSchmea = new Schema({
    review: {
        type: String,
        required: [true, 'Review must there']
    },
    rating: {
        type: Number,
        required: [true, 'Rating must be there']
    }
});

const Review = mongoose.model("Review", reviewSchmea)
module.exports = Review; 
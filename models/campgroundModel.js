const mongoose = require('mongoose');
const { Schema }  = mongoose;

// Constrct Schema for campground Model.
const campgroundSchmea = new Schema({
    title: String,
    location: String,
});


const Campground = mongoose.model('Campground', campgroundSchmea);
module.exports = Campground;

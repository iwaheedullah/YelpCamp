const mongoose = require('mongoose');
const reviewModel = require("./reviewModel");
const { Schema }  = mongoose;

// Constrct Schema for campground Model.
const campgroundSchmea = new Schema({
    title: {
        type: String,
        required: [true, 'title must there']
    },
    location: {
        type: String,
        required: [true, 'Location must be provided']
    },
    price: {
        type: Number,
        required: [true, 'Price must be greater than 0']
    },
    reviews: [
        {
            type: Schema.Types.ObjectId, 
            ref: 'Review',
        }
    ]
    
});

campgroundSchmea.post("findOneAndDelete", async function(data) {
    if (data) {
        await reviewModel.deleteMany({
            _id: {
                $in: data.reviews
            }
        })
    }

});


const Campground = mongoose.model('Campground', campgroundSchmea);
module.exports = Campground;

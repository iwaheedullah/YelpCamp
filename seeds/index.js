const mongoose = require("mongoose");

const campgroundModel = require("../models/campgroundModel");
const cities = require("./cities");
const {descriptors, places} = require("./seedHelpers");


mongoose.connect("mongodb://127.0.0.1:27017/Campground")
.then(() => {
    console.log("Mongo DB Connected in Seeds Campground.");
}, (err) => {
    console.log("Error in Mongo DB Connection", err);
})


// Get random Element from an Array.
const arrayElement = array => array[Math.floor(Math.random() * array.length)];


const insertData = async function(cities, places, descriptors) {
    // Delete all previous records.
    await campgroundModel.deleteMany({});
    
    for (let i = 1; i <= 10; i++) {

        // Get random index for Cities Array.
        const citiesIndex = Math.floor(Math.random() * 1000) + 1;
    
        const newCampground = new campgroundModel({
            title: `${arrayElement(descriptors)} ${arrayElement(places)}`,
            location: `${cities[citiesIndex].city} ${cities[citiesIndex].state}`,
            price: `${Math.floor(Math.random() * 5) + 1}`,
        });

        await newCampground.save();
    }
};

insertData(cities, places, descriptors)
.then(() => {
    console.log("Data is inserted succesfully!");
    mongoose.connection.close();
})
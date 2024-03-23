const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const methodOverride = require('method-override');

// Import Models
const Campground = require('./models/campgroundModel');

// Mongo DB Connection.
mongoose.connect('mongodb://127.0.0.1:27017/Campground')
.then(() => {
    console.log("Mongo DB is connected for Campground");
}, (error) => {
    console.log("Sorry, Error in Mongo DB Connection for Campground");
});

const app = express();

// Setting view engine template to EJS.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parsing data.
app.use(express.urlencoded({ extended: true }));

// Method Override for others verbs of request methods (Put, Delete)
app.use(methodOverride('_method'));


// Routes..
app.get('/', (req, res) => {
    res.send("Home Page");
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('index', { campgrounds });
});

app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect("/campgrounds");
});

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("edit", { campground });
});

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
});

app.all("*", (req, res) => {
    res.send("Sorry, Not found");
})

// App listening.
app.listen(3000, () => {
    console.log("App is listening on port 3000.");
})
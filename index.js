const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");

// Schemas 
const { campgroundSchema, reviewSchema } = require("./schemas");
// Import Models
const Campground = require('./models/campgroundModel');
const Review = require("./models/reviewModel");

// Utils
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");

// Mongo DB Connection.
mongoose.connect('mongodb://127.0.0.1:27017/Campground')
.then(() => {
    console.log("Mongo DB is connected for Campground");
}, (error) => {
    console.log("Sorry, Error in Mongo DB Connection for Campground");
});

const app = express();

// Setting view engine template to EJS.
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parsing data.
app.use(express.urlencoded({ extended: true }));

// Method Override for others verbs of request methods (Put, Delete)
app.use(methodOverride('_method'));

// Middleware Function
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if ( error ) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// Routes..
// Campground Routes...
app.get('/', (req, res) => {
    res.send("Home Page");
});

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { title : 'All Campgrounds', campgrounds });
}));

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new', {title: "New Campground"});
});

app.post('/campgrounds',  catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect("/campgrounds");
}));

app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground) {
        throw new ExpressError("Not Found Campground", 400);
    }
    res.render("campgrounds/show", { title: "Show Campground", campground });
}));

app.get("/campgrounds/:id/edit", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { title: "Edit Campground", campground });
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true });
    res.redirect(`/campgrounds/${id}`);
}));

app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}));

app.post('/campgrounds/:id/review', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // console.log(campground);
    const review = new Review(req.body.review);
    // console.log(review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/${id}`)
}));

app.delete('/campgrounds/:id/review/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

// Error Handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render('error', { title : 'Error in YelpCamp', err});
});

// App listening.
app.listen(3000, () => {
    console.log("App is listening on port 3000.");
})
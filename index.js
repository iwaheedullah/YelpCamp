const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");

// Utils
const ExpressError = require("./utils/ExpressError");
// Routes
const campgroundsRouter = require("./routes/campgroundRoutes");
const reviewRouter = require('./routes/reviewRoutes');

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


app.get('/', (req, res) => {
    res.send("Home Page");
});

// Routes..
app.use('/campgrounds', campgroundsRouter);
app.use('/campgrounds/:id/review', reviewRouter);

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
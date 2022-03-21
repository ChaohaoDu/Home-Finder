const {houseSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const House = require('./models/house');
const Review = require('./models/review');


module.exports.isLoggedIn = (req, res, next) => {
    // console.log("REQ.USER-----", req.user)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in first');
        return res.redirect('/login');
    }
    next();
}


module.exports.validateHouse = (req, res, next) => {
    const {error} = houseSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthorized = async (req, res, next) => {
    const {id} = req.params;
    const house = await House.findById(id);
    if (!house.author.equals(req.user._id)) {
        req.flash('error', 'you do not have permission');
        res.redirect(`/houses/${id}`);
    } else {
        next();
    }
}


module.exports.isReviewAuthorized = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'you do not have permission');
        res.redirect(`/houses/${id}`);
    } else {
        next();
    }
}


module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

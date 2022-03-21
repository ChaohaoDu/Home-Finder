const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const houses = require('../controllers/houses')
const {isLoggedIn, isAuthorized, validateHouse} = require('../middleware');
const multer = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({storage});


router.route('/')
    .get(catchAsync(houses.index))
    .post(isLoggedIn, upload.array('image'), validateHouse, catchAsync(houses.createHouse))


// router.get('/new', isLoggedIn, houses.renderNewForm)
router.get('/new', houses.renderNewForm)

router.route('/:id')
    .get(catchAsync(houses.showHouse))
    .put(isLoggedIn, isAuthorized, upload.array('image'), validateHouse, catchAsync(houses.updateHouse))
    .delete(isLoggedIn, isAuthorized, catchAsync(houses.deleteHouse));


router.get('/:id/edit', isLoggedIn, isAuthorized, catchAsync(houses.renderEditForm))


module.exports = router;
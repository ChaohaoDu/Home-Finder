const House = require('../models/house');
const {cloudinary} = require('../cloudinary');


module.exports.index = async (req, res) => {
    const condition = req.query.search;
    let houses;
    if (condition) {
        const regex = new RegExp(escape(condition), "i");
        houses = await House.find({
            $or: [{title: regex}, {location: regex}]
        });
    } else {
        houses = await House.find({});
    }
    if (houses.length != 0) {
        res.render('houses/index', {houses})
    } else{
        res.render('houses/nothingFound')
    }
}

module.exports.renderNewForm = (req, res) => {
    res.render('houses/new');
}


module.exports.createHouse = async (req, res) => {
    const house = new House(req.body.house);
    house.images = req.files.map(file => ({url: file.path, filename: file.filename}))
    house.author = req.user._id;
    await house.save();
    req.flash('success', 'Successfully made a new house!');
    res.redirect(`/houses/${house._id}`)
}

module.exports.showHouse = async (req, res) => {
    const house = await House.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(house)
    if (!house) {
        req.flash('error', 'Cannot find that house!');
        res.redirect('/houses');
    } else {
        res.render('houses/show', {house});
    }
}


module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const house = await House.findById(id);
    if (!house) {
        req.flash('error', 'Cannot find that house');
        res.redirect('/houses');
    } else {
        res.render('houses/edit', {house});
    }
}

module.exports.updateHouse = async (req, res) => {
    const {id} = req.params;
    // console.log(req.body);
    const imgs = req.files.map(file => ({url: file.path, filename: file.filename}));
    const house = await House.findByIdAndUpdate(id, {...req.body.house});
    house.images.push(...imgs);
    await house.save();

    // delete images
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        // pull out the images that filename is mentioned in req.body.deletedImages
        await house.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success', 'Successfully updated house');
    res.redirect(`/houses/${house._id}`)
};


module.exports.deleteHouse = async (req, res) => {
    const {id} = req.params;
    await House.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted review');
    res.redirect('/houses');
}
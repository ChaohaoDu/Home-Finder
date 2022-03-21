const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/house');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '60ecd0b5c5d21bbb29d43975',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/chaohaodu/image/upload/v1627602616/YelpCamp/Unknown-1_h7mg0n.jpg',
                    filename: 'elpCamp/Unknown-1_h7mg0n'
                },
                {
                    url: 'https://res.cloudinary.com/chaohaodu/image/upload/v1627602617/YelpCamp/Unknown-3_o7ktvr.jpg',
                    filename: 'YelpCamp/Unknown-3_o7ktvr'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,

        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
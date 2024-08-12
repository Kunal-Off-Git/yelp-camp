const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campgrounds.js");
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      author: "66b5d37b4e06c52827afcbb6",
      title: `${sample(descriptors)} ${sample(places)}`,
      price: price,
      description: "New campground for camping",
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dnyiakja9/image/upload/v1723296785/Yelpcamp/fydwiaqx0bahtv723maj.jpg",
          filename: "Yelpcamp/fydwiaqx0bahtv723maj",
        },
        {
          url: "https://res.cloudinary.com/dnyiakja9/image/upload/v1723296785/Yelpcamp/rs8ok4f9mla0a7nihiqu.jpg",
          filename: "Yelpcamp/rs8ok4f9mla0a7nihiqu",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});

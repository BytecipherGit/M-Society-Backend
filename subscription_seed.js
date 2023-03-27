const mongoose = require("mongoose");
const subscription = require("./models/subscription");
require("dotenv").config();
// const bcrypt = require("bcrypt");
mongoose.set('strictQuery', false);

mongoose
    .connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB", err));

// let password = bcrypt.hash("1234", 10);
// console.log(password);
const seedAdmin = [
    {
        name: "Free",
        price: 00,
        duration: "365 Days",
        status: "active",
    },
    {
        name: "Paid Monthly",
        price: 100,
        duration: "28 Days",
        status: "active",
    },
      {
        name: "Paid Yearly",
        price: 1000,
        duration: "365 Days",
        status: "active",
    }
];

const seedDb = async () => {
    await subscription.deleteMany({});
    await subscription.insertMany(seedAdmin);
};

seedDb().then(() => {
    mongoose.connection.close();
});
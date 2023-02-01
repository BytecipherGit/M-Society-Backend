const mongoose = require("mongoose");
const Profession = require("./models/profession");
require("dotenv").config();
// const bcrypt = require("bcrypt");
mongoose.set('strictQuery', false);

mongoose
    .connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB", err));

const seedAdmin = [
    { name: "Vegetable Seller" },
    { name: "Electrician" },
    { name: "Furniture Maker" },
    { name: "Painter" },
    { name: "Plumber" },
    { name: "Bakery" },
    { name: "Baby Sitter" },
    { name: "Nurse" },
    { name: "House Maid" },
    { name: "Water Tanker" },
    { name: "Grocer" },
    { name: "Tiffin Delivery" },
    { name: "Police Number" },
    { name: "Delivery boy" },
    { name: "Fire Extinguisher Number" },
    { name: "Ambulance Number" },
    { name: "Home Tutor" },
    { name: "Carpenter" }, 
    { name: "Gardener" }, 
];

const seedDb = async () => {
    await Profession.deleteMany({});
    await Profession.insertMany(seedAdmin);
};

seedDb().then(() => {
    mongoose.connection.close();
});
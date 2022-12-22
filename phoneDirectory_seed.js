const mongoose = require("mongoose");
const phoneBook = require("./models/phoneDirectory");
require("dotenv").config();
mongoose.set('strictQuery', false);

mongoose
    .connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB", err));


const seedAdmin = [
    {
        name: "Yash",
        address: "Palasiya",
        phoneNumber: "1234567891",
        profession: "Electrician",
        status: "active",
        societyAdminId:"63a2b4d58d613473d9bbcf59",
        societyId:"63a2b4d58d613473d9bbcf57"
    },
    {
        name: "Dipak",
        address: "Bangali Square",
        phoneNumber: "1234567892",
        profession: "Emergency Number",
        status: "active",
        societyAdminId: "63a2b4d58d613473d9bbcf59",
        societyId: "63a2b4d58d613473d9bbcf57"
    },
    {
        name: "Ram",
        address: "Mahu Naka",
        phoneNumber: "1234567893",
        profession: "Painter",
        status: "active",
        societyAdminId: "63a2b4d58d613473d9bbcf59",
        societyId: "63a2b4d58d613473d9bbcf57"
    },
    {
        name: "Ramu",
        address: "Hawa Bangla",
        phoneNumber: "1234567894",
        profession: "Plumber",
        status: "active",
        societyAdminId: "63a2b4d58d613473d9bbcf59",
        societyId: "63a2b4d58d613473d9bbcf57"
    },
    {
        name: "Aditay",
        address: "Juni Indore",
        phoneNumber: "1234567895",
        profession: "Police Number",
        status: "active",
        societyAdminId: "63a2b4d58d613473d9bbcf59",
        societyId: "63a2b4d58d613473d9bbcf57"
    },
];

const seedDb = async () => {
    await phoneBook.deleteMany({});
    await phoneBook.insertMany(seedAdmin);
};

seedDb().then(() => {
    mongoose.connection.close();
});
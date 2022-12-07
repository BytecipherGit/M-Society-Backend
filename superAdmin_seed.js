const mongoose = require("mongoose");
const admin = require("./models/superAdmin");
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
        name: "admin",
        email: "admin@gmail.com",
        password: "1234",
        status: "active"
    }
];

const seedDb = async () => {
    await admin.deleteMany({});
    await admin.insertMany(seedAdmin);
};

seedDb().then(() => {
    mongoose.connection.close();
});
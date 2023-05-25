const mongoose = require("mongoose");
const designation = require("./models/designation");
require("dotenv").config();
mongoose.set('strictQuery', false);

mongoose
    .connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB", err));

const seedAdmin = [
    {
        name: "Sub Admin",
        status: "active"
    },
    {
        name: "User",
        status: "active"
    },
];

const seedDb = async () => {
    await designation.deleteMany({});
    await designation.insertMany(seedAdmin);
};

seedDb().then(() => {
    mongoose.connection.close();
});

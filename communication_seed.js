const mongoose = require("mongoose");
const Communication = require("./models/commsStg");
require("dotenv").config();
// const bcrypt = require("bcrypt");
mongoose.set('strictQuery', false);

mongoose
    .connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB", err));

// let password = bcrypt.hash("1234", 10);
// console.log(password);
const seedcomunication = [
    {
        paymentRemainderBeforedays: 7
    }
];

const seedDb = async () => {
    await Communication.deleteMany({});
    await Communication.insertMany(seedcomunication);
};

seedDb().then(() => {
    mongoose.connection.close();
});
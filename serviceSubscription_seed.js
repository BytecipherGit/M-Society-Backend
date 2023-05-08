const mongoose = require("mongoose");
const subscription = require("./models/serviceSubscription");
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
        price: 0,
        duration: 7,
        status: "active",
        type: 'free',
        razoPlanId: "",
        suport: { email: true, chat: true, contact: true }
    },
    {
        name: "Paid Monthly",
        price: 100,
        duration: 28,
        status: "active",
        type: 'paid',
        razoPlanId: "plan_LcTykKtnFEZPw8",
        suport: { email: true, chat: true, contact: true }
    },
    {
        name: "Paid Three Monthly",
        price: 250,
        duration: 84,
        status: "active",
        type: 'paid',
        razoPlanId: "plan_LcU40o5PXBtT0U",
        suport: { email: true, chat: true, contact: true }
    },
    {
        name: "Paid Six Monthly",
        price: 500,
        duration: 168,
        status: "active",
        type: 'paid',
        razoPlanId: "plan_LcU5vsrD7HU3h4",
        suport: { email: true, chat: true, contact: true }
    },
    {
        name: "Paid Yearly",
        price: 1000,
        duration: 365,
        status: "active",
        type: 'paid',
        razoPlanId: "plan_LcU7OkWtlLrjtV",
        suport: { email: true, chat: true, contact: true }
    }
];

const seedDb = async () => {
    await subscription.deleteMany({});
    await subscription.insertMany(seedAdmin);
};

seedDb().then(() => {
    mongoose.connection.close();
});
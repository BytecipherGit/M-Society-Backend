const mongoose = require("mongoose");
const subscription = require("./models/subscription");
require("dotenv").config();
mongoose.set('strictQuery', false);

mongoose
    .connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB", err));

const seedAdmin = [
    {
        name: "Free",
        price: 0,
        duration: 7,
        status: "active",
        type: 'free',
        razoPlanId: "",
        support: { email: true, chat: false, contact: false }
    },
    {
        name: "Monthly",
        price: 100,
        duration: 28,
        status: "active",
        type: 'paid',
        razoPlanId: "plan_LcTykKtnFEZPw8",
        support: { email: true, chat: true, contact: true }
    },
    {
        name: "Quarterly",
        price: 250,
        duration: 84,
        status: "active",
        type: 'paid',
        razoPlanId: "plan_LcU40o5PXBtT0U",
        support: { email: true, chat: true, contact: true }
    },
    {
        name: "Yearly",
        price: 1000,
        duration: 365,
        status: "active",
        type: 'paid',
        razoPlanId: "plan_LcU7OkWtlLrjtV",
        support: { email: true, chat: true, contact: true }
    }
];

const seedDb = async () => {
    await subscription.deleteMany({});
    await subscription.insertMany(seedAdmin);
};

seedDb().then(() => {
    mongoose.connection.close();
});
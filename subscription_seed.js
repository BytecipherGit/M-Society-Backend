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
        price: 0,
        duration: 7,
        status: "active",
        type: 'free',
        razoPlanId: "",
        support: { email: true, chat: false, contact: false }
    },
    {
        name: "Paid Monthly",
        price: 100,
        duration: 28,
        status: "active",
        type: 'paid',
        razoPlanId: "plan_LcTykKtnFEZPw8",
        support: { email: true, chat: true, contact: true }
        // razoPlanId: "plan_LcUXyZSmklVFia"//for 7days 
        //subId:"sub_LcUfGDuS1Kv6t9"
        //phone number 2222222222
        //paymentId 
    },
    {
        name: "Paid Three Monthly",
        price: 250,
        duration: 84,
        status: "active",
        type: 'paid',
        razoPlanId: "plan_LcU40o5PXBtT0U",
        support: { email: true, chat: true, contact: true }
        // razoPlanId: "plan_LcUYGgSHRDl5lo"//for 8days 
        //subId:"sub_LcUfaiL9Wa3y2f"
        //phone number 2222222222
        //paymentId "pay_LcUvipcpmCA8Hx" 
    },
    {
        name: "Paid Six Monthly",
        price: 500,
        duration: 168,
        status: "active",
        type: 'paid',
        razoPlanId: "plan_LcU5vsrD7HU3h4",
        support: { email: true, chat: true, contact: true }
        // razoPlanId: "plan_LcUYWp9DZS7jZn"//for 9days 
        //subId:"sub_LcUfu5vUBWDXgE"
        //phone number 3333
        //paymentId pay_LcV0a9Kd0Yh2va
    },
    {
        name: "Paid Yearly",
        price: 1000,
        duration: 365,
        status: "active",
        type: 'paid',
        razoPlanId: "plan_LcU7OkWtlLrjtV",
        support: { email: true, chat: true, contact: true }
        // razoPlanId: "plan_LcUYojt1EY0fhG"//for 10days 
        //subId:"sub_LcUhFTr7jB80h2"
        //phone number 444
        //paymentId pay_LcV3U7thf43dQC
    }
];

const seedDb = async () => {
    await subscription.deleteMany({});
    await subscription.insertMany(seedAdmin);
};

seedDb().then(() => {
    mongoose.connection.close();
});
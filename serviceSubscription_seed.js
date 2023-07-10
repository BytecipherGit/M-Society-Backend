const mongoose = require("mongoose");
const subscription = require("./models/serviceSubscription");
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
        suport: { email: true, chat: true, contact: true },
        cityCount:"-1",
        societyCount:"-1"
    }
];

const seedDb = async () => {
    await subscription.deleteMany({});
    await subscription.insertMany(seedAdmin);
};

seedDb().then(() => {
    mongoose.connection.close();
});
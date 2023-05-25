const mongoose = require("mongoose");
const admin = require("./models/superAdmin");
require("dotenv").config();
mongoose.set('strictQuery', false);

mongoose
    .connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB", err));

const seedAdmin = [
    {
        name: "jaya",
        email: "darwadedaya882@gmail.com",
        password: "$2a$10$0whhO48P2qqLALxraJD6k.KGEsONQR6V1fLF5JWQCtUPqpszOKOdK",
        status: "active",
        verifyOtp: "1"
    },
    {
        name: "Admin",
        email: "admin@gmail.com",
        password: "$2a$10$0whhO48P2qqLALxraJD6k.KGEsONQR6V1fLF5JWQCtUPqpszOKOdK",
        status: "active",
        verifyOtp: "1"
    }
];

const seedDb = async () => {
    await admin.deleteMany({});
    await admin.insertMany(seedAdmin);
};

seedDb().then(() => {
    mongoose.connection.close();
});
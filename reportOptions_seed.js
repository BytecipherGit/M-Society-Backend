const mongoose = require("mongoose");
const report = require("./models/reportOption");
require("dotenv").config();
mongoose.set('strictQuery', false);

mongoose
    .connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB", err));

const seedAdmin = [
    { name: "SPoor service quality or unmet expectations" },
    { name: "Unprofessional behavior or disrespect" },
    { name: "Late or no - show for scheduled service" },
    { name: "Misconduct, harassment, or feeling unsafe" },
    { name: "Communication problems with provider" },
    { name: "False information or misleading claims" },
    { name: "Billing / payment issues or unauthorized charges" },
    { name: "Privacy concerns or data security" }
];

const seedDb = async () => {
    await report.deleteMany({});
    await report.insertMany(seedAdmin);
};

seedDb().then(() => {
    mongoose.connection.close();
});

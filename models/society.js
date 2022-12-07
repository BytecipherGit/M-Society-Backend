const mongoose = require("mongoose");
const SocietySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    registrationNumber: {
        type: String,
        require: true,
    },
    uniqueId: {
        type: String,
        require: true,
    },
    pin: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        enum: ["active", "Inactive"],
        default: "Inactive",
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
});

const Society = mongoose.model("societys", SocietySchema);

module.exports = Society;
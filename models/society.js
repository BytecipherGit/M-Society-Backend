const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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
        enum: ["active", "inactive"],
        default: "inactive",
    },
    isDeleted: {
        type: Boolean,
        default: false,
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

const Society = mongoose.model("msociety_societys", SocietySchema);

module.exports = Society;
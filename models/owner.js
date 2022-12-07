const mongoose = require("mongoose");
const ownerSchema = new mongoose.Schema({
    name: {
        type: String,
        // require: true,
    },
    email: {
        type: String,
        // unique: true,
    },
    phoneNumber: {
        type: String,
        // require: true,
    },
    residentialUserId: {
        type: String,
        // require: true,
    },
    address: {
        type: String,
        // require: true,
    },
    societyId: {
        type: String,
        // require: true,
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

const owner = mongoose.model("owners", ownerSchema);

module.exports = owner;


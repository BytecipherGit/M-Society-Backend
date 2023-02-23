const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const phoneDirectorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        // require: true,
    },
    phoneNumber: {
        type: String,
        require: true,
        // unique: true,
    },
    profession: {
        type: String,
        require: true,
    },
    societyAdminId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_residentialusers",
        require: true,
    },
    societyId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_societys",
        require: true,
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
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
    countryCode: {
        type: String,
    },
});

const phoneDirectory = mongoose.model("msociety_phonedirectorys", phoneDirectorySchema);

module.exports = phoneDirectory;


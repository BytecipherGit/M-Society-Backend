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
    societyAdimId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_residentialusers"
    },
    subscriptionId: {
        type: Schema.Types.ObjectId,
        ref: "msociety_SocietySubscriptions"
    },
    subscriptionType: {
        type: String
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number,
    },
    images: {
        type: Array,
    },
    logo: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
        default: null,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
    isVerify: {
        type: Boolean,
        default: true
    },
    verifyDate: {
        type: Date,
        null: true,
        default: Date.now,
    },
    primaryColour: {
        type: String,
        default: "#0182c1",
    },
    secondaryColour: {
        type: String,
        default: "#ffffff",
    },
    bgColour: {
        type: String,
        default: "#ffffff",
    },
    fontColour: {
        type: String,
        default: "#000000",
    },
});

const Society = mongoose.model("msociety_societys", SocietySchema);

module.exports = Society;